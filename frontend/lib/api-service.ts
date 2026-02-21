/**
 * Unified API service with caching, error handling, and request management
 */

import { API_CONFIG, API_ENDPOINTS, CACHE_CONFIG } from './api-config';
import type {
  KPIData,
  RevenueTrendItem,
  OccupancyTrendItem,
  RevenueByHotelItem,
  RevenueByChannelItem,
  MarketSegmentItem,
  ScatterDataItem,
  CancellationByChannelItem,
  ChartRevenueTrend,
  ChartOccupancyTrend,
  ChartScatterData,
  APIResponse,
  CacheEntry,
} from './types';

class APIService {
  private cache = new Map<string, CacheEntry<any>>();
  private requestMap = new Map<string, Promise<any>>();
  private preloadQueue = new Set<string>();

  /**
   * Preload critical data in background
   */
  public preloadCriticalData(): void {
    // Preload KPI data immediately as it's most critical
    if (!this.cache.has('kpi') && !this.preloadQueue.has('kpi')) {
      this.preloadQueue.add('kpi');
      this.getKPI().catch(() => {
        // Silent fail for preloading
        this.preloadQueue.delete('kpi');
      });
    }

    // Preload revenue trend after short delay
    setTimeout(() => {
      if (!this.cache.has('revenue-trend') && !this.preloadQueue.has('revenue-trend')) {
        this.preloadQueue.add('revenue-trend');
        this.getRevenueTrend().catch(() => {
          this.preloadQueue.delete('revenue-trend');
        });
      }
    }, 100);
  }

  /**
   * Generic fetch method with retry logic and error handling
   */
  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new APIError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }
      
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (retries > 0 && !(error instanceof DOMException)) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
        return this.fetchWithRetry<T>(endpoint, options, retries - 1);
      }
      
      throw error instanceof APIError 
        ? error 
        : new APIError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get data from cache if valid, otherwise fetch from API
   */
  private async getCachedData<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
    ttl = CACHE_CONFIG.DEFAULT_TTL
  ): Promise<T> {
    // Check if there's already a pending request
    if (this.requestMap.has(cacheKey)) {
      return this.requestMap.get(cacheKey)!;
    }

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Create and store the promise
    const promise = this.executeWithCache(cacheKey, fetcher, ttl);
    this.requestMap.set(cacheKey, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.requestMap.delete(cacheKey);
    }
  }

  /**
   * Execute fetcher and cache the result
   */
  private async executeWithCache<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    try {
      const data = await fetcher();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl,
      });
      
      return data;
    } catch (error) {
      // Remove failed request from cache
      this.cache.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Clear cache entry or all cache
   */
  public clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get KPI data
   */
  public async getKPI(): Promise<KPIData> {
    return this.getCachedData(
      'kpi',
      () => this.fetchWithRetry<KPIData>(API_ENDPOINTS.KPI),
      CACHE_CONFIG.KPI_TTL
    );
  }

  /**
   * Get revenue trend data and transform for charts
   */
  public async getRevenueTrend(): Promise<ChartRevenueTrend[]> {
    const data = await this.getCachedData(
      'revenue-trend',
      () => this.fetchWithRetry<RevenueTrendItem[]>(API_ENDPOINTS.REVENUE_TREND),
      CACHE_CONFIG.TREND_TTL
    );

    // Transform for chart consumption
    return data.map(item => ({
      date: item.Date,
      revenue: item.Revenue_INR,
    }));
  }

  /**
   * Get occupancy trend data and transform for charts
   */
  public async getOccupancyTrend(): Promise<ChartOccupancyTrend[]> {
    const data = await this.getCachedData(
      'occupancy-trend',
      () => this.fetchWithRetry<OccupancyTrendItem[]>(API_ENDPOINTS.OCCUPANCY_TREND),
      CACHE_CONFIG.TREND_TTL
    );

    return data.map(item => ({
      date: item.Date,
      occupancy: item.Occupancy_Rate,
    }));
  }

  /**
   * Get revenue by hotel data
   */
  public async getRevenueByHotel(): Promise<RevenueByHotelItem[]> {
    return this.getCachedData(
      'revenue-by-hotel',
      () => this.fetchWithRetry<RevenueByHotelItem[]>(API_ENDPOINTS.REVENUE_BY_HOTEL)
    );
  }

  /**
   * Get revenue by channel data
   */
  public async getRevenueByChannel(): Promise<RevenueByChannelItem[]> {
    return this.getCachedData(
      'revenue-by-channel',
      () => this.fetchWithRetry<RevenueByChannelItem[]>(API_ENDPOINTS.REVENUE_BY_CHANNEL)
    );
  }

  /**
   * Get market segment data
   */
  public async getMarketSegment(): Promise<MarketSegmentItem[]> {
    return this.getCachedData(
      'market-segment',
      () => this.fetchWithRetry<MarketSegmentItem[]>(API_ENDPOINTS.MARKET_SEGMENT)
    );
  }

  /**
   * Get scatter plot data and transform for charts
   */
  public async getScatterData(): Promise<ChartScatterData[]> {
    const data = await this.getCachedData(
      'scatter',
      () => this.fetchWithRetry<ScatterDataItem[]>(API_ENDPOINTS.SCATTER)
    );

    // Transform for chart consumption
    return data.map(item => ({
      ...item,
      Occupancy_Percent: item.Occupancy_Rate * 100,
    }));
  }

  /**
   * Get cancellation by channel data
   */
  public async getCancellationsByChannel(): Promise<CancellationByChannelItem[]> {
    return this.getCachedData(
      'cancellations-by-channel',
      () => this.fetchWithRetry<CancellationByChannelItem[]>(API_ENDPOINTS.CANCELLATIONS_BY_CHANNEL)
    );
  }
}

// Custom API Error class
class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

// Export singleton instance
export const apiService = new APIService();

// Initialize preloading on client-side
if (typeof window !== 'undefined') {
  // Start preloading critical data when the service is imported
  setTimeout(() => {
    apiService.preloadCriticalData();
  }, 0);
}

// Export types for consumers
export type { 
  KPIData, 
  ChartRevenueTrend, 
  ChartOccupancyTrend, 
  ChartScatterData,
  RevenueByHotelItem,
  RevenueByChannelItem,
  MarketSegmentItem,
  CancellationByChannelItem,
  APIError,
};