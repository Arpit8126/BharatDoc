import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Upload, Volume2, Pause, Eye, ShieldAlert, TrendingUp,
  FileCode, Globe, ChevronDown, LogOut, Check, RefreshCw,
  HelpCircle, Send, AlertOctagon, AlertTriangle, ShieldCheck, Pill,
  Plus, Trash2, Activity, Download, Copy, Database, CloudUpload,
  FileText, Sparkles, ArrowRight, X, MessageSquare, FlaskConical
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  ReferenceLine, CartesianGrid
} from 'recharts';
import { LANGUAGES, LangCode, useTranslation } from '../lib/i18n';
import { savePrescriptionToSupabase, saveLabReportToSupabase, fetchLabReportsFromSupabase } from '../lib/supabase';

const BACKEND = 'http://localhost:8000';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Medicine {
  brand_name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration?: string;
  active_salts: string[];
  purpose_what_it_does?: string;
  parhez_precautions?: string;
  instructions_hi?: string;
  box_2d?: number[];
}

interface PrescriptionData {
  doctor_name: string;
  patient_name: string;
  date: string;
  diagnosis: string;
  condition_summary?: string;
  dietary_lifestyle_parhez?: string[];
  medicines: Medicine[];
}

interface HistoryItem {
  id: number;
  date: string;
  doctor_name: string;
  patient_name: string;
  prescription: PrescriptionData;
  processed_b64: string;
  imgDims: { naturalWidth: number; naturalHeight: number };
  ddi_safety: any;
  fhir_bundle: any;
}

interface Props {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  user: any;
  setUser: (u: any) => void;
}

type Tab = 'audit' | 'ddi' | 'lab_analysis' | 'health_trends' | 'fhir';

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard({ lang, setLang, user, setUser }: Props) {
  const t = useTranslation(lang);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('audit');
  const [langOpen, setLangOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Clinical state — all null until upload
  const [prescription, setPrescription] = useState<PrescriptionData | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [processedImg, setProcessedImg] = useState<string>('');
  const [imgDims, setImgDims] = useState({ naturalWidth: 1000, naturalHeight: 1250 });
  const [ddiData, setDdiData] = useState<any>(null);
  const [fhirBundle, setFhirBundle] = useState<any>(null);

  // Upload history persistence
  const [uploadHistory, setUploadHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('bharatdoc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Chat Modal State & Auto-scroll Ref
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Canvas
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMed, setSelectedMed] = useState<number>(-1);
  const [hoveredMed, setHoveredMed] = useState<number>(-1);

  // Multi-prescription state for DDI tab
  const [multiPrescriptions, setMultiPrescriptions] = useState<any[]>([]);
  const [multiDdiData, setMultiDdiData] = useState<any>(null);
  const [multiUploading, setMultiUploading] = useState(false);

  // Dedicated DDI Chatbot state & Modal
  const [isDdiChatOpen, setIsDdiChatOpen] = useState(false);
  const [ddiChatMsgs, setDdiChatMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [ddiChatInput, setDdiChatInput] = useState('');
  const [ddiChatLoading, setDdiChatLoading] = useState(false);
  const ddiChatEndRef = useRef<HTMLDivElement>(null);

  // Single Lab Report Analysis tab state
  const [labReportData, setLabReportData] = useState<any>(null);
  const [labUploading, setLabUploading] = useState(false);
  const [isLabChatOpen, setIsLabChatOpen] = useState(false);
  const [labChatMsgs, setLabChatMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [labChatInput, setLabChatInput] = useState('');
  const [labChatLoading, setLabChatLoading] = useState(false);
  const labChatEndRef = useRef<HTMLDivElement>(null);

  // Health Trends longitudinal 6-month state
  const [healthTrendHistory, setHealthTrendHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('bharatdoc_lab_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedTrendMetric, setSelectedTrendMetric] = useState<string>('HbA1c (Glycated Hemoglobin)');
  const [isTrendChatOpen, setIsTrendChatOpen] = useState(false);
  const [trendChatMsgs, setTrendChatMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [trendChatInput, setTrendChatInput] = useState('');
  const [trendChatLoading, setTrendChatLoading] = useState(false);
  const trendChatEndRef = useRef<HTMLDivElement>(null);

  // Chat
  const [chatMsgs, setChatMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Auto-scroll chat view to bottom when new messages arrive or loading state changes
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMsgs, chatLoading, isChatOpen]);

  useEffect(() => {
    if (isDdiChatOpen) {
      ddiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ddiChatMsgs, ddiChatLoading, isDdiChatOpen]);

  useEffect(() => {
    if (isLabChatOpen) {
      labChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [labChatMsgs, labChatLoading, isLabChatOpen]);

  useEffect(() => {
    if (isTrendChatOpen) {
      trendChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trendChatMsgs, trendChatLoading, isTrendChatOpen]);

  // Markdown & Table formatting helper
  const renderFormattedMessage = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    // Filter out separator lines like | :--- | :--- |
    const cleanLines = lines.filter(l => !l.trim().match(/^\|(?:\s*:?-+:?\s*\|)+$/));

    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {cleanLines.map((line, idx) => {
          let l = line.trim();
          if (!l) return <div key={idx} className="h-1" />;
          if (l.startsWith('---')) return <hr key={idx} className="my-2 border-[#e7e5e4]" />;

          // Parse Markdown pipe table rows | Col1 | Col2 |
          if (l.startsWith('|') && l.endsWith('|')) {
            const cells = l.split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
            if (cells.length > 0) {
              return (
                <div key={idx} className="my-1.5 p-2 rounded-xl bg-[#fafafa] border border-[#e7e5e4] flex flex-wrap gap-2 text-xs">
                  {cells.map((cell, cIdx) => {
                    const cleanCell = cell.replace(/\*\*/g, '');
                    return (
                      <span key={cIdx} className="px-2 py-1 bg-white rounded-lg border border-[#e7e5e4] font-medium text-[#292524]">
                        {cleanCell}
                      </span>
                    );
                  })}
                </div>
              );
            }
          }

          if (l.startsWith('###') || l.startsWith('##') || l.startsWith('#')) {
            l = l.replace(/^#+\s*/, '');
            return <h5 key={idx} className="font-serif text-sm font-semibold text-[#0c0a09] mt-2 mb-1">{l.replace(/\*\*/g, '')}</h5>;
          }

          const isBullet = l.startsWith('* ') || l.startsWith('- ') || l.startsWith('• ');
          if (isBullet) l = l.substring(2).trim();

          const parts = l.split(/(\*\*.*?\*\*)/g);
          const content = parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-semibold text-[#0c0a09]">{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          return isBullet ? (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="text-emerald-600 font-bold text-xs mt-0.5">•</span>
              <div className="flex-1">{content}</div>
            </div>
          ) : (
            <p key={idx}>{content}</p>
          );
        })}
      </div>
    );
  };

  // Audio
  const [speaking, setSpeaking] = useState(false);

  // Lab
  const [activeMetric, setActiveMetric] = useState<'hba1c' | 'glucose' | 'creatinine'>('hba1c');

  // DDI add med
  const [newBrand, setNewBrand] = useState('');
  const [newDosage, setNewDosage] = useState('');

  // FHIR copy/push & ABHA ID
  const [copied, setCopied] = useState(false);
  const [pushed, setPushed] = useState(false);
  const [customAbhaId, setCustomAbhaId] = useState('');

  // ── Canvas ──────────────────────────────────────────────────────────────────
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !processedImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = img.clientWidth, H = img.clientHeight;
    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    medicines.forEach((m, i) => {
      if (!m.box_2d || m.box_2d.length < 4) return;
      const [ymin, xmin, ymax, xmax] = m.box_2d;
      const px = (xmin / 1000) * W;
      const py = (ymin / 1000) * H;
      const pw = ((xmax - xmin) / 1000) * W;
      const ph = ((ymax - ymin) / 1000) * H;
      const isActive = selectedMed === i || hoveredMed === i;

      ctx.setLineDash(isActive ? [] : [5, 4]);
      ctx.lineWidth = isActive ? 2.5 : 1.5;
      ctx.strokeStyle = isActive ? '#dc2626' : 'rgba(41,37,36,0.35)';
      if (isActive) {
        ctx.fillStyle = 'rgba(220,38,38,0.10)';
        ctx.fillRect(px, py, pw, ph);
      }
      ctx.strokeRect(px, py, pw, ph);

      if (isActive) {
        ctx.setLineDash([]);
        const labelW = Math.min(pw, 150), lH = 20;
        ctx.fillStyle = '#0c0a09';
        ctx.fillRect(px, Math.max(0, py - lH), labelW, lH);
        ctx.fillStyle = '#fff';
        ctx.font = '500 11px Inter,sans-serif';
        ctx.fillText(m.brand_name.substring(0, 18), px + 5, Math.max(14, py - 5));
      }
    });
    ctx.setLineDash([]);
  }, [medicines, selectedMed, hoveredMed, processedImg]);

  useEffect(() => { redrawCanvas(); }, [redrawCanvas]);

  useEffect(() => {
    window.addEventListener('resize', redrawCanvas);
    return () => window.removeEventListener('resize', redrawCanvas);
  }, [redrawCanvas]);

  // ── Select item from history ────────────────────────────────────────────────
  const loadHistoryItem = (item: HistoryItem) => {
    setPrescription(item.prescription);
    setMedicines(item.prescription?.medicines ?? []);
    setProcessedImg(item.processed_b64 ?? '');
    setImgDims(item.imgDims);
    setDdiData(item.ddi_safety ?? null);
    setFhirBundle(item.fhir_bundle ?? null);
    setHasData(true);
    setSelectedMed(0);
    setChatMsgs([{
      role: 'bot',
      text: `📂 Loaded saved prescription for ${item.patient_name} (${item.date}). Ask any question about this document!`
    }]);
  };

  // ── Voice Briefing ──────────────────────────────────────────────────────────
  const handleVoice = () => {
    if (!prescription) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const text = lang === 'hi'
      ? `नमस्ते। आपकी पर्ची में ${medicines.length} दवाएं हैं। ${medicines.map(m => m.instructions_hi || m.brand_name).join('. ')}`
      : `Your prescription from ${prescription.doctor_name} has ${medicines.length} medicine${medicines.length !== 1 ? 's' : ''}. ${medicines.map(m => `${m.brand_name}: take ${m.timing}`).join('. ')}`;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANGUAGES.find(l => l.code === lang)?.speechCode ?? 'en-IN';
    u.rate = 0.88;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  // ── Upload ──────────────────────────────────────────────────────────────────
  const handleUpload = async (file: File) => {
    setUploading(true);
    setHasData(false);
    setPrescription(null);
    setMedicines([]);
    setProcessedImg('');
    setDdiData(null);
    setFhirBundle(null);
    setChatMsgs([]);
    setSelectedMed(-1);

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch(`${BACKEND}/api/process-prescription`, {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const d = await res.json();

      const pData = d.prescription ?? null;
      const meds = pData?.medicines ?? [];
      const imgB64 = d.image_metadata?.processed_b64 ?? '';
      const dims = {
        naturalWidth: d.image_metadata?.naturalWidth ?? 1000,
        naturalHeight: d.image_metadata?.naturalHeight ?? 1250,
      };

      setPrescription(pData);
      setMedicines(meds);
      setProcessedImg(imgB64);
      setImgDims(dims);
      setDdiData(d.ddi_safety ?? null);
      setFhirBundle(d.fhir_bundle ?? null);
      setHasData(true);

      // Async cloud sync to Supabase database
      savePrescriptionToSupabase(pData, d.ddi_safety, d.fhir_bundle);

      // Save to upload history safely
      const historyItem: HistoryItem = {
        id: Date.now(),
        date: pData?.date || new Date().toISOString().split('T')[0],
        doctor_name: pData?.doctor_name || 'Prescription Scan',
        patient_name: pData?.patient_name || 'Patient',
        prescription: pData,
        processed_b64: imgB64,
        imgDims: dims,
        ddi_safety: d.ddi_safety,
        fhir_bundle: d.fhir_bundle,
      };

      setUploadHistory(prev => {
        const updated = [historyItem, ...prev.filter(h => h.id !== historyItem.id)].slice(0, 10);
        try {
          // Omit heavy base64 string for persistent storage to stay within browser 5MB quota
          const storageLight = updated.map(h => ({ ...h, processed_b64: '' }));
          localStorage.setItem('bharatdoc_history', JSON.stringify(storageLight));
        } catch (e) {
          console.warn('[LocalStorage Quota Exceeded]: Could not persist history to localStorage', e);
        }
        return updated;
      });

      setChatMsgs([{
        role: 'bot',
        text: `✅ Analyzed prescription for ${pData?.patient_name || 'Patient'}. Extracted ${meds.length} items. Ask me anything about dosage, timing, or dietary precautions (Parhez)!`,
      }]);
      setSelectedMed(0);
    } catch (err: any) {
      setChatMsgs([{
        role: 'bot',
        text: `❌ Could not process this image: ${err.message}. Make sure the backend server is running and upload a clear prescription photo.`,
      }]);
    } finally {
      setUploading(false);
    }
  };

  // ── Grounded AI Chat ────────────────────────────────────────────────────────
  const handleChat = async (q?: string) => {
    const query = (q || chatInput).trim();
    if (!query || !hasData) return;

    const newMsgs = [...chatMsgs, { role: 'user' as const, text: query }];
    setChatMsgs(newMsgs);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch(`${BACKEND}/api/chat-grounded`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          prescription_data: prescription,
          chat_history: newMsgs,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setChatMsgs(prev => [...prev, { role: 'bot', text: d.reply }]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setChatMsgs(prev => [...prev, {
        role: 'bot',
        text: `Based on your prescription from ${prescription?.doctor_name || 'your doctor'}, you have ${medicines.length} items prescribed. Please follow exact dosage timing and consult your doctor for changes.`,
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // ── Multi-Prescription Batch Upload for DDI ─────────────────────────────────
  const handleMultiUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setMultiUploading(true);
    setMultiPrescriptions([]);
    setMultiDdiData(null);
    setDdiChatMsgs([]);

    const fd = new FormData();
    Array.from(files).forEach(file => fd.append('files', file));

    try {
      const res = await fetch(`${BACKEND}/api/process-multiple-prescriptions`, {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      setMultiPrescriptions(data.prescriptions || []);
      setMultiDdiData(data.ddi_safety || null);

      setDdiChatMsgs([{
        role: 'bot',
        text: `📂 Successfully analyzed ${data.prescriptions?.length || 0} prescription slips containing ${data.total_medicines || 0} total medications. Ask any question about combining these prescriptions!`,
      }]);
    } catch (e) {
      console.error('[MultiUpload Error]', e);
    } finally {
      setMultiUploading(false);
    }
  };

  // ── Dedicated DDI Poly-Pharmacy AI Assistant ────────────────────────────────
  const handleDdiChat = async (q?: string) => {
    const query = (q || ddiChatInput).trim();
    if (!query || multiPrescriptions.length === 0) return;

    const newMsgs = [...ddiChatMsgs, { role: 'user' as const, text: query }];
    setDdiChatMsgs(newMsgs);
    setDdiChatInput('');
    setDdiChatLoading(true);

    const combinedContext = {
      total_prescriptions_uploaded: multiPrescriptions.length,
      prescriptions: multiPrescriptions.map(p => ({
        doctor_name: p.doctor_name,
        patient_name: p.patient_name,
        diagnosis: p.diagnosis,
        medicines: p.medicines,
      })),
      cross_prescription_ddi_conflicts: multiDdiData,
    };

    try {
      const res = await fetch(`${BACKEND}/api/chat-grounded`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          prescription_data: combinedContext,
          chat_history: newMsgs,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setDdiChatMsgs(prev => [...prev, { role: 'bot', text: d.reply }]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setDdiChatMsgs(prev => [...prev, {
        role: 'bot',
        text: `Based on your ${multiPrescriptions.length} uploaded prescriptions, please follow exact doctor dosage timing and consult your physician before combining medications.`,
      }]);
    } finally {
      setDdiChatLoading(false);
    }
  };

  // ── Single Lab Report Upload & Analysis ─────────────────────────────────────
  const handleLabReportUpload = async (file: File) => {
    setLabUploading(true);
    setLabReportData(null);
    setLabChatMsgs([]);

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch(`${BACKEND}/api/process-lab-report`, {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const labReport = data.lab_report;

      setLabReportData(labReport);
      if (data.fhir_bundle) {
        setFhirBundle(data.fhir_bundle);
      }
      
      // Auto-accumulate into 6-month longitudinal health trend history
      setHealthTrendHistory(prev => {
        const updated = [labReport, ...prev];
        try {
          localStorage.setItem('bharatdoc_lab_history', JSON.stringify(updated.slice(0, 20)));
        } catch (e) {
          console.warn('[LocalStorage Quota Exceeded]: Could not persist lab report history', e);
        }
        return updated;
      });

      // Save to Supabase Cloud Database
      saveLabReportToSupabase(labReport);

      setLabChatMsgs([{
        role: 'bot',
        text: `🧪 Analyzed diagnostic lab report: ${labReport?.report_title || 'Lab Report'} (${labReport?.test_date || 'Today'}). Ask any question about your lab parameters, normal ranges, or clinical terms!`,
      }]);
    } catch (e) {
      console.error('[LabUpload Error]', e);
    } finally {
      setLabUploading(false);
    }
  };

  // ── Dedicated Lab Report AI Assistant Chat Handler ──────────────────────────
  const handleLabChat = async (q?: string) => {
    const query = (q || labChatInput).trim();
    if (!query || !labReportData) return;

    const newMsgs = [...labChatMsgs, { role: 'user' as const, text: query }];
    setLabChatMsgs(newMsgs);
    setLabChatInput('');
    setLabChatLoading(true);

    try {
      const res = await fetch(`${BACKEND}/api/chat-grounded`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          prescription_data: labReportData,
          chat_history: newMsgs,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setLabChatMsgs(prev => [...prev, { role: 'bot', text: d.reply }]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setLabChatMsgs(prev => [...prev, {
        role: 'bot',
        text: `Based on your uploaded report ${labReportData?.report_title || 'diagnostic scan'}, please consult your attending physician for medical management.`,
      }]);
    } finally {
      setLabChatLoading(false);
    }
  };

  // ── Dedicated Health Trends AI Assistant Chat Handler ────────────────────────
  const handleTrendChat = async (q?: string) => {
    const query = (q || trendChatInput).trim();
    if (!query || healthTrendHistory.length === 0) return;

    const newMsgs = [...trendChatMsgs, { role: 'user' as const, text: query }];
    setTrendChatMsgs(newMsgs);
    setTrendChatInput('');
    setTrendChatLoading(true);

    const trendContext = {
      total_reports_logged: healthTrendHistory.length,
      longitudinal_lab_history: healthTrendHistory,
    };

    try {
      const res = await fetch(`${BACKEND}/api/chat-grounded`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          prescription_data: trendContext,
          chat_history: newMsgs,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setTrendChatMsgs(prev => [...prev, { role: 'bot', text: d.reply }]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setTrendChatMsgs(prev => [...prev, {
        role: 'bot',
        text: `Based on your ${healthTrendHistory.length} historical lab reports, your parameters are being tracked over time. Please share telemetry trends with your physician.`,
      }]);
    } finally {
      setTrendChatLoading(false);
    }
  };

  // ── DDI add ─────────────────────────────────────────────────────────────────
  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim()) return;
    const med: Medicine = {
      brand_name: newBrand,
      dosage: newDosage || 'Standard',
      frequency: 'OD', timing: 'As directed',
      active_salts: [newBrand.toLowerCase()],
    };
    const updated = [...medicines, med];
    setMedicines(updated);
    setNewBrand(''); setNewDosage('');
    try {
      const res = await fetch(`${BACKEND}/api/ddi-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: updated }),
      });
      if (res.ok) setDdiData(await res.json());
    } catch { }
  };

  // ── Lab data (static trend until lab upload feature) ─────────────────────────
  const LAB_DATA: Record<string, { label: string; unit: string; max: number; data: { date: string; value: number }[] }> = {
    hba1c:     { label: 'HbA1c (Glycated Hemoglobin)', unit: '%',      max: 5.7,  data: [{ date: 'Sep 25', value: 8.4 }, { date: 'Dec 25', value: 7.9 }, { date: 'Mar 26', value: 7.6 }, { date: 'Jun 26', value: 7.4 }, { date: 'Sep 26', value: 6.9 }] },
    glucose:   { label: 'Fasting Blood Sugar',         unit: 'mg/dL',  max: 99,   data: [{ date: 'Sep 25', value: 185 }, { date: 'Dec 25', value: 162 }, { date: 'Mar 26', value: 150 }, { date: 'Jun 26', value: 142 }, { date: 'Sep 26', value: 128 }] },
    creatinine:{ label: 'Serum Creatinine',            unit: 'mg/dL',  max: 1.3,  data: [{ date: 'Sep 25', value: 1.2  }, { date: 'Dec 25', value: 1.15 }, { date: 'Mar 26', value: 1.1  }, { date: 'Jun 26', value: 1.08 }, { date: 'Sep 26', value: 1.05 }] },
  };

  const dynamicFhirBundle = React.useMemo(() => {
    if (!fhirBundle) return null;
    const cloned = JSON.parse(JSON.stringify(fhirBundle));
    if (cloned.entry?.[0]?.resource) {
      if (customAbhaId.trim()) {
        cloned.entry[0].resource.identifier = [{
          type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MR", display: "Medical Record Number" }] },
          system: "https://healthid.ndhm.gov.in",
          value: customAbhaId.trim()
        }];
      } else {
        cloned.entry[0].resource.identifier = [];
      }
    }
    return cloned;
  }, [fhirBundle, customAbhaId]);

  const fhirJson = dynamicFhirBundle ? JSON.stringify(dynamicFhirBundle, null, 2) : null;
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // ── Tabs config ─────────────────────────────────────────────────────────────
  const tabs: { key: Tab; label: string; icon: any; badge?: string }[] = [
    { key: 'audit',         label: t.dash_tab_audit,      icon: Eye },
    { key: 'ddi',           label: t.dash_tab_ddi,        icon: ShieldAlert, badge: (multiDdiData?.status === 'HIGH_RISK') ? '!' : undefined },
    { key: 'lab_analysis',  label: 'Lab Report Analysis', icon: FlaskConical },
    { key: 'health_trends', label: 'Health Trends',       icon: TrendingUp },
    { key: 'fhir',          label: t.dash_tab_fhir,       icon: FileCode },
  ];

  // ── Upload CTA (shared) ─────────────────────────────────────────────────────
  const UploadCTA = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => (
    <label className={`cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#292524] text-white font-medium hover:bg-[#0c0a09] transition-all shadow-sm ${size === 'lg' ? 'px-7 py-3.5 text-sm' : size === 'sm' ? 'px-3.5 py-2 text-xs' : 'px-5 py-2.5 text-xs'}`}>
      <Upload className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {t.dash_upload_btn}
      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
    </label>
  );

  // ── Empty State ─────────────────────────────────────────────────────────────
  const EmptyState = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#f0efed] flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-[#a8a29e]" />
      </div>
      <h3 className="font-serif text-xl text-[#0c0a09] mb-2">{title}</h3>
      <p className="text-sm text-[#777169] mb-6 max-w-sm">{subtitle}</p>
      <UploadCTA size="md" />
    </div>
  );

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#292524] relative overflow-x-hidden">
      {/* Ambient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#a7e5d3] to-[#f4c5a8] rounded-full opacity-15 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#c8b8e0] to-[#a8c8e8] rounded-full opacity-15 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f5f5f5]/85 backdrop-blur-xl border-b border-[#e7e5e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#292524] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#a7e5d3] to-[#f4c5a8] opacity-40" />
              <Shield className="w-4 h-4 text-white relative z-10" />
            </div>
            <span className="font-serif text-lg text-[#0c0a09] hidden sm:block">BharatDoc</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="relative hidden sm:block">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium bg-white border border-[#e7e5e4] text-[#292524] hover:bg-[#f0efed] transition-all">
                <Globe className="w-3 h-3 text-[#777169]" />
                <span className="max-w-[60px] truncate">{LANGUAGES.find(l => l.code === lang)?.name}</span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#e7e5e4] rounded-2xl shadow-xl py-2 z-50 max-h-72 overflow-y-auto">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-[#f5f5f5] transition-colors flex items-center justify-between ${lang === l.code ? 'font-semibold text-[#0c0a09] bg-[#f0efed]' : 'text-[#4e4e4e]'}`}>
                      {l.label}
                      {lang === l.code && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User avatar */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e7e5e4] rounded-full text-xs text-[#292524]">
              <div className="w-5 h-5 rounded-full bg-[#292524] text-white flex items-center justify-center text-[10px] font-medium">
                {userName[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block max-w-[100px] truncate font-medium">{userName}</span>
            </div>

            <button onClick={() => { setUser(null); navigate('/'); }}
              className="p-2 rounded-full text-[#777169] hover:bg-[#f0efed] hover:text-[#0c0a09] transition-all" title={t.nav_signout}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 relative z-10">

        {/* Tabs */}
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex p-1 rounded-full bg-white/90 border border-[#e7e5e4] shadow-sm backdrop-blur-sm gap-0.5 min-w-max">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`relative inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key ? 'bg-[#292524] text-white shadow-xs' : 'text-[#4e4e4e] hover:text-[#0c0a09] hover:bg-[#f0efed]'}`}>
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">!</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: AUDIT */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'audit' && (
          <div className="space-y-5">
            {/* Upload History Selector */}
            {uploadHistory.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="font-semibold text-[#777169] text-[10px] uppercase tracking-wider shrink-0">Upload History:</span>
                {uploadHistory.map(item => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className={`shrink-0 px-3 py-1.5 rounded-full border transition-all ${
                      prescription?.patient_name === item.patient_name && prescription?.date === item.date
                        ? 'bg-[#292524] text-white border-[#292524] font-medium'
                        : 'bg-white border-[#e7e5e4] text-[#4e4e4e] hover:bg-[#f0efed]'
                    }`}
                  >
                    📄 {item.patient_name.substring(0, 15)} ({item.date})
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

              {/* Left Canvas Panel (100% Fixed/Sticky in Viewport) */}
              <div className="lg:col-span-7 lg:sticky lg:top-20 bg-white rounded-3xl border border-[#e7e5e4] p-5 shadow-xs flex flex-col space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0efed] shrink-0">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#292524]">
                    <span className={`w-2 h-2 rounded-full ${hasData ? 'bg-emerald-500 animate-pulse' : 'bg-[#d6d3d1]'}`} />
                    {hasData ? t.audit_canvas_label : 'Prescription Canvas'}
                  </div>
                  <UploadCTA size="sm" />
                </div>

                <div className="relative w-full bg-[#fafafa] rounded-2xl border border-[#e7e5e4] flex items-center justify-center p-3 overflow-hidden shrink-0">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3 p-8 min-h-[260px] justify-center">
                      <RefreshCw className="w-8 h-8 text-[#292524] animate-spin" />
                      <p className="text-xs text-[#777169] text-center font-medium">
                        Running OpenCV CLAHE normalization & Gemini vision…
                      </p>
                      <p className="text-[11px] text-[#a8a29e] text-center">
                        Extracting medicines with pixel-accurate bounding boxes
                      </p>
                    </div>
                  ) : processedImg ? (
                    <div className="relative inline-flex items-center justify-center max-w-full">
                      <img
                        ref={imgRef}
                        src={`data:image/jpeg;base64,${processedImg}`}
                        alt="Processed prescription"
                        onLoad={redrawCanvas}
                        className="max-w-full max-h-[420px] w-auto h-auto object-contain rounded-xl shadow-md block"
                      />
                      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 p-8 text-center min-h-[260px] justify-center">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#a7e5d3] to-[#c8b8e0] flex items-center justify-center opacity-60">
                        <CloudUpload className="w-8 h-8 text-[#292524]" />
                      </div>
                      <div>
                        <p className="font-serif text-base text-[#0c0a09] mb-1">{t.audit_upload_label}</p>
                        <p className="text-xs text-[#777169]">{t.audit_upload_hint}</p>
                      </div>
                      <UploadCTA size="md" />
                    </div>
                  )}
                </div>

                {/* Instant Patient Summary & Interactive Action Bar */}
                {hasData && prescription && (
                  <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-[#0c0a09] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Instant Condition Summary &amp; Treatment Action Plan</span>
                      </h4>
                    </div>

                    {prescription.condition_summary ? (
                      <p className="text-xs text-[#292524] leading-relaxed">
                        {prescription.condition_summary}
                      </p>
                    ) : (
                      <p className="text-xs text-[#4e4e4e]">
                        Patient <strong>{prescription.patient_name}</strong> was evaluated for <strong>{prescription.diagnosis}</strong>.
                      </p>
                    )}

                    {/* Interactive Action Buttons Bar */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => {
                          const element = document.getElementById('medicine-list-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#292524] text-white text-xs font-medium hover:bg-[#0c0a09] transition-all"
                      >
                        🩺 Full Medicine Guide ({medicines.length})
                      </button>

                      <button
                        onClick={() => {
                          const element = document.getElementById('parhez-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-mild text-xs font-medium hover:opacity-90 transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="dot-mild" />
                        🥗 Diet &amp; Parhez Rules
                      </button>

                      <button
                        onClick={() => setActiveTab('ddi')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-high text-xs font-medium hover:opacity-90 transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="dot-high" />
                        ⚡ Drug Safety Radar ({ddiData?.conflict_count ?? 0})
                      </button>

                      <button
                        onClick={() => setActiveTab('fhir')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-normal text-xs font-medium hover:opacity-90 transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="dot-normal" />
                        📋 ABDM FHIR Locker
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel (Scrollable Medicines List) */}
              <div className="lg:col-span-5 space-y-4 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:pr-2.5">

                {/* Prescription header */}
                {hasData && prescription ? (
                  <div className="bg-white rounded-3xl border border-[#e7e5e4] p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold text-[#777169] uppercase tracking-wider mb-0.5">Prescription Audit Report</p>
                        <h3 className="font-serif text-lg text-[#0c0a09]">{prescription.doctor_name}</h3>
                        <p className="text-xs text-[#777169] mt-0.5">
                          {t.audit_patient}: <strong className="text-[#292524]">{prescription.patient_name}</strong>
                          {prescription.date ? ` · ${prescription.date}` : ''}
                        </p>
                      </div>
                      <button onClick={handleVoice}
                        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${speaking ? 'bg-amber-600 text-white animate-pulse' : 'bg-[#292524] text-white hover:bg-[#0c0a09]'}`}>
                        {speaking ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span className="hidden sm:block">{speaking ? t.audit_playing : t.audit_listen}</span>
                      </button>
                    </div>
                    {prescription.diagnosis && (
                      <div className="p-3 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] text-xs text-[#4e4e4e]">
                        <strong className="text-[#0c0a09]">{t.audit_diagnosis}: </strong>{prescription.diagnosis}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#e7e5e4] p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#f0efed] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#a8a29e]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#292524]">No prescription uploaded</p>
                        <p className="text-xs text-[#777169]">Upload to extract doctor, patient &amp; diagnosis details</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dietary & Parhez Precautions Card */}
                {hasData && prescription?.dietary_lifestyle_parhez && prescription.dietary_lifestyle_parhez.length > 0 && (
                  <div id="parhez-section" className="bg-amber-50/80 rounded-3xl border border-amber-200 p-5 shadow-xs space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Dietary &amp; Lifestyle Precautions (Parhez)</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-950 pl-4 list-disc">
                      {prescription.dietary_lifestyle_parhez.map((rule, idx) => (
                        <li key={idx} className="leading-relaxed">{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Medicine cards */}
                {hasData && medicines.length > 0 ? (
                  <div id="medicine-list-section" className="space-y-3">
                    <p className="text-[10px] font-semibold text-[#777169] uppercase tracking-wider px-1">
                      {t.audit_meds_title} ({medicines.length})
                    </p>
                    {medicines.map((m, i) => (
                      <div key={i}
                        onClick={() => setSelectedMed(i)}
                        onMouseEnter={() => setHoveredMed(i)}
                        onMouseLeave={() => setHoveredMed(-1)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 ${
                          selectedMed === i
                            ? 'bg-white border-[#292524] ring-1 ring-[#292524] shadow-md'
                            : 'bg-white/70 border-[#e7e5e4] hover:bg-white hover:border-[#d6d3d1] hover:shadow-xs'}`}>
                        
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-serif text-base text-[#0c0a09]">{m.brand_name}</span>
                              {m.dosage && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f0efed] text-[#4e4e4e] shrink-0">{m.dosage}</span>}
                            </div>
                            <p className="text-[11px] text-[#777169] mt-0.5">Active Salt: <strong className="text-[#292524]">{m.active_salts?.join(' + ')}</strong></p>
                          </div>
                          <span className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-[#fafafa] border border-[#e7e5e4] text-[#292524] font-medium">{m.frequency}</span>
                        </div>

                        {/* What it does */}
                        {m.purpose_what_it_does && (
                          <div className="mt-2 text-xs text-[#292524] bg-[#fafafa] p-2.5 rounded-xl border border-[#e7e5e4]">
                            <strong className="text-[#0c0a09]">What it does: </strong>{m.purpose_what_it_does}
                          </div>
                        )}

                        {/* Parhez & Precautions */}
                        {m.parhez_precautions && (
                          <div className="mt-2 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                            <strong>Parhez / Precaution: </strong>{m.parhez_precautions}
                          </div>
                        )}

                        <div className="mt-2.5 pt-2 border-t border-[#f0efed] flex flex-wrap justify-between text-[11px] text-[#4e4e4e] gap-1">
                          <span>When: <strong className="text-[#0c0a09]">{m.timing}</strong> {m.duration ? `(${m.duration})` : ''}</span>
                          {m.instructions_hi && <span className="text-[#777169]">{m.instructions_hi}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !hasData ? (
                  <div className="bg-white/50 rounded-3xl border border-dashed border-[#e7e5e4] p-6 text-center">
                    <Pill className="w-8 h-8 text-[#d6d3d1] mx-auto mb-3" />
                    <p className="text-xs text-[#777169]">Extracted medicines will appear here after upload</p>
                  </div>
                ) : null}

                {/* Grounded Chatbot Launcher Card */}
                <div className="bg-white border border-[#e7e5e4] rounded-3xl p-5 shadow-xs space-y-3.5 luxury-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#292524] text-white flex items-center justify-center shadow-xs">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h4 className="font-serif text-base font-semibold text-[#0c0a09]">Ask Doubts with AI Assistant</h4>
                    </div>
                    <span className="text-[10px] badge-neutral px-2.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1">
                      <span className="dot-normal" /> Grounded AI
                    </span>
                  </div>
                  <p className="text-xs text-[#4e4e4e] leading-relaxed">
                    Have questions about your prescription, medicine dosage, timing, side effects, or diet precautions (Parhez)? Ask our AI assistant anytime.
                  </p>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    disabled={!hasData}
                    className="w-full py-3 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#0c0a09] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <span>💬 Ask Doubts Regarding Prescription</span>
                    {chatMsgs.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">{chatMsgs.length}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: DDI (Multi-Prescription Cross-Specialist Safety Radar) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'ddi' && (
          <div className="space-y-6 max-w-6xl mx-auto">

            {/* Empty State / Batch Upload Dropzone (When 0 batch prescriptions uploaded) */}
            {multiPrescriptions.length === 0 && !multiUploading && (
              <div className="bg-white rounded-3xl border border-[#e7e5e4] p-8 sm:p-12 shadow-xs text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-100 to-red-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                  <ShieldAlert className="w-8 h-8 text-amber-700" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="font-serif text-2xl text-[#0c0a09] mb-2">Cross-Prescription DDI Safety Radar</h3>
                  <p className="text-xs text-[#777169] leading-relaxed">
                    Upload <strong>multiple prescription slips</strong> at once (e.g. Cardiologist + Neurologist + General Physician). BharatDoc will cross-analyze all prescriptions simultaneously to catch hidden poly-pharmacy drug interactions.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="cursor-pointer inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#0c0a09] transition-all shadow-md hover:scale-[1.01]">
                    <Upload className="w-4 h-4" />
                    <span>Upload Multiple Prescriptions (Select 2+ Files)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={e => e.target.files && handleMultiUpload(e.target.files)}
                    />
                  </label>
                  <p className="text-[11px] text-[#a8a29e] mt-2">Supports JPG, PNG, WEBP files · Upload all doctor slips together</p>
                </div>
              </div>
            )}

            {/* Loading State during batch upload */}
            {multiUploading && (
              <div className="bg-white rounded-3xl border border-[#e7e5e4] p-12 text-center space-y-4 shadow-xs">
                <RefreshCw className="w-10 h-10 text-[#292524] animate-spin mx-auto" />
                <div>
                  <h3 className="font-serif text-lg text-[#0c0a09]">Analyzing Multiple Prescription Slips…</h3>
                  <p className="text-xs text-[#777169] mt-1">Running Gemini Vision OCR across all uploaded slips and evaluating cross-prescription DDI matrix.</p>
                </div>
              </div>
            )}

            {/* Active Multi-Prescription Analysis View */}
            {multiPrescriptions.length > 0 && !multiUploading && (
              <>
                {/* Header Action Bar */}
                <div className="bg-white rounded-3xl border border-[#e7e5e4] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {multiPrescriptions.length}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#0c0a09]">
                        Analyzing {multiPrescriptions.length} Uploaded Prescriptions
                      </h3>
                      <p className="text-xs text-[#777169]">
                        Consolidated active molecules across all doctors for cross-specialist safety evaluation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fafafa] border border-[#e7e5e4] text-xs font-medium text-[#292524] hover:bg-[#f0efed] transition-all">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add More Slips</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={e => e.target.files && handleMultiUpload(e.target.files)}
                      />
                    </label>
                    <button
                      onClick={() => { setMultiPrescriptions([]); setMultiDdiData(null); setDdiChatMsgs([]); }}
                      className="px-4 py-2 rounded-full border border-[#e7e5e4] text-xs font-medium text-red-600 hover:bg-red-50 transition-all"
                    >
                      Clear All Slips
                    </button>
                  </div>
                </div>

                {/* DDI Overall Risk Status Banner */}
                <div className={`rounded-3xl p-6 sm:p-8 border shadow-xs ${
                  multiDdiData?.status === 'HIGH_RISK' ? 'bg-red-50 border-red-200' :
                  multiDdiData?.status === 'MODERATE_RISK' ? 'bg-amber-50 border-amber-200' :
                  'bg-emerald-50 border-emerald-200'}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                        multiDdiData?.status === 'HIGH_RISK' ? 'bg-red-600' :
                        multiDdiData?.status === 'MODERATE_RISK' ? 'bg-amber-600' : 'bg-emerald-600'}`}>
                        {multiDdiData?.status === 'HIGH_RISK' ? <AlertOctagon className="w-6 h-6" /> :
                         multiDdiData?.status === 'MODERATE_RISK' ? <AlertTriangle className="w-6 h-6" /> :
                         <ShieldCheck className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#0c0a09]">
                          {multiDdiData?.status === 'HIGH_RISK' ? t.ddi_high_risk :
                           multiDdiData?.status === 'MODERATE_RISK' ? t.ddi_moderate : t.ddi_safe}
                        </h3>
                        <p className="text-xs text-[#4e4e4e] mt-0.5">Cross-prescription pharmacovigilance across all {multiPrescriptions.length} uploaded doctor slips</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif text-3xl text-[#0c0a09]">{multiDdiData?.conflict_count ?? 0}</span>
                      <p className="text-[11px] text-[#777169]">Active Cross-Drug Conflicts</p>
                    </div>
                  </div>
                </div>

                {/* Conflict Cards */}
                {(multiDdiData?.conflicts ?? []).map((c: any, i: number) => (
                  <div key={i} className={`bg-white rounded-3xl border p-5 shadow-xs space-y-3 luxury-card ${c.severity === 'HIGH_RISK' ? 'border-[#ffccc7]' : 'border-[#ffe58f]'}`}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl text-white shrink-0 shadow-2xs ${c.severity === 'HIGH_RISK' ? 'bg-[#9e1068]' : 'bg-[#873800]'}`}>
                          <AlertOctagon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-serif text-lg text-[#0c0a09]">{c.title}</h4>
                          <p className="text-xs text-[#777169]">Conflicting Molecules: <strong>{c.conflicting_salts?.join(' ⚡ ')}</strong></p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 ${c.severity === 'HIGH_RISK' ? 'badge-high' : 'badge-mild'}`}>
                        <span className={c.severity === 'HIGH_RISK' ? 'dot-high' : 'dot-mild'} />
                        {c.severity === 'HIGH_RISK' ? 'HIGH RISK' : 'MILD RISK'}
                      </span>
                    </div>
                    <p className="text-xs text-[#292524] leading-relaxed">{c.description}</p>
                    <div className="p-3.5 rounded-2xl bg-[#fffbe6] border border-[#ffe58f] text-xs text-[#873800] flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-[#873800] shrink-0 mt-0.5" />{c.recommendation}
                    </div>
                  </div>
                ))}

                {/* Uploaded Prescription Cards Breakdown Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-[#777169] uppercase tracking-wider px-1">
                    Uploaded Prescriptions Breakdown ({multiPrescriptions.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {multiPrescriptions.map((p, pIdx) => (
                      <div key={pIdx} className="bg-white rounded-3xl border border-[#e7e5e4] p-5 shadow-xs space-y-3">
                        <div className="flex items-start justify-between gap-2 border-b border-[#f0efed] pb-3">
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#292524] text-white font-semibold">
                              Prescription #{pIdx + 1}
                            </span>
                            <h4 className="font-serif text-base text-[#0c0a09] mt-1">{p.doctor_name || `Doctor #${pIdx + 1}`}</h4>
                            <p className="text-xs text-[#777169]">Patient: <strong className="text-[#292524]">{p.patient_name || 'Patient'}</strong> {p.date ? `· ${p.date}` : ''}</p>
                          </div>
                        </div>

                        {p.diagnosis && (
                          <p className="text-xs text-[#4e4e4e] bg-[#fafafa] p-2.5 rounded-xl border border-[#e7e5e4]">
                            <strong className="text-[#0c0a09]">Diagnosis: </strong>{p.diagnosis}
                          </p>
                        )}

                        <div className="space-y-2 pt-1">
                          <p className="text-[10px] font-semibold text-[#777169] uppercase tracking-wider">Prescribed Medicines ({p.medicines?.length || 0})</p>
                          {p.medicines?.map((m: any, mIdx: number) => (
                            <div key={mIdx} className="p-2.5 rounded-xl bg-[#fafafa] border border-[#e7e5e4] flex items-center justify-between gap-2 text-xs">
                              <div>
                                <span className="font-medium text-[#0c0a09]">{m.brand_name}</span>
                                {m.dosage && <span className="text-[11px] text-[#777169] ml-1.5">({m.dosage})</span>}
                                <div className="text-[10px] text-[#777169]">Salts: {m.active_salts?.join(', ')}</div>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#e7e5e4] text-[#4e4e4e]">{m.frequency}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Poly-Pharmacy AI Assistant Launcher Card */}
                <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 rounded-3xl p-5 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h4 className="font-serif text-base font-semibold text-[#0c0a09]">Poly-Pharmacy AI Assistant</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
                      Cross-Prescription Grounding
                    </span>
                  </div>
                  <p className="text-xs text-[#4e4e4e] leading-relaxed">
                    Have questions about combining medicines from all {multiPrescriptions.length} uploaded doctor slips? Ask our poly-pharmacy AI assistant anytime.
                  </p>
                  <button
                    onClick={() => setIsDdiChatOpen(true)}
                    className="w-full py-3 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#0c0a09] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>💬 Ask Doubts Regarding Combined Prescriptions</span>
                    {ddiChatMsgs.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">{ddiChatMsgs.length}</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: LAB REPORT ANALYSIS (Single Report Term-by-Term Deep-Dive) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'lab_analysis' && (
          <div className="space-y-6 max-w-6xl mx-auto">

            {/* Clean Dropzone when 0 report uploaded */}
            {!labReportData && !labUploading && (
              <div className="bg-white rounded-3xl border border-[#e7e5e4] p-8 sm:p-12 shadow-xs text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <FlaskConical className="w-8 h-8 text-emerald-700" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="font-serif text-2xl text-[#0c0a09] mb-2">Lab Report Medical Term Explainer</h3>
                  <p className="text-xs text-[#777169] leading-relaxed">
                    Upload any diagnostic lab report image or PDF (CBC, Diabetes, Thyroid, Kidney, Liver, Blood, Urine). BharatDoc translates complex medical jargon into simple everyday explanations, highlights normal ranges, and categorizes risks.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="cursor-pointer inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#0c0a09] transition-all shadow-md hover:scale-[1.01]">
                    <Upload className="w-4 h-4" />
                    <span>Upload Lab Report (Image / PDF)</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleLabReportUpload(e.target.files[0])}
                    />
                  </label>
                  <p className="text-[11px] text-[#a8a29e] mt-2">Supports JPG, PNG, WEBP, PDF · Auto-explains all medical terms &amp; values</p>
                </div>
              </div>
            )}

            {/* Loading state during report upload */}
            {labUploading && (
              <div className="bg-white rounded-3xl border border-[#e7e5e4] p-12 text-center space-y-4 shadow-xs">
                <RefreshCw className="w-10 h-10 text-[#292524] animate-spin mx-auto" />
                <div>
                  <h3 className="font-serif text-lg text-[#0c0a09]">Analyzing Diagnostic Lab Report…</h3>
                  <p className="text-xs text-[#777169] mt-1">Extracting test parameters, bio-reference ranges, plain-language explanations, and risk categories.</p>
                </div>
              </div>
            )}

            {/* Analyzed Lab Report View */}
            {labReportData && !labUploading && (
              <>
                {/* Header Action Bar */}
                <div className="bg-white rounded-3xl border border-[#e7e5e4] p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#f0efed] pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-[#777169] uppercase tracking-wider">Diagnostic Analysis Report</span>
                        <h3 className="font-serif text-xl text-[#0c0a09]">{labReportData.report_title || 'Diagnostic Report'}</h3>
                        <p className="text-xs text-[#777169] mt-0.5">
                          Patient: <strong className="text-[#292524]">{labReportData.patient_name || 'Patient'}</strong> · Date: {labReportData.test_date || 'Today'} · Lab: {labReportData.lab_name || 'Diagnostic Center'}
                        </p>
                      </div>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#292524] text-white text-xs font-medium hover:bg-[#0c0a09] transition-all shadow-xs shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Another Report</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={e => e.target.files?.[0] && handleLabReportUpload(e.target.files[0])}
                      />
                    </label>
                  </div>

                  {/* Summary Overview */}
                  {labReportData.summary_overview && (
                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] text-xs sm:text-sm text-[#292524] leading-relaxed">
                      <strong className="text-[#0c0a09] block mb-1">📋 Overall Patient Summary:</strong>
                      {labReportData.summary_overview}
                    </div>
                  )}
                </div>

                {/* Term-by-Term Medical Explanation Cards */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-[#777169] uppercase tracking-wider px-1">
                    Term-by-Term Medical Parameter Breakdown ({labReportData.metrics?.length || 0})
                  </h4>

                  <div className="space-y-3">
                    {labReportData.metrics?.map((m: any, idx: number) => {
                      const risk = m.risk_level || (m.status === 'HIGH' || m.status === 'CRITICAL' ? 'HIGH_RISK' : m.status === 'LOW' ? 'MILD_RISK' : 'NORMAL');
                      return (
                        <div key={idx} className="bg-white rounded-3xl border border-[#e7e5e4] p-5 sm:p-6 shadow-xs space-y-3 hover:shadow-md transition-all">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#f0efed] pb-3">
                            <div>
                              <h4 className="font-serif text-lg text-[#0c0a09]">{m.test_name}</h4>
                              <p className="text-xs text-[#777169] mt-0.5">
                                Bio-Reference Range: <strong className="text-[#292524]">{m.min_ref ?? 'N/A'} - {m.max_ref ?? 'N/A'} {m.unit}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="font-serif text-xl text-[#0c0a09] font-semibold">{m.value}</span>
                                <span className="text-xs text-[#777169] ml-1">{m.unit}</span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 ${
                                risk === 'HIGH_RISK' || m.status === 'CRITICAL' ? 'badge-high' :
                                risk === 'MILD_RISK' || m.status === 'HIGH' || m.status === 'LOW' ? 'badge-mild' :
                                'badge-normal'}`}>
                                <span className={risk === 'HIGH_RISK' || m.status === 'CRITICAL' ? 'dot-high' : risk === 'MILD_RISK' || m.status === 'HIGH' || m.status === 'LOW' ? 'dot-mild' : 'dot-normal'} />
                                {risk === 'HIGH_RISK' ? 'HIGH RISK' : risk === 'MILD_RISK' ? 'MILD RISK' : 'NORMAL'}
                              </span>
                            </div>
                          </div>

                          {/* Plain Language Explanations */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                            {m.plain_explanation && (
                              <div className="p-3 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] space-y-1">
                                <strong className="text-[#0c0a09] block">💡 What is this medical term?</strong>
                                <p className="text-[#4e4e4e] leading-relaxed">{m.plain_explanation}</p>
                              </div>
                            )}

                            {m.is_normal_explanation && (
                              <div className="p-3 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] space-y-1">
                                <strong className="text-[#0c0a09] block">🔍 Is your value normal?</strong>
                                <p className="text-[#4e4e4e] leading-relaxed">{m.is_normal_explanation}</p>
                              </div>
                            )}
                          </div>

                          {/* Actionable Advice */}
                          {m.advice && (
                            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <strong>Clinical Advice &amp; Action Plan: </strong>{m.advice}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lab Report AI Assistant Launcher Card */}
                <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 rounded-3xl p-5 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h4 className="font-serif text-base font-semibold text-[#0c0a09]">Lab Report AI Assistant</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
                      Lab Grounding
                    </span>
                  </div>
                  <p className="text-xs text-[#4e4e4e] leading-relaxed">
                    Have questions about specific values or medical terms on this report? Ask our diagnostic AI assistant anytime.
                  </p>
                  <button
                    onClick={() => setIsLabChatOpen(true)}
                    className="w-full py-3 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#0c0a09] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>💬 Ask Doubts Regarding Uploaded Lab Report</span>
                    {labChatMsgs.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">{labChatMsgs.length}</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: HEALTH TRENDS (Longitudinal 6-Month Telemetry Graph) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'health_trends' && (
          <div className="space-y-6 max-w-6xl mx-auto">

            {/* Empty State when no lab reports logged */}
            {healthTrendHistory.length === 0 && (
              <div className="bg-white rounded-3xl border border-[#e7e5e4] p-8 sm:p-12 shadow-xs text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <TrendingUp className="w-8 h-8 text-emerald-700" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="font-serif text-2xl text-[#0c0a09] mb-2">6-Month Health Telemetry Engine</h3>
                  <p className="text-xs text-[#777169] leading-relaxed">
                    Your longitudinal health trends automatically accumulate here as you upload diagnostic lab reports in the <strong>Lab Report Analysis</strong> tab over time.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('lab_analysis')}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#0c0a09] transition-all shadow-md hover:scale-[1.01]"
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>Go to Lab Report Analysis to Upload Slips</span>
                  </button>
                  <p className="text-[11px] text-[#a8a29e] mt-2">Track progress for HbA1c, Blood Glucose, Creatinine, Thyroid &amp; Complete Blood Count</p>
                </div>
              </div>
            )}

            {/* Active Telemetry Trends View */}
            {healthTrendHistory.length > 0 && (() => {
              // Extract all unique test parameters present across all uploaded lab reports in healthTrendHistory
              const extractedMetricsMap = new Map<string, {
                test_name: string;
                latestVal: any;
                unit: string;
                min_ref?: number;
                max_ref?: number;
                risk_level: string;
              }>();

              healthTrendHistory.forEach(report => {
                if (Array.isArray(report.metrics)) {
                  report.metrics.forEach((m: any) => {
                    if (m.test_name && !extractedMetricsMap.has(m.test_name.toLowerCase())) {
                      extractedMetricsMap.set(m.test_name.toLowerCase(), {
                        test_name: m.test_name,
                        latestVal: m.value,
                        unit: m.unit || '',
                        min_ref: m.min_ref,
                        max_ref: m.max_ref,
                        risk_level: m.risk_level || (m.status === 'HIGH' || m.status === 'CRITICAL' ? 'HIGH_RISK' : m.status === 'LOW' ? 'MILD_RISK' : 'NORMAL')
                      });
                    }
                  });
                }
              });

              const allMetrics = Array.from(extractedMetricsMap.values());
              const activeMetricName = selectedTrendMetric && allMetrics.some(x => x.test_name.toLowerCase() === selectedTrendMetric.toLowerCase())
                ? selectedTrendMetric
                : (allMetrics[0]?.test_name || 'Parameter');

              const selectedConfig = allMetrics.find(x => x.test_name.toLowerCase() === activeMetricName.toLowerCase()) || allMetrics[0];

              const chartData = healthTrendHistory
                .map((report, idx) => {
                  const m = report.metrics?.find((x: any) => x.test_name?.toLowerCase() === activeMetricName.toLowerCase() || x.test_name?.toLowerCase().includes(activeMetricName.toLowerCase()));
                  const valNum = m ? parseFloat(String(m.value).replace(/[^0-9.]/g, '')) : NaN;
                  return {
                    date: report.test_date || `Scan #${idx + 1}`,
                    value: isNaN(valNum) ? 0 : valNum,
                    displayVal: m ? `${m.value} ${m.unit || ''}` : 'N/A'
                  };
                })
                .reverse();

              return (
                <>
                  {/* Report History Timeline Banner */}
                  <div className="bg-white rounded-3xl border border-[#e7e5e4] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="font-serif text-base text-[#0c0a09]">Longitudinal Report History ({healthTrendHistory.length} Uploaded Reports)</h4>
                      </div>
                      <p className="text-xs text-[#777169] mt-0.5">
                        {healthTrendHistory.length === 1
                          ? 'Showing 1 uploaded report. Upload new reports over time to automatically track parameter trends & comparisons.'
                          : `Comparing latest report (${healthTrendHistory[0]?.test_date || 'Today'}) against ${healthTrendHistory.length - 1} previous scan(s).`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs shrink-0">
                      {healthTrendHistory.map((rep, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                            idx === 0
                              ? 'bg-[#292524] text-white border-[#292524]'
                              : 'bg-[#fafafa] text-[#4e4e4e] border-[#e7e5e4]'
                          }`}
                        >
                          {idx === 0 ? 'Latest: ' : `Scan #${healthTrendHistory.length - idx}: `}
                          {rep.test_date || `Scan ${idx + 1}`}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Parameter Selector Cards Grid with Comparison Badges */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#777169]">
                        Extracted Report Parameters ({allMetrics.length})
                      </span>
                      <span className="text-xs text-[#777169]">Click any metric card below to plot its trend</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                      {allMetrics.map((mConfig, i) => {
                        const isSelected = activeMetricName.toLowerCase() === mConfig.test_name.toLowerCase();
                        const isHigh = mConfig.risk_level === 'HIGH_RISK';
                        const isMild = mConfig.risk_level === 'MILD_RISK';

                        // Lookup historical readings for comparison
                        const historyForMetric = healthTrendHistory
                          .map(r => {
                            const m = r.metrics?.find((x: any) => x.test_name?.toLowerCase() === mConfig.test_name.toLowerCase());
                            return m ? { date: r.test_date, value: m.value } : null;
                          })
                          .filter(Boolean);

                        const latestValueStr = historyForMetric[0]?.value ?? mConfig.latestVal;
                        const prevValueStr = historyForMetric[1]?.value;

                        let deltaBadge = null;
                        if (latestValueStr !== undefined && prevValueStr !== undefined) {
                          const latestNum = parseFloat(String(latestValueStr).replace(/[^0-9.]/g, ''));
                          const prevNum = parseFloat(String(prevValueStr).replace(/[^0-9.]/g, ''));
                          if (!isNaN(latestNum) && !isNaN(prevNum)) {
                            const diff = latestNum - prevNum;
                            if (diff > 0) {
                              deltaBadge = <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md">+{diff.toFixed(1)} ↑</span>;
                            } else if (diff < 0) {
                              deltaBadge = <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">{diff.toFixed(1)} ↓</span>;
                            } else {
                              deltaBadge = <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md">Stable</span>;
                            }
                          }
                        }

                        return (
                          <div
                            key={i}
                            onClick={() => setSelectedTrendMetric(mConfig.test_name)}
                            className={`cursor-pointer rounded-3xl p-4.5 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                              isSelected
                                ? 'bg-white border-[#292524] shadow-md ring-1 ring-[#292524]'
                                : 'bg-white/80 border-[#e7e5e4] hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2 gap-2">
                              <span className="text-[11px] font-semibold text-[#0c0a09] truncate">
                                {mConfig.test_name}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold shrink-0 inline-flex items-center gap-1 ${
                                isHigh ? 'badge-high' :
                                isMild ? 'badge-mild' :
                                'badge-normal'
                              }`}>
                                <span className={isHigh ? 'dot-high' : isMild ? 'dot-mild' : 'dot-normal'} />
                                {isHigh ? 'HIGH RISK' : isMild ? 'MILD RISK' : 'NORMAL'}
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between gap-2">
                              <div className="font-serif text-2xl text-[#0c0a09] font-medium">
                                {latestValueStr}
                                <span className="text-xs text-[#777169] ml-1">{mConfig.unit}</span>
                              </div>
                              {deltaBadge}
                            </div>

                            {prevValueStr !== undefined ? (
                              <p className="text-[10px] font-medium text-emerald-700 mt-1 truncate">
                                Prev Reading: <strong className="text-[#292524]">{prevValueStr} {mConfig.unit}</strong>
                              </p>
                            ) : (
                              (mConfig.min_ref !== undefined || mConfig.max_ref !== undefined) && (
                                <p className="text-[10px] text-[#777169] mt-1 truncate">
                                  Ref Range: {mConfig.min_ref ?? ''} - {mConfig.max_ref ?? ''} {mConfig.unit}
                                </p>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6-Month Recharts Telemetry Graph */}
                  <div className="bg-white rounded-3xl border border-[#e7e5e4] p-5 sm:p-7 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-xl text-[#0c0a09] flex items-center gap-2">
                          <Activity className="w-5 h-5 text-emerald-600" />
                          <span>{selectedConfig?.test_name || activeMetricName} — Telemetry Trend</span>
                        </h3>
                        <p className="text-xs text-[#777169] mt-0.5">
                          Longitudinal trajectory compiled across your {healthTrendHistory.length} uploaded lab report(s).
                        </p>
                      </div>

                      {selectedConfig?.max_ref !== undefined && (
                        <div className="text-xs text-[#777169] bg-[#fafafa] px-3 py-1.5 rounded-full border border-[#e7e5e4]">
                          Bio-Reference Limit: <strong className="text-[#0c0a09]">&lt; {selectedConfig.max_ref} {selectedConfig.unit}</strong>
                        </div>
                      )}
                    </div>

                    <div className="w-full h-64 sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#292524" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#a7e5d3" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0efed" />
                          <XAxis dataKey="date" stroke="#a8a29e" fontSize={11} />
                          <YAxis stroke="#a8a29e" fontSize={11} domain={['auto', 'auto']} />
                          <Tooltip
                            contentStyle={{ background: '#0c0a09', borderRadius: '16px', color: '#fff', fontSize: '12px', border: 'none' }}
                            formatter={(val: any) => [`${val} ${selectedConfig?.unit || ''}`, selectedConfig?.test_name || 'Parameter']}
                          />
                          {selectedConfig?.max_ref !== undefined && (
                            <ReferenceLine y={selectedConfig.max_ref} stroke="#16a34a" strokeDasharray="4 4" label={{ value: 'Reference Upper Limit', fill: '#16a34a', fontSize: 10 }} />
                          )}
                          <Area type="monotone" dataKey="value" stroke="#292524" strokeWidth={2.5} fill="url(#metricGrad)" dot={{ r: 6, fill: '#292524', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#dc2626' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Health Trends AI Assistant Launcher Card */}
                  <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 rounded-3xl p-5 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <h4 className="font-serif text-base font-semibold text-[#0c0a09]">Health Trends AI Assistant</h4>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
                        Telemetry Grounding
                      </span>
                    </div>
                    <p className="text-xs text-[#4e4e4e] leading-relaxed">
                      Have questions about your health progress over time? Ask our telemetry AI assistant anytime.
                    </p>
                    <button
                      onClick={() => setIsTrendChatOpen(true)}
                      className="w-full py-3 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#0c0a09] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <span>💬 Ask Doubts Regarding Health Trends &amp; Progress</span>
                      {trendChatMsgs.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">{trendChatMsgs.length}</span>
                      )}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: FHIR */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'fhir' && (
          <div className="space-y-5 max-w-6xl mx-auto">
            {!fhirJson ? (
              <EmptyState icon={FileCode} title="FHIR R4 Bundle Generator" subtitle="Upload a prescription or diagnostic lab report to auto-generate an ABDM-compliant HL7 FHIR R4 JSON bundle ready for ABHA Digital Locker." />
            ) : (
              <>
                <div className="bg-white rounded-3xl border border-[#e7e5e4] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#292524] flex items-center justify-center shrink-0"><FileCode className="w-6 h-6 text-white" /></div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-xl text-[#0c0a09]">HL7 FHIR R4 Bundle</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900">ABDM</span>
                      </div>
                      <p className="text-xs text-[#777169] mt-0.5 max-w-lg">Converted from your prescription to ABDM-compliant HL7 FHIR R4 JSON.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => { navigator.clipboard.writeText(fhirJson); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#e7e5e4] text-xs font-medium text-[#292524] hover:bg-[#f0efed] transition-all">
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy JSON'}
                    </button>
                    <button onClick={() => { const b = new Blob([fhirJson], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `ABDM_FHIR_${Date.now()}.json`; a.click(); }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#292524] text-white text-xs font-medium hover:bg-[#0c0a09] transition-all shadow-xs">
                      <Download className="w-4 h-4" />Download
                    </button>
                  </div>
                </div>

                {/* Plain-Language ABHA Explainer Card for Everyday Users */}
                <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/30 to-white border border-emerald-200 rounded-3xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        🇮🇳
                      </div>
                      <h4 className="font-serif text-base font-semibold text-[#0c0a09]">What is ABHA &amp; Digital Health Locker?</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
                      Govt of India Initiative
                    </span>
                  </div>

                  <p className="text-xs text-[#4e4e4e] leading-relaxed">
                    <strong>ABHA (Ayushman Bharat Health Account)</strong> is India's official 14-digit digital health ID created by the National Health Authority (NHA). It allows patients to store all prescription slips, blood reports, and X-rays in one secure digital locker without carrying physical paper files.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-emerald-100 text-xs">
                    <span className="text-[#777169]">Don't have an ABHA ID? BharatDoc automatically assigns a temporary digital ID so your report is ready.</span>
                    <a
                      href="https://abha.abdm.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-[#0c0a09] transition-all cursor-pointer shrink-0"
                    >
                      <span>Create Free ABHA ID in 1 Min (Govt Portal)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Real Patient ABHA ID Customizer Input */}
                <div className="bg-white rounded-3xl border border-[#e7e5e4] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-[#0c0a09] block">
                      Patient Official 14-Digit ABHA Number / Address:
                    </label>
                    <p className="text-[11px] text-[#777169]">
                      Type real 14-digit ABHA Number (e.g. <strong className="text-[#292524]">91-8827-1092-4401</strong> or <strong className="text-[#292524]">user@abha</strong>). Updates the FHIR Bundle payload for Government Gateway push.
                    </p>
                  </div>
                  <input
                    value={customAbhaId}
                    onChange={e => setCustomAbhaId(e.target.value)}
                    placeholder="Enter 14-digit ABHA ID..."
                    className="px-4 py-2.5 rounded-full bg-[#fafafa] border border-[#e7e5e4] text-xs font-mono text-[#0c0a09] focus:outline-none focus:border-[#292524] w-full sm:w-80 shadow-xs"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs">
                    <Database className="w-4 h-4 text-[#777169]" />
                    <span className="text-[#4e4e4e]">
                      <strong className="text-[#0c0a09]">ABHA Digital Locker Status: </strong>
                      {customAbhaId.trim() ? (
                        <span className="text-emerald-700 font-medium">Ready to link to <code className="bg-white px-1.5 py-0.5 rounded border font-mono text-[#0c0a09]">{customAbhaId.trim()}</code></span>
                      ) : (
                        <span className="text-amber-700 font-medium">Not Linked (Enter 14-digit ABHA Number above to link)</span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!customAbhaId.trim()) {
                        alert("Please enter a valid 14-digit Patient ABHA Number above to link and push to ABHA Digital Locker.");
                        return;
                      }
                      setPushed(true);
                      setTimeout(() => setPushed(false), 3000);
                    }}
                    disabled={pushed}
                    className={`shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
                      pushed ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                    }`}
                  >
                    {pushed ? <><Check className="w-4 h-4" />Pushed to ABHA Locker!</> : <><Database className="w-4 h-4" />Link &amp; Push to ABHA Locker</>}
                  </button>
                </div>

                <div className="bg-[#0c0a09] rounded-3xl border border-[#292524] overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1c1917]">
                    <span className="w-3 h-3 rounded-full bg-red-500" /><span className="w-3 h-3 rounded-full bg-amber-500" /><span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-[#a8a29e] ml-2">fhir_r4_bundle.json</span>
                  </div>
                  <pre className="font-mono text-xs text-emerald-400 overflow-x-auto max-h-[480px] p-5 leading-relaxed">{fhirJson}</pre>
                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Chatbot Modal Overlay */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-[#e7e5e4] shadow-2xl w-full max-w-3xl flex flex-col h-[92vh] sm:h-[85vh] max-h-[720px] overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#f0efed] bg-[#fafafa] flex items-center justify-between gap-2.5 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#292524] text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="font-serif text-sm sm:text-lg font-medium sm:font-normal text-[#0c0a09] truncate">BharatDoc Medical Assistant</h3>
                    <span className="text-[9px] sm:text-[10px] font-medium text-[#0f5132] bg-[#edf7f2] border border-[#b7eb8f] px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full shrink-0">Guardrails Active</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#777169] mt-0.5 truncate">
                    Active Context: <strong className="text-[#292524]">{prescription?.patient_name || 'Prescription Slip'}</strong> {prescription?.doctor_name ? `(${prescription.doctor_name})` : ''}
                  </p>
                </div>
              </div>

              {/* Close Button (X) */}
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white border border-[#e7e5e4] text-[#777169] hover:bg-[#f0efed] hover:text-[#0c0a09] transition-all shadow-xs shrink-0 cursor-pointer"
                title="Close Chatbot"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Chat Body */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 bg-[#fafafa]/50">
              {chatMsgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center space-y-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-[#f0efed] flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[#777169]" />
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-normal text-[#0c0a09]">Ask any medical doubt about your prescription</h4>
                  <p className="text-[11px] sm:text-xs text-[#777169] max-w-sm px-2">
                    Our AI assistant is grounded strictly in your uploaded prescription document and medical pharmacology knowledge.
                  </p>
                </div>
              ) : (
                chatMsgs.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3 sm:p-4 rounded-2xl max-w-[90%] sm:max-w-[82%] ${
                      m.role === 'user'
                        ? 'ml-auto bg-[#292524] text-white rounded-br-none shadow-xs'
                        : 'bg-white border border-[#e7e5e4] text-[#292524] rounded-bl-none shadow-xs'
                    }`}
                  >
                    {m.role === 'bot' ? (
                      renderFormattedMessage(m.text)
                    ) : (
                      <p className="text-xs sm:text-sm font-medium">{m.text}</p>
                    )}
                  </div>
                ))
              )}

              {chatLoading && (
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#e7e5e4] text-xs text-[#777169] flex items-center gap-2 max-w-max shadow-xs">
                  <RefreshCw className="w-4 h-4 text-[#292524] animate-spin" />
                  <span>Consulting clinical knowledge base…</span>
                </div>
              )}

              {/* Scroll anchor target */}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips & Input Bar */}
            <div className="p-3 sm:p-4 border-t border-[#f0efed] bg-white space-y-2.5 sm:space-y-3">
              {hasData && (
                <div className="flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto pb-1.5 sm:pb-1 scrollbar-none">
                  {['What does my medicine do?', 'What food should I avoid (Parhez)?', 'When to take medicines?', 'Can I double dose if I miss one?'].map(q => (
                    <button
                      key={q}
                      onClick={() => handleChat(q)}
                      disabled={chatLoading}
                      className="text-[11px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#f0efed] hover:bg-[#e7e5e4] text-[#4e4e4e] transition-colors disabled:opacity-50 shrink-0 font-medium whitespace-nowrap cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={e => { e.preventDefault(); handleChat(); }} className="flex gap-2 items-center">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={hasData ? 'Ask any doubt about prescription…' : 'Upload prescription first…'}
                  disabled={!hasData || chatLoading}
                  className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#fafafa] border border-[#e7e5e4] text-xs sm:text-sm text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524] transition-all disabled:opacity-50 min-w-0"
                />
                <button
                  type="submit"
                  disabled={!hasData || chatLoading || !chatInput.trim()}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#292524] text-white hover:bg-[#0c0a09] transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Poly-Pharmacy DDI Chatbot Modal Overlay */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isDdiChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-[#e7e5e4] shadow-2xl w-full max-w-3xl flex flex-col h-[92vh] sm:h-[85vh] max-h-[720px] overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#f0efed] bg-[#fafafa] flex items-center justify-between gap-2.5 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#292524] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="font-serif text-sm sm:text-lg font-medium sm:font-normal text-[#0c0a09] truncate">Poly-Pharmacy AI Assistant</h3>
                    <span className="text-[9px] sm:text-[10px] font-medium text-[#0f5132] bg-[#edf7f2] border border-[#b7eb8f] px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full shrink-0">
                      Cross-Prescription Grounding
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#777169] mt-0.5 truncate">
                    Grounded on <strong className="text-[#292524]">{multiPrescriptions.length} uploaded doctor slips</strong> combined
                  </p>
                </div>
              </div>

              {/* Close Button (X) */}
              <button
                onClick={() => setIsDdiChatOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white border border-[#e7e5e4] text-[#777169] hover:bg-[#f0efed] hover:text-[#0c0a09] transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-[#fafafa]/50">
              {ddiChatMsgs.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-xs text-[#777169] space-y-2">
                  <p className="font-serif text-sm sm:text-base text-[#0c0a09]">Poly-Pharmacy Cross-Specialist Guidance</p>
                  <p className="max-w-md mx-auto px-2">Ask any question about taking these {multiPrescriptions.length} prescriptions together, dosage spacing, or potential side effects.</p>
                </div>
              ) : (
                ddiChatMsgs.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#292524] text-white rounded-tr-none shadow-xs'
                        : 'bg-white border border-[#e7e5e4] text-[#292524] rounded-tl-none shadow-xs'}`}>
                      {msg.role === 'bot' ? renderFormattedMessage(msg.text) : msg.text}
                    </div>
                  </div>
                ))
              )}

              {ddiChatLoading && (
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#e7e5e4] text-xs text-[#777169] flex items-center gap-2 max-w-max shadow-xs">
                  <RefreshCw className="w-4 h-4 text-[#292524] animate-spin" />
                  <span>Evaluating combined pharmacovigilance safety…</span>
                </div>
              )}

              <div ref={ddiChatEndRef} />
            </div>

            {/* Preset Prompts & Input Bar */}
            <div className="p-3 sm:p-4 border-t border-[#f0efed] bg-white space-y-2.5 sm:space-y-3">
              <div className="flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto pb-1.5 sm:pb-1 scrollbar-none">
                {[
                  'Is it safe to take all medicines together?',
                  'Which drug conflict is most serious?',
                  'How should I space out my doses?'
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => handleDdiChat(q)}
                    disabled={ddiChatLoading}
                    className="text-[11px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#f0efed] hover:bg-[#e7e5e4] text-[#4e4e4e] transition-colors disabled:opacity-50 shrink-0 font-medium whitespace-nowrap cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form onSubmit={e => { e.preventDefault(); handleDdiChat(); }} className="flex gap-2 items-center">
                <input
                  value={ddiChatInput}
                  onChange={e => setDdiChatInput(e.target.value)}
                  placeholder="Ask any doubt about combined prescriptions…"
                  disabled={ddiChatLoading}
                  className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#fafafa] border border-[#e7e5e4] text-xs sm:text-sm text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524] transition-all disabled:opacity-50 min-w-0"
                />
                <button
                  type="submit"
                  disabled={ddiChatLoading || !ddiChatInput.trim()}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#292524] text-white hover:bg-[#0c0a09] transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Lab Report AI Chatbot Modal Overlay */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isLabChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-[#e7e5e4] shadow-2xl w-full max-w-3xl flex flex-col h-[92vh] sm:h-[85vh] max-h-[720px] overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#f0efed] bg-[#fafafa] flex items-center justify-between gap-2.5 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#292524] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="font-serif text-sm sm:text-lg font-medium sm:font-normal text-[#0c0a09] truncate">Lab Report AI Assistant</h3>
                    <span className="text-[9px] sm:text-[10px] font-medium text-[#0f5132] bg-[#edf7f2] border border-[#b7eb8f] px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full shrink-0">
                      Lab Grounding Active
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#777169] mt-0.5 truncate">
                    Grounded on <strong className="text-[#292524]">{labReportData?.report_title || 'Diagnostic Report'}</strong> ({labReportData?.test_date || 'Today'})
                  </p>
                </div>
              </div>

              {/* Close Button (X) */}
              <button
                onClick={() => setIsLabChatOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white border border-[#e7e5e4] text-[#777169] hover:bg-[#f0efed] hover:text-[#0c0a09] transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-[#fafafa]/50">
              {labChatMsgs.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-xs text-[#777169] space-y-2">
                  <p className="font-serif text-sm sm:text-base text-[#0c0a09]">Diagnostic Parameter Guidance</p>
                  <p className="max-w-md mx-auto px-2">Ask any question about your lab parameters, bio-reference ranges, or what high/low levels mean.</p>
                </div>
              ) : (
                labChatMsgs.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#292524] text-white rounded-tr-none shadow-xs'
                        : 'bg-white border border-[#e7e5e4] text-[#292524] rounded-tl-none shadow-xs'}`}>
                      {msg.role === 'bot' ? renderFormattedMessage(msg.text) : msg.text}
                    </div>
                  </div>
                ))
              )}

              {labChatLoading && (
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#e7e5e4] text-xs text-[#777169] flex items-center gap-2 max-w-max shadow-xs">
                  <RefreshCw className="w-4 h-4 text-[#292524] animate-spin" />
                  <span>Evaluating diagnostic reference limits…</span>
                </div>
              )}

              <div ref={labChatEndRef} />
            </div>

            {/* Preset Prompts & Input Bar */}
            <div className="p-3 sm:p-4 border-t border-[#f0efed] bg-white space-y-2.5 sm:space-y-3">
              <div className="flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto pb-1.5 sm:pb-1 scrollbar-none">
                {[
                  'What does my highest value mean?',
                  'Are my blood sugar levels safe?',
                  'What dietary changes should I make?'
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => handleLabChat(q)}
                    disabled={labChatLoading}
                    className="text-[11px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#f0efed] hover:bg-[#e7e5e4] text-[#4e4e4e] transition-colors disabled:opacity-50 shrink-0 font-medium whitespace-nowrap cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form onSubmit={e => { e.preventDefault(); handleLabChat(); }} className="flex gap-2 items-center">
                <input
                  value={labChatInput}
                  onChange={e => setLabChatInput(e.target.value)}
                  placeholder="Ask any question about lab parameters…"
                  disabled={labChatLoading}
                  className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#fafafa] border border-[#e7e5e4] text-xs sm:text-sm text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524] transition-all disabled:opacity-50 min-w-0"
                />
                <button
                  type="submit"
                  disabled={labChatLoading || !labChatInput.trim()}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#292524] text-white hover:bg-[#0c0a09] transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Health Trends AI Chatbot Modal Overlay */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isTrendChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-[#e7e5e4] shadow-2xl w-full max-w-3xl flex flex-col h-[92vh] sm:h-[85vh] max-h-[720px] overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#f0efed] bg-[#fafafa] flex items-center justify-between gap-2.5 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#292524] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="font-serif text-sm sm:text-lg font-medium sm:font-normal text-[#0c0a09] truncate">Health Trends AI Assistant</h3>
                    <span className="text-[9px] sm:text-[10px] font-medium text-[#0f5132] bg-[#edf7f2] border border-[#b7eb8f] px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full shrink-0">
                      Telemetry Active
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#777169] mt-0.5 truncate">
                    Grounded on <strong className="text-[#292524]">{healthTrendHistory.length} historical lab reports</strong> over time
                  </p>
                </div>
              </div>

              {/* Close Button (X) */}
              <button
                onClick={() => setIsTrendChatOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white border border-[#e7e5e4] text-[#777169] hover:bg-[#f0efed] hover:text-[#0c0a09] transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 bg-[#fafafa]/50">
              {trendChatMsgs.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-xs text-[#777169] space-y-2">
                  <p className="font-serif text-sm sm:text-base text-[#0c0a09]">Longitudinal Telemetry Guidance</p>
                  <p className="max-w-md mx-auto px-2">Ask any question about your health trajectory, HbA1c improvements, or long-term trends.</p>
                </div>
              ) : (
                trendChatMsgs.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#292524] text-white rounded-tr-none shadow-xs'
                        : 'bg-white border border-[#e7e5e4] text-[#292524] rounded-tl-none shadow-xs'}`}>
                      {msg.role === 'bot' ? renderFormattedMessage(msg.text) : msg.text}
                    </div>
                  </div>
                ))
              )}

              {trendChatLoading && (
                <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#e7e5e4] text-xs text-[#777169] flex items-center gap-2 max-w-max shadow-xs">
                  <RefreshCw className="w-4 h-4 text-[#292524] animate-spin" />
                  <span>Analyzing longitudinal telemetry trajectories…</span>
                </div>
              )}

              <div ref={trendChatEndRef} />
            </div>

            {/* Preset Prompts & Input Bar */}
            <div className="p-3 sm:p-4 border-t border-[#f0efed] bg-white space-y-2.5 sm:space-y-3">
              <div className="flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto pb-1.5 sm:pb-1 scrollbar-none">
                {[
                  'Is my HbA1c improving over time?',
                  'Am I on track for my glucose targets?',
                  'What trend requires the most attention?'
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => handleTrendChat(q)}
                    disabled={trendChatLoading}
                    className="text-[11px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#f0efed] hover:bg-[#e7e5e4] text-[#4e4e4e] transition-colors disabled:opacity-50 shrink-0 font-medium whitespace-nowrap cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form onSubmit={e => { e.preventDefault(); handleTrendChat(); }} className="flex gap-2 items-center">
                <input
                  value={trendChatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask any question about health progress…"
                  disabled={trendChatLoading}
                  className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#fafafa] border border-[#e7e5e4] text-xs sm:text-sm text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524] transition-all disabled:opacity-50 min-w-0"
                />
                <button
                  type="submit"
                  disabled={trendChatLoading || !trendChatInput.trim()}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#292524] text-white hover:bg-[#0c0a09] transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-[#e7e5e4] bg-white/30 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#292524] flex items-center justify-center"><Shield className="w-3 h-3 text-white" /></div>
            <span className="font-serif text-sm text-[#0c0a09]">BharatDoc</span>
          </div>
          <p className="text-xs text-[#777169]">{t.footer_mission}</p>
          <div className="flex items-center gap-3 text-xs text-[#777169]">
            <button className="hover:text-[#0c0a09] transition-colors">{t.footer_privacy}</button>
            <span>·</span>
            <button className="hover:text-[#0c0a09] transition-colors">{t.footer_terms}</button>
          </div>
        </div>
        <p className="text-center text-[11px] text-[#a8a29e] mt-3">{t.footer_copy}</p>
      </footer>
    </div>
  );
}
