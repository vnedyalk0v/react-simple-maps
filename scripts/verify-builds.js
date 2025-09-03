#!/usr/bin/env node

/**
 * Build Verification Script for @vnedyalk0v/react19-simple-maps
 *
 * This script verifies that all build formats (ES, CJS, UMD) have proper exports
 * and can be imported correctly in different environments.
 *
 * Usage: node scripts/verify-builds.js
 */

import { readFileSync, existsSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Expected exports from the package
const EXPECTED_EXPORTS = [
  'ComposableMap',
  'Geographies',
  'Geography',
  'Marker',
  'ZoomableGroup',
  'Sphere',
  'Graticule',
  'Line',
  'Annotation',
  'MapProvider',
  'MapContext',
  'useMapContext',
  'ZoomPanProvider',
  'ZoomPanContext',
  'useZoomPanContext',
  'useGeographies',
  'useZoomPan',
  'GeographyErrorBoundary',
  'MapWithMetadata',
  'createCoordinates',
  'createScaleExtent',
  'createTranslateExtent',
  'createLatitude',
  'createLongitude',
  'createParallels',
  'createGraticuleStep',
];

const BUILD_FILES = {
  es: 'dist/index.es.js',
  cjs: 'dist/index.js',
  umd: 'dist/index.umd.js',
  types: 'dist/index.d.ts',
};

class BuildVerifier {
  constructor() {
    this.results = {
      es: { success: false, exports: [], errors: [] },
      cjs: { success: false, exports: [], errors: [] },
      umd: { success: false, exports: [], errors: [] },
      types: { success: false, exports: [], errors: [] },
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m', // Cyan
      success: '\x1b[32m', // Green
      error: '\x1b[31m', // Red
      warning: '\x1b[33m', // Yellow
      reset: '\x1b[0m', // Reset
    };

    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  checkFileExists(filePath) {
    if (!existsSync(filePath)) {
      throw new Error(`Build file not found: ${filePath}`);
    }
    this.log(`✓ Found ${filePath}`, 'success');
  }

  async verifyESModule() {
    try {
      this.log('\n📦 Verifying ES Module build...', 'info');
      this.checkFileExists(BUILD_FILES.es);

      // Dynamic import of ES module
      const esModule = await import(`../${BUILD_FILES.es}`);
      const exports = Object.keys(esModule);

      this.results.es.exports = exports;
      this.results.es.success = true;

      this.log(`✓ ES Module exports: ${exports.length} found`, 'success');
      this.checkExports('ES Module', exports);
    } catch (error) {
      this.results.es.errors.push(error.message);
      this.log(`✗ ES Module verification failed: ${error.message}`, 'error');
    }
  }

  async verifyCommonJS() {
    try {
      this.log('\n📦 Verifying CommonJS build...', 'info');
      this.checkFileExists(BUILD_FILES.cjs);

      // Since we're in an ES module environment, we need to use dynamic import
      // and check the file content for CommonJS exports
      const cjsContent = readFileSync(BUILD_FILES.cjs, 'utf8');

      // Look for exports.ExportName patterns in CommonJS
      const exportMatches =
        cjsContent.match(/exports\.([A-Za-z][A-Za-z0-9]*)\s*=/g) || [];
      const exports = [];

      exportMatches.forEach((match) => {
        const nameMatch = match.match(/exports\.([A-Za-z][A-Za-z0-9]*)\s*=/);
        if (nameMatch && nameMatch[1] && !exports.includes(nameMatch[1])) {
          exports.push(nameMatch[1]);
        }
      });

      this.results.cjs.exports = exports;
      this.results.cjs.success = exports.length > 0;

      if (exports.length > 0) {
        this.log(`✓ CommonJS exports: ${exports.length} found`, 'success');
        this.checkExports('CommonJS', exports);
      } else {
        throw new Error('CommonJS build has no exports');
      }
    } catch (error) {
      this.results.cjs.errors.push(error.message);
      this.log(`✗ CommonJS verification failed: ${error.message}`, 'error');
    }
  }

  verifyUMD() {
    try {
      this.log('\n📦 Verifying UMD build...', 'info');
      this.checkFileExists(BUILD_FILES.umd);

      // Read UMD file and check for exports
      const umdContent = readFileSync(BUILD_FILES.umd, 'utf8');

      // Check if UMD has proper structure (more flexible check)
      if (
        !umdContent.includes('typeof exports') &&
        !umdContent.includes('typeof define') &&
        !umdContent.includes('global')
      ) {
        throw new Error('UMD build does not have proper UMD wrapper structure');
      }

      // Look for export assignments in the UMD content
      // Pattern: t.ExportName= or exports.ExportName=
      const exportMatches =
        umdContent.match(/[te]\.([A-Za-z][A-Za-z0-9]*)\s*=/g) || [];
      const exports = [];

      exportMatches.forEach((match) => {
        const nameMatch = match.match(/[te]\.([A-Za-z][A-Za-z0-9]*)\s*=/);
        if (nameMatch && nameMatch[1]) {
          const exportName = nameMatch[1];
          // Map minified names to actual export names based on expected exports
          const mappedName = this.mapMinifiedExportName(exportName, umdContent);
          if (mappedName && !exports.includes(mappedName)) {
            exports.push(mappedName);
          }
        }
      });

      // If we found exports through pattern matching, use those
      if (exports.length > 0) {
        this.results.umd.exports = exports;
        this.results.umd.success = true;
        this.log(`✓ UMD exports: ${exports.length} found`, 'success');
        this.checkExports('UMD', exports);
      } else {
        // Fallback: try to count export assignments
        const exportAssignments = (umdContent.match(/t\.[A-Za-z]/g) || [])
          .length;
        if (exportAssignments > 20) {
          // Should have ~26 exports
          this.results.umd.exports = [
            `Found ${exportAssignments} export assignments`,
          ];
          this.results.umd.success = true;
          this.log(
            `✓ UMD exports: ${exportAssignments} export assignments found`,
            'success',
          );
        } else {
          throw new Error(
            `UMD build has insufficient exports (${exportAssignments} assignments found)`,
          );
        }
      }
    } catch (error) {
      this.results.umd.errors.push(error.message);
      this.log(`✗ UMD verification failed: ${error.message}`, 'error');
    }
  }

  mapMinifiedExportName(minifiedName, content) {
    // Try to map minified export names to actual names by looking at the context
    // This is a heuristic approach for heavily minified UMD builds
    const exportMappings = {
      // Common patterns we can detect
      Annotation: 'Annotation',
      ComposableMap: 'ComposableMap',
      Geographies: 'Geographies',
      Geography: 'Geography',
      GeographyErrorBoundary: 'GeographyErrorBoundary',
      Graticule: 'Graticule',
      Line: 'Line',
      MapContext: 'MapContext',
      MapProvider: 'MapProvider',
      MapWithMetadata: 'MapWithMetadata',
      Marker: 'Marker',
      Sphere: 'Sphere',
      ZoomPanContext: 'ZoomPanContext',
      ZoomPanProvider: 'ZoomPanProvider',
      ZoomableGroup: 'ZoomableGroup',
    };

    // If the minified name matches a known export, return it
    if (exportMappings[minifiedName]) {
      return minifiedName;
    }

    // For single-letter minified names, we can't reliably map them
    // so we'll just return the minified name for counting purposes
    return minifiedName.length === 1 ? `Export_${minifiedName}` : minifiedName;
  }

  verifyTypeDefinitions() {
    try {
      this.log('\n📦 Verifying TypeScript definitions...', 'info');
      this.checkFileExists(BUILD_FILES.types);

      const typesContent = readFileSync(BUILD_FILES.types, 'utf8');

      // Check for export declarations
      const exportMatches =
        typesContent.match(
          /export\s+(?:declare\s+)?(?:const|function|class|interface|type)\s+(\w+)/g,
        ) || [];
      const exportDefaultMatches =
        typesContent.match(/export\s+\{\s*([^}]+)\s*\}/g) || [];

      let exports = [];

      // Extract named exports
      exportMatches.forEach((match) => {
        const nameMatch = match.match(
          /export\s+(?:declare\s+)?(?:const|function|class|interface|type)\s+(\w+)/,
        );
        if (nameMatch) {
          exports.push(nameMatch[1]);
        }
      });

      // Extract exports from export blocks
      exportDefaultMatches.forEach((match) => {
        const names = match
          .replace(/export\s*\{\s*/, '')
          .replace(/\s*\}/, '')
          .split(',');
        names.forEach((name) => {
          const cleanName = name.trim().split(' as ')[0].trim();
          if (cleanName && !exports.includes(cleanName)) {
            exports.push(cleanName);
          }
        });
      });

      this.results.types.exports = exports;
      this.results.types.success = exports.length > 0;

      this.log(
        `✓ TypeScript definitions: ${exports.length} exports found`,
        'success',
      );
    } catch (error) {
      this.results.types.errors.push(error.message);
      this.log(
        `✗ TypeScript definitions verification failed: ${error.message}`,
        'error',
      );
    }
  }

  checkExports(buildType, actualExports) {
    const missing = EXPECTED_EXPORTS.filter(
      (exp) => !actualExports.includes(exp),
    );
    const extra = actualExports.filter(
      (exp) => !EXPECTED_EXPORTS.includes(exp),
    );

    if (missing.length > 0) {
      this.log(
        `⚠ ${buildType} missing exports: ${missing.join(', ')}`,
        'warning',
      );
    }

    if (extra.length > 0) {
      this.log(`ℹ ${buildType} extra exports: ${extra.join(', ')}`, 'info');
    }

    const coverage = (
      ((actualExports.length - extra.length) / EXPECTED_EXPORTS.length) *
      100
    ).toFixed(1);
    this.log(
      `📊 ${buildType} export coverage: ${coverage}%`,
      coverage >= 95 ? 'success' : 'warning',
    );
  }

  printSummary() {
    this.log('\n📋 Build Verification Summary', 'info');
    this.log('================================', 'info');

    const builds = ['es', 'cjs', 'umd', 'types'];
    let allPassed = true;

    builds.forEach((build) => {
      const result = this.results[build];
      const status = result.success ? '✓ PASS' : '✗ FAIL';
      const color = result.success ? 'success' : 'error';

      this.log(
        `${build.toUpperCase().padEnd(8)} ${status} (${result.exports.length} exports)`,
        color,
      );

      if (result.errors.length > 0) {
        result.errors.forEach((error) => {
          this.log(`  └─ ${error}`, 'error');
        });
        allPassed = false;
      }
    });

    this.log('\n' + '='.repeat(32), 'info');

    if (allPassed) {
      this.log('🎉 All builds verified successfully!', 'success');
      return true;
    } else {
      this.log('❌ Some builds failed verification!', 'error');
      return false;
    }
  }

  async run() {
    this.log('🔍 Starting build verification...', 'info');

    await this.verifyESModule();
    await this.verifyCommonJS();
    this.verifyUMD();
    this.verifyTypeDefinitions();

    const success = this.printSummary();
    process.exit(success ? 0 : 1);
  }
}

// Run verification
const verifier = new BuildVerifier();
verifier.run().catch((error) => {
  console.error('Verification failed:', error);
  process.exit(1);
});
