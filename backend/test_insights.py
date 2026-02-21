#!/usr/bin/env python3
"""
Test script for the insights API endpoint
"""

import requests
import json

def test_insights_endpoint():
    """Test the insights API endpoint"""
    try:
        print("🧪 Testing Insights API Endpoint")
        print("=" * 50)
        
        # Test insights endpoint
        response = requests.get('http://localhost:8000/api/insights')
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"✅ Total Insights: {data['total_insights']}")
            print(f"📊 Data Period: {data.get('data_period', 'N/A')}")
            print(f"🕐 Generated At: {data['generated_at']}")
            print("\n📋 Business Insights:")
            print("=" * 50)
            
            for i, insight in enumerate(data['insights'], 1):
                print(f"{i:2d}. {insight}")
                
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Is the server running on http://localhost:8000?")
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")

if __name__ == "__main__":
    test_insights_endpoint()