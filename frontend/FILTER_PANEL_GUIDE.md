# 🎛️ Hotel Revenue Dashboard Filter Panel

A comprehensive filter panel component for filtering hotel revenue data with date range, hotel, booking channel, and market segment filters.

## 🚀 Features

✅ **Date Range Picker** - Start and end date selection with quick presets  
✅ **Hotel Dropdown** - Filter by specific hotels  
✅ **Booking Channel Filter** - Filter by booking channels (OTA, Direct, etc.)  
✅ **Market Segment Filter** - Filter by market segments (Corporate, Leisure, etc.)  
✅ **Loading States** - Visual feedback during API calls  
✅ **Error Handling** - Graceful error display  
✅ **Responsive Design** - Mobile-friendly with compact mode  
✅ **Real-time Updates** - Changes update dashboard immediately  
✅ **Query Parameters** - Generates proper API query strings  

## 📁 Files Created

### Frontend Components
- **`components/FilterPanel.tsx`** - Main filter panel component
- **`hooks/use-filtered-api.ts`** - Custom hooks for filtered API calls
- **`hooks/use-intersection-observer.ts`** - Intersection observer hook
- **`components/DashboardWithFilters.tsx`** - Example integration

### Dashboard Integration
- **`app/dashboard/page-with-filters.tsx`** - Updated dashboard with filters

## 🎮 Quick Start

### 1. Basic Usage

```tsx
import { FilterPanel, type FilterState } from '@/components/FilterPanel';
import { useFilteredDashboardData } from '@/hooks/use-filtered-api';

function Dashboard() {
  const {
    kpi,
    revenueTrend,
    filterMetadata,
    loading,
    currentFilters,
    applyFilters,
  } = useFilteredDashboardData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filter Panel */}
      <div className="lg:col-span-1">
        <FilterPanel
          onFiltersChange={applyFilters}
          loading={loading}
          hotels={filterMetadata.hotels}
          bookingChannels={filterMetadata.bookingChannels}
          marketSegments={filterMetadata.marketSegments}
          filters={currentFilters}
        />
      </div>
      
      {/* Dashboard Content */}
      <div className="lg:col-span-3">
        {/* Your charts and KPIs */}
      </div>
    </div>
  );
}
```

### 2. API Integration

The filter panel automatically generates API calls with query parameters:

```
GET /api/kpi?start_date=2024-01-01&end_date=2024-01-31&hotel_id=H101
GET /api/revenue-trend?booking_channel=OTA&market_segment=Corporate  
GET /api/revenue-by-hotel?start_date=2024-01-01
```

### 3. Filter State

```tsx
interface FilterState {
  startDate?: string;     // YYYY-MM-DD format
  endDate?: string;       // YYYY-MM-DD format  
  hotelId?: string;       // Hotel identifier
  bookingChannel?: string; // Channel name
  marketSegment?: string;  // Segment name
}
```

## 🎨 UI Components

### Filter Panel Props

```tsx
interface FilterPanelProps {
  onFiltersChange: (filters: FilterState) => void;
  loading?: boolean;
  className?: string;
  
  // Filter options (populated from API)
  hotels?: FilterOption[];
  bookingChannels?: FilterOption[];
  marketSegments?: FilterOption[];
  
  // Current state
  filters?: FilterState;
  isCompact?: boolean; // Mobile mode
}
```

### Filter Options

```tsx
interface FilterOption {
  value: string;   // Actual value for API
  label: string;   // Display name
  count?: number;  // Optional record count
}
```

## 📱 Responsive Design

### Desktop Mode
- Full-width filter panel with detailed controls
- Quick filter presets (Last 7 days, Last 30 days, This month)
- Active filter summary with individual remove buttons

### Mobile Mode (Compact)
- Collapsed filter controls
- Smaller inputs and dropdowns
- Simplified interface

### Auto-Detection
```tsx
<FilterPanel
  // ... other props
  isCompact={useIsMobile()} // Automatically detected
/>
```

## ⚡ Performance Features

### Intelligent Caching
- API responses are cached to avoid duplicate requests
- Cache invalidation when filters change

### Debounced Updates
- Filter changes are debounced to prevent excessive API calls
- Loading states during filter application

### Lazy Loading
- Filter metadata loaded on demand
- Progressive enhancement

## 🔧 Advanced Configuration

### Custom API Endpoints

```tsx
// Override default API endpoints
const customConfig = {
  baseUrl: 'https://api.myhotel.com',  
  endpoints: {
    kpi: '/analytics/kpi',
    revenueTrend: '/analytics/revenue-trend',
  }
};
```

### Error Handling

```tsx
const { errors } = useFilteredDashboardData();

// Display errors
{errors.length > 0 && (
  <div className="alert alert-error">
    {errors.map(error => (
      <p key={error.message}>{error.message}</p>
    ))}
  </div>
)}
```

### Loading States

```tsx
const { loading } = useFilteredDashboardData();

// Show loading spinner
{loading && <Spinner />}
```

## 🎯 Integration Examples

### Example 1: Simple Dashboard

```tsx
export function SimpleDashboard() {
  const {
    kpi,
    loading,
    applyFilters,
    filterMetadata,
    currentFilters
  } = useFilteredDashboardData();

  return (
    <div className="dashboard">
      <FilterPanel
        onFiltersChange={applyFilters}
        loading={loading}
        hotels={filterMetadata.hotels}
        bookingChannels={filterMetadata.bookingChannels}
        marketSegments={filterMetadata.marketSegments}
        filters={currentFilters}
      />
      
      <KPIGrid data={kpi} loading={loading} />
    </div>
  );
}
```

### Example 2: Modal Filter

```tsx
export function DashboardWithModal() {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setShowFilters(true)}>
        Filter Data
      </Button>
      
      {showFilters && (
        <Modal onClose={() => setShowFilters(false)}>
          <FilterPanel
            onFiltersChange={(filters) => {
              applyFilters(filters);
              setShowFilters(false);
            }}
            // ... props
          />
        </Modal>
      )}
    </div>
  );
}
```

### Example 3: Sidebar Filter

```tsx
export function DashboardWithSidebar() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <FilterPanel
          onFiltersChange={applyFilters}
          className="border-0 shadow-none"
          // ... props
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Dashboard components */}
      </div>
    </div>
  );
}
```

## 🔄 State Management

### Filter State Hook

```tsx
const {
  // Data
  kpi,
  revenueTrend,
  revenueByHotel,
  revenueByChannel,
  marketSegment,
  
  // Metadata
  filterMetadata,
  
  // State
  loading,
  errors,
  currentFilters,
  
  // Actions
  applyFilters,
  refreshAll
} = useFilteredDashboardData(initialFilters);
```

### Manual Filter Application

```tsx
const handleCustomFilter = () => {
  const filters: FilterState = {
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    hotelId: 'H101'
  };
  
  applyFilters(filters);
};
```

## 🎭 Customization

### Custom Styling

```tsx
<FilterPanel
  className="bg-blue-50 border-blue-200"
  onFiltersChange={applyFilters}
  // ... props
/>
```

### Custom Quick Presets

```tsx
// Add to FilterPanel component
<Button onClick={() => {
  setLocalFilters({
    startDate: '2024-01-01',
    endDate: '2024-03-31',
  });
}}>
  Q1 2024
</Button>
```

## 🚀 Next Steps

1. **Add the FilterPanel** to your existing dashboard
2. **Test the API integration** with your backend
3. **Customize the styling** to match your design system
4. **Add more filter options** as needed
5. **Implement saved filters** for user convenience

## 📞 Support

The filter panel is designed to work seamlessly with your existing FastAPI backend that already supports query parameters. All the required hooks and components are ready to use!

---

**Ready to enhance your Hotel Revenue Dashboard with powerful filtering capabilities! 🎯**