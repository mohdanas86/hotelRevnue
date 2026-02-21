# 🎯 Enhanced Hotel Revenue Analytics API - Dynamic Filtering

## Overview

The FastAPI hotel revenue analytics has been enhanced with powerful dynamic filtering capabilities. All endpoints now support optional query parameters to filter data by hotel, date range, booking channel, and market segment.

## 🚀 Key Features

### ✅ Dynamic Filtering Support
- **Hotel ID**: Filter by specific hotels (comma-separated for multiple)
- **Date Range**: Filter by start_date and end_date (YYYY-MM-DD format)
- **Booking Channel**: Filter by booking channels (Website, OTA, Walk-in, etc.)
- **Market Segment**: Filter by market segments (Corporate, Leisure, etc.)

### ✅ Enhanced Response Format
All filtered endpoints now return:
```json
{
    "data": [...],           // Actual filtered data
    "filters_applied": {...}, // Summary of applied filters  
    "metadata": {            // Metadata about filtering results
        "total_records": 150,
        "original_records": 1000,
        "date_range": {
            "start": "2023-01-01", 
            "end": "2023-12-31"
        },
        "hotels": ["H001", "H002"],
        "channels": ["Website", "OTA"], 
        "segments": ["Corporate", "Leisure"]
    }
}
```

### ✅ Backward Compatibility
- Original endpoints maintain current behavior when no filters are provided
- Legacy endpoints available at `/api/legacy/*` paths
- Existing frontend code continues to work unchanged

## 📊 Available Endpoints

### Core Analytics (with filtering support)

#### 1. Key Performance Indicators
```
GET /api/kpi?hotel_id=H001,H002&start_date=2023-01-01&end_date=2023-12-31
```

#### 2. Revenue Trend Over Time
```  
GET /api/revenue-trend?booking_channel=Website&market_segment=Corporate
```

#### 3. Occupancy Trend Over Time
```
GET /api/occupancy-trend?hotel_id=H001&start_date=2023-06-01
```

#### 4. Revenue by Hotel
```
GET /api/revenue-by-hotel?booking_channel=OTA,Website&start_date=2023-01-01
```

#### 5. Revenue by Booking Channel
```
GET /api/revenue-by-channel?hotel_id=H001&market_segment=Corporate
```

#### 6. Market Segment Analysis
```
GET /api/market-segment?hotel_id=H001,H002&booking_channel=Website
```

#### 7. ADR vs Occupancy Scatter Data
```
GET /api/scatter?start_date=2023-01-01&end_date=2023-12-31
```

#### 8. Cancellations by Channel
```
GET /api/cancellations-by-channel?hotel_id=H001&start_date=2023-01-01
```

### Filter Discovery Endpoints

#### Get Available Filter Values
```
GET /api/filters/available
```
Returns all possible values for hotels, channels, segments, and date ranges.

#### Validate Filter Parameters
```
GET /api/filters/validate?hotel_id=H001,H002&booking_channel=Website
```
Validates filters and returns expected record count.

### Legacy Endpoints (backward compatibility)
```
GET /api/legacy/kpi
GET /api/legacy/revenue-trend  
GET /api/legacy/revenue-by-hotel
GET /api/legacy/revenue-by-channel
```

## 🛠️ Usage Examples

### Example 1: Corporate bookings for specific hotels in Q1
```bash
curl "http://localhost:8000/api/revenue-trend?hotel_id=H001,H002&market_segment=Corporate&start_date=2023-01-01&end_date=2023-03-31"
```

### Example 2: Website bookings performance across all hotels
```bash
curl "http://localhost:8000/api/revenue-by-hotel?booking_channel=Website"
```

### Example 3: Get available filter options
```bash
curl "http://localhost:8000/api/filters/available"
```

### Example 4: Multi-dimensional filtering
```bash
curl "http://localhost:8000/api/kpi?hotel_id=H001&booking_channel=OTA,Website&market_segment=Corporate&start_date=2023-01-01&end_date=2023-12-31"
```

## 🔧 Implementation Details

### Filter Parameters
- **hotel_id**: String (comma-separated for multiple: "H001,H002,H003")
- **start_date**: Date in YYYY-MM-DD format
- **end_date**: Date in YYYY-MM-DD format  
- **booking_channel**: String (comma-separated: "Website,OTA,Walk-in")
- **market_segment**: String (comma-separated: "Corporate,Leisure,Group")

### Validation
- Dates must be in YYYY-MM-DD format
- end_date must be after start_date
- Invalid filter values return 400 error with details
- Empty results return valid response with empty data array

### Performance
- Filtering uses optimized pandas operations
- Data is cached for performance
- Results include metadata for debugging and UI display

### Error Handling
- 400 for invalid filter parameters
- 500 for internal server errors
- Detailed error messages for debugging

## 🚀 Testing

Run the included test script:
```bash
cd backend
python test_filters.py
```

This tests all filtering combinations and validates responses.

## 📈 Migration Guide

### For Frontend Developers

#### Option 1: Use New Enhanced Endpoints
Update your API calls to handle the new response format:
```javascript
// Old way
const data = await fetch('/api/kpi').then(r => r.json());

// New way with filtering
const response = await fetch('/api/kpi?hotel_id=H001&start_date=2023-01-01').then(r => r.json());
const data = response.data;
const metadata = response.metadata;
```

#### Option 2: Use Legacy Endpoints (No Changes Required)
```javascript
// Continue using legacy endpoints - no code changes needed
const data = await fetch('/api/legacy/kpi').then(r => r.json());
```

### Gradual Migration Strategy
1. Keep existing frontend code using legacy endpoints
2. Gradually migrate components to new filtered endpoints
3. Eventually deprecate legacy endpoints

## 🎉 Benefits

- **🎯 Precise Analytics**: Filter data by any combination of dimensions
- **⚡ Better Performance**: Only load and process needed data  
- **📊 Enhanced Insights**: Drill down into specific segments/periods
- **🔄 Backward Compatible**: Existing systems continue to work
- **🛡️ Robust**: Comprehensive validation and error handling
- **📱 Frontend Friendly**: Rich metadata for building filtered UIs