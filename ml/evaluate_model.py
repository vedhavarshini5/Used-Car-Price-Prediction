"""
Evaluation script for AutoPrice AI.
Loads saved models and metadata and prints a formatted diagnostic report.
"""
import os
import sys
import json
import joblib
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAVED_MODEL_DIR = os.path.join(BASE_DIR, "ml", "saved_model")

def evaluate_saved_models():
    meta_path = os.path.join(SAVED_MODEL_DIR, "model_meta.json")
    if not os.path.exists(meta_path):
        print(f"Metadata not found at {meta_path}. Run train_model.py first.")
        return

    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    print("=" * 60)
    print("AUTOPRICE AI - SAVED MODEL EVALUATION REPORT")
    print("=" * 60)
    print(f"Dataset: {meta.get('dataset_name')}")
    print(f"Total Records: {meta.get('total_records'):,} | Train: {meta.get('train_records'):,} | Test: {meta.get('test_records'):,}")
    print(f"Number of Features: {meta.get('feature_count')}")
    print("-" * 60)
    
    rf = meta.get("rf_metrics", {})
    lr = meta.get("lr_metrics", {})
    
    print("MODEL COMPARISON:")
    print(f"{'Metric':<18} | {'Random Forest (Primary)':<24} | {'Linear Regression (Baseline)'}")
    print("-" * 60)
    print(f"{'R-squared (R2)':<18} | {rf.get('r2'):<24} | {lr.get('r2')}")
    print(f"{'MAE (Mean Abs Err)':<18} | Rs. {rf.get('mae', 0):<20,.0f} | Rs. {lr.get('mae', 0):,.0f}")
    print(f"{'RMSE':<18} | Rs. {rf.get('rmse', 0):<20,.0f} | Rs. {lr.get('rmse', 0):,.0f}")
    print("-" * 60)

    print("\nTOP 10 MOST INFLUENTIAL FEATURES (Feature Importance):")
    for item in meta.get("feature_importances", [])[:10]:
        print(f"  - {item['feature']:<30} : {item['importance']}%")
    print("=" * 60)

if __name__ == "__main__":
    evaluate_saved_models()
