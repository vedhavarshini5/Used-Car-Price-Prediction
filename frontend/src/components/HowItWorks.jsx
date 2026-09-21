import React from 'react';
import { HelpCircle, FormInput, Cpu, GitPullRequest, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onTryPredictor }) {
  const steps = [
    {
      step: '01',
      title: 'Enter Vehicle Details',
      desc: 'Input vehicle attributes including brand, model, registration year, odometer reading, fuel type, transmission, and engine capacity.',
      icon: FormInput,
      color: 'from-cyan-500 to-sky-500'
    },
    {
      step: '02',
      title: 'AI Analyzes Features',
      desc: 'Our preprocessing pipeline normalizes units, calculates annual mileage degradation, and encodes multi-dimensional market variables.',
      icon: Cpu,
      color: 'from-sky-500 to-blue-500'
    },
    {
      step: '03',
      title: 'Random Forest Predicts Value',
      desc: 'An ensemble of 120 trained decision trees processes the input across verified transaction history, mitigating bias and outliers.',
      icon: GitPullRequest,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      step: '04',
      title: 'Get Estimated Market Price',
      desc: 'Receive instant market valuation, empirical confidence bounds, dynamic depreciation charts, and an official PDF valuation certificate.',
      icon: DollarSign,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div id="how-it-works" className="max-w-5xl mx-auto py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Simple 4-Step Valuation Journey</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How AutoPrice AI Works
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          From vehicle specifications to an accurate, data-backed market valuation in under 2 seconds.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className="glass-panel rounded-3xl p-6 border border-slate-800 relative flex flex-col justify-between glass-card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} p-0.5 flex items-center justify-center shadow-lg`}>
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <span className="text-3xl font-black text-slate-800 font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Automated step</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="mt-12 text-center">
        <button
          onClick={onTryPredictor}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>Calculate Your Car's Worth</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
