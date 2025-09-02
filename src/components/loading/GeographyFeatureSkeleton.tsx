interface GeographyFeatureSkeletonProps {
  count?: number
  className?: string
}

// Skeleton for individual geography features
export function GeographyFeatureSkeleton({
  count = 3,
  className = "",
}: GeographyFeatureSkeletonProps) {
  return (
    <g className={`rsm-feature-skeleton ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <rect
          key={i}
          x={`${10 + i * 30}%`}
          y={`${20 + i * 15}%`}
          width={`${20 + i * 5}%`}
          height={`${15 + i * 3}%`}
          fill="#f0f0f0"
          stroke="#e0e0e0"
          strokeWidth="1"
          rx="2"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur={`${1.2 + i * 0.2}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </g>
  )
}

export default GeographyFeatureSkeleton
