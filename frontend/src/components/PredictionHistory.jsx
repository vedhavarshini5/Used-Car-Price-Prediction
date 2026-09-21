import React from 'react';
import { History, Trash2, ArrowUpRight, Clock, Car, Gauge, Fuel, RotateCcw } from 'lucide-react';

export default function PredictionHistory({ 
  history = [], 
  onSelectCar, 
  onClearHistory,
  onGoToPredictor 
}) {
  if (history.length === 0) {
    return (
      <div id="history-section" className="max-w-4xl mx-auto py-12 text-center">
        <div className="glass-panel rounded-3xl p-10 border border-slate-800 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Saved Valuations Yet</h3>
          <p className="text-xs text-slate-400 mb-6">
            Whenever you run a price evaluation, it will automatically be recorded here in your browser history for quick recall.
          </p>
          <button
            onClick={onGoToPredictor}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs hover:brightness-110 transition-all shadow-glow-cyan"
          >
            Run Your First Prediction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="history-section" className="max-w-4xl mx-auto py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Recent Vehicle Valuations
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Stored locally in your browser. Click any car to re-evaluate or view details.
          </p>
        </div>

        <button
          onClick={onClearHistory}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* History Items Grid */}
      <div className="space-y-3">
        {history.map((item, idx) => (
          <div 
            key={idx}
            className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-cyan-400 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    {item.brand} {item.model}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {item.year}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-slate-500" />
                    <span>{Number(item.km_driven).toLocaleString()} km</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.fuel_type}</span>
                  </span>
                  <span>•</span>
                  <span>{item.transmission}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/60">
              <div className="text-left sm:text-right">
                <div className="text-lg font-black text-white font-mono text-cyan-300">
                  {item.formatted_price}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center sm:justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.date || 'Recent'}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectCar(item.inputData || item)}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 hover:text-white hover:bg-cyan-900/50 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
              >
                <span>Re-load</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
