import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ZoomableGroup, ComposableMap, Geographies } from '../../src';

// Mock d3-zoom
vi.mock('d3-zoom', () => ({
  zoom: () => ({
    scaleExtent: vi.fn().mockReturnThis(),
    translateExtent: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
  }),
  zoomIdentity: {
    translate: vi.fn().mockReturnThis(),
    scale: vi.fn().mockReturnThis(),
    k: 1,
    x: 0,
    y: 0,
  },
}));

// Mock d3-selection
vi.mock('d3-selection', () => ({
  select: vi.fn(() => ({
    call: vi.fn(),
    node: vi.fn(() => ({ getBoundingClientRect: () => ({ width: 800, height: 600 }) })),
  })),
}));

describe('Zoom and Pan Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ZoomableGroup Edge Cases', () => {
    it('should handle extreme zoom levels', () => {
      const onMoveEnd = vi.fn();

      render(
        <ComposableMap>
          <ZoomableGroup
            zoom={1000} // Extreme zoom
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <Geographies geography={[]}>
              {() => <g data-testid="geography-group" />}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      );

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();
    });

    it('should handle negative zoom levels gracefully', () => {
      const onMoveEnd = vi.fn();

      render(
        <ComposableMap>
          <ZoomableGroup
            zoom={-1} // Negative zoom
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <Geographies geography={[]}>
              {() => <g data-testid="geography-group" />}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      );

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();
    });

    it('should handle extreme center coordinates', () => {
      const onMoveEnd = vi.fn();

      render(
        <ComposableMap>
          <ZoomableGroup
            zoom={1}
            center={[999999, -999999]} // Extreme coordinates
            onMoveEnd={onMoveEnd}
          >
            <Geographies geography={[]}>
              {() => <g data-testid="geography-group" />}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      );

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();
    });

    it('should handle rapid zoom changes', () => {
      const onMoveEnd = vi.fn();

      const { rerender } = render(
        <ComposableMap>
          <ZoomableGroup
            zoom={1}
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <Geographies geography={[]}>
              {() => <g data-testid="geography-group" />}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      );

      // Rapidly change zoom levels
      for (let i = 1; i <= 10; i++) {
        rerender(
          <ComposableMap>
            <ZoomableGroup
              zoom={i}
              center={[0, 0]}
              onMoveEnd={onMoveEnd}
            >
              <Geographies geography={[]}>
                {() => <g data-testid="geography-group" />}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        );
      }

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();
    });

    it('should handle invalid scale extent', () => {
      const onMoveEnd = vi.fn();

      render(
        <ComposableMap>
          <ZoomableGroup
            zoom={1}
            center={[0, 0]}
            scaleExtent={[10, 1]} // Invalid: min > max
            onMoveEnd={onMoveEnd}
          >
            <Geographies geography={[]}>
              {() => <g data-testid="geography-group" />}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      );

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();
    });

    it('should handle mouse events on zoomed content', async () => {
      const onMoveEnd = vi.fn();
      const onGeographyClick = vi.fn();

      const feature = {
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
        },
        properties: { name: 'Test Feature' },
        svgPath: 'M0,0L100,0L100,100L0,100Z',
        rsmKey: 'test-feature',
      };

      render(
        <ComposableMap>
          <ZoomableGroup
            zoom={5} // High zoom level
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <svg>
              <path
                d={feature.svgPath}
                onClick={onGeographyClick}
                data-testid="geography-path"
              />
            </svg>
          </ZoomableGroup>
        </ComposableMap>
      );

      const path = screen.getByTestId('geography-path');
      fireEvent.click(path);

      expect(onGeographyClick).toHaveBeenCalled();
    });

    it('should handle touch events for mobile zoom', () => {
      const onMoveEnd = vi.fn();

      render(
        <ComposableMap>
          <ZoomableGroup
            zoom={1}
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <g data-testid="zoomable-content">
              <Geographies geography={[]}>
                {() => <g data-testid="geography-group" />}
              </Geographies>
            </g>
          </ZoomableGroup>
        </ComposableMap>
      );

      const content = screen.getByTestId('zoomable-content');
      
      // Simulate touch events
      fireEvent.touchStart(content, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 },
        ],
      });

      fireEvent.touchMove(content, {
        touches: [
          { clientX: 150, clientY: 150 },
          { clientX: 250, clientY: 250 },
        ],
      });

      fireEvent.touchEnd(content);

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();
    });

    it('should handle keyboard navigation', () => {
      const onMoveEnd = vi.fn();

      render(
        <ComposableMap>
          <ZoomableGroup
            zoom={1}
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <g data-testid="zoomable-content" tabIndex={0}>
              <Geographies geography={[]}>
                {() => <g data-testid="geography-group" />}
              </Geographies>
            </g>
          </ZoomableGroup>
        </ComposableMap>
      );

      const content = screen.getByTestId('zoomable-content');
      content.focus();

      // Test arrow key navigation
      fireEvent.keyDown(content, { key: 'ArrowUp' });
      fireEvent.keyDown(content, { key: 'ArrowDown' });
      fireEvent.keyDown(content, { key: 'ArrowLeft' });
      fireEvent.keyDown(content, { key: 'ArrowRight' });

      // Test zoom keys
      fireEvent.keyDown(content, { key: '+' });
      fireEvent.keyDown(content, { key: '-' });

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();
    });

    it('should handle window resize during zoom', () => {
      const onMoveEnd = vi.fn();

      render(
        <ComposableMap width={800} height={600}>
          <ZoomableGroup
            zoom={2}
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <Geographies geography={[]}>
              {() => <g data-testid="geography-group" />}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      );

      // Simulate window resize
      fireEvent(window, new Event('resize'));

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();
    });

    it('should handle memory cleanup on unmount', () => {
      const onMoveEnd = vi.fn();

      const { unmount } = render(
        <ComposableMap>
          <ZoomableGroup
            zoom={1}
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <Geographies geography={[]}>
              {() => <g data-testid="geography-group" />}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      );

      expect(screen.getByTestId('geography-group')).toBeInTheDocument();

      // Should not throw errors on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Performance with Zoom', () => {
    it('should handle many geography features during zoom', () => {
      const features = Array.from({ length: 100 }, (_, i) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [i % 360 - 180, (i % 180) - 90],
        },
        properties: { id: i },
        svgPath: `M${i},${i}L${i+10},${i+10}`,
        rsmKey: `feature-${i}`,
      }));

      const onMoveEnd = vi.fn();

      render(
        <ComposableMap>
          <ZoomableGroup
            zoom={3}
            center={[0, 0]}
            onMoveEnd={onMoveEnd}
          >
            <g data-testid="features-container">
              {features.map((feature) => (
                <path
                  key={feature.rsmKey}
                  d={feature.svgPath}
                  data-testid={`feature-${feature.properties.id}`}
                />
              ))}
            </g>
          </ZoomableGroup>
        </ComposableMap>
      );

      expect(screen.getByTestId('features-container')).toBeInTheDocument();
      expect(screen.getByTestId('feature-0')).toBeInTheDocument();
      expect(screen.getByTestId('feature-99')).toBeInTheDocument();
    });
  });
});
