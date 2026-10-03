import React, { useState } from 'react';
import { Creator, AIMatchResult } from '../types';
import { X, Sparkles, Send, CheckCircle2, TrendingUp, DollarSign, Bot, ArrowRight, ShieldCheck } from 'lucide-react';

interface AICreatorFinderModalProps {
  creators: Creator[];
  onClose: () => void;
  onSendOffer: (creator: Creator) => void;
}

export const AICreatorFinderModal: React.FC<AICreatorFinderModalProps> = ({
  creators,
  onClose,
  onSendOffer
}) => {
  const [brandGoal, setBrandGoal] = useState('Promote our new wireless active noise cancelling headphones to tech and fitness audiences');
  const [niche, setNiche] = useState('Tech');
  const [targetCountry, setTargetCountry] = useState('United States');
  const [minFollowers, setMinFollowers] = useState(200000);
  const [budget, setBudget] = useState(5000);

  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<AIMatchResult | null>(null);

  const handleRunMatch = async () => {
    setLoading(true);
    setMatchResult(null);

    try {
      const res = await fetch('/api/ai/match-creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandGoal,
          niche,
          targetCountry,
          minFollowers,
          budget
        })
      });

      const data = await res.json();
      setMatchResult(data);
    } catch (err) {
      console.error('Error running AI match:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl relative text-slate-900 p-6 sm:p-8 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">AI Creator Matchmaker Engine</h2>
              <p className="text-xs text-slate-500">Describe your campaign requirements and Gemini AI will match optimal creators based on ROI prediction & audience overlap.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Campaign Goal & Brand Brief
            </label>
            <textarea
              rows={2}
              value={brandGoal}
              onChange={(e) => setBrandGoal(e.target.value)}
              placeholder="e.g. Looking for tech creators in the US to make unboxing shorts for our AI laptop launch..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Niche</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="Tech">Tech & Gadgets</option>
                <option value="Fashion">Fashion & Style</option>
                <option value="Fitness">Fitness & Wellness</option>
                <option value="Travel">Travel & Food</option>
                <option value="Gaming">Gaming & Esports</option>
                <option value="AI">AI & Software</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Country</label>
              <input
                type="text"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Min Followers</label>
              <input
                type="number"
                value={minFollowers}
                onChange={(e) => setMinFollowers(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            onClick={handleRunMatch}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{loading ? 'Analyzing Creators with Gemini...' : 'Generate AI Matches'}</span>
          </button>
        </div>

        {/* AI Results Output */}
        {matchResult && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900">
              <strong className="text-slate-900 block mb-1">AI Executive Summary:</strong>
              {matchResult.summary}
            </div>

            <div className="space-y-3">
              {matchResult.creators.map((resItem) => {
                const creatorObj = creators.find(c => c.id === resItem.creatorId) || creators[0];

                return (
                  <div
                    key={resItem.creatorId}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={creatorObj.avatar} alt={creatorObj.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900">{creatorObj.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {resItem.similarityScore}% AI Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{resItem.matchReason}</p>
                        
                        <div className="flex items-center space-x-3 text-[11px] text-slate-600 mt-1.5 font-mono">
                          <span>Est Reach: <strong className="text-indigo-600">{resItem.estimatedReach}</strong></span>
                          <span>•</span>
                          <span>Predicted ROI: <strong className="text-emerald-600">{resItem.predictedROI}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSendOffer(creatorObj);
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Offer</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
