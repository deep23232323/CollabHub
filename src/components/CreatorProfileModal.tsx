import React, { useState } from 'react';
import { Creator } from '../types';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Star, 
  Globe, 
  DollarSign, 
  Users, 
  BarChart3, 
  Award, 
  AlertTriangle,
  Youtube,
  Instagram,
  Linkedin,
  Send,
  Sparkles,
  Bot
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

interface CreatorProfileModalProps {
  creator: Creator | null;
  onClose: () => void;
  onSendOffer: (creator: Creator) => void;
  onRunAuthenticityCheck: (creator: Creator) => void;
  authenticityResult: any;
  loadingAuthCheck: boolean;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  onClose,
  onSendOffer,
  onRunAuthenticityCheck,
  authenticityResult,
  loadingAuthCheck
}) => {
  if (!creator) return null;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative text-slate-900">
        
        {/* Sticky Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Cover Banner & Avatar */}
        <div className="bg-slate-50 p-6 sm:p-8 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{creator.name}</h2>
                  {creator.verified && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                  )}
                </div>
                <p className="text-sm text-slate-500 font-mono">{creator.handle}</p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{creator.location}</span>
                  <span>•</span>
                  <span className="text-amber-600 font-bold flex items-center">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                    {creator.rating} ({creator.reviewsCount} brand reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => onRunAuthenticityCheck(creator)}
                disabled={loadingAuthCheck}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Bot className="w-4 h-4 text-purple-600" />
                <span>{loadingAuthCheck ? 'Analyzing Bots...' : 'AI Fake Follower Test'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSendOffer(creator);
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Collaboration Offer</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Social Blade Stats Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Followers</div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{formatNumber(creator.totalFollowers)}</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center mt-0.5">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2% last 30d
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg Views / Reel</div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{formatNumber(creator.avgViews)}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">High audience retention</div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Engagement Rate</div>
              <div className="text-xl font-extrabold text-emerald-600 mt-1">{creator.engagementRate}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">3.2x industry average</div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Authenticity Score</div>
              <div className="text-xl font-extrabold text-indigo-600 mt-1">{creator.authenticityScore}/100</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Low bot risk</div>
            </div>
          </div>

          {/* AI Fake Follower Check Banner (If Generated) */}
          {authenticityResult && (
            <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-purple-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Gemini AI Audience Authenticity Analysis</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {authenticityResult.riskLevel || 'Verified Authentic'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {authenticityResult.recommendation}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                  <span className="text-slate-500">Fake Follower Est:</span>
                  <div className="font-bold text-emerald-600 mt-0.5">{authenticityResult.fakeFollowerPercent || 5}%</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                  <span className="text-slate-500">Bot Comment Est:</span>
                  <div className="font-bold text-emerald-600 mt-0.5">{authenticityResult.botCommentPercent || 3}%</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                  <span className="text-slate-500">Growth Pattern:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{authenticityResult.growthSpikeStatus || 'Organic Steady'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Followers Growth Chart (Recharts) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>6-Month Social Blade Growth Trajectory</span>
              </h3>
              <span className="text-xs text-slate-500">Historical Monthly Sync</span>
            </div>

            <div className="h-56 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={creator.growthHistory}>
                  <defs>
                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `${(val / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="followers" stroke="#4f46e5" fillOpacity={1} fill="url(#colorFollowers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demographics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Audience Countries */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Top Audience Countries</h4>
              <div className="space-y-2">
                {creator.audienceDemographics.topCountries.map((tc) => (
                  <div key={tc.country} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>{tc.country}</span>
                      <span className="font-mono text-indigo-600 font-bold">{tc.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${tc.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Split & Age */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Age Distribution</h4>
              <div className="space-y-2">
                {creator.audienceDemographics.ageDistribution.map((ag) => (
                  <div key={ag.ageGroup} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Age {ag.ageGroup}</span>
                      <span className="font-mono text-emerald-600 font-bold">{ag.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${ag.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Past Brands & Portfolio Samples */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-slate-900">Past Brand Collaborations</h3>
            <div className="flex flex-wrap gap-2">
              {creator.pastBrands.map((brand) => (
                <span key={brand} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                  {brand}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
