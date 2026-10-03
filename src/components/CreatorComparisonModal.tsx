import React from 'react';
import { Creator } from '../types';
import { X, CheckCircle2, ShieldCheck, TrendingUp, DollarSign, Star, Send } from 'lucide-react';

interface CreatorComparisonModalProps {
  creators: Creator[];
  onClose: () => void;
  onSendOffer: (creator: Creator) => void;
  onRemoveFromCompare: (creator: Creator) => void;
}

export const CreatorComparisonModal: React.FC<CreatorComparisonModalProps> = ({
  creators,
  onClose,
  onSendOffer,
  onRemoveFromCompare
}) => {
  if (creators.length === 0) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl relative text-slate-900 p-6 sm:p-8 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Creator Side-by-Side Matrix</h2>
            <p className="text-xs text-slate-500">Compare audience reach, engagement velocity, price efficiency, and ROI prediction.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 text-xs font-bold text-slate-500 uppercase w-44">Metric</th>
                {creators.map((c) => (
                  <th key={c.id} className="p-3 text-center min-w-[200px]">
                    <div className="flex flex-col items-center space-y-2 relative">
                      <button
                        onClick={() => onRemoveFromCompare(c)}
                        className="absolute -top-1 -right-1 text-slate-400 hover:text-rose-600 text-xs"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img src={c.avatar} alt={c.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100" />
                      <div className="font-bold text-sm text-slate-900 text-center flex items-center space-x-1">
                        <span>{c.name}</span>
                        {c.verified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{c.handle}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              
              <tr>
                <td className="p-3 font-semibold text-slate-500">Total Followers</td>
                {creators.map(c => (
                  <td key={c.id} className="p-3 text-center font-extrabold text-slate-900 text-sm">
                    {formatNumber(c.totalFollowers)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-500">Avg Reel Views</td>
                {creators.map(c => (
                  <td key={c.id} className="p-3 text-center font-bold text-indigo-600">
                    {formatNumber(c.avgViews)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-500">Engagement Rate</td>
                {creators.map(c => (
                  <td key={c.id} className="p-3 text-center font-extrabold text-emerald-600 text-sm">
                    {c.engagementRate}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-500">Authenticity Score</td>
                {creators.map(c => (
                  <td key={c.id} className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.authenticityScore}% Authentic
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-500">Brand Safety Score</td>
                {creators.map(c => (
                  <td key={c.id} className="p-3 text-center font-bold text-indigo-600">
                    {c.brandSafetyScore} / 100
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-500">Estimated Cost / Post</td>
                {creators.map(c => (
                  <td key={c.id} className="p-3 text-center font-extrabold text-slate-900 text-sm">
                    ${formatNumber(c.pricePerPost)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-500">Top Target Country</td>
                {creators.map(c => (
                  <td key={c.id} className="p-3 text-center text-slate-600">
                    {c.audienceDemographics.topCountries[0]?.country} ({c.audienceDemographics.topCountries[0]?.percentage}%)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-500">Action</td>
                {creators.map(c => (
                  <td key={c.id} className="p-3 text-center">
                    <button
                      onClick={() => {
                        onClose();
                        onSendOffer(c);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1 mx-auto shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Offer</span>
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
