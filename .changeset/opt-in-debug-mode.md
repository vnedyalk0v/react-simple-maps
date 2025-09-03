---
"@vnedyalk0v/react19-simple-maps": minor
---

Add opt-in debug mode for cleaner development experience

Implements quiet-by-default debugging with opt-in activation via environment variable or component prop. This follows industry standards for library behavior and provides a more professional development experience.

**New Features:**
- `debug` prop on ComposableMap component for per-map debugging
- `REACT_SIMPLE_MAPS_DEBUG` environment variable for global debugging
- Quiet by default - no console output unless explicitly enabled

**Breaking Change:**
- Debug logging is now **disabled by default** (was previously enabled in development)
- To restore previous behavior, set `REACT_SIMPLE_MAPS_DEBUG=true` or use `debug={true}` prop

**Benefits:**
- ✅ Cleaner development console by default
- ✅ Professional library behavior following React/Next.js conventions
- ✅ Granular control over debug output
- ✅ Still provides rich debugging when needed

**Migration:**
- No action needed for most users (cleaner experience)
- To enable debugging: add `debug={true}` prop or set environment variable
