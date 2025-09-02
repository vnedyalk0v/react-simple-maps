import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import ComposableMap from '../../src/components/ComposableMap';
import { MapProvider, useMapContext } from '../../src/components/MapProvider';

describe('ComposableMap', () => {
  it('should render with default props', () => {
    const { container } = render(<ComposableMap />);

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.tagName).toBe('svg');
  });

  it('should apply custom width and height', () => {
    const { container } = render(<ComposableMap width={1000} height={800} />);

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 1000 800');
  });

  it('should apply custom className', () => {
    const { container } = render(<ComposableMap className="custom-map" />);

    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('rsm-svg');
    expect(svg?.getAttribute('class')).toContain('custom-map');
  });

  it('should render children', () => {
    const { container } = render(
      <ComposableMap>
        <g data-testid="child-element">Test Child</g>
      </ComposableMap>,
    );

    const childElement = container.querySelector(
      '[data-testid="child-element"]',
    );
    expect(childElement).toBeTruthy();
  });

  it('should use custom projection', () => {
    const customProjection = 'geoMercator';
    const { container } = render(
      <ComposableMap projection={customProjection} />,
    );

    // Should render without errors
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should apply projection config', () => {
    const projectionConfig = {
      center: [0, 0] as [number, number],
      scale: 200,
    };

    const { container } = render(
      <ComposableMap projectionConfig={projectionConfig} />,
    );

    // Should render without errors
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should forward ref correctly', () => {
    const ref = { current: null as any };
    render(<ComposableMap ref={ref} />);

    expect(ref.current).toBeTruthy();
    expect(ref.current?.tagName).toBe('svg');
  });

  it('should handle unknown projection error', () => {
    // Capture console.error to avoid noise in test output
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<ComposableMap projection={'unknownProjection' as any} />);
    }).toThrow('Unknown projection: unknownProjection');

    console.error = originalError;
  });

  it('should handle projection config with all parameters', () => {
    const projectionConfig = {
      center: [0, 0] as [number, number],
      rotate: [0, 0, 0] as [number, number, number],
      parallels: [30, 60] as [number, number],
      scale: 200,
    };

    const { container } = render(
      <ComposableMap projectionConfig={projectionConfig} />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should handle projection config with partial rotate', () => {
    const projectionConfig = {
      rotate: [10, 20, 0] as [number, number, number],
    };

    const { container } = render(
      <ComposableMap projectionConfig={projectionConfig} />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should handle projection config with partial parallels', () => {
    const projectionConfig = {
      parallels: [30, 60] as [number, number],
    };

    const { container } = render(
      <ComposableMap projectionConfig={projectionConfig} />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should throw error when useMapContext is used outside provider', () => {
    expect(() => {
      renderHook(() => useMapContext());
    }).toThrow('useMapContext must be used within a MapProvider');
  });

  it('should provide context when useMapContext is used inside provider', () => {
    const mockProjection = vi.fn() as any;
    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <MapProvider width={800} height={600} projection={mockProjection}>
        {children}
      </MapProvider>
    );

    const { result } = renderHook(() => useMapContext(), {
      wrapper: TestWrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('width');
    expect(result.current).toHaveProperty('height');
    expect(result.current).toHaveProperty('projection');
    expect(result.current).toHaveProperty('path');
  });
});
