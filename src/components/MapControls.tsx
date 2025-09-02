import { useActionState, useOptimistic, ReactNode } from "react"
import { Position, Coordinates, Longitude, Latitude } from "../types"

// Action types for map controls (currently unused but kept for future extensibility)
// type MapControlAction =
//   | { type: "RESET_VIEW" }
//   | { type: "SET_ZOOM"; zoom: number }
//   | { type: "SET_CENTER"; center: Coordinates }
//   | { type: "SELECT_GEOGRAPHY"; geography: string }

interface MapControlState {
  position: Position
  selectedGeography: string | null
  isLoading: boolean
  error: string | null
}

interface MapControlsProps {
  initialPosition?: Position
  onPositionChange?: (position: Position) => void
  onGeographySelect?: (geography: string | null) => void
  children?: (props: {
    position: Position
    selectedGeography: string | null
    isLoading: boolean
    resetView: () => void
    setZoom: (zoom: number) => void
    setCenter: (center: Coordinates) => void
    selectGeography: (geography: string | null) => void
  }) => ReactNode
}

// Server Action for map control updates
async function updateMapControlAction(
  previousState: MapControlState,
  formData: FormData
): Promise<MapControlState> {
  const action = formData.get("action") as string

  try {
    switch (action) {
      case "RESET_VIEW":
        return {
          ...previousState,
          position: { coordinates: [0 as Longitude, 0 as Latitude], zoom: 1 },
          selectedGeography: null,
          isLoading: false,
          error: null,
        }

      case "SET_ZOOM": {
        const zoom = parseFloat(formData.get("zoom") as string)
        if (isNaN(zoom) || zoom < 0.1 || zoom > 20) {
          return {
            ...previousState,
            error: "Invalid zoom level. Must be between 0.1 and 20.",
          }
        }
        return {
          ...previousState,
          position: { ...previousState.position, zoom },
          error: null,
        }
      }

      case "SET_CENTER": {
        const lng = parseFloat(formData.get("lng") as string)
        const lat = parseFloat(formData.get("lat") as string)
        if (isNaN(lng) || isNaN(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
          return {
            ...previousState,
            error: "Invalid coordinates. Longitude: -180 to 180, Latitude: -90 to 90.",
          }
        }
        return {
          ...previousState,
          position: {
            ...previousState.position,
            coordinates: [lng as Longitude, lat as Latitude],
          },
          error: null,
        }
      }

      case "SELECT_GEOGRAPHY": {
        const geography = formData.get("geography") as string
        return {
          ...previousState,
          selectedGeography: geography || null,
          error: null,
        }
      }

      default:
        return {
          ...previousState,
          error: "Unknown action",
        }
    }
  } catch (error) {
    return {
      ...previousState,
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

export function MapControls({
  initialPosition = { coordinates: [0 as Longitude, 0 as Latitude], zoom: 1 },
  onPositionChange,
  onGeographySelect,
  children,
}: MapControlsProps) {
  const initialState: MapControlState = {
    position: initialPosition,
    selectedGeography: null,
    isLoading: false,
    error: null,
  }

  const [state, submitAction, isPending] = useActionState(updateMapControlAction, initialState)

  // Optimistic updates for immediate UI feedback
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticUpdate: Partial<MapControlState>) => ({
      ...currentState,
      ...optimisticUpdate,
    })
  )

  // Action creators that use the Actions API
  const resetView = () => {
    setOptimisticState({
      position: { coordinates: [0 as Longitude, 0 as Latitude], zoom: 1 },
      selectedGeography: null,
    })

    const formData = new FormData()
    formData.append("action", "RESET_VIEW")
    submitAction(formData)

    if (onPositionChange) {
      onPositionChange({ coordinates: [0 as Longitude, 0 as Latitude], zoom: 1 })
    }
    if (onGeographySelect) {
      onGeographySelect(null)
    }
  }

  const setZoom = (zoom: number) => {
    const newPosition = { ...optimisticState.position, zoom }
    setOptimisticState({ position: newPosition })

    const formData = new FormData()
    formData.append("action", "SET_ZOOM")
    formData.append("zoom", zoom.toString())
    submitAction(formData)

    if (onPositionChange) {
      onPositionChange(newPosition)
    }
  }

  const setCenter = (center: Coordinates) => {
    const newPosition = { ...optimisticState.position, coordinates: center }
    setOptimisticState({ position: newPosition })

    const formData = new FormData()
    formData.append("action", "SET_CENTER")
    formData.append("lng", center[0].toString())
    formData.append("lat", center[1].toString())
    submitAction(formData)

    if (onPositionChange) {
      onPositionChange(newPosition)
    }
  }

  const selectGeography = (geography: string | null) => {
    setOptimisticState({ selectedGeography: geography })

    const formData = new FormData()
    formData.append("action", "SELECT_GEOGRAPHY")
    if (geography) {
      formData.append("geography", geography)
    }
    submitAction(formData)

    if (onGeographySelect) {
      onGeographySelect(geography)
    }
  }

  if (children) {
    return (
      <>
        {children({
          position: optimisticState.position,
          selectedGeography: optimisticState.selectedGeography,
          isLoading: isPending,
          resetView,
          setZoom,
          setCenter,
          selectGeography,
        })}
      </>
    )
  }

  return null
}

export default MapControls
