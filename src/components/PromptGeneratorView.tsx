import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Sparkles,
  Wand2,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Layers,
  Palette,
  ArrowRight,
  Zap,
  RotateCcw,
  Sun,
  Moon,
  Terminal,
  FileCode,
  Volume2,
  VolumeX,
  AlertCircle,
} from 'lucide-react';
import { GeneratedPromptPackage, User } from '../types';
import { getStoredGroqKey } from '../lib/groqStorage';
import { SitePreviewRenderer } from './SitePreviewRenderer';

interface PromptGeneratorViewProps {
  user: User | null;
  onSavePackage: (pkg: GeneratedPromptPackage) => void;
  onSendToSandbox: (pkg: GeneratedPromptPackage) => void;
  onDeductToken: () => void;
  onOpenAuth: () => void;
  latestPackage: GeneratedPromptPackage | null;
}

const PRESET_IDEAS = [
  'A dark luxury watch store with 3D showcase and interactive order simulator',
  'A developer AI agent platform with live code terminal and pricing tiers',
  'A cyberpunk crypto fintech app with exchange rate calculator & security badges',
  'A minimalist creative agency portfolio with case studies & consultation booking',
  'A SaaS workflow tool with live analytics counters and customer testimonials',
];

const STYLE_VIBES = [
  'Modern Dark Studio',
  'Cyberpunk Glass',
  'SaaS Minimal Light',
  'Luxury Gold Dark',
  'Swiss Editorial',
];

export const PromptGeneratorView: React.FC<PromptGeneratorViewProps> = ({
  user,
  onSavePackage,
  onSendToSandbox,
  onDeductToken,
  onOpenAuth,
  latestPackage,
}) => {
  const [userQuery, setUserQuery] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Modern Dark Studio');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStep, setGenStep] = useState<number>(0);
  const [currentPackage, setCurrentPackage] = useState<GeneratedPromptPackage | null>(latestPackage);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [codeTab, setCodeTab] = useState<'preview' | 'html' | 'react' | 'explanation'>('preview');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition with robust transcript & error handling
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullText = (finalTranscript + interimTranscript).trim();
        if (fullText) {
          setUserQuery(fullText);
          setVoiceError(null);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Microphone permission blocked or restricted in preview iframe. Please type your request or allow mic in browser settings.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Please speak clearly into your microphone.');
        } else if (event.error === 'network') {
          setVoiceError('Speech recognition network service unavailable. Please check internet connection.');
        } else if (event.error !== 'aborted') {
          setVoiceError(`Voice recognition error (${event.error}). Please try speaking again or use text input.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setVoiceError('Web Speech Recognition API is not natively supported in this browser. Please type your query.');
    }
  }, []);

  const toggleRecording = () => {
    setVoiceError(null);
    if (!recognitionRef.current) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setVoiceError('Speech recognition is unavailable in this browser. Please use text input.');
        return;
      }
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.log(e);
      }
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err: any) {
        console.warn('Failed starting mic:', err);
        // Try re-instantiating if recognition stalled
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const freshRec = new SpeechRecognition();
          freshRec.continuous = true;
          freshRec.interimResults = true;
          freshRec.lang = 'en-US';
          freshRec.onresult = (event: any) => {
            let txt = '';
            for (let i = 0; i < event.results.length; ++i) {
              txt += event.results[i][0].transcript;
            }
            if (txt.trim()) setUserQuery(txt.trim());
          };
          freshRec.onerror = (e: any) => setVoiceError(`Mic error: ${e.error}`);
          freshRec.onend = () => setIsRecording(false);
          recognitionRef.current = freshRec;
          try {
            freshRec.start();
            setIsRecording(true);
          } catch (e2) {
            setVoiceError('Unable to access microphone. Please enable mic access or type your prompt.');
          }
        }
      }
    }
  };

  const speakPromptOutLoud = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerate = async () => {
    if (!userQuery.trim()) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    if (user.tokensLeft <= 0) {
      alert('You have used all your daily tokens! Please upgrade your plan in the Membership section.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenStep(1);

    const stepInterval = setInterval(() => {
      setGenStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 800);

    try {
      const groqKey = getStoredGroqKey();
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(groqKey ? { 'x-groq-api-key': groqKey } : {}),
        },
        body: JSON.stringify({
          userNeed: userQuery,
          stylePreference: selectedStyle,
          groqApiKey: groqKey,
        }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      const newPkg: GeneratedPromptPackage = {
        id: `pkg_${Date.now()}`,
        title: data.title || 'Custom AI Generated Site',
        category: data.category || 'Web Application',
        prompt: data.prompt,
        explanation: data.explanation,
        theme: data.theme,
        siteData: data.siteData,
        generatedHtmlCode: data.generatedHtmlCode,
        generatedReactCode: data.generatedReactCode,
        createdAt: new Date().toISOString(),
        userQuery,
      };

      setCurrentPackage(newPkg);
      onSavePackage(newPkg);
      onDeductToken();
      setIsGenerating(false);
      setGenStep(0);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Error generating prompt layout:', err);
      setErrorMessage(err.message || 'Failed to connect to AI generator service.');
      setIsGenerating(false);
      setGenStep(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const updatePrimaryColor = (newHex: string) => {
    if (!currentPackage) return;
    const updatedPkg: GeneratedPromptPackage = {
      ...currentPackage,
      theme: {
        ...currentPackage.theme,
        primary: newHex,
      },
    };
    setCurrentPackage(updatedPkg);
    onSavePackage(updatedPkg);
  };

  const handleMagicPolishPrompt = () => {
    if (!userQuery.trim()) {
      setUserQuery('Build a modern dark luxury SaaS platform for an AI code assistant with interactive live playground, performance counters, and 3-tier pricing');
      return;
    }
    const polished = `Create a ultra-polished, high-converting ${selectedStyle.toLowerCase()} web application layout for: "${userQuery.trim()}". 

Requirements:
1. Header: Clean logo mark, responsive navigation links, and primary CTA button.
2. Hero Section: High-contrast display typography, compelling subheadline, trust badge, primary and secondary CTAs, and 3 key metrics counters.
3. Features Grid: 4 modular feature cards with lucide icons, high-contrast surface styling, and category tags.
4. Interactive Element: Built-in live calculator/simulator widget allowing users to calculate real-time savings or ROI.
5. Pricing Table: 3 clear tier cards with popular badge and feature list.
6. Footer: Tagline, copyright, and quick links.`;
    setUserQuery(polished);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Productivity Stats HUD */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8 bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-center divide-x divide-zinc-800/60"
      >
        <div className="p-2">
          <div className="text-indigo-400 font-extrabold text-base sm:text-lg flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>10x Speed</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Instant AI Prompts</p>
        </div>

        <div className="p-2">
          <div className="text-emerald-400 font-extrabold text-base sm:text-lg flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>~14.5 Hours</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Coding Time Saved</p>
        </div>

        <div className="p-2">
          <div className="text-cyan-400 font-extrabold text-base sm:text-lg flex items-center justify-center gap-1.5">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>HTML + React</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Clean Code Export</p>
        </div>

        <div className="p-2">
          <div className="text-amber-400 font-extrabold text-base sm:text-lg flex items-center justify-center gap-1.5">
            <span>{user ? user.tokensLeft : 20}</span>
            <span className="text-xs text-zinc-500 font-normal">/ {user ? user.tokensMax : 20}</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Daily AI Tokens</p>
        </div>
      </motion.div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Speech & Text Real-time Layout Generator
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-4 leading-tight">
          Speak Your Vision. <br className="hidden sm:inline" />
          <span className="italic text-indigo-400">
            AI Builds The Prompt & Live Site.
          </span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Describe what you need in plain speech or text. PromptCraft AI engineers the precise prompt structure and generates an animated layout preview instantly.
        </p>
      </div>

      {/* Speech & Text Input Box Card */}
      <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden mb-12">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          {/* Text Area & Voice Recording Button */}
          <div className="relative">
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="e.g. Speak or type: Create a futuristic dark luxury store for AI headphones with 3D product cards and live currency conversion..."
              rows={3}
              className="w-full bg-[#111111] border border-zinc-800 rounded-xl p-4 pr-32 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition resize-none"
            />

            {/* Quick Action Overlay Buttons inside Textarea */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleMagicPolishPrompt}
                className="bg-indigo-950/90 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-500/40 px-2.5 py-2 rounded-xl text-xs font-mono font-medium transition flex items-center gap-1 shadow-md"
                title="Polish and structure your query with expert design parameters"
              >
                <Wand2 className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
                <span className="hidden sm:inline">Magic Polish</span>
              </button>

              {/* Mic Pulse Recording Button */}
              <button
                onClick={toggleRecording}
                type="button"
                className={`p-2.5 rounded-xl transition duration-200 flex items-center justify-center ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/50 ring-4 ring-rose-500/30'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
                title={isRecording ? 'Listening... Click to stop' : 'Click to Speak (Voice Input)'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Voice Indicator Badge & Error Banners */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-800/60 px-3 py-2 rounded-xl"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Voice Microphone Active: Speak clearly now into your mic. Your speech is converted to prompt in real time...</span>
            </motion.div>
          )}

          {voiceError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div>{voiceError}</div>
                <div className="text-[11px] text-zinc-400 flex flex-wrap gap-2 pt-1">
                  <span>Quick Voice Dictation Examples:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUserQuery("Build a modern SaaS landing page for an AI voice agent with dark luxury aesthetic, pricing table, and interactive audio playground");
                      setVoiceError(null);
                    }}
                    className="text-indigo-400 underline hover:text-indigo-300"
                  >
                    "AI Voice Agent SaaS"
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserQuery("Create a high-converting web store for wireless noise-canceling headphones with 3D product showcase and payment checkout");
                      setVoiceError(null);
                    }}
                    className="text-indigo-400 underline hover:text-indigo-300"
                  >
                    "Wireless Headphones Store"
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Vibe Selection Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs font-mono text-zinc-500 shrink-0">Style Vibe:</span>
              {STYLE_VIBES.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition shrink-0 ${
                    selectedStyle === style
                      ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                      : 'bg-[#111111] border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userQuery.trim()}
              className={`px-6 py-3 rounded-xl font-semibold text-xs flex items-center gap-2 transition shadow-xl ${
                isGenerating || !userQuery.trim()
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 active:scale-95 shadow-indigo-600/30'
              }`}
            >
              {isGenerating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-white" />
                  Generating Layout...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Prompt & Site Layout
                </>
              )}
            </button>
          </div>

          {/* Quick Idea Inspiration Chips */}
          <div className="pt-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">Inspiration Presets:</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => setUserQuery(idea)}
                  className="text-[11px] bg-[#111111] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 px-3 py-1 rounded-lg transition text-left"
                >
                  + {idea}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress / Step Loading Bar */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-slate-900 border border-indigo-500/30 p-6 rounded-2xl text-center shadow-xl mb-12"
        >
          <div className="flex justify-center mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-bounce" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            PromptCraft AI is Architecting Your Layout...
          </h3>

          <div className="space-y-2 text-xs text-slate-400 font-mono my-4">
            <div className={`flex items-center justify-center gap-2 ${genStep >= 1 ? 'text-emerald-400 font-bold' : ''}`}>
              <span>[1/3] Deconstructing user intent & prompt semantics</span>
            </div>
            <div className={`flex items-center justify-center gap-2 ${genStep >= 2 ? 'text-emerald-400 font-bold' : ''}`}>
              <span>[2/3] Synthesizing theme color palette & layout hierarchy</span>
            </div>
            <div className={`flex items-center justify-center gap-2 ${genStep >= 3 ? 'text-emerald-400 font-bold' : ''}`}>
              <span>[3/3] Compiling React TypeScript component schema</span>
            </div>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full"
              initial={{ width: '10%' }}
              animate={{ width: genStep === 1 ? '35%' : genStep === 2 ? '70%' : '95%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto bg-rose-950/80 border border-rose-500 text-rose-200 p-4 rounded-2xl text-xs font-medium mb-8 text-center">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* GENERATED RESULTS & REAL-TIME PREVIEW PANEL */}
      {currentPackage && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Generated Prompt Details Box */}
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-indigo-950/80 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30">
                  {currentPackage.category}
                </span>
                <h2 className="text-xl md:text-2xl font-serif font-semibold text-white mt-2">
                  {currentPackage.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => speakPromptOutLoud(currentPackage.prompt)}
                  className={`text-xs font-medium px-4 py-2.5 rounded-xl border flex items-center gap-2 transition ${
                    isPlayingAudio
                      ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse'
                      : 'bg-[#111111] hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                  }`}
                  title="Listen to generated prompt out loud"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                  {isPlayingAudio ? 'Stop Voice' : 'Listen Voice'}
                </button>

                <button
                  onClick={() => copyToClipboard(currentPackage.prompt)}
                  className="bg-[#111111] hover:bg-zinc-800 text-zinc-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-zinc-800 flex items-center gap-2 transition"
                >
                  {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedPrompt ? 'Prompt Copied!' : 'Copy AI Prompt'}
                </button>

                <button
                  onClick={() => onSendToSandbox(currentPackage)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  Test In Sandbox Page
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Prompt Text Box */}
            <div className="mt-6">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                Engineered Web Prompt:
              </label>
              <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800 font-mono text-xs text-indigo-200 leading-relaxed overflow-x-auto relative group">
                {currentPackage.prompt}
              </div>
            </div>

            {/* Explanation & Color Swatches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-zinc-800/80">
              <div className="md:col-span-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                  Design Architecture Rationale:
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-[#111111] p-3.5 rounded-xl border border-zinc-800/80">
                  {currentPackage.explanation}
                </p>
              </div>

              {/* Theme Color Tweaker */}
              <div className="bg-[#111111] p-3.5 rounded-xl border border-zinc-800/80">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  Theme Customizer:
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  {['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => updatePrimaryColor(hex)}
                      className={`w-6 h-6 rounded-full transition transform hover:scale-110 ${
                        currentPackage.theme.primary === hex ? 'ring-2 ring-white scale-110' : ''
                      }`}
                      style={{ backgroundColor: hex }}
                      title={`Set accent color ${hex}`}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  Font Pairing:{' '}
                  <span className="text-zinc-200 font-sans font-medium">{currentPackage.theme.fontPairing}</span>
                </div>
              </div>
            </div>
          </div>

          {/* VIEWPORT CONTROLS & CODE TABS */}
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 shadow-xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider text-indigo-300 px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 rounded-lg">
                REAL-TIME LIVE SITE PREVIEW
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#111111] p-1 rounded-xl border border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setCodeTab('preview')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  codeTab === 'preview' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Visual Site
              </button>
              <button
                onClick={() => setCodeTab('html')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  codeTab === 'html' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" /> HTML / Tailwind
              </button>
              <button
                onClick={() => setCodeTab('react')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  codeTab === 'react' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> React Code
              </button>
            </div>
          </div>

          {/* TAB CONTENT: PREVIEW OR CODE */}
          {codeTab === 'preview' && (
            <div className="bg-[#050505] border border-zinc-800 rounded-2xl p-2 md:p-6 shadow-2xl overflow-hidden">
              <SitePreviewRenderer pkg={currentPackage} viewport="desktop" />
            </div>
          )}

          {codeTab === 'html' && (
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-zinc-300 relative">
              <button
                onClick={() => copyToClipboard(currentPackage.generatedHtmlCode)}
                className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy HTML
              </button>
              <pre className="overflow-x-auto max-h-[500px] leading-relaxed p-4 bg-[#111111] rounded-xl border border-zinc-800">
                {currentPackage.generatedHtmlCode}
              </pre>
            </div>
          )}

          {codeTab === 'react' && (
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-zinc-300 relative">
              <button
                onClick={() => copyToClipboard(currentPackage.generatedReactCode)}
                className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy React Code
              </button>
              <pre className="overflow-x-auto max-h-[500px] leading-relaxed p-4 bg-[#111111] rounded-xl border border-zinc-800">
                {currentPackage.generatedReactCode}
              </pre>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
