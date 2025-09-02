import { ReactNode, SVGProps, CSSProperties } from "react"
import { GeoPath, GeoProjection } from "d3-geo"
import { Feature, FeatureCollection, Geometry } from "geojson"
import { Topology } from "topojson-specification"

// Modern React patterns types
export type ErrorBoundaryFallback = (error: Error, retry: () => void) => ReactNode

// Branded types for better type safety
export type Longitude = number & { __brand: "longitude" }
export type Latitude = number & { __brand: "latitude" }
export type Coordinates = [Longitude, Latitude]

// Template literal types for projections
export type ProjectionName = `geo${Capitalize<string>}`

// Base types
export interface ProjectionConfig {
  center?: [number, number]
  rotate?: [number, number, number]
  scale?: number
  parallels?: [number, number]
}

export interface MapContextType {
  width: number
  height: number
  projection: GeoProjection
  path: GeoPath
}

export interface ZoomPanContextType {
  x: number
  y: number
  k: number
  transformString: string
}

// Component Props
export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  projection?: ProjectionName | string | GeoProjection
  projectionConfig?: ProjectionConfig
  className?: string
  children?: ReactNode

  // Modern React patterns
  onGeographyError?: (error: Error) => void
  fallback?: ReactNode
}

export interface GeographiesProps extends Omit<SVGProps<SVGGElement>, "children" | "onError"> {
  geography: string | Topology | FeatureCollection
  children: (props: {
    geographies: Feature<Geometry>[]
    outline: string
    borders: string
    path: GeoPath
    projection: GeoProjection
  }) => ReactNode
  parseGeographies?: (geographies: Feature<Geometry>[]) => Feature<Geometry>[]
  className?: string

  // Modern React patterns
  errorBoundary?: boolean
  onGeographyError?: (error: Error) => void
  fallback?: ErrorBoundaryFallback
}

export interface GeographyProps extends Omit<SVGProps<SVGPathElement>, "style"> {
  geography: Feature<Geometry>
  onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void
  onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void
  onMouseDown?: (event: React.MouseEvent<SVGPathElement>) => void
  onMouseUp?: (event: React.MouseEvent<SVGPathElement>) => void
  onFocus?: (event: React.FocusEvent<SVGPathElement>) => void
  onBlur?: (event: React.FocusEvent<SVGPathElement>) => void
  style?: {
    default?: CSSProperties
    hover?: CSSProperties
    pressed?: CSSProperties
  }
  className?: string
}

export interface ZoomableGroupProps extends SVGProps<SVGGElement> {
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  translateExtent?: [[number, number], [number, number]]
  filterZoomEvent?: (event: Event) => boolean
  onMoveStart?: (position: Position, event: Event) => void
  onMove?: (position: Position, event: Event) => void
  onMoveEnd?: (position: Position, event: Event) => void
  className?: string
  children?: ReactNode
}

export interface MarkerProps extends Omit<SVGProps<SVGGElement>, "style"> {
  coordinates: Coordinates
  onMouseEnter?: (event: React.MouseEvent<SVGGElement>) => void
  onMouseLeave?: (event: React.MouseEvent<SVGGElement>) => void
  onMouseDown?: (event: React.MouseEvent<SVGGElement>) => void
  onMouseUp?: (event: React.MouseEvent<SVGGElement>) => void
  onFocus?: (event: React.FocusEvent<SVGGElement>) => void
  onBlur?: (event: React.FocusEvent<SVGGElement>) => void
  style?: {
    default?: CSSProperties
    hover?: CSSProperties
    pressed?: CSSProperties
  }
  className?: string
  children?: ReactNode
}

export interface LineProps extends Omit<SVGProps<SVGPathElement>, "from" | "to"> {
  from: Coordinates
  to: Coordinates
  coordinates?: Coordinates[]
  className?: string
}

export interface AnnotationProps extends SVGProps<SVGGElement> {
  subject: Coordinates
  dx?: number
  dy?: number
  curve?: number
  connectorProps?: SVGProps<SVGPathElement>
  className?: string
  children?: ReactNode
}

export interface GraticuleProps extends SVGProps<SVGPathElement> {
  step?: [number, number]
  className?: string
}

export interface SphereProps extends SVGProps<SVGPathElement> {
  id?: string
  className?: string
}

// Hook Props
export interface UseGeographiesProps {
  geography: string | Topology | FeatureCollection
  parseGeographies?: (geographies: Feature<Geometry>[]) => Feature<Geometry>[]
}

export interface UseZoomPanProps {
  center: [number, number]
  zoom: number
  scaleExtent: [number, number]
  translateExtent?: [[number, number], [number, number]]
  filterZoomEvent?: (event: Event) => boolean
  onMoveStart?: (position: Position, event: Event) => void
  onMove?: (position: Position, event: Event) => void
  onMoveEnd?: (position: Position, event: Event) => void
}

// Utility types
export interface PreparedFeature extends Feature<Geometry> {
  svgPath: string
}

export interface GeographyData {
  geographies: PreparedFeature[]
  outline: string
  borders: string
  center?: Coordinates // Use branded type for center coordinates
}

export interface ZoomPanState {
  x: number
  y: number
  k: number
}

export interface Position {
  coordinates: Coordinates
  zoom: number
}

// Modern React patterns interfaces
export interface GeographyErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error) => void
}

// Server Component compatible geography props
export interface GeographyServerProps {
  geography: string
  children: (data: GeographyData) => ReactNode
  cache?: boolean
}
