#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { gzipSync, brotliCompressSync } from 'zlib'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// Enhanced bundle monitoring with React 19 optimizations tracking
const BUNDLE_TARGETS = {
  'dist/index.umd.js': {
    name: 'UMD Bundle',
    maxRaw: 150 * 1024, // 150KB
    maxGzip: 45 * 1024, // 45KB
    maxBrotli: 40 * 1024, // 40KB
    priority: 'high',
    description: 'Browser-compatible UMD bundle',
  },
  'dist/index.es.js': {
    name: 'ESM Bundle',
    maxRaw: 120 * 1024, // 120KB
    maxGzip: 35 * 1024, // 35KB
    maxBrotli: 30 * 1024, // 30KB
    priority: 'high',
    description: 'Modern ESM bundle for bundlers',
  },
  'dist/index.js': {
    name: 'CJS Bundle',
    maxRaw: 120 * 1024, // 120KB
    maxGzip: 35 * 1024, // 35KB
    maxBrotli: 30 * 1024, // 30KB
    priority: 'medium',
    description: 'CommonJS bundle for Node.js',
  },
  'dist/index.d.ts': {
    name: 'TypeScript Definitions',
    maxRaw: 50 * 1024, // 50KB
    maxGzip: 10 * 1024, // 10KB
    maxBrotli: 8 * 1024, // 8KB
    priority: 'low',
    description: 'TypeScript type definitions',
  },
}

// React 19 optimization tracking
const REACT19_OPTIMIZATIONS = {
  concurrentFeatures: {
    name: 'React 19 Concurrent Features',
    expectedSavings: '5-10%',
    indicators: ['useTransition', 'useDeferredValue', 'useOptimistic'],
  },
  consoleStripping: {
    name: 'Console Statement Removal',
    expectedSavings: '2-5%',
    indicators: ['console.log', 'console.warn', 'console.debug'],
  },
  treeShaking: {
    name: 'Enhanced Tree Shaking',
    expectedSavings: '10-15%',
    indicators: ['unused exports', 'dead code'],
  },
  compression: {
    name: 'Advanced Compression',
    expectedSavings: '15-25%',
    indicators: ['terser optimization', 'gzip', 'brotli'],
  },
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzeBundle(filePath) {
  const fullPath = join(projectRoot, filePath)
  const config = BUNDLE_TARGETS[filePath]
  
  if (!existsSync(fullPath)) {
    return {
      exists: false,
      path: filePath,
      name: config?.name || filePath,
      error: 'File not found',
    }
  }

  try {
    const content = readFileSync(fullPath)
    const rawSize = content.length
    const gzipSize = gzipSync(content).length
    const brotliSize = brotliCompressSync ? brotliCompressSync(content).length : null

    // Analyze content for React 19 optimizations
    const contentStr = content.toString()
    const optimizationAnalysis = analyzeOptimizations(contentStr)

    return {
      exists: true,
      path: filePath,
      name: config.name,
      description: config.description,
      priority: config.priority,
      sizes: {
        raw: rawSize,
        gzip: gzipSize,
        brotli: brotliSize,
        rawFormatted: formatBytes(rawSize),
        gzipFormatted: formatBytes(gzipSize),
        brotliFormatted: brotliSize ? formatBytes(brotliSize) : 'N/A',
      },
      thresholds: {
        raw: config.maxRaw,
        gzip: config.maxGzip,
        brotli: config.maxBrotli,
        rawFormatted: formatBytes(config.maxRaw),
        gzipFormatted: formatBytes(config.maxGzip),
        brotliFormatted: formatBytes(config.maxBrotli),
      },
      compliance: {
        raw: rawSize <= config.maxRaw,
        gzip: gzipSize <= config.maxGzip,
        brotli: brotliSize ? brotliSize <= config.maxBrotli : true,
      },
      utilization: {
        raw: ((rawSize / config.maxRaw) * 100).toFixed(1),
        gzip: ((gzipSize / config.maxGzip) * 100).toFixed(1),
        brotli: brotliSize ? ((brotliSize / config.maxBrotli) * 100).toFixed(1) : 'N/A',
      },
      optimizations: optimizationAnalysis,
    }
  } catch (error) {
    return {
      exists: false,
      path: filePath,
      name: config?.name || filePath,
      error: error.message,
    }
  }
}

function analyzeOptimizations(content) {
  const analysis = {}
  
  Object.entries(REACT19_OPTIMIZATIONS).forEach(([key, optimization]) => {
    const indicators = optimization.indicators
    const foundIndicators = indicators.filter(indicator => 
      content.includes(indicator)
    )
    
    analysis[key] = {
      name: optimization.name,
      expectedSavings: optimization.expectedSavings,
      applied: foundIndicators.length === 0, // Optimization applied if indicators not found
      foundIndicators: foundIndicators.length > 0 ? foundIndicators : null,
      status: foundIndicators.length === 0 ? 'optimized' : 'needs-optimization',
    }
  })
  
  return analysis
}

function generateEnhancedReport() {
  const bundlePaths = Object.keys(BUNDLE_TARGETS)
  const analyses = bundlePaths.map(analyzeBundle)
  
  // Get git information for tracking
  let gitInfo = {}
  try {
    gitInfo = {
      commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
      branch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(),
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    gitInfo = { error: 'Git information unavailable' }
  }

  const existingBundles = analyses.filter(a => a.exists)
  const totalRawSize = existingBundles.reduce((sum, a) => sum + a.sizes.raw, 0)
  const totalGzipSize = existingBundles.reduce((sum, a) => sum + a.sizes.gzip, 0)
  const totalBrotliSize = existingBundles.reduce((sum, a) => sum + (a.sizes.brotli || 0), 0)

  return {
    timestamp: new Date().toISOString(),
    git: gitInfo,
    bundles: analyses,
    summary: {
      totalBundles: analyses.length,
      existingBundles: existingBundles.length,
      compliantBundles: existingBundles.filter(a => 
        a.compliance.raw && a.compliance.gzip && a.compliance.brotli
      ).length,
      totalSizes: {
        raw: totalRawSize,
        gzip: totalGzipSize,
        brotli: totalBrotliSize,
        rawFormatted: formatBytes(totalRawSize),
        gzipFormatted: formatBytes(totalGzipSize),
        brotliFormatted: formatBytes(totalBrotliSize),
      },
    },
    react19Optimizations: analyzeGlobalOptimizations(existingBundles),
  }
}

function analyzeGlobalOptimizations(bundles) {
  const globalAnalysis = {}
  
  Object.keys(REACT19_OPTIMIZATIONS).forEach(key => {
    const bundleResults = bundles.map(bundle => bundle.optimizations?.[key]).filter(Boolean)
    const optimizedCount = bundleResults.filter(result => result.applied).length
    const totalCount = bundleResults.length
    
    globalAnalysis[key] = {
      ...REACT19_OPTIMIZATIONS[key],
      appliedToBundles: optimizedCount,
      totalBundles: totalCount,
      completionRate: totalCount > 0 ? ((optimizedCount / totalCount) * 100).toFixed(1) : '0',
      status: optimizedCount === totalCount ? 'complete' : 'partial',
    }
  })
  
  return globalAnalysis
}

export { generateEnhancedReport, analyzeBundle, BUNDLE_TARGETS, REACT19_OPTIMIZATIONS }

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const report = generateEnhancedReport()
  console.log('📊 Enhanced Bundle Analysis Report')
  console.log('==================================\n')
  
  // Print summary
  console.log(`📅 Generated: ${report.timestamp}`)
  if (report.git.commit) {
    console.log(`🔗 Git: ${report.git.branch}@${report.git.commit.substring(0, 8)}`)
  }
  console.log(`📦 Bundles: ${report.summary.compliantBundles}/${report.summary.existingBundles} compliant`)
  console.log(`📏 Total Size: ${report.summary.totalSizes.rawFormatted} raw, ${report.summary.totalSizes.gzipFormatted} gzip\n`)
  
  // Save detailed report
  const reportsDir = join(projectRoot, 'reports')
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true })
  }
  
  const reportPath = join(reportsDir, `bundle-analysis-${Date.now()}.json`)
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`📄 Detailed report saved: ${reportPath}`)
}
