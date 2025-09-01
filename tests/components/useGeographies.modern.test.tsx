import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import useGeographies from '../../src/components/useGeographies'
import { MapProvider } from '../../src/components/MapProvider'
import { fetchGeographiesCache } from '../../src/utils'

// Mock the cache function
vi.mock('../../src/utils', async () => {
  const actual = await vi.importActual('../../src/utils')
  return {
    ...actual,
    fetchGeographiesCache: vi.fn(),
  }
})

// Mock projection function
const mockProjection = vi.fn((coords) => [coords[0] * 100, coords[1] * 100]) as any
mockProjection.invert = vi.fn()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  </MapProvider>
)

describe('useGeographies (Modern)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle string geography URLs with caching', async () => {
    const mockGeographyData = {
      type: 'Topology' as const,
      objects: {
        countries: {
          type: 'GeometryCollection' as const,
          geometries: [
            {
              type: 'Polygon' as const,
              coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
              properties: {},
            },
          ],
        },
      },
    }

    vi.mocked(fetchGeographiesCache).mockResolvedValue(mockGeographyData)

    const { result } = renderHook(
      () => useGeographies({ geography: 'https://example.com/world.json' }),
      { wrapper: TestWrapper }
    )

    await waitFor(() => {
      expect(result.current).toBeDefined()
      expect(result.current.geographies).toBeDefined()
      expect(result.current.outline).toBeDefined()
      expect(result.current.borders).toBeDefined()
    })

    expect(fetchGeographiesCache).toHaveBeenCalledWith('https://example.com/world.json')
  })

  it('should handle direct geography data without caching', () => {
    const directGeographyData = {
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

    const { result } = renderHook(
      () => useGeographies({ geography: directGeographyData }),
      { wrapper: TestWrapper }
    )

    expect(result.current).toBeDefined()
    expect(result.current.geographies).toBeDefined()
    expect(result.current.outline).toBeDefined()
    expect(result.current.borders).toBeDefined()
    expect(fetchGeographiesCache).not.toHaveBeenCalled()
  })

  it('should handle parseGeographies function', async () => {
    const mockGeographyData = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
          },
          properties: { name: 'Country 1' },
        },
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[[2, 2], [3, 2], [3, 3], [2, 3], [2, 2]]],
          },
          properties: { name: 'Country 2' },
        },
      ],
    }

    const parseGeographies = vi.fn((geos) => geos.slice(0, 1))

    const { result } = renderHook(
      () => useGeographies({ 
        geography: mockGeographyData, 
        parseGeographies 
      }),
      { wrapper: TestWrapper }
    )

    expect(result.current.geographies).toHaveLength(1)
    expect(parseGeographies).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          properties: { name: 'Country 1' }
        })
      ])
    )
  })

  it('should memoize results properly', () => {
    const geographyData = {
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

    const { result, rerender } = renderHook(
      ({ geography, parseGeographies }) => useGeographies({ geography, parseGeographies }),
      { 
        wrapper: TestWrapper,
        initialProps: { geography: geographyData, parseGeographies: undefined }
      }
    )

    const firstResult = result.current

    // Rerender with same props
    rerender({ geography: geographyData, parseGeographies: undefined })

    // Results should be the same object (memoized)
    expect(result.current).toBe(firstResult)
  })

  it('should handle topology data correctly', () => {
    const topologyData = {
      type: 'Topology' as const,
      arcs: [],
      objects: {
        countries: {
          type: 'GeometryCollection' as const,
          geometries: [
            {
              type: 'Polygon' as const,
              coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
              properties: {},
            },
          ],
        },
      },
    }

    const { result } = renderHook(
      () => useGeographies({ geography: topologyData }),
      { wrapper: TestWrapper }
    )

    expect(result.current).toBeDefined()
    expect(result.current.geographies).toBeDefined()
    expect(result.current.outline).toBeDefined()
    expect(result.current.borders).toBeDefined()
  })

  it('should handle cache errors gracefully', async () => {
    const cacheError = new Error('Failed to fetch geography data')
    vi.mocked(fetchGeographiesCache).mockRejectedValue(cacheError)

    expect(() => {
      renderHook(
        () => useGeographies({ geography: 'https://example.com/invalid.json' }),
        { wrapper: TestWrapper }
      )
    }).toThrow('Failed to fetch geography data')
  })

  it('should return prepared features with svgPath', () => {
    const geographyData = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
          },
          properties: { name: 'Test Country' },
        },
      ],
    }

    const { result } = renderHook(
      () => useGeographies({ geography: geographyData }),
      { wrapper: TestWrapper }
    )

    expect(result.current.geographies).toHaveLength(1)
    expect(result.current.geographies[0]).toHaveProperty('svgPath')
    expect(result.current.geographies[0]).toHaveProperty('rsmKey')
    expect(result.current.geographies[0].properties).toEqual({ name: 'Test Country' })
  })
})
