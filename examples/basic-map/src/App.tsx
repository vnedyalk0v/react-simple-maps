import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import type { GeographyProps } from 'react-simple-maps'

// URL to a valid TopoJSON file
const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json'

const App: React.FC = () => {
  const handleGeographyClick = (geography: GeographyProps['geography']) => {
    console.log('Clicked on:', geography.properties?.NAME || 'Unknown')
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Basic World Map</h1>
        <p>A simple TypeScript example using react-simple-maps v3.0</p>
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
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
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
        </ComposableMap>
      </div>

      <div className="info">
        <h3>TypeScript Features</h3>
        <p>
          This example demonstrates full TypeScript support in react-simple-maps v3.0.
          Click on any country to see the typed event handler in action (check the console).
          All components are fully typed with proper interfaces and generics.
        </p>
      </div>
    </div>
  )
}

export default App
