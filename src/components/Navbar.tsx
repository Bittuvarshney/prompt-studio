import React from 'react';
import {
  Sparkles,
  Zap,
  LayoutGrid,
  Code2,
  Crown,
  Receipt,
  Bot,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Sliders,
  KeyRound,
} from 'lucide-react';
import { ActiveTab, User } from '../types';

interface NavbarProps {
  user: User | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenGroqModal?: () => void;
  hasGroqKey?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenGroqModal,
  hasGroqKey = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-serif italic text-xl text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition duration-200">
            A
          </div>
          <div>
            <div className="flex items-center gap-2 text-white font-serif font-semibold tracking-wide text-base leading-tight">
              PROMPTCRAFT
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                STUDIO
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
              REAL-TIME AI LAYOUT ENGINE
            </span>
          </div>
        </button>

        {/* Main Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#111111]/90 p-1.5 rounded-xl border border-zinc-800/80 text-xs font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'generator'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                : 'hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Voice & AI Generator
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'tester'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                : 'hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Prompt Sandbox
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                : 'hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('membership')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'membership'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                : 'hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Membership
          </button>

          <button
            onClick={() => setActiveTab('bills')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'bills'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                : 'hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Bills & Invoices
          </button>

          <button
            onClick={() => setActiveTab('helpdesk')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === 'helpdesk'
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                : 'hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            AI Help Desk
          </button>
        </nav>

        {/* Right Utility & Profile Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Token Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-[#111111] border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-white font-mono font-bold">{user.tokensLeft}</span>
                <span className="text-zinc-500 font-mono text-[10px]">/ {user.tokensMax} AI</span>
              </div>

              {/* Profile Avatar Button */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2.5 p-1 rounded-xl border transition ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-zinc-700"
                />
                <div className="hidden md:block text-left pr-2">
                  <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400">
                    {user.plan} MEMBER
                  </span>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition hover:scale-105"
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bar Navigation */}
      <div className="lg:hidden flex items-center justify-around mt-3 pt-2 border-t border-zinc-800/60 text-xs font-medium text-zinc-400 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'generator' ? 'bg-indigo-600 text-white font-semibold' : ''
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Generator
        </button>
        <button
          onClick={() => setActiveTab('tester')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'tester' ? 'bg-indigo-600 text-white font-semibold' : ''
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> Sandbox
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white font-semibold' : ''
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Dashboard
        </button>
        <button
          onClick={() => setActiveTab('membership')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'membership' ? 'bg-indigo-600 text-white font-semibold' : ''
          }`}
        >
          <Crown className="w-3.5 h-3.5" /> Membership
        </button>
        <button
          onClick={() => setActiveTab('helpdesk')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'helpdesk' ? 'bg-indigo-600 text-white font-semibold' : ''
          }`}
        >
          <Bot className="w-3.5 h-3.5" /> Help Desk
        </button>
      </div>
    </header>
  );
};
