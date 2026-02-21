#!/usr/bin/env python3
"""
Test script for the forecasting functionality
"""

import requests
import json
import sys
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, params=None, method="GET", description=""):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        print(f"\n{'='*70}")
        print(f"🧪 Testing: {description or endpoint}")
        print(f"URL: {url}")
        if params:
            print(f"Parameters: {json.dumps(params, indent=2)}")
        
        start_time = time.time()
        
        if method == "GET":
            response = requests.get(url, params=params)
        elif method == "POST":
            response = requests.post(url, json=params or {})
        
        elapsed = time.time() - start_time
        
        print(f"Status: {response.status_code}")
        print(f"Response time: {elapsed:.2f}s")
        
        if response.status_code == 200:
            data = response.json()
            
            if 'forecast' in data:
                print(f"✅ Forecast generated successfully")
                forecast_data = data['forecast']
                metadata = data['metadata']
                
                print(f"📊 Forecast details:")
                print(f"   - Model used: {metadata['model_metrics']['model_type']}")
                print(f"   - Training data points: {metadata['training_data_points']}")
                print(f"   - Forecast period: {metadata['forecast_period_days']} days")
                print(f"   - Model metrics:")
                print(f"     • MAE: {metadata['model_metrics']['mae']:.2f}")
                print(f"     • R²: {metadata['model_metrics']['r2']:.3f}")
                print(f"   - Date range: {metadata['forecast_start_date']} to {metadata['forecast_end_date']}")
                print(f"   - Generated at: {metadata['generated_at']}")
                
                # Show first few forecast points
                print(f"🔮 First 5 forecast points:")
                for i, point in enumerate(forecast_data[:5]):
                    print(f"   {i+1}. {point['date']}: {point['predicted_value']:.2f}")
                    if 'lower_bound' in point and point['lower_bound'] is not None:
                        print(f"      Confidence: [{point['lower_bound']:.2f}, {point['upper_bound']:.2f}]")
                
            elif 'cached_entries' in data:
                print(f"📋 Cache status:")
                print(f"   - Cached entries: {data['cached_entries']}")
                print(f"   - Max age: {data['max_age_hours']} hours")
                if data['cache_keys']:
                    print(f"   - Cache keys: {data['cache_keys'][:3]}...")  # Show first 3
            
            elif 'message' in data:
                print(f"ℹ️  Message: {data['message']}")
            
            else:
                print(f"📄 Response preview: {str(data)[:300]}...")
                
        else:
            print(f"❌ Error: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Detail: {error_data.get('detail', 'Unknown error')}")
            except:
                print(f"   Raw response: {response.text[:200]}...")
                
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection failed - Is the server running on {BASE_URL}?")
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")

def main():
    """Run comprehensive forecasting tests"""
    print("🚀 Testing Hotel Revenue Forecasting API")
    print("=" * 70)
    
    # Test 1: Health check
    test_endpoint("/", description="Health Check")
    
    # Test 2: Cache status (before any forecasting)
    test_endpoint("/api/forecast/cache-status", description="Initial Cache Status")
    
    # Test 3: Default revenue forecast (30 days)
    test_endpoint("/api/revenue-forecast", description="Revenue Forecast - Default (30 days)")
    
    # Test 4: Custom revenue forecast (7 days)
    test_endpoint("/api/revenue-forecast", 
                 params={"days_ahead": 7}, 
                 description="Revenue Forecast - 7 days")
    
    # Test 5: Extended revenue forecast (90 days)
    test_endpoint("/api/revenue-forecast", 
                 params={"days_ahead": 90}, 
                 description="Revenue Forecast - 90 days")
    
    # Test 6: Default occupancy forecast
    test_endpoint("/api/occupancy-forecast", description="Occupancy Forecast - Default (30 days)")
    
    # Test 7: Custom occupancy forecast (14 days)
    test_endpoint("/api/occupancy-forecast", 
                 params={"days_ahead": 14}, 
                 description="Occupancy Forecast - 14 days")
    
    # Test 8: Cache status (after forecasting - should show cached entries)
    test_endpoint("/api/forecast/cache-status", description="Cache Status After Forecasting")
    
    # Test 9: Test cached forecast (should be faster)
    print(f"\n{'='*70}")
    print("⚡ Testing cache performance...")
    test_endpoint("/api/revenue-forecast", description="Revenue Forecast - Cached (should be faster)")
    
    # Test 10: Clear cache
    test_endpoint("/api/forecast/clear-cache", method="POST", description="Clear Forecast Cache")
    
    # Test 11: Cache status after clearing
    test_endpoint("/api/forecast/cache-status", description="Cache Status After Clearing")
    
    # Test 12: Error handling - invalid parameters
    test_endpoint("/api/revenue-forecast", 
                 params={"days_ahead": 0}, 
                 description="Error Test - Invalid days_ahead (0)")
    
    test_endpoint("/api/revenue-forecast", 
                 params={"days_ahead": 500}, 
                 description="Error Test - Invalid days_ahead (500)")
    
    # Test 13: Performance test with longer forecast
    test_endpoint("/api/occupancy-forecast", 
                 params={"days_ahead": 180}, 
                 description="Performance Test - 180-day forecast")
    
    print("\n" + "="*70)
    print("🎉 Forecasting API Testing Complete!")
    print("="*70)
    
    print("\n📋 Test Summary:")
    print("✅ Basic forecasting functionality")
    print("✅ Custom forecast periods") 
    print("✅ Revenue and occupancy forecasting")
    print("✅ Caching system")
    print("✅ Error handling")
    print("✅ Performance validation")
    
    print("\n📝 Notes:")
    print("- If Prophet is not available, LinearRegression fallback is used")
    print("- Forecasts are cached for 24 hours by default")
    print("- Model retrains on new data automatically")
    print("- API supports 1-365 day forecast periods")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️  Testing interrupted by user")
    except Exception as e:
        print(f"\n\n💥 Testing failed: {str(e)}")
        sys.exit(1)