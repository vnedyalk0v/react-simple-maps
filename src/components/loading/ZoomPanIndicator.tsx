interface ZoomPanIndicatorProps {
  isPending: boolean
  className?: string
}

// Zoom/Pan loading indicator for smooth transitions
export function ZoomPanIndicator({ isPending, className = "" }: ZoomPanIndicatorProps) {
  if (!isPending) return null

  return (
    <div className={`rsm-zoom-pan-indicator ${className}`} aria-live="polite">
      <div className="rsm-zoom-pan-spinner">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="#007acc"
            strokeWidth="2"
            opacity="0.3"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="#007acc"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="12.566"
            strokeDashoffset="12.566"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="0.8s"
              values="12.566;0"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  )
}

export default ZoomPanIndicator
