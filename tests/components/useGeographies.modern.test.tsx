import { describe, it, expect, vi, beforeEach } from 'vitest';

// Ensure mock is hoisted before importing modules under test
vi.mock('../../src/utils', async () => {
  const actual =
    await vi.importActual<typeof import('../../src/utils')>('../../src/utils');
  return {
    ...actual,
    fetchGeographiesCache: vi.fn(),
  };
});

import { renderHook, waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Suspense } from 'react';
import useGeographies from '../../src/components/useGeographies';
import { MapProvider } from '../../src/components/MapProvider';
import GeographyErrorBoundary from '../../src/components/GeographyErrorBoundary';
import { fetchGeographiesCache } from '../../src/utils';

// Mock projection function
const mockProjection = vi.fn((coords) => [
  coords[0] * 100,
  coords[1] * 100,
]) as any;
mockProjection.invert = vi.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  </MapProvider>
);

describe('useGeographies (Modern)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle string geography URLs with caching', async () => {
    // Use a FeatureCollection to avoid topojson-specific requirements in test
    const mockGeographyData = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
          properties: {},
        },
      ],
    };

    vi.mocked(fetchGeographiesCache).mockResolvedValue(
      mockGeographyData as any,
    );

    const HookUser = () => {
      const { geographies, outline, borders } = useGeographies({
        geography: 'https://example.com/world.json',
      });
      return (
        <div data-testid="ready">
          {geographies.length}::{outline !== undefined ? '1' : '0'}::
          {borders !== undefined ? '1' : '0'}
        </div>
      );
    };

    render(
      <TestWrapper>
        <HookUser />
      </TestWrapper>,
    );

    await waitFor(
      () =>
        expect(fetchGeographiesCache).toHaveBeenCalledWith(
          'https://example.com/world.json',
        ),
      { timeout: 3000 },
    );

    // Wait for the data to load and verify the result
    await waitFor(
      () => {
        expect(screen.getByTestId('ready')).toHaveTextContent('1::1::1');
      },
      { timeout: 3000 },
    );
  });

  it('should handle direct geography data without caching', () => {
    const directGeographyData = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
          properties: {},
        },
      ],
    };

    const { result } = renderHook(
      () => useGeographies({ geography: directGeographyData }),
      { wrapper: TestWrapper },
    );

    expect(result.current).toBeDefined();
    expect(result.current.geographies).toBeDefined();
    expect(result.current.outline).toBeDefined();
    expect(result.current.borders).toBeDefined();
    expect(fetchGeographiesCache).not.toHaveBeenCalled();
  });

  it('should handle parseGeographies function', async () => {
    const mockGeographyData = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
          properties: { name: 'Country 1' },
        },
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [2, 2],
                [3, 2],
                [3, 3],
                [2, 3],
                [2, 2],
              ],
            ],
          },
          properties: { name: 'Country 2' },
        },
      ],
    };

    const parseGeographies = vi.fn((geos) => geos.slice(0, 1));

    const { result } = renderHook(
      () =>
        useGeographies({
          geography: mockGeographyData,
          parseGeographies,
        }),
      { wrapper: TestWrapper },
    );

    expect(result.current.geographies).toHaveLength(1);
    expect(parseGeographies).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          properties: { name: 'Country 1' },
        }),
      ]),
    );
  });

  it('should memoize results properly', () => {
    const geographyData = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
          properties: {},
        },
      ],
    };

    const { result, rerender } = renderHook(
      ({ geography, parseGeographies }) =>
        useGeographies({ geography, parseGeographies }),
      {
        wrapper: TestWrapper,
        initialProps: { geography: geographyData, parseGeographies: undefined },
      },
    );

    const firstResult = result.current;

    // Rerender with same props
    rerender({ geography: geographyData, parseGeographies: undefined });

    // Results should be the same object (memoized)
    expect(result.current).toBe(firstResult);
  });

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
              coordinates: [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 1],
                  [0, 0],
                ],
              ],
              properties: {},
            },
          ],
        },
      },
    };

    const { result } = renderHook(
      () => useGeographies({ geography: topologyData as any }),
      { wrapper: TestWrapper },
    );

    expect(result.current).toBeDefined();
    expect(result.current.geographies).toBeDefined();
    expect(result.current.outline).toBeDefined();
    expect(result.current.borders).toBeDefined();
  });

  it('should handle cache errors gracefully', async () => {
    const cacheError = new Error('Failed to fetch geography data');
    vi.mocked(fetchGeographiesCache).mockRejectedValue(cacheError);

    const HookUser = () => {
      const { geographies, outline, borders } = useGeographies({
        geography: 'https://example.com/invalid.json',
      });
      return (
        <div data-testid="result">
          {geographies.length}::{outline}::{borders}
        </div>
      );
    };

    render(
      <TestWrapper>
        <HookUser />
      </TestWrapper>,
    );

    await waitFor(
      () =>
        expect(fetchGeographiesCache).toHaveBeenCalledWith(
          'https://example.com/invalid.json',
        ),
      { timeout: 3000 },
    );

    // When there's an error, the hook should return empty data gracefully
    await waitFor(
      () => {
        expect(screen.getByTestId('result')).toHaveTextContent('0::::');
      },
      { timeout: 3000 },
    );
  });

  it('should return prepared features with svgPath', () => {
    const geographyData = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
          properties: { name: 'Test Country' },
        },
      ],
    };

    const { result } = renderHook(
      () => useGeographies({ geography: geographyData }),
      { wrapper: TestWrapper },
    );

    expect(result.current.geographies).toHaveLength(1);
    expect(result.current.geographies[0]).toHaveProperty('svgPath');
    expect(result.current.geographies[0]).toHaveProperty('rsmKey');
    expect(result.current.geographies[0].properties).toEqual({
      name: 'Test Country',
    });
  });
});
