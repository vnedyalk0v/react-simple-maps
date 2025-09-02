// Barrel exports for geography components
export {
  GeographyServer,
  GeographyProcessor,
  default as GeographyServerDefault,
} from "./GeographyServer"
export { GeographyClient, default as GeographyClientDefault } from "./GeographyClient"

// Export types
export type { GeographyServerProps, ParseGeographiesFunction } from "./GeographyServer"
export type { GeographyClientProps } from "./GeographyClient"

// Re-export all components for convenience
export * from "./GeographyServer"
export * from "./GeographyClient"

// Default export for backward compatibility (prefer GeographyClient for most use cases)
export { default } from "./GeographyClient"
