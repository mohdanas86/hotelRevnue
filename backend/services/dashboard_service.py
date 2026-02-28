"""
Dashboard service: new aggregation endpoints aligned with the prompt spec.
All monetary values returned with 2 decimal places; all dates in ISO-8601.
"""

import pandas as pd
import logging
from typing import Dict, Any, Optional

from utils.data_loader import apply_filters, get_filter_metadata
from services.revenue_service import get_cached_data

logger = logging.getLogger(__name__)

_GRANULARITY_RULES = {"day": "D", "week": "W", "month": "ME"}


def _resample(df: pd.DataFrame, granularity: str, agg: Dict[str, str]) -> pd.DataFrame:
    """Resample a date-indexed DataFrame."""
    rule = _GRANULARITY_RULES.get(granularity, "D")
    resampled = df.resample(rule).agg(agg).reset_index()
    resampled["Date"] = resampled["Date"].dt.strftime("%Y-%m-%d")
    return resampled


def _build_empty(filters, original_count: int, df: pd.DataFrame):
    return {
        "data": [],
        "filters_applied": filters or {},
        "metadata": get_filter_metadata(df, original_count),
    }


# ---------------------------------------------------------------------------
# 1. Dashboard Summary (enhanced KPIs)
# ---------------------------------------------------------------------------

def get_summary(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Enhanced KPI summary for the primary KPI card row."""
    try:
        df = get_cached_data()
        original_count = len(df)
        if filters:
            df = apply_filters(df, filters)

        if df.empty:
            return {
                "total_revenue": 0.0,
                "total_bookings": 0,
                "avg_adr": 0.0,
                "avg_revpar": 0.0,
                "avg_occupancy": 0.0,
                "cancellation_rate": 0.0,
                "total_cancellations": 0,
                "total_rooms_sold": 0,
                "filters_applied": filters or {},
                "metadata": get_filter_metadata(df, original_count),
            }

        total_rooms_sold = int(df["Rooms_Sold"].sum())
        total_cancellations = int(df["Cancellation_Count"].sum())
        cancellation_rate = (
            round((total_cancellations / total_rooms_sold) * 100, 2)
            if total_rooms_sold > 0
            else 0.0
        )

        return {
            "total_revenue": round(float(df["Revenue_INR"].sum()), 2),
            "total_bookings": total_rooms_sold,
            "avg_adr": round(float(df["ADR_INR"].mean()), 2),
            "avg_revpar": round(float(df["RevPAR_INR"].mean()), 2),
            "avg_occupancy": round(float(df["Occupancy_Rate"].mean()), 4),
            "cancellation_rate": cancellation_rate,
            "total_cancellations": total_cancellations,
            "total_rooms_sold": total_rooms_sold,
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count),
        }
    except Exception as e:
        logger.error(f"Error in get_summary: {e}")
        raise


# ---------------------------------------------------------------------------
# 2. Revenue over time
# ---------------------------------------------------------------------------

def get_revenue_over_time(
    filters: Optional[Dict[str, Any]] = None,
    granularity: str = "day",
) -> Dict[str, Any]:
    try:
        df = get_cached_data()
        original_count = len(df)
        if filters:
            df = apply_filters(df, filters)
        if df.empty:
            return _build_empty(filters, original_count, df)

        indexed = df.set_index("Date")
        result = _resample(
            indexed, granularity, {"Revenue_INR": "sum", "ADR_INR": "mean"}
        )
        result["Revenue_INR"] = result["Revenue_INR"].round(2)
        result["ADR_INR"] = result["ADR_INR"].round(2)

        return {
            "data": result.to_dict(orient="records"),
            "granularity": granularity,
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count),
        }
    except Exception as e:
        logger.error(f"Error in get_revenue_over_time: {e}")
        raise


# ---------------------------------------------------------------------------
# 3. Bookings by channel
# ---------------------------------------------------------------------------

def get_bookings_by_channel(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    try:
        df = get_cached_data()
        original_count = len(df)
        if filters:
            df = apply_filters(df, filters)
        if df.empty:
            return _build_empty(filters, original_count, df)

        grouped = (
            df.groupby("Booking_Channel", as_index=False)
            .agg(
                bookings=("Rooms_Sold", "sum"),
                revenue=("Revenue_INR", "sum"),
                cancellations=("Cancellation_Count", "sum"),
            )
            .sort_values("bookings", ascending=False)
        )
        total = grouped["bookings"].sum()
        grouped["share_pct"] = (
            (grouped["bookings"] / total * 100).round(1) if total > 0 else 0.0
        )
        grouped["revenue"] = grouped["revenue"].round(2)

        return {
            "data": grouped.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count),
        }
    except Exception as e:
        logger.error(f"Error in get_bookings_by_channel: {e}")
        raise


# ---------------------------------------------------------------------------
# 4. Bookings by segment (Market_Segment ≈ room / guest type)
# ---------------------------------------------------------------------------

def get_bookings_by_segment(filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    try:
        df = get_cached_data()
        original_count = len(df)
        if filters:
            df = apply_filters(df, filters)
        if df.empty:
            return _build_empty(filters, original_count, df)

        grouped = (
            df.groupby("Market_Segment", as_index=False)
            .agg(
                bookings=("Rooms_Sold", "sum"),
                revenue=("Revenue_INR", "sum"),
                cancellations=("Cancellation_Count", "sum"),
                avg_adr=("ADR_INR", "mean"),
            )
            .sort_values("bookings", ascending=False)
        )
        total = grouped["bookings"].sum()
        grouped["share_pct"] = (
            (grouped["bookings"] / total * 100).round(1) if total > 0 else 0.0
        )
        grouped["revenue"] = grouped["revenue"].round(2)
        grouped["avg_adr"] = grouped["avg_adr"].round(2)

        return {
            "data": grouped.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count),
        }
    except Exception as e:
        logger.error(f"Error in get_bookings_by_segment: {e}")
        raise


# ---------------------------------------------------------------------------
# 5. Occupancy rate over time
# ---------------------------------------------------------------------------

def get_occupancy_over_time(
    filters: Optional[Dict[str, Any]] = None,
    granularity: str = "day",
) -> Dict[str, Any]:
    try:
        df = get_cached_data()
        original_count = len(df)
        if filters:
            df = apply_filters(df, filters)
        if df.empty:
            return _build_empty(filters, original_count, df)

        indexed = df.set_index("Date")
        result = _resample(indexed, granularity, {"Occupancy_Rate": "mean"})
        result["Occupancy_Rate"] = (result["Occupancy_Rate"] * 100).round(2)  # 0-100

        return {
            "data": result.to_dict(orient="records"),
            "granularity": granularity,
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count),
        }
    except Exception as e:
        logger.error(f"Error in get_occupancy_over_time: {e}")
        raise


# ---------------------------------------------------------------------------
# 6. ADR over time
# ---------------------------------------------------------------------------

def get_adr_over_time(
    filters: Optional[Dict[str, Any]] = None,
    granularity: str = "day",
) -> Dict[str, Any]:
    try:
        df = get_cached_data()
        original_count = len(df)
        if filters:
            df = apply_filters(df, filters)
        if df.empty:
            return _build_empty(filters, original_count, df)

        indexed = df.set_index("Date")
        result = _resample(indexed, granularity, {"ADR_INR": "mean"})
        result["ADR_INR"] = result["ADR_INR"].round(2)

        return {
            "data": result.to_dict(orient="records"),
            "granularity": granularity,
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count),
        }
    except Exception as e:
        logger.error(f"Error in get_adr_over_time: {e}")
        raise


# ---------------------------------------------------------------------------
# 7. Cancellations over time
# ---------------------------------------------------------------------------

def get_cancellations_over_time(
    filters: Optional[Dict[str, Any]] = None,
    granularity: str = "day",
) -> Dict[str, Any]:
    try:
        df = get_cached_data()
        original_count = len(df)
        if filters:
            df = apply_filters(df, filters)
        if df.empty:
            return _build_empty(filters, original_count, df)

        indexed = df.set_index("Date")
        result = _resample(
            indexed,
            granularity,
            {"Cancellation_Count": "sum", "Rooms_Sold": "sum"},
        )
        # Compute cancellation rate for the period
        result["cancellation_rate"] = (
            (result["Cancellation_Count"] / result["Rooms_Sold"] * 100)
            .fillna(0)
            .round(2)
        )
        result.rename(columns={"Cancellation_Count": "cancellations"}, inplace=True)
        result.drop(columns=["Rooms_Sold"], inplace=True)

        return {
            "data": result.to_dict(orient="records"),
            "granularity": granularity,
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count),
        }
    except Exception as e:
        logger.error(f"Error in get_cancellations_over_time: {e}")
        raise


# ---------------------------------------------------------------------------
# 8. Revenue by hotel
# ---------------------------------------------------------------------------

def get_revenue_by_hotel_dashboard(filters: Optional[Dict[str, Any]] = None, top_n: int = 10) -> Dict[str, Any]:
    try:
        df = get_cached_data()
        original_count = len(df)
        if filters:
            df = apply_filters(df, filters)
        if df.empty:
            return _build_empty(filters, original_count, df)

        grouped = (
            df.groupby("Hotel_ID", as_index=False)
            .agg(
                revenue=("Revenue_INR", "sum"),
                bookings=("Rooms_Sold", "sum"),
                avg_adr=("ADR_INR", "mean"),
                avg_occupancy=("Occupancy_Rate", "mean"),
            )
            .nlargest(top_n, "revenue")
        )
        grouped["revenue"] = grouped["revenue"].round(2)
        grouped["avg_adr"] = grouped["avg_adr"].round(2)
        grouped["avg_occupancy"] = (grouped["avg_occupancy"] * 100).round(1)

        return {
            "data": grouped.to_dict(orient="records"),
            "filters_applied": filters or {},
            "metadata": get_filter_metadata(df, original_count),
        }
    except Exception as e:
        logger.error(f"Error in get_revenue_by_hotel_dashboard: {e}")
        raise


# ---------------------------------------------------------------------------
# 9. Filter options
# ---------------------------------------------------------------------------

def get_filter_options() -> Dict[str, Any]:
    try:
        df = get_cached_data()
        return {
            "hotels": sorted(df["Hotel_ID"].astype(str).unique().tolist()),
            "channels": sorted(df["Booking_Channel"].astype(str).unique().tolist()),
            "segments": sorted(df["Market_Segment"].astype(str).unique().tolist()),
            "date_range": {
                "min_date": df["Date"].min().strftime("%Y-%m-%d"),
                "max_date": df["Date"].max().strftime("%Y-%m-%d"),
            },
            "total_records": int(len(df)),
        }
    except Exception as e:
        logger.error(f"Error in get_filter_options: {e}")
        raise
