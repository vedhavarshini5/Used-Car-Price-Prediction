import React, { useState } from 'react';
import { Scale, ArrowRight, Check, Sparkles, Loader2, Award, Zap, Fuel, Calendar, Gauge } from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_CAR_A = {
  brand: 'Maruti',
  model: 'Swift Dzire VDI',
  year: 2018,
  km_driven: 48000,
  fuel_type: 'Diesel',
  transmission: 'Manual',
  engine: 1248,
  mileage: 28.4,
  owners: 'First Owner',
  seats: 5,
  location: 'Delhi'
};

const DEFAULT_CAR_B = {
  brand: 'Honda',
  model: 'City i-VTEC V',
  year: 2020,
  km_driven: 32000,
  fuel_type: 'Petrol',
  transmission: 'Manual',
  engine: 1498,
  mileage: 17.8,
  owners: 'First Owner',
  seats: 5,
  location: 'Mumbai'
};

export default function CarComparison({ brandModels = {}, sampleCars = [] }) {
  const [carA, setCarA] = useState(DEFAULT_CAR_A);
  const [carB, setCarB] = useState(DEFAULT_CAR_B);
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.compareCars(carA, carB);
      setComparisonResult(res);
    } catch (err) {
      setError(err.message || 'Comparison failed. Verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample, target) => {
    const formatted = {
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
    };
    if (target === 'A') setCarA(formatted);
    else setCarB(formatted);
  };

  const brands = Object.keys(brandModels).length > 0
    ? Object.keys(brandModels).sort()
    : ['Maruti', 'Hyundai', 'Honda', 'Toyota', 'Mahindra', 'Tata', 'Ford', 'BMW'];

  return (
    <div id="compare-section" className="max-w-6xl mx-auto py-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-3">
          <Scale className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dual Vehicle AI Evaluation</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Compare Two Vehicles Side-by-Side
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Compare estimated market valuations, mechanical specs, and identify the better value option.
        </p>
      </div>

      {/* Two Car Input Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CAR A */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-800/40 relative">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              Vehicle A
            </span>
            <div className="flex items-center gap-1">
              {sampleCars.slice(0, 2).map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadSample(s, 'A')}
                  className="px-2 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  {s.brand}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 mb-1 block">Brand</label>
                <select
                  value={carA.brand}
                  onChange={(e) => setCarA(p => ({ ...p, brand: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Model</label>
                <input
                  type="text"
                  value={carA.model}
                  onChange={(e) => setCarA(p => ({ ...p, model: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 mb-1 block">Year</label>
                <input
                  type="number"
                  value={carA.year}
                  onChange={(e) => setCarA(p => ({ ...p, year: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Kilometers</label>
                <input
                  type="number"
                  value={carA.km_driven}
                  onChange={(e) => setCarA(p => ({ ...p, km_driven: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Engine (CC)</label>
                <input
                  type="number"
                  value={carA.engine}
                  onChange={(e) => setCarA(p => ({ ...p, engine: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 mb-1 block">Fuel</label>
                <select
                  value={carA.fuel_type}
                  onChange={(e) => setCarA(p => ({ ...p, fuel_type: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Transmission</label>
                <select
                  value={carA.transmission}
                  onChange={(e) => setCarA(p => ({ ...p, transmission: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Mileage (kmpl)</label>
                <input
                  type="number"
                  step="0.1"
                  value={carA.mileage}
                  onChange={(e) => setCarA(p => ({ ...p, mileage: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CAR B */}
        <div className="glass-panel rounded-3xl p-6 border border-blue-800/40 relative">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800">
              Vehicle B
            </span>
            <div className="flex items-center gap-1">
              {sampleCars.slice(2, 4).map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadSample(s, 'B')}
                  className="px-2 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  {s.brand}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 mb-1 block">Brand</label>
                <select
                  value={carB.brand}
                  onChange={(e) => setCarB(p => ({ ...p, brand: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Model</label>
                <input
                  type="text"
                  value={carB.model}
                  onChange={(e) => setCarB(p => ({ ...p, model: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 mb-1 block">Year</label>
                <input
                  type="number"
                  value={carB.year}
                  onChange={(e) => setCarB(p => ({ ...p, year: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Kilometers</label>
                <input
                  type="number"
                  value={carB.km_driven}
                  onChange={(e) => setCarB(p => ({ ...p, km_driven: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Engine (CC)</label>
                <input
                  type="number"
                  value={carB.engine}
                  onChange={(e) => setCarB(p => ({ ...p, engine: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 mb-1 block">Fuel</label>
                <select
                  value={carB.fuel_type}
                  onChange={(e) => setCarB(p => ({ ...p, fuel_type: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Transmission</label>
                <select
                  value={carB.transmission}
                  onChange={(e) => setCarB(p => ({ ...p, transmission: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Mileage (kmpl)</label>
                <input
                  type="number"
                  step="0.1"
                  value={carB.mileage}
                  onChange={(e) => setCarB(p => ({ ...p, mileage: Number(e.target.value) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Compare Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleCompare}
          disabled={loading}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Comparing Vehicles...</span>
            </>
          ) : (
            <>
              <Scale className="w-4 h-4" />
              <span>Run Side-by-Side Comparison</span>
            </>
          )}
        </button>
        {error && <p className="text-xs text-rose-400 mt-3">{error}</p>}
      </div>

      {/* Comparison Results Card */}
      {comparisonResult && (
        <div className="mt-10 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-900/95 shadow-2xl">
          
          {/* Recommendation Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/70 to-indigo-950/80 border border-cyan-800/50 mb-8">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  AI Recommendation & Value Analysis
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  {comparisonResult.better_value_recommendation}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Price gap: <strong className="text-cyan-400">{comparisonResult.formatted_difference}</strong> ({comparisonResult.price_diff_percent}% margin)
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Pricing Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-panel-subtle rounded-2xl p-5 text-center border border-cyan-800/40">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {comparisonResult.car_a.brand} {comparisonResult.car_a.model}
              </div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white mt-2 font-mono">
                {comparisonResult.car_a.formatted_price}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Range: {comparisonResult.car_a.formatted_range}
              </div>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                {comparisonResult.car_a.market_standing}
              </span>
            </div>

            <div className="glass-panel-subtle rounded-2xl p-5 text-center border border-blue-800/40">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {comparisonResult.car_b.brand} {comparisonResult.car_b.model}
              </div>
              <div className="text-2xl sm:text-4xl font-extrabold text-white mt-2 font-mono">
                {comparisonResult.car_b.formatted_price}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Range: {comparisonResult.car_b.formatted_range}
              </div>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                {comparisonResult.car_b.market_standing}
              </span>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Specification</th>
                  <th className="py-3 px-4 text-cyan-400">{carA.brand} {carA.model}</th>
                  <th className="py-3 px-4 text-blue-400">{carB.brand} {carB.model}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonResult.comparison_summary.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-medium text-slate-300">{row.attribute}</td>
                    <td className="py-3 px-4 text-slate-200 font-semibold">{row.car_a}</td>
                    <td className="py-3 px-4 text-slate-200 font-semibold">{row.car_b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
