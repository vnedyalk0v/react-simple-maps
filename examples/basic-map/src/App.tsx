import React, {
  Suspense,
  useDeferredValue,
  useState,
  useCallback,
  memo,
} from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  GeographyErrorBoundary,
  Marker,
  createCoordinates,
} from '@vnedyalk0v/react19-simple-maps';
import type { GeographyProps } from '@vnedyalk0v/react19-simple-maps';

// URL to world geography data (using unpkg for better CORS support)
const geoUrl = 'https://unpkg.com/world-atlas@2/countries-110m.json';

/**
 * BEST PRACTICE: Use branded coordinate types for type safety
 * The createCoordinates function from the library ensures proper typing
 * and prevents accidentally swapping longitude and latitude values
 */

/**
 * Major world cities for markers
 *
 * BEST PRACTICE: Define static data outside components to prevent recreation
 * Using 'as const' ensures the array is readonly and coordinates are immutable
 */
const cities = [
  { name: 'New York', coordinates: createCoordinates(-74.006, 40.7128) },
  { name: 'London', coordinates: createCoordinates(-0.1276, 51.5074) },
  { name: 'Tokyo', coordinates: createCoordinates(139.6917, 35.6895) },
  { name: 'Sydney', coordinates: createCoordinates(151.2093, -33.8688) },
  { name: 'São Paulo', coordinates: createCoordinates(-46.6333, -23.5505) },
] as const;

// Memoized Geography component for better performance
const MemoizedGeography = memo(
  ({
    geography,
    onClick,
    isSelected,
  }: {
    geography: GeographyProps['geography'];
    onClick: () => void;
    isSelected: boolean;
  }) => (
    <Geography
      geography={geography}
      onClick={onClick}
      style={{
        default: {
          fill: isSelected ? '#B3D9FF' : '#D6D6DA',
          outline: 'none',
          transition: 'fill 0.2s ease',
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
  ),
);

// Add display name for React DevTools
MemoizedGeography.displayName = 'MemoizedGeography';

/**
 * Main App component demonstrating React Simple Maps best practices
 *
 * BEST PRACTICES DEMONSTRATED:
 * - React 19 concurrent features (useDeferredValue)
 * - Proper event handler memoization
 * - Error boundary integration
 * - Performance optimization with memo
 * - Branded coordinate types
 * - Accessibility support
 */
const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  /**
   * PERFORMANCE OPTIMIZATION: Use deferred value for better performance
   * This prevents expensive re-renders during rapid state changes
   * React 19 feature for concurrent rendering
   */
  const deferredSelectedCountry = useDeferredValue(selectedCountry);

  /**
   * MEMOIZATION: Event handlers are wrapped with useCallback
   * This prevents unnecessary re-renders of child components
   */
  const handleGeographyClick = useCallback(
    (geography: GeographyProps['geography']) => {
      const countryName = geography.properties?.NAME || 'Unknown';
      setSelectedCountry(countryName);
      console.log('Clicked on:', countryName);
    },
    [],
  );

  /**
   * ERROR HANDLING: Proper error handling for geography loading
   * In production, you might want to send errors to a monitoring service
   */
  const handleGeographyError = useCallback((error: Error) => {
    console.error('Geography loading error:', error.message);
    // In production: errorReporting.captureException(error);
  }, []);

  const handleMarkerHover = useCallback(
    (cityName: string, isHovering: boolean) => {
      setHoveredMarker(isHovering ? cityName : null);
    },
    [],
  );

  // Memoized click handler factory to prevent recreation on each render
  const createGeographyClickHandler = useCallback(
    (geography: GeographyProps['geography']) => () => {
      handleGeographyClick(geography);
    },
    [handleGeographyClick],
  );

  // Memoized marker event handlers to prevent recreation
  const createMarkerEnterHandler = useCallback(
    (cityName: string) => () => {
      handleMarkerHover(cityName, true);
    },
    [handleMarkerHover],
  );

  const createMarkerLeaveHandler = useCallback(
    (cityName: string) => () => {
      handleMarkerHover(cityName, false);
    },
    [handleMarkerHover],
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Basic World Map</h1>
        <p>
          A modern TypeScript example using react19-simple-maps v1.0 with error
          boundaries
        </p>
        {deferredSelectedCountry && (
          <div className="status">
            Selected: <strong>{deferredSelectedCountry}</strong>
          </div>
        )}
        {hoveredMarker && (
          <div className="status">
            Hovering: <strong>{hoveredMarker}</strong>
          </div>
        )}
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
          role="img"
          aria-label="Interactive world map showing countries and major cities"
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
                    <MemoizedGeography
                      key={geo.properties?.NAME || `geo-${index}`}
                      geography={geo}
                      onClick={createGeographyClickHandler(geo)}
                      isSelected={
                        deferredSelectedCountry ===
                        (geo.properties?.NAME || 'Unknown')
                      }
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
                r={hoveredMarker === city.name ? 6 : 4}
                fill={hoveredMarker === city.name ? '#E42' : '#F53'}
                stroke="#fff"
                strokeWidth={2}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={createMarkerEnterHandler(city.name)}
                onMouseLeave={createMarkerLeaveHandler(city.name)}
              />
              <text
                textAnchor="middle"
                y={-10}
                style={{
                  fontFamily: 'system-ui',
                  fontSize: hoveredMarker === city.name ? '13px' : '12px',
                  fill: '#333',
                  fontWeight: 'bold',
                  transition: 'font-size 0.2s ease',
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
        <h3>Modern React 19 Features</h3>
        <p>
          This example demonstrates modern React 19 patterns in
          react19-simple-maps v1.0:
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
            <strong>useDeferredValue:</strong> Smooth interactions with deferred
            state updates
          </li>
          <li>
            <strong>useCallback & memo:</strong> Optimized re-renders for better
            performance
          </li>
          <li>
            <strong>TypeScript:</strong> Full type safety with strict typing
          </li>
          <li>
            <strong>Accessibility:</strong> ARIA labels and semantic HTML
            structure
          </li>
        </ul>
        <p>
          Click on any country to see it highlighted and displayed in the
          status. Hover over city markers to see smooth animations and status
          updates. Try changing the geography URL to an invalid one to see error
          boundary in action.
        </p>
      </div>
    </div>
  );
};

export default App;
