# Changelog

## 1.0.1

### Patch Changes

- b47f146: Initial release.

## 2.0.0

### Major Changes

- 1244fe3: Initial version.

## v3.1.0 2025-09-01 (Fork by Georgi Nedyalkov)

### 🚀 Major Enhancements

- **🔒 Zero Security Vulnerabilities** - Eliminated 18 security issues, updated all dependencies
- **📝 Full TypeScript Rewrite** - 100% strict TypeScript with zero `any` types
- **⚛️ React 19 Compatible** - Works with React 16.8+ through React 19
- **📦 Modern Build System** - ESM/CJS/UMD builds with tree-shaking support
- **🧪 Comprehensive Testing** - 132 tests with 93% coverage using Vitest
- **📚 Complete Documentation** - TypeScript examples and migration guide

### 🔧 Technical Improvements

- **Modern Tooling**: ESLint v9, Prettier, Vite development server
- **Performance**: Optimized bundle sizes, memory leak prevention
- **Developer Experience**: Full IntelliSense, compile-time error checking
- **Quality**: Strict linting, automated testing, source maps

### 🎯 API Enhancements

- Comprehensive TypeScript interfaces for all components
- Type-safe event handlers and projection configuration
- Enhanced hooks (`useGeographies`, `useZoomPan`) with proper typing
- Improved components with better error handling

### 🔄 Breaking Changes

- Node.js 18+ required for development
- TypeScript recommended (JavaScript still supported)
- Updated D3 dependencies may require bundler updates

### 🙏 Acknowledgments

Built upon the excellent foundation by Richard Zimerman and original contributors. All enhancements maintain backward compatibility.

---

## v3.0.0 2022-07-25 (Original)

- Added `forwardRef` to mapping components
- Added `ZoomPanContext` and `ZoomPanProvider`
- Added `useZoomPanContext` and `useMapContext` hooks
- Added support for React 18
