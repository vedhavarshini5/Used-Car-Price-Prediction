import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Database, TrendingUp, Award, Layers } from 'lucide-react';

export default function Hero({ onPredictClick, onInsightsClick }) {
  const stats = [
    { label: 'Verified Records', value: '8,100+', icon: Database, desc: 'Real Indian car listings' },
    { label: 'Model Accuracy', value: '92.6%', icon: TrendingUp, desc: 'R² score on unseen tests' },
    { label: 'Inference Speed', value: '<100ms', icon: Zap, desc: 'Instant valuation engine' },
    { label: 'Algorithm', value: 'Random Forest', icon: Layers, desc: '120 ensemble decision trees' },
  ];

  return (
    <section className="relative pt-8 pb-14 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Gen Machine Learning Valuation Engine</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Know Your Car's Worth <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Before You Sell
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered used car price prediction based on verified vehicle specifications, odometer telemetry, and market depreciation patterns.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onPredictClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-glow-cyan hover:shadow-cyan-500/50 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>Predict Price Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onInsightsClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel text-slate-200 font-semibold text-sm hover:text-white hover:bg-slate-800/80 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-slate-700/60"
            >
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Explore Model Insights</span>
            </button>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="glass-panel rounded-2xl p-4 sm:p-5 text-center border border-slate-800/80 glass-card-hover"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center mx-auto mb-2.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {stat.desc}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
