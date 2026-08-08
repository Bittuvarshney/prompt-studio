import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Shield,
  Sparkles,
  Cpu,
  Layers,
  Globe,
  Code,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronRight,
  Send,
  Calculator,
} from 'lucide-react';
import { GeneratedPromptPackage, SiteLayoutData, ThemeConfig } from '../types';

interface SitePreviewRendererProps {
  pkg: GeneratedPromptPackage;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  interactiveMode?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Sparkles,
  Cpu,
  Layers,
  Globe,
  Code,
  Rocket,
  Star,
};

export const SitePreviewRenderer: React.FC<SitePreviewRendererProps> = ({
  pkg,
  viewport = 'desktop',
  interactiveMode = true,
}) => {
  const theme: ThemeConfig = {
    primary: pkg?.theme?.primary || '#6366f1',
    secondary: pkg?.theme?.secondary || '#06b6d4',
    background: pkg?.theme?.background || '#0a0a0a',
    surface: pkg?.theme?.surface || '#111111',
    text: pkg?.theme?.text || '#ffffff',
    mode: pkg?.theme?.mode || 'dark',
    fontPairing: pkg?.theme?.fontPairing || 'Plus Jakarta Sans + Playfair Display',
  };

  const siteData: SiteLayoutData = pkg?.siteData || {
    navbar: { logoText: 'Studio', links: ['Features', 'Pricing'], actionBtnText: 'Get Started' },
    hero: { headline: 'AI Web Design', subheadline: 'Create modern apps', primaryCta: 'Start', secondaryCta: 'Learn' },
    features: [],
  };

  const navbar = siteData.navbar || { logoText: 'Studio', links: ['Features', 'Pricing'], actionBtnText: 'Get Started' };
  const hero = siteData.hero || { headline: 'AI Web Design', subheadline: 'Create modern apps', primaryCta: 'Start', secondaryCta: 'Learn' };
  const features = siteData.features || [];
  const showcase = siteData.showcase || { sectionTitle: 'Showcase', subtitle: '', items: [] };
  const interactiveSection = siteData.interactiveSection;
  const pricing = siteData.pricing || { sectionTitle: 'Pricing Plans', plans: [] };
  const footer = siteData.footer || { tagline: 'Next-Gen Web Design Engine', copyright: '© 2026 PromptCraft Studio' };

  const [calcInput, setCalcInput] = useState<string>('10000');
  const [calcResult, setCalcResult] = useState<number>(9820);
  const [subscribedEmail, setSubscribedEmail] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerWidthClass =
    viewport === 'mobile'
      ? 'max-w-[390px] mx-auto border-4 border-slate-700/80 rounded-[32px] overflow-hidden shadow-2xl my-4'
      : viewport === 'tablet'
      ? 'max-w-[768px] mx-auto border-2 border-slate-700/60 rounded-2xl overflow-hidden shadow-xl my-4'
      : 'w-full rounded-2xl overflow-hidden';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCalcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCalcInput(val);
    const num = parseFloat(val) || 0;
    setCalcResult(Math.round(num * 0.982));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      showToast(`Thank you for subscribing, ${subscribedEmail}!`);
      setSubscribedEmail('');
    }
  };

  return (
    <div
      className={`transition-all duration-300 font-sans text-slate-100 ${containerWidthClass}`}
      style={{
        backgroundColor: theme.background || '#0f172a',
        color: theme.text || '#f8fafc',
      }}
    >
      {/* Toast Notification inside Sandbox */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-8 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold shadow-xl text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </motion.div>
      )}

      {/* --- NAVBAR --- */}
      <nav
        className="px-6 py-4 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-20"
        style={{
          borderColor: `${theme.primary}25`,
          backgroundColor: `${theme.background}d9`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-md"
            style={{ backgroundColor: theme.primary, color: '#000' }}
          >
            {(navbar.logoText || 'S').charAt(0)}
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            {navbar.logoText || 'Studio'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          {(navbar.links || []).map((link, i) => (
            <a
              key={i}
              href={`#${link.toLowerCase()}`}
              className="hover:opacity-100 opacity-80 transition cursor-pointer"
            >
              {link}
            </a>
          ))}
        </div>

        <button
          onClick={() => showToast(`Action triggered: ${navbar.actionBtnText || 'Get Started'}`)}
          className="px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg hover:scale-105 active:scale-95"
          style={{
            backgroundColor: theme.primary,
            color: '#090d16',
          }}
        >
          {navbar.actionBtnText || 'Get Started'}
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative px-6 py-16 md:py-24 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Animated Glow Backdrop */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25"
          style={{ backgroundColor: theme.primary }}
        />

        {hero.badge && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border mb-6 backdrop-blur-md"
            style={{
              borderColor: `${theme.primary}50`,
              backgroundColor: `${theme.surface}80`,
              color: theme.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {hero.badge}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6"
        >
          {hero.headline || 'Next-Gen Application'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 opacity-90"
        >
          {hero.subheadline || 'A modern web layout crafted with AI precision.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => showToast(`Clicked: ${hero.primaryCta || 'Get Started'}`)}
            className="px-6 py-3 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition"
            style={{
              backgroundColor: theme.primary,
              color: '#090d16',
            }}
          >
            {hero.primaryCta || 'Get Started'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => showToast(`Clicked: ${hero.secondaryCta || 'Learn More'}`)}
            className="px-6 py-3 rounded-xl text-sm font-semibold border hover:bg-slate-800/50 transition"
            style={{
              borderColor: `${theme.primary}40`,
            }}
          >
            {hero.secondaryCta || 'Learn More'}
          </button>
        </motion.div>

        {/* Hero Metrics */}
        {hero.metrics && hero.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-14 pt-8 border-t border-slate-800/80">
            {hero.metrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur">
                <div className="text-xl md:text-2xl font-black text-white" style={{ color: theme.primary }}>
                  {m.value}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- FEATURES GRID --- */}
      {features.length > 0 && (
        <section id="features" className="px-6 py-16 max-w-6xl mx-auto border-t border-slate-800/60">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
              Engineered For Next-Gen Performance
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Modular components built for reliability, speed, and real-time execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const IconComp = ICON_MAP[feat.iconName] || Zap;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl border transition duration-200 flex flex-col justify-between"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: `${theme.primary}20`,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                        style={{
                          backgroundColor: `${theme.primary}15`,
                          color: theme.primary,
                        }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      {feat.tag && (
                        <span
                          className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border"
                          style={{
                            borderColor: `${theme.primary}30`,
                            color: theme.primary,
                          }}
                        >
                          {feat.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* --- SHOWCASE / PRODUCT SECTION --- */}
      {showcase && showcase.items && showcase.items.length > 0 && (
        <section className="px-6 py-16 max-w-6xl mx-auto border-t border-slate-800/60">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{showcase.sectionTitle || 'Showcase'}</h2>
            {showcase.subtitle && (
              <p className="text-xs text-slate-400">{showcase.subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showcase.items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border bg-slate-900/60 flex flex-col justify-between gap-4"
                style={{ borderColor: `${theme.primary}20` }}
              >
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>

                {item.stats && (
                  <div
                    className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold"
                    style={{ color: theme.primary }}
                  >
                    <span>Metric:</span>
                    <span>{item.stats}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- INTERACTIVE SIMULATOR / CALCULATOR --- */}
      {interactiveSection && (
        <section className="px-6 py-16 max-w-4xl mx-auto border-t border-slate-800/60">
          <div
            className="p-8 rounded-3xl border text-center shadow-2xl relative overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              borderColor: `${theme.primary}40`,
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 mb-4 text-slate-200">
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              Interactive Live Simulator
            </div>

            <h3 className="text-2xl font-bold mb-2">{interactiveSection.title || 'Live Calculator'}</h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto mb-8">
              {interactiveSection.description || 'Estimate real-time ROI and output.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-xl mx-auto bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">
                  Input Amount ($)
                </label>
                <input
                  type="number"
                  value={calcInput}
                  onChange={handleCalcChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">
                  Net Estimated Output ($)
                </label>
                <div
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-black font-mono"
                  style={{ color: theme.primary }}
                >
                  ${calcResult.toLocaleString()} USD
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- PRICING SECTION --- */}
      {pricing && pricing.plans && pricing.plans.length > 0 && (
        <section id="pricing" className="px-6 py-16 max-w-5xl mx-auto border-t border-slate-800/60">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              {pricing.sectionTitle || 'Flexible Plans'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pricing.plans.map((plan, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl border flex flex-col justify-between relative ${
                  plan.isPopular ? 'shadow-2xl' : ''
                }`}
                style={{
                  backgroundColor: theme.surface,
                  borderColor: plan.isPopular ? theme.primary : `${theme.primary}20`,
                }}
              >
                {plan.isPopular && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md"
                    style={{ backgroundColor: theme.primary, color: '#000' }}
                  >
                    Popular Choice
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-extrabold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 my-6 text-xs text-slate-300">
                    {(plan.features || []).map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => showToast(`Subscribed to plan: ${plan.name}`)}
                  className="w-full py-3 rounded-xl text-xs font-bold transition shadow-md hover:opacity-90"
                  style={{
                    backgroundColor: plan.isPopular ? theme.primary : '#1e293b',
                    color: plan.isPopular ? '#000' : '#fff',
                    border: plan.isPopular ? 'none' : '1px solid #334155',
                  }}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- FOOTER --- */}
      <footer className="px-6 py-12 border-t border-slate-800/80 bg-slate-950/80">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-extrabold text-lg tracking-tight">
              {navbar.logoText || 'Studio'}
            </span>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {footer.tagline || 'Building next-generation AI web interfaces.'}
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={subscribedEmail}
              onChange={(e) => setSubscribedEmail(e.target.value)}
              required
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 w-full md:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              style={{ backgroundColor: theme.primary, color: '#000' }}
            >
              Subscribe
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          {footer.copyright || '© 2026 PromptCraft Studio'}
        </div>
      </footer>
    </div>
  );
};
