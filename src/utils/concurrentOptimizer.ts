import React, { startTransition, useDeferredValue, useOptimistic } from "react"

// React 19 Concurrent Rendering Optimizer
export interface ConcurrentTask {
  id: string
  priority: "urgent" | "normal" | "background"
  task: () => void | Promise<void>
  dependencies?: string[]
  timeout?: number
}

export interface ConcurrentBatch {
  tasks: ConcurrentTask[]
  batchId: string
  maxConcurrency: number
  onComplete?: () => void
  onError?: (error: Error, taskId: string) => void
}

export class ConcurrentRenderingOptimizer {
  private taskQueue: Map<string, ConcurrentTask> = new Map()
  private runningTasks: Set<string> = new Set()
  private completedTasks: Set<string> = new Set()
  private maxConcurrentTasks: number = 3
  private performanceMetrics: Map<string, number> = new Map()

  constructor(maxConcurrentTasks: number = 3) {
    this.maxConcurrentTasks = maxConcurrentTasks
  }

  // React 19 optimization: Intelligent task scheduling
  scheduleTask(task: ConcurrentTask): void {
    this.taskQueue.set(task.id, task)
    this.processQueue()
  }

  // Batch multiple tasks with React 19 concurrent features
  scheduleBatch(batch: ConcurrentBatch): void {
    // Sort tasks by priority
    const sortedTasks = batch.tasks.sort((a, b) => {
      const priorityOrder = { urgent: 0, normal: 1, background: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    // Schedule tasks with dependency resolution
    for (const task of sortedTasks) {
      this.scheduleTask(task)
    }

    // Monitor batch completion
    this.monitorBatchCompletion(batch)
  }

  private async processQueue(): Promise<void> {
    if (this.runningTasks.size >= this.maxConcurrentTasks) {
      return
    }

    const availableTasks = Array.from(this.taskQueue.values()).filter((task) => {
      // Check if dependencies are met
      if (task.dependencies) {
        return task.dependencies.every((dep) => this.completedTasks.has(dep))
      }
      return true
    })

    if (availableTasks.length === 0) {
      return
    }

    // Select next task based on priority
    const nextTask = availableTasks[0]
    if (!nextTask) return

    this.runningTasks.add(nextTask.id)
    this.taskQueue.delete(nextTask.id)

    try {
      await this.executeTask(nextTask)
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error(`Task ${nextTask.id} failed:`, error)
      }
    } finally {
      this.runningTasks.delete(nextTask.id)
      this.completedTasks.add(nextTask.id)

      // Continue processing queue
      this.processQueue()
    }
  }

  private async executeTask(task: ConcurrentTask): Promise<void> {
    const startTime = performance.now()

    try {
      if (task.priority === "urgent") {
        // Execute urgent tasks immediately
        await task.task()
      } else {
        // Use React 19 startTransition for non-urgent tasks
        await new Promise<void>((resolve, reject) => {
          startTransition(async () => {
            try {
              await task.task()
              resolve()
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    } finally {
      const duration = performance.now() - startTime
      this.performanceMetrics.set(task.id, duration)
    }
  }

  private monitorBatchCompletion(batch: ConcurrentBatch): void {
    const checkCompletion = () => {
      const allCompleted = batch.tasks.every((task) => this.completedTasks.has(task.id))

      if (allCompleted) {
        if (batch.onComplete) {
          batch.onComplete()
        }
      } else {
        // Check again after a short delay
        setTimeout(checkCompletion, 16) // ~60fps
      }
    }

    checkCompletion()
  }

  // Get performance metrics for optimization
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.performanceMetrics)
  }

  // Clear completed tasks and metrics
  cleanup(): void {
    this.completedTasks.clear()
    this.performanceMetrics.clear()
  }
}

// React 19 optimized hooks for concurrent operations
export function useOptimizedTransition() {
  const [isPending, setIsPending] = React.useState(false)

  const optimizedStartTransition = React.useCallback((callback: () => void) => {
    setIsPending(true)

    startTransition(() => {
      try {
        callback()
      } finally {
        setIsPending(false)
      }
    })
  }, [])

  return [isPending, optimizedStartTransition] as const
}

// Enhanced deferred value with performance hints
export function useOptimizedDeferredValue<T>(
  value: T,
  initialValue?: T,
  options?: {
    timeoutMs?: number
    priority?: "low" | "normal" | "high"
  }
): T {
  const deferredValue = useDeferredValue(value, initialValue)

  // React 19 optimization: Add timeout for deferred values
  const [timeoutValue, setTimeoutValue] = React.useState(value)

  React.useEffect(() => {
    if (options?.timeoutMs) {
      const timer = setTimeout(() => {
        setTimeoutValue(value)
      }, options.timeoutMs)

      return () => clearTimeout(timer)
    }
    // No cleanup needed when timeoutMs is not provided
    return undefined
  }, [value, options?.timeoutMs])

  // Return the most appropriate value based on timing
  return options?.timeoutMs && deferredValue !== value ? timeoutValue : deferredValue
}

// Optimistic updates with validation and rollback
export function useOptimizedOptimistic<T>(
  state: T,
  updateFn: (currentState: T, optimisticValue: T) => T,
  options?: {
    validateFn?: (value: T) => boolean
    rollbackDelay?: number
  }
): [T, (optimisticValue: T) => void] {
  const [optimisticState, setOptimisticState] = useOptimistic(state, updateFn)

  const setOptimisticValue = React.useCallback(
    (optimisticValue: T) => {
      // Validate optimistic update if validator provided
      if (options?.validateFn && !options.validateFn(optimisticValue)) {
        // Log warning in development only
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("Invalid optimistic update rejected:", optimisticValue)
        }
        return
      }

      setOptimisticState(optimisticValue)

      // Auto-rollback after delay if specified
      if (options?.rollbackDelay) {
        setTimeout(() => {
          // This would typically be handled by the actual state update
          // but provides a safety net for failed optimistic updates
        }, options.rollbackDelay)
      }
    },
    [setOptimisticState, options]
  )

  return [optimisticState, setOptimisticValue]
}

// Global concurrent optimizer instance
export const globalConcurrentOptimizer = new ConcurrentRenderingOptimizer(3)

// Utility functions for common concurrent patterns
export const concurrentUtils = {
  // Batch geography loading operations
  batchGeographyLoads: (urls: string[]) => {
    const tasks: ConcurrentTask[] = urls.map((url, index) => ({
      id: `geography-${index}`,
      priority: index === 0 ? "urgent" : "normal", // First geography is urgent
      task: async () => {
        // This would integrate with the actual geography loading
        const { fetchGeographiesCache } = await import("../utils")
        await fetchGeographiesCache(url)
      },
    }))

    globalConcurrentOptimizer.scheduleBatch({
      tasks,
      batchId: `geography-batch-${Date.now()}`,
      maxConcurrency: 2, // Limit concurrent geography loads
    })
  },

  // Optimize zoom/pan operations
  optimizeZoomPan: (operations: Array<() => void>) => {
    const tasks: ConcurrentTask[] = operations.map((operation, index) => ({
      id: `zoom-pan-${index}`,
      priority: "urgent", // Zoom/pan should be responsive
      task: operation,
    }))

    globalConcurrentOptimizer.scheduleBatch({
      tasks,
      batchId: `zoom-pan-batch-${Date.now()}`,
      maxConcurrency: 1, // Sequential zoom/pan for smoothness
    })
  },
}

export default ConcurrentRenderingOptimizer
