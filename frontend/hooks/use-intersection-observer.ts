/**
 * Custom hook for Intersection Observer API
 * Provides visibility detection for elements with performance optimizations
 */

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

/**
 * Hook that monitors element visibility using Intersection Observer
 */
export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  triggerOnce = false,
  root = null,
}: UseIntersectionObserverOptions = {}): [RefObject<HTMLDivElement>, boolean] {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    
    if (!target) return;

    // Check if Intersection Observer is supported
    if (!window.IntersectionObserver) {
      // Fallback: assume element is always in view
      setIsInView(true);
      return;
    }

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const inView = entry.isIntersecting;
        
        setIsInView(inView);
        
        // If triggerOnce is true, stop observing after first intersection
        if (inView && triggerOnce && observerRef.current) {
          observerRef.current.unobserve(target);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    // Start observing
    observerRef.current.observe(target);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, root]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [targetRef as RefObject<HTMLDivElement>, isInView];
}

/**
 * Hook for lazy loading with intersection observer
 * Automatically handles triggerOnce behavior
 */
export function useLazyLoad(options?: Omit<UseIntersectionObserverOptions, 'triggerOnce'>) {
  return useIntersectionObserver({
    ...options,
    triggerOnce: true,
  });
}

/**
 * Hook for element visibility tracking
 * Useful for analytics, animations, etc.
 */
export function useVisibility(options?: UseIntersectionObserverOptions) {
  return useIntersectionObserver({
    threshold: 0.1,
    ...options,
    triggerOnce: false,
  });
}