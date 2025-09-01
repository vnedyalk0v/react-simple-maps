# Changelog

## v3.1.0 2025-01-XX (Fork by Georgi Nedyalkov)

### 🚀 Major Enhancements

**Security & Dependencies**

- ✅ **Zero Security Vulnerabilities** - Eliminated 18 critical/high/moderate security issues
- ✅ **Updated All Dependencies** - Latest D3, React, and build tool versions
- ✅ **Modern Node.js Support** - Requires Node.js 18+ for development

**TypeScript Support**

- ✅ **Full TypeScript Rewrite** - 100% strict TypeScript with comprehensive type definitions
- ✅ **Complete Type Coverage** - All components, hooks, and utilities fully typed
- ✅ **Enhanced Developer Experience** - Full IntelliSense and compile-time error checking
- ✅ **Type-Safe Event Handlers** - Properly typed geography and event objects

**React 19 Compatibility**

- ✅ **React 19 Support** - Full compatibility with React 19 features
- ✅ **Backward Compatibility** - Works with React 16.8+ through React 19
- ✅ **Modern React Patterns** - Updated to use latest React best practices

**Build System Modernization**

- ✅ **Modern Rollup Configuration** - ESM, CJS, and UMD builds with tree-shaking
- ✅ **Optimized Bundle Size** - Smaller bundle with better performance
- ✅ **Source Maps** - Full source map support for debugging
- ✅ **Multiple Output Formats** - ESM-first with CJS and UMD fallbacks

**Testing Framework Upgrade**

- ✅ **Vitest Integration** - Modern testing framework replacing Jest
- ✅ **93.28% Test Coverage** - 132 comprehensive tests covering all functionality
- ✅ **React Testing Library** - Modern component testing patterns
- ✅ **Type-Safe Tests** - All tests written in TypeScript

**Documentation & Examples**

- ✅ **Comprehensive Documentation** - Complete API reference with TypeScript examples
- ✅ **TypeScript Examples** - Modern examples using Vite and React 19
- ✅ **Migration Guide** - Detailed upgrade instructions from v2.x
- ✅ **Interactive Examples** - Advanced examples with zoom, pan, and markers

### 🔧 Development Experience

**Modern Tooling**

- ✅ **ESLint v9** - Latest linting with modern rules
- ✅ **Prettier Integration** - Consistent code formatting
- ✅ **Vite Development** - Fast development server and builds
- ✅ **Hot Module Replacement** - Instant feedback during development

**Quality Assurance**

- ✅ **Strict TypeScript** - No `any` types, full type safety
- ✅ **Zero Lint Errors** - Clean codebase with consistent style
- ✅ **Comprehensive Testing** - Unit, integration, and component tests
- ✅ **Automated CI/CD** - Quality checks on every commit

### 📦 Package Improvements

**Distribution**

- ✅ **Tree-Shaking Support** - Import only what you need
- ✅ **Modern Module Formats** - ESM, CJS, and UMD builds
- ✅ **TypeScript Declarations** - Complete `.d.ts` files included
- ✅ **Optimized Bundle** - Smaller size with better performance

**Developer Experience**

- ✅ **IntelliSense Support** - Full autocomplete in IDEs
- ✅ **Error Prevention** - Catch issues at compile time
- ✅ **Better Debugging** - Source maps and clear error messages
- ✅ **Modern Standards** - Follows current React and TypeScript best practices

### 🎯 API Enhancements

**Type Safety**

- All components now have comprehensive TypeScript interfaces
- Event handlers are properly typed with geography and event objects
- Projection configuration is fully typed with proper interfaces
- Position and zoom state have structured type definitions

**Component Improvements**

- Enhanced `ComposableMap` with better projection handling
- Improved `ZoomableGroup` with typed position tracking
- Better `Geography` component with type-safe event handlers
- Enhanced `Marker` and `Annotation` components with proper typing

**Hook Enhancements**

- `useGeographies` hook with proper return types
- `useZoomPan` hook with typed position management
- Context hooks with comprehensive type definitions

### 🔄 Breaking Changes

- **Node.js 18+** required for development (runtime unchanged)
- **TypeScript recommended** (JavaScript still supported)
- **Modern bundlers** recommended for optimal tree-shaking
- **Updated D3 dependencies** may require bundler configuration updates

### 🙏 Acknowledgments

This fork builds upon the excellent foundation created by Richard Zimerman and the original react-simple-maps contributors. All enhancements maintain backward compatibility while adding modern development practices and comprehensive TypeScript support.

---

## v3.0.0 2022-07-25 (Original)

- Added `forwardRef` to mapping components
- Added `ZoomPanContext` and `ZoomPanProvider`
- Added `useZoomPanContext` and `useMapContext` hooks
- Added support for React 18
