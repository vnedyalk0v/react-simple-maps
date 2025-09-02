import React, { captureOwnerStack } from 'react';

// React 19 debugging utilities

interface DebugInfo {
  componentName: string;
  ownerStack?: string | null;
  timestamp: number;
  props?: Record<string, unknown> | undefined;
  state?: Record<string, unknown> | undefined;
  error?: Error;
}

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  updateCount: number;
}

/**
 * Debug logger for React Simple Maps components
 */
export class MapDebugger {
  private static instance: MapDebugger;
  private debugLogs: DebugInfo[] = [];
  private performanceMetrics: Map<string, PerformanceMetrics> = new Map();
  private isEnabled: boolean =
    typeof process !== 'undefined'
      ? process.env.NODE_ENV !== 'production'
      : true;

  static getInstance(): MapDebugger {
    if (!MapDebugger.instance) {
      MapDebugger.instance = new MapDebugger();
    }
    return MapDebugger.instance;
  }

  /**
   * Log component render with owner stack information
   */
  logRender(
    componentName: string,
    props?: Record<string, unknown>,
    state?: Record<string, unknown>,
  ): void {
    if (!this.isEnabled) return;

    const ownerStack = captureOwnerStack();

    const debugInfo: DebugInfo = {
      componentName,
      ownerStack,
      timestamp: Date.now(),
      ...(props && { props: this.sanitizeProps(props) }),
      ...(state && { state: this.sanitizeState(state) }),
    };

    this.debugLogs.push(debugInfo);

    // Keep only last 100 logs to prevent memory leaks
    if (this.debugLogs.length > 100) {
      this.debugLogs.shift();
    }

    if (this.isEnabled) {
      // eslint-disable-next-line no-console
      console.group(`🗺️ ${componentName} Render`);
      // eslint-disable-next-line no-console
      console.log('Owner Stack:', ownerStack);
      // eslint-disable-next-line no-console
      if (props) console.log('Props:', props);
      // eslint-disable-next-line no-console
      if (state) console.log('State:', state);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }

  /**
   * Log component errors with debugging context
   */
  logError(
    componentName: string,
    error: Error,
    props?: Record<string, unknown>,
  ): void {
    if (!this.isEnabled) return;

    const ownerStack = captureOwnerStack();

    const debugInfo: DebugInfo = {
      componentName,
      ownerStack,
      timestamp: Date.now(),
      ...(props && { props: this.sanitizeProps(props) }),
      error,
    };

    this.debugLogs.push(debugInfo);

    if (this.isEnabled) {
      // eslint-disable-next-line no-console
      console.group(`❌ ${componentName} Error`);
      // eslint-disable-next-line no-console
      console.error('Error:', error);
      // eslint-disable-next-line no-console
      console.log('Owner Stack:', ownerStack);
      // eslint-disable-next-line no-console
      if (props) console.log('Props:', props);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }

  /**
   * Track performance metrics for components
   */
  trackPerformance(componentName: string, renderTime: number): void {
    if (!this.isEnabled) return;

    const existing = this.performanceMetrics.get(componentName) || {
      renderTime: 0,
      componentCount: 0,
      updateCount: 0,
    };

    this.performanceMetrics.set(componentName, {
      renderTime: (existing.renderTime + renderTime) / 2, // Moving average
      componentCount: existing.componentCount + 1,
      updateCount: existing.updateCount + 1,
    });
  }

  /**
   * Get debug logs for a specific component
   */
  getLogsForComponent(componentName: string): DebugInfo[] {
    return this.debugLogs.filter((log) => log.componentName === componentName);
  }

  /**
   * Get all debug logs
   */
  getAllLogs(): DebugInfo[] {
    return [...this.debugLogs];
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.performanceMetrics);
  }

  /**
   * Clear all debug data
   */
  clear(): void {
    this.debugLogs.length = 0;
    this.performanceMetrics.clear();
  }

  /**
   * Enable or disable debugging
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Export debug data for analysis
   */
  exportDebugData(): {
    logs: DebugInfo[];
    performance: Record<string, PerformanceMetrics>;
    timestamp: number;
  } {
    return {
      logs: this.getAllLogs(),
      performance: Object.fromEntries(this.performanceMetrics),
      timestamp: Date.now(),
    };
  }

  private sanitizeProps(
    props?: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    if (!props) return undefined;

    // Remove functions and complex objects for cleaner logging
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'function') {
        sanitized[key] = '[Function]';
      } else if (
        value &&
        typeof value === 'object' &&
        value.constructor !== Object &&
        value.constructor !== Array
      ) {
        sanitized[key] = `[${value.constructor.name}]`;
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private sanitizeState(
    state?: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    return this.sanitizeProps(state);
  }
}

/**
 * Hook for component debugging
 */
export function useMapDebugger(componentName: string) {
  const mapDebugger = MapDebugger.getInstance();

  return {
    logRender: (
      props?: Record<string, unknown>,
      state?: Record<string, unknown>,
    ) => mapDebugger.logRender(componentName, props, state),
    logError: (error: Error, props?: Record<string, unknown>) =>
      mapDebugger.logError(componentName, error, props),
    trackPerformance: (renderTime: number) =>
      mapDebugger.trackPerformance(componentName, renderTime),
  };
}

/**
 * Higher-order component for automatic debugging
 */
export function withMapDebugging<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string,
) {
  const displayName =
    componentName || Component.displayName || Component.name || 'Unknown';

  return function DebuggedComponent(props: P) {
    const { logRender, logError, trackPerformance } =
      useMapDebugger(displayName);

    const startTime = performance.now();

    try {
      logRender(props as Record<string, unknown>);

      // Handle both function and class components
      const result = React.createElement(Component, props);

      const endTime = performance.now();
      trackPerformance(endTime - startTime);

      return result;
    } catch (error) {
      logError(error as Error, props as Record<string, unknown>);
      throw error;
    }
  };
}

/**
 * Development-only debugging utilities
 */
export const devTools = {
  /**
   * Log component hierarchy with owner stack
   */
  logComponentHierarchy: (componentName: string) => {
    if (
      typeof process !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      const ownerStack = captureOwnerStack();
      // eslint-disable-next-line no-console
      console.log(`📊 Component Hierarchy for ${componentName}:`, ownerStack);
    }
  },

  /**
   * Measure component render time
   */
  measureRenderTime: <T>(componentName: string, renderFn: () => T): T => {
    if (
      typeof process !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      const start = performance.now();
      const result = renderFn();
      const end = performance.now();
      // eslint-disable-next-line no-console
      console.log(
        `⏱️ ${componentName} render time: ${(end - start).toFixed(2)}ms`,
      );
      return result;
    }
    return renderFn();
  },

  /**
   * Debug geography loading
   */
  debugGeographyLoading: (
    url: string,
    status: 'start' | 'success' | 'error',
    data?: unknown,
  ) => {
    if (
      typeof process !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      const ownerStack = captureOwnerStack();
      // eslint-disable-next-line no-console
      console.group(`🌍 Geography Loading: ${url}`);
      // eslint-disable-next-line no-console
      console.log('Status:', status);
      // eslint-disable-next-line no-console
      console.log('Owner Stack:', ownerStack);
      // eslint-disable-next-line no-console
      if (data) console.log('Data:', data);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  },
};

// Global debugger instance
export const mapDebugger = MapDebugger.getInstance();

// Export for development console access
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (
    globalThis as typeof globalThis & { __MAP_DEBUGGER__?: MapDebugger }
  ).__MAP_DEBUGGER__ = mapDebugger;
}
