/**
 * Custom React hooks for API data management
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../lib/api-service';
import type { APIError } from '../lib/api-service';

interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: APIError | null;
  refresh: () => Promise<void>;
}

/**
 * Generic hook for API data fetching with error handling and caching
 */
function useAPIData<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
): UseAPIState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err as APIError);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh };
}

/**
 * Hook for KPI data
 */
export function useKPI() {
  return useAPIData(() => apiService.getKPI());
}

/**
 * Hook for revenue trend data
 */
export function useRevenueTrend() {
  return useAPIData(() => apiService.getRevenueTrend());
}

/**
 * Hook for occupancy trend data
 */
export function useOccupancyTrend() {
  return useAPIData(() => apiService.getOccupancyTrend());
}

/**
 * Hook for revenue by hotel data
 */
export function useRevenueByHotel() {
  return useAPIData(() => apiService.getRevenueByHotel());
}

/**
 * Hook for revenue by channel data
 */
export function useRevenueByChannel() {
  return useAPIData(() => apiService.getRevenueByChannel());
}

/**
 * Hook for market segment data
 */
export function useMarketSegment() {
  return useAPIData(() => apiService.getMarketSegment());
}

/**
 * Hook for scatter plot data
 */
export function useScatterData() {
  return useAPIData(() => apiService.getScatterData());
}

/**
 * Hook for cancellation by channel data
 */
export function useCancellationsByChannel() {
  return useAPIData(() => apiService.getCancellationsByChannel());
}

/**
 * Hook for clearing cache
 */
export function useCache() {
  const clearCache = useCallback((key?: string) => {
    apiService.clearCache(key);
  }, []);

  return { clearCache };
}