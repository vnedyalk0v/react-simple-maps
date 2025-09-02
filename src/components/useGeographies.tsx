import { useMemo, useEffect, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { Topology } from 'topojson-specification';
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
  const [loadedData, setLoadedData] = useState<
    Topology | FeatureCollection | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle string URLs with traditional async loading
  useEffect(() => {
    if (isString(geography)) {
      setIsLoading(true);
      preloadGeography(geography);

      devTools.debugGeographyLoading(geography, 'start');

      fetchGeographiesCache(geography)
        .then((data) => {
          devTools.debugGeographyLoading(geography, 'success', data);
          setLoadedData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          devTools.debugGeographyLoading(geography, 'error', error);
          setIsLoading(false);
        });
    } else {
      setLoadedData(geography);
      setIsLoading(false);
    }
  }, [geography]);

  return useMemo(() => {
    if (isLoading || !loadedData) {
      // Return empty data structure while loading
      return {
        geographies: [],
        outline: '',
        borders: '',
      };
    }

    const features = getFeatures(loadedData, parseGeographies);
    const mesh = getMesh(loadedData);
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
  }, [loadedData, isLoading, parseGeographies, path]);
}
