import React, { useState } from 'react';
import { Creator } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Globe, 
  Clock, 
  Lightbulb, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Twitter,
  Calendar,
  Users
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

interface MultiPlatformAnalyticsProps {
  creator: Creator;
}

export const MultiPlatformAnalytics: React.FC<MultiPlatformAnalyticsProps> = ({ creator }) => {
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsResult, setInsightsResult] = useState<any>(null);

  const fetchAIInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch('/api/ai/growth-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId: creator.id })
      });
      const data = await res.json();
      setInsightsResult(data);
    } catch (err) {
      console.error('Error fetching growth insights:', err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Social Blade Style Cross-Platform Sync</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Multi-Platform Growth Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Unified analytics for {creator.name} across YouTube, Instagram, TikTok, Twitch & LinkedIn.</p>
        </div>

        <button
          onClick={fetchAIInsights}
          disabled={loadingInsights}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{loadingInsights ? 'Analyzing Growth...' : 'Generate Gemini AI Growth Insights'}</span>
        </button>
      </div>

      {/* AI Growth Insights Box */}
      {insightsResult && (
        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gemini AI Growth & Monetization Recommendations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-1 shadow-xs">
              <span className="text-slate-500 font-semibold block">Suggested Posting Time:</span>
              <strong className="text-emerald-700 text-sm font-bold block">{insightsResult.bestPostingTime}</strong>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-1 shadow-xs">
              <span className="text-slate-500 font-semibold block">Pricing Optimization:</span>
              <span className="text-indigo-900 font-medium block">{insightsResult.pricingAdvice}</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-1 shadow-xs">
              <span className="text-slate-500 font-semibold block">Top Content Ideas:</span>
              <span className="text-slate-700 block">{insightsResult.contentIdeas?.slice(0, 2).join(' • ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Platform Breakdown Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creator.platforms.map((p) => (
          <div key={p.platform} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold capitalize text-xs border border-indigo-100">
                  {p.platform.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 capitalize">{p.platform}</div>
                  <div className="text-[11px] text-slate-500 font-mono">@{p.handle}</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                +{p.growthRate30d}% / mo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Followers</div>
                <div className="text-sm font-extrabold text-slate-900">{formatNumber(p.followers)}</div>
              </div>

              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Eng. Rate</div>
                <div className="text-sm font-extrabold text-emerald-600">{p.engagementRate}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social Blade Monthly Growth Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Monthly Follower Growth Velocity</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Auto Sync: Every 24 Hours</span>
        </div>

        <div className="h-64 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={creator.growthHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
              />
              <Bar dataKey="followers" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
