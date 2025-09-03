import { Ref, ReactNode, memo } from 'react';
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

  const GeographiesContent = () => {
    const { geographies, outline, borders } = useGeographies({
      geography,
      ...(parseGeographies && { parseGeographies }),
    });

    return (
      <>
        {geographies &&
          geographies.length > 0 &&
          children({ geographies, outline, borders, path, projection })}
      </>
    );
  };

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

export default memo(Geographies);
