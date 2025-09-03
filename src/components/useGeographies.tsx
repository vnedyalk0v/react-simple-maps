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
import {
  cacheFeatures,
  getCachedFeatures,
  cachePreparedFeatures,
  getCachedPreparedFeatures,
  cacheMeshData,
  getCachedMeshData,
  generateFeaturesCacheKey,
  generatePreparedFeaturesCacheKey,
  generateMeshCacheKey,
  getCachedGeographyData,
  cacheGeographyData,
  getCachedPreparedFeaturesWeakMap,
  cachePreparedFeaturesWeakMap,
} from '../utils/geography-cache';
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

  // Granular memoization for expensive operations

  // Memoize feature extraction with aggressive caching
  const rawFeatures = useMemo(() => {
    if (isLoading || !loadedData) return [];

    // Try WeakMap cache first for object-based geography data
    if (
      loadedData &&
      typeof loadedData === 'object' &&
      !Array.isArray(loadedData)
    ) {
      const weakMapCached = getCachedGeographyData(loadedData);
      if (weakMapCached) {
        return weakMapCached.features;
      }
    }

    // Fall back to LRU cache
    const cacheKey = generateFeaturesCacheKey(loadedData, parseGeographies);
    const cached = getCachedFeatures(cacheKey);

    if (cached) {
      return cached;
    }

    // Extract features
    const features = getFeatures(loadedData, parseGeographies);

    // Cache in both systems
    cacheFeatures(cacheKey, features);
    if (
      loadedData &&
      typeof loadedData === 'object' &&
      !Array.isArray(loadedData)
    ) {
      const mesh = getMesh(loadedData);
      cacheGeographyData(loadedData, features, mesh);
    }

    return features;
  }, [loadedData, isLoading, parseGeographies]);

  // Memoize mesh extraction separately
  const rawMesh = useMemo(() => {
    if (isLoading || !loadedData) return null;
    return getMesh(loadedData);
  }, [loadedData, isLoading]);

  // Memoize prepared features with aggressive caching (path generation is expensive)
  const preparedGeographies = useMemo(() => {
    if (rawFeatures.length === 0) return [];

    // Try WeakMap cache first if we have the original geography object
    if (
      loadedData &&
      typeof loadedData === 'object' &&
      !Array.isArray(loadedData)
    ) {
      const pathFunctionString = path.toString().slice(0, 100);
      const weakMapCached = getCachedPreparedFeaturesWeakMap(
        loadedData,
        pathFunctionString,
      );
      if (weakMapCached) {
        return weakMapCached;
      }
    }

    // Fall back to LRU cache
    const cacheKey = generatePreparedFeaturesCacheKey(rawFeatures, path);
    const cached = getCachedPreparedFeatures(cacheKey);

    if (cached) {
      return cached;
    }

    // Generate prepared features
    const prepared = prepareFeatures(rawFeatures, path);

    // Cache in both systems
    cachePreparedFeatures(cacheKey, prepared);
    if (
      loadedData &&
      typeof loadedData === 'object' &&
      !Array.isArray(loadedData)
    ) {
      const pathFunctionString = path.toString().slice(0, 100);
      cachePreparedFeaturesWeakMap(loadedData, prepared, pathFunctionString);
    }

    return prepared;
  }, [rawFeatures, path, loadedData]);

  // Memoize prepared mesh with caching (path generation for borders/outline)
  const preparedMeshData = useMemo(() => {
    if (!rawMesh) return { outline: '', borders: '' };

    const cacheKey = generateMeshCacheKey(loadedData, path);
    const cached = getCachedMeshData(cacheKey);

    if (cached) {
      return cached;
    }

    const prepared = prepareMesh(
      rawMesh.outline || null,
      rawMesh.borders || null,
      path,
    );

    const result = {
      outline: prepared.outline || '',
      borders: prepared.borders || '',
    };

    cacheMeshData(cacheKey, result);
    return result;
  }, [rawMesh, path, loadedData]);

  // Final memoized result
  return useMemo(() => {
    return {
      geographies: preparedGeographies,
      outline: preparedMeshData.outline,
      borders: preparedMeshData.borders,
    };
  }, [preparedGeographies, preparedMeshData]);
}
