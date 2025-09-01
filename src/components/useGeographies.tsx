import { use, useMemo } from "react"
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

export default function useGeographies({
  geography,
  parseGeographies,
}: UseGeographiesProps): GeographyData {
  const { path } = useMapContext()

  const geographyData = useMemo(() => {
    if (isString(geography)) {
      return use(fetchGeographiesCache(geography))
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
