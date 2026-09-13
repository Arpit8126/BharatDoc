import React from 'react';
import { Activity, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

interface ClinicalProgressBarProps {
  progress?: number;
  stage?: string;
  subtext?: string;
  variant?: 'full' | 'compact' | 'chat';
}

export function ClinicalProgressBar({
  progress = 0,
  stage = 'Processing...',
  subtext,
  variant = 'full'
}: ClinicalProgressBarProps) {
  const boundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  if (variant === 'chat') {
    return (
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e7e5e4] shadow-xs max-w-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#292524] font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif text-xs font-semibold">{stage || 'Clinical Knowledge Processing…'}</span>
          </span>
          <span className="text-[10px] text-[#777169] font-mono bg-[#f0efed] px-2 py-0.5 rounded-full font-medium">
            Active
          </span>
        </div>
        
        {/* Progress Track */}
        <div className="w-full h-1.5 bg-[#f0efed] rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-[#292524] rounded-full animate-indeterminate" />
        </div>
        
        <p className="text-[10px] text-[#777169] leading-tight">
          {subtext || 'Grounding clinical recommendations against prescription database…'}
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#777169]">
          <span className="font-medium text-[#292524]">{stage}</span>
          <span className="font-mono font-semibold">{boundedProgress}%</span>
        </div>
        <div className="w-full h-2 bg-[#f0efed] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-600 to-[#292524] rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${boundedProgress}%` }}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-[#e7e5e4] shadow-xs space-y-5">
      {/* Header & Percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#f0efed] text-[#292524] flex items-center justify-center">
            <Activity className="w-4 h-4 text-[#292524] animate-pulse" />
          </div>
          <div>
            <h4 className="font-serif text-sm sm:text-base font-semibold text-[#0c0a09]">Clinical Processing</h4>
            <p className="text-[11px] text-[#777169]">Pipeline active</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-xl font-bold text-[#0c0a09]">{boundedProgress}%</span>
          <p className="text-[10px] text-emerald-600 font-medium">Analyzing document</p>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-[#f0efed] rounded-full overflow-hidden p-0.5 relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-[#292524] rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${Math.max(5, boundedProgress)}%` }}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[11px] text-[#4e4e4e] font-medium pt-0.5">
          <span className="truncate pr-2">{stage}</span>
        </div>
      </div>

      {/* Status Micro-Steps */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-[#f0efed]">
        {[
          { label: 'CLAHE OCR', activeAt: 15 },
          { label: 'BBoxes', activeAt: 45 },
          { label: 'DDI Safety', activeAt: 75 },
          { label: 'FHIR R4', activeAt: 95 }
        ].map((s, idx) => {
          const isDone = boundedProgress >= s.activeAt;
          return (
            <div
              key={idx}
              className={`p-1.5 rounded-xl text-center border text-[9px] font-semibold transition-all ${
                isDone
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-[#fafafa] border-[#e7e5e4] text-[#a8a29e]'
              }`}
            >
              {s.label}
            </div>
          );
        })}
      </div>

      {subtext && (
        <p className="text-[11px] text-[#777169] text-center leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}
