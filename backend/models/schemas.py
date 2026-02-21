"""
Pydantic schemas for API request/response models
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class KPIResponse(BaseModel):
    """KPI metrics response schema"""
    total_revenue: float = Field(..., description="Total revenue in INR")
    avg_occupancy: float = Field(..., description="Average occupancy rate (0-1)")
    avg_adr: float = Field(..., description="Average Daily Rate in INR")
    avg_revpar: float = Field(..., description="Average Revenue per Available Room in INR")
    total_cancellations: int = Field(..., description="Total number of cancellations")

class RevenueTrendItem(BaseModel):
    """Single revenue trend data point"""
    Date: str = Field(..., description="Date in YYYY-MM-DD format")
    Revenue_INR: float = Field(..., description="Revenue in INR")

class OccupancyTrendItem(BaseModel):
    """Single occupancy trend data point"""
    Date: str = Field(..., description="Date in YYYY-MM-DD format")
    Occupancy_Rate: float = Field(..., description="Occupancy rate (0-1)")

class RevenueByHotelItem(BaseModel):
    """Revenue by hotel data point"""
    Hotel_ID: str = Field(..., description="Hotel identifier")
    Revenue_INR: float = Field(..., description="Revenue in INR")

class RevenueByChannelItem(BaseModel):
    """Revenue by booking channel data point"""
    Booking_Channel: str = Field(..., description="Booking channel name")
    Revenue_INR: float = Field(..., description="Revenue in INR")

class MarketSegmentItem(BaseModel):
    """Market segment data point"""
    Market_Segment: str = Field(..., description="Market segment name")
    Revenue_INR: float = Field(..., description="Revenue in INR")

class ScatterDataItem(BaseModel):
    """Scatter plot data point for ADR vs Occupancy"""
    Hotel_ID: str = Field(..., description="Hotel identifier")
    ADR_INR: float = Field(..., description="Average Daily Rate in INR")
    Occupancy_Rate: float = Field(..., description="Occupancy rate (0-1)")
    Revenue_INR: float = Field(..., description="Revenue in INR")

class CancellationByChannelItem(BaseModel):
    """Cancellation by channel data point"""
    Booking_Channel: str = Field(..., description="Booking channel name")
    Cancellation_Count: int = Field(..., description="Number of cancellations")

class APIError(BaseModel):
    """Standard API error response"""
    error: bool = True
    message: str = Field(..., description="Error message")
    code: str = Field(..., description="Error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")

class HealthResponse(BaseModel):
    """Health check response"""
    message: str = Field(..., description="Status message")
    version: str = Field(..., description="API version")
    status: str = Field(..., description="Health status")

# Response type aliases for better readability
RevenueTrendResponse = List[RevenueTrendItem]
OccupancyTrendResponse = List[OccupancyTrendItem]
RevenueByHotelResponse = List[RevenueByHotelItem]
RevenueByChannelResponse = List[RevenueByChannelItem]
MarketSegmentResponse = List[MarketSegmentItem]
ScatterDataResponse = List[ScatterDataItem]
CancellationByChannelResponse = List[CancellationByChannelItem]
