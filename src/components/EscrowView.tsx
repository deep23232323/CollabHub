import React from 'react';
import { EscrowTransaction, UserRole } from '../types';
import { Wallet, ShieldCheck, CheckCircle2, DollarSign, Clock, ArrowRight } from 'lucide-react';

interface EscrowViewProps {
  escrowList: EscrowTransaction[];
  currentRole: UserRole;
  onReleaseEscrow: (escrowId: string) => void;
}

export const EscrowView: React.FC<EscrowViewProps> = ({
  escrowList,
  currentRole,
  onReleaseEscrow
}) => {
  const totalHeld = escrowList.filter(e => e.status === 'held_in_escrow').reduce((sum, e) => sum + e.amount, 0);
  const totalReleased = escrowList.filter(e => e.status === 'released').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Escrow Payment Protection</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Escrow & Payment Vault</h1>
          <p className="text-xs text-slate-500 mt-1">Platform holds funds safely until creator content is uploaded and approved by brand.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Held in Escrow</div>
            <div className="text-xl font-extrabold text-emerald-600">${totalHeld.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Escrow Process Flow visual */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs shadow-sm">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
          <div className="font-bold text-indigo-700">1. Offer Accepted</div>
          <p className="text-slate-500 text-[11px]">Brand deposits funds into platform vault.</p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
          <div className="font-bold text-purple-700">2. Held in Escrow</div>
          <p className="text-slate-500 text-[11px]">100% money back guarantee for Brand.</p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
          <div className="font-bold text-amber-700">3. Content Review</div>
          <p className="text-slate-500 text-[11px]">Creator submits draft for AI & Brand check.</p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
          <div className="font-bold text-emerald-700">4. Instant Release</div>
          <p className="text-slate-500 text-[11px]">Brand approves & funds transfer to Creator.</p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span>Active Escrow Transactions</span>
        </h3>

        <div className="space-y-3 text-xs">
          {escrowList.map((tx) => (
            <div
              key={tx.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-sm text-slate-900">{tx.campaignTitle}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    tx.status === 'released'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {tx.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-slate-500 text-[11px] mt-1 font-mono">
                  <span>Brand: <strong className="text-slate-700">{tx.brandName}</strong></span>
                  <span>•</span>
                  <span>Creator: <strong className="text-slate-700">{tx.creatorName}</strong></span>
                  <span>•</span>
                  <span>Funded: <strong>{tx.fundedAt}</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-base font-extrabold text-emerald-600">${tx.amount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Escrow Funds</div>
                </div>

                {tx.status === 'held_in_escrow' && (currentRole === 'brand' || currentRole === 'admin') && (
                  <button
                    onClick={() => onReleaseEscrow(tx.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Approve & Release Funds
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
