import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Eye, ShieldAlert, TrendingUp, FileCode, ArrowRight, CheckCircle2, Globe, ChevronDown, Star } from 'lucide-react';
import { LANGUAGES, LangCode, useTranslation } from '../lib/i18n';

interface LandingPageProps {
  lang: LangCode;
  setLang: (l: LangCode) => void;
}

export default function LandingPage({ lang, setLang }: LandingPageProps) {
  const t = useTranslation(lang);
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);

  const features = [
    { icon: Eye, title: t.feature_audit_title, desc: t.feature_audit_desc, orb: 'from-[#a7e5d3] to-[#c8b8e0]' },
    { icon: ShieldAlert, title: t.feature_ddi_title, desc: t.feature_ddi_desc, orb: 'from-[#f4c5a8] to-[#e8b8c4]' },
    { icon: TrendingUp, title: t.feature_lab_title, desc: t.feature_lab_desc, orb: 'from-[#a8c8e8] to-[#a7e5d3]' },
    { icon: FileCode, title: t.feature_fhir_title, desc: t.feature_fhir_desc, orb: 'from-[#c8b8e0] to-[#f4c5a8]' },
  ];

  const stats = [
    { value: '70%', label: 'Of Indian prescriptions are handwritten' },
    { value: '<40%', label: 'Patient instruction retention after OPD' },
    { value: '5,000+', label: 'Preventable DDI events annually' },
    { value: 'ABDM', label: 'FHIR R4 Compliant Export' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] overflow-x-hidden">
      {/* Ambient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#a7e5d3] via-[#f4c5a8] to-transparent rounded-full opacity-30 blur-3xl pointer-events-none" style={{ animation: 'float 14s ease-in-out infinite' }} />
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#c8b8e0] via-[#a8c8e8] to-transparent rounded-full opacity-30 blur-3xl pointer-events-none" style={{ animation: 'float 18s ease-in-out infinite reverse' }} />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-[#e8b8c4] to-[#a7e5d3] rounded-full opacity-20 blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f5f5f5]/80 backdrop-blur-xl border-b border-[#e7e5e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#292524] flex items-center justify-center shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#a7e5d3] via-[#f4c5a8] to-[#c8b8e0] opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-xs" />
              <Shield className="w-4 h-4 text-white relative z-10" />
            </div>
            <span className="font-serif text-xl text-[#0c0a09] tracking-tight">BharatDoc</span>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#e7e5e4] text-[#292524] hover:bg-[#f0efed] transition-all duration-200"
              >
                <Globe className="w-3.5 h-3.5 text-[#777169]" />
                <span className="max-w-[80px] truncate">{LANGUAGES.find(l => l.code === lang)?.name || 'English'}</span>
                <ChevronDown className={`w-3 h-3 text-[#777169] transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#e7e5e4] rounded-2xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-[#f5f5f5] transition-colors flex items-center justify-between ${
                        lang === l.code ? 'font-semibold text-[#0c0a09] bg-[#f0efed]' : 'text-[#4e4e4e]'
                      }`}
                    >
                      <span>{l.label}</span>
                      {lang === l.code && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/auth?mode=login')}
              className="px-4 py-2 rounded-full text-xs font-medium border border-[#e7e5e4] text-[#292524] hover:bg-[#f0efed] transition-all duration-200"
            >
              {t.nav_signin}
            </button>
            <button
              onClick={() => navigate('/auth?mode=register')}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[#292524] text-white hover:bg-[#0c0a09] transition-all duration-200 shadow-sm"
            >
              {t.nav_register}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#e7e5e4] text-xs font-medium text-[#292524] shadow-xs mb-8 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{t.hero_badge}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#0c0a09] leading-[1.08] mb-6 max-w-5xl mx-auto">
          {t.hero_heading}
        </h1>

        <p className="text-base sm:text-lg text-[#777169] max-w-2xl mx-auto leading-relaxed mb-10">
          {t.hero_subheading}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/auth?mode=register')}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#292524] text-white text-sm font-medium hover:bg-[#0c0a09] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {t.hero_cta_primary}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
          <button
            onClick={() => navigate('/auth?mode=login')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#e7e5e4] text-[#292524] text-sm font-medium hover:bg-white hover:shadow-sm transition-all duration-200"
          >
            {t.hero_cta_secondary}
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[#e7e5e4] bg-white/50 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-3xl sm:text-4xl font-normal text-[#0c0a09] mb-1">{s.value}</div>
              <div className="text-xs text-[#777169] leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#0c0a09] mb-4">
            Every feature engineered for patient safety.
          </h2>
          <p className="text-[#777169] max-w-xl mx-auto">
            From camera to FHIR bundle — a complete clinical intelligence pipeline with deterministic safety rails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-3xl p-6 border border-[#e7e5e4] hover:border-[#d6d3d1] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default"
            >
              {/* Orb glow on hover */}
              <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${f.orb} rounded-full opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500 pointer-events-none`} />

              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${f.orb} opacity-80 flex items-center justify-center mb-5 shadow-xs`}>
                <f.icon className="w-5 h-5 text-[#292524]" />
              </div>

              <h3 className="font-serif text-lg font-normal text-[#0c0a09] mb-2 leading-snug">
                {f.title}
              </h3>
              <p className="text-xs text-[#777169] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative bg-[#0c0a09] rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-gradient-to-br from-[#a7e5d3] to-[#c8b8e0] rounded-full opacity-20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-gradient-to-br from-[#f4c5a8] to-[#e8b8c4] rounded-full opacity-20 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4 leading-tight">
              Your prescription.<br />Understood.
            </h2>
            <p className="text-[#a8a29e] mb-8 max-w-lg mx-auto">
              Upload any Indian prescription and get your medicines explained clearly, conflicts flagged, and health records generated in seconds.
            </p>
            <button
              onClick={() => navigate('/auth?mode=register')}
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0c0a09] text-sm font-medium hover:bg-[#f5f5f5] transition-all duration-200 shadow-lg"
            >
              {t.hero_cta_primary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e7e5e4] bg-white/30 backdrop-blur-sm py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#292524] flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-serif text-base text-[#0c0a09]">BharatDoc</span>
            </div>

            <p className="text-xs text-[#777169] text-center">{t.footer_mission}</p>

            <div className="flex items-center gap-4 text-xs text-[#777169]">
              <button className="hover:text-[#0c0a09] transition-colors">{t.footer_privacy}</button>
              <button className="hover:text-[#0c0a09] transition-colors">{t.footer_terms}</button>
            </div>
          </div>
          <div className="text-center text-xs text-[#a8a29e] mt-6">{t.footer_copy}</div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
      `}</style>
    </div>
  );
}
