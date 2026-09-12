import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, Plus, Trash2, ArrowRight, Activity, Pill } from 'lucide-react';

interface TabDDIProps {
  ddiSafetyData: any;
  currentMedicines: any[];
  onAddMedication: (med: any) => void;
  onRemoveMedication: (index: number) => void;
}

export default function TabDDI({ ddiSafetyData, currentMedicines, onAddMedication, onRemoveMedication }: TabDDIProps) {
  const [newBrand, setNewBrand] = useState('');
  const [newDosage, setNewDosage] = useState('');

  const conflicts = ddiSafetyData?.conflicts || [];
  const status = ddiSafetyData?.status || 'SAFE';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim()) return;

    onAddMedication({
      brand_name: newBrand,
      dosage: newDosage || 'Standard',
      frequency: 'OD',
      timing: 'As directed',
      active_salts: [newBrand.toLowerCase()]
    });

    setNewBrand('');
    setNewDosage('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Overall Risk Radar Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xs transition-all ${
        status === 'HIGH_RISK'
          ? 'bg-red-50/90 border-red-200 text-red-950'
          : status === 'MODERATE_RISK'
          ? 'bg-amber-50/90 border-amber-200 text-amber-950'
          : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 ${
              status === 'HIGH_RISK'
                ? 'bg-red-600'
                : status === 'MODERATE_RISK'
                ? 'bg-amber-600'
                : 'bg-emerald-600'
            }`}>
              {status === 'HIGH_RISK' ? (
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              ) : status === 'MODERATE_RISK' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-normal tracking-tight">
                  {status === 'HIGH_RISK'
                    ? 'Critical Pharmacological Interaction Detected'
                    : status === 'MODERATE_RISK'
                    ? 'Moderate Medication Caution Advisory'
                    : 'Deterministic DDI Safety Clear'}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                  status === 'HIGH_RISK'
                    ? 'bg-red-200 text-red-900'
                    : status === 'MODERATE_RISK'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs mt-1 text-[#4e4e4e] max-w-2xl">
                Cross-prescription engine evaluates normalized canonical active salts against pre-existing active medications to prevent silent gastrointestinal bleeding and acute renal toxicity.
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-3xl font-serif font-normal">{conflicts.length}</span>
            <span className="block text-[11px] text-[#777169] uppercase font-medium">Active Conflicts</span>
          </div>
        </div>
      </div>

      {/* Active Conflict Detail Cards */}
      {conflicts.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-semibold tracking-wider text-[#777169] uppercase px-1">
            Detected High-Risk Drug Interaction Cards ({conflicts.length})
          </h4>

          {conflicts.map((conflict: any, idx: number) => (
            <div
              key={idx}
              className={`rounded-3xl p-5 border bg-white shadow-xs space-y-4 ${
                conflict.severity === 'HIGH_RISK' ? 'border-red-300 ring-1 ring-red-200' : 'border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-white ${conflict.severity === 'HIGH_RISK' ? 'bg-red-600' : 'bg-amber-600'}`}>
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-normal text-[#0c0a09]">
                      {conflict.title}
                    </h4>
                    <p className="text-xs text-[#777169]">
                      Conflicting Molecules: <strong className="text-[#292524]">{conflict.conflicting_salts?.join(' ⚡ ')}</strong>
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                  conflict.severity === 'HIGH_RISK' ? 'badge-high' : 'badge-mild'
                }`}>
                  <span className={conflict.severity === 'HIGH_RISK' ? 'dot-high' : 'dot-mild'} />
                  {conflict.severity === 'HIGH_RISK' ? 'HIGH RISK' : 'MILD RISK'}
                </span>
              </div>

              {/* Brands involved */}
              <div className="p-3 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] flex items-center justify-between text-xs">
                <span className="text-[#4e4e4e]">
                  Conflicting Trade Brands: <strong className="text-[#0c0a09] font-medium">{conflict.conflicting_brands?.join(', ')}</strong>
                </span>
                <span className="text-[#9e1068] font-semibold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> High Bleeding Risk
                </span>
              </div>

              <div className="text-xs text-[#292524] leading-relaxed">
                <strong>Pharmacological Explanation: </strong>
                {conflict.description}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fffbe6] border border-[#ffe58f] text-xs text-[#873800] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#873800] shrink-0 mt-0.5" />
                <div>
                  <strong>Clinical Action Protocol: </strong>
                  {conflict.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient Active Medication List & Add Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Active Med List (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-[#e7e5e4] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-[#777169]" />
              <h4 className="font-serif text-lg font-normal text-[#0c0a09]">
                Patient Active Medication Inventory
              </h4>
            </div>
            <span className="text-xs text-[#777169]">
              {currentMedicines.length} Pills Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {currentMedicines.map((med, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] flex items-center justify-between gap-3 hover:bg-white transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-medium text-[#0c0a09]">
                      {med.brand_name}
                    </span>
                    <span className="text-xs text-[#777169]">({med.dosage})</span>
                  </div>
                  <p className="text-[11px] text-[#777169] mt-0.5">
                    Salt Array: <code className="text-[#292524] bg-[#f0efed] px-1.5 py-0.5 rounded text-[10px]">{JSON.stringify(med.active_salts || [med.brand_name.toLowerCase()])}</code>
                  </p>
                </div>

                <button
                  onClick={() => onRemoveMedication(idx)}
                  className="p-2 rounded-full text-[#777169] hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Cross-Prescription Med (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-[#e7e5e4] p-5 shadow-xs space-y-4">
          <h4 className="font-serif text-lg font-normal text-[#0c0a09]">
            Add External Doctor Prescription
          </h4>
          <p className="text-xs text-[#777169]">
            Simulate a prescription written by a second specialist (e.g. Orthopedic painkiller or Acid Reducer) to test active conflict radar.
          </p>

          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#4e4e4e] mb-1">
                Indian Trade Brand Name
              </label>
              <input
                type="text"
                required
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="e.g. Combiflam, Voveran, Ecosprin, Pan-D"
                className="w-full px-3.5 py-2 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] text-xs text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4e4e4e] mb-1">
                Dosage & Strength
              </label>
              <input
                type="text"
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="e.g. 400 mg / 1 tablet"
                className="w-full px-3.5 py-2 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] text-xs text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-full bg-[#292524] text-white text-xs font-medium hover:bg-[#0c0a09] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Evaluate DDI Conflict</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
