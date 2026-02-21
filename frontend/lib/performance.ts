/**
 * Performance monitoring utilities for dashboard optimization
 */

import React from 'react';

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetrics>();

  /**
   * Start timing a performance metric
   */
  start(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  /**
   * End timing a performance metric
   */
  end(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" was not started`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    metric.endTime = endTime;
    metric.duration = duration;

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️  ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Mark a performance milestone
   */
  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance && 'mark' in window.performance) {
      performance.mark(name);
    }
  }

  /**
   * Measure between two performance marks
   */
  measure(name: string, startMark: string, endMark?: string): void {
    if (typeof window !== 'undefined' && window.performance && 'measure' in window.performance) {
      performance.measure(name, startMark, endMark);
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Log performance summary
   */
  logSummary(): void {
    const metrics = this.getMetrics().filter(m => m.duration);
    
    if (metrics.length === 0) {
      console.log('No performance metrics recorded');
      return;
    }

    console.group('📊 Performance Summary');
    metrics
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .forEach(metric => {
        console.log(`${metric.name}: ${metric.duration?.toFixed(2)}ms`);
      });
    console.groupEnd();
  }
}

// Export singleton instance
export const perfMonitor = new PerformanceMonitor();

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  React.useEffect(() => {
    perfMonitor.start(`${componentName}-mount`);
    perfMonitor.mark(`${componentName}-start`);

    return () => {
      perfMonitor.end(`${componentName}-mount`);
      perfMonitor.mark(`${componentName}-end`);
      perfMonitor.measure(`${componentName}-lifecycle`, `${componentName}-start`, `${componentName}-end`);
    };
  }, [componentName]);
}

// HOC for automatic performance tracking
export function withPerformanceTracking<P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithPerformanceTracking = React.memo((props: P) => {
    usePerformanceTracking(name);
    return React.createElement(WrappedComponent, props);
  });

  WithPerformanceTracking.displayName = `withPerformanceTracking(${name})`;
  return WithPerformanceTracking;
}