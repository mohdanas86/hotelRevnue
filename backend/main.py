from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd

from services import revenue_service

app = FastAPI(title="Hotel Revenue API")

# allow frontend access
origins = [
    "http://localhost:3000",  # frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hotel Revenue API Running"}


# KPI API
@app.get("/api/kpi")
def kpi():
    return revenue_service.get_kpis()


# Revenue Trend API
@app.get("/api/revenue-trend")
def revenue_trend():
    return revenue_service.get_revenue_trend()


# Occupancy Trend API
@app.get("/api/occupancy-trend")
def occupancy_trend():
    return revenue_service.get_occupancy_trend()


# Revenue by Hotel
@app.get("/api/revenue-by-hotel")
def revenue_by_hotel():
    return revenue_service.get_revenue_by_hotel()


# Revenue by Booking Channel
@app.get("/api/revenue-by-channel")
def revenue_by_channel():
    return revenue_service.get_revenue_by_channel()


# Market Segment Share
@app.get("/api/market-segment")
def market_segment():
    return revenue_service.get_market_segment_share()


# Scatter Data
@app.get("/api/scatter")
def scatter():
    return revenue_service.get_scatter_data()

# Cancellation by Channel API
@app.get("/api/cancellations-by-channel")
def cancellations_by_channel():
    return revenue_service.get_cancellations_by_channel()