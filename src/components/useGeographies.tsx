import { useMemo, useState, useEffect } from "react"
import { Feature, Geometry } from "geojson"
import { useMapContext } from "./MapProvider"
import { UseGeographiesProps, GeographyData } from "../types"

import {
  fetchGeographies,
  getFeatures,
  getMesh,
  prepareFeatures,
  isString,
  prepareMesh,
} from "../utils"

interface GeographyOutput {
  geographies?: Feature<Geometry>[]
  mesh?: {
    outline: any
    borders: any
  } | null
}

export default function useGeographies({
  geography,
  parseGeographies,
}: UseGeographiesProps): GeographyData {
  const { path } = useMapContext()
  const [output, setOutput] = useState<GeographyOutput>({})

  useEffect(() => {
    if (typeof window === `undefined`) return

    if (!geography) return

    if (isString(geography)) {
      fetchGeographies(geography).then((geos) => {
        if (geos) {
          setOutput({
            geographies: getFeatures(geos, parseGeographies),
            mesh: getMesh(geos),
          })
        }
      })
    } else {
      setOutput({
        geographies: getFeatures(geography, parseGeographies),
        mesh: getMesh(geography),
      })
    }
  }, [geography, parseGeographies])

  const { geographies, outline, borders } = useMemo(() => {
    const mesh = output.mesh || { outline: null, borders: null }
    const preparedMesh = prepareMesh(mesh.outline, mesh.borders, path)
    return {
      geographies: prepareFeatures(output.geographies, path),
      outline: preparedMesh.outline,
      borders: preparedMesh.borders,
    }
  }, [output, path])

  return { geographies, outline, borders }
}
