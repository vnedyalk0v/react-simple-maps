import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation,
} from '@vnedyalk0v/react19-simple-maps';
import type { GeographyProps, Position } from '@vnedyalk0v/react19-simple-maps';

// Simple inline geography data for testing
const geoData = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { NAME: 'North America' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-100, 40],
            [-80, 40],
            [-80, 60],
            [-100, 60],
            [-100, 40],
          ],
        ],
      },
    },
    {
      type: 'Feature' as const,
      properties: { NAME: 'Europe' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [0, 45],
            [20, 45],
            [20, 65],
            [0, 65],
            [0, 45],
          ],
        ],
      },
    },
    {
      type: 'Feature' as const,
      properties: { NAME: 'Asia' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [80, 20],
            [120, 20],
            [120, 60],
            [80, 60],
            [80, 20],
          ],
        ],
      },
    },
  ],
};

// Major cities with coordinates
const cities = [
  { name: 'New York', coordinates: [-74.006, 40.7128] as [number, number] },
  { name: 'London', coordinates: [-0.1276, 51.5074] as [number, number] },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] as [number, number] },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] as [number, number] },
  { name: 'São Paulo', coordinates: [-46.6333, -23.5505] as [number, number] },
];

const App: React.FC = () => {
  const [position, setPosition] = useState<Position>({
    coordinates: [0, 0] as any,
    zoom: 1,
  });
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleMoveEnd = (position: Position) => {
    setPosition(position);
  };

  const handleGeographyClick = (geography: GeographyProps['geography']) => {
    const countryName = geography.properties?.NAME || 'Unknown';
    setSelectedCountry(countryName);
    console.log('Selected country:', countryName);
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 0] as any, zoom: 1 });
    setSelectedCountry(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Interactive World Map</h1>
        <p>
          Zoom, pan, and click to explore. Built with TypeScript and React 19.
        </p>
      </div>

      <div className="controls">
        <div className="info-panel">
          <h3>Map Position</h3>
          <p>
            Center: [{position.coordinates[0].toFixed(2)},{' '}
            {position.coordinates[1].toFixed(2)}]
          </p>
          <p>Zoom: {position.zoom.toFixed(2)}x</p>
          {selectedCountry && (
            <p>
              Selected: <strong>{selectedCountry}</strong>
            </p>
          )}
        </div>
        <button onClick={handleReset} className="reset-button">
          Reset View
        </button>
      </div>

      <div className="map-container">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 147,
            center: [0, 0],
          }}
          width={900}
          height={600}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            minZoom={0.5}
            maxZoom={8}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo, index) => (
                  <Geography
                    key={geo.properties?.NAME || `geo-${index}`}
                    geography={geo}
                    onClick={() => handleGeographyClick(geo)}
                    style={{
                      default: {
                        fill:
                          selectedCountry === geo.properties?.NAME
                            ? '#FF6B6B'
                            : '#D6D6DA',
                        outline: 'none',
                        transition: 'fill 0.2s ease-in-out',
                      },
                      hover: {
                        fill: '#F53',
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#E42',
                        outline: 'none',
                      },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* City Markers */}
            {cities.map(({ name, coordinates }) => (
              <Marker key={name} coordinates={coordinates as any}>
                <circle r={4} fill="#4ECDC4" stroke="#fff" strokeWidth={2} />
              </Marker>
            ))}

            {/* City Annotations */}
            {position.zoom > 2 &&
              cities.map(({ name, coordinates }) => (
                <Annotation
                  key={`${name}-annotation`}
                  subject={coordinates as any}
                  dx={-90}
                  dy={-30}
                  connectorProps={{
                    stroke: '#4ECDC4',
                    strokeWidth: 2,
                    strokeLinecap: 'round',
                  }}
                >
                  <text
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fill="#4ECDC4"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {name}
                  </text>
                </Annotation>
              ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="features">
        <h3>Interactive Features</h3>
        <ul>
          <li>
            <strong>Zoom & Pan:</strong> Use mouse wheel to zoom, drag to pan
          </li>
          <li>
            <strong>Click Countries:</strong> Click any country to select it
          </li>
          <li>
            <strong>City Markers:</strong> Major cities are marked with circles
          </li>
          <li>
            <strong>Dynamic Labels:</strong> City names appear when zoomed in
          </li>
          <li>
            <strong>TypeScript:</strong> Full type safety throughout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
