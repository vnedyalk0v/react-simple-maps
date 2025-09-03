import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Suspense } from 'react';
import { ComposableMap, Geographies, Geography, MapProvider } from '../../src';
import GeographyErrorBoundary from '../../src/components/GeographyErrorBoundary';
import { fetchGeographiesCache } from '../../src/utils';

// Mock the utils
vi.mock('../../src/utils', async () => {
  const actual =
    await vi.importActual<typeof import('../../src/utils')>('../../src/utils');
  return {
    ...actual,
    fetchGeographiesCache: vi.fn(),
  };
});

// Mock projection function
const mockProjection = vi.fn((coords) => [
  coords[0] * 100,
  coords[1] * 100,
]) as any;
mockProjection.invert = vi.fn();

describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Invalid Geography Data', () => {
    it('should handle malformed GeoJSON gracefully', async () => {
      const malformedData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: null, // Invalid geometry
            properties: {},
          },
        ],
      };

      vi.mocked(fetchGeographiesCache).mockResolvedValue(malformedData as any);

      render(
        <MapProvider width={800} height={600} projection={mockProjection}>
          <Geographies geography="https://example.com/malformed.json">
            {({ geographies }) => (
              <div data-testid="geography-count">{geographies.length}</div>
            )}
          </Geographies>
        </MapProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('geography-count')).toHaveTextContent('1');
      });
    });

    it('should handle empty FeatureCollection', async () => {
      const emptyData = {
        type: 'FeatureCollection' as const,
        features: [],
      };

      vi.mocked(fetchGeographiesCache).mockResolvedValue(emptyData);

      render(
        <MapProvider width={800} height={600} projection={mockProjection}>
          <Geographies geography="https://example.com/empty.json">
            {({ geographies }) =>
              geographies.length > 0 ? (
                <div data-testid="geography-count">{geographies.length}</div>
              ) : (
                <div data-testid="no-geographies">No geographies</div>
              )
            }
          </Geographies>
        </MapProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('no-geographies')).toHaveTextContent(
          'No geographies',
        );
      });
    });

    it('should handle invalid TopoJSON structure', async () => {
      const invalidTopology = {
        type: 'Topology' as const,
        objects: {}, // Empty objects
        arcs: [],
      };

      vi.mocked(fetchGeographiesCache).mockResolvedValue(invalidTopology);

      render(
        <MapProvider width={800} height={600} projection={mockProjection}>
          <Geographies geography="https://example.com/invalid-topology.json">
            {({ geographies }) => (
              <div data-testid="geography-count">{geographies.length}</div>
            )}
          </Geographies>
        </MapProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('geography-count')).toHaveTextContent('0');
      });
    });
  });

  describe('Network and Loading Edge Cases', () => {
    it('should handle network timeout gracefully', async () => {
      const timeoutError = new Error('Request timeout after 10000ms');
      vi.mocked(fetchGeographiesCache).mockRejectedValue(timeoutError);

      const ErrorFallback = ({
        error,
        retry,
      }: {
        error: Error;
        retry: () => void;
      }) => (
        <div data-testid="error-fallback">
          <span>Error: {error.message}</span>
          <button onClick={retry} data-testid="retry-button">
            Retry
          </button>
        </div>
      );

      render(
        <MapProvider width={800} height={600} projection={mockProjection}>
          <GeographyErrorBoundary fallback={ErrorFallback}>
            <Suspense fallback={<div>Loading...</div>}>
              <Geographies
                geography="https://example.com/timeout.json"
                errorBoundary={true}
              >
                {({ geographies }) => (
                  <div data-testid="geography-count">{geographies.length}</div>
                )}
              </Geographies>
            </Suspense>
          </GeographyErrorBoundary>
        </MapProvider>,
      );

      await waitFor(() => {
        expect(fetchGeographiesCache).toHaveBeenCalledWith(
          'https://example.com/timeout.json',
        );
      });

      // Should show empty data gracefully (no error boundary triggered for this hook)
      await waitFor(() => {
        expect(screen.getByTestId('geography-count')).toHaveTextContent('0');
      });
    });

    it('should handle very large geography files', async () => {
      // Simulate a large geography file
      const largeData = {
        type: 'FeatureCollection' as const,
        features: Array.from({ length: 1000 }, (_, i) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [(i % 360) - 180, (i % 180) - 90],
          },
          properties: { id: i },
        })),
      };

      vi.mocked(fetchGeographiesCache).mockResolvedValue(largeData);

      render(
        <MapProvider width={800} height={600} projection={mockProjection}>
          <Geographies geography="https://example.com/large.json">
            {({ geographies }) => (
              <div data-testid="geography-count">{geographies.length}</div>
            )}
          </Geographies>
        </MapProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('geography-count')).toHaveTextContent('1000');
      });
    });
  });

  describe('Component Edge Cases', () => {
    it('should handle zero dimensions gracefully', () => {
      render(
        <ComposableMap width={0} height={0}>
          <Geographies geography={[]}>
            {({ geographies }) => (
              <div data-testid="geography-count">{geographies.length}</div>
            )}
          </Geographies>
        </ComposableMap>,
      );

      expect(screen.getByTestId('geography-count')).toHaveTextContent('0');
    });

    it('should handle negative dimensions gracefully', () => {
      render(
        <ComposableMap width={-100} height={-100}>
          <Geographies geography={[]}>
            {({ geographies }) => (
              <div data-testid="geography-count">{geographies.length}</div>
            )}
          </Geographies>
        </ComposableMap>,
      );

      expect(screen.getByTestId('geography-count')).toHaveTextContent('0');
    });

    it('should handle missing required props gracefully', () => {
      // Test Geography component with minimal props
      const feature = {
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
        svgPath: 'M0,0L100,0L100,100L0,100Z',
        rsmKey: 'test-key',
      };

      render(
        <MapProvider width={800} height={600} projection={mockProjection}>
          <svg>
            <Geography geography={feature} />
          </svg>
        </MapProvider>,
      );

      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
    });
  });

  describe('Performance Edge Cases', () => {
    it('should handle rapid prop changes efficiently', async () => {
      const { rerender } = render(
        <MapProvider width={800} height={600} projection={mockProjection}>
          <Geographies geography={[]}>
            {({ geographies }) => (
              <div data-testid="geography-count">{geographies.length}</div>
            )}
          </Geographies>
        </MapProvider>,
      );

      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(
          <MapProvider
            width={800 + i}
            height={600 + i}
            projection={mockProjection}
          >
            <Geographies geography={[]}>
              {({ geographies }) => (
                <div data-testid="geography-count">{geographies.length}</div>
              )}
            </Geographies>
          </MapProvider>,
        );
      }

      expect(screen.getByTestId('geography-count')).toHaveTextContent('0');
    });

    it('should handle concurrent geography loading', async () => {
      const data1 = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [0, 0] },
            properties: { name: 'Feature 1' },
          },
        ],
      };

      const data2 = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [1, 1] },
            properties: { name: 'Feature 2' },
          },
        ],
      };

      vi.mocked(fetchGeographiesCache).mockImplementation((url: string) => {
        if (url.includes('data1')) return Promise.resolve(data1);
        if (url.includes('data2')) return Promise.resolve(data2);
        return Promise.reject(new Error('Unknown URL'));
      });

      render(
        <MapProvider width={800} height={600} projection={mockProjection}>
          <Geographies geography="https://example.com/data1.json">
            {({ geographies }) => (
              <div data-testid="geography-count-1">{geographies.length}</div>
            )}
          </Geographies>
          <Geographies geography="https://example.com/data2.json">
            {({ geographies }) => (
              <div data-testid="geography-count-2">{geographies.length}</div>
            )}
          </Geographies>
        </MapProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('geography-count-1')).toHaveTextContent('1');
        expect(screen.getByTestId('geography-count-2')).toHaveTextContent('1');
      });
    });
  });
});
