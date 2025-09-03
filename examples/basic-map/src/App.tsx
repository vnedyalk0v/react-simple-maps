import React, { Suspense } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  GeographyErrorBoundary,
  Marker,
} from '@vnedyalk0v/react19-simple-maps';
import type { GeographyProps } from '@vnedyalk0v/react19-simple-maps';

// URL to world geography data (110m resolution for better performance)
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Major world cities for markers
const cities = [
  { name: 'New York', coordinates: [-74.006, 40.7128] as any },
  { name: 'London', coordinates: [-0.1276, 51.5074] as any },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] as any },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] as any },
  { name: 'São Paulo', coordinates: [-46.6333, -23.5505] as any },
];

const App: React.FC = () => {
  const handleGeographyClick = (geography: GeographyProps['geography']) => {
    console.log('Clicked on:', geography.properties?.NAME || 'Unknown');
  };

  const handleGeographyError = (error: Error) => {
    console.error('Geography loading error:', error.message);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Basic World Map</h1>
        <p>
          A modern TypeScript example using react19-simple-maps v1.0 with error
          boundaries
        </p>
      </div>

      <div className="map-container">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 147,
            center: [0, 0],
          }}
          width={800}
          height={500}
        >
          <GeographyErrorBoundary onError={handleGeographyError}>
            <Suspense
              fallback={
                <text x="400" y="250" textAnchor="middle" fill="#666">
                  Loading map data...
                </text>
              }
            >
              <Geographies
                geography={geoUrl}
                errorBoundary={true}
                onGeographyError={handleGeographyError}
              >
                {({ geographies }) =>
                  geographies.map((geo, index) => (
                    <Geography
                      key={geo.properties?.NAME || `geo-${index}`}
                      geography={geo}
                      onClick={() => handleGeographyClick(geo)}
                      style={{
                        default: {
                          fill: '#D6D6DA',
                          outline: 'none',
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
            </Suspense>
          </GeographyErrorBoundary>

          {/* City markers */}
          {cities.map((city) => (
            <Marker key={city.name} coordinates={city.coordinates}>
              <circle
                r={4}
                fill="#F53"
                stroke="#fff"
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
              />
              <text
                textAnchor="middle"
                y={-10}
                style={{
                  fontFamily: 'system-ui',
                  fontSize: '12px',
                  fill: '#333',
                  fontWeight: 'bold',
                }}
              >
                {city.name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div className="info">
        <h3>Modern React Features</h3>
        <p>
          This example demonstrates modern React patterns in react19-simple-maps
          v1.0:
        </p>
        <ul>
          <li>
            <strong>Error Boundaries:</strong> Graceful error handling for
            geography loading failures
          </li>
          <li>
            <strong>Suspense:</strong> Loading states with fallback UI
          </li>
          <li>
            <strong>TypeScript:</strong> Full type safety with strict typing
          </li>
          <li>
            <strong>Modern Hooks:</strong> Efficient data fetching with caching
          </li>
        </ul>
        <p>
          Click on any country to see the typed event handler in action (check
          the console). Try changing the geography URL to an invalid one to see
          error boundary in action.
        </p>
      </div>
    </div>
  );
};

export default App;
