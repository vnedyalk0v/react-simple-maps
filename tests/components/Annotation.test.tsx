import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Annotation from '../../src/components/Annotation';
import { MapProvider } from '../../src/components/MapProvider';

// Mock projection function
const mockProjection = vi.fn((coords) => [coords[0] * 100, coords[1] * 100]);
mockProjection.invert = vi.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <svg>{children}</svg>
  </MapProvider>
);

describe('Annotation', () => {
  it('should render annotation at correct position', () => {
    const { container } = render(
      <TestWrapper>
        <Annotation subject={[1, 2]} dx={0} dy={0} data-testid="annotation">
          <text>Test Annotation</text>
        </Annotation>
      </TestWrapper>,
    );

    const annotation = container.querySelector('[data-testid="annotation"]');
    expect(annotation).toBeTruthy();
    expect(annotation?.tagName.toLowerCase()).toBe('g');
    expect(annotation?.getAttribute('class')).toContain('rsm-annotation');
    expect(annotation?.getAttribute('transform')).toBe('translate(100, 200)');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <Annotation
          subject={[0, 0]}
          className="custom-annotation"
          data-testid="annotation"
        >
          <text>Test</text>
        </Annotation>
      </TestWrapper>,
    );

    const annotation = container.querySelector('[data-testid="annotation"]');
    expect(annotation?.getAttribute('class')).toContain('rsm-annotation');
    expect(annotation?.getAttribute('class')).toContain('custom-annotation');
  });

  it('should render children', () => {
    const { container } = render(
      <TestWrapper>
        <Annotation subject={[0, 0]}>
          <text data-testid="annotation-text">Test Text</text>
          <circle data-testid="annotation-circle" r="5" />
        </Annotation>
      </TestWrapper>,
    );

    const text = container.querySelector('[data-testid="annotation-text"]');
    const circle = container.querySelector('[data-testid="annotation-circle"]');
    expect(text).toBeTruthy();
    expect(circle).toBeTruthy();
  });

  it('should handle mouse events', () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const onMouseDown = vi.fn();
    const onMouseUp = vi.fn();

    const { container } = render(
      <TestWrapper>
        <Annotation
          subject={[0, 0]}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          data-testid="annotation"
        >
          <text>Test</text>
        </Annotation>
      </TestWrapper>,
    );

    const annotation = container.querySelector('[data-testid="annotation"]')!;

    fireEvent.mouseEnter(annotation);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(annotation);
    expect(onMouseDown).toHaveBeenCalledTimes(1);

    fireEvent.mouseUp(annotation);
    expect(onMouseUp).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(annotation);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('should handle focus events', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    const { container } = render(
      <TestWrapper>
        <Annotation
          subject={[0, 0]}
          onFocus={onFocus}
          onBlur={onBlur}
          data-testid="annotation"
        >
          <text>Test</text>
        </Annotation>
      </TestWrapper>,
    );

    const annotation = container.querySelector('[data-testid="annotation"]')!;

    fireEvent.focus(annotation);
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(annotation);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should not render when projection returns null', () => {
    const nullProjection = vi.fn(() => null) as any;

    const { container } = render(
      <MapProvider width={800} height={600} projection={nullProjection}>
        <svg>
          <Annotation subject={[0, 0]} data-testid="annotation">
            <text>Test</text>
          </Annotation>
        </svg>
      </MapProvider>,
    );

    const annotation = container.querySelector('[data-testid="annotation"]');
    expect(annotation).toBeFalsy();
  });

  it('should apply different styles based on state', () => {
    const style = {
      default: { opacity: 1 },
      hover: { opacity: 0.8 },
      pressed: { opacity: 0.6 },
    } as any;

    const { container } = render(
      <TestWrapper>
        <Annotation subject={[0, 0]} style={style} data-testid="annotation">
          <text>Test</text>
        </Annotation>
      </TestWrapper>,
    );

    const annotation = container.querySelector('[data-testid="annotation"]')!;

    // Default state
    const defaultStyle = annotation.getAttribute('style');
    if (defaultStyle) {
      expect(defaultStyle).toContain('opacity: 1');
    }

    // Hover state
    fireEvent.mouseEnter(annotation);
    const hoverStyle = annotation.getAttribute('style');
    if (hoverStyle) {
      expect(hoverStyle).toContain('opacity: 0.8');
    }

    // Pressed state
    fireEvent.mouseDown(annotation);
    const pressedStyle = annotation.getAttribute('style');
    if (pressedStyle) {
      expect(pressedStyle).toContain('opacity: 0.6');
    }
  });

  it('should forward ref correctly', () => {
    const ref = { current: null as any };

    render(
      <TestWrapper>
        <Annotation subject={[0, 0]} ref={ref}>
          <text>Test</text>
        </Annotation>
      </TestWrapper>,
    );

    expect(ref.current).toBeTruthy();
    expect(ref.current?.tagName.toLowerCase()).toBe('g');
  });

  it('should handle dx and dy offsets', () => {
    const { container } = render(
      <TestWrapper>
        <Annotation subject={[1, 2]} dx={10} dy={20} data-testid="annotation">
          <text>Test</text>
        </Annotation>
      </TestWrapper>,
    );

    const annotation = container.querySelector('[data-testid="annotation"]');
    expect(annotation?.getAttribute('transform')).toBe('translate(110, 220)');
  });
});
