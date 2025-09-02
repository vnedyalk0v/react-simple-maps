import { forwardRef, Suspense, ReactNode } from "react"
import { GeographiesProps } from "../types"
import { useMapContext } from "./MapProvider"
import useGeographies from "./useGeographies"
import GeographyErrorBoundary from "./GeographyErrorBoundary"

const Geographies = forwardRef<SVGGElement, GeographiesProps>(
  (
    {
      geography,
      children,
      parseGeographies,
      className = "",
      errorBoundary = false,
      onGeographyError,
      fallback,
      ...restProps
    },
    ref
  ) => {
    const { path, projection } = useMapContext()

    const GeographiesContent = () => {
      const { geographies, outline, borders } = useGeographies({
        geography,
        ...(parseGeographies && { parseGeographies }),
      })

      return (
        <g ref={ref} className={`rsm-geographies ${className}`} {...restProps}>
          {geographies &&
            geographies.length > 0 &&
            children({ geographies, outline, borders, path, projection })}
        </g>
      )
    }

    // Build a consistent fallback element so consumers always get a stable container
    const fallbackElement = (
      <g ref={ref} className={`rsm-geographies ${className} rsm-loading`} {...restProps} />
    )

    if (errorBoundary) {
      const errorBoundaryProps: {
        onError?: (error: Error) => void
        fallback?: (error: Error, retry: () => void) => ReactNode
      } = {}

      if (onGeographyError) {
        errorBoundaryProps.onError = onGeographyError
      }

      if (fallback) {
        errorBoundaryProps.fallback = fallback
      }

      return (
        <GeographyErrorBoundary {...errorBoundaryProps}>
          <Suspense fallback={fallbackElement}>
            <GeographiesContent />
          </Suspense>
        </GeographyErrorBoundary>
      )
    }

    return (
      <Suspense fallback={fallbackElement}>
        <GeographiesContent />
      </Suspense>
    )
  }
)

Geographies.displayName = "Geographies"

export default Geographies
