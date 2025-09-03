import { ZoomTransform } from 'd3-zoom';
import { Coordinates, createCoordinates } from '../types';

/**
 * Calculates coordinates from zoom transform
 * @param w - Width of the map
 * @param h - Height of the map
 * @param t - Zoom transform object
 * @returns Branded coordinates
 */
export function getCoords(w: number, h: number, t: ZoomTransform): Coordinates {
  const xOffset = (w * t.k - w) / 2;
  const yOffset = (h * t.k - h) / 2;
  const lon = w / 2 - (xOffset + t.x) / t.k;
  const lat = h / 2 - (yOffset + t.y) / t.k;
  return createCoordinates(lon, lat);
}

/**
 * Converts screen coordinates to map coordinates
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param width - Map width
 * @param height - Map height
 * @param transform - Current zoom transform
 * @returns Map coordinates
 */
export function screenToMapCoordinates(
  screenX: number,
  screenY: number,
  width: number,
  height: number,
  transform: ZoomTransform,
): Coordinates {
  const mapX = (screenX - transform.x) / transform.k;
  const mapY = (screenY - transform.y) / transform.k;

  // Convert to longitude/latitude
  const lon = (mapX / width) * 360 - 180;
  const lat = 90 - (mapY / height) * 180;

  return createCoordinates(lon, lat);
}

/**
 * Converts map coordinates to screen coordinates
 * @param coordinates - Map coordinates
 * @param width - Map width
 * @param height - Map height
 * @param transform - Current zoom transform
 * @returns Screen coordinates as [x, y]
 */
export function mapToScreenCoordinates(
  coordinates: Coordinates,
  width: number,
  height: number,
  transform: ZoomTransform,
): [number, number] {
  const [lon, lat] = coordinates;

  // Convert longitude/latitude to map coordinates
  const mapX = ((lon + 180) / 360) * width;
  const mapY = ((90 - lat) / 180) * height;

  // Apply transform
  const screenX = mapX * transform.k + transform.x;
  const screenY = mapY * transform.k + transform.y;

  return [screenX, screenY];
}

/**
 * Calculates the distance between two coordinates in kilometers
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates,
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Normalizes longitude to be within -180 to 180 range
 * @param longitude - Longitude value
 * @returns Normalized longitude
 */
export function normalizeLongitude(longitude: number): number {
  while (longitude > 180) longitude -= 360;
  while (longitude < -180) longitude += 360;
  return longitude;
}

/**
 * Normalizes latitude to be within -90 to 90 range
 * @param latitude - Latitude value
 * @returns Normalized latitude
 */
export function normalizeLatitude(latitude: number): number {
  return Math.max(-90, Math.min(90, latitude));
}

/**
 * Creates normalized coordinates ensuring they're within valid ranges
 * @param lon - Longitude
 * @param lat - Latitude
 * @returns Normalized coordinates
 */
export function createNormalizedCoordinates(
  lon: number,
  lat: number,
): Coordinates {
  return createCoordinates(normalizeLongitude(lon), normalizeLatitude(lat));
}

/**
 * Calculates the center point of multiple coordinates
 * @param coordinates - Array of coordinates
 * @returns Center coordinates
 */
export function calculateCenter(coordinates: Coordinates[]): Coordinates {
  if (coordinates.length === 0) {
    return createCoordinates(0, 0);
  }

  const sum = coordinates.reduce(
    (acc, coord) => {
      acc.lon += coord[0];
      acc.lat += coord[1];
      return acc;
    },
    { lon: 0, lat: 0 },
  );

  return createCoordinates(
    sum.lon / coordinates.length,
    sum.lat / coordinates.length,
  );
}

/**
 * Calculates bounding box for an array of coordinates
 * @param coordinates - Array of coordinates
 * @returns Bounding box as [minLon, minLat, maxLon, maxLat]
 */
export function calculateBounds(
  coordinates: Coordinates[],
): [number, number, number, number] {
  if (coordinates.length === 0) {
    return [0, 0, 0, 0];
  }

  const firstCoord = coordinates[0];
  if (!firstCoord) {
    return [0, 0, 0, 0];
  }

  let minLon = firstCoord[0] as number;
  let minLat = firstCoord[1] as number;
  let maxLon = firstCoord[0] as number;
  let maxLat = firstCoord[1] as number;

  for (const coord of coordinates) {
    const [lon, lat] = coord;
    minLon = Math.min(minLon, lon as number);
    minLat = Math.min(minLat, lat as number);
    maxLon = Math.max(maxLon, lon as number);
    maxLat = Math.max(maxLat, lat as number);
  }

  return [minLon, minLat, maxLon, maxLat];
}

// Caches for expensive coordinate calculations
const boundsCache = new Map<string, [number, number, number, number]>();
const coordinateCache = new Map<string, Coordinates>();

/**
 * Memoized version of calculateBounds for use in React components
 * @param coordinates - Array of coordinates
 * @returns Memoized bounding box calculation
 */
export function calculateBoundsMemoized(
  coordinates: Coordinates[],
): [number, number, number, number] {
  const cacheKey = `bounds:${coordinates.length}:${JSON.stringify(coordinates.slice(0, 3))}`;

  const cachedBounds = boundsCache.get(cacheKey);
  if (cachedBounds) {
    return cachedBounds;
  }

  const bounds = calculateBounds(coordinates);
  boundsCache.set(cacheKey, bounds);

  // Limit cache size to prevent memory leaks
  if (boundsCache.size > 100) {
    const firstKey = boundsCache.keys().next().value;
    if (firstKey !== undefined) {
      boundsCache.delete(firstKey);
    }
  }

  return bounds;
}

/**
 * Memoized coordinate transformation for screen to map coordinates
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param width - Map width
 * @param height - Map height
 * @param transform - Current zoom transform
 * @returns Memoized coordinate transformation
 */
export function screenToMapCoordinatesMemoized(
  screenX: number,
  screenY: number,
  width: number,
  height: number,
  transform: ZoomTransform,
): Coordinates {
  const cacheKey = `screen2map:${screenX}:${screenY}:${width}:${height}:${transform.k}:${transform.x}:${transform.y}`;

  const cachedCoordinate = coordinateCache.get(cacheKey);
  if (cachedCoordinate) {
    return cachedCoordinate;
  }

  const coords = screenToMapCoordinates(
    screenX,
    screenY,
    width,
    height,
    transform,
  );
  coordinateCache.set(cacheKey, coords);

  // Limit cache size
  if (coordinateCache.size > 100) {
    const firstKey = coordinateCache.keys().next().value;
    if (firstKey !== undefined) {
      coordinateCache.delete(firstKey);
    }
  }

  return coords;
}

/**
 * Clear coordinate transformation cache (useful for testing or memory management)
 */
export function clearCoordinateCache(): void {
  coordinateCache.clear();
}
