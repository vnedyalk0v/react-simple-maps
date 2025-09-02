import { cache, ReactNode } from "react"
import { Feature, FeatureCollection, Geometry } from "geojson"
import { Topology } from "topojson-specification"
import { GeographyData } from "../../types"
import { getFeatures, getMesh, prepareFeatures, prepareMesh } from "../../utils"
import { useMapContext } from "../MapProvider"

type ParseGeographiesFunction = (geographies: Feature<Geometry>[]) => Feature<Geometry>[]

// Cache geography fetching for Server Components
const preloadGeography = cache(async (geography: string): Promise<Topology | FeatureCollection> => {
  const response = await fetch(geography)
  if (!response.ok) {
    throw new Error(`Failed to fetch geography: ${response.statusText}`)
  }
  return response.json()
})

interface GeographyServerProps {
  geography: string
  children: (data: GeographyData) => ReactNode
  parseGeographies?: ParseGeographiesFunction
}

interface GeographyProcessorProps {
  geographyData: Topology | FeatureCollection
  parseGeographies?: ParseGeographiesFunction
  children: (data: GeographyData) => ReactNode
}

// Internal component that processes geography data with map context
function GeographyProcessor({
  geographyData,
  parseGeographies,
  children,
}: GeographyProcessorProps) {
  const { path } = useMapContext()

  const features = getFeatures(geographyData, parseGeographies)
  const mesh = getMesh(geographyData)
  const preparedMesh = prepareMesh(mesh?.outline || null, mesh?.borders || null, path)

  const processedData: GeographyData = {
    geographies: prepareFeatures(features, path),
    outline: preparedMesh.outline || "",
    borders: preparedMesh.borders || "",
  }

  return children(processedData)
}

// Server Component for pre-loading geography data
export async function GeographyServer({
  geography,
  children,
  parseGeographies,
}: GeographyServerProps) {
  const geographyData = await preloadGeography(geography)

  // Return the raw geography data to be processed by the client component
  return (
    <GeographyProcessor
      geographyData={geographyData}
      {...(parseGeographies && { parseGeographies })}
    >
      {children}
    </GeographyProcessor>
  )
}

// Export the processor for use by client components
export { GeographyProcessor }

// Export types for external use
export type { GeographyServerProps, ParseGeographiesFunction }

export default GeographyServer
