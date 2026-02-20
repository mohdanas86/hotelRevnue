import pandas as pd

DATA_PATH = "data/intelligent_hotel_revenue_.csv"

def load_data():
    df = pd.read_csv(DATA_PATH)

    # Convert Date column
    df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y")

    return df
