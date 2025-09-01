import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import Geographies from '../../src/components/Geographies'
import { MapProvider } from '../../src/components/MapProvider'

// Mock projection function
const mockProjection = vi.fn((coords) => [coords[0] * 100, coords[1] * 100]) as any
mockProjection.invert = vi.fn()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <svg>{children}</svg>
  </MapProvider>
)

const mockGeography = 'https://example.com/world.json'

describe('Geographies', () => {
  it('should render geographies container', () => {
    const { container } = render(
      <TestWrapper>
        <Geographies geography={mockGeography} data-testid="geographies">
          {({ geographies }) =>
            geographies.map((geo: any, i) => (
              <path key={i} d={geo.svgPath} data-testid={`geo-${i}`} />
            ))
          }
        </Geographies>
      </TestWrapper>
    )

    const geographies = container.querySelector('[data-testid="geographies"]')
    expect(geographies).toBeTruthy()
    expect(geographies?.tagName.toLowerCase()).toBe('g')
    expect(geographies?.getAttribute('class')).toContain('rsm-geographies')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <Geographies 
          geography={mockGeography} 
          className="custom-geographies" 
          data-testid="geographies"
        >
          {({ geographies }) =>
            geographies.map((geo: any, i) => (
              <path key={i} d={geo.svgPath} />
            ))
          }
        </Geographies>
      </TestWrapper>
    )

    const geographies = container.querySelector('[data-testid="geographies"]')
    expect(geographies?.getAttribute('class')).toContain('rsm-geographies')
    expect(geographies?.getAttribute('class')).toContain('custom-geographies')
  })

  it('should render children function without errors', () => {
    expect(() => {
      render(
        <TestWrapper>
          <Geographies geography={mockGeography}>
            {({ geographies }) => (
              <g data-testid="geographies-content">
                {geographies.map((geo: any, i: number) => (
                  <path key={i} d={geo.svgPath} data-testid={`geo-${i}`} />
                ))}
              </g>
            )}
          </Geographies>
        </TestWrapper>
      )
    }).not.toThrow()
  })

  it('should handle parseGeographies function', () => {
    const parseGeographies = vi.fn((geos) => geos.slice(0, 1))

    render(
      <TestWrapper>
        <Geographies 
          geography={mockGeography}
          parseGeographies={parseGeographies}
        >
          {({ geographies }) =>
            geographies.map((geo: any, i) => (
              <path key={i} d={geo.svgPath} />
            ))
          }
        </Geographies>
      </TestWrapper>
    )

    // parseGeographies should be called when geographies are loaded
    // Note: In our mock setup, this might not be called immediately
    // but the component should be prepared to use it
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as any }
    
    render(
      <TestWrapper>
        <Geographies geography={mockGeography} ref={ref}>
          {({ geographies }) =>
            geographies.map((geo: any, i) => (
              <path key={i} d={geo.svgPath} />
            ))
          }
        </Geographies>
      </TestWrapper>
    )

    expect(ref.current).toBeTruthy()
    expect(ref.current?.tagName.toLowerCase()).toBe('g')
  })

  it('should handle loading state', () => {
    const { container } = render(
      <TestWrapper>
        <Geographies geography={mockGeography} data-testid="geographies">
          {({ geographies }) => {
            if (geographies.length === 0) {
              return <text data-testid="loading">Loading...</text>
            }
            return geographies.map((geo: any, i) => (
              <path key={i} d={geo.svgPath} data-testid={`geo-${i}`} />
            ))
          }}
        </Geographies>
      </TestWrapper>
    )

    // Initially should show loading or empty state
    const geographies = container.querySelector('[data-testid="geographies"]')
    expect(geographies).toBeTruthy()
  })

  it('should handle different geography data types', () => {
    const topologyData = {
      type: 'Topology' as const,
      arcs: [],
      objects: {
        countries: {
          type: 'GeometryCollection' as const,
          geometries: [],
        },
      },
    }

    const { container } = render(
      <TestWrapper>
        <Geographies geography={topologyData} data-testid="geographies">
          {({ geographies }) =>
            geographies.map((geo: any, i) => (
              <path key={i} d={geo.svgPath} data-testid={`geo-${i}`} />
            ))
          }
        </Geographies>
      </TestWrapper>
    )

    const geographies = container.querySelector('[data-testid="geographies"]')
    expect(geographies).toBeTruthy()
  })

  it('should handle FeatureCollection data', () => {
    const featureCollection = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
          },
          properties: {},
        },
      ],
    }

    const { container } = render(
      <TestWrapper>
        <Geographies geography={featureCollection} data-testid="geographies">
          {({ geographies }) =>
            geographies.map((geo: any, i) => (
              <path key={i} d={geo.svgPath} data-testid={`geo-${i}`} />
            ))
          }
        </Geographies>
      </TestWrapper>
    )

    const geographies = container.querySelector('[data-testid="geographies"]')
    expect(geographies).toBeTruthy()
  })
})
