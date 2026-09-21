import React, { useState } from 'react';
import { 
  Download, RotateCcw, Scale, CheckCircle2, TrendingUp, TrendingDown, 
  Minus, ShieldCheck, Sparkles, AlertCircle, FileText, ChevronRight, Gauge
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PredictionResult({ 
  result, 
  carInput, 
  onPredictAgain, 
  onCompareWithThisCar, 
  onDownloadReport 
}) {
  const [downloading, setDownloading] = useState(false);

  // Trigger brief celebration on load
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#3B82F6', '#6366F1']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await onDownloadReport(carInput);
    } catch (err) {
      alert(`Error generating report: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const getImpactBadgeClass = (impact, direction) => {
    if (direction === 'positive') {
      return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
    } else if (direction === 'negative') {
      return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
    }
    return 'bg-slate-800/80 text-slate-300 border-slate-700/60';
  };

  const getImpactIcon = (direction) => {
    if (direction === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    if (direction === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div id="prediction-result" className="max-w-4xl mx-auto mt-10">
      
      {/* Main Result Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/40 shadow-glow-cyan relative overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#0B0F19]/95">
        
        {/* Subtle accent border top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Valuation Report</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {result.brand} {result.model} ({result.year})
            </span>
          </div>

          {/* Reliability Score */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Reliability: <strong className="text-emerald-400 font-bold">{result.reliability_score}%</strong></span>
          </div>
        </div>

        {/* Price Hero Section */}
        <div className="text-center py-6 sm:py-8 border-y border-slate-800/80 bg-slate-950/40 rounded-2xl my-2 px-4">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
            Estimated Market Value
          </p>

          <div className="mt-2 flex items-baseline justify-center gap-3">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-transparent">
              {result.formatted_price}
            </h1>
          </div>

          <p className="text-sm font-medium text-cyan-400 mt-1">
            Approx. {result.price_in_lakhs}
          </p>

          {/* Range & Confidence */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-300">
            <span className="text-slate-400">Estimated Market Range:</span>
            <span className="font-bold text-slate-100 font-mono">{result.formatted_range}</span>
          </div>

          {/* Gauge / Standing Indicator */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5 px-1">
              <span>Budget Tier</span>
              <span className="text-cyan-400 font-bold">{result.market_standing}</span>
              <span>Premium Tier</span>
            </div>
            
            {/* Visual meter track */}
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 relative">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 transition-all duration-1000"
                style={{ 
                  width: result.market_standing === 'Budget / Value Tier' ? '30%' 
                    : result.market_standing === 'Competitive Market Value' ? '65%' 
                    : '90%' 
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 italic">
              {result.market_standing_explanation}
            </p>
          </div>
        </div>

        {/* Influencing Factors Cards */}
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>Key Valuation Drivers & Impact Analysis</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {result.important_features.map((factor, index) => (
              <div 
                key={index} 
                className="glass-panel-subtle rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">
                    {factor.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${getImpactBadgeClass(factor.impact, factor.direction)}`}>
                    {getImpactIcon(factor.direction)}
                    <span>{factor.impact}</span>
                  </span>
                </div>
                <div className="text-xs font-semibold text-cyan-300 font-mono mb-1">
                  {factor.value}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onPredictAgain}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl glass-panel text-slate-200 font-semibold text-xs sm:text-sm hover:text-white hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Predict Another Car</span>
            </button>
            <button
              onClick={() => onCompareWithThisCar(carInput)}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl glass-panel text-slate-200 font-semibold text-xs sm:text-sm hover:text-white hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Compare with Another</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-glow-cyan flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-white" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
