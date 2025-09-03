import React, { createContext, useMemo, useContext, ReactNode } from 'react';
import * as d3Geo from 'd3-geo';
import { GeoProjection } from 'd3-geo';
import { MapContextType, ProjectionConfig } from '../types';

const { geoPath, ...projections } = d3Geo;

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MakeProjectionParams {
  projectionConfig?: ProjectionConfig;
  projection: string | GeoProjection;
  width: number;
  height: number;
}

const makeProjection = ({
  projectionConfig = {},
  projection = 'geoEqualEarth',
  width = 800,
  height = 600,
}: MakeProjectionParams): GeoProjection => {
  const isFunc = typeof projection === 'function';

  if (isFunc) return projection as GeoProjection;

  const projectionName = projection as keyof typeof projections;
  if (!(projectionName in projections)) {
    throw new Error(`Unknown projection: ${projection}`);
  }

  let proj = (projections[projectionName] as () => GeoProjection)().translate([
    width / 2,
    height / 2,
  ]);

  // Apply projection configuration
  if (projectionConfig.center && proj.center) {
    proj = proj.center(projectionConfig.center);
  }
  if (projectionConfig.rotate && proj.rotate) {
    proj = proj.rotate(projectionConfig.rotate);
  }
  if (projectionConfig.scale && proj.scale) {
    proj = proj.scale(projectionConfig.scale);
  }

  return proj;
};

interface MapProviderProps {
  width: number;
  height: number;
  projection?: string | GeoProjection;
  projectionConfig?: ProjectionConfig;
  children: ReactNode;
}

const MapProvider: React.FC<MapProviderProps> = ({
  width,
  height,
  projection,
  projectionConfig = {},
  children,
}) => {
  const projMemo = useMemo(() => {
    return makeProjection({
      projectionConfig,
      projection: projection || 'geoEqualEarth',
      width,
      height,
    });
  }, [width, height, projection, projectionConfig]);

  const value = useMemo((): MapContextType => {
    return {
      width,
      height,
      projection: projMemo,
      path: geoPath().projection(projMemo),
    };
  }, [width, height, projMemo]);

  return <MapContext value={value}>{children}</MapContext>;
};

const useMapContext = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

export { MapProvider, MapContext, useMapContext };
