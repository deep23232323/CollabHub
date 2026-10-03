import React, { useState } from 'react';
import { Campaign } from '../types';
import { X, Briefcase, Plus, DollarSign, Calendar, Globe, Layers } from 'lucide-react';

interface CampaignBuilderModalProps {
  onClose: () => void;
  onCreateCampaign: (campaignData: Partial<Campaign>) => void;
}

export const CampaignBuilderModal: React.FC<CampaignBuilderModalProps> = ({
  onClose,
  onCreateCampaign
}) => {
  const [title, setTitle] = useState('Air Max 2026 Innovation Showcase');
  const [category, setCategory] = useState('Fashion & Fitness');
  const [budget, setBudget] = useState(25000);
  const [targetCountry, setTargetCountry] = useState('United States');
  const [targetGender, setTargetGender] = useState('All');
  const [minFollowers, setMinFollowers] = useState(250000);
  const [minEngagement, setMinEngagement] = useState(5.0);
  const [durationDays, setDurationDays] = useState(30);
  const [deliverablesInput, setDeliverablesInput] = useState('2 Instagram Reels, 1 Story set');
  const [description, setDescription] = useState('Looking for creators to showcase the sleek sustainable cushioning of the Air Max 2026.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deliverables = deliverablesInput.split(',').map(s => s.trim()).filter(Boolean);

    onCreateCampaign({
      title,
      category,
      budget,
      targetCountry,
      targetGender,
      minFollowers,
      minEngagement,
      durationDays,
      deliverables: deliverables.length ? deliverables : ['1 Post'],
      description
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative text-slate-900 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Create New Influencer Campaign</h2>
              <p className="text-xs text-slate-500">Specify campaign budget, required deliverables, and audience targeting filters.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Campaign Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Category / Industry</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="Tech & Gadgets">Tech & Gadgets</option>
                <option value="Fashion & Fitness">Fashion & Fitness</option>
                <option value="Audio & Lifestyle">Audio & Lifestyle</option>
                <option value="Gaming & Esports">Gaming & Esports</option>
                <option value="Food & Travel">Food & Travel</option>
                <option value="SaaS & AI">SaaS & AI</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Campaign Budget ($)</label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Target Country</label>
              <input
                type="text"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Min Creator Followers</label>
              <input
                type="number"
                value={minFollowers}
                onChange={(e) => setMinFollowers(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Required Deliverables (Comma separated)</label>
            <input
              type="text"
              value={deliverablesInput}
              onChange={(e) => setDeliverablesInput(e.target.value)}
              placeholder="e.g. 2 Instagram Reels, 1 YouTube Short, 1 Story set"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Campaign Brief Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
            >
              Publish Campaign
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
