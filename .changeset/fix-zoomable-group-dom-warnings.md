---
'@vnedyalk0v/react19-simple-maps': patch
---

Fix React DOM warnings in ZoomableGroup component

Resolves console warnings about unrecognized DOM props by properly filtering internal ZoomableGroup props before forwarding to DOM elements. This eliminates development warnings while maintaining full functionality and backward compatibility.

**Fixed warnings:**

- `minZoom` prop on DOM element
- `maxZoom` prop on DOM element
- `scaleExtent` prop on DOM element
- `enableZoom` prop on DOM element
- `translateExtent` prop on DOM element
- `enablePan` prop on DOM element

**Changes:**

- Modified ZoomableGroup prop destructuring to extract internal props
- Added proper ESLint handling for intentionally unused variables
- Maintained full React 19 compliance and functionality

**Impact:**

- ✅ Clean development experience with zero console warnings
- ✅ No breaking changes or functional impact
- ✅ Improved React 19 compliance
