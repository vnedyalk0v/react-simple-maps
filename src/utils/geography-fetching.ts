import { cache } from 'react';
import { FeatureCollection } from 'geojson';
import { Topology } from 'topojson-specification';
import { GeographyError } from '../types';
import {
  validateGeographyUrl,
  validateContentType,
  validateResponseSize,
  validateGeographyData,
  GEOGRAPHY_FETCH_CONFIG,
} from './geography-validation';
import { createGeographyFetchError } from './error-utils';
import {
  getSRIForUrl,
  validateSRIFromArrayBuffer,
} from './subresource-integrity';

/**
 * Creates fetch options with security headers and timeout
 * @param signal - AbortController signal for timeout
 * @returns Fetch options object
 */
function createSecureFetchOptions(signal: AbortSignal): RequestInit {
  return {
    signal,
    headers: {
      Accept: GEOGRAPHY_FETCH_CONFIG.ALLOWED_CONTENT_TYPES.join(', '),
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
    // Security headers
    mode: 'cors',
    credentials: 'omit', // Don't send credentials
  };
}

/**
 * Creates an abort controller with timeout
 * @param timeoutMs - Timeout in milliseconds
 * @returns Object with controller and cleanup function
 */
function createTimeoutController(timeoutMs: number): {
  controller: AbortController;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  return {
    controller,
    cleanup: () => clearTimeout(timeoutId),
  };
}

/**
 * Handles fetch errors and converts them to geography-specific errors
 * @param error - The original error
 * @param url - The URL that was being fetched
 * @returns A GeographyError
 */
function handleFetchError(error: unknown, url: string): GeographyError {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return createGeographyFetchError(
        'GEOGRAPHY_LOAD_ERROR',
        `Request timeout after ${GEOGRAPHY_FETCH_CONFIG.TIMEOUT_MS}ms`,
        url,
        error,
      );
    }
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return createGeographyFetchError(
        'GEOGRAPHY_LOAD_ERROR',
        `Network error: Unable to fetch geography from ${url}`,
        url,
        error,
      );
    }
    if (error.message.includes('Invalid geography data')) {
      return createGeographyFetchError(
        'GEOGRAPHY_PARSE_ERROR',
        error.message,
        url,
        error,
      );
    }
  }

  // Re-throw if it's already a GeographyError
  if (error instanceof Error && 'type' in error) {
    return error as GeographyError;
  }

  // Default error
  return createGeographyFetchError(
    'GEOGRAPHY_LOAD_ERROR',
    error instanceof Error ? error.message : 'Unknown error occurred',
    url,
    error instanceof Error ? error : undefined,
  );
}

/**
 * Parses JSON response with proper error handling
 * @param response - The fetch response
 * @param url - The URL for error context
 * @returns Parsed geography data
 */
async function parseGeographyResponse(
  response: Response,
  url: string,
): Promise<Topology | FeatureCollection> {
  try {
    const data = await response.json();
    validateGeographyData(data);
    return data as Topology | FeatureCollection;
  } catch (jsonError) {
    if (jsonError instanceof SyntaxError) {
      throw createGeographyFetchError(
        'GEOGRAPHY_PARSE_ERROR',
        'Invalid JSON format in geography data',
        url,
        jsonError,
      );
    }
    throw jsonError;
  }
}

/**
 * Parses JSON from ArrayBuffer with proper error handling
 * @param arrayBuffer - The response data as ArrayBuffer
 * @param url - The URL for error context
 * @returns Parsed geography data
 */
async function parseGeographyFromArrayBuffer(
  arrayBuffer: ArrayBuffer,
  url: string,
): Promise<Topology | FeatureCollection> {
  try {
    const text = new TextDecoder().decode(arrayBuffer);
    const data = JSON.parse(text);
    validateGeographyData(data);
    return data as Topology | FeatureCollection;
  } catch (jsonError) {
    if (jsonError instanceof SyntaxError) {
      throw createGeographyFetchError(
        'GEOGRAPHY_PARSE_ERROR',
        'Invalid JSON format in geography data',
        url,
        jsonError,
      );
    }
    throw jsonError;
  }
}

/**
 * Basic fetch function for geography data without caching
 * @param url - The URL to fetch geography data from
 * @returns Promise resolving to geography data or undefined on error
 */
export async function fetchGeographies(
  url: string,
): Promise<Topology | FeatureCollection | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch {
    return undefined;
  }
}

/**
 * Secure, cached geography fetching with comprehensive validation
 * This function is cached using React's cache() for optimal performance
 */
export const fetchGeographiesCache = cache(
  async (url: string): Promise<Topology | FeatureCollection> => {
    // Validate URL before making request
    validateGeographyUrl(url);

    // Check if SRI validation is required
    const sriConfig = getSRIForUrl(url);

    // Create timeout controller
    const { controller, cleanup } = createTimeoutController(
      GEOGRAPHY_FETCH_CONFIG.TIMEOUT_MS,
    );

    try {
      // Make secure fetch request
      const response = await fetch(
        url,
        createSecureFetchOptions(controller.signal),
      );
      cleanup();

      // Validate response
      if (!response.ok) {
        throw createGeographyFetchError(
          'GEOGRAPHY_LOAD_ERROR',
          `HTTP ${response.status}: ${response.statusText}`,
          url,
        );
      }

      // Validate content type and size
      validateContentType(response);
      await validateResponseSize(response);

      // Handle SRI validation and parsing in one step to avoid response body consumption issues
      if (sriConfig) {
        // Read response body once as ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // Validate SRI hash
        await validateSRIFromArrayBuffer(arrayBuffer, url, sriConfig);

        // Parse JSON from ArrayBuffer
        return await parseGeographyFromArrayBuffer(arrayBuffer, url);
      } else {
        // No SRI validation needed, parse normally
        return await parseGeographyResponse(response, url);
      }
    } catch (error) {
      cleanup();
      throw handleFetchError(error, url);
    }
  },
);

/**
 * Preloads geography data for better performance
 * @param url - The URL to preload
 */
export function preloadGeography(url: string): void {
  // Import and use the preload utility with immediate flag
  import('./preloading')
    .then(({ preloadGeography: preloadUtil }) => {
      preloadUtil(url, true); // immediate = true
    })
    .catch(() => {
      // Silently handle import errors
    });

  // Also preload the actual data
  fetchGeographiesCache(url).catch(() => {
    // Silently ignore preload errors
  });
}
