import pandas as pd
import logging
import os
from pathlib import Path

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