import { use, useMemo, useEffect } from "react"
import { useMapContext } from "./MapProvider"
import { UseGeographiesProps, GeographyData } from "../types"
import {
  fetchGeographiesCache,
  getFeatures,
  getMesh,
  prepareFeatures,
  isString,
  prepareMesh,
} from "../utils"
import { preloadGeography } from "../utils/preloading"
import { devTools } from "../utils/debugging"

export default function useGeographies({
  geography,
  parseGeographies,
}: UseGeographiesProps): GeographyData {
  const { path } = useMapContext()

  // Preload geography resources using React 19 preloading APIs
  useEffect(() => {
    if (isString(geography)) {
      // Preload the geography resource for better performance
      preloadGeography(geography)
    }
  }, [geography])

  const geographyData = useMemo(() => {
    if (isString(geography)) {
      devTools.debugGeographyLoading(geography, "start")
      try {
        const data = use(fetchGeographiesCache(geography))
        devTools.debugGeographyLoading(geography, "success", data)
        return data
      } catch (error) {
        devTools.debugGeographyLoading(geography, "error", error)
        throw error
      }
    }
    return geography
  }, [geography])

  return useMemo(() => {
    const features = getFeatures(geographyData, parseGeographies)
    const mesh = getMesh(geographyData)
    const preparedMesh = prepareMesh(mesh?.outline || null, mesh?.borders || null, path)

    return {
      geographies: prepareFeatures(features, path),
      outline: preparedMesh.outline || "",
      borders: preparedMesh.borders || "",
    }
  }, [geographyData, parseGeographies, path])
}
