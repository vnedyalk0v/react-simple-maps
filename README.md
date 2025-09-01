# react-simple-maps

[![npm version](https://img.shields.io/npm/v/react-simple-maps.svg)](https://www.npmjs.com/package/react-simple-maps)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-simple-maps?color=%2328cb95&label=gzip)](https://bundlephobia.com/package/react-simple-maps)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19%20Ready-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Create beautiful SVG maps in React with d3-geo and topojson using a declarative, TypeScript-first API.

> **🍴 This is a modernized fork** of the original [react-simple-maps](https://github.com/zcreativelabs/react-simple-maps) by Richard Zimerman, enhanced with full TypeScript support, React 19 compatibility, and modern development practices by [Georgi Nedyalkov](mailto:vnedyalk0v@proton.me).

**✨ Version 3.1.0 Features:**

- 🔒 **Zero Security Vulnerabilities** - Completely secure dependencies
- 📝 **Full TypeScript Support** - Strict typing with comprehensive type definitions
- ⚛️ **React 19 Compatible** - Works with React 16.8+ through React 19
- 🚀 **Modern Build System** - ESM, CJS, and UMD builds with tree-shaking
- 🧪 **Comprehensive Testing** - 93% test coverage with 132 tests
- 📦 **Optimized Bundle** - Smaller bundle size with better performance

Read the [docs](https://www.react-simple-maps.io/docs/getting-started/), or check out the [examples](https://www.react-simple-maps.io/examples/).

## Why react-simple-maps?

`react-simple-maps` aims to make working with SVG maps in React easier. It handles tasks such as panning, zooming and simple rendering optimization, and takes advantage of parts of [d3-geo](https://github.com/d3/d3-geo) and topojson-client instead of relying on the entire d3 library.

Since `react-simple-maps` leaves DOM work to React, it can also easily be used with other libraries, such as [react-spring](https://github.com/react-spring/react-spring) and [react-annotation](https://github.com/susielu/react-annotation/).

**Key Benefits:**

- 🎯 **Declarative API** - Build maps with React components
- 🔧 **TypeScript First** - Full type safety and IntelliSense support
- 🎨 **Highly Customizable** - Style with CSS-in-JS or regular CSS
- 📱 **Touch & Mobile Ready** - Built-in pan and zoom interactions
- 🌍 **Any Map Data** - Works with any valid TopoJSON or GeoJSON
- ⚡ **Performance Optimized** - Efficient rendering and updates

## Installation

```bash
# npm
npm install react-simple-maps

# yarn
yarn add react-simple-maps

# pnpm
pnpm add react-simple-maps
```

### Requirements

- **React**: 16.8.0 or higher (including React 19)
- **TypeScript**: 4.5.0 or higher (optional but recommended)

## Quick Start

`react-simple-maps` exposes a set of components that can be combined to create SVG maps with markers and annotations. In order to render a map you have to provide a reference to a valid TopoJSON file.

### Basic Example (JavaScript)

```jsx
import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

// URL to a valid TopoJSON file
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const MapChart = () => {
  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
        }
      </Geographies>
    </ComposableMap>
  )
}

export default MapChart
```

### TypeScript Example

```tsx
import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import type { GeographyProps } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const MapChart: React.FC = () => {
  const handleGeographyClick = (geography: GeographyProps["geography"]) => {
    console.log("Clicked on:", geography.properties.NAME)
  }

  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onClick={() => handleGeographyClick(geo)}
              style={{
                default: { fill: "#D6D6DA" },
                hover: { fill: "#F53" },
                pressed: { fill: "#E42" },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  )
}

export default MapChart
```

Check out the [live example](https://codesandbox.io/s/basic-map-wvlol)

The above examples will render a world map using the [equal earth projection](https://observablehq.com/@d3/equal-earth). You can read more about this projection on [Shaded Relief](http://shadedrelief.com/ee_proj/) and on [Wikipedia](https://en.wikipedia.org/wiki/Equal_Earth_projection).

## Core Components

### ComposableMap

The main wrapper component that provides the SVG context and projection.

```tsx
import { ComposableMap } from "react-simple-maps"
;<ComposableMap
  projection="geoEqualEarth"
  projectionConfig={{
    scale: 100,
    center: [0, 0],
  }}
  width={800}
  height={600}
>
  {/* Map content */}
</ComposableMap>
```

### Geographies

Renders geographic features from TopoJSON or GeoJSON data.

```tsx
import { Geographies, Geography } from "react-simple-maps"
;<Geographies geography="/path/to/world.json">
  {({ geographies }) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)}
</Geographies>
```

### Markers & Annotations

Add custom markers and annotations to your maps.

```tsx
import { Marker, Annotation } from "react-simple-maps";

<Marker coordinates={[-74.006, 40.7128]}>
  <circle r={5} fill="#F53" />
</Marker>

<Annotation
  subject={[-74.006, 40.7128]}
  dx={-90}
  dy={-30}
  connectorProps={{
    stroke: "#FF5533",
    strokeWidth: 2,
    strokeLinecap: "round"
  }}
>
  <text textAnchor="end" alignmentBaseline="middle" fill="#F53">
    New York City
  </text>
</Annotation>
```

## TypeScript Support

react-simple-maps v3.0 includes comprehensive TypeScript definitions. All components are fully typed with proper generics and interfaces.

```tsx
import type {
  ComposableMapProps,
  GeographyProps,
  MarkerProps,
  ProjectionConfig,
} from "react-simple-maps"

// Custom projection configuration
const projectionConfig: ProjectionConfig = {
  scale: 147,
  center: [0, 0],
  rotate: [0, 0, 0],
}

// Typed event handlers
const handleGeographyClick = (
  geography: GeographyProps["geography"],
  event: React.MouseEvent<SVGPathElement>
) => {
  console.log("Country:", geography.properties.NAME)
}
```

## Map Data Sources

react-simple-maps does not restrict you to one specific map and relies on custom map files that you can modify in any way necessary for the project. This means that you can visualize countries, regions, and continents in various resolutions, as long as they can be represented using GeoJSON/TopoJSON.

**Recommended Sources:**

- 🌍 [Natural Earth](https://github.com/nvkelso/natural-earth-vector) - High-quality public domain map data
- 🗺️ [TopoJSON maps by @deldersveld](https://github.com/deldersveld/topojson) - Ready-to-use TopoJSON files
- 🌐 [TopoJSON world atlas](https://github.com/topojson/world-atlas) - World and country boundaries
- 📊 [World Bank boundaries](https://datahelpdesk.worldbank.org/knowledgebase/articles/902061) - Official country boundaries

**Creating Custom Maps:**
To learn how to make your own TopoJSON maps from shapefiles, read ["How to convert and prepare TopoJSON files for interactive mapping with d3"](https://hackernoon.com/how-to-convert-and-prepare-topojson-files-for-interactive-mapping-with-d3-499cf0ced5f).

## Advanced Features

### Zoom and Pan

```tsx
import { ComposableMap, ZoomableGroup } from "react-simple-maps"
;<ComposableMap>
  <ZoomableGroup zoom={1} center={[0, 0]}>
    {/* Map content */}
  </ZoomableGroup>
</ComposableMap>
```

### Custom Projections

```tsx
import { geoMercator } from "d3-geo"

const customProjection = geoMercator().scale(100).translate([400, 300])

;<ComposableMap projection={customProjection}>{/* Map content */}</ComposableMap>
```

### Styling with CSS-in-JS

```tsx
const geographyStyle = {
  default: {
    fill: "#D6D6DA",
    outline: "none",
  },
  hover: {
    fill: "#F53",
    outline: "none",
  },
  pressed: {
    fill: "#E42",
    outline: "none",
  },
}

;<Geography geography={geo} style={geographyStyle} />
```

## Migration from v2.x

Version 3.0 includes breaking changes. See our [Migration Guide](./MIGRATION.md) for detailed upgrade instructions.

**Key Changes:**

- Full TypeScript rewrite with strict typing
- React 19 compatibility
- Modern build system (ESM/CJS/UMD)
- Updated D3 dependencies
- Improved performance and bundle size

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/vnedyalk0v/react-simple-maps.git
cd react-simple-maps

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## License

MIT licensed. Original work Copyright (c) Richard Zimerman 2017. Fork enhancements Copyright (c) Georgi Nedyalkov 2025. See [LICENSE](./LICENSE) for more details.

---

**Links:**

- 📖 [Original Documentation](https://www.react-simple-maps.io/docs/getting-started/)
- 🎯 [Original Examples](https://www.react-simple-maps.io/examples/)
- 🍴 [This Fork](https://github.com/vnedyalk0v/react-simple-maps)
- 🐛 [Issues](https://github.com/vnedyalk0v/react-simple-maps/issues)
- 💬 [Discussions](https://github.com/vnedyalk0v/react-simple-maps/discussions)
- 📧 [Maintainer](mailto:vnedyalk0v@proton.me)
