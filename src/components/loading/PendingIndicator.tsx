import { ReactNode } from "react"

interface PendingIndicatorProps {
  isPending: boolean
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

// Pending indicator wrapper that shows loading state during transitions
export function PendingIndicator({
  isPending,
  children,
  fallback,
  className = "",
}: PendingIndicatorProps) {
  if (isPending && fallback) {
    return (
      <div className={`rsm-pending-indicator ${className}`} aria-live="polite" aria-busy="true">
        {fallback}
      </div>
    )
  }

  if (isPending) {
    return (
      <div className={`rsm-pending-indicator ${className}`} aria-live="polite" aria-busy="true">
        <div className="rsm-pending-spinner">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="#007acc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="15.708"
              strokeDashoffset="15.708"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="1s"
                values="0 31.416;15.708 15.708;0 31.416"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="1s"
                values="0;-15.708;-31.416"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default PendingIndicator
