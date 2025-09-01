import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Sphere from '../../src/components/Sphere'
import { MapProvider } from '../../src/components/MapProvider'

// Mock projection function
const mockProjection = vi.fn((coords) => [coords[0] * 100, coords[1] * 100]) as any
mockProjection.invert = vi.fn()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <svg>{children}</svg>
  </MapProvider>
)

describe('Sphere', () => {
  it('should render sphere path', () => {
    const { container } = render(
      <TestWrapper>
        <Sphere data-testid="sphere" />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')
    expect(sphere).toBeTruthy()
    expect(sphere?.tagName.toLowerCase()).toBe('path')
    expect(sphere?.getAttribute('class')).toContain('rsm-sphere')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <Sphere className="custom-sphere" data-testid="sphere" />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')
    expect(sphere?.getAttribute('class')).toContain('rsm-sphere')
    expect(sphere?.getAttribute('class')).toContain('custom-sphere')
  })

  it('should handle mouse events', () => {
    const onMouseEnter = vi.fn()
    const onMouseLeave = vi.fn()
    const onMouseDown = vi.fn()
    const onMouseUp = vi.fn()

    const { container } = render(
      <TestWrapper>
        <Sphere
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          data-testid="sphere"
        />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')!

    fireEvent.mouseEnter(sphere)
    expect(onMouseEnter).toHaveBeenCalledTimes(1)

    fireEvent.mouseDown(sphere)
    expect(onMouseDown).toHaveBeenCalledTimes(1)

    fireEvent.mouseUp(sphere)
    expect(onMouseUp).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(sphere)
    expect(onMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('should handle focus events', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    const { container } = render(
      <TestWrapper>
        <Sphere
          onFocus={onFocus}
          onBlur={onBlur}
          data-testid="sphere"
        />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')!

    fireEvent.focus(sphere)
    expect(onFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(sphere)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('should apply different styles based on state', () => {
    const style = {
      default: { fill: 'lightblue' },
      hover: { fill: 'blue' },
      pressed: { fill: 'darkblue' },
    } as any

    const { container } = render(
      <TestWrapper>
        <Sphere style={style} data-testid="sphere" />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')!

    // Default state
    const defaultStyle = sphere.getAttribute('style')
    if (defaultStyle) {
      expect(defaultStyle).toContain('fill: lightblue')
    }

    // Hover state
    fireEvent.mouseEnter(sphere)
    const hoverStyle = sphere.getAttribute('style')
    if (hoverStyle) {
      expect(hoverStyle).toContain('fill: blue')
    }

    // Pressed state
    fireEvent.mouseDown(sphere)
    const pressedStyle = sphere.getAttribute('style')
    if (pressedStyle) {
      expect(pressedStyle).toContain('fill: darkblue')
    }
  })

  it('should render without tabIndex by default', () => {
    const { container } = render(
      <TestWrapper>
        <Sphere data-testid="sphere" />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')
    expect(sphere?.getAttribute('tabIndex')).toBeNull()
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as any }
    
    render(
      <TestWrapper>
        <Sphere ref={ref} />
      </TestWrapper>
    )

    expect(ref.current).toBeTruthy()
    expect(ref.current?.tagName.toLowerCase()).toBe('path')
  })

  it('should handle stroke and strokeWidth props', () => {
    const { container } = render(
      <TestWrapper>
        <Sphere 
          stroke="black" 
          strokeWidth={2}
          data-testid="sphere" 
        />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')
    expect(sphere?.getAttribute('stroke')).toBe('black')
    expect(sphere?.getAttribute('stroke-width')).toBe('2')
  })

  it('should handle fill prop', () => {
    const { container } = render(
      <TestWrapper>
        <Sphere fill="lightblue" data-testid="sphere" />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')
    expect(sphere?.getAttribute('fill')).toBe('lightblue')
  })

  it('should handle additional props', () => {
    const { container } = render(
      <TestWrapper>
        <Sphere data-custom="sphere-data" data-testid="sphere" />
      </TestWrapper>
    )

    const sphere = container.querySelector('[data-testid="sphere"]')
    expect(sphere?.getAttribute('data-custom')).toBe('sphere-data')
  })


})
