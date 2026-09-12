import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { LangCode } from './lib/i18n';

export default function App() {
  const [lang, setLang] = useState<LangCode>('en');
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('bharatdoc_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default logged in user session if none exists
    return { email: 'patient@bharatdoc.in', user_metadata: { full_name: 'Patient User' } };
  });

  const handleSetUser = (u: any) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem('bharatdoc_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('bharatdoc_user');
      }
    } catch {}
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage lang={lang} setLang={setLang} />} />
        <Route path="/auth" element={<AuthPage lang={lang} setLang={setLang} onLogin={handleSetUser} />} />
        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard lang={lang} setLang={setLang} user={user} setUser={handleSetUser} />
              : <Navigate to="/auth?mode=login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
