# API Reference

Complete TypeScript API reference for react-simple-maps v3.0.

## Components

### ComposableMap

The main wrapper component that provides the SVG context and projection.

```tsx
import { ComposableMap } from 'react-simple-maps';
import type { ComposableMapProps } from 'react-simple-maps';
```

#### Props

| Prop               | Type                 | Default           | Description                                      |
| ------------------ | -------------------- | ----------------- | ------------------------------------------------ |
| `width`            | `number`             | `800`             | Width of the SVG element                         |
| `height`           | `number`             | `600`             | Height of the SVG element                        |
| `projection`       | `string \| Function` | `"geoEqualEarth"` | D3 projection name or custom projection function |
| `projectionConfig` | `ProjectionConfig`   | `{}`              | Configuration for the projection                 |
| `className`        | `string`             | `""`              | CSS class name                                   |
| `style`            | `CSSProperties`      | `{}`              | Inline styles                                    |

#### ProjectionConfig

```tsx
interface ProjectionConfig {
  center?: [number, number];
  rotate?: [number, number, number];
  scale?: number;
  parallels?: [number, number];
}
```

#### Example

```tsx
<ComposableMap
  projection="geoMercator"
  projectionConfig={{
    scale: 100,
    center: [0, 0],
    rotate: [0, 0, 0],
  }}
  width={900}
  height={600}
>
  {/* Map content */}
</ComposableMap>
```

### Geographies

Renders geographic features from TopoJSON or GeoJSON data.

```tsx
import { Geographies } from 'react-simple-maps';
import type { GeographiesProps } from 'react-simple-maps';
```

#### Props

| Prop               | Type                                               | Default      | Description                                 |
| ------------------ | -------------------------------------------------- | ------------ | ------------------------------------------- |
| `geography`        | `string \| object \| Array`                        | **required** | URL to TopoJSON/GeoJSON file or data object |
| `parseGeographies` | `(geographies: any[]) => any[]`                    | `undefined`  | Function to parse/filter geographies        |
| `children`         | `({ geographies, outline, borders }) => ReactNode` | **required** | Render prop function                        |

#### Render Prop Arguments

```tsx
interface GeographiesRenderProps {
  geographies: PreparedFeature[];
  outline: string;
  borders: string;
}
```

#### Example

```tsx
<Geographies geography="/world.json">
  {({ geographies }) =>
    geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
  }
</Geographies>
```

### Geography

Renders individual geographic features (countries, states, etc.).

```tsx
import { Geography } from 'react-simple-maps';
import type { GeographyProps } from 'react-simple-maps';
```

#### Props

| Prop           | Type                         | Default      | Description                                 |
| -------------- | ---------------------------- | ------------ | ------------------------------------------- |
| `geography`    | `PreparedFeature`            | **required** | Geography data from Geographies render prop |
| `style`        | `GeographyStyle`             | `{}`         | Styles for different states                 |
| `className`    | `string`                     | `""`         | CSS class name                              |
| Event handlers | `(geography, event) => void` | `undefined`  | Mouse and focus event handlers              |

#### GeographyStyle

```tsx
interface GeographyStyle {
  default?: CSSProperties;
  hover?: CSSProperties;
  pressed?: CSSProperties;
}
```

#### Event Handlers

- `onClick`
- `onMouseEnter`
- `onMouseLeave`
- `onMouseDown`
- `onMouseUp`
- `onFocus`
- `onBlur`

#### Example

```tsx
<Geography
  geography={geo}
  onClick={(geography, event) => {
    console.log('Clicked:', geography.properties?.NAME);
  }}
  style={{
    default: { fill: '#D6D6DA' },
    hover: { fill: '#F53' },
    pressed: { fill: '#E42' },
  }}
/>
```

### ZoomableGroup

Provides zoom and pan functionality for map content.

```tsx
import { ZoomableGroup } from 'react-simple-maps';
import type { ZoomableGroupProps, Position } from 'react-simple-maps';
```

#### Props

| Prop              | Type                                   | Default     | Description                      |
| ----------------- | -------------------------------------- | ----------- | -------------------------------- |
| `zoom`            | `number`                               | `1`         | Initial zoom level               |
| `center`          | `[number, number]`                     | `[0, 0]`    | Initial center coordinates       |
| `minZoom`         | `number`                               | `1`         | Minimum zoom level               |
| `maxZoom`         | `number`                               | `8`         | Maximum zoom level               |
| `translateExtent` | `[[number, number], [number, number]]` | `undefined` | Constrain panning area           |
| `onMoveStart`     | `(position: Position) => void`         | `undefined` | Called when zoom/pan starts      |
| `onMove`          | `(position: Position) => void`         | `undefined` | Called during zoom/pan           |
| `onMoveEnd`       | `(position: Position) => void`         | `undefined` | Called when zoom/pan ends        |
| `filterZoomEvent` | `(event: any) => boolean`              | `undefined` | Filter which events trigger zoom |

#### Position Interface

```tsx
interface Position {
  coordinates: [number, number];
  zoom: number;
}
```

#### Example

```tsx
const [position, setPosition] = useState<Position>({
  coordinates: [0, 0],
  zoom: 1
})

<ZoomableGroup
  zoom={position.zoom}
  center={position.coordinates}
  onMoveEnd={setPosition}
  minZoom={0.5}
  maxZoom={8}
>
  {/* Zoomable content */}
</ZoomableGroup>
```

### Marker

Places custom markers at specific coordinates.

```tsx
import { Marker } from 'react-simple-maps';
import type { MarkerProps } from 'react-simple-maps';
```

#### Props

| Prop           | Type               | Default      | Description                    |
| -------------- | ------------------ | ------------ | ------------------------------ |
| `coordinates`  | `[number, number]` | **required** | Longitude and latitude         |
| `style`        | `CSSProperties`    | `{}`         | Inline styles                  |
| `className`    | `string`           | `""`         | CSS class name                 |
| Event handlers | `(event) => void`  | `undefined`  | Mouse and focus event handlers |

#### Example

```tsx
<Marker coordinates={[-74.006, 40.7128]}>
  <circle r={5} fill="#F53" />
  <text textAnchor="middle" y={-10} fontSize={12}>
    NYC
  </text>
</Marker>
```

### Annotation

Creates annotations with leaders pointing to specific locations.

```tsx
import { Annotation } from 'react-simple-maps';
import type { AnnotationProps } from 'react-simple-maps';
```

#### Props

| Prop             | Type                       | Default      | Description                |
| ---------------- | -------------------------- | ------------ | -------------------------- |
| `subject`        | `[number, number]`         | **required** | Target coordinates         |
| `dx`             | `number`                   | `0`          | Horizontal offset          |
| `dy`             | `number`                   | `0`          | Vertical offset            |
| `curve`          | `number`                   | `0`          | Curve amount for connector |
| `connectorProps` | `SVGProps<SVGPathElement>` | `{}`         | Props for connector line   |
| `style`          | `CSSProperties`            | `{}`         | Inline styles              |
| `className`      | `string`                   | `""`         | CSS class name             |

#### Example

```tsx
<Annotation
  subject={[-74.006, 40.7128]}
  dx={-90}
  dy={-30}
  connectorProps={{
    stroke: '#FF5533',
    strokeWidth: 2,
    strokeLinecap: 'round',
  }}
>
  <text textAnchor="end" alignmentBaseline="middle" fill="#F53">
    New York City
  </text>
</Annotation>
```

### Graticule

Renders coordinate grid lines.

```tsx
import { Graticule } from 'react-simple-maps';
import type { GraticuleProps } from 'react-simple-maps';
```

#### Props

| Prop          | Type               | Default         | Description              |
| ------------- | ------------------ | --------------- | ------------------------ |
| `step`        | `[number, number]` | `[10, 10]`      | Step size for grid lines |
| `stroke`      | `string`           | `"#E4E5E6"`     | Stroke color             |
| `strokeWidth` | `number`           | `0.5`           | Stroke width             |
| `fill`        | `string`           | `"transparent"` | Fill color               |

#### Example

```tsx
<Graticule step={[10, 10]} stroke="#E4E5E6" strokeWidth={0.5} />
```

### Sphere

Renders the outline of the Earth sphere.

```tsx
import { Sphere } from 'react-simple-maps';
import type { SphereProps } from 'react-simple-maps';
```

#### Props

| Prop          | Type     | Default         | Description               |
| ------------- | -------- | --------------- | ------------------------- |
| `id`          | `string` | `"rsm-sphere"`  | ID for the sphere element |
| `fill`        | `string` | `"transparent"` | Fill color                |
| `stroke`      | `string` | `"#E4E5E6"`     | Stroke color              |
| `strokeWidth` | `number` | `0.5`           | Stroke width              |

#### Example

```tsx
<Sphere fill="#E4E5E6" stroke="#D6D6DA" strokeWidth={0.5} />
```

## Hooks

### useGeographies

Hook for loading and processing geography data.

```tsx
import { useGeographies } from 'react-simple-maps';
import type { UseGeographiesProps } from 'react-simple-maps';
```

#### Parameters

```tsx
interface UseGeographiesProps {
  geography: string | object | Array<any>;
  parseGeographies?: (geographies: any[]) => any[];
}
```

#### Returns

```tsx
interface UseGeographiesReturn {
  geographies: PreparedFeature[];
  outline: string;
  borders: string;
}
```

#### Example

```tsx
const { geographies, outline, borders } = useGeographies({
  geography: '/world.json',
  parseGeographies: (geos) =>
    geos.filter((geo) => geo.properties.POP_EST > 1000000),
});
```

### useZoomPan

Hook for zoom and pan functionality.

```tsx
import { useZoomPan } from 'react-simple-maps';
import type { UseZoomPanProps } from 'react-simple-maps';
```

#### Parameters

```tsx
interface UseZoomPanProps {
  center: [number, number];
  zoom?: number;
  scaleExtent?: [number, number];
  translateExtent?: [[number, number], [number, number]];
  onMoveStart?: (position: Position) => void;
  onMove?: (position: Position) => void;
  onMoveEnd?: (position: Position) => void;
  filterZoomEvent?: (event: any) => boolean;
}
```

#### Returns

```tsx
interface UseZoomPanReturn {
  mapRef: RefObject<SVGGElement>;
  transformString: string;
  position: Position;
}
```

#### Example

```tsx
const { mapRef, transformString, position } = useZoomPan({
  center: [0, 0],
  zoom: 1,
  onMoveEnd: (position) => console.log('New position:', position),
});
```

## Context

### MapProvider & useMapContext

Provides map context including projection and path functions.

```tsx
import { MapProvider, useMapContext } from 'react-simple-maps';
import type { MapContextType } from 'react-simple-maps';
```

#### MapContextType

```tsx
interface MapContextType {
  width: number;
  height: number;
  projection: Function;
  path: Function;
}
```

### ZoomPanProvider & useZoomPanContext

Provides zoom and pan context.

```tsx
import { ZoomPanProvider, useZoomPanContext } from 'react-simple-maps';
import type { ZoomPanContextType } from 'react-simple-maps';
```

## Type Definitions

### Core Types

```tsx
// Geographic feature with SVG path
interface PreparedFeature {
  type: string;
  geometry: any;
  properties: any;
  svgPath: string;
  rsmKey: string;
}

// Map position and zoom state
interface Position {
  coordinates: [number, number];
  zoom: number;
}

// Zoom/pan transform state
interface ZoomPanState {
  x: number;
  y: number;
  k: number;
}

// Geography data types
type GeographyData = string | object | Array<any>;
```

### Event Handler Types

```tsx
// Geography event handlers
type GeographyEventHandler = (
  geography: PreparedFeature,
  event: React.MouseEvent<SVGPathElement>,
) => void;

// Marker event handlers
type MarkerEventHandler = (event: React.MouseEvent<SVGGElement>) => void;

// Position change handlers
type PositionChangeHandler = (position: Position) => void;
```

## Utility Functions

### Projection Utilities

```tsx
import { getCoords, prepareFeatures, getMesh } from 'react-simple-maps';

// Convert screen coordinates to geographic coordinates
const coords = getCoords(width, height, transform);

// Prepare features with SVG paths
const features = prepareFeatures(rawFeatures, pathFunction);

// Extract mesh data from topology
const mesh = getMesh(topology);
```

This API reference covers all the main components, hooks, and types available in react-simple-maps v3.0. For more detailed examples and guides, see the [documentation](https://www.react-simple-maps.io/) and [examples](./examples/).
