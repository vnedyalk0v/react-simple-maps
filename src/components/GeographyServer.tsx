// Re-export all geography components from the modular structure
// This file now serves as a backward-compatible entry point
export { GeographyServer } from "./geography/GeographyServer"
export { GeographyClient } from "./geography/GeographyClient"
export { GeographyProcessor } from "./geography/GeographyServer"

// Export types for backward compatibility
export type { GeographyServerProps, ParseGeographiesFunction } from "./geography/GeographyServer"
export type { GeographyClientProps } from "./geography/GeographyClient"

// Re-export loading skeleton from the loading components
export { GeographyLoadingSkeleton } from "./loading"

// Default export for backward compatibility
export { default } from "./geography/GeographyClient"
