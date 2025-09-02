interface MapLoadingOverlayProps {
  isLoading: boolean
  message?: string
  className?: string
}

// Map loading overlay for full-screen loading states
export function MapLoadingOverlay({
  isLoading,
  message = "Loading map data...",
  className = "",
}: MapLoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className={`rsm-map-loading-overlay ${className}`}>
      <div className="rsm-loading-content">
        <div className="rsm-loading-spinner">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#007acc"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="1.5s"
                values="0 31.416;15.708 15.708;0 31.416"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="1.5s"
                values="0;-15.708;-31.416"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
        <p className="rsm-loading-message">{message}</p>
      </div>
    </div>
  )
}

export default MapLoadingOverlay
