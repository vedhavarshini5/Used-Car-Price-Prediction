"""
Training script for AutoPrice AI.
Trains Random Forest Regressor and Linear Regression comparison model,
computes evaluation metrics, extracts feature importances, and saves artifacts.
"""
import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))
from preprocessing import load_and_clean_data, generate_brand_models_map, TOP_BRANDS

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "ml", "dataset", "car_details_v3.csv")
SAVED_MODEL_DIR = os.path.join(BASE_DIR, "ml", "saved_model")

def train_and_save():
    os.makedirs(SAVED_MODEL_DIR, exist_ok=True)
    print("=" * 60)
    print("AutoPrice AI - Model Training Pipeline Starting...")
    print("=" * 60)

    # 1. Load and clean data
    df = load_and_clean_data(DATASET_PATH)
    
    # 2. Generate brand-models hierarchy
    brand_models_path = os.path.join(SAVED_MODEL_DIR, "brand_models.json")
    generate_brand_models_map(df, brand_models_path)

    # 3. Prepare Feature Matrix
    cat_cols = ["brand_cat", "fuel", "transmission", "owner"]
    num_cols = [
        "car_age", "km_driven", "km_per_year",
        "mileage_val", "engine_val", "power_val",
        "seats", "is_luxury"
    ]
    
    X_raw = df[cat_cols + num_cols]
    y = df["selling_price"]
    
    # One-hot encode categoricals
    X = pd.get_dummies(X_raw, columns=cat_cols, drop_first=False)
    feature_columns = list(X.columns)
    print(f"Total encoded features: {len(feature_columns)}")

    # 4. Train / Test Split (80 / 20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"Training samples: {len(X_train)}, Testing samples: {len(X_test)}")

    # 5. Train Random Forest Regressor (Primary Model)
    print("Training Random Forest Regressor (n_estimators=120)...")
    rf_model = RandomForestRegressor(
        n_estimators=120,
        max_depth=22,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)

    # 6. Train Linear Regression (Comparison Baseline)
    print("Training Linear Regression Baseline...")
    lr_model = LinearRegression()
    lr_model.fit(X_train, y_train)

    # 7. Evaluate Models
    rf_preds = rf_model.predict(X_test)
    lr_preds = lr_model.predict(X_test)

    rf_r2 = float(r2_score(y_test, rf_preds))
    rf_mae = float(mean_absolute_error(y_test, rf_preds))
    rf_rmse = float(np.sqrt(mean_squared_error(y_test, rf_preds)))

    lr_r2 = float(r2_score(y_test, lr_preds))
    lr_mae = float(mean_absolute_error(y_test, lr_preds))
    lr_rmse = float(np.sqrt(mean_squared_error(y_test, lr_preds)))

    print("\n" + "=" * 40)
    print("EVALUATION RESULTS (Test Set):")
    print("=" * 40)
    print(f"Random Forest  -> R2: {rf_r2:.4f} | MAE: Rs. {rf_mae:,.0f} | RMSE: Rs. {rf_rmse:,.0f}")
    print(f"Linear Regress -> R2: {lr_r2:.4f} | MAE: Rs. {lr_mae:,.0f} | RMSE: Rs. {lr_rmse:,.0f}")
    print("=" * 40)

    # 8. Feature Importances
    importances = rf_model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    feature_importance_list = []
    for idx in sorted_idx[:15]: # Top 15 features
        feature_importance_list.append({
            "feature": feature_columns[idx],
            "importance": round(float(importances[idx]) * 100, 2)
        })

    # 9. Compute Dataset Summary Statistics for Contextual Guidance
    price_percentiles = {
        "p10": float(df["selling_price"].quantile(0.10)),
        "p25": float(df["selling_price"].quantile(0.25)),
        "p50": float(df["selling_price"].quantile(0.50)),
        "p75": float(df["selling_price"].quantile(0.75)),
        "p90": float(df["selling_price"].quantile(0.90)),
        "min": float(df["selling_price"].min()),
        "max": float(df["selling_price"].max()),
        "mean": float(df["selling_price"].mean())
    }

    # 10. Save Model Artifacts
    rf_path = os.path.join(SAVED_MODEL_DIR, "rf_model.joblib")
    lr_path = os.path.join(SAVED_MODEL_DIR, "lr_model.joblib")
    meta_path = os.path.join(SAVED_MODEL_DIR, "model_meta.json")

    joblib.dump(rf_model, rf_path)
    joblib.dump(lr_model, lr_path)
    print(f"[OK] Saved Random Forest model to: {rf_path}")
    print(f"[OK] Saved Linear Regression model to: {lr_path}")

    metadata = {
        "dataset_name": "CarDekho Used Car Dataset",
        "total_records": len(df),
        "train_records": len(X_train),
        "test_records": len(X_test),
        "feature_count": len(feature_columns),
        "feature_columns": feature_columns,
        "rf_metrics": {
            "name": "Random Forest Regressor",
            "r2": round(rf_r2, 4),
            "mae": round(rf_mae, 2),
            "rmse": round(rf_rmse, 2),
            "n_estimators": 120,
            "max_depth": 22
        },
        "lr_metrics": {
            "name": "Linear Regression",
            "r2": round(lr_r2, 4),
            "mae": round(lr_mae, 2),
            "rmse": round(lr_rmse, 2)
        },
        "feature_importances": feature_importance_list,
        "price_percentiles": price_percentiles,
        "available_brands": sorted(list(df["brand"].unique())),
        "fuel_types": sorted(list(df["fuel"].unique())),
        "transmissions": sorted(list(df["transmission"].unique())),
        "owner_types": sorted(list(df["owner"].unique()))
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] Saved model metadata to: {meta_path}")

    return metadata

if __name__ == "__main__":
    train_and_save()
