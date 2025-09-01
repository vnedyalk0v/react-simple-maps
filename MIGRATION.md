# Migration Guide: v2.x to v3.0

This guide helps you migrate from react-simple-maps v2.x to v3.0, which includes significant improvements in TypeScript support, React 19 compatibility, and modern build tooling.

## Overview of Changes

### ✅ What's New in v3.0

- **Full TypeScript Support**: Comprehensive type definitions for all components
- **React 19 Compatible**: Works with React 16.8+ through React 19
- **Modern Build System**: ESM, CJS, and UMD builds with tree-shaking
- **Zero Security Vulnerabilities**: Updated all dependencies
- **Improved Performance**: Smaller bundle size and better optimization
- **Enhanced Developer Experience**: Better IntelliSense and error messages

### 🔄 Breaking Changes

1. **TypeScript First**: While JavaScript still works, TypeScript is now the primary focus
2. **Updated Dependencies**: D3 dependencies updated to latest versions
3. **Build Output**: New build system with different output structure
4. **Node.js Requirements**: Requires Node.js 18+ for development

## Step-by-Step Migration

### 1. Update Package Version

```bash
# npm
npm install react-simple-maps@^3.0.0

# yarn
yarn add react-simple-maps@^3.0.0

# pnpm
pnpm add react-simple-maps@^3.0.0
```

### 2. TypeScript Setup (Recommended)

If you're not using TypeScript yet, now is a great time to start:

```bash
# Install TypeScript and types
npm install -D typescript @types/react @types/react-dom

# Create tsconfig.json
npx tsc --init
```

**Recommended tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### 3. Update Imports (No Changes Required)

Good news! All imports remain the same:

```tsx
// ✅ These imports work exactly the same
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  ZoomableGroup,
} from "react-simple-maps"
```

### 4. Add Type Annotations (TypeScript)

If using TypeScript, add type annotations for better developer experience:

**Before (v2.x JavaScript):**

```jsx
const handleGeographyClick = (geography) => {
  console.log(geography.properties.NAME)
}
```

**After (v3.0 TypeScript):**

```tsx
import type { GeographyProps } from "react-simple-maps"

const handleGeographyClick = (geography: GeographyProps["geography"]) => {
  console.log(geography.properties?.NAME)
}
```

### 5. Update Event Handlers

Event handlers now have proper TypeScript types:

**Before:**

```jsx
const handleClick = (geography, event) => {
  // Handle click
}
```

**After:**

```tsx
import type { GeographyProps } from "react-simple-maps"

const handleClick = (
  geography: GeographyProps["geography"],
  event: React.MouseEvent<SVGPathElement>
) => {
  // Handle click with full type safety
}
```

### 6. Projection Configuration

Projection configuration is now fully typed:

**Before:**

```jsx
const projectionConfig = {
  scale: 147,
  center: [0, 0],
}
```

**After:**

```tsx
import type { ProjectionConfig } from "react-simple-maps"

const projectionConfig: ProjectionConfig = {
  scale: 147,
  center: [0, 0],
  rotate: [0, 0, 0], // Now properly typed
}
```

## Component-Specific Changes

### ComposableMap

No breaking changes, but now fully typed:

```tsx
import type { ComposableMapProps } from "react-simple-maps"

const MyMap: React.FC<ComposableMapProps> = (props) => {
  return <ComposableMap {...props} />
}
```

### Geographies

The render prop pattern is now fully typed:

```tsx
<Geographies geography={geoUrl}>
  {(
    { geographies } // ← geographies is now properly typed
  ) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)}
</Geographies>
```

### ZoomableGroup

Position and zoom state are now typed:

```tsx
import type { Position } from "react-simple-maps"

const [position, setPosition] = useState<Position>({
  coordinates: [0, 0],
  zoom: 1,
})

const handleMoveEnd = (position: Position) => {
  setPosition(position)
}
```

## Common Migration Issues

### Issue 1: TypeScript Errors

**Problem:** Getting TypeScript errors after upgrade

**Solution:** Install type definitions and update your tsconfig.json:

```bash
npm install -D @types/react @types/react-dom
```

### Issue 2: Build Errors

**Problem:** Build fails with module resolution errors

**Solution:** Update your bundler configuration to handle the new build output. Most modern bundlers (Webpack 5+, Vite, etc.) handle this automatically.

### Issue 3: D3 Type Conflicts

**Problem:** Conflicts with existing D3 types

**Solution:** react-simple-maps v3.0 includes its own D3 types. Remove conflicting D3 type packages:

```bash
npm uninstall @types/d3 @types/d3-geo @types/d3-zoom
```

## Testing Your Migration

### 1. Type Check (TypeScript)

```bash
npx tsc --noEmit
```

### 2. Build Test

```bash
npm run build
```

### 3. Runtime Test

Ensure all map interactions work as expected:

- Geography clicks
- Zoom and pan
- Marker interactions
- Annotations

## Benefits After Migration

### Enhanced Developer Experience

- **IntelliSense**: Full autocomplete for all props and methods
- **Error Prevention**: Catch errors at compile time
- **Better Refactoring**: Safe renaming and restructuring

### Improved Performance

- **Smaller Bundle**: Tree-shaking eliminates unused code
- **Faster Builds**: Modern build system with better caching
- **Better Runtime**: Optimized D3 integration

### Future-Proof

- **React 19 Ready**: Compatible with the latest React features
- **Modern Standards**: ESM-first with CJS fallback
- **Security**: Zero known vulnerabilities

## Need Help?

- 📖 [Documentation](https://www.react-simple-maps.io/)
- 🐛 [Report Issues](https://github.com/vnedyalk0v/react-simple-maps/issues)
- 💬 [Discussions](https://github.com/vnedyalk0v/react-simple-maps/discussions)
- 📧 [Community Support](https://stackoverflow.com/questions/tagged/react-simple-maps)

## Example Migration

Here's a complete before/after example:

**Before (v2.x):**

```jsx
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const MapComponent = () => {
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleClick = (geography) => {
    setSelectedCountry(geography.properties.NAME)
  }

  return (
    <ComposableMap>
      <Geographies geography="/world.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} onClick={() => handleClick(geo)} />
          ))
        }
      </Geographies>
    </ComposableMap>
  )
}
```

**After (v3.0):**

```tsx
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import type { GeographyProps } from "react-simple-maps"

const MapComponent: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const handleClick = (geography: GeographyProps["geography"]) => {
    setSelectedCountry(geography.properties?.NAME || null)
  }

  return (
    <ComposableMap>
      <Geographies geography="/world.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} onClick={() => handleClick(geo)} />
          ))
        }
      </Geographies>
    </ComposableMap>
  )
}

export default MapComponent
```

The migration is straightforward, and the benefits are significant. Welcome to react-simple-maps v3.0! 🎉
