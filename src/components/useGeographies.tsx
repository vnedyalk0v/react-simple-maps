import { use, useMemo, useEffect } from 'react';
import { useMapContext } from './MapProvider';
import { UseGeographiesProps, GeographyData } from '../types';
import {
  fetchGeographiesCache,
  getFeatures,
  getMesh,
  prepareFeatures,
  isString,
  prepareMesh,
} from '../utils';
import { preloadGeography } from '../utils/preloading';
import { devTools } from '../utils/debugging';

export default function useGeographies({
  geography,
  parseGeographies,
}: UseGeographiesProps): GeographyData {
  const { path } = useMapContext();

  // Preload geography resources using React 19 preloading APIs
  useEffect(() => {
    if (isString(geography)) {
      // Preload the geography resource for better performance
      preloadGeography(geography);
    }
  }, [geography]);

  // React 19 compliance: use() API must be called at top level, not inside useMemo
  let geographyData;
  if (isString(geography)) {
    devTools.debugGeographyLoading(geography, 'start');
    // Error handling is delegated to Error Boundaries
    geographyData = use(fetchGeographiesCache(geography));
    devTools.debugGeographyLoading(geography, 'success', geographyData);
  } else {
    geographyData = geography;
  }

  return useMemo(() => {
    const features = getFeatures(geographyData, parseGeographies);
    const mesh = getMesh(geographyData);
    const preparedMesh = prepareMesh(
      mesh?.outline || null,
      mesh?.borders || null,
      path,
    );

    return {
      geographies: prepareFeatures(features, path),
      outline: preparedMesh.outline || '',
      borders: preparedMesh.borders || '',
    };
  }, [geographyData, parseGeographies, path]);
}
