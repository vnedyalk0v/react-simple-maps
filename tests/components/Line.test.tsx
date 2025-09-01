import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Line from '../../src/components/Line'
import { MapProvider } from '../../src/components/MapProvider'

// Mock projection function
const mockProjection = vi.fn((coords) => [coords[0] * 100, coords[1] * 100]) as any
mockProjection.invert = vi.fn()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <svg>{children}</svg>
  </MapProvider>
)

describe('Line', () => {
  const mockLineData = {
    type: 'LineString' as const,
    coordinates: [[0, 0], [1, 1], [2, 2]],
  }

  it('should render line path', () => {
    const { container } = render(
      <TestWrapper>
        <Line from={[0, 0]} to={[1, 1]} data-testid="line" />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')
    expect(line).toBeTruthy()
    expect(line?.tagName.toLowerCase()).toBe('path')
    expect(line?.getAttribute('class')).toContain('rsm-line')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <Line from={[0, 0]} to={[1, 1]} className="custom-line" data-testid="line" />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')
    expect(line?.getAttribute('class')).toContain('rsm-line')
    expect(line?.getAttribute('class')).toContain('custom-line')
  })

  it('should handle coordinates prop', () => {
    const { container } = render(
      <TestWrapper>
        <Line from={[0, 0]} to={[2, 2]} coordinates={[[0, 0], [1, 1], [2, 2]]} data-testid="line" />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')
    expect(line).toBeTruthy()
    expect(line?.getAttribute('d')).toBeTruthy()
  })

  it('should handle mouse events', () => {
    const onMouseEnter = vi.fn()
    const onMouseLeave = vi.fn()
    const onMouseDown = vi.fn()
    const onMouseUp = vi.fn()

    const { container } = render(
      <TestWrapper>
        <Line
          from={[0, 0]}
          to={[1, 1]}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          data-testid="line"
        />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')!

    fireEvent.mouseEnter(line)
    expect(onMouseEnter).toHaveBeenCalledTimes(1)

    fireEvent.mouseDown(line)
    expect(onMouseDown).toHaveBeenCalledTimes(1)

    fireEvent.mouseUp(line)
    expect(onMouseUp).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(line)
    expect(onMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('should handle focus events', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    const { container } = render(
      <TestWrapper>
        <Line
          from={[0, 0]}
          to={[1, 1]}
          onFocus={onFocus}
          onBlur={onBlur}
          data-testid="line"
        />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')!

    fireEvent.focus(line)
    expect(onFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(line)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('should apply different styles based on state', () => {
    const style = {
      default: { stroke: 'blue' },
      hover: { stroke: 'red' },
      pressed: { stroke: 'green' },
    } as any

    const { container } = render(
      <TestWrapper>
        <Line from={[0, 0]} to={[1, 1]} style={style} data-testid="line" />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')!

    // Default state
    const defaultStyle = line.getAttribute('style')
    if (defaultStyle) {
      expect(defaultStyle).toContain('stroke: blue')
    }

    // Hover state
    fireEvent.mouseEnter(line)
    const hoverStyle = line.getAttribute('style')
    if (hoverStyle) {
      expect(hoverStyle).toContain('stroke: red')
    }

    // Pressed state
    fireEvent.mouseDown(line)
    const pressedStyle = line.getAttribute('style')
    if (pressedStyle) {
      expect(pressedStyle).toContain('stroke: green')
    }
  })

  it('should render without tabIndex by default', () => {
    const { container } = render(
      <TestWrapper>
        <Line from={[0, 0]} to={[1, 1]} data-testid="line" />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')
    expect(line?.getAttribute('tabIndex')).toBeNull()
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as any }
    
    render(
      <TestWrapper>
        <Line from={[0, 0]} to={[1, 1]} ref={ref} />
      </TestWrapper>
    )

    expect(ref.current).toBeTruthy()
    expect(ref.current?.tagName.toLowerCase()).toBe('path')
  })

  it('should handle stroke and strokeWidth props', () => {
    const { container } = render(
      <TestWrapper>
        <Line 
          from={[0, 0]} 
          to={[1, 1]} 
          stroke="red" 
          strokeWidth={3}
          data-testid="line" 
        />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')
    expect(line?.getAttribute('stroke')).toBe('red')
    expect(line?.getAttribute('stroke-width')).toBe('3')
  })

  it('should handle fill prop', () => {
    const { container } = render(
      <TestWrapper>
        <Line from={[0, 0]} to={[1, 1]} fill="blue" data-testid="line" />
      </TestWrapper>
    )

    const line = container.querySelector('[data-testid="line"]')
    expect(line?.getAttribute('fill')).toBe('blue')
  })


})
