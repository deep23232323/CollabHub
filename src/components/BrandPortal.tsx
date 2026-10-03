import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { NegotiationChatModal } from './NegotiationChatModal';
import { SmartContractModal } from './SmartContractModal';
import {
  Sparkles, Users, DollarSign, Briefcase, Search, Filter,
  Instagram, Star, MapPin, TrendingUp, CheckCircle2, MessageSquare,
  FileText, ChevronRight, Plus, Bell, LogOut, Globe, Zap,
  Award, Eye, Shield, ArrowRight, X, BarChart2, Clock
} from 'lucide-react';

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

type ActiveView = 'dashboard' | 'creators' | 'offers' | 'contracts';

export const BrandPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const reduxUser = useSelector((state: any) => state.userInfo?.data);
  const currentUser = reduxUser || user;

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Data
  const [creators, setCreators] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [collabPosts, setCollabPosts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('All');

  // Modals
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [offerMessages, setOfferMessages] = useState<any[]>([]);
  const [showCollabPostForm, setShowCollabPostForm] = useState(false);
  const [collabForm, setCollabForm] = useState({ title: '', description: '', nicheCategory: 'Tech', budget: '', platforms: 'Instagram' });
  const [postingCollab, setPostingCollab] = useState(false);
  const [sendingOffer, setSendingOffer] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState({ amount: 1500, deliverables: '1 Reel + 2 Stories' });

  const niches = ['All', 'Tech', 'Fashion', 'Fitness', 'Travel', 'Beauty', 'Lifestyle'];

  const fetchAll = async () => {
    const [creatorsRes, offersRes, contractsRes, postsRes, campaignsRes] = await Promise.allSettled([
      fetch(`/api/creators?${search ? `search=${encodeURIComponent(search)}` : ''}${selectedNiche !== 'All' ? `&niche=${selectedNiche}` : ''}`).then(r => r.json()),
      fetch('/api/offers').then(r => r.json()),
      fetch('/api/contracts').then(r => r.json()),
      fetch('/api/collab-posts').then(r => r.json()),
      fetch('/api/campaigns').then(r => r.json()),
    ]);

    if (creatorsRes.status === 'fulfilled') setCreators((creatorsRes.value as any).creators || creatorsRes.value || []);
    if (offersRes.status === 'fulfilled') setOffers(offersRes.value || []);
    if (contractsRes.status === 'fulfilled') setContracts(contractsRes.value || []);
    if (postsRes.status === 'fulfilled') setCollabPosts(postsRes.value || []);
    if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value || []);
  };

  const fetchMessages = async (offerId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${offerId}`);
      if (res.ok) setOfferMessages(await res.json());
    } catch {}
  };

  useEffect(() => { fetchAll(); }, [selectedNiche]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAll();
  };

  const openOfferChat = async (offer: any) => {
    setSelectedOffer(offer);
    await fetchMessages(offer.id);
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedOffer) return;
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: selectedOffer.id,
        senderId: currentUser?.id || 'brand1',
        senderName: currentUser?.fullName || 'Brand',
        senderRole: 'brand',
        senderAvatar: currentUser?.profilePhoto,
        text,
      }),
    });
    await fetchMessages(selectedOffer.id);
  };

  const handleCounterOffer = async (offerId: string, amount: number, deliverables: string[], note: string) => {
    await fetch('/api/offers/counter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, senderRole: 'brand', amount, deliverables, note }),
    });
    fetchAll();
    if (selectedOffer) await fetchMessages(selectedOffer.id);
  };

  const handleSignContract = async (contractId: string, role: string) => {
    await fetch('/api/contracts/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractId, role }),
    });
    fetchAll();
  };

  const postCollab = async () => {
    if (!collabForm.title || !collabForm.description) return;
    setPostingCollab(true);
    try {
      await fetch('/api/collab-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...collabForm,
          authorId: currentUser?.id || currentUser?._id,
          authorName: currentUser?.fullName || 'Brand',
          authorHandle: `@${currentUser?.username || 'brand'}`,
          authorAvatar: currentUser?.profilePhoto,
          authorNiche: currentUser?.category || 'Brand',
          authorFollowers: 0,
          authorLocation: currentUser?.city || 'Global',
          targetPlatforms: [collabForm.platforms],
          collabType: 'Brand Sponsorship',
          compensationType: 'Paid',
          estimatedValue: collabForm.budget ? `$${collabForm.budget}` : 'Negotiable',
          locationRequirement: 'Remote/Online',
          followerRequirement: '10K+',
        }),
      });
      setShowCollabPostForm(false);
      setCollabForm({ title: '', description: '', nicheCategory: 'Tech', budget: '', platforms: 'Instagram' });
      fetchAll();
    } finally {
      setPostingCollab(false);
    }
  };

  const sendOffer = async (creator: any) => {
    setSendingOffer(creator.id);
    try {
      await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaigns[0]?.id || `camp_${Date.now()}`,
          campaignTitle: campaigns[0]?.title || 'Brand Sponsorship',
          brandId: currentUser?.id || 'brand1',
          brandName: currentUser?.fullName || 'Brand',
          brandLogo: currentUser?.profilePhoto,
          creatorId: creator.id,
          creatorName: creator.name,
          creatorAvatar: creator.avatar,
          amount: offerForm.amount,
          deliverables: offerForm.deliverables.split('+').map((d: string) => d.trim()),
          deadlineDays: 14,
          note: 'We would love to collaborate with you on our upcoming campaign!',
        }),
      });
      fetchAll();
      setActiveView('offers');
    } finally {
      setSendingOffer(null);
    }
  };

  const acceptOffer = async (offerId: string) => {
    await fetch('/api/offers/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId }),
    });
    fetchAll();
    setSelectedOffer(null);
    setActiveView('contracts');
  };

  const activeOffers = offers.filter(o => !['completed', 'declined'].includes(o.status));
  const pendingContracts = contracts.filter(c => c.status !== 'completed');

  const NAV_ITEMS: { key: ActiveView; label: string; icon: any; badge?: number }[] = [
    { key: 'dashboard', label: 'Overview', icon: BarChart2 },
    { key: 'creators', label: 'Find Creators', icon: Users, badge: creators.length },
    { key: 'offers', label: 'Offers', icon: MessageSquare, badge: activeOffers.length },
    { key: 'contracts', label: 'Contracts', icon: FileText, badge: pendingContracts.length },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans">
      {/* Top navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-700 flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight">CreatorPulse</span>
            <span className="hidden sm:block px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded-full">BRAND</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCollabPostForm(true)}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Post Collab</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              {currentUser?.profilePhoto ? (
                <img src={currentUser.profilePhoto} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200" alt="avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {currentUser?.fullName?.[0] || 'B'}
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900">{currentUser?.fullName || 'Brand'}</div>
                <div className="text-[10px] text-slate-400">Brand Account</div>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm sticky top-24 space-y-1">
              {NAV_ITEMS.map(item => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeView === item.key
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        activeView === item.key ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
                      }`}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Mobile Nav */}
          <div className="lg:hidden w-full mb-4 flex gap-2">
            {NAV_ITEMS.map(item => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveView(item.key)}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeView === item.key ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  <IconComp className="w-4 h-4 mb-0.5" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* ============ DASHBOARD OVERVIEW ============ */}
            {activeView === 'dashboard' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Brand HQ</h1>
                  <p className="text-sm text-slate-500 mt-0.5">Manage your influencer partnerships end-to-end.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Creators Found', value: creators.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Active Offers', value: activeOffers.length, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Contracts', value: contracts.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Collab Posts', value: collabPosts.length, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
                  ].map((stat, i) => {
                    const IconComp = stat.icon;
                    return (
                      <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                          <IconComp className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => { setActiveView('creators'); }}
                    className="p-5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white text-left hover:shadow-lg hover:shadow-indigo-200 transition-all group"
                  >
                    <Users className="w-6 h-6 mb-3 opacity-80" />
                    <div className="font-bold text-sm">Browse Creator Directory</div>
                    <div className="text-xs opacity-70 mt-0.5">Find & invite influencers to your campaign</div>
                    <ArrowRight className="w-4 h-4 mt-3 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setShowCollabPostForm(true)}
                    className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-indigo-300 hover:shadow-sm transition-all group"
                  >
                    <Plus className="w-6 h-6 mb-3 text-indigo-600" />
                    <div className="font-bold text-sm text-slate-900">Post a Collab Opportunity</div>
                    <div className="text-xs text-slate-500 mt-0.5">Let creators apply to work with your brand</div>
                    <ArrowRight className="w-4 h-4 mt-3 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveView('offers')}
                    className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-emerald-300 hover:shadow-sm transition-all group"
                  >
                    <MessageSquare className="w-6 h-6 mb-3 text-emerald-600" />
                    <div className="font-bold text-sm text-slate-900">Negotiate & Close Deals</div>
                    <div className="text-xs text-slate-500 mt-0.5">{activeOffers.length} offer{activeOffers.length !== 1 ? 's' : ''} waiting for action</div>
                    <ArrowRight className="w-4 h-4 mt-3 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Recent collab posts from creators */}
                {collabPosts.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h2 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <span>Creator Collab Applications</span>
                      <span className="ml-2 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">{collabPosts.reduce((s, p) => s + (p.requests?.length || 0), 0)} pitches</span>
                    </h2>
                    <div className="space-y-3">
                      {collabPosts.slice(0, 3).map((post: any) => (
                        <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center space-x-3">
                            <img src={post.authorAvatar} className="w-9 h-9 rounded-xl object-cover" alt={post.authorName}
                              onError={e => { (e.target as any).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName)}&background=6366f1&color=fff`; }} />
                            <div>
                              <div className="text-sm font-bold text-slate-900 truncate max-w-xs">{post.title}</div>
                              <div className="text-xs text-slate-500">{post.authorName} · {post.nicheCategory} · {post.requests?.length || 0} pitches</div>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveView('creators')}
                            className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============ CREATOR DIRECTORY ============ */}
            {activeView === 'creators' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900">Creator Directory</h2>
                  <span className="text-xs text-slate-500">{creators.length} verified creators</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <form onSubmit={handleSearchSubmit} className="flex-1 min-w-56 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search creators by name, niche..."
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
                    />
                  </form>
                  <select
                    value={selectedNiche}
                    onChange={e => setSelectedNiche(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 shadow-sm"
                  >
                    {niches.map(n => <option key={n} value={n}>{n === 'All' ? 'All Niches' : n}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {creators.map(creator => (
                    <div key={creator.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                      <div className="relative h-20 bg-gradient-to-br from-indigo-500 to-purple-600">
                        {creator.coverImage && (
                          <img src={creator.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
                        )}
                      </div>
                      <div className="px-4 pb-4">
                        <div className="-mt-6 mb-3 flex items-end justify-between">
                          <img
                            src={creator.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=6366f1&color=fff`}
                            className="w-12 h-12 rounded-xl object-cover ring-4 ring-white shadow-sm"
                            alt={creator.name}
                          />
                          {creator.verified && (
                            <span className="mb-1 flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-slate-900 text-sm">{creator.name}</div>
                        <div className="text-xs text-slate-400 mb-2">{creator.handle} · {creator.location}</div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {creator.niche?.slice(0, 2).map((n: string) => (
                            <span key={n} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-full">{n}</span>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <div className="bg-slate-50 rounded-xl py-1.5">
                            <div className="text-sm font-black text-slate-900">{formatNumber(creator.totalFollowers || 0)}</div>
                            <div className="text-[10px] text-slate-400">Followers</div>
                          </div>
                          <div className="bg-slate-50 rounded-xl py-1.5">
                            <div className="text-sm font-black text-emerald-600">{creator.engagementRate}%</div>
                            <div className="text-[10px] text-slate-400">Engage</div>
                          </div>
                          <div className="bg-slate-50 rounded-xl py-1.5">
                            <div className="text-sm font-black text-purple-600">{creator.authenticityScore}%</div>
                            <div className="text-[10px] text-slate-400">Authentic</div>
                          </div>
                        </div>

                        {/* Offer form inline */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={offerForm.amount}
                              onChange={e => setOfferForm(f => ({ ...f, amount: Number(e.target.value) }))}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 w-full"
                              placeholder="$USD amount"
                            />
                            <input
                              value={offerForm.deliverables}
                              onChange={e => setOfferForm(f => ({ ...f, deliverables: e.target.value }))}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 w-full"
                              placeholder="e.g. 1 Reel + 2 Stories"
                            />
                          </div>
                          <button
                            onClick={() => sendOffer(creator)}
                            disabled={sendingOffer === creator.id}
                            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors disabled:opacity-60"
                          >
                            {sendingOffer === creator.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5" />
                                <span>Send Offer ${offerForm.amount}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============ OFFERS & NEGOTIATION ============ */}
            {activeView === 'offers' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900">Offers & Negotiation</h2>
                  <span className="text-xs text-slate-500">{offers.length} total offers</span>
                </div>

                {offers.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                    <MessageSquare className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                    <p className="font-semibold text-slate-500">No offers yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Go to the Creator Directory to send your first offer.</p>
                    <button onClick={() => setActiveView('creators')} className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                      Browse Creators
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {offers.map(offer => (
                      <div key={offer.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={offer.creatorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(offer.creatorName)}&background=6366f1&color=fff`}
                              className="w-10 h-10 rounded-xl object-cover"
                              alt={offer.creatorName}
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{offer.creatorName}</div>
                              <div className="text-xs text-slate-500">{offer.campaignTitle}</div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  offer.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                  offer.status === 'countered' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                  offer.status === 'accepted' || offer.status === 'contract_generated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  'bg-slate-50 text-slate-600 border border-slate-200'
                                }`}>
                                  {offer.status.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className="text-xs font-bold text-emerald-600">${offer.amount?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openOfferChat(offer)}
                              className="px-3 py-1.5 text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Negotiate</span>
                            </button>
                            {['pending', 'countered'].includes(offer.status) && (
                              <button
                                onClick={() => acceptOffer(offer.id)}
                                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Accept & Contract</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {offer.deliverables && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {offer.deliverables.map((d: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] rounded-full font-medium">{d}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============ CONTRACTS ============ */}
            {activeView === 'contracts' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900">Smart Contracts</h2>
                  <span className="text-xs text-slate-500">{contracts.length} contracts</span>
                </div>

                {contracts.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                    <FileText className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                    <p className="font-semibold text-slate-500">No contracts yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Accept an offer to auto-generate a smart contract.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contracts.map(contract => (
                      <div key={contract.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{contract.campaignTitle}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{contract.brandName} × {contract.creatorName}</div>
                            <div className="flex items-center space-x-3 mt-2">
                              <span className="text-sm font-black text-emerald-600">${contract.amount?.toLocaleString()}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                contract.status === 'fully_signed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {contract.status === 'fully_signed' ? '✓ Fully Signed' : 'Pending Signatures'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-400">
                              <span className={contract.brandSigned ? 'text-emerald-600 font-semibold' : ''}>
                                {contract.brandSigned ? '✓' : '○'} Brand signed
                              </span>
                              <span className={contract.creatorSigned ? 'text-emerald-600 font-semibold' : ''}>
                                {contract.creatorSigned ? '✓' : '○'} Creator signed
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedContract(contract)}
                            className="px-4 py-2 text-xs font-bold border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors flex items-center space-x-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View & Sign</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Post Collab Modal */}
      {showCollabPostForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Post a Collab Opportunity</h3>
              <button onClick={() => setShowCollabPostForm(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Campaign Title *</label>
                <input
                  value={collabForm.title}
                  onChange={e => setCollabForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Nike Summer Campaign – Looking for Fitness Creators"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Description *</label>
                <textarea
                  rows={4}
                  value={collabForm.description}
                  onChange={e => setCollabForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe what you're looking for, campaign goals, content requirements..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Niche</label>
                  <select
                    value={collabForm.nicheCategory}
                    onChange={e => setCollabForm(f => ({ ...f, nicheCategory: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    {niches.filter(n => n !== 'All').map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Platform</label>
                  <select
                    value={collabForm.platforms}
                    onChange={e => setCollabForm(f => ({ ...f, platforms: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    {['Instagram', 'YouTube', 'TikTok', 'Twitter'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Budget ($)</label>
                  <input
                    type="number"
                    value={collabForm.budget}
                    onChange={e => setCollabForm(f => ({ ...f, budget: e.target.value }))}
                    placeholder="e.g. 2500"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => setShowCollabPostForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={postCollab}
                disabled={postingCollab || !collabForm.title || !collabForm.description}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
              >
                {postingCollab ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-4 h-4" /><span>Post Opportunity</span></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Negotiation Chat Modal */}
      {selectedOffer && (
        <NegotiationChatModal
          offer={selectedOffer}
          messages={offerMessages}
          currentRole="brand"
          onClose={() => { setSelectedOffer(null); fetchAll(); }}
          onSendTextMessage={handleSendMessage}
          onSubmitCounterOffer={handleCounterOffer}
          onAcceptOffer={acceptOffer}
          onViewContract={(contractId) => {
            const c = contracts.find((ct: any) => ct.id === contractId);
            if (c) { setSelectedContract(c); setSelectedOffer(null); }
          }}
          contracts={contracts}
        />
      )}

      {/* Smart Contract Modal */}
      {selectedContract && (
        <SmartContractModal
          contract={selectedContract}
          currentRole="brand"
          onClose={() => { setSelectedContract(null); fetchAll(); }}
          onSignContract={handleSignContract}
        />
      )}
    </div>
  );
};
