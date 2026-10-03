import React from 'react';
import { Campaign, Offer, EscrowTransaction, Creator } from '../types';
import { Briefcase, DollarSign, Users, Send, ShieldCheck, Sparkles, Plus, TrendingUp } from 'lucide-react';

interface BrandDashboardProps {
  campaigns: Campaign[];
  offers: Offer[];
  escrowList: EscrowTransaction[];
  creators: Creator[];
  openCampaignModal: () => void;
  openAIMatchModal: () => void;
  onOpenOfferChat: (offer: Offer) => void;
  onOpenCreatorDirectory: () => void;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({
  campaigns,
  offers,
  escrowList,
  creators,
  openCampaignModal,
  openAIMatchModal,
  onOpenOfferChat,
  onOpenCreatorDirectory
}) => {
  const totalSpent = escrowList.reduce((sum, e) => sum + e.amount, 0);
  const activeOffersCount = offers.filter(o => o.status !== 'completed').length;

  return (
    <div className="space-y-6">
      
      {/* Brand Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              Nike Brand Portal
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Brand Campaign Headquarters</h1>
          <p className="text-xs text-slate-500 mt-1">Manage global influencer collaborations, escrow deposits, and AI-driven creator matches.</p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={openAIMatchModal}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>AI Creator Matcher</span>
          </button>

          <button
            onClick={openCampaignModal}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Active Campaigns</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{campaigns.length}</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">Global sponsorships live</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Active Offers</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{activeOffersCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending negotiation / contract</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Escrow Locked</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">${totalSpent.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Platform Secured</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Avg Engagement ROI</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">3.8x</div>
          <div className="text-[11px] text-slate-500 mt-1">Predicted impression lift</div>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Active Brand Campaigns</span>
          </h3>
          <button
            onClick={onOpenCreatorDirectory}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Find Creators for Campaign →
          </button>
        </div>

        <div className="space-y-3">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-sm text-slate-900">{camp.title}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {camp.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{camp.description}</p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-600 mt-2 font-mono">
                  <span>Budget: <strong className="text-emerald-600">${camp.budget.toLocaleString()}</strong></span>
                  <span>•</span>
                  <span>Deliverables: <strong>{camp.deliverables.join(', ')}</strong></span>
                  <span>•</span>
                  <span>Applicants: <strong className="text-indigo-600">{camp.applicantsCount}</strong></span>
                </div>
              </div>

              <button
                onClick={onOpenCreatorDirectory}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Find Matching Creators
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
