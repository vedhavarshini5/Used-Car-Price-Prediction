"""
Dataset downloader and validator for AutoPrice AI.
Downloads the real 8,128-row CarDekho Used Car dataset (car_details_v3.csv).
"""
import os
import sys
import urllib.request
import pandas as pd

DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")
DATASET_PATH = os.path.join(DATASET_DIR, "car_details_v3.csv")

PRIMARY_URL = "https://huggingface.co/datasets/jonathanpie/cardetailsprediction/resolve/main/cardetailsprediction/cardetails.csv"
FALLBACK_URL = "https://huggingface.co/datasets/inria-soda/carte-benchmark/resolve/main/data_raw/cardekho.csv"

def download_and_verify():
    os.makedirs(DATASET_DIR, exist_ok=True)
    
    if os.path.exists(DATASET_PATH) and os.path.getsize(DATASET_PATH) > 100000:
        print(f"[OK] Dataset already present at: {DATASET_PATH}")
        df = pd.read_csv(DATASET_PATH)
        print(f"Loaded {len(df)} records. Columns: {list(df.columns)}")
        return DATASET_PATH
        
    print(f"Downloading dataset from primary source: {PRIMARY_URL} ...")
    try:
        req = urllib.request.Request(PRIMARY_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as response, open(DATASET_PATH, "wb") as out_file:
            data = response.read()
            out_file.write(data)
        print(f"[OK] Downloaded {len(data)} bytes to {DATASET_PATH}")
    except Exception as e:
        print(f"Warning: Primary download failed ({e}). Trying fallback...")
        req = urllib.request.Request(FALLBACK_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as response, open(DATASET_PATH, "wb") as out_file:
            data = response.read()
            out_file.write(data)
        print(f"[OK] Downloaded fallback to {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    print(f"[OK] Verification successful! Dataset contains {len(df)} rows and {len(df.columns)} columns.")
    print("Column names:", list(df.columns))
    return DATASET_PATH

if __name__ == "__main__":
    download_and_verify()
