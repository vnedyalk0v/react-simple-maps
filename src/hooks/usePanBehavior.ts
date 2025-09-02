import { useEffect, useRef, useCallback } from "react"
import { zoomIdentity as d3ZoomIdentity, ZoomBehavior } from "d3-zoom"
import { select as d3Select } from "d3-selection"
import { GeoProjection } from "d3-geo"
import { ZoomPanState } from "../types"

interface UsePanBehaviorProps {
  mapRef: React.RefObject<SVGGElement | null>
  zoomRef: React.RefObject<ZoomBehavior<SVGGElement, unknown> | undefined>
  width: number
  height: number
  projection: GeoProjection
  center: [number, number]
  zoom: number
  bypassEvents: React.MutableRefObject<boolean>
  onPositionChange?: (position: ZoomPanState) => void
  startTransition: (callback: () => void) => void
}

interface UsePanBehaviorReturn {
  lastPosition: React.MutableRefObject<ZoomPanState>
  programmaticMove: (center: [number, number], zoom: number) => void
}

export function usePanBehavior({
  mapRef,
  zoomRef,
  width,
  height,
  projection,
  center,
  zoom,
  bypassEvents,
  onPositionChange,
  startTransition,
}: UsePanBehaviorProps): UsePanBehaviorReturn {
  const lastPosition = useRef<ZoomPanState>({ x: 0, y: 0, k: 1 })

  const programmaticMove = useCallback(
    (newCenter: [number, number], newZoom: number) => {
      const [lon, lat] = newCenter
      const coords = projection([lon, lat])
      if (!coords || !mapRef.current || !zoomRef.current) return

      const x = coords[0] * newZoom
      const y = coords[1] * newZoom
      const svg = d3Select(mapRef.current)

      bypassEvents.current = true

      // Use transition for smooth programmatic zoom/pan changes
      startTransition(() => {
        if (zoomRef.current) {
          svg.call(
            zoomRef.current.transform,
            d3ZoomIdentity.translate(width / 2 - x, height / 2 - y).scale(newZoom)
          )
        }
        const newPosition = { x: width / 2 - x, y: height / 2 - y, k: newZoom }
        if (onPositionChange) {
          onPositionChange(newPosition)
        }
      })

      lastPosition.current = { x: lon, y: lat, k: newZoom }
    },
    [projection, mapRef, zoomRef, bypassEvents, startTransition, width, height, onPositionChange]
  )

  useEffect(() => {
    const [lon, lat] = center
    if (
      lon === lastPosition.current.x &&
      lat === lastPosition.current.y &&
      zoom === lastPosition.current.k
    )
      return

    programmaticMove(center, zoom)
  }, [center, zoom, width, height, projection, startTransition, programmaticMove])

  return {
    lastPosition,
    programmaticMove,
  }
}

export default usePanBehavior
