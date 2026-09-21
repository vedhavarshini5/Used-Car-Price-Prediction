"""
Pydantic schema definitions for AutoPrice AI API.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CarPredictionRequest(BaseModel):
    brand: str = Field(..., example="Toyota", description="Car brand manufacturer")
    model: str = Field(..., example="Corolla Altis", description="Car model designation")
    year: int = Field(..., ge=1990, le=2026, example=2020, description="Manufacturing year")
    km_driven: float = Field(..., ge=0, le=1000000, example=45000, description="Total kilometers driven")
    fuel_type: str = Field(..., example="Petrol", description="Fuel type: Petrol, Diesel, CNG, LPG, Electric")
    transmission: str = Field(..., example="Manual", description="Transmission: Manual or Automatic")
    engine: float = Field(..., ge=500, le=6000, example=1197, description="Engine capacity in CC")
    mileage: float = Field(..., ge=4, le=45, example=18.5, description="Mileage in kmpl or km/kg")
    owners: str = Field("First Owner", example="First Owner", description="Number of previous owners")
    location: Optional[str] = Field(None, example="Mumbai", description="City / Region")
    seats: Optional[int] = Field(5, ge=2, le=12, example=5, description="Number of seats")
    max_power: Optional[float] = Field(None, example=85.0, description="Power in bhp (optional)")

class FactorImpact(BaseModel):
    name: str
    impact: str  # e.g., "High", "Moderate", "Positive", "Negative"
    direction: str  # "positive", "negative", "neutral"
    description: str
    value: str

class DepreciationPoint(BaseModel):
    age: int
    year: int
    price: float
    formatted_price: str

class MileagePoint(BaseModel):
    km: int
    price: float
    formatted_price: str

class CarPredictionResponse(BaseModel):
    brand: str
    model: str
    year: int
    predicted_price: float
    lower_price: float
    upper_price: float
    formatted_price: str
    formatted_range: str
    price_in_lakhs: str
    reliability_score: int
    market_standing: str  # "Below Average", "Competitive Market Value", "Premium Segment"
    market_standing_explanation: str
    important_features: List[FactorImpact]
    depreciation_curve: List[DepreciationPoint]
    km_impact_curve: List[MileagePoint]
    feature_impacts_bar: List[Dict[str, Any]]
    model_information: Dict[str, Any]

class CarComparisonRequest(BaseModel):
    car_a: CarPredictionRequest
    car_b: CarPredictionRequest

class CarComparisonResponse(BaseModel):
    car_a: CarPredictionResponse
    car_b: CarPredictionResponse
    price_difference: float
    price_diff_percent: float
    formatted_difference: str
    cheaper_car: str
    better_value_recommendation: str
    comparison_summary: List[Dict[str, Any]]
