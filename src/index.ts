export { default as ComposableMap } from './components/ComposableMap';
export { default as MapWithMetadata } from './components/MapWithMetadata';
export { default as Geographies } from './components/Geographies';
export { default as Geography } from './components/Geography';
export { default as Graticule } from './components/Graticule';
export { default as ZoomableGroup } from './components/ZoomableGroup';
export { default as Sphere } from './components/Sphere';
export { default as Marker } from './components/Marker';
export { default as Line } from './components/Line';
export { default as Annotation } from './components/Annotation';
export {
  MapProvider,
  MapContext,
  useMapContext,
} from './components/MapProvider';
export {
  ZoomPanProvider,
  ZoomPanContext,
  useZoomPanContext,
} from './components/ZoomPanProvider';
export { default as useGeographies } from './components/useGeographies';
export { default as useZoomPan } from './components/useZoomPan';

// React 19 specific exports
export { default as GeographyErrorBoundary } from './components/GeographyErrorBoundary';

// Export utility functions for branded types
export {
  createLongitude,
  createLatitude,
  createCoordinates,
  createScaleExtent,
  createTranslateExtent,
  createParallels,
  createGraticuleStep,
} from './types';

// Export types for TypeScript users
export type {
  ComposableMapProps,
  GeographiesProps,
  GeographyProps,
  GraticuleProps,
  ZoomableGroupProps,
  SphereProps,
  MarkerProps,
  LineProps,
  AnnotationProps,
  MapContextType,
  ZoomPanContextType,
  UseGeographiesProps,
  ProjectionConfig,
  PreparedFeature,
  GeographyData,
  ZoomPanState,
  Position,
  Coordinates,
  Longitude,
  Latitude,
} from './types';

// Export MapWithMetadata types
export type { MapWithMetadataProps } from './components/MapWithMetadata';
