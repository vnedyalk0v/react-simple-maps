import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GeographyErrorBoundary from '../../src/components/GeographyErrorBoundary'

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div data-testid="success">No error</div>
}

describe('GeographyErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <GeographyErrorBoundary>
        <div data-testid="child">Test content</div>
      </GeographyErrorBoundary>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render default error fallback when error occurs', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <GeographyErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GeographyErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Failed to load geography data')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry loading/i })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should render custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const customFallback = (error: Error, retry: () => void) => (
      <div data-testid="custom-error">
        <p>Custom error: {error.message}</p>
        <button onClick={retry} data-testid="custom-retry">
          Try Again
        </button>
      </div>
    )

    render(
      <GeographyErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </GeographyErrorBoundary>
    )

    expect(screen.getByTestId('custom-error')).toBeInTheDocument()
    expect(screen.getByText('Custom error: Test error message')).toBeInTheDocument()
    expect(screen.getByTestId('custom-retry')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should call onError callback when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = vi.fn()

    render(
      <GeographyErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </GeographyErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(expect.any(Error))
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error message'
      })
    )

    consoleSpy.mockRestore()
  })

  it('should handle retry functionality', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <GeographyErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GeographyErrorBoundary>
    )

    const retryButton = screen.getByRole('button', { name: /retry loading/i })
    expect(retryButton).toBeInTheDocument()

    // Click retry button
    await user.click(retryButton)

    // The error boundary should still be showing since the component still throws
    expect(screen.getByText('Failed to load geography data')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should have proper accessibility attributes', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <GeographyErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GeographyErrorBoundary>
    )

    const errorContainer = screen.getByRole('alert')
    expect(errorContainer).toHaveClass('rsm-error-boundary')

    const retryButton = screen.getByRole('button', { name: /retry loading/i })
    expect(retryButton).toHaveAttribute('aria-label', 'Retry loading geography data')
    expect(retryButton).toHaveAttribute('type', 'button')

    consoleSpy.mockRestore()
  })

  it('should apply correct CSS classes', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <GeographyErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GeographyErrorBoundary>
    )

    expect(screen.getByRole('alert')).toHaveClass('rsm-error-boundary')
    expect(screen.getByText('Failed to load geography data').parentElement).toHaveClass('rsm-error-content')
    expect(screen.getByText('Failed to load geography data')).toHaveClass('rsm-error-title')
    expect(screen.getByText('Test error message')).toHaveClass('rsm-error-message')
    expect(screen.getByRole('button')).toHaveClass('rsm-retry-button')

    consoleSpy.mockRestore()
  })
})
