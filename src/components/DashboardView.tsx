import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutGrid,
  Zap,
  Sparkles,
  Code2,
  Trash2,
  ExternalLink,
  Crown,
  Receipt,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { GeneratedPromptPackage, User } from '../types';

interface DashboardViewProps {
  user: User;
  packages: GeneratedPromptPackage[];
  onSelectPackageForSandbox: (pkg: GeneratedPromptPackage) => void;
  onDeletePackage: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  packages,
  onSelectPackageForSandbox,
  onDeletePackage,
  onNavigateTab,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tokenPercent = Math.round((user.tokensLeft / user.tokensMax) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-xl object-cover border border-zinc-700 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-semibold text-white">Welcome back, {user.name}!</h1>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded">
                {user.plan} TIER
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {user.email} • Member since {user.createdAt}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('generator')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-600/30 hover:scale-105 transition flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          New Voice & Text Prompt
        </button>
      </div>

      {/* Top Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Token Balance */}
        <div className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400 font-mono">
            <span className="text-[10px] uppercase tracking-widest">AI Daily Tokens</span>
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-white">{user.tokensLeft}</span>
            <span className="text-xs text-zinc-400 font-mono">/ {user.tokensMax} remaining</span>
          </div>

          <div className="w-full bg-[#111111] h-2 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-indigo-600 h-full transition-all duration-500"
              style={{ width: `${tokenPercent}%` }}
            />
          </div>
        </div>

        {/* Total Generated Sites */}
        <div className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400 font-mono">
            <span className="text-[10px] uppercase tracking-widest">Saved Layouts</span>
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-white">{packages.length} Projects</div>
          <div className="text-xs text-zinc-400">Ready in Sandbox for React export</div>
        </div>

        {/* Membership Status */}
        <div className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400 font-mono">
            <span className="text-[10px] uppercase tracking-widest">Active Plan</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-serif font-semibold text-white capitalize">{user.plan} Creator</div>
          <button
            onClick={() => onNavigateTab('membership')}
            className="text-xs font-mono text-indigo-400 hover:underline flex items-center gap-1"
          >
            Upgrade Membership →
          </button>
        </div>
      </div>

      {/* Productivity Quick Start Templates Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block mb-1">
              ⚡ Instant Productivity Presets
            </span>
            <h2 className="text-xl font-serif font-semibold text-white">One-Click AI Layout Starter Kits</h2>
          </div>
          <button
            onClick={() => onNavigateTab('generator')}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Custom Prompt Generator →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[
            {
              title: 'AI Code Copilot SaaS',
              tag: 'SaaS Platform',
              desc: 'Dark luxury SaaS layout with live terminal preview, feature matrix, and pricing tier cards.',
              color: 'border-indigo-500/30 text-indigo-300',
            },
            {
              title: 'Acoustic Headphones 3D',
              tag: 'E-Commerce',
              desc: 'High-end audio store layout with product metrics, order simulator, and dark mode theme.',
              color: 'border-cyan-500/30 text-cyan-300',
            },
            {
              title: 'Crypto FinTech Wallet',
              tag: 'FinTech App',
              desc: 'Cyberpunk style landing page with live exchange calculator and security certificates.',
              color: 'border-emerald-500/30 text-emerald-300',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => onNavigateTab('generator')}
              className="bg-[#111111] hover:bg-[#161616] border border-zinc-800 hover:border-indigo-500/50 p-5 rounded-xl cursor-pointer transition space-y-3 shadow-md flex flex-col justify-between"
            >
              <div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-indigo-950/40 ${item.color}`}>
                  {item.tag}
                </span>
                <h3 className="text-sm font-bold text-white mt-2">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
              </div>

              <div className="text-[11px] font-mono text-indigo-400 font-medium flex items-center justify-between pt-2 border-t border-zinc-800/60">
                <span>⚡ Auto-Generate Prompt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-semibold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            Saved Site Layout History
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            {packages.length} saved packages
          </span>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs font-mono">
            No saved prompts or site layouts yet. Generate your first one using Voice or Text!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                className="bg-[#111111] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                      {pkg.category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-semibold text-white mb-2">{pkg.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 font-mono bg-[#050505] p-2.5 rounded-lg border border-zinc-800">
                    "{pkg.prompt}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => copyPrompt(pkg.id, pkg.prompt)}
                    className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1"
                  >
                    {copiedId === pkg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === pkg.id ? 'Copied' : 'Copy Prompt'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeletePackage(pkg.id)}
                      className="p-2 text-zinc-500 hover:text-rose-400 transition"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectPackageForSandbox(pkg)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                    >
                      Sandbox Preview
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
