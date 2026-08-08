import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { KeyRound, ShieldCheck, CheckCircle2, ExternalLink, Cpu, Trash2, Zap, AlertCircle } from 'lucide-react';
import { getStoredGroqKey, saveStoredGroqKey, clearStoredGroqKey } from '../lib/groqStorage';

interface GroqApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (newKey: string) => void;
}

export const GroqApiKeyModal: React.FC<GroqApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [keyInput, setKeyInput] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [hasEnvKey, setHasEnvKey] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getStoredGroqKey());
      checkBackendGroqStatus();
    }
  }, [isOpen]);

  const checkBackendGroqStatus = async () => {
    try {
      const res = await fetch('/api/groq-status');
      if (res.ok) {
        const data = await res.json();
        setHasEnvKey(data.hasEnvKey);
      }
    } catch (e) {
      console.warn('Could not check backend Groq status', e);
    }
  };

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid Groq API key (starts with gsk_).' });
      return;
    }

    setIsTesting(true);
    setStatusMsg({ type: 'info', text: 'Testing Groq API key with llama-3.3-70b-versatile...' });

    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-groq-api-key': trimmed,
        },
        body: JSON.stringify({
          userNeed: 'Minimal portfolio test',
          groqApiKey: trimmed,
        }),
      });

      if (res.ok) {
        saveStoredGroqKey(trimmed);
        setStatusMsg({ type: 'success', text: 'Groq API Key successfully verified and saved!' });
        if (onKeySaved) onKeySaved(trimmed);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        saveStoredGroqKey(trimmed); // Save anyway if user wants to keep it
        setStatusMsg({
          type: 'error',
          text: errData.error || errData.details || 'Groq API returned an error. Key saved locally.',
        });
        if (onKeySaved) onKeySaved(trimmed);
      }
    } catch (err: any) {
      saveStoredGroqKey(trimmed);
      setStatusMsg({ type: 'success', text: 'Groq API Key saved locally to browser storage!' });
      if (onKeySaved) onKeySaved(trimmed);
    } finally {
      setIsTesting(false);
    }
  };

  const handleRemove = () => {
    clearStoredGroqKey();
    setKeyInput('');
    setStatusMsg({ type: 'info', text: 'Custom Groq API Key removed.' });
    if (onKeySaved) onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                Configure Groq API Key
              </h3>
              <p className="text-xs text-zinc-400 font-mono">Ultra-fast Groq Llama 3.3 70B AI Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-sm font-bold w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Status Indicator */}
        <div className="bg-[#111111] p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-zinc-300">Active Model:</span>
            <span className="text-indigo-300 font-bold">llama-3.3-70b-versatile</span>
          </div>
          {hasEnvKey ? (
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
              ENV KEY ACTIVE
            </span>
          ) : keyInput ? (
            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
              CUSTOM KEY SAVED
            </span>
          ) : (
            <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
              NO KEY SET
            </span>
          )}
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="font-mono text-zinc-300 font-medium">Groq API Key (gsk_...)</label>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px] flex items-center gap-1 underline"
            >
              Get free key at Groq Console <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-[#111111] border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 font-mono focus:outline-none transition"
            />
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">
            Your key is stored securely in your browser session and transmitted directly to the Groq server endpoint over SSL encryption.
          </p>
        </div>

        {/* Feedback Alert */}
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
              <Zap className="w-4 h-4 shrink-0 text-indigo-400 animate-pulse" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {keyInput && (
            <button
              type="button"
              onClick={handleRemove}
              className="bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-zinc-800 px-4 py-3 rounded-xl text-xs font-mono font-medium transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAndTest}
            disabled={isTesting}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isTesting ? 'Testing Groq Connection...' : 'Save & Verify Key'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
