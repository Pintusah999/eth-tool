import React, { useState } from 'react';
import { Terminal, Shield, History, Eye, EyeOff, LogIn, Cpu } from 'lucide-react';

interface SignInScreenProps {
  onSignIn: (email: string, id: string) => void;
}

export default function SignInScreen({ onSignIn }: SignInScreenProps) {
  const [email, setEmail] = useState('admin@aadvik-tek.labs');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter an email address');
      return;
    }
    
    setIsAuthorizing(true);
    setErrorMessage('');
    
    // Simulate high-fidelity network authorization handshake
    setTimeout(() => {
      setIsAuthorizing(false);
      onSignIn(email, 'OPS-8821');
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans p-4">
      {/* High-tech matrix style grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Modern subtle status indicator ornament */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-zinc-200 via-zinc-900 to-zinc-200 dark:from-zinc-900 dark:via-zinc-100 dark:to-zinc-900 opacity-60" />

      <main className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* Logo Cluster */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950 mb-4 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all hover:scale-105 duration-200">
            <Terminal className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
            SGi DBG Tool
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mt-1">
            Aadvik Tek Labs • System Node Access
          </p>
        </div>

        {/* Login Container */}
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm rounded-lg transition-all">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field Label Caps */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-[11px] font-semibold tracking-wider text-zinc-800 dark:text-zinc-300 uppercase">
                  Email Address
                </label>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                  REQ_FIELD
                </span>
              </div>
              <input
                className="w-full h-11 px-3.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 font-mono text-sm tracking-tight transition-all rounded text-zinc-800 dark:text-zinc-200"
                id="email"
                name="email"
                placeholder="admin@aadvik-tek.labs"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field Label Caps */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-[11px] font-semibold tracking-wider text-zinc-800 dark:text-zinc-300 uppercase">
                  Password
                </label>
                <button 
                  type="button"
                  className="text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase"
                  onClick={() => setPassword('')}
                >
                  Reset
                </button>
              </div>
              <div className="relative">
                <input
                  className="w-full h-11 px-3.5 pr-12 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 font-mono text-sm tracking-tight transition-all rounded text-zinc-800 dark:text-zinc-200"
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs font-mono text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 border border-red-200/50 dark:border-red-900/50 rounded">
                {errorMessage}
              </p>
            )}

            {/* Action Button */}
            <div className="pt-1">
              <button
                className="w-full h-11 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-75 text-zinc-50 dark:text-zinc-950 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded transition-all active:scale-[0.98]"
                type="submit"
                disabled={isAuthorizing}
              >
                {isAuthorizing ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-zinc-400 dark:text-zinc-600" />
                    <span>AUTHORIZING...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Footnote / Status indicator pill */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-zinc-500 uppercase">
                SECURE GATEWAY: READY
              </span>
            </div>
          </form>
        </div>

        {/* System Footer bar */}
        <div className="mt-6 flex gap-6 text-zinc-400 dark:text-zinc-600">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">TLS 1.3 ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">v2.4.0-STABLE</span>
          </div>
        </div>
      </main>
    </div>
  );
}
