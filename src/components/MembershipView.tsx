import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, CheckCircle2, Zap, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { MembershipPlanConfig, User, UserPlan } from '../types';

interface MembershipViewProps {
  plans: MembershipPlanConfig[];
  user: User | null;
  onSelectPlanForCheckout: (plan: MembershipPlanConfig, isAnnual: boolean) => void;
  onOpenAuth: () => void;
}

export const MembershipView: React.FC<MembershipViewProps> = ({
  plans,
  user,
  onSelectPlanForCheckout,
  onOpenAuth,
}) => {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-amber-950/60 text-amber-300 border border-amber-500/30"
        >
          <Crown className="w-3.5 h-3.5" />
          Flexible Membership Tiers
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-serif font-semibold text-white tracking-tight">
          Supercharge Your AI Web Studio Workflow
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Select the membership tier that fits your creative scale. Upgrade anytime with instant receipts and direct phone transfers (GPay / PhonePe / Paytm / UPI: <strong>9045459699</strong>) or card gateway.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono bg-[#111111] text-indigo-300 border border-indigo-500/30">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Official Payment Account: <strong>9045459699</strong> (GPay / PhonePe / Paytm / UPI: 9045459699@upi)</span>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <span className={`text-xs font-mono ${!isAnnual ? 'text-white font-bold' : 'text-zinc-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-[#111111] border border-zinc-800 rounded-full p-1 relative transition duration-300"
          >
            <div
              className={`w-6 h-6 rounded-full bg-indigo-600 shadow-md transition transform duration-300 ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono ${isAnnual ? 'text-white font-bold' : 'text-zinc-500'}`}>
              Annual
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = user?.plan === plan.id;
          const monthlyPrice = isAnnual
            ? Math.round(plan.priceAnnual / 12)
            : plan.priceMonthly;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              className={`bg-[#0a0a0a] border rounded-2xl p-8 flex flex-col justify-between relative shadow-2xl transition duration-300 ${
                plan.isPopular
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-zinc-800'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest bg-indigo-600 text-white px-4 py-1 rounded-full shadow-lg">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="text-xl font-serif font-semibold text-white mb-2">{plan.title}</h3>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-serif font-bold text-white">${monthlyPrice}</span>
                  <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  {isAnnual && plan.priceMonthly > 0 && (
                    <span className="text-[10px] text-emerald-400 font-mono block ml-2">
                      Billed ${plan.priceAnnual}/yr
                    </span>
                  )}
                </div>

                <div className="my-4 pt-4 border-t border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{plan.tokenLimit.toLocaleString()} Daily AI Tokens</span>
                </div>

                <ul className="space-y-3 my-6 text-xs text-zinc-300">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-zinc-900 text-emerald-400 border border-emerald-500/40 cursor-default"
                  >
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        onOpenAuth();
                      } else {
                        onSelectPlanForCheckout(plan, isAnnual);
                      }
                    }}
                    className={`w-full py-3.5 rounded-xl text-xs font-semibold transition shadow-lg flex items-center justify-center gap-2 ${
                      plan.isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                        : 'bg-[#111111] hover:bg-zinc-800 text-white border border-zinc-800'
                    }`}
                  >
                    Upgrade to {plan.title}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
