import { useRef, useDeferredValue } from "react"
import { useMapContext } from "../components/MapProvider"
import { Position } from "../types"
import { useZoomBehavior } from "./useZoomBehavior"
import { usePanBehavior } from "./usePanBehavior"
import { useDeferredPosition } from "./useDeferredPosition"

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

interface UseZoomPanReturn {
  mapRef: React.RefObject<SVGGElement | null>
  position: { x: number; y: number; k: number; dragging?: Event | undefined }
  transformString: string
  isPending: boolean
}

export function useZoomPan({
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
}: UseZoomPanHookProps): UseZoomPanReturn {
  const { width, height, projection } = useMapContext()

  // Defer expensive calculations for smooth rendering with initialValue for better UX
  const deferredCenter = useDeferredValue(center, [0, 0] as [number, number])
  const deferredZoom = useDeferredValue(zoom, 1)

  const mapRef = useRef<SVGGElement>(null)
  const bypassEvents = useRef(false)

  // Use the focused hooks with optimistic updates
  const {
    smoothPosition,
    setPosition,
    setOptimisticPosition,
    isPending,
    startTransition,
    transformString,
  } = useDeferredPosition()

  const zoomBehaviorProps = {
    mapRef,
    width,
    height,
    projection,
    scaleExtent,
    translateExtent,
    onZoomStart: onMoveStart,
    onZoomEnd: onMoveEnd,
    onMove,
    bypassEvents,
    onZoom: (transform: { x: number; y: number; k: number }, sourceEvent?: Event) => {
      const newPosition = {
        x: transform.x,
        y: transform.y,
        k: transform.k,
        dragging: sourceEvent,
      }

      // Immediate optimistic update for responsive feel
      setOptimisticPosition(newPosition)

      // Use transition for non-blocking position updates
      startTransition(() => {
        setPosition(newPosition)
      })
    },
    ...(filterZoomEvent && { filterZoomEvent }),
  }

  const { zoomRef } = useZoomBehavior(zoomBehaviorProps)

  usePanBehavior({
    mapRef,
    zoomRef,
    width,
    height,
    projection,
    center: deferredCenter,
    zoom: deferredZoom,
    bypassEvents,
    onPositionChange: (newPosition) => {
      setPosition(newPosition)
    },
    startTransition,
  })

  return {
    mapRef,
    position: smoothPosition,
    transformString,
    isPending,
  }
}

export default useZoomPan
