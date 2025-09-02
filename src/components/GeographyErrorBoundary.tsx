import { ReactNode, useCallback, useState, Component, ErrorInfo } from "react"

interface GeographyErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error) => void
}

interface ErrorBoundaryState {
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

// Minimal class component for error boundary - React 19 still requires class components for error boundaries
// This is the smallest possible implementation to satisfy error boundary requirements
class MinimalErrorBoundary extends Component<
  {
    children: ReactNode
    fallback: (error: Error) => ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
  },
  ErrorBoundaryState
> {
  constructor(props: {
    children: ReactNode
    fallback: (error: Error) => ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
  }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // React 19 compliance: Use improved error reporting
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  override render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error)
    }

    return this.props.children
  }
}

// React 19-compliant function component wrapper with minimal class component usage
export function GeographyErrorBoundary({
  children,
  fallback = DefaultErrorFallback,
  onError,
}: GeographyErrorBoundaryProps) {
  const [errorBoundaryKey, setErrorBoundaryKey] = useState(0)

  const handleError = useCallback(
    (error: Error, errorInfo: ErrorInfo) => {
      if (onError) {
        onError(error)
      }
      // React 19 compliance: Enhanced error logging for development
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("GeographyErrorBoundary caught an error:", error, errorInfo)
      }
    },
    [onError]
  )

  const retry = useCallback(() => {
    // Reset the error boundary by changing the key - React 19 compatible pattern
    setErrorBoundaryKey((prev) => prev + 1)
  }, [])

  const errorFallback = useCallback((error: Error) => fallback(error, retry), [fallback, retry])

  return (
    <MinimalErrorBoundary key={errorBoundaryKey} fallback={errorFallback} onError={handleError}>
      {children}
    </MinimalErrorBoundary>
  )
}

export default GeographyErrorBoundary
