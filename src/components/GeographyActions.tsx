"use server"

import { cache } from "react"
import { FeatureCollection } from "geojson"
import { Topology } from "topojson-specification"

// Server Action for secure geography data loading
export async function loadGeographyAction(
  _previousState: { data: Topology | FeatureCollection | null; error: string | null },
  formData: FormData
): Promise<{ data: Topology | FeatureCollection | null; error: string | null }> {
  const url = formData.get("url") as string

  if (!url) {
    return {
      data: null,
      error: "URL is required",
    }
  }

  try {
    // Validate URL security on server
    const parsedUrl = new URL(url)

    // Security checks
    if (!["https:", "http:"].includes(parsedUrl.protocol)) {
      return {
        data: null,
        error: "Invalid protocol. Only HTTPS and HTTP are allowed.",
      }
    }

    // Prevent access to private networks in production
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "production" &&
      parsedUrl.hostname === "localhost"
    ) {
      return {
        data: null,
        error: "Localhost access not allowed in production",
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 10000) // 10 seconds timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json, application/geo+json, text/json",
          "Cache-Control": "public, max-age=3600",
        },
        mode: "cors",
        credentials: "omit",
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return {
          data: null,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      // Validate content type
      const contentType = response.headers.get("content-type")
      if (!contentType) {
        return {
          data: null,
          error: "Missing Content-Type header",
        }
      }

      const allowedTypes = ["application/json", "application/geo+json", "text/json"]
      const isValidType = allowedTypes.some((type) => contentType.toLowerCase().includes(type))

      if (!isValidType) {
        return {
          data: null,
          error: `Invalid content type: ${contentType}`,
        }
      }

      // Check response size
      const contentLength = response.headers.get("content-length")
      if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
        // 50MB limit
        return {
          data: null,
          error: "Response too large (>50MB)",
        }
      }

      // Parse JSON with error handling
      const data = await response.json()

      // Basic validation
      if (!data || typeof data !== "object") {
        return {
          data: null,
          error: "Invalid geography data: not a valid object",
        }
      }

      if (!data.type || (data.type !== "Topology" && data.type !== "FeatureCollection")) {
        return {
          data: null,
          error: `Invalid geography data: expected Topology or FeatureCollection, got ${data.type}`,
        }
      }

      return {
        data,
        error: null,
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return {
            data: null,
            error: "Request timeout after 10 seconds",
          }
        }
        if (fetchError.name === "TypeError" && fetchError.message.includes("fetch")) {
          return {
            data: null,
            error: `Network error: Unable to fetch geography from ${url}`,
          }
        }
      }

      return {
        data: null,
        error: fetchError instanceof Error ? fetchError.message : "Unknown fetch error",
      }
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Invalid URL")) {
      return {
        data: null,
        error: `Invalid URL format: ${url}`,
      }
    }

    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Cached server action for better performance
export const loadGeographyCached = cache(loadGeographyAction)

// Server Action for preloading geography data
export async function preloadGeographyAction(url: string): Promise<void> {
  "use server"

  if (!url || typeof url !== "string") {
    return
  }

  try {
    // Trigger the cached load to warm the cache
    const formData = new FormData()
    formData.append("url", url)
    await loadGeographyCached({ data: null, error: null }, formData)
  } catch (error) {
    // Silently fail for preloading in development only
    if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("Failed to preload geography:", error)
    }
  }
}

// Server Action for validating geography URLs
export async function validateGeographyUrlAction(url: string): Promise<{
  valid: boolean
  error?: string
}> {
  "use server"

  if (!url || typeof url !== "string") {
    return { valid: false, error: "URL is required" }
  }

  try {
    const parsedUrl = new URL(url)

    if (!["https:", "http:"].includes(parsedUrl.protocol)) {
      return { valid: false, error: "Invalid protocol. Only HTTPS and HTTP are allowed." }
    }

    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV === "production" &&
      parsedUrl.hostname === "localhost"
    ) {
      return { valid: false, error: "Localhost access not allowed in production" }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid URL format",
    }
  }
}
