import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import {
  ZoomPanProvider,
  useZoomPanContext,
} from '../../src/components/ZoomPanProvider';

describe('ZoomPanProvider', () => {
  it('should render children', () => {
    const { container } = render(
      <ZoomPanProvider>
        <div data-testid="child">Test Child</div>
      </ZoomPanProvider>,
    );

    const child = container.querySelector('[data-testid="child"]');
    expect(child).toBeTruthy();
  });

  it('should provide zoom pan context', () => {
    expect(() => {
      render(
        <ZoomPanProvider>
          <div>Test</div>
        </ZoomPanProvider>,
      );
    }).not.toThrow();
  });

  it('should render without errors when no children provided', () => {
    expect(() => {
      render(<ZoomPanProvider />);
    }).not.toThrow();
  });

  it('should throw error when useZoomPanContext is used outside provider', () => {
    expect(() => {
      renderHook(() => useZoomPanContext());
    }).toThrow('useZoomPanContext must be used within a ZoomPanProvider');
  });

  it('should provide context when useZoomPanContext is used inside provider', () => {
    const { result } = renderHook(() => useZoomPanContext(), {
      wrapper: ZoomPanProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('x');
    expect(result.current).toHaveProperty('y');
    expect(result.current).toHaveProperty('k');
    expect(result.current).toHaveProperty('transformString');
  });
});
