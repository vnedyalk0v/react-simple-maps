# Error Report: @vnedyalk0v/react19-simple-maps Package Issues

**Date**: 2025-09-03  
**Package Version**: 1.0.5  
**Reporter**: Voyageo.io Development Team

## 🚨 **Critical Issues Summary**

The `@vnedyalk0v/react19-simple-maps` package has several critical issues that prevent it from working in modern React applications, particularly with Next.js 15.5+ and Turbopack.

## 📋 **Issue Details**

### 1. **UMD Build Export Problem** (CRITICAL)

**Issue**: The UMD build (`dist/index.umd.js`) has no exports at all, causing module resolution failures.

**Evidence**:

- File size: Only 3 lines, heavily minified
- Content: Contains the library code but doesn't properly export modules
- Error: "The module has no exports at all"

**Impact**:

- Turbopack (Next.js 15.5+) defaults to UMD build for client components
- Both development and production builds fail with Turbopack
- Affects all major bundlers that prefer UMD for browser environments

### 2. **Module Resolution Issues**

**Issue**: Bundlers are incorrectly resolving to the broken UMD build instead of working ES/CJS builds.

**Evidence**:

- ES module build (`dist/index.es.js`): ✅ Works correctly, has all exports
- CommonJS build (`dist/index.js`): ✅ Works correctly, has all exports
- UMD build (`dist/index.umd.js`): ❌ Broken, no exports
- Node.js can import from ES modules successfully
- TypeScript compilation passes (uses type definitions)

### 3. **Package.json Export Configuration**

**Current configuration**:

```json
{
  "main": "dist/index.js",
  "module": "dist/index.es.js",
  "browser": "dist/index.umd.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "browser": "./dist/index.umd.js",
      "import": "./dist/index.es.js",
      "require": "./dist/index.js"
    }
  }
}
```

**Problem**: The `browser` field points to the broken UMD build, causing bundlers to prefer it.

## 🔧 **Recommended Fixes**

### 1. **Fix UMD Build**

The UMD build needs to properly export all modules. The current build appears to be missing the export statements or has incorrect UMD wrapper.

**Expected UMD structure**:

```javascript
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, ...) :
  typeof define === 'function' && define.amd ? define(['exports', ...], factory) :
  (global = global || self, factory(global.reactSimpleMaps = {}, ...));
}(this, (function (exports, ...) {
  // Library code
  exports.ComposableMap = ComposableMap;
  exports.Geographies = Geographies;
  // ... all other exports
})));
```

### 2. **Update Package.json Exports**

Temporarily point browser field to ES modules until UMD is fixed:

```json
{
  "browser": "./dist/index.es.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "browser": "./dist/index.es.js",
      "import": "./dist/index.es.js",
      "require": "./dist/index.js"
    }
  }
}
```

### 3. **Build System Review**

Check the Rollup configuration for UMD output:

- Ensure proper `output.format: 'umd'`
- Verify `output.name` is set correctly
- Confirm all exports are included in the bundle

## 📋 **Testing Checklist**

Before publishing the fix, verify:

1. **UMD Build Verification**:

   ```bash
   node -e "console.log(Object.keys(require('./dist/index.umd.js')))"
   ```

   Should output all exported components.

2. **Browser Testing**:
   - Test with Webpack
   - Test with Turbopack (Next.js 15.5+)
   - Test with Vite
   - Test with Parcel

3. **Module Resolution Testing**:
   ```bash
   # Should work in all environments
   node --input-type=module -e "import * as maps from './dist/index.umd.js'; console.log(Object.keys(maps))"
   ```

## 🎯 **Current Workarounds**

For users experiencing this issue:

1. **Disable Turbopack temporarily**:

   ```javascript
   // next.config.ts
   const nextConfig = {
     // turbopack: { ... }, // Comment out
   };
   ```

2. **Force ES module resolution** (if bundler supports it):
   ```javascript
   // webpack.config.js
   resolve: {
     alias: {
       '@vnedyalk0v/react19-simple-maps': '@vnedyalk0v/react19-simple-maps/dist/index.es.js'
     }
   }
   ```

## 📊 **Error Summary**

| Build Type | Status     | Exports Available | Bundler Compatibility   |
| ---------- | ---------- | ----------------- | ----------------------- |
| ES Module  | ✅ Working | All 26 exports    | Modern bundlers         |
| CommonJS   | ✅ Working | All 26 exports    | Node.js, older bundlers |
| UMD        | ❌ Broken  | 0 exports         | **Causes failures**     |

## 🔍 **Missing Exports in UMD**

The following exports are missing from the UMD build:

- `ComposableMap`, `Geographies`, `Geography`, `Marker`, `ZoomableGroup`
- `createCoordinates`, `createScaleExtent`, `createTranslateExtent`
- `createLatitude`, `createLongitude`, `createParallels`, `createGraticuleStep`
- `useGeographies`, `useMapContext`, `useZoomPan`, `useZoomPanContext`
- `MapContext`, `MapProvider`, `ZoomPanContext`, `ZoomPanProvider`
- `Annotation`, `Line`, `Sphere`, `Graticule`, `GeographyErrorBoundary`, `MapWithMetadata`

## 🚀 **Next Steps**

1. **Immediate**: Fix UMD build export issues
2. **Short-term**: Update package.json exports configuration
3. **Long-term**: Implement comprehensive testing for all build formats
4. **Release**: Publish fixed version (suggest 1.0.6)

This is a **critical issue** that prevents the package from working in most modern React applications using current bundling tools.

---

**Contact**: For questions about this report, please reach out to the Voyageo.io development team.
