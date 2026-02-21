from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import logging

from services import revenue_service
from models.schemas import (
    KPIResponse, RevenueTrendResponse, OccupancyTrendResponse,
    RevenueByHotelResponse, RevenueByChannelResponse, MarketSegmentResponse,
    ScatterDataResponse, CancellationByChannelResponse, HealthResponse
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
    except Exception as e:
        logger.error(f"Service error in {func.__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return {
        "message": "Hotel Revenue API Running",
        "version": "1.0.0",
        "status": "healthy"
    }

# KPI API
@app.get("/api/kpi", response_model=KPIResponse, tags=["analytics"])
async def kpi():
    """Get key performance indicators"""
    return await handle_service_error(revenue_service.get_kpis)

# Revenue Trend API
@app.get("/api/revenue-trend", response_model=RevenueTrendResponse, tags=["analytics"])
async def revenue_trend():
    """Get revenue trend over time"""
    return await handle_service_error(revenue_service.get_revenue_trend)

# Occupancy Trend API
@app.get("/api/occupancy-trend", response_model=OccupancyTrendResponse, tags=["analytics"])
async def occupancy_trend():
    """Get occupancy trend over time"""
    return await handle_service_error(revenue_service.get_occupancy_trend)

# Revenue by Hotel
@app.get("/api/revenue-by-hotel", response_model=RevenueByHotelResponse, tags=["analytics"])
async def revenue_by_hotel():
    """Get revenue breakdown by hotel"""
    return await handle_service_error(revenue_service.get_revenue_by_hotel)

# Revenue by Booking Channel
@app.get("/api/revenue-by-channel", response_model=RevenueByChannelResponse, tags=["analytics"])
async def revenue_by_channel():
    """Get revenue breakdown by booking channel"""
    return await handle_service_error(revenue_service.get_revenue_by_channel)

# Market Segment Share
@app.get("/api/market-segment", response_model=MarketSegmentResponse, tags=["analytics"])
async def market_segment():
    """Get market segment analysis"""
    return await handle_service_error(revenue_service.get_market_segment_share)

# Scatter Data
@app.get("/api/scatter", response_model=ScatterDataResponse, tags=["analytics"])
async def scatter():
    """Get ADR vs Occupancy scatter plot data"""
    return await handle_service_error(revenue_service.get_scatter_data)

# Cancellation by Channel API
@app.get("/api/cancellations-by-channel", response_model=CancellationByChannelResponse, tags=["analytics"])
async def cancellations_by_channel():
    """Get cancellation data by booking channel"""
    return await handle_service_error(revenue_service.get_cancellations_by_channel)