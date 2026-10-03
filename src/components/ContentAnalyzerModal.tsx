import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Eye, FileText, Send } from 'lucide-react';

interface ContentAnalyzerModalProps {
  onClose: () => void;
}

export const ContentAnalyzerModal: React.FC<ContentAnalyzerModalProps> = ({ onClose }) => {
  const [draftCaption, setDraftCaption] = useState('Super hyped to unbox the new Air Max 2026 sneakers! The responsive cushioning is unreal. Thanks @nike for sending these over! #AirMax2026 #ad');
  const [mediaDescription, setMediaDescription] = useState('Video shows creator running in a gym, close-up shot of Nike Air Max logo on shoe side for 4 seconds, clear lighting, background music from royalty-free library.');
  const [brandRules, setBrandRules] = useState('Logo must be visible for at least 3 seconds, #ad tag must be present in first 3 lines of caption, no mentions of competitor brands like Adidas or Puma.');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftCaption, mediaDescription, brandRules })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error analyzing content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative text-slate-900 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">AI Draft Content Inspector</h2>
              <p className="text-xs text-slate-500">Inspect draft media and captions against Brand Safety, FTC disclosures, and logo visibility prior to publication.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Draft Post Caption</label>
            <textarea
              rows={3}
              value={draftCaption}
              onChange={(e) => setDraftCaption(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Media / Video Content Scene Description</label>
            <textarea
              rows={2}
              value={mediaDescription}
              onChange={(e) => setMediaDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Brand Guidelines Requirements</label>
            <textarea
              rows={2}
              value={brandRules}
              onChange={(e) => setBrandRules(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{loading ? 'Inspecting with Gemini AI...' : 'Run Compliance Inspection'}</span>
          </button>
        </div>

        {/* AI Inspector Results */}
        {result && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">Inspection Verdict:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-xs border ${
                  result.passed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {result.passed ? 'APPROVED FOR POSTING' : 'REVISION NEEDED'}
                </span>
              </div>

              <div className="text-slate-500">
                Safety Score: <strong className="text-indigo-600 font-extrabold">{result.brandSafetyScore}/100</strong>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed font-mono">
              {result.verdictSummary}
            </p>

            <div className="space-y-2 pt-1 font-mono">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Logo Visibility:</span>
                <strong className="text-emerald-600">{result.logoVisibilityCheck}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">FTC Legal Tag (#ad):</span>
                <strong className="text-emerald-600">{result.ftcDisclosureCheck}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Rival Brand Mentions:</span>
                <strong className="text-emerald-600">{result.competitorMentionCheck}</strong>
              </div>
            </div>

            {result.suggestedRevisions?.length > 0 && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900">
                <strong>Optimization Tip:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {result.suggestedRevisions.map((rev: string, idx: number) => (
                    <li key={idx}>{rev}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
