import { Ref, memo } from 'react';
import { ComposableMapProps } from '../types';
import { MapProvider } from './MapProvider';
import { useMapDebugger } from '../utils/debugging';

function ComposableMap({
  width = 800,
  height = 600,
  projection = 'geoEqualEarth',
  projectionConfig = {},
  className = '',
  children,
  ref,
  ...restProps
}: Omit<ComposableMapProps, 'metadata'> & { ref?: Ref<SVGSVGElement> }) {
  const { logRender } = useMapDebugger('ComposableMap');

  // Log render with debugging information
  logRender({ width, height, projection, projectionConfig, className });

  return (
    <MapProvider
      width={width}
      height={height}
      projection={projection}
      projectionConfig={projectionConfig}
    >
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        className={`rsm-svg ${className}`}
        {...restProps}
      >
        {children}
      </svg>
    </MapProvider>
  );
}

ComposableMap.displayName = 'ComposableMap';

export default memo(ComposableMap);
