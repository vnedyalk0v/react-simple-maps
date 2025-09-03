import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  createCoordinates,
} from '@vnedyalk0v/react19-simple-maps';
import type { Feature, Geometry } from 'geojson';

// World geography data
const geoUrl = 'https://unpkg.com/world-atlas@2/countries-110m.json';

// Major cities
const cities = [
  { name: 'New York', coordinates: createCoordinates(-74.006, 40.7128) },
  { name: 'London', coordinates: createCoordinates(-0.1276, 51.5074) },
  { name: 'Tokyo', coordinates: createCoordinates(139.6917, 35.6895) },
];

/**
 * Basic World Map Example
 *
 * This is a simple example showing how to use react19-simple-maps
 * to display a world map with clickable countries and city markers.
 */
const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleGeographyClick = (geography: Feature<Geometry>) => {
    const countryName =
      geography.properties?.NAME || geography.properties?.name || 'Unknown';
    setSelectedCountry(countryName);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Basic World Map</h1>
        <p>A simple example using react19-simple-maps v1.0.4</p>
        {selectedCountry && (
          <div className="status">
            Selected: <strong>{selectedCountry}</strong>
          </div>
        )}
      </div>

      <div className="map-container">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 147,
            center: createCoordinates(0, 0),
          }}
          width={800}
          height={500}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              if (!geographies || geographies.length === 0) {
                return (
                  <text x="400" y="250" textAnchor="middle" fill="red">
                    No geography data
                  </text>
                );
              }

              return geographies.map((geo, index) => {
                const countryName =
                  geo.properties?.NAME || geo.properties?.name;

                return (
                  <Geography
                    key={countryName || geo.id || index}
                    geography={geo}
                    onClick={() => handleGeographyClick(geo)}
                    style={{
                      default: {
                        fill:
                          selectedCountry === countryName
                            ? '#B3D9FF'
                            : '#D6D6DA',
                        outline: 'none',
                        stroke: '#FFFFFF',
                        strokeWidth: 0.5,
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
                );
              });
            }}
          </Geographies>

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
                  pointerEvents: 'none',
                }}
              >
                {city.name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div className="info">
        <h3>How to use</h3>
        <ul>
          <li>Click on any country to select it</li>
          <li>The selected country will be highlighted in blue</li>
          <li>City markers show major cities around the world</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
