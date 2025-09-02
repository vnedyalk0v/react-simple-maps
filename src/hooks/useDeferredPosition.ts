import { useState, useDeferredValue, useTransition } from "react"
import { ZoomPanState } from "../types"

interface ZoomPanPosition extends ZoomPanState {
  dragging?: Event | undefined
}

interface UseDeferredPositionProps {
  initialPosition?: ZoomPanPosition
}

interface UseDeferredPositionReturn {
  position: ZoomPanPosition
  smoothPosition: ZoomPanPosition
  setPosition: (position: ZoomPanPosition) => void
  isPending: boolean
  startTransition: (callback: () => void) => void
  transformString: string
}

export function useDeferredPosition({
  initialPosition = { x: 0, y: 0, k: 1 },
}: UseDeferredPositionProps = {}): UseDeferredPositionReturn {
  // React 19 concurrent features
  const [isPending, startTransition] = useTransition()

  const [position, setPosition] = useState<ZoomPanPosition>(initialPosition)

  // Defer expensive position calculations for smooth rendering
  const smoothPosition = useDeferredValue(position)

  const transformString = `translate(${smoothPosition.x} ${smoothPosition.y}) scale(${smoothPosition.k})`

  return {
    position,
    smoothPosition,
    setPosition,
    isPending,
    startTransition,
    transformString,
  }
}

export default useDeferredPosition
