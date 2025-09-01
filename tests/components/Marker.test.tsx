import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Marker from '../../src/components/Marker'
import { MapProvider } from '../../src/components/MapProvider'

// Mock projection function
const mockProjection = vi.fn((coords) => [coords[0] * 100, coords[1] * 100]) as any
mockProjection.invert = vi.fn()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <svg>{children}</svg>
  </MapProvider>
)

describe('Marker', () => {
  it('should render marker at correct position', () => {
    const { container } = render(
      <TestWrapper>
        <Marker coordinates={[1, 2]} data-testid="marker" />
      </TestWrapper>
    )

    const marker = container.querySelector('[data-testid="marker"]')
    expect(marker).toBeTruthy()
    expect(marker?.tagName.toLowerCase()).toBe('g')
    expect(marker?.getAttribute('class')).toContain('rsm-marker')
    expect(marker?.getAttribute('transform')).toBe('translate(100, 200)')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <Marker coordinates={[0, 0]} className="custom-marker" data-testid="marker" />
      </TestWrapper>
    )

    const marker = container.querySelector('[data-testid="marker"]')
    expect(marker?.getAttribute('class')).toContain('rsm-marker')
    expect(marker?.getAttribute('class')).toContain('custom-marker')
  })

  it('should render children', () => {
    const { container } = render(
      <TestWrapper>
        <Marker coordinates={[0, 0]}>
          <circle data-testid="marker-circle" r="5" />
        </Marker>
      </TestWrapper>
    )

    const circle = container.querySelector('[data-testid="marker-circle"]')
    expect(circle).toBeTruthy()
  })

  it('should handle mouse events', () => {
    const onMouseEnter = vi.fn()
    const onMouseLeave = vi.fn()
    const onMouseDown = vi.fn()
    const onMouseUp = vi.fn()

    const { container } = render(
      <TestWrapper>
        <Marker
          coordinates={[0, 0]}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          data-testid="marker"
        />
      </TestWrapper>
    )

    const marker = container.querySelector('[data-testid="marker"]')!

    fireEvent.mouseEnter(marker)
    expect(onMouseEnter).toHaveBeenCalledTimes(1)

    fireEvent.mouseDown(marker)
    expect(onMouseDown).toHaveBeenCalledTimes(1)

    fireEvent.mouseUp(marker)
    expect(onMouseUp).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(marker)
    expect(onMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('should handle focus events', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    const { container } = render(
      <TestWrapper>
        <Marker
          coordinates={[0, 0]}
          onFocus={onFocus}
          onBlur={onBlur}
          data-testid="marker"
        />
      </TestWrapper>
    )

    const marker = container.querySelector('[data-testid="marker"]')!

    fireEvent.focus(marker)
    expect(onFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(marker)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('should not render when projection returns null', () => {
    const nullProjection = vi.fn(() => null) as any

    const { container } = render(
      <MapProvider width={800} height={600} projection={nullProjection}>
        <svg>
          <Marker coordinates={[0, 0]} data-testid="marker" />
        </svg>
      </MapProvider>
    )

    const marker = container.querySelector('[data-testid="marker"]')
    expect(marker).toBeFalsy()
  })

  it('should apply different styles based on state', () => {
    const style = {
      default: { opacity: 1 },
      hover: { opacity: 0.8 },
      pressed: { opacity: 0.6 },
    } as any

    const { container } = render(
      <TestWrapper>
        <Marker coordinates={[0, 0]} style={style} data-testid="marker" />
      </TestWrapper>
    )

    const marker = container.querySelector('[data-testid="marker"]')!

    // Default state
    expect(marker.getAttribute('style')).toContain('opacity: 1')

    // Hover state
    fireEvent.mouseEnter(marker)
    expect(marker.getAttribute('style')).toContain('opacity: 0.8')

    // Pressed state
    fireEvent.mouseDown(marker)
    expect(marker.getAttribute('style')).toContain('opacity: 0.6')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as any }

    render(
      <TestWrapper>
        <Marker coordinates={[0, 0]} ref={ref} />
      </TestWrapper>
    )

    expect(ref.current).toBeTruthy()
    expect(ref.current?.tagName.toLowerCase()).toBe('g')
  })

  it('should handle mouse leave when pressed', () => {
    const onMouseLeave = vi.fn()
    const { container } = render(
      <TestWrapper>
        <Marker
          coordinates={[0, 0]}
          onMouseLeave={onMouseLeave}
          data-testid="marker"
        />
      </TestWrapper>
    )

    const marker = container.querySelector('[data-testid="marker"]')!

    // First press down to set isPressed to true
    fireEvent.mouseDown(marker)
    // Then mouse leave should reset isPressed
    fireEvent.mouseLeave(marker)

    expect(onMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('should handle blur when pressed', () => {
    const onBlur = vi.fn()
    const { container } = render(
      <TestWrapper>
        <Marker
          coordinates={[0, 0]}
          onBlur={onBlur}
          data-testid="marker"
        />
      </TestWrapper>
    )

    const marker = container.querySelector('[data-testid="marker"]')!

    // First press down to set isPressed to true
    fireEvent.mouseDown(marker)
    // Then blur should reset isPressed
    fireEvent.blur(marker)

    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('should handle style when no style prop provided', () => {
    const { container } = render(
      <TestWrapper>
        <Marker coordinates={[0, 0]} data-testid="marker" />
      </TestWrapper>
    )

    const marker = container.querySelector('[data-testid="marker"]')
    expect(marker).toBeTruthy()
    // Should not throw error when style is undefined
  })
})
