import pandas as pd
import logging
import os
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import date

logger = logging.getLogger(__name__)

DATA_PATH = "data/intelligent_hotel_revenue_.csv"

def validate_data(df: pd.DataFrame) -> pd.DataFrame:
    """Validate and clean the hotel revenue data"""
    required_columns = [
        "Date", "Hotel_ID", "Rooms_Available", "Rooms_Sold", 
        "Occupancy_Rate", "ADR_INR", "RevPAR_INR", "Revenue_INR",
        "Cancellation_Count", "Market_Segment", "Booking_Channel"
    ]
    
    # Check if all required columns exist
    missing_columns = set(required_columns) - set(df.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    
    # Remove any duplicate rows
    initial_rows = len(df)
    df = df.drop_duplicates()
    if len(df) < initial_rows:
        logger.info(f"Removed {initial_rows - len(df)} duplicate rows")
    
    # Validate data types and ranges
    df["Occupancy_Rate"] = pd.to_numeric(df["Occupancy_Rate"], errors="coerce")
    df["ADR_INR"] = pd.to_numeric(df["ADR_INR"], errors="coerce")
    df["Revenue_INR"] = pd.to_numeric(df["Revenue_INR"], errors="coerce")
    
    # Remove rows with invalid data
    df = df.dropna(subset=["Occupancy_Rate", "ADR_INR", "Revenue_INR"])
    
    # Validate occupancy rate range (0-1)
    df = df[(df["Occupancy_Rate"] >= 0) & (df["Occupancy_Rate"] <= 1)]
    
    return df

def load_data() -> pd.DataFrame:
    """Load and process hotel revenue data with error handling"""
    try:
        # Check if file exists
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Data file not found: {DATA_PATH}")
        
        logger.info(f"Loading data from {DATA_PATH}")
        
        # Load CSV with optimized settings
        df = pd.read_csv(
            DATA_PATH,
            dtype={
                "Hotel_ID": "category",
                "Market_Segment": "category", 
                "Booking_Channel": "category"
            },
            parse_dates=False  # We'll handle date parsing separately
        )
        
        # Convert Date column with proper error handling
        try:
            df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y")
        except ValueError:
            # Try alternative format if first fails
            df["Date"] = pd.to_datetime(df["Date"], infer_datetime_format=True)
        
        # Validate and clean data
        df = validate_data(df)
        
        logger.info(f"Successfully loaded {len(df)} rows of data")
        return df
        
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        raise

def apply_filters(df: pd.DataFrame, filters: Dict[str, Any]) -> pd.DataFrame:
    """Apply dynamic filters to dataframe"""
    filtered_df = df.copy()
    
    try:
        # Filter by date range
        if filters.get('start_date'):
            filtered_df = filtered_df[filtered_df['Date'] >= pd.to_datetime(filters['start_date'])]
        
        if filters.get('end_date'):
            filtered_df = filtered_df[filtered_df['Date'] <= pd.to_datetime(filters['end_date'])]
        
        # Filter by hotel_id (supports multiple values)
        if filters.get('hotel_id'):
            hotel_ids = [id.strip() for id in str(filters['hotel_id']).split(',')]
            filtered_df = filtered_df[filtered_df['Hotel_ID'].astype(str).isin(hotel_ids)]
        
        # Filter by booking channel (supports multiple values)
        if filters.get('booking_channel'):
            channels = [ch.strip() for ch in str(filters['booking_channel']).split(',')]
            filtered_df = filtered_df[filtered_df['Booking_Channel'].isin(channels)]
        
        # Filter by market segment (supports multiple values)
        if filters.get('market_segment'):
            segments = [seg.strip() for seg in str(filters['market_segment']).split(',')]
            filtered_df = filtered_df[filtered_df['Market_Segment'].isin(segments)]
        
        logger.info(f"Applied filters: {filters}, Resulting records: {len(filtered_df)}")
        return filtered_df
        
    except Exception as e:
        logger.error(f"Error applying filters: {str(e)}")
        raise ValueError(f"Invalid filter parameters: {str(e)}")

def get_filter_metadata(df: pd.DataFrame, original_count: int) -> Dict[str, Any]:
    """Generate metadata about applied filters"""
    if df.empty:
        return {
            "total_records": 0,
            "date_range": None,
            "hotels": [],
            "channels": [],
            "segments": []
        }
    
    date_range = None
    if 'Date' in df.columns and not df['Date'].empty:
        date_range = {
            "start": df['Date'].min().strftime('%Y-%m-%d'),
            "end": df['Date'].max().strftime('%Y-%m-%d')
        }
    
    return {
        "total_records": len(df),
        "original_records": original_count,
        "date_range": date_range,
        "hotels": sorted(df['Hotel_ID'].astype(str).unique().tolist()),
        "channels": sorted(df['Booking_Channel'].unique().tolist()),
        "segments": sorted(df['Market_Segment'].unique().tolist())
    }