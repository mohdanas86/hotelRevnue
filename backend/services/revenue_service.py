from functools import lru_cache
from typing import Dict, List, Any
import logging
from utils.data_loader import load_data

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
def get_kpis() -> Dict[str, float]:
    """Get key performance indicators with error handling"""
    try:
        df = get_cached_data()
        return {
            "total_revenue": round(df["Revenue_INR"].sum(), 2),
            "avg_occupancy": round(df["Occupancy_Rate"].mean(), 3),
            "avg_adr": round(df["ADR_INR"].mean(), 2),
            "avg_revpar": round(df["RevPAR_INR"].mean(), 2),
            "total_cancellations": int(df["Cancellation_Count"].sum())
        }
    except Exception as e:
        logger.error(f"Error calculating KPIs: {e}")
        raise


# Revenue Trend
def get_revenue_trend() -> List[Dict[str, Any]]:
    """Get revenue trend data with error handling"""
    try:
        df = get_cached_data()
        grouped = df.groupby("Date")["Revenue_INR"].sum().reset_index()
        # Convert datetime to string for JSON serialization
        grouped["Date"] = grouped["Date"].dt.strftime("%Y-%m-%d")
        return grouped.to_dict(orient="records")
    except Exception as e:
        logger.error(f"Error getting revenue trend: {e}")
        raise


# Occupancy Trend
def get_occupancy_trend() -> List[Dict[str, Any]]:
    """Get occupancy trend data with error handling"""
    try:
        df = get_cached_data()
        grouped = df.groupby("Date")["Occupancy_Rate"].mean().reset_index()
        grouped["Date"] = grouped["Date"].dt.strftime("%Y-%m-%d")
        return grouped.to_dict(orient="records")
    except Exception as e:
        logger.error(f"Error getting occupancy trend: {e}")
        raise


# Revenue by Hotel
def get_revenue_by_hotel() -> List[Dict[str, Any]]:
    """Get revenue by hotel with error handling"""
    try:
        df = get_cached_data()
        grouped = df.groupby("Hotel_ID")["Revenue_INR"].sum().reset_index()
        return grouped.to_dict(orient="records")
    except Exception as e:
        logger.error(f"Error getting revenue by hotel: {e}")
        raise


# Revenue by Booking Channel
def get_revenue_by_channel() -> List[Dict[str, Any]]:
    """Get revenue by booking channel with error handling"""
    try:
        df = get_cached_data()
        grouped = df.groupby("Booking_Channel")["Revenue_INR"].sum().reset_index()
        return grouped.to_dict(orient="records")
    except Exception as e:
        logger.error(f"Error getting revenue by channel: {e}")
        raise


# Market Segment Share
def get_market_segment_share() -> List[Dict[str, Any]]:
    """Get market segment share with error handling"""
    try:
        df = get_cached_data()
        grouped = df.groupby("Market_Segment")["Revenue_INR"].sum().reset_index()
        return grouped.to_dict(orient="records")
    except Exception as e:
        logger.error(f"Error getting market segment share: {e}")
        raise


# Scatter Plot Data
def get_scatter_data() -> List[Dict[str, Any]]:
    """Get scatter plot data with error handling"""
    try:
        df = get_cached_data()
        scatter = df[["Hotel_ID", "ADR_INR", "Occupancy_Rate", "Revenue_INR"]]
        return scatter.to_dict(orient="records")
    except Exception as e:
        logger.error(f"Error getting scatter data: {e}")
        raise


# Cancellation Data  
def get_cancellations_by_channel() -> List[Dict[str, Any]]:
    """Get cancellations by booking channel with error handling"""
    try:
        df = get_cached_data()
        result = (
            df.groupby("Booking_Channel", as_index=False)
            .agg({"Cancellation_Count": "sum"})
            .sort_values("Cancellation_Count", ascending=False)
        )
        return result.to_dict(orient="records")
    except Exception as e:
        logger.error(f"Error getting cancellations by channel: {e}")
        raise