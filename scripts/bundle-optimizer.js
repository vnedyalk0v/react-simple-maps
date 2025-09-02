#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// Bundle optimization strategies
const OPTIMIZATION_STRATEGIES = {
  // Remove development-only code
  stripDevelopmentCode: {
    name: 'Strip Development Code',
    description: 'Remove console.log, debugging utilities, and development-only features',
    patterns: [
      /console\.(log|warn|info|debug)/g,
      /process\.env\.NODE_ENV\s*[!=]==?\s*['"]development['"]/g,
      /__DEV__/g,
    ],
    estimatedSavings: '5-10%',
  },
  
  // Optimize imports
  optimizeImports: {
    name: 'Optimize Imports',
    description: 'Use specific imports instead of barrel exports to enable better tree shaking',
    patterns: [
      /import\s*\*\s*as\s+\w+\s+from/g,
      /import\s*{\s*[^}]+\s*}\s*from\s*['"][^'"]*\/index['"]/g,
    ],
    estimatedSavings: '10-15%',
  },
  
  // Minify inline styles and templates
  minifyInlineContent: {
    name: 'Minify Inline Content',
    description: 'Minify CSS-in-JS and template literals',
    patterns: [
      /`[\s\S]*?`/g, // Template literals
      /style\s*=\s*{[^}]+}/g, // Inline styles
    ],
    estimatedSavings: '2-5%',
  },
  
  // Remove unused exports
  removeUnusedExports: {
    name: 'Remove Unused Exports',
    description: 'Identify and remove exports that are not used externally',
    estimatedSavings: '5-8%',
  },
}

function analyzeCodePatterns(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')
    const analysis = {
      file: filePath,
      size: content.length,
      issues: [],
      optimizations: [],
    }
    
    // Check for optimization opportunities
    Object.entries(OPTIMIZATION_STRATEGIES).forEach(([key, strategy]) => {
      if (strategy.patterns) {
        strategy.patterns.forEach(pattern => {
          const matches = content.match(pattern)
          if (matches && matches.length > 0) {
            analysis.optimizations.push({
              strategy: key,
              name: strategy.name,
              description: strategy.description,
              matches: matches.length,
              estimatedSavings: strategy.estimatedSavings,
              examples: matches.slice(0, 3), // Show first 3 examples
            })
          }
        })
      }
    })
    
    // Check for potential issues
    const potentialIssues = [
      {
        pattern: /import.*from\s*['"]react['"].*\n.*import.*from\s*['"]react['"]/g,
        message: 'Multiple React imports detected - consider consolidating',
        severity: 'low',
      },
      {
        pattern: /\.map\(\s*\([^)]*\)\s*=>\s*{[\s\S]*?}\s*\)/g,
        message: 'Complex map functions detected - consider extracting to separate functions',
        severity: 'medium',
      },
      {
        pattern: /useEffect\(\s*\(\s*\)\s*=>\s*{[\s\S]{200,}?}\s*,/g,
        message: 'Large useEffect detected - consider splitting into smaller effects',
        severity: 'medium',
      },
    ]
    
    potentialIssues.forEach(issue => {
      const matches = content.match(issue.pattern)
      if (matches && matches.length > 0) {
        analysis.issues.push({
          message: issue.message,
          severity: issue.severity,
          count: matches.length,
        })
      }
    })
    
    return analysis
  } catch (error) {
    return {
      file: filePath,
      error: error.message,
    }
  }
}

function generateOptimizationReport() {
  const sourceFiles = [
    'src/index.ts',
    'src/components/ComposableMap.tsx',
    'src/components/Geography.tsx',
    'src/components/Geographies.tsx',
    'src/components/ZoomableGroup.tsx',
    'src/components/Marker.tsx',
    'src/hooks/useZoomPan.ts',
    'src/utils.ts',
  ]
  
  const analyses = sourceFiles.map(file => 
    analyzeCodePatterns(join(projectRoot, file))
  ).filter(analysis => !analysis.error)
  
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: analyses.length,
    totalSize: analyses.reduce((sum, a) => sum + a.size, 0),
    optimizations: {},
    issues: [],
    recommendations: [],
  }
  
  // Aggregate optimizations
  analyses.forEach(analysis => {
    analysis.optimizations.forEach(opt => {
      if (!report.optimizations[opt.strategy]) {
        report.optimizations[opt.strategy] = {
          name: opt.name,
          description: opt.description,
          estimatedSavings: opt.estimatedSavings,
          files: [],
          totalMatches: 0,
        }
      }
      
      report.optimizations[opt.strategy].files.push({
        file: analysis.file,
        matches: opt.matches,
        examples: opt.examples,
      })
      report.optimizations[opt.strategy].totalMatches += opt.matches
    })
    
    analysis.issues.forEach(issue => {
      report.issues.push({
        file: analysis.file,
        ...issue,
      })
    })
  })
  
  // Generate recommendations
  Object.values(report.optimizations).forEach(opt => {
    if (opt.totalMatches > 0) {
      report.recommendations.push({
        priority: opt.totalMatches > 10 ? 'high' : opt.totalMatches > 5 ? 'medium' : 'low',
        action: opt.name,
        description: opt.description,
        impact: opt.estimatedSavings,
        files: opt.files.length,
        occurrences: opt.totalMatches,
      })
    }
  })
  
  // Sort recommendations by priority and impact
  report.recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority] || b.occurrences - a.occurrences
  })
  
  return report
}

function printOptimizationReport(report) {
  console.log('\n🚀 Bundle Optimization Analysis')
  console.log('===============================\n')
  
  console.log(`📅 Generated: ${report.timestamp}`)
  console.log(`📁 Files analyzed: ${report.totalFiles}`)
  console.log(`📦 Total source size: ${(report.totalSize / 1024).toFixed(2)} KB\n`)
  
  if (report.recommendations.length === 0) {
    console.log('✨ No optimization opportunities found!')
    return
  }
  
  console.log('🎯 Optimization Recommendations:')
  console.log('================================\n')
  
  report.recommendations.forEach((rec, index) => {
    const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'
    
    console.log(`${index + 1}. ${priorityIcon} ${rec.action} (${rec.priority} priority)`)
    console.log(`   📝 ${rec.description}`)
    console.log(`   💾 Estimated savings: ${rec.impact}`)
    console.log(`   📁 Files affected: ${rec.files}`)
    console.log(`   🔢 Occurrences: ${rec.occurrences}\n`)
  })
  
  if (report.issues.length > 0) {
    console.log('⚠️  Code Quality Issues:')
    console.log('========================\n')
    
    report.issues.forEach(issue => {
      const severityIcon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢'
      console.log(`${severityIcon} ${issue.message}`)
      console.log(`   📁 File: ${issue.file}`)
      console.log(`   🔢 Count: ${issue.count}\n`)
    })
  }
  
  // Calculate potential savings
  const totalPotentialSavings = report.recommendations.reduce((sum, rec) => {
    const savingsMatch = rec.impact.match(/(\d+)-?(\d+)?%/)
    if (savingsMatch) {
      const minSavings = parseInt(savingsMatch[1])
      const maxSavings = parseInt(savingsMatch[2] || savingsMatch[1])
      return sum + (minSavings + maxSavings) / 2
    }
    return sum
  }, 0)
  
  if (totalPotentialSavings > 0) {
    console.log(`💡 Estimated total bundle size reduction: ${totalPotentialSavings.toFixed(1)}%`)
  }
}

function generateOptimizationScript(report) {
  const script = `#!/bin/bash
# Auto-generated bundle optimization script
# Generated: ${report.timestamp}

echo "🚀 Starting bundle optimization..."

# Backup original files
echo "📦 Creating backup..."
cp -r src src.backup

# Apply optimizations
${report.recommendations.map(rec => {
  switch (rec.action) {
    case 'Strip Development Code':
      return `
echo "🧹 Stripping development code..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i.bak 's/console\\.\\(log\\|warn\\|info\\|debug\\).*;//g'
find src -name "*.bak" -delete`
    
    case 'Optimize Imports':
      return `
echo "📦 Optimizing imports..."
# Manual review required for import optimization`
    
    default:
      return `# ${rec.action}: Manual optimization required`
  }
}).join('\n')}

echo "✅ Optimization complete!"
echo "📊 Run 'npm run build' to see the results"
echo "🔄 Run 'npm run analyze:bundle' to verify improvements"
`

  writeFileSync(join(projectRoot, 'scripts/optimize.sh'), script)
  console.log('\n📜 Optimization script generated: scripts/optimize.sh')
  console.log('⚠️  Review the script before running it!')
}

// Main execution
function main() {
  const args = process.argv.slice(2)
  const shouldGenerateScript = args.includes('--generate-script')
  
  console.log('🔍 Analyzing code for optimization opportunities...\n')
  
  const report = generateOptimizationReport()
  printOptimizationReport(report)
  
  if (shouldGenerateScript) {
    generateOptimizationScript(report)
  }
  
  // Save report
  const reportPath = join(projectRoot, 'optimization-analysis.json')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n📄 Detailed report saved to: ${reportPath}`)
}

main()
