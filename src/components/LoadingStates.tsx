// Re-export all loading components from the modular structure
// This file now serves as a backward-compatible entry point
export {
  GeographyLoadingSkeleton,
  GeographyPathSkeleton,
  PendingIndicator,
  MapLoadingOverlay,
  ZoomPanIndicator,
  LoadingProgressBar,
  GeographyFeatureSkeleton,
} from './loading';

// Maintain backward compatibility with the default export
export { default } from './loading';
