"""
Business Insights Service for Hotel Revenue Data
Generates automated insights using pandas aggregation and statistical analysis
"""

import pandas as pd
import numpy as np
import logging
from datetime import datetime
from typing import List, Dict, Any
from utils.data_loader import load_data

logger = logging.getLogger(__name__)

class InsightService:
    """Service for generating automated business insights"""
    
    def __init__(self):
        self.data = None
        self._load_data()
    
    def _load_data(self):
        """Load and cache hotel data"""
        try:
            self.data = load_data()
            logger.info(f"Loaded {len(self.data)} records for insights analysis")
        except Exception as e:
            logger.error(f"Error loading data for insights: {str(e)}")
            raise
    
    def generate_all_insights(self) -> List[str]:
        """Generate comprehensive business insights"""
        insights = []
        
        try:
            # 1. Booking channel with highest cancellation rate
            insights.extend(self._analyze_cancellation_rates())
            
            # 2. Market segment revenue contribution
            insights.extend(self._analyze_market_segments())
            
            # 3. Monthly revenue patterns
            insights.extend(self._analyze_monthly_revenue())
            
            # 4. Channel ADR analysis
            insights.extend(self._analyze_channel_adr())
            
            # 5. Revenue growth analysis
            insights.extend(self._analyze_revenue_growth())
            
            # 6. Occupancy performance insights
            insights.extend(self._analyze_occupancy_performance())
            
            # 7. RevPAR insights
            insights.extend(self._analyze_revpar_performance())
            
            # 8. Seasonal trends
            insights.extend(self._analyze_seasonal_trends())
            
            logger.info(f"Generated {len(insights)} business insights")
            return insights
            
        except Exception as e:
            logger.error(f"Error generating insights: {str(e)}")
            return [f"Unable to generate insights: {str(e)}"]
    
    def _analyze_cancellation_rates(self) -> List[str]:
        """Analyze cancellation rates by booking channel"""
        insights = []
        
        try:
            # Calculate total bookings and cancellations by channel
            channel_stats = self.data.groupby('Booking_Channel').agg({
                'Rooms_Sold': 'sum',
                'Cancellation_Count': 'sum'
            }).reset_index()
            
            # Calculate cancellation rates
            channel_stats['total_bookings'] = channel_stats['Rooms_Sold'] + channel_stats['Cancellation_Count']
            channel_stats['cancellation_rate'] = (
                channel_stats['Cancellation_Count'] / channel_stats['total_bookings'] * 100
            ).round(2)
            
            # Find highest and lowest cancellation rates
            highest_cancel = channel_stats.loc[channel_stats['cancellation_rate'].idxmax()]
            lowest_cancel = channel_stats.loc[channel_stats['cancellation_rate'].idxmin()]
            
            insights.append(
                f"{highest_cancel['Booking_Channel']} bookings have the highest cancellation rate at "
                f"{highest_cancel['cancellation_rate']:.1f}%, compared to {lowest_cancel['Booking_Channel']} "
                f"at {lowest_cancel['cancellation_rate']:.1f}%."
            )
            
            # Compare top channels
            if len(channel_stats) >= 2:
                sorted_channels = channel_stats.sort_values('cancellation_rate', ascending=False)
                top_channel = sorted_channels.iloc[0]
                second_channel = sorted_channels.iloc[1]
                
                rate_diff = top_channel['cancellation_rate'] - second_channel['cancellation_rate']
                if rate_diff > 1:
                    insights.append(
                        f"{top_channel['Booking_Channel']} generates {rate_diff:.1f} percentage points "
                        f"more cancellations than {second_channel['Booking_Channel']}."
                    )
            
        except Exception as e:
            logger.error(f"Error analyzing cancellation rates: {str(e)}")
            
        return insights
    
    def _analyze_market_segments(self) -> List[str]:
        """Analyze revenue contribution by market segment"""
        insights = []
        
        try:
            # Calculate revenue by market segment
            segment_revenue = self.data.groupby('Market_Segment')['Revenue_INR'].sum().sort_values(ascending=False)
            total_revenue = segment_revenue.sum()
            
            # Calculate percentages
            segment_percentages = (segment_revenue / total_revenue * 100).round(1)
            
            # Top revenue contributing segment
            top_segment = segment_percentages.index[0]
            top_percentage = segment_percentages.iloc[0]
            
            insights.append(
                f"{top_segment} segment contributes {top_percentage}% of total revenue, "
                f"generating ₹{segment_revenue.iloc[0]:,.0f}."
            )
            
            # Compare top segments
            if len(segment_percentages) >= 2:
                second_segment = segment_percentages.index[1]
                second_percentage = segment_percentages.iloc[1]
                
                insights.append(
                    f"{top_segment} outperforms {second_segment} by "
                    f"{top_percentage - second_percentage:.1f} percentage points in revenue share."
                )
            
            # Identify concentrated vs diversified revenue
            if top_percentage > 50:
                insights.append(
                    f"Revenue is highly concentrated with {top_segment} representing over half of all income."
                )
            elif top_percentage < 30:
                insights.append(
                    f"Revenue is well-diversified across market segments with no single segment dominating."
                )
            
        except Exception as e:
            logger.error(f"Error analyzing market segments: {str(e)}")
            
        return insights
    
    def _analyze_monthly_revenue(self) -> List[str]:
        """Analyze monthly revenue patterns"""
        insights = []
        
        try:
            # Extract month from date and calculate monthly revenue
            self.data['Month'] = pd.to_datetime(self.data['Date']).dt.month
            monthly_revenue = self.data.groupby('Month')['Revenue_INR'].sum()
            
            # Find highest and lowest revenue months
            highest_month = monthly_revenue.idxmax()
            lowest_month = monthly_revenue.idxmin()
            
            month_names = {
                1: 'January', 2: 'February', 3: 'March', 4: 'April',
                5: 'May', 6: 'June', 7: 'July', 8: 'August',
                9: 'September', 10: 'October', 11: 'November', 12: 'December'
            }
            
            revenue_diff = monthly_revenue[highest_month] - monthly_revenue[lowest_month]
            percentage_diff = (revenue_diff / monthly_revenue[lowest_month] * 100).round(1)
            
            insights.append(
                f"{month_names[lowest_month]} has the lowest monthly revenue at ₹{monthly_revenue[lowest_month]:,.0f}, "
                f"while {month_names[highest_month]} peaks at ₹{monthly_revenue[highest_month]:,.0f} "
                f"({percentage_diff}% higher)."
            )
            
            # Seasonal insights
            q1_months = [1, 2, 3]
            q2_months = [4, 5, 6]
            q3_months = [7, 8, 9]
            q4_months = [10, 11, 12]
            
            quarters = {
                'Q1': monthly_revenue[monthly_revenue.index.isin(q1_months)].sum(),
                'Q2': monthly_revenue[monthly_revenue.index.isin(q2_months)].sum(),
                'Q3': monthly_revenue[monthly_revenue.index.isin(q3_months)].sum(),
                'Q4': monthly_revenue[monthly_revenue.index.isin(q4_months)].sum()
            }
            
            best_quarter = max(quarters, key=quarters.get)
            worst_quarter = min(quarters, key=quarters.get)
            
            insights.append(
                f"{best_quarter} is the strongest quarter for revenue, while {worst_quarter} presents "
                f"the biggest opportunity for improvement."
            )
            
        except Exception as e:
            logger.error(f"Error analyzing monthly revenue: {str(e)}")
            
        return insights
    
    def _analyze_channel_adr(self) -> List[str]:
        """Analyze Average Daily Rate by booking channel"""
        insights = []
        
        try:
            # Calculate weighted average ADR by channel
            channel_adr = self.data.groupby('Booking_Channel').apply(
                lambda x: (x['ADR_INR'] * x['Rooms_Sold']).sum() / x['Rooms_Sold'].sum()
            ).round(2)
            
            # Find highest and lowest ADR channels
            highest_adr_channel = channel_adr.idxmax()
            lowest_adr_channel = channel_adr.idxmin()
            
            adr_premium = channel_adr[highest_adr_channel] - channel_adr[lowest_adr_channel]
            premium_percentage = (adr_premium / channel_adr[lowest_adr_channel] * 100).round(1)
            
            insights.append(
                f"{highest_adr_channel} commands the highest ADR at ₹{channel_adr[highest_adr_channel]:,.0f}, "
                f"representing a {premium_percentage}% premium over {lowest_adr_channel} "
                f"(₹{channel_adr[lowest_adr_channel]:,.0f})."
            )
            
            # Compare with overall average
            overall_adr = (self.data['ADR_INR'] * self.data['Rooms_Sold']).sum() / self.data['Rooms_Sold'].sum()
            
            above_avg_channels = channel_adr[channel_adr > overall_adr]
            if len(above_avg_channels) > 0:
                insights.append(
                    f"{len(above_avg_channels)} out of {len(channel_adr)} booking channels "
                    f"achieve above-average ADR of ₹{overall_adr:,.0f}."
                )
            
        except Exception as e:
            logger.error(f"Error analyzing channel ADR: {str(e)}")
            
        return insights
    
    def _analyze_revenue_growth(self) -> List[str]:
        """Analyze month-over-month revenue growth"""
        insights = []
        
        try:
            # Create year-month column and calculate monthly totals
            self.data['YearMonth'] = pd.to_datetime(self.data['Date']).dt.to_period('M')
            monthly_totals = self.data.groupby('YearMonth')['Revenue_INR'].sum().sort_index()
            
            if len(monthly_totals) < 2:
                return ["Insufficient data for revenue growth analysis."]
            
            # Calculate month-over-month growth
            monthly_growth = monthly_totals.pct_change() * 100
            monthly_growth = monthly_growth.dropna()
            
            if len(monthly_growth) > 0:
                avg_growth = monthly_growth.mean()
                latest_growth = monthly_growth.iloc[-1]
                
                growth_direction = "growth" if avg_growth > 0 else "decline"
                
                insights.append(
                    f"Average month-over-month revenue {growth_direction} is {abs(avg_growth):.1f}%, "
                    f"with the most recent month showing {latest_growth:+.1f}%."
                )
                
                # Find best and worst growth months
                if len(monthly_growth) >= 3:
                    best_month = monthly_growth.idxmax()
                    worst_month = monthly_growth.idxmin()
                    
                    insights.append(
                        f"Strongest growth occurred in {best_month} (+{monthly_growth[best_month]:.1f}%), "
                        f"while {worst_month} saw the steepest decline ({monthly_growth[worst_month]:+.1f}%)."
                    )
            
        except Exception as e:
            logger.error(f"Error analyzing revenue growth: {str(e)}")
            
        return insights
    
    def _analyze_occupancy_performance(self) -> List[str]:
        """Analyze occupancy rate patterns"""
        insights = []
        
        try:
            avg_occupancy = self.data['Occupancy_Rate'].mean() * 100
            max_occupancy = self.data['Occupancy_Rate'].max() * 100
            min_occupancy = self.data['Occupancy_Rate'].min() * 100
            
            insights.append(
                f"Average occupancy rate is {avg_occupancy:.1f}% with a range from "
                f"{min_occupancy:.1f}% to {max_occupancy:.1f}%."
            )
            
            # Occupancy by market segment
            segment_occupancy = self.data.groupby('Market_Segment')['Occupancy_Rate'].mean() * 100
            highest_occ_segment = segment_occupancy.idxmax()
            lowest_occ_segment = segment_occupancy.idxmin()
            
            insights.append(
                f"{highest_occ_segment} achieves the highest occupancy at {segment_occupancy[highest_occ_segment]:.1f}%, "
                f"while {lowest_occ_segment} has the lowest at {segment_occupancy[lowest_occ_segment]:.1f}%."
            )
            
        except Exception as e:
            logger.error(f"Error analyzing occupancy: {str(e)}")
            
        return insights
    
    def _analyze_revpar_performance(self) -> List[str]:
        """Analyze Revenue Per Available Room patterns"""
        insights = []
        
        try:
            avg_revpar = self.data['RevPAR_INR'].mean()
            
            # RevPAR by channel
            channel_revpar = self.data.groupby('Booking_Channel')['RevPAR_INR'].mean().round(2)
            top_revpar_channel = channel_revpar.idxmax()
            
            insights.append(
                f"Average RevPAR across all channels is ₹{avg_revpar:,.0f}, with "
                f"{top_revpar_channel} leading at ₹{channel_revpar[top_revpar_channel]:,.0f}."
            )
            
        except Exception as e:
            logger.error(f"Error analyzing RevPAR: {str(e)}")
            
        return insights
    
    def _analyze_seasonal_trends(self) -> List[str]:
        """Analyze seasonal booking and revenue trends"""
        insights = []
        
        try:
            # Day of week analysis
            self.data['DayOfWeek'] = pd.to_datetime(self.data['Date']).dt.day_name()
            
            dow_revenue = self.data.groupby('DayOfWeek')['Revenue_INR'].mean()
            dow_occupancy = self.data.groupby('DayOfWeek')['Occupancy_Rate'].mean() * 100
            
            # Define weekday order
            day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            dow_revenue = dow_revenue.reindex([d for d in day_order if d in dow_revenue.index])
            
            best_revenue_day = dow_revenue.idxmax()
            worst_revenue_day = dow_revenue.idxmin()
            
            insights.append(
                f"{best_revenue_day} generates the highest average daily revenue at ₹{dow_revenue[best_revenue_day]:,.0f}, "
                f"while {worst_revenue_day} is the weakest at ₹{dow_revenue[worst_revenue_day]:,.0f}."
            )
            
            # Identify weekend vs weekday patterns
            weekend_days = ['Saturday', 'Sunday']
            weekday_days = [d for d in day_order if d not in weekend_days]
            
            weekend_avg = dow_revenue[[d for d in weekend_days if d in dow_revenue.index]].mean()
            weekday_avg = dow_revenue[[d for d in weekday_days if d in dow_revenue.index]].mean()
            
            if weekend_avg > weekday_avg:
                diff_pct = ((weekend_avg - weekday_avg) / weekday_avg * 100).round(1)
                insights.append(f"Weekend revenue exceeds weekday average by {diff_pct}%.")
            else:
                diff_pct = ((weekday_avg - weekend_avg) / weekend_avg * 100).round(1)
                insights.append(f"Weekday revenue exceeds weekend average by {diff_pct}%.")
            
        except Exception as e:
            logger.error(f"Error analyzing seasonal trends: {str(e)}")
            
        return insights

# Global instance
insight_service = InsightService()

def get_insights() -> List[str]:
    """Get all business insights"""
    return insight_service.generate_all_insights()

def refresh_insights():
    """Refresh insights data (useful after data updates)"""
    insight_service._load_data()