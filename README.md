# AutoPrice AI – Used Car Price Predictor 🚗⚡


**AutoPrice AI** is a modern, full-stack used car market valuation web application powered by machine learning. It predicts the estimated selling price of a used vehicle using a trained **Random Forest Regressor** ensemble, benchmarks it against a baseline **Linear Regression** model, generates empirical confidence intervals, and presents interactive depreciation analytics via a dark automotive-themed dashboard.

---

## 🌟 Key Features

- **Random Forest ML Valuation Engine**: Trained on 8,128 verified CarDekho market transactions, achieving **92.7% $R^2$ accuracy** with sub-second inference.
- **Empirical Confidence Ranges**: Derives realistic market bounds ($\pm 1.15 \sigma$) from inter-tree decision variance.
- **Dynamic Valuation Drivers**: Explains positive and negative pricing impacts (Vehicle Age, Odometer Kilometers, Brand Prestige, Engine Displacement, Fuel Type).
- **Interactive Recharts Analytics**:
  - Vehicle Age vs Depreciation Trajectory (Year-by-Year curve).
  - Odometer Wear-and-Tear Decay curve.
  - Relative Feature Influence breakdown.
  - Predicted Price vs Market Confidence Spread.
- **Side-by-Side Car Comparison**: Compare two vehicles simultaneously with specs matrix, price gap analysis, and value recommendations.
- **Model Insights & Transparency**: View dataset statistics, $R^2$ scores, MAE/RMSE comparisons, feature importance rankings, and an end-to-end ML architecture flow diagram.
- **Valuation History**: Automatically tracks recent predictions in browser `localStorage` with one-click re-loading.
- **Official PDF Certificate**: Download branded PDF valuation reports generated dynamically via ReportLab.
- **"Try Sample Car"**: One-click autofill with real diverse presets (Maruti Swift Dzire, Honda City, Hyundai Creta, Toyota Fortuner, BMW 3 Series).

---

## 🏗️ Project Architecture

```
car/
├── backend/
│   ├── main.py                  # FastAPI application with REST endpoints & CORS
│   ├── schemas.py               # Pydantic request/response models & validations
│   ├── prediction_service.py    # ML inference, confidence bounds & simulation curves
│   ├── pdf_service.py           # ReportLab PDF certificate generator
│   └── test_api.py              # Automated backend integration test suite
├── frontend/
│   ├── index.html               # Entry HTML with custom automotive typography
│   ├── vite.config.js           # Vite development and bundle configuration
│   ├── tailwind.config.js       # Tailwind CSS dark automotive theme
│   └── src/
│       ├── App.jsx              # Main dashboard view coordinator & state
│       ├── services/api.js      # Centralized API service with fallback handling
│       └── components/
│           ├── Navbar.jsx       # Glassmorphism header with live API status
│           ├── Hero.jsx         # Hero showcase with live telemetry stats
│           ├── PredictionForm.jsx # Validated input form with "Try Sample Car"
│           ├── PredictionResult.jsx # Hero price card, meter gauge & factors
│           ├── PriceAnalysisCharts.jsx # Recharts depreciation & wear curves
│           ├── CarComparison.jsx # Dual vehicle comparison matrix
│           ├── ModelInsights.jsx # ML transparency, RF vs LR metrics & pipeline
│           ├── HowItWorks.jsx   # 4-step interactive walkthrough
│           ├── PredictionHistory.jsx # LocalStorage history with reload
│           └── Footer.jsx       # Legal disclaimers and technical metadata
├── ml/
│   ├── dataset/
│   │   └── car_details_v3.csv   # Real 8,128-record CarDekho dataset
│   ├── saved_model/
│   │   ├── rf_model.joblib      # Trained Random Forest Regressor (120 trees)
│   │   ├── lr_model.joblib      # Baseline Linear Regression model
│   │   ├── model_meta.json      # Evaluation metrics, percentiles & feature weights
│   │   └── brand_models.json    # Hierarchical brand-to-model mapping
│   ├── download_dataset.py      # Automated dataset downloader and validator
│   ├── preprocessing.py         # Unit extraction, cleaning & one-hot encoding
│   ├── train_model.py           # Model training and artifact serialization
│   └── evaluate_model.py        # Model performance evaluation report script
├── data/
│   ├── car_details_v3.csv       # Supported root dataset mirror
│   └── README.md                # Dataset documentation & manual instructions
├── requirements.txt             # Python dependencies
└── README.md                    # Project documentation
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Python**: 3.10 or newer
- **Node.js**: 18.0 or newer (npm included)

---

### 2. Backend Setup & Model Training

```bash
# 1. Open a terminal in the project root directory
cd car

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Download the real CarDekho dataset (if not already downloaded)
python ml/download_dataset.py

# 4. Train the Random Forest and Linear Regression models
python ml/train_model.py

# 5. (Optional) Run the automated backend test suite
python backend/test_api.py

# 6. Start the FastAPI backend server
python -m uvicorn backend.main:app --reload --port 8000
```
> The backend will be available at **`http://localhost:8000`** (Interactive Swagger UI at **`http://localhost:8000/docs`**).

---

### 3. Frontend Setup & Launch

```bash
# 1. Open a new terminal in the frontend directory
cd car/frontend

# 2. Install frontend dependencies
npm install

# 3. Start the Vite development server
npm run dev
```
> The frontend application will be live at **`http://localhost:5173`**.

---

## 📊 Machine Learning Pipeline & Metrics

Models were trained on **6,891 clean, deduplicated vehicle records** split into 80% training (5,512 rows) and 20% test partition (1,379 rows).

| Metric | Random Forest Regressor (Primary) | Linear Regression (Baseline) | Improvement |
| :--- | :--- | :--- | :--- |
| **$R^2$ Score (Accuracy)** | **0.9265** (92.7%) | **0.6892** (68.9%) | **+34.4% higher variance explained** |
| **MAE (Mean Absolute Error)** | **₹ 78,630** | **₹ 1,47,996** | **46.9% lower error margin** |
| **RMSE** | **₹ 1,44,240** | **₹ 2,96,534** | **51.4% lower extreme error** |
| **Ensemble Trees** | 120 Decision Trees | Single Linear Hyperplane | Non-linear interaction handling |

### Top Influencing Features:
1. **Engine Power (`max_power` bhp)**: ~57.6% Gini importance
2. **Vehicle Age (`car_age`)**: ~24.2% Gini importance
3. **Kilometers Driven (`km_driven`)**: ~4.5% Gini importance
4. **Luxury Brand Classification**: ~4.0% Gini importance
5. **Fuel Economy (`mileage` kmpl)**: ~2.4% Gini importance
6. **Engine Displacement (`engine` CC)**: ~2.3% Gini importance

---

## 🔌 API Documentation & Examples

### Endpoint: `POST /api/predict`
Calculates estimated price, confidence range, and factor analysis for a car.

#### Example Request:
```bash
curl -X POST "http://localhost:8000/api/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "brand": "Toyota",
       "model": "Corolla Altis",
       "year": 2019,
       "km_driven": 45000,
       "fuel_type": "Petrol",
       "transmission": "Manual",
       "engine": 1798,
       "mileage": 14.5,
       "owners": "First Owner",
       "location": "Mumbai",
       "seats": 5
     }'
```

#### Example Response:
```json
{
  "brand": "Toyota",
  "model": "Corolla Altis",
  "year": 2019,
  "predicted_price": 862400.0,
  "lower_price": 728000.0,
  "upper_price": 997000.0,
  "formatted_price": "₹ 8,62,400",
  "formatted_range": "₹ 7,28,000 – ₹ 9,97,000",
  "price_in_lakhs": "₹ 8.62 Lakhs",
  "reliability_score": 91,
  "market_standing": "Premium Segment",
  "market_standing_explanation": "Valued in the top 25% tier due to brand prestige, high horsepower, and superior specifications.",
  "important_features": [
    {
      "name": "Vehicle Age",
      "impact": "High Positive",
      "direction": "positive",
      "description": "At 7 years young, this vehicle has minimal wear and maintains high residual value.",
      "value": "2019 (7 yrs old)"
    },
    {
      "name": "Kilometers Driven",
      "impact": "Moderate Impact",
      "direction": "neutral",
      "description": "Normal usage pattern (45,000 km) aligned with average market wear.",
      "value": "45,000 km"
    },
    {
      "name": "Brand Liquidity",
      "impact": "Positive Impact",
      "direction": "positive",
      "description": "Toyota vehicles enjoy excellent resale liquidity and easy parts availability.",
      "value": "Toyota"
    }
  ],
  "depreciation_curve": [
    { "age": 0, "year": 2026, "price": 1420000.0, "formatted_price": "₹ 14,20,000" },
    { "age": 7, "year": 2019, "price": 862400.0, "formatted_price": "₹ 8,62,400" }
  ],
  "km_impact_curve": [
    { "km": 10000, "price": 990000.0, "formatted_price": "₹ 9,90,000" },
    { "km": 50000, "price": 850000.0, "formatted_price": "₹ 8,50,000" }
  ],
  "model_information": {
    "algorithm": "Random Forest Regressor (Ensemble)",
    "trees": 120,
    "model_r2": 0.9265,
    "mae": 78630,
    "dataset_size": 6891
  }
}
```

---

### Other Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check confirming ML model readiness |
| `GET` | `/api/brands-models` | Returns 32 brands and their popular model catalog |
| `GET` | `/api/sample-cars` | Returns 5 pre-configured sample cars for one-click demo |
| `GET` | `/api/model-info` | Full ML performance metrics and feature weights |
| `POST` | `/api/compare` | Dual-car valuation and comparative recommendations |
| `POST` | `/api/generate-report` | Generates and streams downloadable PDF certificate |

---

## 🛡️ Disclaimer

*Predictions are estimates generated by a machine learning model based on historical vehicle datasets and should not be considered a guaranteed financial quote or binding market price. Physical inspection, accident history, and local market negotiation may influence actual transaction values.*
