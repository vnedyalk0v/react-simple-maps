import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Add SVG element types to global scope
Object.defineProperty(global, 'SVGElement', {
  value: class SVGElement extends Element {},
})
Object.defineProperty(global, 'SVGSVGElement', {
  value: class SVGSVGElement extends SVGElement {},
})
Object.defineProperty(global, 'SVGGElement', {
  value: class SVGGElement extends SVGElement {},
})
Object.defineProperty(global, 'SVGPathElement', {
  value: class SVGPathElement extends SVGElement {},
})

// Mock D3 modules for testing
vi.mock('d3-geo', () => ({
  geoPath: vi.fn(() => {
    const pathFn = vi.fn(() => 'M0,0L10,10') as any
    pathFn.projection = vi.fn(() => pathFn)
    return pathFn
  }),
  geoEqualEarth: vi.fn(() => ({
    translate: vi.fn().mockReturnThis(),
    scale: vi.fn().mockReturnThis(),
    center: vi.fn().mockReturnThis(),
    rotate: vi.fn().mockReturnThis(),
    parallels: vi.fn().mockReturnThis(),
  })),
  geoMercator: vi.fn(() => ({
    translate: vi.fn().mockReturnThis(),
    scale: vi.fn().mockReturnThis(),
    center: vi.fn().mockReturnThis(),
    rotate: vi.fn().mockReturnThis(),
    parallels: vi.fn().mockReturnThis(),
  })),
  geoGraticule: vi.fn(() => ({
    step: vi.fn(() => vi.fn(() => ({ type: 'MultiLineString', coordinates: [] }))),
  })),
}))

vi.mock('d3-zoom', () => ({
  zoom: vi.fn(() => ({
    filter: vi.fn().mockReturnThis(),
    scaleExtent: vi.fn().mockReturnThis(),
    translateExtent: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    transform: vi.fn(),
  })),
  zoomIdentity: {
    translate: vi.fn().mockReturnThis(),
    scale: vi.fn().mockReturnThis(),
  },
}))

vi.mock('d3-selection', () => ({
  select: vi.fn(() => ({
    call: vi.fn(),
  })),
}))

vi.mock('topojson-client', () => ({
  feature: vi.fn(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [] },
        properties: {},
      },
    ],
  })),
  mesh: vi.fn(() => ({
    type: 'MultiLineString',
    coordinates: [],
  })),
}))

// Mock fetch for geography loading
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        type: 'Topology',
        objects: {
          countries: {
            type: 'GeometryCollection',
            geometries: [],
          },
        },
      }),
  })
) as any

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}
