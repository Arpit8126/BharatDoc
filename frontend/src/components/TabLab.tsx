import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, Calendar, FileSpreadsheet, ArrowUpRight } from 'lucide-react';

interface TabLabProps {
  labData: any;
}

const HBA1C_HISTORICAL = [
  { date: '2025-09-10', value: 8.4, status: 'HIGH', label: '8.4%' },
  { date: '2025-12-15', value: 7.9, status: 'HIGH', label: '7.9%' },
  { date: '2026-03-20', value: 7.6, status: 'HIGH', label: '7.6%' },
  { date: '2026-06-10', value: 7.4, status: 'HIGH', label: '7.4%' },
  { date: '2026-09-09', value: 6.9, status: 'MODERATE', label: '6.9%' },
];

const BLOOD_GLUCOSE_HISTORICAL = [
  { date: '2025-09-10', value: 185, label: '185 mg/dL' },
  { date: '2025-12-15', value: 162, label: '162 mg/dL' },
  { date: '2026-03-20', value: 150, label: '150 mg/dL' },
  { date: '2026-06-10', value: 142, label: '142 mg/dL' },
  { date: '2026-09-09', value: 128, label: '128 mg/dL' },
];

const CREATININE_HISTORICAL = [
  { date: '2025-09-10', value: 1.2, label: '1.2 mg/dL' },
  { date: '2025-12-15', value: 1.15, label: '1.15 mg/dL' },
  { date: '2026-03-20', value: 1.1, label: '1.1 mg/dL' },
  { date: '2026-06-10', value: 1.08, label: '1.08 mg/dL' },
  { date: '2026-09-09', value: 1.05, label: '1.05 mg/dL' },
];

export default function TabLab({ labData }: TabLabProps) {
  const [activeMetric, setActiveMetric] = useState<'hba1c' | 'glucose' | 'creatinine'>('hba1c');
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('12m');

  const currentChartData =
    activeMetric === 'hba1c'
      ? HBA1C_HISTORICAL
      : activeMetric === 'glucose'
      ? BLOOD_GLUCOSE_HISTORICAL
      : CREATININE_HISTORICAL;

  const thresholdMax = activeMetric === 'hba1c' ? 5.7 : activeMetric === 'glucose' ? 99 : 1.3;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header telemetry cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric Card 1: HbA1c */}
        <div
          onClick={() => setActiveMetric('hba1c')}
          className={`cursor-pointer rounded-3xl p-5 border transition-all ${
            activeMetric === 'hba1c'
              ? 'bg-white border-[#292524] shadow-md ring-1 ring-[#292524]'
              : 'bg-white/80 border-[#e7e5e4] hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777169]">
              Glycated Hemoglobin
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold badge-mild inline-flex items-center gap-1">
              <span className="dot-mild" />
              Improving (-1.5%)
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-3xl font-normal text-[#0c0a09]">
              6.9%
            </span>
            <span className="text-xs text-[#777169]">Target: &lt; 5.7%</span>
          </div>
          <p className="text-[11px] text-[#777169] mt-2">
            Down from 8.4% baseline (Feb 2024). Responsive to Metformin 500mg.
          </p>
        </div>

        {/* Metric Card 2: Fasting Blood Sugar */}
        <div
          onClick={() => setActiveMetric('glucose')}
          className={`cursor-pointer rounded-3xl p-5 border transition-all ${
            activeMetric === 'glucose'
              ? 'bg-white border-[#292524] shadow-md ring-1 ring-[#292524]'
              : 'bg-white/80 border-[#e7e5e4] hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777169]">
              Fasting Blood Glucose
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold badge-mild inline-flex items-center gap-1">
              <span className="dot-mild" />
              Evolving
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-3xl font-normal text-[#0c0a09]">
              128 mg/dL
            </span>
            <span className="text-xs text-[#777169]">Target: 70-99</span>
          </div>
          <p className="text-[11px] text-[#777169] mt-2">
            Fasting glucose down from 185 mg/dL baseline.
          </p>
        </div>

        {/* Metric Card 3: Serum Creatinine */}
        <div
          onClick={() => setActiveMetric('creatinine')}
          className={`cursor-pointer rounded-3xl p-5 border transition-all ${
            activeMetric === 'creatinine'
              ? 'bg-white border-[#292524] shadow-md ring-1 ring-[#292524]'
              : 'bg-white/80 border-[#e7e5e4] hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777169]">
              Serum Creatinine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold badge-normal inline-flex items-center gap-1">
              <span className="dot-normal" />
              Optimal
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-3xl font-normal text-[#0c0a09]">
              1.05 mg/dL
            </span>
            <span className="text-xs text-[#777169]">Ref: 0.7-1.3</span>
          </div>
          <p className="text-[11px] text-[#777169] mt-2">
            Renal filtration stability confirmed across 4 diagnostic panels.
          </p>
        </div>

      </div>

      {/* Main Interactive Recharts Chart Canvas */}
      <div className="bg-white rounded-3xl border border-[#e7e5e4] p-6 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#292524]" />
              <h3 className="font-serif text-xl font-normal text-[#0c0a09]">
                {activeMetric === 'hba1c'
                  ? 'HbA1c Longitudinal Glycemic Trajectory'
                  : activeMetric === 'glucose'
                  ? 'Fasting Blood Glucose Historical Trend'
                  : 'Renal Function & Serum Creatinine Trajectory'}
              </h3>
            </div>
            <p className="text-xs text-[#777169] mt-1">
              Multi-document lab aggregator transforms scattered lab slips into continuous time-series data with clinical threshold bands.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0efed] p-1 rounded-full border border-[#e7e5e4]">
            {(['3m', '6m', '12m'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  timeRange === range ? 'bg-[#292524] text-white shadow-xs' : 'text-[#4e4e4e] hover:text-[#0c0a09]'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#292524" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#a7e5d3" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0efed" />
              <XAxis dataKey="date" stroke="#777169" fontSize={11} />
              <YAxis stroke="#777169" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0a09',
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontSize: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
                }}
              />
              <ReferenceLine y={thresholdMax} label={{ value: 'Normal Bio-Reference Threshold', fill: '#16a34a', fontSize: 11 }} stroke="#16a34a" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#292524"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMetric)"
                dot={{ r: 6, fill: '#292524', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 8, fill: '#dc2626' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Threshold bands */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#f0efed] text-xs text-[#4e4e4e] gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Safe Range Zone (&lt; {thresholdMax})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Clinical Attention Zone</span>
            </div>
          </div>

          <div className="text-[#777169]">
            Source: Metropolis Diagnostics & Diagnostic Labs
          </div>
        </div>

      </div>
    </div>
  );
}
