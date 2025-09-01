import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import ZoomableGroup from '../../src/components/ZoomableGroup'
import { MapProvider } from '../../src/components/MapProvider'

// Mock projection function
const mockProjection = vi.fn((coords: [number, number]) => [coords[0] * 100, coords[1] * 100]) as any
mockProjection.invert = vi.fn()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MapProvider width={800} height={600} projection={mockProjection}>
    <svg>{children}</svg>
  </MapProvider>
)

describe('ZoomableGroup', () => {
  it('should render zoomable group with default props', () => {
    const { container } = render(
      <TestWrapper>
        <ZoomableGroup data-testid="zoomable-group">
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')
    expect(group).toBeTruthy()
    expect(group?.tagName.toLowerCase()).toBe('g')
    expect(group?.getAttribute('class')).toContain('rsm-zoomable-group')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <TestWrapper>
        <ZoomableGroup className="custom-zoom" data-testid="zoomable-group">
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')
    expect(group?.getAttribute('class')).toContain('rsm-zoomable-group')
    expect(group?.getAttribute('class')).toContain('custom-zoom')
  })

  it('should render children', () => {
    const { container } = render(
      <TestWrapper>
        <ZoomableGroup>
          <circle data-testid="child-circle" r="5" />
          <rect data-testid="child-rect" width="10" height="10" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const circle = container.querySelector('[data-testid="child-circle"]')
    const rect = container.querySelector('[data-testid="child-rect"]')
    expect(circle).toBeTruthy()
    expect(rect).toBeTruthy()
  })

  it('should handle custom center prop', () => {
    const { container } = render(
      <TestWrapper>
        <ZoomableGroup center={[10, 20]} data-testid="zoomable-group">
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')
    expect(group).toBeTruthy()
  })

  it('should handle custom zoom props', () => {
    const { container } = render(
      <TestWrapper>
        <ZoomableGroup 
          zoom={2} 
          minZoom={0.5} 
          maxZoom={10} 
          data-testid="zoomable-group"
        >
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')
    expect(group).toBeTruthy()
  })

  it('should handle translateExtent prop', () => {
    const translateExtent: [[number, number], [number, number]] = [[0, 0], [800, 600]]
    
    const { container } = render(
      <TestWrapper>
        <ZoomableGroup 
          translateExtent={translateExtent} 
          data-testid="zoomable-group"
        >
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')
    expect(group).toBeTruthy()
  })

  it('should handle zoom event callbacks', () => {
    const onMoveStart = vi.fn()
    const onMove = vi.fn()
    const onMoveEnd = vi.fn()

    const { container } = render(
      <TestWrapper>
        <ZoomableGroup
          onMoveStart={onMoveStart}
          onMove={onMove}
          onMoveEnd={onMoveEnd}
          data-testid="zoomable-group"
        >
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')
    expect(group).toBeTruthy()
  })

  it('should handle filterZoomEvent prop', () => {
    const filterZoomEvent = vi.fn(() => true)

    const { container } = render(
      <TestWrapper>
        <ZoomableGroup
          filterZoomEvent={filterZoomEvent}
          data-testid="zoomable-group"
        >
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')
    expect(group).toBeTruthy()
  })

  it('should handle mouse events', () => {
    const onMouseEnter = vi.fn()
    const onMouseLeave = vi.fn()

    const { container } = render(
      <TestWrapper>
        <ZoomableGroup
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          data-testid="zoomable-group"
        >
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')!

    fireEvent.mouseEnter(group)
    expect(onMouseEnter).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(group)
    expect(onMouseLeave).toHaveBeenCalledTimes(1)
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as any }
    
    render(
      <TestWrapper>
        <ZoomableGroup ref={ref}>
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    expect(ref.current).toBeTruthy()
    expect(ref.current?.tagName.toLowerCase()).toBe('g')
  })

  it('should handle additional props', () => {
    const { container } = render(
      <TestWrapper>
        <ZoomableGroup data-custom="zoom-data" data-testid="zoomable-group">
          <circle r="5" />
        </ZoomableGroup>
      </TestWrapper>
    )

    const group = container.querySelector('[data-testid="zoomable-group"]')
    expect(group?.getAttribute('data-custom')).toBe('zoom-data')
  })
})
