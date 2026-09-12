import React, { useState } from 'react';
import { Shield, Sparkles, User, Globe, CheckCircle2, ChevronDown, Lock } from 'lucide-react';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentLang: string;
  setLang: (lang: string) => void;
  user: any;
  setUser: (u: any) => void;
}

const LANGUAGES = [
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'en', name: 'English' },
];

export default function Header({ currentLang, setLang, user, setUser }: HeaderProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#f5f5f5]/90 backdrop-blur-md border-b border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Vision Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#292524] text-white shadow-sm overflow-hidden group">
            {/* Ambient orb background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a7e5d3] via-[#f4c5a8] to-[#c8b8e0] opacity-40 group-hover:opacity-70 transition-opacity blur-xs"></div>
            <Shield className="w-5 h-5 relative z-10 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl tracking-tight text-[#0c0a09] font-normal">
                BharatDoc
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f4f4f5] border border-[#e4e4e7] text-[#27272a] shadow-2xs">
                <span className="dot-normal" />
                <span className="tracking-wide">ABDM FHIR R4</span>
              </span>
            </div>
            <p className="text-[11px] text-[#777169] hidden sm:block">
              Multi-Modal Clinical Intelligence Platform
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Vernacular Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#e7e5e4] text-[#292524] hover:bg-[#f0efed] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#777169]" />
              <span>{LANGUAGES.find(l => l.code === currentLang)?.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-[#777169]" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#e7e5e4] rounded-xl shadow-lg py-1 z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-[#f5f5f5] transition-colors ${
                      currentLang === l.code ? 'font-semibold text-[#0c0a09] bg-[#fafafa]' : 'text-[#4e4e4e]'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0efed] border border-[#e7e5e4] rounded-full text-xs font-medium text-[#0c0a09]">
              <div className="w-5 h-5 rounded-full bg-[#292524] text-white flex items-center justify-center text-[10px]">
                {user.email?.[0].toUpperCase() || 'U'}
              </div>
              <span className="max-w-[100px] truncate hidden sm:inline">{user.email}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-[#292524] text-white hover:bg-[#0c0a09] transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>ABHA Sign In</span>
            </button>
          )}
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={(u) => {
            setUser(u);
            setShowAuth(false);
          }}
        />
      )}
    </header>
  );
}
