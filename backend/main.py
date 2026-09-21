"""
FastAPI REST API application for AutoPrice AI.
Provides price prediction, multi-car comparison, model metrics, and report export.
"""
import os
import sys
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure local imports work smoothly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from schemas import (
    CarPredictionRequest,
    CarPredictionResponse,
    CarComparisonRequest,
    CarComparisonResponse
)
from prediction_service import prediction_service
from pdf_service import generate_pdf_report

app = FastAPI(
    title="AutoPrice AI – Used Car Price Predictor API",
    description="REST API powered by Random Forest Regressor and Scikit-Learn for used car valuation.",
    version="1.0.0"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and hosting
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAMPLE_CARS = [
    {
        "label": "Maruti Swift Dzire (Budget Sedan)",
        "brand": "Maruti",
        "model": "Swift Dzire VDI",
        "year": 2018,
        "km_driven": 48000,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "engine": 1248,
        "mileage": 28.4,
        "owners": "First Owner",
        "seats": 5,
        "location": "New Delhi"
    },
    {
        "label": "Honda City (Executive Sedan)",
        "brand": "Honda",
        "model": "City i-VTEC V",
        "year": 2020,
        "km_driven": 32000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "engine": 1498,
        "mileage": 17.8,
        "owners": "First Owner",
        "seats": 5,
        "location": "Mumbai"
    },
    {
        "label": "Hyundai Creta (Compact SUV)",
        "brand": "Hyundai",
        "model": "Creta SX AT",
        "year": 2021,
        "km_driven": 25000,
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "engine": 1493,
        "mileage": 18.5,
        "owners": "First Owner",
        "seats": 5,
        "location": "Bangalore"
    },
    {
        "label": "Toyota Fortuner (Rugged SUV)",
        "brand": "Toyota",
        "model": "Fortuner 4x2 AT",
        "year": 2019,
        "km_driven": 65000,
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "engine": 2755,
        "mileage": 14.2,
        "owners": "First Owner",
        "seats": 7,
        "location": "Chandigarh"
    },
    {
        "label": "BMW 3 Series (Luxury Sedan)",
        "brand": "Bmw",
        "model": "3 Series 320d Luxury Line",
        "year": 2017,
        "km_driven": 52000,
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "engine": 1995,
        "mileage": 22.69,
        "owners": "Second Owner",
        "seats": 5,
        "location": "Hyderabad"
    }
]

@app.get("/api/health")
def health_check():
    """Health check endpoint confirming API and ML model availability."""
    is_ready = prediction_service.rf_model is not None
    return {
        "status": "healthy" if is_ready else "degraded",
        "model_loaded": is_ready,
        "service": "AutoPrice AI Backend",
        "primary_algorithm": "Random Forest Regressor"
    }

@app.get("/api/brands-models")
def get_brands_and_models():
    """Returns mapping of available car brands and their popular models."""
    return {
        "brands": prediction_service.brand_models,
        "all_brands": sorted(list(prediction_service.brand_models.keys()))
    }

@app.get("/api/sample-cars")
def get_sample_cars():
    """Returns diverse pre-configured sample cars for one-click testing."""
    return {"sample_cars": SAMPLE_CARS}

@app.get("/api/model-info")
def get_model_info():
    """Returns detailed machine learning performance metrics and architecture details."""
    if not prediction_service.meta:
        raise HTTPException(status_code=503, detail="Model metadata is unavailable.")
    return prediction_service.meta

@app.post("/api/predict", response_model=CarPredictionResponse)
def predict_car_price(request: CarPredictionRequest):
    """
    Predicts the market price, estimated confidence bounds, and factor analysis
    for a given vehicle specification using the trained Random Forest model.
    """
    try:
        input_data = request.model_dump()
        result = prediction_service.predict(input_data)
        return result
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction processing error: {str(e)}")

@app.post("/api/compare", response_model=CarComparisonResponse)
def compare_cars(request: CarComparisonRequest):
    """
    Compares two cars side-by-side, analyzing price difference, features, and value.
    """
    try:
        car_a_dict = request.car_a.model_dump()
        car_b_dict = request.car_b.model_dump()
        result = prediction_service.compare_two_cars(car_a_dict, car_b_dict)
        return result
    except Exception as e:
        print(f"Comparison error: {e}")
        raise HTTPException(status_code=500, detail=f"Comparison processing error: {str(e)}")

@app.post("/api/generate-report")
def generate_report_endpoint(request: CarPredictionRequest):
    """
    Generates and returns an official PDF valuation certificate for download.
    """
    try:
        input_data = request.model_dump()
        prediction_result = prediction_service.predict(input_data)
        pdf_bytes = generate_pdf_report(prediction_result, input_data)
        
        filename = f"AutoPrice_Valuation_{input_data.get('brand')}_{input_data.get('year')}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        print(f"Report generation error: {e}")
        raise HTTPException(status_code=500, detail=f"PDF report generation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
