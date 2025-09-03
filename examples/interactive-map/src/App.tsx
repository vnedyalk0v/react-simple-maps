import React, { useState, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation,
  createCoordinates,
} from '@vnedyalk0v/react19-simple-maps';
import type { GeographyProps, Position } from '@vnedyalk0v/react19-simple-maps';

// URL to world geography data (using unpkg for better CORS support)
const geoUrl = 'https://unpkg.com/world-atlas@2/countries-110m.json';

/**
 * BEST PRACTICE: Use the createCoordinates utility from the library
 * This ensures proper branded typing and prevents coordinate errors
 */

// Major world cities with coordinates
const cities = [
  { name: 'New York', coordinates: createCoordinates(-74.006, 40.7128) },
  { name: 'London', coordinates: createCoordinates(-0.1276, 51.5074) },
  { name: 'Tokyo', coordinates: createCoordinates(139.6917, 35.6895) },
  { name: 'Sydney', coordinates: createCoordinates(151.2093, -33.8688) },
  { name: 'São Paulo', coordinates: createCoordinates(-46.6333, -23.5505) },
  { name: 'Cairo', coordinates: createCoordinates(31.2357, 30.0444) },
  { name: 'Mumbai', coordinates: createCoordinates(72.8777, 19.076) },
  { name: 'Beijing', coordinates: createCoordinates(116.4074, 39.9042) },
  { name: 'Lagos', coordinates: createCoordinates(3.3792, 6.5244) },
  { name: 'Mexico City', coordinates: createCoordinates(-99.1332, 19.4326) },
];

const App: React.FC = () => {
  const [position, setPosition] = useState<Position>({
    coordinates: createCoordinates(0, 0),
    zoom: 1,
  });
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleMoveEnd = useCallback((position: Position) => {
    setPosition(position);
  }, []);

  const handleGeographyClick = useCallback(
    (geography: GeographyProps['geography']) => {
      const countryName = geography.properties?.NAME || 'Unknown';
      setSelectedCountry(countryName);
      console.log('Selected country:', countryName);
    },
    [],
  );

  const handleReset = useCallback(() => {
    setPosition({ coordinates: createCoordinates(0, 0), zoom: 1 });
    setSelectedCountry(null);
  }, []);

  // Memoized click handler factory to prevent recreation on each render
  const createGeographyClickHandler = useCallback(
    (geography: GeographyProps['geography']) => () => {
      handleGeographyClick(geography);
    },
    [handleGeographyClick],
  );

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
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo, index) => (
                  <Geography
                    key={geo.properties?.NAME || `geo-${index}`}
                    geography={geo}
                    onClick={createGeographyClickHandler(geo)}
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
              <Marker key={name} coordinates={coordinates}>
                <circle r={4} fill="#4ECDC4" stroke="#fff" strokeWidth={2} />
              </Marker>
            ))}

            {/* City Annotations */}
            {position.zoom > 2 &&
              cities.map(({ name, coordinates }) => (
                <Annotation
                  key={`${name}-annotation`}
                  subject={coordinates}
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
