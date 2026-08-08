import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Laptop,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Sparkles,
  Download,
  Share2,
  Sliders,
  Palette,
  Play,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { GeneratedPromptPackage, User } from '../types';
import { SitePreviewRenderer } from './SitePreviewRenderer';

interface PromptTesterSandboxProps {
  activePackage: GeneratedPromptPackage;
  allPackages: GeneratedPromptPackage[];
  onSelectPackage: (pkg: GeneratedPromptPackage) => void;
  onUpdatePackage: (pkg: GeneratedPromptPackage) => void;
  user: User | null;
}

export const PromptTesterSandbox: React.FC<PromptTesterSandboxProps> = ({
  activePackage,
  allPackages,
  onSelectPackage,
  onUpdatePackage,
  user,
}) => {
  const currentPkg = activePackage || allPackages[0] || {
    id: 'default',
    title: 'Default Studio App',
    category: 'General',
    userQuery: 'Default query',
    createdAt: new Date().toISOString(),
    prompt: 'A modern clean dark mode website layout',
    explanation: '• Modular design',
    theme: {
      primary: '#6366f1',
      secondary: '#06b6d4',
      background: '#0a0a0a',
      surface: '#111111',
      text: '#ffffff',
      mode: 'dark',
      fontPairing: 'Plus Jakarta Sans',
    },
    siteData: {
      navbar: { logoText: 'Studio', links: ['Features'], actionBtnText: 'Get Started' },
      hero: { headline: 'Welcome', subheadline: 'AI Web Builder', primaryCta: 'Start', secondaryCta: 'Explore' },
      features: [],
    },
    generatedHtmlCode: '<h1>Default App</h1>',
    generatedReactCode: 'export default function App() { return <h1>Default</h1>; }',
  };

  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activePromptText, setActivePromptText] = useState<string>(currentPkg.prompt);
  const [activeTab, setActiveTab] = useState<'sandbox' | 'html' | 'react' | 'schema'>('sandbox');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  useEffect(() => {
    if (activePackage?.prompt) {
      setActivePromptText(activePackage.prompt);
    }
  }, [activePackage?.id]);

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApplyCustomPrompt = () => {
    const updatedPkg: GeneratedPromptPackage = {
      ...currentPkg,
      prompt: activePromptText,
    };
    onUpdatePackage(updatedPkg);
  };

  const handleThemeColorChange = (newPrimary: string) => {
    const updatedPkg: GeneratedPromptPackage = {
      ...currentPkg,
      theme: {
        ...(currentPkg.theme || {
          secondary: '#06b6d4',
          background: '#0a0a0a',
          surface: '#111111',
          text: '#ffffff',
          mode: 'dark',
          fontPairing: 'Plus Jakarta Sans',
        }),
        primary: newPrimary,
      },
    };
    onUpdatePackage(updatedPkg);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] border border-zinc-800 p-6 rounded-2xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded">
              PROMPT TESTING & PREVIEW SANDBOX
            </span>
            <span className="text-xs text-zinc-400 font-mono">• {currentPkg.category}</span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-white">{currentPkg.title}</h1>
        </div>

        {/* Viewport Switcher & Share */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#111111] p-1 rounded-xl border border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-2 rounded-lg flex items-center gap-1.5 transition ${
                viewport === 'desktop' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Laptop className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-2 rounded-lg flex items-center gap-1.5 transition ${
                viewport === 'tablet' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-2 rounded-lg flex items-center gap-1.5 transition ${
                viewport === 'mobile' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
          >
            <Share2 className="w-4 h-4" />
            Publish & Share
          </button>
        </div>
      </div>

      {/* History Selector Bar */}
      {allPackages.length > 1 && (
        <div className="bg-[#0a0a0a]/80 border border-zinc-800 p-4 rounded-xl flex items-center gap-3 overflow-x-auto">
          <span className="text-xs font-mono text-zinc-500 shrink-0">Switch Saved Prompt:</span>
          {allPackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => {
                onSelectPackage(pkg);
                setActivePromptText(pkg.prompt);
              }}
              className={`text-xs px-3.5 py-1.5 rounded-lg border transition whitespace-nowrap ${
                pkg.id === currentPkg.id
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 font-medium'
                  : 'bg-[#111111] border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {pkg.title}
            </button>
          ))}
        </div>
      )}

      {/* Editable Prompt & Theme Control Bar */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            Test Prompt Editor:
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">Accent Theme:</span>
            {['#6366f1', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'].map((hex) => (
              <button
                key={hex}
                onClick={() => handleThemeColorChange(hex)}
                className={`w-5 h-5 rounded-full transition transform hover:scale-125 ${
                  currentPkg?.theme?.primary === hex ? 'ring-2 ring-white scale-110' : ''
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <textarea
            value={activePromptText}
            onChange={(e) => setActivePromptText(e.target.value)}
            rows={2}
            className="w-full bg-[#111111] border border-zinc-800 rounded-xl p-3.5 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button
            onClick={handleApplyCustomPrompt}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shrink-0 flex items-center justify-center gap-2 transition"
          >
            <Play className="w-4 h-4 fill-white" />
            Apply Changes
          </button>
        </div>
      </div>

      {/* Tabs: Sandbox Visual vs Code Inspector */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-3 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#111111] p-1 rounded-xl border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'sandbox' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Interactive Website Sandbox
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'html' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" /> HTML Code
          </button>
          <button
            onClick={() => setActiveTab('react')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'react' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" /> React TSX Code
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'schema' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" /> JSON Layout Schema
          </button>
        </div>

        {(activeTab === 'html' || activeTab === 'react' || activeTab === 'schema') && (
          <button
            onClick={() =>
              copyCode(
                activeTab === 'html'
                  ? currentPkg.generatedHtmlCode || ''
                  : activeTab === 'react'
                  ? currentPkg.generatedReactCode || ''
                  : JSON.stringify(currentPkg.siteData || {}, null, 2)
              )
            }
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-2"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedCode ? 'Copied!' : 'Copy Code'}
          </button>
        )}
      </div>

      {/* Main Sandbox Visual Container */}
      {activeTab === 'sandbox' && (
        <div className="bg-[#050505] border border-zinc-800 rounded-2xl p-4 md:p-8 shadow-2xl overflow-hidden min-h-[600px] flex items-center justify-center">
          <SitePreviewRenderer pkg={currentPkg} viewport={viewport} />
        </div>
      )}

      {/* HTML Code Inspector */}
      {activeTab === 'html' && (
        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-zinc-300">
          <pre className="overflow-x-auto max-h-[600px] leading-relaxed p-4 bg-[#111111] rounded-xl border border-zinc-800">
            {currentPkg.generatedHtmlCode}
          </pre>
        </div>
      )}

      {/* React Code Inspector */}
      {activeTab === 'react' && (
        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-zinc-300">
          <pre className="overflow-x-auto max-h-[600px] leading-relaxed p-4 bg-[#111111] rounded-xl border border-zinc-800">
            {currentPkg.generatedReactCode}
          </pre>
        </div>
      )}

      {/* JSON Schema Inspector */}
      {activeTab === 'schema' && (
        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-indigo-300">
          <pre className="overflow-x-auto max-h-[600px] leading-relaxed p-4 bg-[#111111] rounded-xl border border-zinc-800">
            {JSON.stringify(currentPkg.siteData, null, 2)}
          </pre>
        </div>
      )}

      {/* Publish & Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-xl font-serif font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Live Website Deployment Link
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-zinc-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Your generated site layout preview is now published to PromptCraft CDN. Anyone with this link can view and test the live interactive preview.
            </p>

            <div className="bg-[#111111] p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-2 font-mono text-xs text-indigo-300">
              <span className="truncate">https://promptcraft.studio/preview/{currentPkg.id}</span>
              <button
                onClick={() => copyCode(`https://promptcraft.studio/preview/${currentPkg.id}`)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg font-medium shrink-0"
              >
                Copy URL
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-xs"
            >
              Done
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
