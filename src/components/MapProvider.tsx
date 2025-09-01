import React, { createContext, useMemo, useCallback, useContext, ReactNode } from "react"
import * as d3Geo from "d3-geo"
import { GeoProjection } from "d3-geo"
import { MapContextType, ProjectionConfig } from "../types"

const { geoPath, ...projections } = d3Geo

const MapContext = createContext<MapContextType | undefined>(undefined)

interface MakeProjectionParams {
  projectionConfig?: ProjectionConfig
  projection: string | GeoProjection
  width: number
  height: number
}

const makeProjection = ({
  projectionConfig = {},
  projection = "geoEqualEarth",
  width = 800,
  height = 600,
}: MakeProjectionParams): GeoProjection => {
  const isFunc = typeof projection === "function"

  if (isFunc) return projection as GeoProjection

  const projectionName = projection as keyof typeof projections
  if (!(projectionName in projections)) {
    throw new Error(`Unknown projection: ${projection}`)
  }

  let proj = (projections[projectionName] as () => GeoProjection)().translate([
    width / 2,
    height / 2,
  ])

  // Apply projection configuration
  if (projectionConfig.center && proj.center) {
    proj = proj.center(projectionConfig.center)
  }
  if (projectionConfig.rotate && proj.rotate) {
    proj = proj.rotate(projectionConfig.rotate)
  }
  if (projectionConfig.scale && proj.scale) {
    proj = proj.scale(projectionConfig.scale)
  }

  return proj
}

interface MapProviderProps {
  width: number
  height: number
  projection?: string | GeoProjection
  projectionConfig?: ProjectionConfig
  children: ReactNode
}

const MapProvider: React.FC<MapProviderProps> = ({
  width,
  height,
  projection,
  projectionConfig = {},
  children,
}) => {
  const [cx, cy] = projectionConfig.center || [undefined, undefined]
  const [rx, ry, rz] = projectionConfig.rotate || [undefined, undefined, undefined]
  const [p1, p2] = projectionConfig.parallels || [undefined, undefined]
  const s = projectionConfig.scale

  const projMemo = useMemo(() => {
    const config: ProjectionConfig = {}

    if (cx !== undefined && cy !== undefined) {
      config.center = [cx, cy]
    }
    if (rx !== undefined || ry !== undefined) {
      config.rotate = [rx || 0, ry || 0, rz || 0]
    }
    if (p1 !== undefined || p2 !== undefined) {
      config.parallels = [p1 || 0, p2 || 0]
    }
    if (s !== undefined) {
      config.scale = s
    }

    return makeProjection({
      projectionConfig: config,
      projection: projection || "geoEqualEarth",
      width,
      height,
    })
  }, [width, height, projection, cx, cy, rx, ry, rz, p1, p2, s])

  const proj = useCallback(() => projMemo, [projMemo])

  const value = useMemo((): MapContextType => {
    return {
      width,
      height,
      projection: proj(),
      path: geoPath().projection(proj()),
    }
  }, [width, height, proj])

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

const useMapContext = (): MapContextType => {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider")
  }
  return context
}

export { MapProvider, MapContext, useMapContext }
