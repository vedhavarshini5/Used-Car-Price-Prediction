import React, { useState, useEffect } from 'react';
import { 
  Car, Calendar, Gauge, Fuel, Cog, Wrench, Navigation, 
  Users, MapPin, Sparkles, RotateCcw, AlertTriangle, CheckCircle, 
  ArrowRight, Loader2, Info
} from 'lucide-react';

const CURRENT_YEAR = 2026;

const INITIAL_FORM = {
  brand: 'Honda',
  model: 'City i-VTEC V',
  year: 2019,
  km_driven: 42000,
  fuel_type: 'Petrol',
  transmission: 'Manual',
  engine: 1498,
  mileage: 17.8,
  owners: 'First Owner',
  seats: 5,
  location: 'Mumbai'
};

export default function PredictionForm({ 
  onPredict, 
  isLoading, 
  loadingStage, 
  sampleCars = [], 
  brandModels = {} 
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [sampleIndex, setSampleIndex] = useState(0);
  const [availableModels, setAvailableModels] = useState([]);
  const [isSampleActive, setIsSampleActive] = useState(false);

  // Update models list when brand changes
  useEffect(() => {
    if (brandModels[formData.brand]) {
      const models = brandModels[formData.brand].models || [];
      setAvailableModels(models);
    } else {
      setAvailableModels(['Standard']);
    }
  }, [formData.brand, brandModels]);

  const validate = () => {
    const newErrors = {};

    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.model) newErrors.model = 'Model is required';
    
    if (!formData.year) {
      newErrors.year = 'Manufacturing year is required';
    } else if (formData.year > CURRENT_YEAR) {
      newErrors.year = `Year cannot be in the future (max ${CURRENT_YEAR})`;
    } else if (formData.year < 1990) {
      newErrors.year = 'Year must be 1990 or newer';
    }

    if (formData.km_driven === '' || formData.km_driven === null) {
      newErrors.km_driven = 'Kilometers driven is required';
    } else if (Number(formData.km_driven) < 0) {
      newErrors.km_driven = 'Kilometers cannot be negative';
    } else if (Number(formData.km_driven) > 800000) {
      newErrors.km_driven = 'Kilometers cannot exceed 8,00,000 km';
    }

    if (!formData.engine) {
      newErrors.engine = 'Engine capacity is required';
    } else if (Number(formData.engine) <= 400 || Number(formData.engine) > 6000) {
      newErrors.engine = 'Engine must be between 500 CC and 6,000 CC';
    }

    if (!formData.mileage) {
      newErrors.mileage = 'Mileage is required';
    } else if (Number(formData.mileage) < 4 || Number(formData.mileage) > 45) {
      newErrors.mileage = 'Mileage must be between 4 and 45 kmpl';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsSampleActive(false);
    
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    if (name === 'brand') {
      const defaultEngine = brandModels[value]?.typical_engine || 1197;
      const defaultMileage = brandModels[value]?.typical_mileage || 18.5;
      const firstModel = brandModels[value]?.models?.[0] || 'Standard';

      setFormData(prev => ({
        ...prev,
        brand: value,
        model: firstModel,
        engine: defaultEngine,
        mileage: defaultMileage
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' || name === 'engine' || name === 'km_driven' || name === 'mileage' || name === 'seats'
          ? (value === '' ? '' : Number(value))
          : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onPredict(formData);
    }
  };

  const handleTrySample = () => {
    if (sampleCars && sampleCars.length > 0) {
      const nextIdx = (sampleIndex + 1) % sampleCars.length;
      setSampleIndex(nextIdx);
      const sample = sampleCars[nextIdx];
      setFormData({
        brand: sample.brand,
        model: sample.model,
        year: sample.year,
        km_driven: sample.km_driven,
        fuel_type: sample.fuel_type,
        transmission: sample.transmission,
        engine: sample.engine,
        mileage: sample.mileage,
        owners: sample.owners,
        seats: sample.seats || 5,
        location: sample.location || 'Delhi'
      });
      setIsSampleActive(true);
      setErrors({});
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setIsSampleActive(false);
  };

  const brandOptions = Object.keys(brandModels).length > 0
    ? Object.keys(brandModels).sort()
    : ['Maruti', 'Hyundai', 'Honda', 'Toyota', 'Mahindra', 'Tata', 'Ford', 'Volkswagen', 'BMW', 'Skoda'];

  return (
    <div id="prediction-form" className="max-w-4xl mx-auto">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative">
        
        {/* Header with Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800/80 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Vehicle Price Predictor
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/60">
                Random Forest ML
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enter vehicle parameters to calculate current market value and confidence intervals.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleTrySample}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/50 hover:border-cyan-500/50 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Try Sample Car</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all flex items-center gap-1.5 active:scale-95"
              title="Reset Form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Sample notification badge */}
        {isSampleActive && (
          <div className="mb-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-center justify-between text-xs text-cyan-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span><b>Sample Car Loaded:</b> {formData.brand} {formData.model} ({formData.year}). Values populated from real dataset records.</span>
            </div>
            <button onClick={() => setIsSampleActive(false)} className="text-cyan-400 hover:text-white font-medium ml-2">
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: VEHICLE INFORMATION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-blue-950/80 border border-blue-700/50 text-blue-400 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Vehicle Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Brand */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Car Brand <span className="text-rose-400">*</span></span>
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  {brandOptions.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {errors.brand && <p className="text-xs text-rose-400 mt-1">{errors.brand}</p>}
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Model Designation <span className="text-rose-400">*</span></span>
                </label>
                {availableModels.length > 1 ? (
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  >
                    {availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Swift Dzire, City, Creta"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder:text-slate-500"
                  />
                )}
                {errors.model && <p className="text-xs text-rose-400 mt-1">{errors.model}</p>}
              </div>

              {/* Manufacturing Year */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Manufacturing Year <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="number"
                  name="year"
                  min="1990"
                  max={CURRENT_YEAR}
                  value={formData.year}
                  onChange={handleChange}
                  placeholder={`1995 - ${CURRENT_YEAR}`}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
                {errors.year && <p className="text-xs text-rose-400 mt-1">{errors.year}</p>}
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fuel Type <span className="text-rose-400">*</span></span>
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="LPG">LPG</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Cog className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Transmission <span className="text-rose-400">*</span></span>
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Number of Seats */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Seating Capacity</span>
                </label>
                <select
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  <option value="4">4 Seater</option>
                  <option value="5">5 Seater (Standard)</option>
                  <option value="6">6 Seater</option>
                  <option value="7">7 Seater (SUV / MUV)</option>
                  <option value="8">8+ Seater</option>
                </select>
              </div>

            </div>
          </div>

          {/* SECTION 2: USAGE & SPECIFICATIONS */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Usage & Technical Specifications
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Kilometers Driven */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kilometers Driven <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="number"
                  name="km_driven"
                  min="0"
                  step="1000"
                  value={formData.km_driven}
                  onChange={handleChange}
                  placeholder="e.g. 45000"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
                {errors.km_driven && <p className="text-xs text-rose-400 mt-1">{errors.km_driven}</p>}
              </div>

              {/* Engine Capacity */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Engine Capacity (CC) <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="number"
                  name="engine"
                  min="500"
                  max="6000"
                  step="50"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="e.g. 1197"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
                {errors.engine && <p className="text-xs text-rose-400 mt-1">{errors.engine}</p>}
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mileage (kmpl) <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="number"
                  name="mileage"
                  min="4"
                  max="45"
                  step="0.1"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="e.g. 18.5"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
                {errors.mileage && <p className="text-xs text-rose-400 mt-1">{errors.mileage}</p>}
              </div>

              {/* Previous Owners */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ownership History <span className="text-rose-400">*</span></span>
                </label>
                <select
                  name="owners"
                  value={formData.owners}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  <option value="First Owner">First Owner</option>
                  <option value="Second Owner">Second Owner</option>
                  <option value="Third Owner">Third Owner</option>
                  <option value="Fourth & Above Owner">Fourth & Above Owner</option>
                  <option value="Test Drive Car">Test Drive Car</option>
                </select>
              </div>

              {/* Location (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>City / Location <span className="text-slate-500 text-[10px] font-normal">(Optional)</span></span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Delhi, Bangalore"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder:text-slate-500"
                />
              </div>

            </div>
          </div>

          {/* Submit Button & Loading State */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-base shadow-glow-cyan transition-all flex items-center justify-center gap-3 ${
                isLoading
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  <span>{loadingStage || 'Analyzing vehicle data with ML model...'}</span>
                </>
              ) : (
                <>
                  <span>Predict My Car Price</span>
                  <ArrowRight className="w-5 h-5 text-cyan-200" />
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              Powered by Random Forest Regressor trained on 8,128 verified CarDekho market transactions.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
