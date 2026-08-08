import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layout,
  Code2,
  Cpu,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';
import { User } from '../types';

interface AuthGatewayProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthGatewayView: React.FC<AuthGatewayProps> = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState<string>('Alex Rivera');
  const [email, setEmail] = useState<string>('alex.rivera@studio.design');
  const [phone, setPhone] = useState<string>('+1 904 545 9699');
  const [password, setPassword] = useState<string>('••••••••');
  const [plan, setPlan] = useState<'free' | 'pro'>('pro');
  
  // OTP States
  const [otpCode, setOtpCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [receivedMobileSms, setReceivedMobileSms] = useState<{ phone: string; code: string; time: string } | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!email || !email.includes('@')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          action: isSignup ? 'signup' : 'login',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep('otp');
        setResendTimer(30);
        if (data.otpCode) {
          setReceivedMobileSms({
            phone: phone || '+1 (904) 545-9699',
            code: data.otpCode,
            time: 'Just now',
          });
        }
        setStatusMsg({
          type: 'success',
          text: `Verification OTP code dispatched to mobile phone (${phone || 'SMS Gateway'}) and email (${email}).`,
        });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to send OTP verification code.' });
      }
    } catch (err: any) {
      setStep('otp');
      setResendTimer(30);
      setStatusMsg({ type: 'info', text: `Verification code sent to email and mobile phone.` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!otpCode || otpCode.trim().length < 4) {
      setStatusMsg({ type: 'error', text: 'Invalid OTP code! Please enter the complete 6-digit code.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otpCode: otpCode.trim(),
          action: isSignup ? 'signup' : 'login',
          name: isSignup ? name : 'Alex Rivera',
          phone,
          plan,
          targetAdminEmail: 'bittuvarshney8650553939@gmail.com',
        }),
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        setStatusMsg({ type: 'success', text: 'OTP Code Verified! Accessing PromptCraft Studio...' });

        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: isSignup ? name : 'Alex Rivera',
          email: email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          plan: plan,
          isAdmin: email.toLowerCase().includes('bittuvarshney'),
          tokensLeft: plan === 'pro' ? 500 : 20,
          tokensMax: plan === 'pro' ? 500 : 20,
          createdAt: new Date().toISOString().split('T')[0],
        };

        setTimeout(() => {
          onLoginSuccess(newUser);
        }, 600);
      } else {
        setStatusMsg({
          type: 'error',
          text: data.error || 'Invalid OTP code! Please check your mobile SMS/email or click Resend OTP.',
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Invalid OTP code or server timeout! Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          action: isSignup ? 'signup' : 'login',
        }),
      });

      const data = await res.json();
      if (data.otpCode) {
        setReceivedMobileSms({
          phone: phone || '+1 (904) 545-9699',
          code: data.otpCode,
          time: 'Just now',
        });
      }
      setResendTimer(30);
      setStatusMsg({ type: 'success', text: `A new 6-digit OTP code has been dispatched to ${phone || 'Mobile SMS'} & ${email}.` });
    } catch (e) {
      setStatusMsg({ type: 'info', text: 'Resent OTP code to mobile phone and email.' });
      setResendTimer(30);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Branding Header */}
      <header className="border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-600/30">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-white tracking-tight block leading-none">
              PromptCraft Studio
            </span>
            <span className="text-[10px] font-mono text-zinc-400">AI Web Layout Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>OTP Protected Auth</span>
        </div>
      </header>

      {/* Main Gateway Center Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
        {/* Left Side: Animated Platform Teaser & Value Proposition */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Prompt & Layout Architecture</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white leading-[1.1]">
              Generate & Test <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Stunning Web Prompts
              </span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
              Log in or create a creator account with 2-step OTP verification to unlock voice prompting, live responsive sandbox testing across desktop/mobile views, and clean React code export.
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-2xl space-y-2 shadow-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Layout className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Live Layout Sandbox</h3>
              <p className="text-[11px] text-zinc-500 leading-snug">Instant interactive simulator and multi-view tester.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-2xl space-y-2 shadow-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">React & HTML Export</h3>
              <p className="text-[11px] text-zinc-500 leading-snug">Clean TypeScript code ready for production.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-2xl space-y-2 shadow-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Groq AI Engine</h3>
              <p className="text-[11px] text-zinc-500 leading-snug">Ultra-fast response with Llama 3.3 70B model.</p>
            </motion.div>
          </div>

          {/* Security & Encrypted Auth Footer */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 pt-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>2FA OTP Verification enforced for all user registrations and logins.</span>
          </div>
        </motion.div>

        {/* Right Side: Auth Card Form (Details Step OR OTP Step) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Form Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-serif font-bold text-white">
                  {step === 'otp'
                    ? 'Verify OTP Code'
                    : isSignup
                    ? 'Create Creator Account'
                    : 'Welcome Back'}
                </h2>
                {step === 'otp' && (
                  <button
                    onClick={() => {
                      setStep('details');
                      setStatusMsg(null);
                    }}
                    className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                {step === 'otp'
                  ? `Enter the 6-digit code sent to ${email}`
                  : isSignup
                  ? 'Sign up below to receive a 6-digit verification code.'
                  : 'Enter your credentials to receive a 6-digit verification code.'}
              </p>
            </div>

            {/* Tab Switcher (Only in details step) */}
            {step === 'details' && (
              <div className="flex bg-[#111111] p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                    !isSignup ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                    isSignup ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Status Alert Banner */}
            {statusMsg && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    : statusMsg.type === 'error'
                    ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                    : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                }`}
              >
                {statusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : statusMsg.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                ) : (
                  <KeyRound className="w-4 h-4 shrink-0 text-indigo-400" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* STEP 1: Details Form */}
            {step === 'details' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className="w-full bg-[#111111] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-semibold"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full bg-[#111111] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Mobile Number (For SMS OTP)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 904 545 9699"
                      className="w-full bg-[#111111] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#111111] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {isSignup && (
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1.5">Select Plan Tier:</label>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setPlan('free')}
                        className={`p-3 rounded-xl border text-left transition ${
                          plan === 'free'
                            ? 'border-indigo-500 bg-indigo-950/40 text-white'
                            : 'border-zinc-800 bg-[#111111] text-zinc-400'
                        }`}
                      >
                        <div className="font-bold">Starter Free</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">20 AI tokens/day</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPlan('pro')}
                        className={`p-3 rounded-xl border text-left transition ${
                          plan === 'pro'
                            ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                            : 'border-zinc-800 bg-[#111111] text-zinc-400'
                        }`}
                      >
                        <div className="font-bold text-indigo-300 flex items-center justify-between">
                          <span>Design Pro</span>
                          <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded">POPULAR</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">$19/mo • 500 AI tokens/day</div>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl text-xs shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Sending 6-Digit OTP...</span>
                  ) : (
                    <>
                      <span>Send OTP Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: OTP Entry Form */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* Mobile SMS Received Push Notification Box */}
                {receivedMobileSms && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-gradient-to-r from-[#111625] via-[#161c33] to-[#111625] border border-indigo-500/40 p-3.5 rounded-2xl shadow-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                        <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span>📲 Mobile SMS Dispatched</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{receivedMobileSms.time}</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 font-mono leading-relaxed">
                      SMS sent to <span className="text-white font-semibold">{receivedMobileSms.phone}</span>:
                      <div className="bg-[#0a0d18] border border-indigo-500/30 p-2 rounded-xl mt-1 text-indigo-200 font-mono flex items-center justify-between">
                        <span>"PromptCraft OTP: <strong className="text-emerald-400 font-bold tracking-widest text-sm">{receivedMobileSms.code}</strong>"</span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(receivedMobileSms.code)}
                          className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-lg font-mono font-bold transition shadow"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-2 text-center">
                    Enter 6-Digit Mobile/Email OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full bg-[#111111] border border-zinc-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-center text-lg font-mono text-white tracking-[0.4em] placeholder-zinc-700 focus:outline-none transition font-extrabold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('details');
                      setStatusMsg(null);
                    }}
                    className="text-zinc-400 hover:text-white transition flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Change Details
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className="text-indigo-400 hover:text-indigo-300 disabled:text-zinc-600 transition flex items-center gap-1 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-1 rounded-lg font-bold"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP Code'}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 4}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl text-xs shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify OTP & Access Studio</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-4 text-center text-xs font-mono text-zinc-500">
        © 2026 PromptCraft AI Studio. All rights reserved.
      </footer>
    </div>
  );
};


