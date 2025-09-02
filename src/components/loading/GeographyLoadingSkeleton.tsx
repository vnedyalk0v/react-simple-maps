interface LoadingSkeletonProps {
  className?: string
  width?: number | string
  height?: number | string
}

// Basic loading skeleton for geography data
export function GeographyLoadingSkeleton({
  className = "",
  width = "100%",
  height = "100%",
}: LoadingSkeletonProps) {
  return (
    <g className={`rsm-geography-skeleton ${className}`}>
      <rect
        width={width}
        height={height}
        fill="transparent"
        stroke="#e0e0e0"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      >
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
      </rect>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#999"
        fontSize="14"
        fontFamily="system-ui, sans-serif"
      >
        Loading geography data...
      </text>
    </g>
  )
}

export default GeographyLoadingSkeleton
