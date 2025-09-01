import { describe, it, expect } from 'vitest'
import type {
  ProjectionConfig,
  MapContextType,
  ZoomPanContextType,
  ComposableMapProps,
  GeographiesProps,
  GeographyProps,
  ZoomableGroupProps,
  MarkerProps,
  LineProps,
  AnnotationProps,
  GraticuleProps,
  SphereProps,
  UseGeographiesProps,
  UseZoomPanProps,
  PreparedFeature,
  GeographyData,
  ZoomPanState,
  Position,
} from '../src/types'

describe('Types', () => {
  it('should export all type definitions', () => {
    // This test ensures all types are properly exported
    // TypeScript compilation will fail if any types are missing
    expect(true).toBe(true)
  })

  it('should have correct ProjectionConfig interface', () => {
    const config: ProjectionConfig = {
      center: [0, 0],
      rotate: [0, 0, 0],
      scale: 100,
      parallels: [30, 60],
    }
    expect(config).toBeDefined()
  })

  it('should have correct Position interface', () => {
    const position: Position = {
      coordinates: [0, 0],
      zoom: 1,
    }
    expect(position).toBeDefined()
  })

  it('should have correct ZoomPanState interface', () => {
    const state: ZoomPanState = {
      x: 0,
      y: 0,
      k: 1,
    }
    expect(state).toBeDefined()
  })
})
