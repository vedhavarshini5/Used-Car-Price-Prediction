"""
Integration test script for AutoPrice AI FastAPI backend.
"""
import os
import sys
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
from starlette.testclient import TestClient

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from main import app

client = TestClient(app)

def test_api():
    print("Testing /api/health...")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("Health response:", r.json())

    print("\nTesting /api/brands-models...")
    r = client.get("/api/brands-models")
    assert r.status_code == 200, f"Brands failed: {r.text}"
    data = r.json()
    print("Total brands:", len(data.get("all_brands", [])))
    print("Sample brands:", data.get("all_brands", [])[:5])

    print("\nTesting /api/model-info...")
    r = client.get("/api/model-info")
    assert r.status_code == 200, f"Model info failed: {r.text}"
    meta = r.json()
    print("Model RF R2:", meta.get("rf_metrics", {}).get("r2"))
    print("Model LR R2:", meta.get("lr_metrics", {}).get("r2"))

    print("\nTesting /api/predict...")
    sample_car = {
        "brand": "Maruti",
        "model": "Swift Dzire",
        "year": 2018,
        "km_driven": 45000,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "engine": 1248,
        "mileage": 28.4,
        "owners": "First Owner",
        "seats": 5,
        "location": "Delhi"
    }
    r = client.post("/api/predict", json=sample_car)
    assert r.status_code == 200, f"Prediction failed: {r.text}"
    pred = r.json()
    print("Predicted Price:", pred.get("formatted_price"))
    print("Price Range:", pred.get("formatted_range"))
    print("Reliability:", pred.get("reliability_score"))
    print("Market Standing:", pred.get("market_standing"))
    print("Factors count:", len(pred.get("important_features", [])))
    print("Depreciation curve points:", len(pred.get("depreciation_curve", [])))

    print("\nTesting /api/compare...")
    sample_car_b = {
        "brand": "Honda",
        "model": "City",
        "year": 2019,
        "km_driven": 35000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "engine": 1498,
        "mileage": 17.8,
        "owners": "First Owner",
        "seats": 5,
        "location": "Mumbai"
    }
    r = client.post("/api/compare", json={"car_a": sample_car, "car_b": sample_car_b})
    assert r.status_code == 200, f"Comparison failed: {r.text}"
    comp = r.json()
    print("Difference:", comp.get("formatted_difference"))
    print("Recommendation:", comp.get("better_value_recommendation"))

    print("\nTesting /api/generate-report (PDF)...")
    r = client.post("/api/generate-report", json=sample_car)
    assert r.status_code == 200, f"PDF failed: {r.text}"
    assert len(r.content) > 1000, "PDF content too small"
    print(f"Generated PDF successfully! Size: {len(r.content)} bytes.")

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY! [OK]")

if __name__ == "__main__":
    test_api()
