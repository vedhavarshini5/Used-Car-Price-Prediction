import React, { useEffect, useState } from 'react';
import { 
  BarChart3, Cpu, Database, Award, GitBranch, Layers, 
  ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Sparkles, AlertCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Cell 
} from 'recharts';
import { api } from '../services/api';

export default function ModelInsights({ modelMeta }) {
  const [meta, setMeta] = useState(modelMeta);
  const [loading, setLoading] = useState(!modelMeta);

  useEffect(() => {
    if (!meta) {
      api.getModelInfo()
        .then(data => setMeta(data))
        .catch(err => console.error("Error loading model info:", err))
        .finally(() => setLoading(false));
    }
  }, [meta]);

  const rf = meta?.rf_metrics || { r2: 0.9265, mae: 78630, rmse: 144240, n_estimators: 120 };
  const lr = meta?.lr_metrics || { r2: 0.6892, mae: 147996, rmse: 296534 };
  const featureImportances = meta?.feature_importances || [
    { feature: 'Engine Power (bhp)', importance: 57.6 },
    { feature: 'Vehicle Age', importance: 24.2 },
    { feature: 'Kilometers Driven', importance: 4.5 },
    { feature: 'Luxury Brand Tier', importance: 4.0 },
    { feature: 'Mileage (kmpl)', importance: 2.4 },
    { feature: 'Engine CC', importance: 2.3 },
    { feature: 'Usage per Year', importance: 1.3 },
    { feature: 'Seat Capacity', importance: 1.2 },
  ];

  const comparisonData = [
    { metric: 'R² Score (Accuracy)', rf: (rf.r2 * 100).toFixed(1), lr: (lr.r2 * 100).toFixed(1), unit: '%' },
    { metric: 'MAE (Mean Error)', rf: Math.round(rf.mae / 1000), lr: Math.round(lr.mae / 1000), unit: 'k ₹' },
    { metric: 'RMSE', rf: Math.round(rf.rmse / 1000), lr: Math.round(lr.rmse / 1000), unit: 'k ₹' },
  ];

  return (
    <div id="model-insights" className="max-w-5xl mx-auto py-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Machine Learning Transparency & Benchmarks</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Model Insights & ML Architecture
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Comprehensive evaluation of our primary Random Forest Regressor compared against baseline Linear Regression.
        </p>
      </div>

      {/* Dataset & Architecture Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-medium">Dataset Records</div>
          <div className="text-2xl font-black text-white mt-1">
            {meta?.total_records ? `${meta.total_records.toLocaleString()}` : '6,891'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Clean & Deduplicated</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-medium">Feature Dimensions</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {meta?.feature_count || 40}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Encoded ML inputs</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-medium">Train / Test Split</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            80% / 20%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {meta?.train_records ? `${meta.train_records} train / ${meta.test_records} test` : '5,512 / 1,379 samples'}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-medium">Random Forest R²</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {rf.r2 ? (rf.r2 * 100).toFixed(1) + '%' : '92.7%'}
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1">High fidelity fit</div>
        </div>
      </div>

      {/* 4-STEP VISUAL ML FLOW DIAGRAM */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span>End-to-End Prediction Pipeline</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          How raw vehicle parameters transform into reliable market valuations in real-time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          
          {/* Step 1 */}
          <div className="glass-panel-subtle rounded-2xl p-4 border border-slate-800/80 relative">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs font-bold mb-3">
              1
            </div>
            <div className="text-xs font-bold text-white mb-1">Input Vehicle Details</div>
            <p className="text-[11px] text-slate-400">
              User supplies brand, model, year, odometer km, fuel, transmission, engine, and mileage.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel-subtle rounded-2xl p-4 border border-slate-800/80 relative">
            <div className="w-7 h-7 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center text-xs font-bold mb-3">
              2
            </div>
            <div className="text-xs font-bold text-white mb-1">Data Processing</div>
            <p className="text-[11px] text-slate-400">
              Unit normalization, age calculation (2026 - year), km/yr telemetry, and one-hot categorical encoding.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel-subtle rounded-2xl p-4 border border-slate-800/80 relative">
            <div className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center text-xs font-bold mb-3">
              3
            </div>
            <div className="text-xs font-bold text-white mb-1">Random Forest Ensemble</div>
            <p className="text-[11px] text-slate-400">
              120 decision trees evaluate non-linear depreciation patterns and cross-feature interactions.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel-subtle rounded-2xl p-4 border border-slate-800/80 relative">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs font-bold mb-3">
              4
            </div>
            <div className="text-xs font-bold text-white mb-1">Price & Range Output</div>
            <p className="text-[11px] text-slate-400">
              Computes median valuation, inter-tree variance confidence interval, and factor impact breakdown.
            </p>
          </div>

        </div>
      </div>

      {/* Model Performance Comparison: Random Forest vs Linear Regression */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Model Benchmark: Random Forest vs Linear Regression</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated strictly on the held-out 20% test partition (1,379 verified market transactions).
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            RF is 34% More Accurate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Metric 1: R2 Score */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 mb-2">R-Squared Score (Higher is Better)</div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-cyan-400 font-bold">Random Forest</div>
                <div className="text-3xl font-black text-white font-mono">{rf.r2}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Linear Reg</div>
                <div className="text-xl font-bold text-slate-400 font-mono">{lr.r2}</div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              RF captures 92.7% of price variance vs 68.9% for linear regression.
            </div>
          </div>

          {/* Metric 2: MAE */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 mb-2">Mean Absolute Error (Lower is Better)</div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-cyan-400 font-bold">Random Forest</div>
                <div className="text-2xl font-black text-white font-mono">₹ {Math.round(rf.mae).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Linear Reg</div>
                <div className="text-lg font-bold text-slate-400 font-mono">₹ {Math.round(lr.mae).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              Average prediction deviation is Rs. 78,630 vs Rs. 147,996 for linear regression.
            </div>
          </div>

          {/* Metric 3: RMSE */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 mb-2">RMSE (Lower is Better)</div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-cyan-400 font-bold">Random Forest</div>
                <div className="text-2xl font-black text-white font-mono">₹ {Math.round(rf.rmse).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Linear Reg</div>
                <div className="text-lg font-bold text-slate-400 font-mono">₹ {Math.round(lr.rmse).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              Linear models penalize non-linear price drops severely, doubling RMSE.
            </div>
          </div>

        </div>
      </div>

      {/* Feature Importance Chart */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Random Forest Feature Importance Distribution</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Relative Gini importance of top features influencing the Random Forest decision tree splits.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={featureImportances.slice(0, 8)} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
              <XAxis type="number" stroke="#64748B" fontSize={11} unit="%" />
              <YAxis 
                dataKey="feature" 
                type="category" 
                stroke="#94A3B8" 
                fontSize={11} 
                width={120} 
                tickFormatter={(f) => f.replace('brand_cat_', 'Brand: ').replace('_val', '')}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val) => [`${val}%`, 'Gini Importance']}
              />
              <Bar dataKey="importance" fill="#06B6D4" radius={[0, 4, 4, 0]}>
                {featureImportances.slice(0, 8).map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={idx === 0 ? '#06B6D4' : idx === 1 ? '#38BDF8' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
