import { Ref } from 'react';
import { ZoomableGroupProps } from '../types';
import { useMapContext } from './MapProvider';
import { ZoomPanProvider } from './ZoomPanProvider';
import useZoomPan from './useZoomPan';
import { ZoomPanIndicator } from './LoadingStates';

function ZoomableGroup({
  center = [0, 0],
  zoom = 1,
  minZoom = 1,
  maxZoom = 8,
  translateExtent,
  filterZoomEvent,
  onMoveStart,
  onMove,
  onMoveEnd,
  className = '',
  children,
  ref,
  ...restProps
}: ZoomableGroupProps & { ref?: Ref<SVGGElement> }) {
  const { width, height } = useMapContext();

  const { mapRef, transformString, position, isPending } = useZoomPan({
    center,
    ...(filterZoomEvent && { filterZoomEvent }),
    ...(onMoveStart && { onMoveStart }),
    ...(onMove && { onMove }),
    ...(onMoveEnd && { onMoveEnd }),
    scaleExtent: [minZoom, maxZoom],
    ...(translateExtent && { translateExtent }),
    zoom,
  });

  return (
    <ZoomPanProvider
      value={{ x: position.x, y: position.y, k: position.k, transformString }}
    >
      <g ref={mapRef}>
        <rect width={width} height={height} fill="transparent" />
        <g
          ref={ref}
          transform={transformString}
          className={`rsm-zoomable-group ${className}`}
          {...restProps}
        >
          {children}
        </g>
        {/* Show pending indicator during zoom/pan transitions */}
        <ZoomPanIndicator
          isPending={isPending}
          className="rsm-zoom-pan-overlay"
        />
      </g>
    </ZoomPanProvider>
  );
}

ZoomableGroup.displayName = 'ZoomableGroup';

export default ZoomableGroup;
