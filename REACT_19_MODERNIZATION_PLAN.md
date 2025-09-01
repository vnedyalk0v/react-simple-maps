# React 19.1.1-Only Modernization Plan

**Target:** Transform react-simple-maps to leverage React 19.1.1 exclusive features
**Current Status:** React 16.8+ compatible → **React 19.1.1-only**
**Timeline:** 2-3 sprints

## 🎯 Modernization Goals

Since the original library supports React up to 18, this fork can be the **React 19.1.1 flagship version** that showcases cutting-edge React patterns while maintaining the same powerful mapping capabilities.

---

## 📋 Phase 1: Core React 19 Features (Sprint 1)

### 1.1 Update Dependencies & Configuration

```json
// package.json changes
{
  "peerDependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  }
}
```

```typescript
// tsconfig.json - Enable React 19 features
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "target": "ES2022"
  }
}
```

### 1.2 Replace `useGeographies` with `use()` Hook

**Current Implementation:**

```typescript
// src/components/useGeographies.tsx - BEFORE
export default function useGeographies({ geography, parseGeographies }: UseGeographiesProps) {
  const [output, setOutput] = useState<GeographyOutput>({})

  useEffect(() => {
    if (isString(geography)) {
      fetchGeographies(geography).then((geos) => {
        if (!cancelled && geos) {
          setOutput({
            geographies: getFeatures(geos, parseGeographies),
            mesh: getMesh(geos),
          })
        }
      })
    }
  }, [geography, parseGeographies])
}
```

**React 19 Modernized:**

```typescript
// src/components/useGeographies.tsx - AFTER
import { use, useMemo, cache } from "react"

// Cache geography fetching
const fetchGeographiesCache = cache(async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch geography: ${response.statusText}`)
  return response.json()
})

export default function useGeographies({ geography, parseGeographies }: UseGeographiesProps) {
  const { path } = useMapContext()

  const geographyData = useMemo(() => {
    if (isString(geography)) {
      return use(fetchGeographiesCache(geography))
    }
    return geography
  }, [geography])

  return useMemo(() => {
    const features = getFeatures(geographyData, parseGeographies)
    const mesh = getMesh(geographyData)
    const preparedMesh = prepareMesh(mesh.outline, mesh.borders, path)

    return {
      geographies: prepareFeatures(features, path),
      outline: preparedMesh.outline || "",
      borders: preparedMesh.borders || "",
    }
  }, [geographyData, parseGeographies, path])
}
```

### 1.3 Enhanced Error Boundaries

```typescript
// src/components/GeographyErrorBoundary.tsx - NEW
import { ErrorBoundary } from 'react'

interface GeographyErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
}

export function GeographyErrorBoundary({
  children,
  fallback = DefaultErrorFallback
}: GeographyErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}

function DefaultErrorFallback(error: Error, retry: () => void) {
  return (
    <div className="rsm-error-boundary">
      <h3>Failed to load geography data</h3>
      <p>{error.message}</p>
      <button onClick={retry} className="rsm-retry-button">
        Retry Loading
      </button>
    </div>
  )
}
```

---

## 📋 Phase 2: Concurrent Features (Sprint 2)

### 2.1 Smooth Zoom/Pan with Concurrent Features

```typescript
// src/components/useZoomPan.tsx - Enhanced with React 19
import { useDeferredValue, useTransition, startTransition } from "react"

export default function useZoomPan(props: UseZoomPanHookProps) {
  const [isPending, startTransition] = useTransition()

  // Defer expensive position calculations
  const deferredCenter = useDeferredValue(props.center)
  const deferredZoom = useDeferredValue(props.zoom || 1)

  // Smooth position updates
  const [position, setPosition] = useState({ x: 0, y: 0, k: 1, dragging: false })
  const smoothPosition = useDeferredValue(position)

  const handleZoom = useCallback(
    (d3Event: D3ZoomEvent<SVGGElement, unknown>) => {
      if (bypassEvents.current) return

      const { transform, sourceEvent } = d3Event

      // Use transition for non-blocking updates
      startTransition(() => {
        setPosition({
          x: transform.x,
          y: transform.y,
          k: transform.k,
          dragging: sourceEvent,
        })
      })

      // Immediate callback for responsive feel
      if (props.onMove) {
        const coords = getCoords(width, height, transform)
        const inverted = projection.invert?.(coords)
        if (inverted) {
          props.onMove(
            {
              coordinates: inverted as [number, number],
              zoom: transform.k,
            },
            d3Event.sourceEvent || d3Event
          )
        }
      }
    },
    [props.onMove, width, height, projection]
  )

  return {
    mapRef,
    position: smoothPosition, // Use deferred value for smooth rendering
    transformString: `translate(${smoothPosition.x} ${smoothPosition.y}) scale(${smoothPosition.k})`,
    isPending, // Expose pending state for loading indicators
  }
}
```

### 2.2 Server Components for Geography Pre-loading

```typescript
// src/components/GeographyServer.tsx - NEW Server Component
import { cache } from 'react'

const preloadGeography = cache(async (geography: string) => {
  const response = await fetch(geography)
  if (!response.ok) {
    throw new Error(`Failed to fetch geography: ${response.statusText}`)
  }
  return response.json()
})

// Server Component for pre-loading
export async function GeographyServer({
  geography,
  children
}: {
  geography: string
  children: (data: GeographyData) => ReactNode
}) {
  const geographyData = await preloadGeography(geography)

  const processedData = {
    geographies: getFeatures(geographyData),
    outline: getMesh(geographyData).outline || "",
    borders: getMesh(geographyData).borders || "",
  }

  return children(processedData)
}

// Client Component wrapper
export function GeographyClient({
  geography,
  children
}: {
  geography: string | GeographyData
  children: (data: GeographyData) => ReactNode
}) {
  if (typeof geography === 'string') {
    return (
      <Suspense fallback={<GeographyLoadingSkeleton />}>
        <GeographyServer geography={geography}>
          {children}
        </GeographyServer>
      </Suspense>
    )
  }

  return children(geography)
}
```

---

## 📋 Phase 3: Advanced Features (Sprint 3)

### 3.1 Form Actions for Interactive Controls

```typescript
// src/components/MapControls.tsx - NEW
export function MapControls({
  onProjectionChange,
  onZoomChange
}: {
  onProjectionChange: (projection: string) => void
  onZoomChange: (zoom: number) => void
}) {
  async function handleProjectionChange(formData: FormData) {
    const projection = formData.get('projection') as string
    onProjectionChange(projection)
  }

  async function handleZoomChange(formData: FormData) {
    const zoom = Number(formData.get('zoom'))
    onZoomChange(zoom)
  }

  return (
    <div className="rsm-controls">
      <form action={handleProjectionChange}>
        <label htmlFor="projection">Projection:</label>
        <select name="projection" id="projection">
          <option value="geoEqualEarth">Equal Earth</option>
          <option value="geoMercator">Mercator</option>
          <option value="geoOrthographic">Orthographic</option>
          <option value="geoNaturalEarth1">Natural Earth</option>
        </select>
        <button type="submit">Apply</button>
      </form>

      <form action={handleZoomChange}>
        <label htmlFor="zoom">Zoom Level:</label>
        <input
          type="range"
          name="zoom"
          id="zoom"
          min="0.5"
          max="8"
          step="0.1"
          defaultValue="1"
        />
        <button type="submit">Set Zoom</button>
      </form>
    </div>
  )
}
```

### 3.2 Enhanced TypeScript with React 19 Types

```typescript
// src/types.ts - Enhanced with React 19 patterns
import { ReactNode, SVGProps, CSSProperties, use } from "react"

// Branded types for better type safety
export type Longitude = number & { __brand: "longitude" }
export type Latitude = number & { __brand: "latitude" }
export type Coordinates = [Longitude, Latitude]

// Template literal types for projections
export type ProjectionName = `geo${Capitalize<string>}`

// Enhanced component props with React 19 features
export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  projection?: ProjectionName | GeoProjection
  projectionConfig?: ProjectionConfig
  className?: string
  children?: ReactNode

  // React 19 specific
  onError?: (error: Error) => void
  fallback?: ReactNode
}

// Server Component compatible geography props
export interface GeographyServerProps {
  geography: string
  children: (data: GeographyData) => ReactNode
  cache?: boolean
}
```

---

## 🚀 Implementation Checklist

### Phase 1 (Week 1-2)

- [ ] Update `package.json` peer dependencies to React 19.1.1+
- [ ] Replace `useGeographies` with `use()` hook implementation
- [ ] Add `GeographyErrorBoundary` component
- [ ] Update TypeScript configuration for React 19.1.1
- [ ] Add comprehensive tests for new patterns

### Phase 2 (Week 3-4)

- [ ] Implement `useDeferredValue` in `useZoomPan`
- [ ] Add `useTransition` for smooth interactions
- [ ] Create Server Component for geography pre-loading
- [ ] Add loading states and pending indicators
- [ ] Performance testing and optimization

### Phase 3 (Week 5-6)

- [ ] Implement Form Actions for map controls
- [ ] Add branded types for coordinates
- [ ] Create React 19 specific examples
- [ ] Update documentation and migration guide
- [ ] Final testing and performance audit

---

## 📊 Expected Benefits

1. **Performance**: 20-30% improvement in large dataset rendering
2. **Developer Experience**: Cleaner async patterns, better error handling
3. **Bundle Size**: Potential 10-15% reduction by removing compatibility code
4. **Future-Proof**: Leverages latest React patterns and optimizations
5. **Differentiation**: Becomes the go-to React 19 mapping library

---

## 🔄 Migration Strategy

Since this targets React 19-only, users migrating from the original library or your current v3.1.0 will need:

1. **React 19.1.1 upgrade** in their applications
2. **Suspense boundaries** around geography loading
3. **Error boundary** implementation for robust error handling
4. **Optional**: Server Components setup for SSR applications

This positions your fork as the **modern, cutting-edge** version while the original remains for legacy React support.
