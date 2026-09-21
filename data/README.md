# Dataset Directory - AutoPrice AI

This directory contains the training dataset for the Used Car Price Prediction machine learning model.

### Primary Dataset File
- `car_details_v3.csv`: The canonical 8,128-record CarDekho used car dataset.

### Expected Schema
- **`name`** (string): Brand and model name (e.g. "Maruti Swift Dzire VDI", "Honda City 1.5 V AT")
- **`year`** (integer): Manufacturing year (e.g. 2017)
- **`selling_price`** (integer/float): Target variable, car selling price in INR (₹)
- **`km_driven`** (integer): Total kilometers driven on odometer
- **`fuel`** (string): Fuel type ("Petrol", "Diesel", "CNG", "LPG", "Electric")
- **`seller_type`** (string): Seller category ("Individual", "Dealer", "Trustmark Dealer")
- **`transmission`** (string): Transmission type ("Manual", "Automatic")
- **`owner`** (string): Ownership history ("First Owner", "Second Owner", "Third Owner", "Fourth & Above Owner", "Test Drive Car")
- **`mileage`** (string/float): Fuel economy (e.g. "18.5 kmpl", "21.14 km/kg")
- **`engine`** (string/float): Engine displacement in CC (e.g. "1197 CC")
- **`max_power`** (string/float): Engine power in brake horsepower (e.g. "82 bhp")
- **`torque`** (string): Torque specs (e.g. "190Nm@ 2000rpm")
- **`seats`** (float/int): Number of passenger seats (e.g. 5.0)

### Manual Setup Instructions
If this file is ever missing, run:
```bash
python ml/download_dataset.py
```
Or place your custom CSV here named `car_details_v3.csv` following the schema above.
