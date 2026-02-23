/**
 * Custom hook for filtered API data with query parameters
 */

import { useState, useCallback, useEffect } from 'react';
import type { FilterState, FilterOption } from '../components/FilterPanel';
import type { APIError } from '../lib/api-service';

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface UseFilteredAPIState<T> {
  data: T | null;
  loading: boolean;
  error: APIError | null;
  refresh: () => Promise<void>;
  applyFilters: (filters: FilterState) => Promise<void>;
}

interface FilterMetadata {
  hotels: FilterOption[];
  bookingChannels: FilterOption[];
  marketSegments: FilterOption[];
}

/**
 * Build query string from filters
 */
function buildQueryString(filters: FilterState): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim()) {
      // Map frontend filter names to API parameter names
      const paramMap: Record<string, string> = {
        startDate: 'start_date',
        endDate: 'end_date',
        hotelId: 'hotel_id',
        bookingChannel: 'booking_channel',
        marketSegment: 'market_segment',
      };
      
      const paramName = paramMap[key] || key;
      params.append(paramName, value.trim());
    }
  });
  
  return params.toString();
}

/**
 * Generic API fetch with filters
 */
async function fetchWithFilters<T>(endpoint: string, filters: FilterState = {}): Promise<T> {
  const queryString = buildQueryString(filters);
  const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Filtered API fetch error:', error);
    throw error;
  }
}

/**
 * Hook for KPI data with filters
 */
export function useFilteredKPI(initialFilters: FilterState = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilters);

  const fetchData = useCallback(async (filters: FilterState) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchWithFilters('/api/kpi', filters);
      setData(result as any);
      setCurrentFilters(filters);
    } catch (err: any) {
      setError({ message: err.message || 'Failed to fetch KPI data', status: err.status, name: err.name || 'APIError' });
      console.error('KPI fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (filters: FilterState) => {
    await fetchData(filters);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(currentFilters);
  }, [fetchData, currentFilters]);

  useEffect(() => {
    fetchData(initialFilters);
  }, [fetchData]);

  return { data, loading, error, refresh, applyFilters };
}

/**
 * Hook for revenue trend data with filters
 */
export function useFilteredRevenueTrend(initialFilters: FilterState = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilters);

  const fetchData = useCallback(async (filters: FilterState) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchWithFilters('/api/revenue-trend', filters);
      setData(result as any);
      setCurrentFilters(filters);
    } catch (err: any) {
      setError({ message: err.message || 'Failed to fetch revenue trend', status: err.status, name: err.name || 'APIError' });
      console.error('Revenue trend fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (filters: FilterState) => {
    await fetchData(filters);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(currentFilters);
  }, [fetchData, currentFilters]);

  useEffect(() => {
    fetchData(initialFilters);
  }, [fetchData]);

  return { data, loading, error, refresh, applyFilters };
}

/**
 * Hook for revenue by hotel data with filters
 */
export function useFilteredRevenueByHotel(initialFilters: FilterState = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilters);

  const fetchData = useCallback(async (filters: FilterState) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchWithFilters('/api/revenue-by-hotel', filters);
      setData(result as any);
      setCurrentFilters(filters);
    } catch (err: any) {
      setError({ message: err.message || 'Failed to fetch revenue by hotel', status: err.status, name: err.name || 'APIError' });
      console.error('Revenue by hotel fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (filters: FilterState) => {
    await fetchData(filters);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(currentFilters);
  }, [fetchData, currentFilters]);

  useEffect(() => {
    fetchData(initialFilters);
  }, [fetchData]);

  return { data, loading, error, refresh, applyFilters };
}

/**
 * Hook for revenue by channel data with filters
 */
export function useFilteredRevenueByChannel(initialFilters: FilterState = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilters);

  const fetchData = useCallback(async (filters: FilterState) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchWithFilters('/api/revenue-by-channel', filters);
      setData(result as any);
      setCurrentFilters(filters);
    } catch (err: any) {
      setError({ message: err.message || 'Failed to fetch revenue by channel', status: err.status, name: err.name || 'APIError' });
      console.error('Revenue by channel fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (filters: FilterState) => {
    await fetchData(filters);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(currentFilters);
  }, [fetchData, currentFilters]);

  useEffect(() => {
    fetchData(initialFilters);
  }, [fetchData]);

  return { data, loading, error, refresh, applyFilters };
}

/**
 * Hook for market segment data with filters
 */
export function useFilteredMarketSegment(initialFilters: FilterState = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilters);

  const fetchData = useCallback(async (filters: FilterState) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchWithFilters('/api/market-segment', filters);
      setData(result as any);
      setCurrentFilters(filters);
    } catch (err: any) {
      setError({ message: err.message || 'Failed to fetch market segment', status: err.status, name: err.name || 'APIError' });
      console.error('Market segment fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (filters: FilterState) => {
    await fetchData(filters);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(currentFilters);
  }, [fetchData, currentFilters]);

  useEffect(() => {
    fetchData(initialFilters);
  }, [fetchData]);

  return { data, loading, error, refresh, applyFilters };
}

/**
 * Hook for filter metadata (available options)
 */
export function useFilterMetadata(): FilterMetadata & { loading: boolean; error: APIError | null } {
  const [metadata, setMetadata] = useState<FilterMetadata>({
    hotels: [],
    bookingChannels: [],
    marketSegments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch metadata from the backend
        // This assumes your backend provides endpoints to get filter options
        const [hotelsData, channelsData, segmentsData] = await Promise.all([
          fetchWithFilters<any[]>('/api/revenue-by-hotel'),
          fetchWithFilters<any[]>('/api/revenue-by-channel'),
          fetchWithFilters<any[]>('/api/market-segment'),
        ]);

        // Extract unique values for filter options
        const hotels: FilterOption[] = Array.from(
          new Set(hotelsData?.map((item: any) => item.Hotel_ID))
        ).map((id: any) => ({
          value: id,
          label: `Hotel ${id}`,
          count: hotelsData?.filter((item: any) => item.Hotel_ID === id).length,
        }));

        const channels: FilterOption[] = Array.from(
          new Set(channelsData?.map((item: any) => item.Booking_Channel))
        ).map((channel: any) => ({
          value: channel,
          label: channel,
          count: channelsData?.filter((item: any) => item.Booking_Channel === channel).length,
        }));

        const segments: FilterOption[] = Array.from(
          new Set(segmentsData?.map((item: any) => item.Market_Segment))
        ).map((segment: any) => ({
          value: segment,
          label: segment,
          count: segmentsData?.filter((item: any) => item.Market_Segment === segment).length,
        }));

        setMetadata({
          hotels: hotels.sort((a, b) => a.label.localeCompare(b.label)),
          bookingChannels: channels.sort((a, b) => a.label.localeCompare(b.label)),
          marketSegments: segments.sort((a, b) => a.label.localeCompare(b.label)),
        });
      } catch (err: any) {
        setError({ message: err.message || 'Failed to fetch filter metadata', status: err.status, name: err.name || 'APIError' });
        console.error('Filter metadata fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { ...metadata, loading, error };
}

/**
 * Hook for comprehensive filtered dashboard data
 */
export function useFilteredDashboardData(initialFilters: FilterState = {}) {
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilters);
  
  const kpi = useFilteredKPI(currentFilters);
  const revenueTrend = useFilteredRevenueTrend(currentFilters);
  const revenueByHotel = useFilteredRevenueByHotel(currentFilters);
  const revenueByChannel = useFilteredRevenueByChannel(currentFilters);
  const marketSegment = useFilteredMarketSegment(currentFilters);
  const filterMetadata = useFilterMetadata();

  const applyFilters = useCallback(async (filters: FilterState) => {
    setCurrentFilters(filters);
    
    // Apply filters to all data hooks
    await Promise.all([
      kpi.applyFilters(filters),
      revenueTrend.applyFilters(filters),
      revenueByHotel.applyFilters(filters),
      revenueByChannel.applyFilters(filters),
      marketSegment.applyFilters(filters),
    ]);
  }, [kpi, revenueTrend, revenueByHotel, revenueByChannel, marketSegment]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      kpi.refresh(),
      revenueTrend.refresh(),
      revenueByHotel.refresh(),
      revenueByChannel.refresh(),
      marketSegment.refresh(),
    ]);
  }, [kpi, revenueTrend, revenueByHotel, revenueByChannel, marketSegment]);

  // Calculate overall loading state
  const loading = kpi.loading || revenueTrend.loading || revenueByHotel.loading || 
                  revenueByChannel.loading || marketSegment.loading || filterMetadata.loading;

  // Collect errors
  const errors = [kpi.error, revenueTrend.error, revenueByHotel.error, 
                  revenueByChannel.error, marketSegment.error, filterMetadata.error]
                  .filter(Boolean);

  return {
    // Data
    kpi: kpi.data,
    revenueTrend: revenueTrend.data,
    revenueByHotel: revenueByHotel.data,
    revenueByChannel: revenueByChannel.data,
    marketSegment: marketSegment.data,
    
    // Filter metadata
    filterMetadata: {
      hotels: filterMetadata.hotels,
      bookingChannels: filterMetadata.bookingChannels,
      marketSegments: filterMetadata.marketSegments,
    },
    
    // State
    loading,
    errors,
    currentFilters,
    
    // Actions
    applyFilters,
    refreshAll,
  };
}