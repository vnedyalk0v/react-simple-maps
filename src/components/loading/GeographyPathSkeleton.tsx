interface LoadingSkeletonProps {
  className?: string
  pathCount?: number
}

// Enhanced loading skeleton with animated paths
export function GeographyPathSkeleton({ className = "", pathCount = 5 }: LoadingSkeletonProps) {
  const paths = Array.from({ length: pathCount }, (_, i) => (
    <path
      key={i}
      d={`M${10 + i * 20},${30 + i * 15} Q${50 + i * 10},${20 + i * 5} ${80 + i * 15},${40 + i * 10} T${120 + i * 20},${35 + i * 8}`}
      fill="none"
      stroke="#e0e0e0"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.4"
    >
      <animate
        attributeName="stroke-dasharray"
        values="0 100;50 50;100 0"
        dur={`${2 + i * 0.3}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.2;0.6;0.2"
        dur={`${1.5 + i * 0.2}s`}
        repeatCount="indefinite"
      />
    </path>
  ))

  return <g className={`rsm-path-skeleton ${className}`}>{paths}</g>
}

export default GeographyPathSkeleton
