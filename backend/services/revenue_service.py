from functools import lru_cache
from typing import Dict, List, Any, Optional
import logging
import pandas as pd
from utils.data_loader import load_data, apply_filters, get_filter_metadata

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache the loaded data to avoid repeated CSV reads
@lru_cache(maxsize=1)
def get_cached_data():
    """Load and cache dataset with error handling"""
    try:
        return load_data()
    except Exception as e:
        logger.error(f"Failed to load data: {e}")
        raise

# KPI DATA
def get_kpis(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get key performance indicators with optional filtering"""
    try:
        df = get_cached_data()
        original_count = len(df)
        
        # Apply filters if provided
        if filters:
            df = apply_filters(df, filters)
        
        if df.empty:
            return {
                "total_revenue": 0.0,
                "avg_occupancy": 0.0,
                "avg_adr": 0.0,
                "avg_revpar": 0.0,
                "total_cancellations": 0,
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count)
            }
        
        result = {
            "total_revenue": round(df["Revenue_INR"].sum(), 2),
            "avg_occupancy": round(df["Occupancy_Rate"].mean(), 3),
            "avg_adr": round(df["ADR_INR"].mean(), 2),
            "avg_revpar": round(df["RevPAR_INR"].mean(), 2),
            "total_cancellations": int(df["Cancellation_Count"].sum()),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count)
        }
        
        return result
    except Exception as e:
        logger.error(f"Error calculating KPIs: {e}")
        raise


# Revenue Trend
def get_revenue_trend(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get revenue trend data with optional filtering"""
    try:
        df = get_cached_data()
        original_count = len(df)
        
        # Apply filters if provided
        if filters:
            df = apply_filters(df, filters)
        
        if df.empty:
            return {
                "data": [],
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count)
            }
        
        grouped = df.groupby("Date")["Revenue_INR"].sum().reset_index()
        # Convert datetime to string for JSON serialization
        grouped["Date"] = grouped["Date"].dt.strftime("%Y-%m-%d")
        
        return {
            "data": grouped.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count)
        }
    except Exception as e:
        logger.error(f"Error getting revenue trend: {e}")
        raise


# Occupancy Trend
def get_occupancy_trend(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get occupancy trend data with optional filtering"""
    try:
        df = get_cached_data()
        original_count = len(df)
        
        # Apply filters if provided
        if filters:
            df = apply_filters(df, filters)
        
        if df.empty:
            return {
                "data": [],
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count)
            }
        
        grouped = df.groupby("Date")["Occupancy_Rate"].mean().reset_index()
        grouped["Date"] = grouped["Date"].dt.strftime("%Y-%m-%d")
        
        return {
            "data": grouped.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count)
        }
    except Exception as e:
        logger.error(f"Error getting occupancy trend: {e}")
        raise


# Revenue by Hotel
def get_revenue_by_hotel(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get revenue by hotel with optional filtering and enhanced data"""
    try:
        df = get_cached_data()
        original_count = len(df)
        
        # Apply filters if provided
        if filters:
            df = apply_filters(df, filters)
        
        if df.empty:
            return {
                "data": [],
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count)
            }
        
        # Enhanced aggregation with more metrics
        grouped = df.groupby("Hotel_ID").agg({
            "Revenue_INR": "sum",
            "Occupancy_Rate": "mean", 
            "ADR_INR": "mean",
            "RevPAR_INR": "mean",
            "Cancellation_Count": "sum"
        }).reset_index()
        
        # Add hotel names and performance metrics
        grouped["Hotel_Name"] = grouped["Hotel_ID"].apply(lambda x: f"Hotel {x}")
        grouped["Performance_Score"] = (
            (grouped["Revenue_INR"] / grouped["Revenue_INR"].max()) * 0.6 +
            (grouped["Occupancy_Rate"] / 100) * 0.4
        ).round(3)
        
        # Sort by revenue (highest first) and limit to top performers
        result = grouped.nlargest(15, "Revenue_INR")
        
        # Round numeric values for better display
        result["Revenue_INR"] = result["Revenue_INR"].round(2)
        result["Occupancy_Rate"] = result["Occupancy_Rate"].round(1)
        result["ADR_INR"] = result["ADR_INR"].round(2)
        result["RevPAR_INR"] = result["RevPAR_INR"].round(2)
        
        return {
            "data": result.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count)
        }
    except Exception as e:
        logger.error(f"Error getting revenue by hotel: {e}")
        raise


# Revenue by Booking Channel
def get_revenue_by_channel(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get revenue by booking channel with optional filtering and enhanced data"""
    try:
        df = get_cached_data()
        original_count = len(df)
        
        # Apply filters if provided
        if filters:
            df = apply_filters(df, filters)
        
        if df.empty:
            return {
                "data": [],
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count)
            }
        
        # Enhanced aggregation with more metrics
        grouped = df.groupby("Booking_Channel").agg({
            "Revenue_INR": "sum",
            "Occupancy_Rate": "mean",
            "ADR_INR": "mean", 
            "RevPAR_INR": "mean",
            "Cancellation_Count": "sum",
            "Hotel_ID": "nunique"  # Count unique hotels per channel
        }).reset_index()
        
        # Rename for clarity
        grouped.rename(columns={"Hotel_ID": "Hotel_Count"}, inplace=True)
        
        # Calculate channel efficiency score
        if len(grouped) > 0:
            grouped["Efficiency_Score"] = (
                (grouped["Revenue_INR"] / grouped["Revenue_INR"].max()) * 0.5 +
                ((100 - grouped["Cancellation_Count"]) / 100) * 0.3 +
                (grouped["Occupancy_Rate"] / 100) * 0.2
            ).round(3)
            
            # Calculate market share percentage
            total_revenue = grouped["Revenue_INR"].sum()
            if total_revenue > 0:
                grouped["Market_Share"] = ((grouped["Revenue_INR"] / total_revenue) * 100).round(1)
            else:
                grouped["Market_Share"] = 0.0
        
        # Sort by revenue (highest first)
        result = grouped.sort_values("Revenue_INR", ascending=False)
        
        # Round numeric values for better display
        result["Revenue_INR"] = result["Revenue_INR"].round(2)
        result["Occupancy_Rate"] = result["Occupancy_Rate"].round(1)
        result["ADR_INR"] = result["ADR_INR"].round(2)
        result["RevPAR_INR"] = result["RevPAR_INR"].round(2)
        
        return {
            "data": result.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count)
        }
    except Exception as e:
        logger.error(f"Error getting revenue by channel: {e}")
        raise


# Market Segment Share
def get_market_segment_share(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get market segment share with optional filtering"""
    try:
        df = get_cached_data()
        original_count = len(df)
        
        # Apply filters if provided
        if filters:
            df = apply_filters(df, filters)
        
        if df.empty:
            return {
                "data": [],
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count)
            }
        
        grouped = df.groupby("Market_Segment")["Revenue_INR"].sum().reset_index()
        
        return {
            "data": grouped.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count)
        }
    except Exception as e:
        logger.error(f"Error getting market segment share: {e}")
        raise


# Scatter Plot Data
def get_scatter_data(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get scatter plot data with optional filtering"""
    try:
        df = get_cached_data()
        original_count = len(df)
        
        # Apply filters if provided
        if filters:
            df = apply_filters(df, filters)
        
        if df.empty:
            return {
                "data": [],
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count)
            }
        
        scatter = df[["Hotel_ID", "ADR_INR", "Occupancy_Rate", "Revenue_INR"]]
        
        return {
            "data": scatter.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count)
        }
    except Exception as e:
        logger.error(f"Error getting scatter data: {e}")
        raise


# Cancellation Data  
def get_cancellations_by_channel(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get cancellations by booking channel with optional filtering"""
    try:
        df = get_cached_data()
        original_count = len(df)
        
        # Apply filters if provided
        if filters:
            df = apply_filters(df, filters)
        
        if df.empty:
            return {
                "data": [],
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count)
            }
        
        result = (
            df.groupby("Booking_Channel", as_index=False)
            .agg({"Cancellation_Count": "sum"})
            .sort_values("Cancellation_Count", ascending=False)
        )
        
        return {
            "data": result.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count)
        }
    except Exception as e:
        logger.error(f"Error getting cancellations by channel: {e}")
        raise