---
"@vnedyalk0v/react19-simple-maps": minor
---

🚀 **MAJOR: Resolve react-simple-maps compatibility issues with enhanced APIs** - Complete solution for migration challenges with new simplified APIs and comprehensive geographic utilities

## 🎯 Compatibility Issues Resolved

- **⚙️ Simplified ZoomableGroup API** - Added intuitive helper functions and dual API support for easier configuration
- **🗺️ Enhanced Geography event handlers** - Rich geographic data access in all event handlers with backward compatibility
- **📖 Complete migration guide** - Comprehensive documentation for seamless migration from react-simple-maps

## 🔧 New Features & APIs

### **🎛️ ZoomableGroup Enhancements**
- **📦 Helper functions** - `createZoomConfig()`, `createPanConfig()`, `createZoomPanConfig()` for simplified configuration
- **🔄 Dual API support** - Both complex conditional types and simple props interfaces supported
- **⚡ Backward compatibility** - All existing usage patterns continue to work without changes

### **🗺️ Geography Utilities**
- **📍 Coordinate extraction** - `getGeographyCentroid()`, `getGeographyBounds()`, `getBestGeographyCoordinates()`
- **🎯 Enhanced event handlers** - All Geography events now provide rich geographic data as second parameter
- **🛡️ Type safety** - All utilities use branded coordinate types with proper validation

### **📚 Documentation & Migration**
- **📖 Migration guide** - Complete step-by-step instructions in `docs/MIGRATION.md`
- **🔄 API comparison** - Side-by-side examples of old vs new patterns
- **🎯 Enhanced examples** - Updated to demonstrate new capabilities

## 🛠️ Technical Improvements

- **🚀 React 19 compliance** - Strict adherence to React 19.1.1+ development guidelines
- **🧹 Clean codebase** - Zero warnings, errors, or console statements in production
- **🎯 Error handling** - Proper validation-based error handling without try-catch blocks
- **📦 Enhanced exports** - 5+ new utility functions and helper APIs

## 🐛 Issues Fixed

- **Complex ZoomableGroup configuration** - Simplified API eliminates conditional type complexity
- **Limited Geography interaction** - Rich geographic data now available in all event handlers
- **Missing migration documentation** - Comprehensive guide with troubleshooting and examples
- **Type safety concerns** - Enhanced TypeScript support with branded types

## 📚 Migration Notes

This release resolves all documented compatibility issues from `package_issues.md` while maintaining full backward compatibility. Users migrating from `react-simple-maps` now have:

- **🎯 Simple APIs** for common use cases alongside advanced options
- **🗺️ Rich geographic data** access in event handlers
- **📖 Step-by-step migration guide** with examples and troubleshooting
- **🔄 Backward compatibility** - no breaking changes to existing code

**Breaking Changes:** None - this is a minor release that adds new features while preserving all existing functionality.
