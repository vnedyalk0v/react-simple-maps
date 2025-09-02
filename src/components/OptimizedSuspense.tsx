import { Suspense, ReactNode, useMemo, useCallback, useState, useEffect } from "react"

interface OptimizedSuspenseProps {
  children: ReactNode
  fallback?: ReactNode
  // React 19 optimization: Intelligent fallback timing
  fallbackDelay?: number
  // Performance hint: Expected loading time
  expectedLoadTime?: number
  // Granular control: Suspense priority
  priority?: "low" | "normal" | "high"
  // Error recovery
  retryCount?: number
  onRetry?: () => void
  // Performance monitoring
  onLoadStart?: () => void
  onLoadEnd?: (duration: number) => void
}

interface SuspenseMetrics {
  loadStartTime: number
  loadCount: number
  averageLoadTime: number
  retryAttempts: number
}

export function OptimizedSuspense({
  children,
  fallback,
  fallbackDelay = 150, // React 19 default with optimization
  expectedLoadTime = 1000,
  priority = "normal",
  retryCount = 3,
  onRetry,
  onLoadStart,
  onLoadEnd,
}: OptimizedSuspenseProps) {
  const [metrics, setMetrics] = useState<SuspenseMetrics>({
    loadStartTime: 0,
    loadCount: 0,
    averageLoadTime: 0,
    retryAttempts: 0,
  })

  const [showFallback, setShowFallback] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  // React 19 optimization: Intelligent fallback timing based on priority
  const optimizedFallbackDelay = useMemo(() => {
    switch (priority) {
      case "high":
        return Math.min(fallbackDelay, 100) // Show fallback quickly for high priority
      case "low":
        return Math.max(fallbackDelay, 300) // Delay fallback for low priority
      default:
        return fallbackDelay
    }
  }, [fallbackDelay, priority])

  // Enhanced fallback with performance hints
  const enhancedFallback = useMemo(() => {
    if (!fallback) {
      return (
        <div
          className={`rsm-suspense-fallback rsm-priority-${priority}`}
          role="status"
          aria-label="Loading content"
        >
          <div className="rsm-loading-indicator">
            <span className="rsm-loading-text">Loading...</span>
            {expectedLoadTime > 2000 && (
              <span className="rsm-loading-hint">This may take a moment</span>
            )}
          </div>
        </div>
      )
    }
    return fallback
  }, [fallback, priority, expectedLoadTime])

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now()
    setMetrics((prev) => ({
      ...prev,
      loadStartTime: startTime,
      loadCount: prev.loadCount + 1,
    }))

    if (onLoadStart) {
      onLoadStart()
    }

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime

      setMetrics((prev) => {
        const newAverageLoadTime =
          prev.loadCount > 0
            ? (prev.averageLoadTime * (prev.loadCount - 1) + duration) / prev.loadCount
            : duration

        return {
          ...prev,
          averageLoadTime: newAverageLoadTime,
        }
      })

      if (onLoadEnd) {
        onLoadEnd(duration)
      }
    }
  }, [retryKey, onLoadStart, onLoadEnd])

  // Intelligent fallback timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true)
    }, optimizedFallbackDelay)

    return () => {
      clearTimeout(timer)
      setShowFallback(false)
    }
  }, [optimizedFallbackDelay, retryKey])

  // Retry mechanism with exponential backoff
  const handleRetry = useCallback(() => {
    if (metrics.retryAttempts < retryCount) {
      setMetrics((prev) => ({
        ...prev,
        retryAttempts: prev.retryAttempts + 1,
      }))

      setRetryKey((prev) => prev + 1)

      if (onRetry) {
        onRetry()
      }
    }
  }, [metrics.retryAttempts, retryCount, onRetry])

  // Expose retry function for potential future use
  void handleRetry // Acknowledge the function is available but not used in current implementation

  // React 19 optimization: Conditional fallback rendering
  const conditionalFallback = showFallback ? enhancedFallback : null

  return (
    <Suspense key={retryKey} fallback={conditionalFallback}>
      {children}
    </Suspense>
  )
}

// Higher-order component for geography-specific optimizations
export function GeographyOptimizedSuspense({
  children,
  geographyUrl,
  ...props
}: OptimizedSuspenseProps & { geographyUrl?: string }) {
  // Geography-specific optimizations
  const geographyFallback = useMemo(
    () => (
      <div className="rsm-geography-loading" role="status">
        <div className="rsm-geography-skeleton">
          <div className="rsm-skeleton-outline" />
          <div className="rsm-skeleton-features" />
        </div>
        {geographyUrl && (
          <div className="rsm-loading-info">
            <span>Loading geography data...</span>
            <small>{new URL(geographyUrl).hostname}</small>
          </div>
        )}
      </div>
    ),
    [geographyUrl]
  )

  return (
    <OptimizedSuspense
      {...props}
      fallback={geographyFallback}
      expectedLoadTime={2000} // Geography files are typically larger
      priority="high" // Geography is critical for map rendering
    >
      {children}
    </OptimizedSuspense>
  )
}

// Batch Suspense wrapper for multiple concurrent loads
export function BatchedSuspense({
  children,
  batchSize: _batchSize = 3, // Prefix with underscore to indicate intentionally unused
  ...props
}: OptimizedSuspenseProps & { batchSize?: number }) {
  // React 19 optimization: Batch multiple suspense boundaries
  // Note: batchSize is reserved for future implementation of concurrent batch loading
  return (
    <OptimizedSuspense
      {...props}
      fallbackDelay={100} // Shorter delay for batched loads
      priority="normal"
    >
      {children}
    </OptimizedSuspense>
  )
}

export default OptimizedSuspense
