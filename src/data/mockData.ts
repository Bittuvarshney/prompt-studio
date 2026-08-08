import { GeneratedPromptPackage, MembershipPlanConfig, PaymentInvoice, User } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_882910',
  name: 'Alex Rivera',
  email: 'alex.rivera@studio.design',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  plan: 'pro',
  isAdmin: false,
  tokensLeft: 425,
  tokensMax: 500,
  apiKeyCustom: 'sk-genai-******************',
  createdAt: '2026-01-15',
};

export const INITIAL_PLANS: MembershipPlanConfig[] = [
  {
    id: 'free',
    title: 'Starter Creator',
    priceMonthly: 0,
    priceAnnual: 0,
    tokenLimit: 20,
    features: [
      '20 AI Prompt Generations / day',
      'Real-time Animated Layout Engine',
      'Basic Dark & Light Themes',
      'Community Help Desk Access',
      'Local Prompt History Saving',
    ],
    isActive: true,
  },
  {
    id: 'pro',
    title: 'Design Pro',
    priceMonthly: 19,
    priceAnnual: 180,
    tokenLimit: 500,
    badge: 'Most Popular',
    isPopular: true,
    features: [
      '500 AI Prompt Generations / day',
      'Voice-to-Prompt AI Builder',
      'Full React & HTML Code Export',
      'Interactive Live Website Sandbox',
      'Custom Theme Palette Creator',
      'Priority Gemini 3.6 Flash Speed',
      'Dedicated Help Desk AI Agent',
    ],
    isActive: true,
  },
  {
    id: 'enterprise',
    title: 'Studio Enterprise',
    priceMonthly: 79,
    priceAnnual: 750,
    tokenLimit: 10000,
    badge: 'Enterprise Ultimate',
    features: [
      '10,000 AI Prompt Generations / day',
      'White-label Custom Domain Export',
      'Custom JSON Site Schema Engine',
      'Dedicated 1-on-1 AI Architectural Agent',
      'Multi-user Team & Organization Suite',
      'Direct High-Speed Gateway API Access',
      'Dedicated Priority VIP Support',
    ],
    isActive: true,
  },
];

export const INITIAL_INVOICES: PaymentInvoice[] = [
  {
    id: 'INV-2026-0881',
    date: '2026-08-01',
    planName: 'Design Pro Membership (Monthly)',
    planTier: 'pro',
    amount: 19,
    currency: 'USD',
    status: 'Paid',
    paymentMethod: 'Visa ending in •••• 4242',
    transactionRef: 'txn_991823901823',
  },
  {
    id: 'INV-2026-0701',
    date: '2026-07-01',
    planName: 'Design Pro Membership (Monthly)',
    planTier: 'pro',
    amount: 19,
    currency: 'USD',
    status: 'Paid',
    paymentMethod: 'Visa ending in •••• 4242',
    transactionRef: 'txn_881723120198',
  },
  {
    id: 'INV-2026-0601',
    date: '2026-06-01',
    planName: 'Starter Creator Plan',
    planTier: 'free',
    amount: 0,
    currency: 'USD',
    status: 'Paid',
    paymentMethod: 'Free Tier',
    transactionRef: 'txn_free_signup',
  },
];

export const SAMPLE_GENERATED_PACKAGES: GeneratedPromptPackage[] = [
  {
    id: 'pkg_cyber_fintech',
    title: 'AuraPay - NextGen Cyber FinTech Landing',
    category: 'FinTech / Crypto',
    userQuery: 'Make a dark mode futuristic fintech landing page with glassmorphism cards and live currency conversion widget',
    createdAt: '2026-08-05T14:30:00Z',
    prompt: 'A dark luxury futuristic FinTech landing page with neon cyan (#06b6d4) and glowing violet (#8b5cf6) accents, glassmorphic card overlays, hero section with high-contrast typography ("The Future of Global Liquidity"), live animated currency exchange widget, 4-tier feature grid with glowing borders, customer stats counter, interactive fee calculator, and sleek dark footer.',
    explanation: '• High-contrast neon accents establish instant luxury vibe.\n• Live interactive widget keeps user dwell time high.\n• Glassmorphic cards separate hierarchy without messy nested borders.',
    theme: {
      primary: '#06b6d4',
      secondary: '#8b5cf6',
      background: '#0a0f1d',
      surface: '#111827',
      text: '#f8fafc',
      mode: 'dark',
      fontPairing: 'Plus Jakarta Sans + Syne',
    },
    siteData: {
      navbar: {
        logoText: 'AuraPay',
        links: ['Features', 'Liquidity', 'Security', 'Rates'],
        actionBtnText: 'Launch App',
      },
      hero: {
        badge: '⚡ Powered by Quantum Settlement Engine v4',
        headline: 'Instant Global Liquidity for Modern Visionaries',
        subheadline: 'Transfer, convert, and yield digital assets across 140 countries with sub-millisecond settlement times and zero gas overhead.',
        primaryCta: 'Start Free Trial',
        secondaryCta: 'Explore Live Rates',
        metrics: [
          { value: '$4.2B+', label: 'Volume Processed' },
          { value: '0.002s', label: 'Avg Latency' },
          { value: '99.99%', label: 'Uptime SLA' },
        ],
      },
      features: [
        {
          title: 'Sub-Millisecond Settlement',
          description: 'Instant cross-border routing using state-of-the-art decentralized cryptographic validation.',
          iconName: 'Zap',
          tag: 'Performance',
        },
        {
          title: 'Institutional Grade Security',
          description: 'SOC2 Type II certified HSM key vaults and multi-party computation security.',
          iconName: 'Shield',
          tag: 'Security',
        },
        {
          title: 'Smart Yield Optimization',
          description: 'Automated AI routing picks top liquidity pools to maximize risk-adjusted return.',
          iconName: 'Sparkles',
          tag: 'AI Powered',
        },
        {
          title: 'Zero-Code API Hooks',
          description: 'Drop-in SDKs for React, Python, and Rust with full webhook telemetry.',
          iconName: 'Code',
          tag: 'Developer',
        },
      ],
      showcase: {
        sectionTitle: 'Architected for Global Scale',
        subtitle: 'Trusted by over 450 enterprise fintech hubs worldwide.',
        items: [
          {
            title: 'Automated Treasury Engine',
            category: 'Enterprise',
            description: 'Consolidate multiple currency reserves automatically based on real-time volatility thresholds.',
            stats: '3.4x Faster Operations',
          },
          {
            title: 'Unified Billing & Payroll',
            category: 'Global Payroll',
            description: 'Disburse contractor payments across 80 currencies with zero FX markup.',
            stats: 'Save 92% on FX Fees',
          },
        ],
      },
      interactiveSection: {
        title: 'Live Exchange Fee Simulator',
        description: 'See exactly how much you save compared to legacy bank wires.',
        type: 'calculator',
        fields: [
          { label: 'Transfer Amount ($)', defaultValue: '10000' },
          { label: 'Destination Currency', defaultValue: 'EUR' },
        ],
      },
      pricing: {
        sectionTitle: 'Transparent Pricing, No Hidden Fees',
        plans: [
          {
            name: 'Starter Gateway',
            price: '$0',
            period: '/month',
            features: ['Up to $50k monthly volume', 'Standard Webhooks', '10 Currency pairs', 'Community Support'],
          },
          {
            name: 'Pro Trader',
            price: '$49',
            period: '/month',
            isPopular: true,
            features: ['Up to $1M monthly volume', 'Instant Flash Settlement', 'All 140 Currency pairs', '24/7 SLA Support', 'Dedicated Account Mgr'],
          },
        ],
      },
      footer: {
        tagline: 'Building the financial infrastructure for the open web.',
        copyright: '© 2026 AuraPay Inc. All rights reserved.',
      },
    },
    generatedHtmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0a0f1d] text-[#f8fafc] font-sans antialiased">
  <header class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800">
    <div class="text-2xl font-black text-cyan-400 tracking-wider">AuraPay</div>
    <nav class="hidden md:flex gap-8 text-sm text-slate-300 font-medium">
      <a href="#features" class="hover:text-cyan-400">Features</a>
      <a href="#rates" class="hover:text-cyan-400">Liquidity</a>
      <a href="#pricing" class="hover:text-cyan-400">Pricing</a>
    </nav>
    <button class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition">Launch App</button>
  </header>
  <section class="max-w-5xl mx-auto text-center px-6 py-20">
    <span class="inline-block bg-cyan-950/80 text-cyan-300 border border-cyan-800 text-xs px-4 py-1.5 rounded-full font-medium mb-6">⚡ Powered by Quantum Settlement Engine v4</span>
    <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Instant Global Liquidity for Modern Visionaries</h1>
    <p class="text-lg text-slate-400 max-w-2xl mx-auto mb-8">Transfer, convert, and yield digital assets across 140 countries with sub-millisecond settlement times.</p>
    <div class="flex justify-center gap-4">
      <button class="bg-cyan-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20">Start Free Trial</button>
      <button class="border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold px-8 py-3.5 rounded-xl">Explore Live Rates</button>
    </div>
  </section>
</body>
</html>`,
    generatedReactCode: `import React from 'react';

export default function AuraPayLanding() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#f8fafc] font-sans">
      {/* AuraPay Header */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center border-b border-slate-800/80">
        <span className="text-2xl font-bold text-cyan-400">AuraPay</span>
        <button className="bg-cyan-500 text-slate-950 px-5 py-2 rounded-xl font-bold hover:bg-cyan-400 transition">Launch App</button>
      </nav>
      {/* Hero */}
      <main className="max-w-4xl mx-auto text-center py-24 px-6">
        <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
          Instant Global Liquidity for Modern Visionaries
        </h1>
        <p className="text-slate-400 text-lg mb-8">Transfer and yield digital assets across 140 countries with sub-millisecond latency.</p>
      </main>
    </div>
  );
}`,
  },
];
