import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, ShieldCheck, Key, Save, CheckCircle2, Crown, Zap } from 'lucide-react';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onNavigateMembership: () => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onNavigateMembership,
}) => {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const [apiKeyCustom, setApiKeyCustom] = useState<string>(user.apiKeyCustom || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      name,
      email,
      avatar,
      apiKeyCustom,
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={avatar} alt={name} className="w-16 h-16 rounded-xl object-cover border border-zinc-700 shadow-xl" />
          <div>
            <h1 className="text-2xl font-serif font-semibold text-white">{name}</h1>
            <p className="text-xs text-zinc-400 font-mono">{email}</p>
          </div>
        </div>

        <div className="bg-[#111111] px-4 py-2 rounded-xl border border-zinc-800 text-xs font-mono font-bold text-indigo-400">
          {user.plan.toUpperCase()} MEMBERSHIP
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 p-4 rounded-xl text-xs font-mono text-center">
          ✓ Profile preferences updated successfully!
        </div>
      )}

      {/* Main Profile Settings Form */}
      <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-indigo-400" />
          Account & Profile Settings
        </h2>

        {/* Avatar Picker */}
        <div>
          <label className="text-xs font-mono text-zinc-400 block mb-2">Choose Avatar:</label>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {AVATAR_OPTIONS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAvatar(url)}
                className={`rounded-xl overflow-hidden border-2 transition transform hover:scale-105 shrink-0 ${
                  avatar === url ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-zinc-800'
                }`}
              >
                <img src={url} alt={`Avatar ${i}`} className="w-12 h-12 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* API Key */}
        <div>
          <label className="text-xs font-mono text-zinc-400 block mb-1 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            Custom Gemini API Key Override (Optional):
          </label>
          <input
            type="password"
            placeholder="AI Studio automatically provides GEMINI_API_KEY. Leave blank for default."
            value={apiKeyCustom}
            onChange={(e) => setApiKeyCustom(e.target.value)}
            className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-600/30 hover:scale-105 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </form>
    </div>
  );
};
