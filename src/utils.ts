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
