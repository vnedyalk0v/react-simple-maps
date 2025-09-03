## Feature Request: Make Debug Output Opt-in

**Current Behavior:**
ComposableMap always logs render information to console

**Requested Behavior:**

- Quiet by default (no console output)
- Opt-in debug mode via environment variable or prop
- Follows industry standards for library behavior

**Suggested Implementation:**

- Environment variable: `REACT_SIMPLE_MAPS_DEBUG=true`
- Or component prop: `<ComposableMap debug={true} />`

**Benefits:**

- Cleaner development experience
- More professional library behavior
- Follows React/Next.js conventions
- Still allows debugging when needed
