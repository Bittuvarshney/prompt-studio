import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Receipt, CheckCircle2, Download, Printer, ShieldCheck, CreditCard, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { PaymentInvoice, User } from '../types';

interface PaymentBillsViewProps {
  invoices: PaymentInvoice[];
  user: User | null;
  onNavigateMembership: () => void;
}

export const PaymentBillsView: React.FC<PaymentBillsViewProps> = ({
  invoices,
  user,
  onNavigateMembership,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentInvoice | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 mb-2">
            <Receipt className="w-3.5 h-3.5" />
            Billing & Transaction Receipts
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white">Payment Bills & Invoice Archive</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1 max-w-lg">
            View detailed billing logs, transaction references, tax breakdowns, and official downloadable payment receipts for your PromptCraft Studio membership.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onNavigateMembership}
            className="bg-[#111111] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-xs px-4 py-3 rounded-xl transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            Back to Membership Plans
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-xl overflow-hidden">
        <h2 className="text-lg font-serif font-semibold text-white mb-6 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-indigo-400" />
          Recent Transaction Receipts
        </h2>

        {invoices.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs font-mono">
            No payment receipts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#111111] text-zinc-400 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Invoice ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Plan / Description</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-4 px-4 font-mono text-indigo-300 font-bold">{inv.id}</td>
                    <td className="py-4 px-4 font-mono text-zinc-400">{inv.date}</td>
                    <td className="py-4 px-4 font-semibold text-white">{inv.planName}</td>
                    <td className="py-4 px-4 font-mono font-bold text-white">
                      ${inv.amount.toFixed(2)} {inv.currency}
                    </td>
                    <td className="py-4 px-4 text-zinc-400 font-mono flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                      {inv.paymentMethod}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="bg-[#111111] hover:bg-zinc-800 text-white font-mono text-[11px] px-3 py-1.5 rounded-lg border border-zinc-800 transition"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Itemized Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 md:p-8 space-y-6"
          >
            {/* Invoice Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="text-xl font-serif font-semibold text-white">PromptCraft Studio</div>
                <div className="text-xs font-mono text-zinc-400">Official Payment Receipt</div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-zinc-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Receipt Details Grid */}
            <div className="bg-[#111111] p-6 rounded-xl border border-zinc-800 space-y-4 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Receipt Ref:</span>
                <span className="text-indigo-400 font-bold">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Transaction Ref:</span>
                <span className="text-white">{selectedInvoice.transactionRef}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Date:</span>
                <span className="text-white">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Recipient Account:</span>
                <span className="text-emerald-400 font-bold">9045459699 (GPay/UPI)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Customer Email:</span>
                <span className="text-white">{user?.email || 'alex.rivera@studio.design'}</span>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <div className="flex justify-between text-white font-bold">
                  <span>{selectedInvoice.planName}</span>
                  <span>${selectedInvoice.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>Subtotal:</span>
                  <span>${selectedInvoice.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between text-indigo-400 text-sm font-bold">
                  <span>Total Paid:</span>
                  <span>${selectedInvoice.amount.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 bg-[#111111] hover:bg-zinc-800 text-white font-mono text-xs py-3 rounded-xl flex items-center justify-center gap-2 border border-zinc-800"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 rounded-xl"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
