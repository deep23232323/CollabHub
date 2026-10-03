import React, { useState } from 'react';
import { Creator } from '../types';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  BarChart2, 
  ArrowRightLeft, 
  Send, 
  TrendingUp, 
  DollarSign, 
  Globe, 
  AlertTriangle,
  Youtube,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';

interface CreatorDirectoryProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onSendOffer: (creator: Creator) => void;
  onCheckAuthenticity: (creator: Creator) => void;
  comparedCreators: Creator[];
  onToggleCompare: (creator: Creator) => void;
  onOpenComparison: () => void;
  openAIMatchModal: () => void;
}

export const CreatorDirectory: React.FC<CreatorDirectoryProps> = ({
  creators,
  onSelectCreator,
  onSendOffer,
  onCheckAuthenticity,
  comparedCreators,
  onToggleCompare,
  onOpenComparison,
  openAIMatchModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [minFollowersFilter, setMinFollowersFilter] = useState(0);
  const [minEngagementFilter, setMinEngagementFilter] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const niches = ['All', 'Tech', 'Fashion', 'Fitness', 'Food', 'Travel', 'Gaming', 'AI', 'Lifestyle', 'SaaS'];
  const platforms = ['All', 'YouTube', 'Instagram', 'TikTok', 'Twitch', 'LinkedIn'];

  const filteredCreators = creators.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesNiche = selectedNiche === 'All' || c.niche.includes(selectedNiche);
    const matchesPlatform = selectedPlatform === 'All' || c.platforms.some(p => p.platform.toLowerCase() === selectedPlatform.toLowerCase());
    const matchesFollowers = c.totalFollowers >= minFollowersFilter;
    const matchesEngagement = c.engagementRate >= minEngagementFilter;
    const matchesVerified = !verifiedOnly || c.verified;

    return matchesSearch && matchesNiche && matchesPlatform && matchesFollowers && matchesEngagement && matchesVerified;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Platform Creator Search & Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Influencer Directory
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Search vetted creators with real-time API audience metrics, Social Blade growth history, and AI fake follower detection.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={openAIMatchModal}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>AI Creator Recommendation</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search creator name, handle, bio, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-slate-400"
            >
              {niches.map(n => (
                <option key={n} value={n}>Niche: {n}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-slate-400"
            >
              {platforms.map(p => (
                <option key={p} value={p}>Platform: {p}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 w-full cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Verified Only</span>
            </label>
          </div>
        </div>

        {/* Numeric Filters */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span>Min Followers:</span>
            <select
              value={minFollowersFilter}
              onChange={(e) => setMinFollowersFilter(Number(e.target.value))}
              className="bg-slate-50 text-slate-800 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value={0}>Any</option>
              <option value={100000}>100K+</option>
              <option value={500000}>500K+</option>
              <option value={1000000}>1M+</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span>Min Engagement:</span>
            <select
              value={minEngagementFilter}
              onChange={(e) => setMinEngagementFilter(Number(e.target.value))}
              className="bg-slate-50 text-slate-800 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value={0}>Any</option>
              <option value={5}>5.0%+</option>
              <option value={7}>7.0%+</option>
              <option value={9}>9.0%+</option>
            </select>
          </div>

          <div className="ml-auto text-slate-500">
            Showing <strong className="text-slate-900">{filteredCreators.length}</strong> creators
          </div>
        </div>
      </div>

      {/* Floating Comparison Drawer Launcher */}
      {comparedCreators.length > 0 && (
        <div className="sticky top-20 z-30 bg-white/95 border border-slate-300 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Creator Comparison Tray ({comparedCreators.length}/3 Selected)
              </div>
              <div className="text-[11px] text-slate-600">
                {comparedCreators.map(c => c.name).join(', ')}
              </div>
            </div>
          </div>
          
          <button
            onClick={onOpenComparison}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Compare Side-by-Side
          </button>
        </div>
      )}

      {/* Creator Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => {
          const isComparing = comparedCreators.some(c => c.id === creator.id);

          return (
            <div
              key={creator.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group relative"
            >
              <div>
                {/* Card Header: Avatar & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 
                          onClick={() => onSelectCreator(creator)}
                          className="font-bold text-base text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                        >
                          {creator.name}
                        </h3>
                        {creator.verified && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{creator.handle}</div>
                      <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-0.5">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{creator.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-amber-700 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{creator.rating}</span>
                  </div>
                </div>

                {/* Bio & Niche Tags */}
                <p className="text-slate-600 text-xs mt-3 line-clamp-2 leading-relaxed">
                  {creator.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {creator.niche.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Key Metrics Dashboard Row */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Reach</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {formatNumber(creator.totalFollowers)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Eng. Rate</div>
                    <div className="text-sm font-extrabold text-emerald-600 mt-0.5 flex items-center justify-center space-x-0.5">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>{creator.engagementRate}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Price / Post</div>
                    <div className="text-sm font-extrabold text-indigo-600 mt-0.5">
                      ${formatNumber(creator.pricePerPost)}
                    </div>
                  </div>
                </div>

                {/* Authenticity & Brand Safety Indicators */}
                <div className="mt-3 flex items-center justify-between text-xs px-1">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px]">
                      Authenticity: <strong className="text-emerald-600">{creator.authenticityScore}%</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-600">
                    <span className="text-[11px]">
                      Safety Score: <strong className="text-indigo-600">{creator.brandSafetyScore}/100</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                
                <button
                  onClick={() => onSelectCreator(creator)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors border border-slate-200"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => onToggleCompare(creator)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors border ${
                    isComparing
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                  title="Compare with another creator"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSendOffer(creator)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center space-x-1 shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Offer</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
