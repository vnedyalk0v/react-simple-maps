import { describe, it, expect } from 'vitest'
import * as ReactSimpleMaps from '../src/index'

describe('Index Exports', () => {
  it('should export all components', () => {
    expect(ReactSimpleMaps.ComposableMap).toBeDefined()
    expect(ReactSimpleMaps.Geographies).toBeDefined()
    expect(ReactSimpleMaps.Geography).toBeDefined()
    expect(ReactSimpleMaps.Graticule).toBeDefined()
    expect(ReactSimpleMaps.ZoomableGroup).toBeDefined()
    expect(ReactSimpleMaps.Sphere).toBeDefined()
    expect(ReactSimpleMaps.Marker).toBeDefined()
    expect(ReactSimpleMaps.Line).toBeDefined()
    expect(ReactSimpleMaps.Annotation).toBeDefined()
  })

  it('should export provider components', () => {
    expect(ReactSimpleMaps.MapProvider).toBeDefined()
    expect(ReactSimpleMaps.MapContext).toBeDefined()
    expect(ReactSimpleMaps.useMapContext).toBeDefined()
    expect(ReactSimpleMaps.ZoomPanProvider).toBeDefined()
    expect(ReactSimpleMaps.ZoomPanContext).toBeDefined()
    expect(ReactSimpleMaps.useZoomPanContext).toBeDefined()
  })

  it('should export hooks', () => {
    expect(ReactSimpleMaps.useGeographies).toBeDefined()
    expect(ReactSimpleMaps.useZoomPan).toBeDefined()
  })

  it('should export components as functions or objects (forwardRef)', () => {
    // Components can be functions or objects (when using forwardRef)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.ComposableMap)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.Geographies)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.Geography)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.Graticule)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.ZoomableGroup)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.Sphere)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.Marker)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.Line)
    expect(['function', 'object']).toContain(typeof ReactSimpleMaps.Annotation)
  })

  it('should export providers as functions', () => {
    expect(typeof ReactSimpleMaps.MapProvider).toBe('function')
    expect(typeof ReactSimpleMaps.ZoomPanProvider).toBe('function')
    expect(typeof ReactSimpleMaps.useMapContext).toBe('function')
    expect(typeof ReactSimpleMaps.useZoomPanContext).toBe('function')
  })

  it('should export hooks as functions', () => {
    expect(typeof ReactSimpleMaps.useGeographies).toBe('function')
    expect(typeof ReactSimpleMaps.useZoomPan).toBe('function')
  })

  it('should export contexts as objects', () => {
    expect(typeof ReactSimpleMaps.MapContext).toBe('object')
    expect(typeof ReactSimpleMaps.ZoomPanContext).toBe('object')
  })

  it('should have all expected exports', () => {
    const expectedExports = [
      'ComposableMap',
      'Geographies',
      'Geography',
      'Graticule',
      'ZoomableGroup',
      'Sphere',
      'Marker',
      'Line',
      'Annotation',
      'MapProvider',
      'MapContext',
      'useMapContext',
      'ZoomPanProvider',
      'ZoomPanContext',
      'useZoomPanContext',
      'useGeographies',
      'useZoomPan',
    ]

    expectedExports.forEach(exportName => {
      expect(ReactSimpleMaps).toHaveProperty(exportName)
    })
  })

  it('should not have undefined exports', () => {
    const exportValues = Object.values(ReactSimpleMaps)
    exportValues.forEach(exportValue => {
      expect(exportValue).toBeDefined()
    })
  })
})
