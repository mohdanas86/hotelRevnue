#!/usr/bin/env python3
"""
Test script for the enhanced filtering functionality
"""

import requests
import json
from datetime import datetime, date, timedelta

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, params=None, description=""):
    """Test an API endpoint with optional parameters"""
    url = f"{BASE_URL}{endpoint}"
    try:
        response = requests.get(url, params=params)
        
        print(f"\n{'='*60}")
        print(f"Testing: {description or endpoint}")
        print(f"URL: {url}")
        if params:
            print(f"Parameters: {json.dumps(params, indent=2)}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict) and 'data' in data:
                print(f"Records returned: {len(data['data'])}")
                print(f"Filters applied: {data.get('filters_applied', 'None')}")
                if 'metadata' in data:
                    print(f"Total records after filtering: {data['metadata'].get('total_records', 0)}")
                    print(f"Date range: {data['metadata'].get('date_range', 'N/A')}")
            else:
                print(f"Response: {json.dumps(data, indent=2)[:500]}...")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error testing {endpoint}: {str(e)}")

def main():
    """Run comprehensive tests"""
    print("🚀 Testing Enhanced Hotel Revenue API with Dynamic Filtering")
    print("=" * 60)
    
    # Test 1: Health check
    test_endpoint("/", description="Health Check")
    
    # Test 2: Available filters
    test_endpoint("/api/filters/available", description="Available Filter Options")
    
    # Test 3: Basic KPI without filters
    test_endpoint("/api/kpi", description="KPI - No Filters")
    
    # Test 4: KPI with hotel filter
    test_endpoint("/api/kpi", 
                 params={"hotel_id": "H001,H002"}, 
                 description="KPI - Hotel Filter")
    
    # Test 5: Revenue trend with date filter
    today = date.today()
    last_month = today - timedelta(days=30)
    test_endpoint("/api/revenue-trend", 
                 params={
                     "start_date": last_month.strftime("%Y-%m-%d"),
                     "end_date": today.strftime("%Y-%m-%d")
                 }, 
                 description="Revenue Trend - Date Range")
    
    # Test 6: Revenue by hotel with multiple filters
    test_endpoint("/api/revenue-by-hotel", 
                 params={
                     "booking_channel": "OTA",
                     "market_segment": "Corporate"
                 }, 
                 description="Revenue by Hotel - Channel & Segment Filter")
    
    # Test 7: Revenue by channel with hotel filter
    test_endpoint("/api/revenue-by-channel", 
                 params={"hotel_id": "H001"}, 
                 description="Revenue by Channel - Hotel Filter")
    
    # Test 8: Filter validation
    test_endpoint("/api/filters/validate", 
                 params={
                     "hotel_id": "H001,H999",
                     "booking_channel": "Website,OTA"
                 }, 
                 description="Filter Validation")
    
    # Test 9: Scatter data with complex filters
    test_endpoint("/api/scatter", 
                 params={
                     "hotel_id": "H001,H002,H003",
                     "booking_channel": "Website",
                     "market_segment": "Corporate"
                 }, 
                 description="Scatter Data - Complex Filters")
    
    # Test 10: Market segment with date and hotel filters
    test_endpoint("/api/market-segment", 
                 params={
                     "hotel_id": "H001",
                     "start_date": "2023-01-01",
                     "end_date": "2023-12-31"
                 }, 
                 description="Market Segment - Date & Hotel Filter")
    
    print("\n" + "="*60)
    print("✅ Filter Testing Complete!")
    print("="*60)

if __name__ == "__main__":
    main()