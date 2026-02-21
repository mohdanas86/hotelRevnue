// API configuration and constants
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  KPI: '/api/kpi',
  REVENUE_TREND: '/api/revenue-trend',
  OCCUPANCY_TREND: '/api/occupancy-trend',
  REVENUE_BY_HOTEL: '/api/revenue-by-hotel',
  REVENUE_BY_CHANNEL: '/api/revenue-by-channel',
  MARKET_SEGMENT: '/api/market-segment',
  SCATTER: '/api/scatter',
  CANCELLATIONS_BY_CHANNEL: '/api/cancellations-by-channel',
} as const;

export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  KPI_TTL: 2 * 60 * 1000,     // 2 minutes
  TREND_TTL: 10 * 60 * 1000,  // 10 minutes
} as const;