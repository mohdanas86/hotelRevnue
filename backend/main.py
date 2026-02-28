from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import logging
from typing import Optional, Dict, Any
from datetime import date, datetime

from services import revenue_service
from services import forecast_service
from services import insight_service
from services import dashboard_service
from models.schemas import (
    KPIResponse, RevenueTrendResponse, OccupancyTrendResponse,
    RevenueByHotelResponse, RevenueByChannelResponse, MarketSegmentResponse,
    ScatterDataResponse, CancellationByChannelResponse, HealthResponse,
    AnalyticsFilters, FilteredResponse, ValidationError,
    ForecastResponse, CacheStatus, InsightsResponse
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Hotel Revenue API",
    description="API for hotel revenue analytics and insights",
    version="1.0.0"
)

# Add gzip compression for better performance
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS configuration - more secure for production
origins = [
    "http://localhost:3000",  # frontend development
    "http://127.0.0.1:3000", # alternative localhost
    # Add production URLs when deploying
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Add error handling wrapper
async def handle_service_error(func, *args, **kwargs):
    """Wrapper to handle service errors consistently"""
    try:
        return func(*args, **kwargs)
    except ValueError as e:
        logger.error(f"Validation error in {func.__name__}: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid filter parameters: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Service error in {func.__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

def create_filters_dict(
    hotel_id: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    booking_channel: Optional[str] = None,
    market_segment: Optional[str] = None
) -> Dict[str, Any]:
    """Create filters dictionary from query parameters"""
    filters = {}
    
    if hotel_id:
        filters['hotel_id'] = hotel_id
    if start_date:
        filters['start_date'] = start_date
    if end_date:
        filters['end_date'] = end_date
    if booking_channel:
        filters['booking_channel'] = booking_channel
    if market_segment:
        filters['market_segment'] = market_segment
        
    return filters if filters else None


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return {
        "message": "Hotel Revenue API Running",
        "version": "1.0.0",
        "status": "healthy"
    }

# KPI API
@app.get("/api/kpi", response_model=Dict[str, Any], tags=["analytics"])
async def kpi(
    hotel_id: Optional[str] = Query(None, description="Filter by hotel ID (comma-separated)"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    booking_channel: Optional[str] = Query(None, description="Filter by booking channel (comma-separated)"),
    market_segment: Optional[str] = Query(None, description="Filter by market segment (comma-separated)")
):
    """Get key performance indicators with optional filtering"""
    filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(revenue_service.get_kpis, filters)

# Revenue Trend API
@app.get("/api/revenue-trend", response_model=Dict[str, Any], tags=["analytics"])
async def revenue_trend(
    hotel_id: Optional[str] = Query(None, description="Filter by hotel ID (comma-separated)"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    booking_channel: Optional[str] = Query(None, description="Filter by booking channel (comma-separated)"),
    market_segment: Optional[str] = Query(None, description="Filter by market segment (comma-separated)")
):
    """Get revenue trend over time with optional filtering"""
    filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(revenue_service.get_revenue_trend, filters)

# Occupancy Trend API
@app.get("/api/occupancy-trend", response_model=Dict[str, Any], tags=["analytics"])
async def occupancy_trend(
    hotel_id: Optional[str] = Query(None, description="Filter by hotel ID (comma-separated)"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    booking_channel: Optional[str] = Query(None, description="Filter by booking channel (comma-separated)"),
    market_segment: Optional[str] = Query(None, description="Filter by market segment (comma-separated)")
):
    """Get occupancy trend over time with optional filtering"""
    filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(revenue_service.get_occupancy_trend, filters)

# Revenue by Hotel
@app.get("/api/revenue-by-hotel", response_model=Dict[str, Any], tags=["analytics"])
async def revenue_by_hotel(
    hotel_id: Optional[str] = Query(None, description="Filter by hotel ID (comma-separated)"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    booking_channel: Optional[str] = Query(None, description="Filter by booking channel (comma-separated)"),
    market_segment: Optional[str] = Query(None, description="Filter by market segment (comma-separated)")
):
    """Get revenue breakdown by hotel with optional filtering"""
    filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(revenue_service.get_revenue_by_hotel, filters)

# Revenue by Booking Channel
@app.get("/api/revenue-by-channel", response_model=Dict[str, Any], tags=["analytics"])
async def revenue_by_channel(
    hotel_id: Optional[str] = Query(None, description="Filter by hotel ID (comma-separated)"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    booking_channel: Optional[str] = Query(None, description="Filter by booking channel (comma-separated)"),
    market_segment: Optional[str] = Query(None, description="Filter by market segment (comma-separated)")
):
    """Get revenue breakdown by booking channel with optional filtering"""
    filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(revenue_service.get_revenue_by_channel, filters)

# Market Segment Share
@app.get("/api/market-segment", response_model=Dict[str, Any], tags=["analytics"])
async def market_segment(
    hotel_id: Optional[str] = Query(None, description="Filter by hotel ID (comma-separated)"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    booking_channel: Optional[str] = Query(None, description="Filter by booking channel (comma-separated)"),
    market_segment: Optional[str] = Query(None, description="Filter by market segment (comma-separated)")
):
    """Get market segment analysis with optional filtering"""
    filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(revenue_service.get_market_segment_share, filters)

# Scatter Data
@app.get("/api/scatter", response_model=Dict[str, Any], tags=["analytics"])
async def scatter(
    hotel_id: Optional[str] = Query(None, description="Filter by hotel ID (comma-separated)"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    booking_channel: Optional[str] = Query(None, description="Filter by booking channel (comma-separated)"),
    market_segment: Optional[str] = Query(None, description="Filter by market segment (comma-separated)")
):
    """Get ADR vs Occupancy scatter plot data with optional filtering"""
    filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(revenue_service.get_scatter_data, filters)

# Cancellation by Channel API
@app.get("/api/cancellations-by-channel", response_model=Dict[str, Any], tags=["analytics"])
async def cancellations_by_channel(
    hotel_id: Optional[str] = Query(None, description="Filter by hotel ID (comma-separated)"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    booking_channel: Optional[str] = Query(None, description="Filter by booking channel (comma-separated)"),
    market_segment: Optional[str] = Query(None, description="Filter by market segment (comma-separated)")
):
    """Get cancellation data by booking channel with optional filtering"""
    filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(revenue_service.get_cancellations_by_channel, filters)
# Filter discovery endpoints
@app.get("/api/filters/available", response_model=Dict[str, Any], tags=["filters"])
async def get_available_filters():
    """Get available filter values for all dimensions"""
    try:
        data = revenue_service.get_cached_data()
        return {
            "hotels": sorted(data['Hotel_ID'].astype(str).unique().tolist()),
            "booking_channels": sorted(data['Booking_Channel'].unique().tolist()),
            "market_segments": sorted(data['Market_Segment'].unique().tolist()),
            "date_range": {
                "min_date": data['Date'].min().strftime('%Y-%m-%d'),
                "max_date": data['Date'].max().strftime('%Y-%m-%d')
            },
            "total_records": len(data)
        }
    except Exception as e:
        logger.error(f"Error getting available filters: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving filter options: {str(e)}"
        )

@app.get("/api/filters/validate", response_model=Dict[str, Any], tags=["filters"])  
async def validate_filters(
    hotel_id: Optional[str] = Query(None, description="Validate hotel ID(s)"),
    start_date: Optional[date] = Query(None, description="Validate start date"),
    end_date: Optional[date] = Query(None, description="Validate end date"),
    booking_channel: Optional[str] = Query(None, description="Validate booking channel(s)"),
    market_segment: Optional[str] = Query(None, description="Validate market segment(s)")
):
    """Validate filter parameters and return expected record count"""
    try:
        filters = create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)
        
        if not filters:
            return {"valid": True, "expected_records": len(revenue_service.get_cached_data())}
        
        data = revenue_service.get_cached_data()
        from utils.data_loader import apply_filters
        filtered_data = apply_filters(data, filters)
        
        return {
            "valid": True,
            "filters": filters,
            "expected_records": len(filtered_data),
            "original_records": len(data)
        }
        
    except Exception as e:
        return {
            "valid": False,
            "error": str(e),
            "filters": filters if 'filters' in locals() else None
        }

# Legacy endpoints for backward compatibility
@app.get("/api/legacy/kpi", response_model=KPIResponse, tags=["legacy"])
async def legacy_kpi():
    """Legacy KPI endpoint - maintains original response format"""
    result = await handle_service_error(revenue_service.get_kpis)
    # Extract just the KPI data for legacy format
    return {
        "total_revenue": result["total_revenue"],
        "avg_occupancy": result["avg_occupancy"], 
        "avg_adr": result["avg_adr"],
        "avg_revpar": result["avg_revpar"],
        "total_cancellations": result["total_cancellations"]
    }

@app.get("/api/legacy/revenue-trend", response_model=RevenueTrendResponse, tags=["legacy"])
async def legacy_revenue_trend():
    """Legacy revenue trend endpoint - maintains original response format"""
    result = await handle_service_error(revenue_service.get_revenue_trend)
    return result["data"]

@app.get("/api/legacy/revenue-by-hotel", response_model=RevenueByHotelResponse, tags=["legacy"])
async def legacy_revenue_by_hotel():
    """Legacy revenue by hotel endpoint - maintains original response format"""
    result = await handle_service_error(revenue_service.get_revenue_by_hotel)
    return result["data"]

@app.get("/api/legacy/revenue-by-channel", response_model=RevenueByChannelResponse, tags=["legacy"])
async def legacy_revenue_by_channel():
    """Legacy revenue by channel endpoint - maintains original response format"""
    result = await handle_service_error(revenue_service.get_revenue_by_channel)
    return result["data"]

# Forecasting endpoints
@app.get("/api/revenue-forecast", response_model=ForecastResponse, tags=["forecasting"])
async def revenue_forecast(
    days_ahead: Optional[int] = Query(30, description="Number of days to forecast (1-365)", ge=1, le=365)
):
    """Generate revenue forecast using Prophet or Linear Regression"""
    try:
        validated_days = forecast_service.validate_forecast_parameters(days_ahead)
        result = await handle_service_error(forecast_service.get_revenue_forecast, validated_days)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/occupancy-forecast", response_model=ForecastResponse, tags=["forecasting"])
async def occupancy_forecast(
    days_ahead: Optional[int] = Query(30, description="Number of days to forecast (1-365)", ge=1, le=365)
):
    """Generate occupancy rate forecast using Prophet or Linear Regression"""
    try:
        validated_days = forecast_service.validate_forecast_parameters(days_ahead)
        result = await handle_service_error(forecast_service.get_occupancy_forecast, validated_days)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Forecast management endpoints
@app.post("/api/forecast/clear-cache", response_model=Dict[str, str], tags=["forecasting"])
async def clear_forecast_cache():
    """Clear forecast cache to force model retraining"""
    try:
        forecast_service.clear_forecast_cache()
        return {"message": "Forecast cache cleared successfully"}
    except Exception as e:
        logger.error(f"Error clearing forecast cache: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error clearing cache: {str(e)}"
        )

@app.get("/api/forecast/cache-status", response_model=CacheStatus, tags=["forecasting"])
async def get_forecast_cache_status():
    """Get current forecast cache status"""
    try:
        return forecast_service.get_cache_status()
    except Exception as e:
        logger.error(f"Error getting cache status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting cache status: {str(e)}"
        )

@app.get("/api/debug/data-info", response_model=Dict[str, Any], tags=["debug"])
async def data_info():
    """Get information about the loaded dataset for debugging"""
    try:
        from utils.data_loader import load_data
        df = load_data()
        
        return {
            "total_rows": len(df),
            "columns": list(df.columns),
            "date_range": {
                "min_date": df["Date"].min().strftime("%Y-%m-%d") if not df.empty else None,
                "max_date": df["Date"].max().strftime("%Y-%m-%d") if not df.empty else None
            },
            "sample_data": df.head(3).to_dict(orient="records") if not df.empty else [],
            "hotels": list(df["Hotel_ID"].unique()[:5]) if not df.empty else [],
            "data_file_exists": True
        }
    except Exception as e:
        return {
            "error": str(e),
            "data_file_exists": False,
            "total_rows": 0
        }

@app.get("/api/insights", response_model=InsightsResponse, tags=["analytics"])
async def get_business_insights():
    """Generate automatic business insights from hotel revenue data"""
    try:
        logger.info("Generating business insights")
        
        # Generate insights
        insights = insight_service.get_insights()
        
        # Get data period info
        try:
            data = insight_service.insight_service.data
            data_period = None
            if data is not None and not data.empty:
                min_date = data['Date'].min().strftime('%Y-%m-%d')
                max_date = data['Date'].max().strftime('%Y-%m-%d')
                data_period = f"{min_date} to {max_date}"
        except Exception as period_error:
            logger.warning(f"Could not determine data period: {str(period_error)}")
            data_period = None
        
        response = InsightsResponse(
            insights=insights,
            generated_at=datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ'),
            total_insights=len(insights),
            data_period=data_period
        )
        
        logger.info(f"Generated {len(insights)} business insights successfully")
        return response
        
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

# ─────────────────────────────────────────────────────────────────────────────
# NEW DASHBOARD ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

def _dashboard_filters(
    hotel_id: Optional[str],
    start_date: Optional[date],
    end_date: Optional[date],
    booking_channel: Optional[str],
    market_segment: Optional[str],
) -> Optional[Dict[str, Any]]:
    return create_filters_dict(hotel_id, start_date, end_date, booking_channel, market_segment)


@app.get("/api/dashboard/summary", response_model=Dict[str, Any], tags=["dashboard"])
async def dashboard_summary(
    hotel_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    booking_channel: Optional[str] = Query(None),
    market_segment: Optional[str] = Query(None),
):
    """Enhanced KPI summary — total revenue, bookings, ADR, RevPAR, occupancy, cancellation rate."""
    filters = _dashboard_filters(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(dashboard_service.get_summary, filters)


@app.get("/api/dashboard/revenue-over-time", response_model=Dict[str, Any], tags=["dashboard"])
async def dashboard_revenue_over_time(
    granularity: Optional[str] = Query("day", regex="^(day|week|month)$"),
    hotel_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    booking_channel: Optional[str] = Query(None),
    market_segment: Optional[str] = Query(None),
):
    """Revenue grouped by day/week/month."""
    filters = _dashboard_filters(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(
        dashboard_service.get_revenue_over_time, filters, granularity
    )


@app.get("/api/dashboard/bookings-by-channel", response_model=Dict[str, Any], tags=["dashboard"])
async def dashboard_bookings_by_channel(
    hotel_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    booking_channel: Optional[str] = Query(None),
    market_segment: Optional[str] = Query(None),
):
    """Bookings and revenue grouped by booking channel."""
    filters = _dashboard_filters(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(dashboard_service.get_bookings_by_channel, filters)


@app.get("/api/dashboard/bookings-by-segment", response_model=Dict[str, Any], tags=["dashboard"])
async def dashboard_bookings_by_segment(
    hotel_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    booking_channel: Optional[str] = Query(None),
    market_segment: Optional[str] = Query(None),
):
    """Bookings and revenue grouped by market segment (guest/room type)."""
    filters = _dashboard_filters(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(dashboard_service.get_bookings_by_segment, filters)


@app.get("/api/dashboard/occupancy-over-time", response_model=Dict[str, Any], tags=["dashboard"])
async def dashboard_occupancy_over_time(
    granularity: Optional[str] = Query("day", regex="^(day|week|month)$"),
    hotel_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    booking_channel: Optional[str] = Query(None),
    market_segment: Optional[str] = Query(None),
):
    """Occupancy rate (%) over time."""
    filters = _dashboard_filters(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(
        dashboard_service.get_occupancy_over_time, filters, granularity
    )


@app.get("/api/dashboard/adr-over-time", response_model=Dict[str, Any], tags=["dashboard"])
async def dashboard_adr_over_time(
    granularity: Optional[str] = Query("day", regex="^(day|week|month)$"),
    hotel_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    booking_channel: Optional[str] = Query(None),
    market_segment: Optional[str] = Query(None),
):
    """Average Daily Rate trend over time."""
    filters = _dashboard_filters(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(
        dashboard_service.get_adr_over_time, filters, granularity
    )


@app.get("/api/dashboard/cancellations-over-time", response_model=Dict[str, Any], tags=["dashboard"])
async def dashboard_cancellations_over_time(
    granularity: Optional[str] = Query("day", regex="^(day|week|month)$"),
    hotel_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    booking_channel: Optional[str] = Query(None),
    market_segment: Optional[str] = Query(None),
):
    """Cancellation count and rate over time."""
    filters = _dashboard_filters(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(
        dashboard_service.get_cancellations_over_time, filters, granularity
    )


@app.get("/api/dashboard/revenue-by-hotel", response_model=Dict[str, Any], tags=["dashboard"])
async def dashboard_revenue_by_hotel(
    top_n: Optional[int] = Query(10, ge=1, le=50),
    hotel_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    booking_channel: Optional[str] = Query(None),
    market_segment: Optional[str] = Query(None),
):
    """Revenue breakdown by hotel (top N)."""
    filters = _dashboard_filters(hotel_id, start_date, end_date, booking_channel, market_segment)
    return await handle_service_error(
        dashboard_service.get_revenue_by_hotel_dashboard, filters, top_n
    )


@app.get("/api/filters/options", response_model=Dict[str, Any], tags=["filters"])
async def get_filter_options():
    """All available filter options from real data: hotels, channels, segments, date range."""
    return await handle_service_error(dashboard_service.get_filter_options)


@app.post("/api/insights/refresh", tags=["analytics"])
async def refresh_insights():
    """Refresh insights data (useful after data updates)"""
    try:
        insight_service.refresh_insights()
        return {"message": "Insights data refreshed successfully"}
    except Exception as e:
        logger.error(f"Error refreshing insights: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))