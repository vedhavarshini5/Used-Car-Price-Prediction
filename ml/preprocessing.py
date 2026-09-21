"""
Preprocessing module for AutoPrice AI.
Handles raw data cleaning, unit conversions, feature engineering, and inference preprocessing.
"""
import os
import re
import json
import numpy as np
import pandas as pd

CURRENT_YEAR = 2026

TOP_BRANDS = [
    "Maruti", "Hyundai", "Mahindra", "Tata", "Toyota", "Honda",
    "Ford", "Chevrolet", "Renault", "Volkswagen", "BMW", "Skoda",
    "Nissan", "Audi", "Mercedes-Benz", "Kia", "Datsun", "Fiat",
    "Jeep", "Mg", "Volvo"
]

LUXURY_BRANDS = {"Bmw", "Audi", "Mercedes-Benz", "Jaguar", "Land Rover", "Volvo", "Porsche", "Lexus"}

def extract_numeric(val):
    """Extract first floating point number from string."""
    if pd.isna(val):
        return np.nan
    val_str = str(val).strip().lower()
    match = re.search(r'([\d\.]+)', val_str)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return np.nan
    return np.nan

def clean_brand(name):
    """Extract brand title from car full name."""
    if pd.isna(name):
        return "Other"
    brand = str(name).strip().split()[0].title()
    if brand.lower() == "mercedes":
        return "Mercedes-Benz"
    return brand

def extract_model_name(name, brand):
    """Extract standard model designation after the brand."""
    if pd.isna(name):
        return "Standard"
    parts = str(name).strip().split()
    if len(parts) <= 1:
        return parts[0]
    # Return 2nd and optional 3rd word (e.g. 'Swift Dzire' or 'City')
    sub_parts = parts[1:3]
    return " ".join(sub_parts)

def load_and_clean_data(csv_path):
    """
    Loads raw car dataset, cleans strings, handles nulls, and engineers features.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at: {csv_path}")

    df = pd.read_csv(csv_path)
    print(f"Loaded raw dataset with {len(df)} rows.")

    # Clean brand
    df["brand"] = df["name"].apply(clean_brand)
    
    # Extract numeric quantities
    df["mileage_val"] = df["mileage"].apply(extract_numeric)
    df["engine_val"] = df["engine"].apply(extract_numeric)
    df["power_val"] = df["max_power"].apply(extract_numeric)
    
    # Impute missing numeric values by brand median or global median
    for col in ["mileage_val", "engine_val", "power_val", "seats"]:
        global_median = df[col].median()
        df[col] = df.groupby("brand")[col].transform(lambda x: x.fillna(x.median())).fillna(global_median)

    # Filter invalid records / outliers
    df = df[df["selling_price"] > 25000]
    df = df[df["power_val"] > 10]
    df = df[df["mileage_val"] > 3]
    df = df[df["engine_val"] > 500]
    df = df[df["km_driven"] > 100]
    df = df[df["km_driven"] < 800000]
    df = df[df["year"] <= CURRENT_YEAR]
    df = df[df["year"] >= 1995]

    # Feature Engineering
    df["car_age"] = CURRENT_YEAR - df["year"]
    df["km_per_year"] = df["km_driven"] / np.maximum(1, df["car_age"])
    df["is_luxury"] = df["brand"].apply(lambda b: 1 if b in LUXURY_BRANDS else 0)
    df["brand_cat"] = df["brand"].apply(lambda b: b if b in TOP_BRANDS else "Other")

    # Standardize categoricals
    df["fuel"] = df["fuel"].fillna("Petrol").str.capitalize()
    df["transmission"] = df["transmission"].fillna("Manual").str.capitalize()
    df["owner"] = df["owner"].fillna("First Owner").str.title()
    df["seats"] = df["seats"].fillna(5).astype(int)

    # Deduplicate
    initial_count = len(df)
    df = df.drop_duplicates(subset=["name", "year", "km_driven", "selling_price"])
    print(f"Removed {initial_count - len(df)} duplicates. Clean dataset shape: {df.shape}")

    return df

def generate_brand_models_map(df, output_path=None):
    """
    Generates a map of brands to their popular models with default specs.
    """
    brand_map = {}
    
    for brand, group in df.groupby("brand"):
        models = []
        for name in group["name"]:
            model_name = extract_model_name(name, brand)
            if model_name and model_name not in models:
                models.append(model_name)
                if len(models) >= 12: # Keep top 12 popular models per brand
                    break
        
        # Calculate typical specs for this brand
        brand_map[brand] = {
            "models": sorted(models),
            "typical_engine": int(group["engine_val"].median()),
            "typical_mileage": round(float(group["mileage_val"].median()), 1),
            "typical_power": round(float(group["power_val"].median()), 1),
            "count": int(len(group))
        }

    if output_path:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(brand_map, f, indent=2)
        print(f"Saved brand-models hierarchy to {output_path}")

    return brand_map

def prepare_input_dataframe(input_dict, feature_columns):
    """
    Converts a single vehicle input dictionary into a one-hot encoded DataFrame
    matching the trained model's feature column expectations.
    """
    brand = str(input_dict.get("brand", "Maruti")).title()
    brand_cat = brand if brand in TOP_BRANDS else "Other"
    
    year = int(input_dict.get("year", 2018))
    car_age = max(0, CURRENT_YEAR - year)
    km_driven = float(input_dict.get("km_driven", 45000))
    km_per_year = km_driven / max(1, car_age)
    
    fuel = str(input_dict.get("fuel_type", "Petrol")).capitalize()
    transmission = str(input_dict.get("transmission", "Manual")).capitalize()
    
    # Normalize owner text
    raw_owner = str(input_dict.get("owners", "First Owner")).title()
    if raw_owner in ["1", "1St", "First", "First Owner"]:
        owner = "First Owner"
    elif raw_owner in ["2", "2Nd", "Second", "Second Owner"]:
        owner = "Second Owner"
    elif raw_owner in ["3", "3Rd", "Third", "Third Owner"]:
        owner = "Third Owner"
    elif raw_owner in ["4", "4Th", "Fourth", "Fourth & Above Owner"]:
        owner = "Fourth & Above Owner"
    elif "Test" in raw_owner:
        owner = "Test Drive Car"
    else:
        owner = "First Owner"

    # Safely extract numerics even if key exists with None value
    engine_val = input_dict.get("engine")
    engine = float(engine_val) if engine_val is not None else 1197.0

    mileage_val = input_dict.get("mileage")
    mileage = float(mileage_val) if mileage_val is not None else 18.5

    power_val = input_dict.get("max_power")
    if power_val is not None and not pd.isna(power_val):
        power = float(power_val)
    else:
        power = float(max(35.0, engine * 0.068))

    seats_val = input_dict.get("seats")
    seats = int(seats_val) if seats_val is not None else 5
    is_luxury = 1 if brand in LUXURY_BRANDS else 0

    row = {
        "car_age": car_age,
        "km_driven": km_driven,
        "km_per_year": km_per_year,
        "mileage_val": mileage,
        "engine_val": engine,
        "power_val": power,
        "seats": seats,
        "is_luxury": is_luxury,
        "brand_cat": brand_cat,
        "fuel": fuel,
        "transmission": transmission,
        "owner": owner
    }

    df_single = pd.DataFrame([row])
    df_encoded = pd.get_dummies(df_single, dtype=float)
    
    # Align columns with training feature columns
    aligned_df = pd.DataFrame(0.0, index=[0], columns=feature_columns, dtype=float)
    for col in df_encoded.columns:
        if col in aligned_df.columns:
            aligned_df.at[0, col] = float(df_encoded.at[0, col])
            
    return aligned_df
