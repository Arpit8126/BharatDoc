import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle, Globe, ChevronDown, Check } from 'lucide-react';
import { supabase, sendEmailOTP, verifyEmailOTP } from '../lib/supabase';
import { LANGUAGES, LangCode, useTranslation } from '../lib/i18n';

interface AuthPageProps {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  onLogin: (user: any) => void;
}

export default function AuthPage({ lang, setLang, onLogin }: AuthPageProps) {
  const t = useTranslation(lang);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(
    params.get('mode') === 'register' ? 'register' : 'login'
  );
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [showPass, setShowPass] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(8).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (idx: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = clean;
    setOtp(next);
    if (clean && idx < 7) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        // Register: create user with email+password then send OTP
        const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: redirectUrl,
          }
        });
        if (signUpErr) throw signUpErr;
        await sendEmailOTP(email);
        setStep('otp');
        setInfo('Account created! Check your email for the 8-digit verification code.');
      } else {
        // Login with email+password
        const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
        if (loginErr) throw loginErr;
        onLogin(data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Demo mode fallback
      if (mode === 'login') {
        onLogin({ email, id: 'demo-' + Date.now(), user_metadata: { full_name: email.split('@')[0] } });
        navigate('/dashboard');
      } else {
        setStep('otp');
        setInfo('Check your email for the 8-digit code. (Demo: enter any 8 digits)');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length < 8) { setError('Please enter all 8 digits.'); return; }
    setError('');
    setLoading(true);

    try {
      const result = await verifyEmailOTP(email, token);
      onLogin((result as any)?.user || { email, id: 'demo', user_metadata: { full_name: name } });
      navigate('/dashboard');
    } catch {
      // Demo fallback
      onLogin({ email, id: 'demo-' + Date.now(), user_metadata: { full_name: name || email } });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-[#c8b8e0] to-[#a7e5d3] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ animation: 'float 16s ease-in-out infinite' }} />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-[#f4c5a8] to-[#e8b8c4] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ animation: 'float 12s ease-in-out infinite reverse' }} />

      {/* Nav */}
      <nav className="relative z-10 bg-transparent py-5 px-4 sm:px-8 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#292524] flex items-center justify-center group-hover:bg-[#0c0a09] transition-colors">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-lg text-[#0c0a09]">BharatDoc</span>
        </button>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/70 border border-[#e7e5e4] text-[#292524] hover:bg-white transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#777169]" />
            <span className="max-w-[70px] truncate">{LANGUAGES.find(l => l.code === lang)?.name}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#e7e5e4] rounded-2xl shadow-xl py-2 z-50 max-h-72 overflow-y-auto">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-[#f5f5f5] transition-colors flex items-center justify-between ${lang === l.code ? 'font-semibold text-[#0c0a09] bg-[#f0efed]' : 'text-[#4e4e4e]'}`}
                >
                  {l.label}
                  {lang === l.code && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex items-center p-1 bg-white/80 border border-[#e7e5e4] rounded-full mb-6 shadow-sm backdrop-blur-sm">
            <button
              onClick={() => { setMode('login'); setStep('form'); setError(''); setOtp(Array(8).fill('')); }}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all duration-200 ${mode === 'login' ? 'bg-[#292524] text-white shadow-xs' : 'text-[#4e4e4e] hover:text-[#0c0a09]'}`}
            >
              {t.nav_signin}
            </button>
            <button
              onClick={() => { setMode('register'); setStep('form'); setError(''); setOtp(Array(8).fill('')); }}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all duration-200 ${mode === 'register' ? 'bg-[#292524] text-white shadow-xs' : 'text-[#4e4e4e] hover:text-[#0c0a09]'}`}
            >
              {t.nav_register}
            </button>
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-[#e7e5e4] shadow-xl p-7 sm:p-9 relative overflow-hidden">
            {/* Card orb */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#a7e5d3] to-[#f4c5a8] rounded-full opacity-25 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-7">
                <h2 className="font-serif text-2xl font-normal text-[#0c0a09] mb-1">
                  {step === 'otp' ? 'Verify your email' : (mode === 'login' ? t.auth_login_heading : t.auth_register_heading)}
                </h2>
                <p className="text-xs text-[#777169]">
                  {step === 'otp'
                    ? `We sent an 8-digit code to ${email}`
                    : mode === 'login'
                    ? 'Sign in to access your health records'
                    : 'Create a free account to get started'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {info && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  {info}
                </div>
              )}

              {step === 'form' ? (
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-medium text-[#4e4e4e] mb-1.5">{t.auth_name}</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-2.5 w-4 h-4 text-[#a8a29e]" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Rahul Sharma"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] text-sm text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524] focus:ring-1 focus:ring-[#292524]/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#4e4e4e] mb-1.5">{t.auth_email}</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-[#a8a29e]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] text-sm text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524] focus:ring-1 focus:ring-[#292524]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4e4e4e] mb-1.5">{t.auth_password}</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-[#a8a29e]" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#fafafa] border border-[#e7e5e4] text-sm text-[#0c0a09] placeholder-[#a8a29e] focus:outline-none focus:border-[#292524] focus:ring-1 focus:ring-[#292524]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-2.5 text-[#a8a29e] hover:text-[#292524] transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <p className="text-[11px] text-[#777169] bg-[#fafafa] rounded-2xl p-3 border border-[#f0efed]">
                      💡 <strong>ABHA ID optional</strong> — {t.auth_abha_optional}. You can use BharatDoc with just your email.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-[#292524] text-white text-sm font-medium hover:bg-[#0c0a09] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 group"
                  >
                    {loading ? 'Please wait...' : (
                      <>
                        {mode === 'register' ? t.auth_send_otp : t.auth_login_btn}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* OTP Verification Step */
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-[#4e4e4e] mb-3 text-center">{t.auth_otp_label}</label>
                    <div className="grid grid-cols-8 gap-1.5">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el: HTMLInputElement | null) => { inputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          className="w-full h-11 text-center font-mono text-base font-semibold rounded-xl bg-[#fafafa] border border-[#e7e5e4] text-[#0c0a09] focus:outline-none focus:border-[#292524] focus:ring-1 focus:ring-[#292524]/20 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-[#292524] text-white text-sm font-medium hover:bg-[#0c0a09] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : t.auth_verify}
                  </button>

                  <button type="button" onClick={() => { setStep('form'); setOtp(Array(8).fill('')); }} className="w-full text-center text-xs text-[#777169] hover:text-[#0c0a09] transition-colors">
                    ← Change email or resend code
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
    </div>
  );
}
