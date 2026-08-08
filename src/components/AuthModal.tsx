import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, KeyRound, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Phone, Smartphone, RefreshCw } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onLoginSuccess: (user: User) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, onClose }) => {
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState<string>('alex.rivera@studio.design');
  const [phone, setPhone] = useState<string>('+1 904 545 9699');
  const [password, setPassword] = useState<string>('••••••••');
  const [name, setName] = useState<string>('Alex Rivera');
  
  const [otpCode, setOtpCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [receivedMobileSms, setReceivedMobileSms] = useState<{ phone: string; code: string } | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, action: isSignup ? 'signup' : 'login' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep('otp');
        setResendTimer(30);
        if (data.otpCode) {
          setReceivedMobileSms({ phone: phone || '+1 (904) 545-9699', code: data.otpCode });
        }
        setStatusMsg({ type: 'success', text: `OTP code dispatched to mobile phone & email.` });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to send OTP verification code.' });
      }
    } catch (err) {
      setStep('otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, action: isSignup ? 'signup' : 'login' }),
      });
      const data = await res.json();
      if (data.otpCode) {
        setReceivedMobileSms({ phone: phone || '+1 (904) 545-9699', code: data.otpCode });
      }
      setResendTimer(30);
      setStatusMsg({ type: 'success', text: 'A new 6-digit OTP code has been sent to your mobile phone & email.' });
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Failed to resend code.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

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
          plan: 'pro',
          targetAdminEmail: 'bittuvarshney8650553939@gmail.com',
        }),
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: isSignup ? name : 'Alex Rivera',
          email: email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          plan: 'pro',
          isAdmin: email.toLowerCase().includes('bittuvarshney'),
          tokensLeft: 500,
          tokensMax: 500,
          createdAt: new Date().toISOString().split('T')[0],
        };
        onLoginSuccess(newUser);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Invalid OTP code! Please check your mobile SMS or click Resend OTP.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Invalid OTP code verification failure. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl p-8 space-y-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white font-bold text-sm"
        >
          ✕
        </button>

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 p-[1px] mx-auto shadow-lg shadow-indigo-600/30">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            {step === 'otp' ? 'Enter OTP Verification' : isSignup ? 'Create Your Account' : 'Welcome to PromptCraft'}
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            {step === 'otp'
              ? `Verification code sent to ${email}`
              : isSignup
              ? 'Start generating real-time animated web layouts with AI'
              : 'Sign in to access your saved prompts & AI layout engine'}
          </p>
        </div>

        {/* Tab Toggle (Details Step) */}
        {step === 'details' && (
          <div className="flex bg-[#111111] p-1 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 rounded-lg transition ${
                !isSignup ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 rounded-lg transition ${
                isSignup ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {statusMsg && (
          <div
            className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {step === 'details' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Email Address:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Mobile Phone (For SMS OTP):</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 904 545 9699"
                className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Password:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl text-xs shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Sending Mobile & Email OTP...' : 'Send OTP Verification Code'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {receivedMobileSms && (
              <div className="bg-[#111625] border border-indigo-500/40 p-3 rounded-xl space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-indigo-300 font-bold">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Mobile SMS Dispatched
                  </span>
                  <span className="text-[10px] text-zinc-400">Just now</span>
                </div>
                <div className="text-[11px] text-zinc-300">
                  SMS to <span className="text-white font-semibold">{receivedMobileSms.phone}</span>:
                  <div className="bg-[#0a0d18] border border-indigo-500/30 p-2 rounded-lg mt-1 text-indigo-200 flex items-center justify-between">
                    <span>"PromptCraft OTP: <strong className="text-emerald-400 font-bold text-sm tracking-widest">{receivedMobileSms.code}</strong>"</span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(receivedMobileSms.code)}
                      className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-bold"
                    >
                      Auto-Fill
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1 text-center">Enter 6-Digit OTP:</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-[#111111] border border-zinc-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-center font-mono text-lg text-white tracking-[0.3em] focus:outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Change Details
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-indigo-400 hover:text-indigo-300 disabled:text-zinc-600 flex items-center gap-1 bg-indigo-950/60 border border-indigo-500/30 px-2 py-1 rounded-lg"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Resend OTP Code</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl text-xs shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {isLoading ? 'Verifying...' : 'Verify OTP & Log In'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

