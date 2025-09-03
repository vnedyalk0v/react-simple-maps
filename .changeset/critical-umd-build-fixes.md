---
"@vnedyalk0v/react19-simple-maps": patch
---

🚨 **CRITICAL: Fixed UMD build export issues** - Resolved broken UMD build that had no exports, causing failures in Turbopack (Next.js 15.5+) and other modern bundlers

## 🔧 Build System Fixes

- **⚙️ Improved Rollup UMD configuration** - Fixed aggressive terser minification settings that were breaking export mechanisms
- **📦 Updated package.json exports** - Temporarily point browser field to working ES modules as fallback until UMD is fully stable
- **🧪 Added build verification script** - Comprehensive testing for all build formats (ES, CJS, UMD, TypeScript) to prevent future regressions
- **🔍 Enhanced CI/CD pipeline** - Added automated build verification to prepublish process

## 🛠️ Technical Improvements

- **📋 Better error reporting** - Improved build verification with detailed export analysis
- **🎯 React 19 compliance maintained** - All fixes follow strict React 19.1.1+ development guidelines
- **⚡ Optimized build process** - Reduced terser passes and improved UMD compatibility

## 🐛 Bug Fixes

- Fixed module resolution failures in Turbopack and modern bundlers
- Resolved "The module has no exports at all" errors
- Fixed browser field pointing to broken UMD build
- Corrected terser configuration for UMD format compatibility

## 📚 Migration Notes

This release fixes critical compatibility issues reported in production environments. Users experiencing module resolution failures with Turbopack, Webpack, or other bundlers should upgrade immediately.

**Breaking Changes:** None - this is a patch release that maintains full backward compatibility.
