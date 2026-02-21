// TypeScript interfaces for API responses

export interface KPIData {
  total_revenue: number;
  avg_occupancy: number;
  avg_adr: number;
  avg_revpar: number;
  total_cancellations: number;
}

export interface RevenueTrendItem {
  Date: string;
  Revenue_INR: number;
}

export interface OccupancyTrendItem {
  Date: string;
  Occupancy_Rate: number;
}

export interface RevenueByHotelItem {
  Hotel_ID: string;
  Revenue_INR: number;
}

export interface RevenueByChannelItem {
  Booking_Channel: string;
  Revenue_INR: number;
}

export interface MarketSegmentItem {
  Market_Segment: string;
  Revenue_INR: number;
}

export interface ScatterDataItem {
  Hotel_ID: string;
  ADR_INR: number;
  Occupancy_Rate: number;
  Revenue_INR: number;
}

export interface CancellationByChannelItem {
  Booking_Channel: string;
  Cancellation_Count: number;
}

// Transformed interfaces for chart consumption
export interface ChartRevenueTrend {
  date: string;
  revenue: number;
}

export interface ChartOccupancyTrend {
  date: string;
  occupancy: number;
}

export interface ChartScatterData {
  Hotel_ID: string;
  ADR_INR: number;
  Occupancy_Rate: number;
  Occupancy_Percent: number;
  Revenue_INR: number;
}

// API Response wrapper
export interface APIResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

// Cache entry structure
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// API Error structure
// Note: APIError is now defined as a class in api-service.ts