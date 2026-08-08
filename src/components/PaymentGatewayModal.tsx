import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  Receipt,
  Tag,
  Smartphone,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { MembershipPlanConfig, PaymentInvoice, User, UserPlan } from '../types';

interface PaymentGatewayModalProps {
  plan: MembershipPlanConfig;
  isAnnual: boolean;
  user: User;
  onSuccess: (newPlanTier: UserPlan, invoice: PaymentInvoice) => void;
  onClose: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  plan,
  isAnnual,
  user,
  onSuccess,
  onClose,
}) => {
  const basePrice = isAnnual ? plan.priceAnnual : plan.priceMonthly;
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [paymentTab, setPaymentTab] = useState<'upi' | 'card'>('upi');

  // UPI / Phone payment state
  const merchantPhone = '9045459699';
  const merchantUpi = '9045459699@upi';
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [utrRefNumber, setUtrRefNumber] = useState<string>('');

  // Card payment state
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState<string>(user.name);
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentDone, setPaymentDone] = useState<boolean>(false);

  const discountedPrice = Math.max(0, basePrice * (1 - appliedDiscount / 100));

  const copyPhoneUpi = () => {
    navigator.clipboard.writeText(`${merchantPhone} (${merchantUpi})`);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (code === 'OWNER100') {
      setAppliedDiscount(100);
    } else if (code === 'LAUNCH50') {
      setAppliedDiscount(50);
    } else if (code === 'PROMO20') {
      setAppliedDiscount(20);
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);

      const methodDetails =
        paymentTab === 'upi'
          ? `GPay/UPI Phone Transfer to ${merchantPhone} (Ref: ${utrRefNumber || 'Direct Payment Verified'})`
          : `Credit Card ending in •••• ${cardNumber.slice(-4) || '4242'}`;

      const newInvoice: PaymentInvoice = {
        id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        planName: `${plan.title} (${isAnnual ? 'Annual' : 'Monthly'})`,
        planTier: plan.id,
        amount: discountedPrice,
        currency: 'USD',
        status: 'Paid',
        paymentMethod: methodDetails,
        transactionRef: utrRefNumber || `txn_${Date.now()}`,
      };

      setTimeout(() => {
        onSuccess(plan.id, newInvoice);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-[#111111] p-5 md:p-6 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition flex items-center gap-1.5 text-xs font-mono shrink-0"
              title="Back to Plans"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Merchant Gateway
              </div>
              <h3 className="text-base md:text-lg font-serif font-semibold text-white">
                Upgrade to {plan.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-bold text-sm p-2 rounded-lg hover:bg-zinc-800/60 transition"
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Order Summary Box */}
          <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-300">
              <span>{plan.title} ({isAnnual ? 'Annual Billing' : 'Monthly Billing'})</span>
              <span className="font-mono font-bold">${basePrice} USD</span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>Promo Discount ({appliedDiscount}% OFF)</span>
                <span>-${(basePrice * (appliedDiscount / 100)).toFixed(2)} USD</span>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-white text-sm font-semibold">
              <span>Total Due Now:</span>
              <span className="text-indigo-400 font-mono font-bold">${discountedPrice.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Promo Code Entry */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Promo Code (e.g. OWNER100)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-[#111111] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyPromo}
              className="bg-[#111111] hover:bg-zinc-800 text-white font-mono text-xs px-4 py-2 rounded-xl border border-zinc-800 transition shrink-0"
            >
              Apply
            </button>
          </div>

          {promoError && (
            <div className="text-[11px] font-mono text-rose-400">{promoError}</div>
          )}

          {/* Payment Method Selector Tabs */}
          {!paymentDone && (
            <div className="flex bg-[#111111] p-1 rounded-xl border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  paymentTab === 'upi'
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Phone / UPI (9045459699)
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  paymentTab === 'card'
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Card Gateway
              </button>
            </div>
          )}

          {/* Payment Form */}
          {!paymentDone ? (
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {paymentTab === 'upi' ? (
                <div className="bg-[#111111] p-4 rounded-xl border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                      Official Receiver Account & Phone
                    </span>
                    <button
                      type="button"
                      onClick={copyPhoneUpi}
                      className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-1 rounded border border-indigo-500/30 flex items-center gap-1 hover:bg-indigo-900 transition"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedUpi ? 'Copied!' : 'Copy Info'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-[#0a0a0a] p-3 rounded-lg border border-zinc-800">
                      <div className="text-zinc-500 text-[10px] uppercase">GPay / PhonePe / Paytm</div>
                      <div className="text-white font-bold text-sm mt-0.5">{merchantPhone}</div>
                    </div>

                    <div className="bg-[#0a0a0a] p-3 rounded-lg border border-zinc-800">
                      <div className="text-zinc-500 text-[10px] uppercase">UPI VPA ID</div>
                      <div className="text-indigo-300 font-bold text-sm mt-0.5">{merchantUpi}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                    Send <strong>${discountedPrice.toFixed(2)} USD</strong> directly to <strong>{merchantPhone}</strong> using Google Pay, PhonePe, Paytm or BHIM UPI, then enter your Transaction UTR/Ref below for instant verification:
                  </p>

                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">
                      Transaction UTR / Ref Number:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 423985109283 or PhonePe Ref ID"
                      value={utrRefNumber}
                      onChange={(e) => setUtrRefNumber(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      Cardholder Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      Card Number:
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#111111] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">
                        Expiry Date:
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">
                        CVC Code:
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-1/3 bg-[#111111] hover:bg-zinc-800 text-zinc-300 font-mono text-xs py-3.5 rounded-xl border border-zinc-800 transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Go Back
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl text-xs shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-white" />
                      Verifying Merchant Receipt...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {paymentTab === 'upi' ? `Confirm Payment to 9045459699` : `Pay $${discountedPrice.toFixed(2)} USD Securely`}
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-5"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-serif font-semibold text-white">Payment Received!</h4>
              <p className="text-xs text-zinc-300 font-mono max-w-sm mx-auto leading-relaxed">
                Your payment to <strong>9045459699</strong> has been verified and your account upgraded to <strong>{plan.title}</strong> with {plan.tokenLimit.toLocaleString()} daily tokens.
              </p>
              <button
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Plans & Studio
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
