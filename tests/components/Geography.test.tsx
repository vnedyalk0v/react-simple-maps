import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Geography from '../../src/components/Geography'

const mockGeography = {
  type: 'Feature' as const,
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
  },
  properties: {},
  svgPath: 'M0,0L100,0L100,100L0,100Z',
}

describe('Geography', () => {
  it('should render geography path', () => {
    const { container } = render(<Geography geography={mockGeography} />)

    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.tagName.toLowerCase()).toBe('path')
    expect(path?.getAttribute('class')).toContain('rsm-geography')
  })

  it('should apply custom className', () => {
    const { container } = render(<Geography geography={mockGeography} className="custom-geo" />)

    const path = container.querySelector('path')
    expect(path?.getAttribute('class')).toContain('rsm-geography')
    expect(path?.getAttribute('class')).toContain('custom-geo')
  })

  it('should handle mouse events', () => {
    const onMouseEnter = vi.fn()
    const onMouseLeave = vi.fn()
    const onMouseDown = vi.fn()
    const onMouseUp = vi.fn()

    const { container } = render(
      <Geography
        geography={mockGeography}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    )

    const path = container.querySelector('path')!
    
    fireEvent.mouseEnter(path)
    expect(onMouseEnter).toHaveBeenCalledTimes(1)
    
    fireEvent.mouseDown(path)
    expect(onMouseDown).toHaveBeenCalledTimes(1)
    
    fireEvent.mouseUp(path)
    expect(onMouseUp).toHaveBeenCalledTimes(1)
    
    fireEvent.mouseLeave(path)
    expect(onMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('should handle focus events', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    const { container } = render(
      <Geography
        geography={mockGeography}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )

    const path = container.querySelector('path')!

    fireEvent.focus(path)
    expect(onFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(path)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('should apply different styles based on state', () => {
    const style = {
      default: { fill: 'blue' },
      hover: { fill: 'red' },
      pressed: { fill: 'green' },
    }

    const { container } = render(<Geography geography={mockGeography} style={style} />)

    const path = container.querySelector('path')!
    
    // Default state
    expect(path).toHaveStyle({ fill: 'blue' })
    
    // Hover state
    fireEvent.mouseEnter(path)
    expect(path).toHaveStyle({ fill: 'red' })
    
    // Pressed state
    fireEvent.mouseDown(path)
    expect(path).toHaveStyle({ fill: 'green' })
  })

  it('should be focusable', () => {
    const { container } = render(<Geography geography={mockGeography} />)

    const path = container.querySelector('path')
    expect(path).toHaveAttribute('tabIndex', '0')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as any }
    render(<Geography geography={mockGeography} ref={ref} />)

    expect(ref.current).toBeTruthy()
    expect(ref.current?.tagName.toLowerCase()).toBe('path')
  })

  it('should handle mouse leave when pressed', () => {
    const onMouseLeave = vi.fn()
    const { container } = render(
      <Geography
        geography={mockGeography}
        onMouseLeave={onMouseLeave}
        data-testid="geography"
      />
    )

    const path = container.querySelector('[data-testid="geography"]')!

    // First press down to set isPressed to true
    fireEvent.mouseDown(path)
    // Then mouse leave should reset isPressed
    fireEvent.mouseLeave(path)

    expect(onMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('should handle blur when pressed', () => {
    const onBlur = vi.fn()
    const { container } = render(
      <Geography
        geography={mockGeography}
        onBlur={onBlur}
        data-testid="geography"
      />
    )

    const path = container.querySelector('[data-testid="geography"]')!

    // First press down to set isPressed to true
    fireEvent.mouseDown(path)
    // Then blur should reset isPressed
    fireEvent.blur(path)

    expect(onBlur).toHaveBeenCalledTimes(1)
  })
})
