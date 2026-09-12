import React, { useState } from 'react';
import { FileCode, Copy, Download, Check, ShieldCheck, Database, Send, ExternalLink } from 'lucide-react';

interface TabFHIRProps {
  fhirBundle: any;
}

export default function TabFHIR({ fhirBundle }: TabFHIRProps) {
  const [copied, setCopied] = useState(false);
  const [pushedToAbdm, setPushedToAbdm] = useState(false);

  const jsonString = JSON.stringify(fhirBundle || {}, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ABDM_FHIR_Bundle_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePushAbdm = () => {
    setPushedToAbdm(true);
    setTimeout(() => setPushedToAbdm(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Exporter Banner */}
      <div className="bg-white rounded-3xl border border-[#e7e5e4] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#292524] text-white flex items-center justify-center shadow-xs shrink-0">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-2xl font-normal text-[#0c0a09]">
                HL7 FHIR R4 Bundle Exporter
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold badge-neutral inline-flex items-center gap-1.5">
                <span className="dot-normal" />
                ABDM Interoperable
              </span>
            </div>
            <p className="text-xs text-[#777169] mt-1 max-w-2xl">
              Converts unstructured Indian paper prescriptions directly into official HL7 FHIR R4 JSON schemas (OPConsultation, MedicationRequest, DiagnosticReport) ready to plug into India's national ABHA ecosystem.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#e7e5e4] text-[#292524] text-xs font-medium hover:bg-[#f0efed] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#292524] text-white text-xs font-medium hover:bg-[#0c0a09] transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download ABDM Bundle</span>
          </button>
        </div>
      </div>

      {/* ABDM Gateway Push Simulation Bar */}
      <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-[#777169]" />
          <div className="text-xs">
            <span className="font-semibold text-[#0c0a09]">Ayushman Bharat Digital Mission (ABDM) Gateway: </span>
            <span className="text-[#777169]">Simulate direct submission to patient ABHA Health Locker</span>
          </div>
        </div>

        <button
          onClick={handlePushAbdm}
          disabled={pushedToAbdm}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
            pushedToAbdm
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {pushedToAbdm ? (
            <>
              <Check className="w-4 h-4" />
              <span>Pushed to ABHA Locker (ID: 91-8827-1092)</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Push to ABHA Digital Locker</span>
            </>
          )}
        </button>
      </div>

      {/* JSON Viewer */}
      <div className="bg-[#0c0a09] text-[#f5f5f5] rounded-3xl p-6 border border-[#292524] shadow-xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1c1917]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono text-[#a8a29e] ml-2">fhir_r4_bundle.json</span>
          </div>
          <span className="text-[11px] font-mono text-[#777169]">Profile: ndhm/fhir/r4/DocumentBundle</span>
        </div>

        <pre className="font-mono text-xs text-emerald-400 overflow-x-auto max-h-[500px] p-2 leading-relaxed selection:bg-emerald-900 selection:text-white">
          {jsonString}
        </pre>
      </div>
    </div>
  );
}
