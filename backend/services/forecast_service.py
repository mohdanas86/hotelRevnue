"""
Forecasting service for hotel revenue analytics
Uses Facebook Prophet with Linear Regression fallback
"""

import pandas as pd
import numpy as np
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta, date
from functools import lru_cache
import hashlib
import json

# Try importing Prophet, fallback to sklearn if not available
try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    logging.warning("Prophet not available, will use Linear Regression fallback")

from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score

from utils.data_loader import load_data

# Setup logging
logger = logging.getLogger(__name__)

class ForecastCache:
    """Simple in-memory cache for forecast models and results"""
    
    def __init__(self, max_age_hours: int = 24):
        self.cache = {}
        self.max_age_hours = max_age_hours
    
    def _generate_key(self, data_hash: str, forecast_type: str, days: int) -> str:
        """Generate cache key based on data hash and parameters"""
        return f"{forecast_type}_{days}_{data_hash}"
    
    def _is_expired(self, timestamp: datetime) -> bool:
        """Check if cache entry is expired"""
        return datetime.now() - timestamp > timedelta(hours=self.max_age_hours)
    
    def get(self, data_hash: str, forecast_type: str, days: int) -> Optional[Dict]:
        """Get cached forecast result"""
        key = self._generate_key(data_hash, forecast_type, days)
        entry = self.cache.get(key)
        
        if entry and not self._is_expired(entry['timestamp']):
            logger.info(f"Cache hit for {key}")
            return entry['data']
        
        if entry:
            # Remove expired entry
            del self.cache[key]
        
        return None
    
    def set(self, data_hash: str, forecast_type: str, days: int, data: Dict):
        """Cache forecast result"""
        key = self._generate_key(data_hash, forecast_type, days)
        self.cache[key] = {
            'data': data,
            'timestamp': datetime.now()
        }
        logger.info(f"Cached forecast result for {key}")

# Global cache instance
forecast_cache = ForecastCache()

def get_data_hash(df: pd.DataFrame) -> str:
    """Generate hash of dataframe for caching"""
    data_str = df.to_string()
    return hashlib.md5(data_str.encode()).hexdigest()

def preprocess_data_for_forecast(df: pd.DataFrame, target_column: str) -> pd.DataFrame:
    """
    Preprocess data for forecasting
    
    Args:
        df: Input dataframe
        target_column: Column to forecast (e.g., 'Revenue_INR', 'Occupancy_Rate')
    
    Returns:
        Preprocessed dataframe with date and target columns
    """
    try:
        # Make a copy to avoid modifying original data
        data = df.copy()
        
        # Ensure Date column is datetime
        if not pd.api.types.is_datetime64_any_dtype(data['Date']):
            data['Date'] = pd.to_datetime(data['Date'])
        
        # Aggregate by date (sum for revenue, mean for occupancy)
        if target_column == 'Revenue_INR':
            daily_data = data.groupby('Date')[target_column].sum().reset_index()
        else:
            daily_data = data.groupby('Date')[target_column].mean().reset_index()
        
        # Sort by date
        daily_data = daily_data.sort_values('Date')
        
        # Handle missing values
        daily_data[target_column] = daily_data[target_column].fillna(daily_data[target_column].median())
        
        # Remove any remaining NaN values
        daily_data = daily_data.dropna()
        
        # Ensure we have enough data points (minimum 30 days)
        if len(daily_data) < 30:
            raise ValueError(f"Insufficient data points: {len(daily_data)}. Need at least 30 days of data.")
        
        logger.info(f"Preprocessed data: {len(daily_data)} daily records for {target_column}")
        return daily_data
        
    except Exception as e:
        logger.error(f"Error preprocessing data for {target_column}: {str(e)}")
        raise ValueError(f"Data preprocessing failed: {str(e)}")

def train_prophet_model(data: pd.DataFrame, target_column: str) -> Tuple[Prophet, Dict[str, float]]:
    """
    Train Facebook Prophet model
    
    Args:
        data: Preprocessed daily data with Date and target columns
        target_column: Target column name
    
    Returns:
        Tuple of (trained_model, metrics)
    """
    try:
        # Prepare data for Prophet (requires 'ds' and 'y' columns)
        prophet_data = pd.DataFrame({
            'ds': data['Date'],
            'y': data[target_column]
        })
        
        # Initialize Prophet model with reasonable parameters
        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True,
            seasonality_mode='multiplicative',
            interval_width=0.95,
            changepoint_prior_scale=0.05
        )
        
        # Train the model
        logger.info(f"Training Prophet model for {target_column}")
        model.fit(prophet_data)
        
        # Calculate model metrics on training data
        forecast = model.predict(prophet_data)
        mae = mean_absolute_error(prophet_data['y'], forecast['yhat'])
        r2 = r2_score(prophet_data['y'], forecast['yhat'])
        
        metrics = {
            'mae': float(mae),
            'r2': float(r2),
            'model_type': 'Prophet'
        }
        
        logger.info(f"Prophet model trained - MAE: {mae:.2f}, R²: {r2:.3f}")
        return model, metrics
        
    except Exception as e:
        logger.error(f"Error training Prophet model: {str(e)}")
        raise

def train_linear_regression_model(data: pd.DataFrame, target_column: str) -> Tuple[LinearRegression, StandardScaler, Dict[str, float]]:
    """
    Train Linear Regression model as fallback
    
    Args:
        data: Preprocessed daily data
        target_column: Target column name
    
    Returns:
        Tuple of (trained_model, scaler, metrics)
    """
    try:
        # Create features from date
        data_lr = data.copy()
        data_lr['day_of_year'] = data_lr['Date'].dt.dayofyear
        data_lr['day_of_week'] = data_lr['Date'].dt.dayofweek
        data_lr['month'] = data_lr['Date'].dt.month
        data_lr['year'] = data_lr['Date'].dt.year
        
        # Create trend feature (days since start)
        min_date = data_lr['Date'].min()
        data_lr['days_since_start'] = (data_lr['Date'] - min_date).dt.days
        
        # Feature columns
        feature_columns = ['days_since_start', 'day_of_year', 'day_of_week', 'month', 'year']
        X = data_lr[feature_columns]
        y = data_lr[target_column]
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        model = LinearRegression()
        model.fit(X_scaled, y)
        
        # Calculate metrics
        predictions = model.predict(X_scaled)
        mae = mean_absolute_error(y, predictions)
        r2 = r2_score(y, predictions)
        
        metrics = {
            'mae': float(mae),
            'r2': float(r2),
            'model_type': 'Linear Regression'
        }
        
        logger.info(f"Linear Regression model trained - MAE: {mae:.2f}, R²: {r2:.3f}")
        return model, scaler, metrics
        
    except Exception as e:
        logger.error(f"Error training Linear Regression model: {str(e)}")
        raise

def generate_forecast_prophet(model: Prophet, last_date: datetime, 
                            days_ahead: int = 30) -> List[Dict[str, Any]]:
    """Generate forecast using Prophet model"""
    try:
        # Create future dates
        future_dates = pd.date_range(
            start=last_date + timedelta(days=1),
            periods=days_ahead,
            freq='D'
        )
        
        future_df = pd.DataFrame({'ds': future_dates})
        
        # Generate forecast
        forecast = model.predict(future_df)
        
        # Format results
        results = []
        for _, row in forecast.iterrows():
            results.append({
                'date': row['ds'].strftime('%Y-%m-%d'),
                'predicted_value': float(max(0, row['yhat'])),  # Ensure non-negative
                'lower_bound': float(max(0, row['yhat_lower'])),
                'upper_bound': float(row['yhat_upper'])
            })
        
        return results
        
    except Exception as e:
        logger.error(f"Error generating Prophet forecast: {str(e)}")
        raise

def generate_forecast_linear_regression(model: LinearRegression, scaler: StandardScaler,
                                      last_date: datetime, last_year: int,
                                      days_ahead: int = 30) -> List[Dict[str, Any]]:
    """Generate forecast using Linear Regression model"""
    try:
        # Create future dates
        future_dates = pd.date_range(
            start=last_date + timedelta(days=1),
            periods=days_ahead,
            freq='D'
        )
        
        # Calculate days since start (assuming data started from a reference point)
        base_days = (last_date - pd.Timestamp(f'{last_year-1}-01-01')).days
        
        # Create features for future dates
        future_features = []
        for i, future_date in enumerate(future_dates):
            features = [
                base_days + i + 1,  # days_since_start
                future_date.dayofyear,  # day_of_year
                future_date.dayofweek,  # day_of_week
                future_date.month,  # month
                future_date.year  # year
            ]
            future_features.append(features)
        
        future_X = np.array(future_features)
        future_X_scaled = scaler.transform(future_X)
        
        # Generate predictions
        predictions = model.predict(future_X_scaled)
        
        # Format results
        results = []
        for i, (future_date, pred) in enumerate(zip(future_dates, predictions)):
            results.append({
                'date': future_date.strftime('%Y-%m-%d'),
                'predicted_value': float(max(0, pred)),  # Ensure non-negative
                'lower_bound': float(max(0, pred * 0.9)),  # Simple confidence interval
                'upper_bound': float(pred * 1.1)
            })
        
        return results
        
    except Exception as e:
        logger.error(f"Error generating Linear Regression forecast: {str(e)}")
        raise

def generate_forecast(target_column: str, days_ahead: int = 30, 
                     use_cache: bool = True) -> Dict[str, Any]:
    """
    Main function to generate forecast for either revenue or occupancy
    
    Args:
        target_column: 'Revenue_INR' or 'Occupancy_Rate'
        days_ahead: Number of days to forecast
        use_cache: Whether to use cached results
    
    Returns:
        Dictionary with forecast results and metadata
    """
    try:
        # Load and preprocess data
        raw_data = load_data()
        data_hash = get_data_hash(raw_data)
        
        # Check cache first
        if use_cache:
            cached_result = forecast_cache.get(data_hash, target_column, days_ahead)
            if cached_result:
                return cached_result
        
        # Preprocess data
        processed_data = preprocess_data_for_forecast(raw_data, target_column)
        
        if len(processed_data) == 0:
            raise ValueError("No data available for forecasting")
        
        last_date = processed_data['Date'].max()
        last_year = last_date.year
        
        # Choose and train model base
        forecast_results = None
        model_metrics = None
        
        if PROPHET_AVAILABLE:
            try:
                # Try Prophet first
                model, metrics = train_prophet_model(processed_data, target_column)
                forecast_results = generate_forecast_prophet(model, last_date, days_ahead)
                model_metrics = metrics
                logger.info(f"Successfully generated Prophet forecast for {target_column}")
                
            except Exception as prophet_error:
                logger.warning(f"Prophet failed: {prophet_error}. Falling back to Linear Regression")
                # Fall back to Linear Regression
                model, scaler, metrics = train_linear_regression_model(processed_data, target_column)
                forecast_results = generate_forecast_linear_regression(
                    model, scaler, last_date, last_year, days_ahead
                )
                model_metrics = metrics
        else:
            # Use Linear Regression directly
            model, scaler, metrics = train_linear_regression_model(processed_data, target_column)
            forecast_results = generate_forecast_linear_regression(
                model, scaler, last_date, last_year, days_ahead
            )
            model_metrics = metrics
        
        # Prepare final result
        result = {
            'forecast': forecast_results,
            'metadata': {
                'target_column': target_column,
                'model_metrics': model_metrics,
                'training_data_points': len(processed_data),
                'forecast_period_days': days_ahead,
                'last_historical_date': last_date.strftime('%Y-%m-%d'),
                'forecast_start_date': forecast_results[0]['date'] if forecast_results else None,
                'forecast_end_date': forecast_results[-1]['date'] if forecast_results else None,
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
        }
        
        # Cache the result
        if use_cache:
            forecast_cache.set(data_hash, target_column, days_ahead, result)
        
        logger.info(f"Successfully generated {days_ahead}-day forecast for {target_column}")
        return result
        
    except Exception as e:
        logger.error(f"Error generating forecast for {target_column}: {str(e)}")
        raise ValueError(f"Forecast generation failed: {str(e)}")

def get_revenue_forecast(days_ahead: int = 30) -> Dict[str, Any]:
    """Generate revenue forecast"""
    return generate_forecast('Revenue_INR', days_ahead)

def get_occupancy_forecast(days_ahead: int = 30) -> Dict[str, Any]:
    """Generate occupancy forecast"""
    return generate_forecast('Occupancy_Rate', days_ahead)

def validate_forecast_parameters(days_ahead: Optional[int]) -> int:
    """Validate and normalize forecast parameters"""
    if days_ahead is None:
        return 30
    
    if not isinstance(days_ahead, int) or days_ahead < 1:
        raise ValueError("days_ahead must be a positive integer")
    
    if days_ahead > 365:
        raise ValueError("days_ahead cannot exceed 365 days")
    
    return days_ahead

def clear_forecast_cache():
    """Clear all cached forecasts (for testing or manual refresh)"""
    global forecast_cache
    forecast_cache.cache.clear()
    logger.info("Forecast cache cleared")

# For debugging and monitoring
def get_cache_status() -> Dict[str, Any]:
    """Get current cache status"""
    return {
        'cached_entries': len(forecast_cache.cache),
        'cache_keys': list(forecast_cache.cache.keys()),
        'max_age_hours': forecast_cache.max_age_hours
    }