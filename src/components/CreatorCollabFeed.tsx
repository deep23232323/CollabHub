import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import {
  Instagram, Search, Filter, Sparkles, TrendingUp, Users, DollarSign,
  MapPin, Clock, ChevronRight, CheckCircle2, Star, Briefcase, Globe,
  Youtube, Zap, MessageSquare, Heart, Eye, Award, LogOut, Bell
} from 'lucide-react';

interface CollabPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorNiche: string;
  authorFollowers: number;
  authorLocation: string;
  title: string;
  description: string;
  nicheCategory: string;
  targetPlatforms: string[];
  followerRequirement: string;
  collabType: string;
  compensationType: string;
  estimatedValue: string;
  locationRequirement: string;
  status: string;
  createdAt: string;
  requests: any[];
}

const NICHE_COLORS: Record<string, string> = {
  Tech: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300',
  Fashion: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-300',
  Fitness: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
  Travel: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300',
  Beauty: 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-300',
  Lifestyle: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-300',
  Business: 'from-slate-400/20 to-slate-300/20 border-slate-400/30 text-slate-300',
  Food: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-300',
};

const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <Instagram className="w-3.5 h-3.5" />;
  if (p.includes('youtube')) return <Youtube className="w-3.5 h-3.5" />;
  return <Globe className="w-3.5 h-3.5" />;
};

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

export const CreatorCollabFeed: React.FC = () => {
  const { user, logout } = useAuth();
  const reduxUser = useSelector((state: any) => state.userInfo?.data);
  const currentUser = reduxUser || user;

  const [posts, setPosts] = useState<CollabPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [pitchModal, setPitchModal] = useState<CollabPost | null>(null);
  const [pitchText, setPitchText] = useState('');
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchSuccess, setPitchSuccess] = useState(false);

  const niches = ['All', 'Tech', 'Fashion', 'Fitness', 'Travel', 'Beauty', 'Lifestyle', 'Business', 'Food'];
  const platforms = ['All', 'Instagram', 'YouTube', 'TikTok'];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedNiche !== 'All') params.set('niche', selectedNiche);
      if (selectedPlatform !== 'All') params.set('platform', selectedPlatform);

      const res = await fetch(`/api/collab-posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Failed to fetch collab posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedNiche, selectedPlatform]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleApply = (post: CollabPost) => {
    setPitchModal(post);
    setPitchText('');
    setPitchSuccess(false);
  };

  const submitPitch = async () => {
    if (!pitchModal || !pitchText.trim()) return;
    setPitchLoading(true);
    try {
      const res = await fetch(`/api/collab-posts/${pitchModal.id}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: currentUser?.id || currentUser?._id,
          applicantName: currentUser?.fullName || 'Creator',
          applicantHandle: currentUser?.socialAccounts?.instagram || `@${currentUser?.username}`,
          applicantAvatar: currentUser?.profilePhoto,
          applicantNiche: [currentUser?.category || 'Lifestyle'],
          applicantFollowers: currentUser?.creatorStats?.followersCount || 0,
          pitchMessage: pitchText,
          proposedDate: 'Within 2 weeks',
          collaborationValue: 'Cross-Promotion & Sponsored Content',
        })
      });
      if (res.ok) {
        setAppliedIds(prev => new Set([...prev, pitchModal.id]));
        setPitchSuccess(true);
        setTimeout(() => {
          setPitchModal(null);
          fetchPosts();
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to submit pitch', err);
    } finally {
      setPitchLoading(false);
    }
  };

  const igHandle = currentUser?.socialAccounts?.instagram;
  const igFollowers = currentUser?.creatorStats?.followersCount;
  const igEngagement = currentUser?.creatorStats?.engagementRate;
  const verificationStatus = currentUser?.verification?.status;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 font-sans">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rose-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/90 border-b border-slate-800/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-lg tracking-tight">CreatorPulse</span>
            <span className="hidden sm:block px-2.5 py-0.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded-full">CREATOR</span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              {currentUser?.profilePhoto ? (
                <img src={currentUser.profilePhoto} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30" alt="avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {currentUser?.fullName?.[0] || 'C'}
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">{currentUser?.fullName || 'Creator'}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{igHandle || currentUser?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">

        {/* Creator Stats Header */}
        <div className="mb-8 p-5 bg-slate-900/60 border border-slate-800/60 rounded-3xl backdrop-blur-sm">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white mb-1">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{currentUser?.fullName?.split(' ')[0] || 'Creator'}</span> 👋
              </h1>
              <p className="text-sm text-slate-400">Browse brand collab opportunities and apply to the ones that fit your audience.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {igHandle && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl">
                  <Instagram className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-rose-300">{igHandle}</span>
                </div>
              )}
              {igFollowers !== undefined && igFollowers > 0 && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">{formatNumber(igFollowers)}</span>
                  <span className="text-[10px] text-slate-400">Followers</span>
                </div>
              )}
              {igEngagement !== undefined && igEngagement > 0 && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">{igEngagement}%</span>
                  <span className="text-[10px] text-slate-400">Engagement</span>
                </div>
              )}
              {verificationStatus === 'verified' && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">Verified</span>
                </div>
              )}
              {!igHandle && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                  <Instagram className="w-4 h-4" />
                  <span className="font-medium">Connect Instagram to boost visibility</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <form onSubmit={handleSearch} className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search collab opportunities..."
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </form>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedNiche}
              onChange={e => setSelectedNiche(e.target.value)}
              className="bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {niches.map(n => <option key={n} value={n}>{n === 'All' ? 'All Niches' : n}</option>)}
            </select>
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              className="bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {platforms.map(p => <option key={p} value={p}>{p === 'All' ? 'All Platforms' : p}</option>)}
            </select>
          </div>

          <div className="ml-auto text-xs text-slate-500">
            {!loading && <span>{posts.length} opportunities</span>}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Open Collabs', value: posts.filter(p => p.status === 'open').length, icon: Briefcase, color: 'text-indigo-400' },
            { label: 'Applied', value: appliedIds.size, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Avg Value', value: '$2.4K', icon: DollarSign, color: 'text-amber-400' },
            { label: 'Your Niche', value: currentUser?.category || 'Creator', icon: Star, color: 'text-purple-400' },
          ].map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <div key={i} className="p-4 bg-slate-900/60 border border-slate-800/60 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <IconComp className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-slate-400">{stat.label}</span>
                </div>
                <div className="text-xl font-black text-white">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Collab Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 bg-slate-900/60 border border-slate-800/40 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No collab opportunities found.</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => {
              const nicheColor = NICHE_COLORS[post.nicheCategory] || NICHE_COLORS.Lifestyle;
              const isApplied = appliedIds.has(post.id);

              return (
                <div
                  key={post.id}
                  className="group bg-slate-900/60 border border-slate-800/60 rounded-3xl p-5 hover:border-slate-600/60 hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-300 flex flex-col"
                >
                  {/* Author */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <img
                        src={post.authorAvatar}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700/60"
                        alt={post.authorName}
                        onError={e => { (e.target as any).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName)}&background=6366f1&color=fff`; }}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{post.authorName}</div>
                      <div className="text-xs text-slate-400 truncate">{post.authorHandle}</div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r border ${nicheColor}`}>
                      {post.nicheCategory}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm leading-snug mb-1.5 line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">{post.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {post.targetPlatforms.slice(0, 3).map(p => (
                        <span key={p} className="flex items-center space-x-1 px-2 py-0.5 bg-slate-800/80 rounded-full text-[10px] text-slate-300 font-medium">
                          {getPlatformIcon(p)}
                          <span>{p}</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-300 font-semibold">{post.estimatedValue}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{post.followerRequirement} followers req.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{post.requests?.length || 0} pitches</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{post.locationRequirement}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  {isApplied ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pitch Submitted!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(post)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-900/20 group-hover:shadow-indigo-700/30"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Apply to Collab</span>
                      <ChevronRight className="w-3 h-3 opacity-70" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pitch Modal */}
      {pitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-black text-white mb-1">Submit Your Pitch</h3>
              <p className="text-xs text-slate-400">Applying to: <span className="text-indigo-300 font-semibold">{pitchModal.title}</span></p>
            </div>

            {pitchSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-white font-bold">Pitch Submitted!</p>
                <p className="text-xs text-slate-400">The brand will review your pitch and reach out via chat.</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-slate-800/60 border border-slate-700/40 rounded-2xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Your Profile</div>
                  <div className="flex items-center space-x-2">
                    {currentUser?.profilePhoto && (
                      <img src={currentUser.profilePhoto} className="w-8 h-8 rounded-lg object-cover" alt="" />
                    )}
                    <div>
                      <div className="text-sm font-bold text-white">{currentUser?.fullName}</div>
                      <div className="text-xs text-slate-400">
                        {igHandle} · {igFollowers ? formatNumber(igFollowers) + ' followers' : currentUser?.category}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Your Pitch Message *</label>
                  <textarea
                    rows={5}
                    value={pitchText}
                    onChange={e => setPitchText(e.target.value)}
                    placeholder="Introduce yourself and explain why you're a great fit for this collab. Mention your audience demographics, past brand experience, and your creative vision..."
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-500 mt-1">{pitchText.length}/500</div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setPitchModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitPitch}
                    disabled={pitchLoading || !pitchText.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {pitchLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Submit Pitch</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
