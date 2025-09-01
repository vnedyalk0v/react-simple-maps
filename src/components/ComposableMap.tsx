import { forwardRef } from "react"
import { ComposableMapProps } from "../types"
import { MapProvider } from "./MapProvider"

const ComposableMap = forwardRef<SVGSVGElement, ComposableMapProps>(
  (
    {
      width = 800,
      height = 600,
      projection = "geoEqualEarth",
      projectionConfig = {},
      className = "",
      children,
      ...restProps
    },
    ref
  ) => {
    return (
      <MapProvider
        width={width}
        height={height}
        projection={projection}
        projectionConfig={projectionConfig}
      >
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          className={`rsm-svg ${className}`}
          {...restProps}
        >
          {children}
        </svg>
      </MapProvider>
    )
  }
)

ComposableMap.displayName = "ComposableMap"

export default ComposableMap
