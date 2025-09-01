import { Component, ReactNode, ErrorInfo } from "react"

interface GeographyErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error) => void
}

interface GeographyErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

function DefaultErrorFallback(error: Error, retry: () => void) {
  return (
    <div className="rsm-error-boundary" role="alert">
      <div className="rsm-error-content">
        <h3 className="rsm-error-title">Failed to load geography data</h3>
        <p className="rsm-error-message">{error.message}</p>
        <button
          onClick={retry}
          className="rsm-retry-button"
          type="button"
          aria-label="Retry loading geography data"
        >
          Retry Loading
        </button>
      </div>
    </div>
  )
}

export class GeographyErrorBoundary extends Component<
  GeographyErrorBoundaryProps,
  GeographyErrorBoundaryState
> {
  constructor(props: GeographyErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): GeographyErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error)
    }
    // eslint-disable-next-line no-console
    console.error("GeographyErrorBoundary caught an error:", error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: null })
  }

  override render() {
    if (this.state.hasError && this.state.error) {
      const fallbackFn: (error: Error, retry: () => void) => ReactNode =
        this.props.fallback || DefaultErrorFallback
      return fallbackFn(this.state.error, this.retry)
    }

    return this.props.children
  }
}

export default GeographyErrorBoundary
