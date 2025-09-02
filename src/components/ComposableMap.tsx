import { Ref } from 'react';
import { ComposableMapProps } from '../types';
import { MapProvider } from './MapProvider';
import { MapMetadata, mapMetadataPresets } from './MapMetadata';
import { useMapDebugger } from '../utils/debugging';

function ComposableMap({
  width = 800,
  height = 600,
  projection = 'geoEqualEarth',
  projectionConfig = {},
  className = '',
  children,
  metadata,
  ref,
  ...restProps
}: ComposableMapProps & { ref?: Ref<SVGSVGElement> }) {
  const { logRender } = useMapDebugger('ComposableMap');

  // Log render with debugging information
  logRender({ width, height, projection, projectionConfig, className });
  return (
    <>
      {/* Include metadata if provided */}
      {metadata && (
        <MapMetadata
          title={metadata.title || mapMetadataPresets.worldMap.title}
          description={
            metadata.description || mapMetadataPresets.worldMap.description
          }
          keywords={metadata.keywords || mapMetadataPresets.worldMap.keywords}
          {...(metadata.author && { author: metadata.author })}
          {...(metadata.canonicalUrl && {
            canonicalUrl: metadata.canonicalUrl,
          })}
          ogTitle={metadata.title || mapMetadataPresets.worldMap.ogTitle}
          ogDescription={
            metadata.description || mapMetadataPresets.worldMap.ogDescription
          }
          twitterTitle={
            metadata.title || mapMetadataPresets.worldMap.twitterTitle
          }
          twitterDescription={
            metadata.description ||
            mapMetadataPresets.worldMap.twitterDescription
          }
          jsonLd={mapMetadataPresets.worldMap.jsonLd}
        />
      )}

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
    </>
  );
}

ComposableMap.displayName = 'ComposableMap';

export default ComposableMap;
