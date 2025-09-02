// Re-export the refactored useZoomPan hook from the modular structure
// This file now serves as a backward-compatible entry point
export { useZoomPan, default } from "../hooks/useZoomPan"

// Also export the focused hooks for advanced usage
export { useZoomBehavior, usePanBehavior, useDeferredPosition } from "../hooks"

// Re-export types for backward compatibility
export type { Position } from "../types"
