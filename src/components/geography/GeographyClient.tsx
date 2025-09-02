import { Suspense, ReactNode } from 'react';
import { FeatureCollection } from 'geojson';
import { Topology } from 'topojson-specification';
import {
  GeographyServer,
  GeographyProcessor,
  ParseGeographiesFunction,
} from './GeographyServer';
import { GeographyLoadingSkeleton } from '../loading';
import { GeographyData } from '../../types';

interface GeographyClientProps {
  geography: string | Topology | FeatureCollection;
  children: (data: GeographyData) => ReactNode;
  parseGeographies?: ParseGeographiesFunction;
  fallback?: ReactNode;
}

// Client Component wrapper that handles both string URLs and direct data
export function GeographyClient({
  geography,
  children,
  parseGeographies,
  fallback,
}: GeographyClientProps) {
  const loadingFallback = fallback || <GeographyLoadingSkeleton />;

  if (typeof geography === 'string') {
    return (
      <Suspense fallback={loadingFallback}>
        <GeographyServer
          geography={geography}
          {...(parseGeographies && { parseGeographies })}
        >
          {children}
        </GeographyServer>
      </Suspense>
    );
  }

  // Handle direct geography data
  return (
    <GeographyProcessor
      geographyData={geography}
      {...(parseGeographies && { parseGeographies })}
    >
      {children}
    </GeographyProcessor>
  );
}

// Export types for external use
export type { GeographyClientProps };

export default GeographyClient;
