import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell 
} from 'recharts';
import { LineChart as ChartIcon, TrendingDown, Gauge, PieChart, Layers } from 'lucide-react';

const formatCompactINR = (val) => {
  if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹ ${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹ ${(val / 1000).toFixed(0)}k`;
  return `₹ ${val}`;
};

export default function PriceAnalysisCharts({ result }) {
  if (!result) return null;

  const { 
    depreciation_curve = [], 
    km_impact_curve = [], 
    feature_impacts_bar = [], 
    predicted_price, 
    lower_price, 
    upper_price,
    formatted_price,
    brand,
    model,
    year 
  } = result;

  // Data for Price vs Range Bar
  const rangeBarData = [
    { name: 'Lower Bound', price: lower_price, label: 'Conservative' },
    { name: 'Predicted Value', price: predicted_price, label: 'Estimated' },
    { name: 'Upper Bound', price: upper_price, label: 'Optimistic' },
  ];

  return (
    <div id="price-analysis" className="max-w-4xl mx-auto mt-12 space-y-8">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <ChartIcon className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Market Intelligence & Price Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic valuation curves generated via Random Forest decision ensemble simulations for {brand} {model}.
          </p>
        </div>
      </div>

      {/* Grid of 2x2 Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CHART 1: Depreciation Curve (Age vs Price) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200">
                Vehicle Depreciation Curve
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Year vs Price</span>
          </div>
          
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={depreciation_curve} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="deprecColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickFormatter={formatCompactINR}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [formatCompactINR(val), 'Valuation']}
                  labelFormatter={(lbl) => `Model Year: ${lbl}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#06B6D4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#deprecColor)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Simulated market value across age cohorts based on actual historical vehicle sales.
          </p>
        </div>

        {/* CHART 2: Kilometers Driven Impact */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-200">
                Odometer Mileage Impact
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Kilometers vs Price</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={km_impact_curve} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis 
                  dataKey="km" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickFormatter={(km) => `${km / 1000}k`}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickFormatter={formatCompactINR}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [formatCompactINR(val), 'Price']}
                  labelFormatter={(lbl) => `${lbl.toLocaleString()} km driven`}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3B82F6" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#3B82F6' }} 
                  activeDot={{ r: 6, fill: '#60A5FA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Wear-and-tear price decay as odometer mileage increases.
          </p>
        </div>

        {/* CHART 3: Feature Impact Breakdown */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200">
                Feature Influence Contribution
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-400">% Weight</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={feature_impacts_bar} 
                margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} unit="%" />
                <YAxis dataKey="factor" type="category" stroke="#94A3B8" fontSize={11} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Relative Influence']}
                />
                <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                  {feature_impacts_bar.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#06B6D4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Relative weight of specifications in determining the final Random Forest output.
          </p>
        </div>

        {/* CHART 4: Predicted Value vs Range Spread */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">
                Confidence Spread
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Valuation Range</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rangeBarData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={formatCompactINR} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [formatCompactINR(val), 'Value']}
                />
                <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                  <Cell fill="#64748B" />
                  <Cell fill="#06B6D4" />
                  <Cell fill="#3B82F6" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Predicted median price centered within the tree ensemble confidence interval.
          </p>
        </div>

      </div>

    </div>
  );
}
