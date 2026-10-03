import React from 'react';
import { Creator, Campaign, Offer, EscrowTransaction, Contract } from '../types';
import { ShieldAlert, ShieldCheck, DollarSign, Users, AlertTriangle, CheckCircle2, FileText, Bot } from 'lucide-react';

interface AdminDashboardProps {
  creators: Creator[];
  campaigns: Campaign[];
  offers: Offer[];
  contracts: Contract[];
  escrowList: EscrowTransaction[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  creators,
  campaigns,
  offers,
  contracts,
  escrowList
}) => {
  const totalGMV = escrowList.reduce((sum, e) => sum + e.amount, 0);
  const platformFee = totalGMV * 0.10; // 10% platform fee

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              Platform Admin Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Control & Fraud Monitor</h1>
          <p className="text-xs text-slate-500 mt-1">Dispute handling, escrow release oversight, bot detection alerts, and verified badge management.</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fraud System Healthy</span>
          </span>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Platform GMV</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">${totalGMV.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Total escrow processed</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Platform Revenue (10%)</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">${platformFee.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">SaaS fee earnings</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Verified Creators</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{creators.filter(c => c.verified).length}</div>
          <div className="text-[11px] text-slate-500 mt-1">KYC & API verified</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Active Contracts</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{contracts.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Smart contracts active</div>
        </div>
      </div>

      {/* Fraud & Risk Monitor Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
          <Bot className="w-4 h-4 text-purple-600" />
          <span>Automated AI Bot & Fake Follower Audit Queue</span>
        </h3>

        <div className="space-y-3 text-xs">
          {creators.map((c) => (
            <div key={c.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                  <div className="text-slate-500 font-mono">{c.handle}</div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-slate-500 block text-[10px]">Authenticity Score:</span>
                  <strong className="text-emerald-600 text-xs font-bold">{c.authenticityScore}%</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Brand Safety:</span>
                  <strong className="text-indigo-600 text-xs font-bold">{c.brandSafetyScore}/100</strong>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  Passed Verification
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
