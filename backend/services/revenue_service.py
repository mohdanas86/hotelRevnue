from utils.data_loader import load_data

df = load_data()


# KPI DATA
def get_kpis():
    return {
        "total_revenue": round(df["Revenue_INR"].sum(), 2),
        "avg_occupancy": round(df["Occupancy_Rate"].mean(), 3),
        "avg_adr": round(df["ADR_INR"].mean(), 2),
        "avg_revpar": round(df["RevPAR_INR"].mean(), 2),
        "total_cancellations": int(df["Cancellation_Count"].sum())
    }


# Revenue Trend
def get_revenue_trend():
    grouped = df.groupby("Date")["Revenue_INR"].sum().reset_index()

    return grouped.to_dict(orient="records")


# Occupancy Trend
def get_occupancy_trend():
    grouped = df.groupby("Date")["Occupancy_Rate"].mean().reset_index()

    return grouped.to_dict(orient="records")


# Revenue by Hotel
def get_revenue_by_hotel():
    grouped = df.groupby("Hotel_ID")["Revenue_INR"].sum().reset_index()

    return grouped.to_dict(orient="records")


# Revenue by Booking Channel
def get_revenue_by_channel():
    grouped = df.groupby("Booking_Channel")["Revenue_INR"].sum().reset_index()

    return grouped.to_dict(orient="records")


# Market Segment Share
def get_market_segment_share():
    grouped = df.groupby("Market_Segment")["Revenue_INR"].sum().reset_index()

    return grouped.to_dict(orient="records")


# Scatter Plot Data
def get_scatter_data():
    scatter = df[["Hotel_ID", "ADR_INR", "Occupancy_Rate", "Revenue_INR"]]

    return scatter.to_dict(orient="records")


# Cancellation Data
def get_cancellations_by_channel():
    grouped = df.groupby("Booking_Channel")["Cancellation_Count"].sum().reset_index()

    return grouped.to_dict(orient="records")



# NEW FUNCTION
def get_cancellations_by_channel():

    df = load_data()

    result = (
        df.groupby("Booking_Channel", as_index=False)
        .agg({"Cancellation_Count": "sum"})
        .sort_values("Cancellation_Count", ascending=False)
    )

    return result.to_dict(orient="records")