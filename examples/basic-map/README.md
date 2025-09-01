# Basic Map Example

A simple TypeScript example demonstrating the basic usage of react-simple-maps v3.0.

## Features

- ✅ Full TypeScript support with strict typing
- ✅ React 19 compatibility
- ✅ Interactive world map with hover effects
- ✅ Typed event handlers
- ✅ Modern Vite build setup

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## What's Included

- **TypeScript Configuration**: Strict mode with full type checking
- **React 19**: Latest React features and patterns
- **Vite**: Fast development and build tooling
- **Interactive Map**: Click handlers with proper TypeScript types
- **Styling**: CSS with hover effects and responsive design

## Key TypeScript Features

### Typed Props
```tsx
import type { GeographyProps } from 'react-simple-maps'

const handleGeographyClick = (geography: GeographyProps['geography']) => {
  console.log('Country:', geography.properties?.NAME)
}
```

### Typed Components
```tsx
const App: React.FC = () => {
  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{
        scale: 147,
        center: [0, 0],
      }}
    >
      {/* Fully typed components */}
    </ComposableMap>
  )
}
```

## Learn More

- [react-simple-maps Documentation](https://www.react-simple-maps.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
