import { Ref, ReactNode, memo, useMemo, useCallback } from 'react';
import { GeographiesProps } from '../types';
import { useMapContext } from './MapProvider';
import useGeographies from './useGeographies';
import GeographyErrorBoundary from './GeographyErrorBoundary';
import { GeographyOptimizedSuspense } from './OptimizedSuspense';

function Geographies({
  geography,
  children,
  parseGeographies,
  className = '',
  errorBoundary = false,
  onGeographyError,
  fallback,
  ref,
  ...restProps
}: GeographiesProps & { ref?: Ref<SVGGElement> }) {
  const { path, projection } = useMapContext();

  // Memoize the geography data fetching to prevent unnecessary re-fetches
  const geographyData = useGeographies({
    geography,
    ...(parseGeographies && { parseGeographies }),
  });

  // Memoize the children render function to prevent unnecessary re-renders
  const renderChildren = useCallback(() => {
    const { geographies, outline, borders } = geographyData;

    if (!geographies || geographies.length === 0) {
      return null;
    }

    return children({ geographies, outline, borders, path, projection });
  }, [geographyData, children, path, projection]);

  // Memoize the content component to prevent unnecessary re-renders
  const GeographiesContent = useMemo(() => {
    return () => renderChildren();
  }, [renderChildren]);

  // Build a consistent fallback element for Suspense
  const suspenseFallback = (
    <text className="rsm-loading-text" x="50%" y="50%" textAnchor="middle">
      Loading...
    </text>
  );

  if (errorBoundary) {
    const errorBoundaryProps: {
      onError?: (error: Error) => void;
      fallback?: (error: Error, retry: () => void) => ReactNode;
    } = {};

    if (onGeographyError) {
      errorBoundaryProps.onError = onGeographyError;
    }

    if (fallback) {
      errorBoundaryProps.fallback = fallback;
    }

    return (
      <g ref={ref} className={`rsm-geographies ${className}`} {...restProps}>
        <GeographyErrorBoundary {...errorBoundaryProps}>
          <GeographyOptimizedSuspense
            fallback={suspenseFallback}
            {...(typeof geography === 'string' && { geographyUrl: geography })}
            priority="high"
            expectedLoadTime={2000}
          >
            <GeographiesContent />
          </GeographyOptimizedSuspense>
        </GeographyErrorBoundary>
      </g>
    );
  }

  return (
    <g ref={ref} className={`rsm-geographies ${className}`} {...restProps}>
      <GeographyOptimizedSuspense
        fallback={suspenseFallback}
        {...(typeof geography === 'string' && { geographyUrl: geography })}
        priority="high"
        expectedLoadTime={2000}
      >
        <GeographiesContent />
      </GeographyOptimizedSuspense>
    </g>
  );
}

Geographies.displayName = 'Geographies';

// Custom comparison function for memo to prevent unnecessary re-renders
const areGeographiesPropsEqual = (
  prevProps: GeographiesProps & { ref?: Ref<SVGGElement> },
  nextProps: GeographiesProps & { ref?: Ref<SVGGElement> },
): boolean => {
  // Check if geography source has changed (most important check)
  if (prevProps.geography !== nextProps.geography) {
    return false;
  }

  // Check if parseGeographies function has changed
  if (prevProps.parseGeographies !== nextProps.parseGeographies) {
    return false;
  }

  // Check if children render function has changed
  if (prevProps.children !== nextProps.children) {
    return false;
  }

  // Check error boundary configuration
  if (prevProps.errorBoundary !== nextProps.errorBoundary) {
    return false;
  }

  if (prevProps.onGeographyError !== nextProps.onGeographyError) {
    return false;
  }

  if (prevProps.fallback !== nextProps.fallback) {
    return false;
  }

  // Check className
  if (prevProps.className !== nextProps.className) {
    return false;
  }

  // All other props are considered equal if we reach here
  return true;
};

export default memo(Geographies, areGeographiesPropsEqual);
