import React from 'react';
import { Creator, Offer } from '../types';
import { Globe, Users, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';

interface AgencyDashboardProps {
  creators: Creator[];
  offers: Offer[];
  onSelectCreator: (creator: Creator) => void;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({
  creators,
  offers,
  onSelectCreator
}) => {
  const totalRosterFollowers = creators.reduce((sum, c) => sum + c.totalFollowers, 0);
  const totalRosterGMV = offers.reduce((sum, o) => sum + o.amount, 0);
  const agencyCommission = totalRosterGMV * 0.15; // 15% agency cut

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              Vantage Media Agency
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Talent Roster Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage multiple exclusive creators, negotiate brand sponsorships, and track agency commissions.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1 shadow-xs">
          <span>+ Add Creator to Roster</span>
        </button>
      </div>

      {/* Agency KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Managed Creators</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{creators.length}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">Exclusive representation</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Combined Reach</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{(totalRosterFollowers / 1000000).toFixed(1)}M</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 5 social networks</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Active Deal Value</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">${totalRosterGMV.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">In platform escrow</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Agency Cut (15%)</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">${agencyCommission.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Net revenue earned</div>
        </div>
      </div>

      {/* Talent Roster List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
          <Users className="w-4 h-4 text-purple-600" />
          <span>Exclusive Creator Roster</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creators.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCreator(c)}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-slate-300 cursor-pointer transition-all"
            >
              <div className="flex items-center space-x-3">
                <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                  <div className="text-xs text-slate-500 font-mono">{c.handle}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {(c.totalFollowers / 1000).toFixed(0)}K Followers • {c.engagementRate}% Eng.
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-indigo-600">${c.pricePerPost}</div>
                <div className="text-[10px] text-slate-500">Rate / Post</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
