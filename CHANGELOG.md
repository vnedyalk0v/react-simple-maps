# @vnedyalk0v/react19-simple-maps

## 1.0.3

### 🐛 Bug Fixes

**Published:** September 2, 2025

- **📦 Package Files** - Fixed npm package to include README.md, LICENSE, and CHANGELOG.md files
- **📚 Documentation** - Resolved issue where npmjs.com was showing outdated README due to missing files in package

## 1.0.2

### 🔧 Improvements

**Published:** September 2, 2025

- **🎯 Enhanced Examples** - Added comprehensive interactive map example with zoom, pan, and click interactions
- **🗺️ CORS-Free Geography Data** - Updated examples to use inline geography data, eliminating CORS issues
- **🎨 Improved UI** - Beautiful gradient backgrounds and professional styling in examples
- **📍 Interactive Markers** - Added city markers with hover effects and real-time position display
- **🔄 Reset Functionality** - Added reset view button for better user experience

## 1.0.1

### 🐛 Bug Fixes

**Published:** September 2, 2025

- **⚛️ React Hooks Compliance** - Fixed `use()` hook being called inside `useMemo()` which violated Rules of Hooks
- **🔧 Hook Architecture** - Moved `use()` call to top level of `useGeographies` hook for proper React 19 compliance
- **🌐 CORS Resolution** - Updated examples to use working TopoJSON URL from jsdelivr CDN
- **📝 TypeScript Fixes** - Resolved TypeScript issues with branded coordinate types in examples
- **📦 Example Updates** - Fixed both basic-map and interactive-map examples with proper dependencies

## 1.0.0

### 🎉 Initial Release

**Published:** September 2, 2025

This is the initial release of `@vnedyalk0v/react19-simple-maps` - a modern, TypeScript-first React mapping library built exclusively for React 19+ with cutting-edge React patterns.

### ✨ Features

- **⚛️ React 19 Exclusive** - Built specifically for React 19.1.1+ with modern patterns
- **📝 100% TypeScript** - Strict TypeScript with comprehensive type definitions
- **🔒 Zero Security Vulnerabilities** - All dependencies updated and secure
- **📦 Modern Build System** - ESM/CJS/UMD builds with tree-shaking support
- **🧪 Comprehensive Testing** - 159 tests with full coverage using Vitest
- **🎯 Multiple Output Formats** - CommonJS, ES Modules, and UMD builds
- **🗺️ Source Maps** - Full debugging support with source maps
- **📚 Complete TypeScript Definitions** - Detailed type definitions for excellent DX

### � Technical Stack

- **React 19.1.1+** - Latest React with concurrent features
- **TypeScript 5.9+** - Strict mode with comprehensive typing
- **D3 Geo** - Powerful geographic projections and utilities
- **Rollup** - Optimized bundling with multiple output formats
- **Vitest** - Modern testing framework
- **ESLint 9** - Latest linting with strict rules
- **Prettier** - Consistent code formatting

### 📦 Installation

```bash
npm install @vnedyalk0v/react19-simple-maps
```

### 🎯 Key Components

- `ComposableMap` - Main map container with projection support
- `Geographies` - Geography data loading and rendering
- `Geography` - Individual geography feature rendering
- `Marker` - Point markers on maps
- `Annotation` - Text annotations
- `Graticule` - Coordinate grid lines
- `Sphere` - Map sphere/globe outline
- `ZoomableGroup` - Zoom and pan functionality

### � Modern React 19 Features

- **Actions API** - For async operations with automatic pending states
- **Optimistic Updates** - Immediate UI feedback with automatic rollback
- **Suspense Integration** - Proper loading states and error boundaries
- **Resource Preloading** - Automatic geography data preloading
- **Concurrent Features** - Built for React's concurrent rendering

### 🙏 Acknowledgments

Built upon the excellent foundation of `react-simple-maps` by Richard Zimerman and contributors. This package modernizes the library for React 19 while maintaining API compatibility.

### 📄 License

MIT License - see LICENSE file for details.
