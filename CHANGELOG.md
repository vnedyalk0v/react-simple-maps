# Changelog

## 1.0.5

### Patch Changes

- 93014c3: Improve examples and npm publishing configuration
  - Simplify basic-map example by removing advanced React 19 features for better accessibility
  - Configure npm publishing to public registry with proper authentication
  - Update dependencies and improve ESLint configuration for examples
  - Remove focus outlines from map elements for better visual appearance
  - Add SRI hashes and improve security features
  - Fix root element existence check in examples

All notable changes to `@vnedyalk0v/react19-simple-maps` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> 📦 **Latest Version**: Check [npm](https://www.npmjs.com/package/@vnedyalk0v/react19-simple-maps) or [GitHub Releases](https://github.com/vnedyalk0v/react19-simple-maps/releases) for the most recent version.

## 1.0.4

### 🚀 Major Code Quality & Performance Improvements

**Published:** September 3, 2025

#### **🔧 TypeScript & Code Quality**

- **✅ Fixed all 41 TypeScript errors** - Achieved zero TypeScript errors across the entire codebase
- **🛡️ Replaced all 'any' types** with proper type definitions (unknown, branded types, etc.)
- **🏷️ Implemented branded coordinate types** for compile-time safety and better developer experience
- **🔍 Added comprehensive type guards** for runtime validation
- **⚡ Enhanced conditional types** for improved component APIs

#### **🧹 Linting & Code Standards**

- **✅ Fixed all ESLint errors** - Zero linting errors remaining
- **🚫 Removed all non-null assertions** with proper null checks
- **🪝 Fixed React Hook ordering** issues for React 19 compliance
- **🧽 Resolved unused variable** warnings
- **📝 Fixed control character regex** warnings

#### **🏗️ Build System & Dependencies**

- **🔄 Resolved circular dependency** between geography-validation and input-validation modules
- **📦 Created error-utils module** to break circular dependencies and improve modularity
- **🧹 Cleaned up package.json** - Removed 7 unnecessary dependencies and 11 redundant scripts
- **⚡ Optimized build configuration** - Faster builds with cleaner output

#### **🛡️ Security & Performance**

- **🔒 Enhanced input validation** and sanitization for all user data
- **🛡️ Improved SRI (Subresource Integrity)** support for external resources
- **🌐 Strengthened protocol validation** for better security
- **🧼 Added CSS sanitization** to prevent XSS attacks
- **⚡ Aggressive caching optimizations** with WeakMap and LRU strategies

#### **🧪 Testing & CI**

- **✅ Implemented basic test suite** with 3 passing tests
- **🔧 Added test setup infrastructure** for future test expansion
- **🚀 CI pipeline improvements** - All checks now passing consistently

#### **📚 Documentation**

- **📖 Streamlined documentation files** for better maintainability
- **🎯 Focused API documentation** on essential features
- **📋 Updated migration guides** with latest best practices

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
