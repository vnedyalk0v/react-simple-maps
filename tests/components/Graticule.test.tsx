import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Graticule from '../../src/components/Graticule';
import { MapProvider } from '../../src/components/MapProvider';

// Mock projection function
const mockProjection = vi.fn((coords) => [
  coords[0] * 100,
  coords[1] * 100,
]) as any;
mockProjection.invert = vi.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <svg>{children}</svg>
  </MapProvider>
);

describe('Graticule', () => {
  it('should render graticule path', () => {
    const { container } = render(
      <TestWrapper>
        <Graticule data-testid="graticule" />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]');
    expect(graticule).toBeTruthy();
    expect(graticule?.tagName.toLowerCase()).toBe('path');
    expect(graticule?.getAttribute('class')).toContain('rsm-graticule');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <Graticule className="custom-graticule" data-testid="graticule" />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]');
    expect(graticule?.getAttribute('class')).toContain('rsm-graticule');
    expect(graticule?.getAttribute('class')).toContain('custom-graticule');
  });

  it('should handle step prop', () => {
    const { container } = render(
      <TestWrapper>
        <Graticule step={[20, 20]} data-testid="graticule" />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]');
    expect(graticule).toBeTruthy();
    expect(graticule?.getAttribute('d')).toBeTruthy();
  });

  it('should handle mouse events', () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const onMouseDown = vi.fn();
    const onMouseUp = vi.fn();

    const { container } = render(
      <TestWrapper>
        <Graticule
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          data-testid="graticule"
        />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]')!;

    fireEvent.mouseEnter(graticule);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(graticule);
    expect(onMouseDown).toHaveBeenCalledTimes(1);

    fireEvent.mouseUp(graticule);
    expect(onMouseUp).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(graticule);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('should handle focus events', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    const { container } = render(
      <TestWrapper>
        <Graticule onFocus={onFocus} onBlur={onBlur} data-testid="graticule" />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]')!;

    fireEvent.focus(graticule);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(graticule);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should apply different styles based on state', () => {
    const style = {
      default: { stroke: 'gray' },
      hover: { stroke: 'black' },
      pressed: { stroke: 'red' },
    } as any;

    const { container } = render(
      <TestWrapper>
        <Graticule style={style} data-testid="graticule" />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]')!;

    // Default state
    const defaultStyle = graticule.getAttribute('style');
    if (defaultStyle) {
      expect(defaultStyle).toContain('stroke: gray');
    }

    // Hover state
    fireEvent.mouseEnter(graticule);
    const hoverStyle = graticule.getAttribute('style');
    if (hoverStyle) {
      expect(hoverStyle).toContain('stroke: black');
    }

    // Pressed state
    fireEvent.mouseDown(graticule);
    const pressedStyle = graticule.getAttribute('style');
    if (pressedStyle) {
      expect(pressedStyle).toContain('stroke: red');
    }
  });

  it('should render without tabIndex by default', () => {
    const { container } = render(
      <TestWrapper>
        <Graticule data-testid="graticule" />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]');
    expect(graticule?.getAttribute('tabIndex')).toBeNull();
  });

  it('should forward ref correctly', () => {
    const ref = { current: null as any };

    render(
      <TestWrapper>
        <Graticule ref={ref} />
      </TestWrapper>,
    );

    expect(ref.current).toBeTruthy();
    expect(ref.current?.tagName.toLowerCase()).toBe('path');
  });

  it('should handle stroke and strokeWidth props', () => {
    const { container } = render(
      <TestWrapper>
        <Graticule stroke="lightgray" strokeWidth={1} data-testid="graticule" />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]');
    expect(graticule?.getAttribute('stroke')).toBe('lightgray');
    expect(graticule?.getAttribute('stroke-width')).toBe('1');
  });

  it('should handle fill prop', () => {
    const { container } = render(
      <TestWrapper>
        <Graticule fill="none" data-testid="graticule" />
      </TestWrapper>,
    );

    const graticule = container.querySelector('[data-testid="graticule"]');
    expect(graticule?.getAttribute('fill')).toBe('none');
  });
});
