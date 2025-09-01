import { useEffect, useRef, useState } from "react"
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity, ZoomBehavior, D3ZoomEvent } from "d3-zoom"
import { select as d3Select } from "d3-selection"
import { useMapContext } from "./MapProvider"
import { getCoords } from "../utils"
import { ZoomPanState, Position } from "../types"

interface ZoomPanPosition extends ZoomPanState {
  dragging?: Event
}

interface UseZoomPanHookProps {
  center: [number, number]
  filterZoomEvent?: (event: Event) => boolean
  onMoveStart?: (position: Position, event: Event) => void
  onMoveEnd?: (position: Position, event: Event) => void
  onMove?: (position: Position, event: Event) => void
  translateExtent?: [[number, number], [number, number]]
  scaleExtent?: [number, number]
  zoom?: number
}

export default function useZoomPan({
  center,
  filterZoomEvent,
  onMoveStart,
  onMoveEnd,
  onMove,
  translateExtent = [
    [-Infinity, -Infinity],
    [Infinity, Infinity],
  ],
  scaleExtent = [1, 8],
  zoom = 1,
}: UseZoomPanHookProps) {
  const { width, height, projection } = useMapContext()

  const [lon, lat] = center
  const [position, setPosition] = useState<ZoomPanPosition>({ x: 0, y: 0, k: 1 })
  const lastPosition = useRef<ZoomPanState>({ x: 0, y: 0, k: 1 })
  const mapRef = useRef<SVGGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGGElement, unknown> | undefined>(undefined)
  const bypassEvents = useRef(false)

  const [a, b] = translateExtent
  const [a1, a2] = a
  const [b1, b2] = b
  const [minZoom, maxZoom] = scaleExtent

  useEffect(() => {
    if (!mapRef.current) return

    const svg = d3Select(mapRef.current)

    function handleZoomStart(d3Event: D3ZoomEvent<SVGGElement, unknown>) {
      if (!onMoveStart || bypassEvents.current) return
      const coords = getCoords(width, height, d3Event.transform)
      const inverted = projection.invert?.(coords)
      if (inverted) {
        onMoveStart(
          {
            coordinates: inverted as [number, number],
            zoom: d3Event.transform.k,
          },
          d3Event.sourceEvent || d3Event
        )
      }
    }

    function handleZoom(d3Event: D3ZoomEvent<SVGGElement, unknown>) {
      if (bypassEvents.current) return
      const { transform, sourceEvent } = d3Event
      setPosition({
        x: transform.x,
        y: transform.y,
        k: transform.k,
        dragging: sourceEvent,
      })
      if (!onMove) return
      const coords = getCoords(width, height, transform)
      const inverted = projection.invert?.(coords)
      if (inverted) {
        onMove(
          {
            coordinates: inverted as [number, number],
            zoom: transform.k,
          },
          d3Event.sourceEvent || d3Event
        )
      }
    }

    function handleZoomEnd(d3Event: D3ZoomEvent<SVGGElement, unknown>) {
      if (bypassEvents.current) {
        bypassEvents.current = false
        return
      }
      const coords = getCoords(width, height, d3Event.transform)
      const inverted = projection.invert?.(coords)
      if (inverted) {
        const [x, y] = inverted
        lastPosition.current = { x, y, k: d3Event.transform.k }
        if (!onMoveEnd) return
        onMoveEnd(
          { coordinates: [x, y], zoom: d3Event.transform.k },
          d3Event.sourceEvent || d3Event
        )
      }
    }

    function filterFunc(d3Event: D3ZoomEvent<SVGGElement, unknown> | null) {
      if (filterZoomEvent && d3Event) {
        return filterZoomEvent(d3Event.sourceEvent || d3Event)
      }
      return d3Event ? !d3Event.sourceEvent?.ctrlKey && !d3Event.sourceEvent?.button : false
    }

    const zoomBehavior = d3Zoom<SVGGElement, unknown>()
      .filter(filterFunc)
      .scaleExtent([minZoom, maxZoom])
      .translateExtent([
        [a1, a2],
        [b1, b2],
      ])
      .on("start", handleZoomStart)
      .on("zoom", handleZoom)
      .on("end", handleZoomEnd)

    zoomRef.current = zoomBehavior
    svg.call(zoomBehavior)
  }, [
    width,
    height,
    a1,
    a2,
    b1,
    b2,
    minZoom,
    maxZoom,
    projection,
    onMoveStart,
    onMove,
    onMoveEnd,
    filterZoomEvent,
  ])

  useEffect(() => {
    if (
      lon === lastPosition.current.x &&
      lat === lastPosition.current.y &&
      zoom === lastPosition.current.k
    )
      return

    const coords = projection([lon, lat])
    if (!coords || !mapRef.current || !zoomRef.current) return

    const x = coords[0] * zoom
    const y = coords[1] * zoom
    const svg = d3Select(mapRef.current)

    bypassEvents.current = true

    svg.call(
      zoomRef.current.transform,
      d3ZoomIdentity.translate(width / 2 - x, height / 2 - y).scale(zoom)
    )
    setPosition({ x: width / 2 - x, y: height / 2 - y, k: zoom })

    lastPosition.current = { x: lon, y: lat, k: zoom }
  }, [lon, lat, zoom, width, height, projection])

  return {
    mapRef,
    position,
    transformString: `translate(${position.x} ${position.y}) scale(${position.k})`,
  }
}
