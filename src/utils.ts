import { cache } from "react"
import { feature, mesh } from "topojson-client"
import { Feature, FeatureCollection, Geometry, MultiLineString, LineString } from "geojson"
import { Topology, GeometryObject } from "topojson-specification"
import { GeoPath } from "d3-geo"
import { ZoomTransform } from "d3-zoom"
import { PreparedFeature } from "./types"

type MeshGeometry = MultiLineString | LineString

export function getCoords(w: number, h: number, t: ZoomTransform): [number, number] {
  const xOffset = (w * t.k - w) / 2
  const yOffset = (h * t.k - h) / 2
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k]
}

export function fetchGeographies(url: string): Promise<Topology | FeatureCollection | undefined> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText)
      }
      return res.json()
    })
    .catch(() => {
      return undefined
    })
}

// Security configuration for geography fetching
const GEOGRAPHY_FETCH_CONFIG = {
  TIMEOUT_MS: 10000, // 10 seconds
  MAX_RESPONSE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_CONTENT_TYPES: ["application/json", "application/geo+json", "text/json"],
  ALLOWED_PROTOCOLS: ["https:", "http:"], // Allow http for development
} as const

// Validate URL security
function validateGeographyUrl(url: string): void {
  try {
    const parsedUrl = new URL(url)

    if (
      !GEOGRAPHY_FETCH_CONFIG.ALLOWED_PROTOCOLS.includes(parsedUrl.protocol as "https:" | "http:")
    ) {
      throw new Error(`Invalid protocol: ${parsedUrl.protocol}. Only HTTPS and HTTP are allowed.`)
    }

    // Prevent local file access and private networks in production
    if (typeof window !== "undefined" && parsedUrl.hostname === "localhost") {
      if (process.env.NODE_ENV !== "production") {
        // Development warning for localhost usage
        // eslint-disable-next-line no-console
        console.warn("Loading from localhost - ensure this is intended for development")
      }
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Invalid URL format: ${url}`)
    }
    throw error
  }
}

// Validate response content type
function validateContentType(response: Response): void {
  const contentType = response.headers.get("content-type")
  if (!contentType) {
    throw new Error("Missing Content-Type header")
  }

  const isValidType = GEOGRAPHY_FETCH_CONFIG.ALLOWED_CONTENT_TYPES.some((type) =>
    contentType.toLowerCase().includes(type)
  )

  if (!isValidType) {
    throw new Error(
      `Invalid content type: ${contentType}. Expected one of: ${GEOGRAPHY_FETCH_CONFIG.ALLOWED_CONTENT_TYPES.join(", ")}`
    )
  }
}

// Check response size
async function validateResponseSize(response: Response): Promise<void> {
  const contentLength = response.headers.get("content-length")
  if (contentLength) {
    const size = parseInt(contentLength, 10)
    if (size > GEOGRAPHY_FETCH_CONFIG.MAX_RESPONSE_SIZE) {
      throw new Error(
        `Response too large: ${size} bytes. Maximum allowed: ${GEOGRAPHY_FETCH_CONFIG.MAX_RESPONSE_SIZE} bytes`
      )
    }
  }
}

// Modern cached version for use with use() hook
export const fetchGeographiesCache = cache(
  async (url: string): Promise<Topology | FeatureCollection> => {
    // Validate URL before making request
    validateGeographyUrl(url)

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, GEOGRAPHY_FETCH_CONFIG.TIMEOUT_MS)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: GEOGRAPHY_FETCH_CONFIG.ALLOWED_CONTENT_TYPES.join(", "),
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
        // Security headers
        mode: "cors",
        credentials: "omit", // Don't send credentials
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Validate content type and size
      validateContentType(response)
      await validateResponseSize(response)

      // Parse JSON with error handling
      try {
        const data = await response.json()

        // Basic validation that it's a valid geography object
        if (!data || typeof data !== "object") {
          throw new Error("Invalid geography data: not a valid object")
        }

        if (!data.type || (data.type !== "Topology" && data.type !== "FeatureCollection")) {
          throw new Error(
            `Invalid geography data: expected Topology or FeatureCollection, got ${data.type}`
          )
        }

        return data
      } catch (jsonError) {
        if (jsonError instanceof SyntaxError) {
          throw new Error("Invalid JSON format in geography data")
        }
        throw jsonError
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${GEOGRAPHY_FETCH_CONFIG.TIMEOUT_MS}ms`)
        }
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          throw new Error(`Network error: Unable to fetch geography from ${url}`)
        }
      }

      throw error
    }
  }
)

export function getFeatures(
  geographies: Topology | FeatureCollection | Feature<Geometry>[],
  parseGeographies?: (geographies: Feature<Geometry>[]) => Feature<Geometry>[]
): Feature<Geometry>[] {
  const isTopojson = (geographies as Topology).type === "Topology"

  if (!isTopojson) {
    const geoCollection = geographies as FeatureCollection | Feature<Geometry>[]
    const features = Array.isArray(geoCollection)
      ? geoCollection
      : (geoCollection as FeatureCollection).features || []

    return parseGeographies ? parseGeographies(features) : features
  }

  const topology = geographies as Topology
  const objectKeys = Object.keys(topology.objects)
  if (objectKeys.length === 0) {
    return []
  }

  const firstObjectKey = objectKeys[0] as string
  const geometryObject = topology.objects[firstObjectKey]
  if (!geometryObject) {
    return []
  }

  const featureCollection = feature(topology, geometryObject)
  const feats = Array.isArray(featureCollection)
    ? featureCollection
    : (featureCollection as FeatureCollection).features || [featureCollection]
  return parseGeographies ? parseGeographies(feats) : feats
}

export function getMesh(geographies: Topology | FeatureCollection | Feature<Geometry>[]) {
  const isTopojson = (geographies as Topology).type === "Topology"
  if (!isTopojson) return null

  const topology = geographies as Topology
  const objectKeys = Object.keys(topology.objects)
  if (objectKeys.length === 0) {
    return null
  }

  const firstObjectKey = objectKeys[0] as string
  const geometryObject = topology.objects[firstObjectKey]
  if (!geometryObject) {
    return null
  }

  const outline = mesh(topology, geometryObject as GeometryObject, (a, b) => a === b)
  const borders = mesh(topology, geometryObject as GeometryObject, (a, b) => a !== b)

  return { outline: outline || null, borders: borders || null }
}

export function prepareMesh(
  outline: MeshGeometry | null,
  borders: MeshGeometry | null,
  path: GeoPath
): { outline?: string; borders?: string } {
  return outline && borders
    ? {
        outline: path(outline) || "",
        borders: path(borders) || "",
      }
    : {}
}

export function prepareFeatures(
  geographies: Feature<Geometry>[] | undefined,
  path: GeoPath
): PreparedFeature[] {
  return geographies
    ? geographies.map((d, i) => ({
        ...d,
        rsmKey: `geo-${i}`,
        svgPath: path(d) || "",
      }))
    : []
}

export function createConnectorPath(
  dx: number = 30,
  dy: number = 30,
  curve: number | [number, number] = 0.5
): string {
  const curvature = Array.isArray(curve) ? curve : [curve, curve]
  const curveX = (dx / 2) * (curvature[0] ?? 0.5)
  const curveY = (dy / 2) * (curvature[1] ?? 0.5)
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`
}

export function isString(
  geo: string | Topology | FeatureCollection | Feature<Geometry>[]
): geo is string {
  return typeof geo === "string"
}
