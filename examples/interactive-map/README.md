# Interactive Map Example

An advanced TypeScript example showcasing zoom, pan, markers, and annotations with react-simple-maps v3.0.

## Features

- ✅ **Zoom & Pan**: Interactive map navigation with mouse/touch
- ✅ **Country Selection**: Click countries to select them
- ✅ **City Markers**: Major world cities with custom markers
- ✅ **Dynamic Annotations**: City labels that appear when zoomed in
- ✅ **Real-time Position**: Live display of map center and zoom level
- ✅ **TypeScript**: Full type safety with React 19
- ✅ **Modern Styling**: Glass morphism design with gradients

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Key Features Demonstrated

### 1. ZoomableGroup with Position Tracking

```tsx
const [position, setPosition] = useState<Position>({ coordinates: [0, 0], zoom: 1 })

<ZoomableGroup
  zoom={position.zoom}
  center={position.coordinates}
  onMoveEnd={handleMoveEnd}
  minZoom={0.5}
  maxZoom={8}
>
```

### 2. Interactive Geography Selection

```tsx
const handleGeographyClick = (geography: GeographyProps['geography']) => {
  const countryName = geography.properties?.NAME || 'Unknown';
  setSelectedCountry(countryName);
};
```

### 3. Conditional Rendering Based on Zoom

```tsx
{
  position.zoom > 2 &&
    cities.map(({ name, coordinates }) => (
      <Annotation key={`${name}-annotation`} subject={coordinates}>
        <text>{name}</text>
      </Annotation>
    ));
}
```

### 4. Custom Markers with TypeScript

```tsx
const cities = [
  { name: 'New York', coordinates: [-74.006, 40.7128] as [number, number] },
  // ... more cities
];

{
  cities.map(({ name, coordinates }) => (
    <Marker key={name} coordinates={coordinates}>
      <circle r={4} fill="#4ECDC4" stroke="#fff" strokeWidth={2} />
    </Marker>
  ));
}
```

## TypeScript Benefits

- **Type-safe coordinates**: Proper typing for longitude/latitude pairs
- **Event handler types**: Fully typed geography and event objects
- **Position interface**: Structured zoom and center state
- **Component props**: IntelliSense for all component properties

## Styling Features

- **Glass morphism**: Modern backdrop-filter effects
- **Smooth transitions**: CSS transitions for hover states
- **Responsive design**: Adapts to different screen sizes
- **Interactive feedback**: Visual feedback for all interactions

## Learn More

- [ZoomableGroup Documentation](https://www.react-simple-maps.io/docs/zoomable-group/)
- [Marker Documentation](https://www.react-simple-maps.io/docs/marker/)
- [Annotation Documentation](https://www.react-simple-maps.io/docs/annotation/)
