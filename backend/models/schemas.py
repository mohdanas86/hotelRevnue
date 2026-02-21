"""
Pydantic schemas for API request/response models
"""

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional, Union
from datetime import datetime, date
import re

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

class AnalyticsFilters(BaseModel):
    """Common filters for analytics endpoints"""
    hotel_id: Optional[str] = Field(None, description="Filter by hotel ID (comma-separated for multiple)")
    start_date: Optional[date] = Field(None, description="Start date for filtering (YYYY-MM-DD)")
    end_date: Optional[date] = Field(None, description="End date for filtering (YYYY-MM-DD)")
    booking_channel: Optional[str] = Field(None, description="Filter by booking channel (comma-separated for multiple)")
    market_segment: Optional[str] = Field(None, description="Filter by market segment (comma-separated for multiple)")
    
    @validator('start_date', 'end_date', pre=True)
    def parse_date(cls, v):
        """Parse date from string if needed"""
        if isinstance(v, str):
            try:
                return datetime.strptime(v, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError('Date must be in YYYY-MM-DD format')
        return v
    
    @validator('end_date')
    def validate_date_range(cls, v, values):
        """Ensure end_date is after start_date"""
        if v and 'start_date' in values and values['start_date']:
            if v < values['start_date']:
                raise ValueError('end_date must be after start_date')
        return v

class FilteredResponse(BaseModel):
    """Base response with filter metadata"""
    data: List[Dict[str, Any]] = Field(..., description="Filtered data")
    filters_applied: Dict[str, Any] = Field(..., description="Applied filters summary")
    total_records: int = Field(..., description="Total records after filtering")
    date_range: Optional[Dict[str, str]] = Field(None, description="Actual date range in results")
    """Standard API error response"""
    error: bool = True
    message: str = Field(..., description="Error message")
    code: str = Field(..., description="Error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")

class ValidationError(BaseModel):
    """Validation error details"""
    field: str = Field(..., description="Field name with error")
    message: str = Field(..., description="Error message")
    value: Any = Field(..., description="Invalid value")

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
