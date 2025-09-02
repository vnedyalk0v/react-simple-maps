interface LoadingProgressBarProps {
  progress: number
  className?: string
  showPercentage?: boolean
}

// Progress bar for data loading
export function LoadingProgressBar({
  progress = 0,
  className = "",
  showPercentage = true,
}: LoadingProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div
      className={`rsm-loading-progress ${className}`}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="rsm-progress-bar" style={{ width: `${clampedProgress}%` }} />
      {showPercentage && <span className="rsm-progress-text">{Math.round(clampedProgress)}%</span>}
    </div>
  )
}

export default LoadingProgressBar
