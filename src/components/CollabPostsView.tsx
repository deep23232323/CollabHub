import React, { useState, useEffect } from 'react';
import { CollabPost, CollabRequest, Creator } from '../types';
import { 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Users, 
  Video, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  MessageSquare, 
  X, 
  Tag, 
  Radio, 
  BadgeCheck, 
  Globe, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface CollabPostsViewProps {
  creators: Creator[];
  currentCreator?: Creator;
  onOpenOfferChat?: (offer: any) => void;
}

export const CollabPostsView: React.FC<CollabPostsViewProps> = ({
  creators,
  currentCreator,
  onOpenOfferChat
}) => {
  const [posts, setPosts] = useState<CollabPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedCollabType, setSelectedCollabType] = useState('All');
  const [filterMyNicheOnly, setFilterMyNicheOnly] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPostForApply, setSelectedPostForApply] = useState<CollabPost | null>(null);
  const [selectedPostForManage, setSelectedPostForManage] = useState<CollabPost | null>(null);

  // Form states - Create Post
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newNicheCategory, setNewNicheCategory] = useState('Tech');
  const [newPlatforms, setNewPlatforms] = useState<string[]>(['YouTube', 'Instagram']);
  const [newFollowerRequirement, setNewFollowerRequirement] = useState('10k+');
  const [newCollabType, setNewCollabType] = useState<CollabPost['collabType']>('Co-Created Content');
  const [newCompensationType, setNewCompensationType] = useState<CollabPost['compensationType']>('Equal Cross-Promo');
  const [newEstimatedValue, setNewEstimatedValue] = useState('Equal Cross-Promotion');
  const [newLocationRequirement, setNewLocationRequirement] = useState('Remote/Online');
  const [submittingPost, setSubmittingPost] = useState(false);

  // Form states - Apply Offer
  const [pitchMessage, setPitchMessage] = useState('');
  const [proposedDate, setProposedDate] = useState('Within 2 weeks');
  const [collaborationValue, setCollaborationValue] = useState('Equal Cross-Promotion & Social Tagging');
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const activeCreator = currentCreator || creators[0] || {
    id: 'c1',
    name: 'Alex Rivera',
    handle: '@alexrivera_tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    niche: ['Tech', 'AI'],
    totalFollowers: 680000,
    location: 'San Francisco, USA'
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('cp_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    fetchCollabPosts();
  }, [selectedNiche, selectedPlatform, selectedCollabType, filterMyNicheOnly]);

  const fetchCollabPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedNiche !== 'All') params.append('niche', selectedNiche);
      if (selectedPlatform !== 'All') params.append('platform', selectedPlatform);
      if (selectedCollabType !== 'All') params.append('collabType', selectedCollabType);
      if (filterMyNicheOnly && activeCreator?.niche?.length) {
        params.append('myNiche', activeCreator.niche.join(','));
      }

      const res = await fetch(`/api/collab-posts?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching collab posts:', err);
      setError('Failed to load collaboration posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCollabPosts();
  };

  // Create Post Submit
  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    setSubmittingPost(true);
    try {
      const res = await fetch('/api/collab-posts', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          authorId: activeCreator.id,
          authorName: activeCreator.name,
          authorHandle: activeCreator.handle,
          authorAvatar: activeCreator.avatar,
          authorNiche: Array.isArray(activeCreator.niche) ? activeCreator.niche[0] : activeCreator.niche,
          authorFollowers: activeCreator.totalFollowers || 500000,
          authorLocation: activeCreator.location || 'San Francisco, USA',
          title: newTitle,
          description: newDescription,
          nicheCategory: newNicheCategory,
          targetPlatforms: newPlatforms,
          followerRequirement: newFollowerRequirement,
          collabType: newCollabType,
          compensationType: newCompensationType,
          estimatedValue: newEstimatedValue,
          locationRequirement: newLocationRequirement
        })
      });

      if (!res.ok) throw new Error('Failed to create post');
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setShowCreateModal(false);
      resetCreateForm();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error publishing collaboration post');
    } finally {
      setSubmittingPost(false);
    }
  };

  const resetCreateForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewNicheCategory('Tech');
    setNewPlatforms(['YouTube', 'Instagram']);
    setNewFollowerRequirement('10k+');
    setNewCollabType('Co-Created Content');
    setNewCompensationType('Equal Cross-Promo');
    setNewEstimatedValue('Equal Cross-Promotion');
    setNewLocationRequirement('Remote/Online');
  };

  // Submit Request / Offer
  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostForApply || !pitchMessage.trim()) return;

    setSubmittingOffer(true);
    try {
      const res = await fetch(`/api/collab-posts/${selectedPostForApply.id}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          applicantId: activeCreator.id,
          applicantName: activeCreator.name,
          applicantHandle: activeCreator.handle,
          applicantAvatar: activeCreator.avatar,
          applicantNiche: activeCreator.niche || ['Tech'],
          applicantFollowers: activeCreator.totalFollowers || 500000,
          pitchMessage,
          proposedDate,
          collaborationValue
        })
      });

      if (!res.ok) throw new Error('Failed to submit offer');
      const data = await res.json();

      // Update post in state with new request
      setPosts(posts.map(p => p.id === selectedPostForApply.id ? data.post : p));
      setSelectedPostForApply(null);
      setPitchMessage('');
      alert('Collaboration offer sent successfully to the post creator!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to submit collaboration request');
    } finally {
      setSubmittingOffer(false);
    }
  };

  // Accept / Reject Request
  const handleActionRequest = async (postId: string, requestId: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/collab-posts/${postId}/requests/${requestId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ action, responseNote: action === 'accept' ? 'Accepted offer!' : 'Declined offer.' })
      });

      if (!res.ok) throw new Error('Failed to update request');
      const data = await res.json();

      setPosts(posts.map(p => p.id === postId ? data.post : p));
      if (selectedPostForManage?.id === postId) {
        setSelectedPostForManage(data.post);
      }

      if (action === 'accept') {
        alert('Collaboration request accepted! A negotiation chat room has been created in your Offers tab.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Action failed');
    }
  };

  const togglePlatformSelection = (p: string) => {
    if (newPlatforms.includes(p)) {
      if (newPlatforms.length > 1) {
        setNewPlatforms(newPlatforms.filter(item => item !== p));
      }
    } else {
      setNewPlatforms([...newPlatforms, p]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-extrabold">
              <Share2 className="w-3.5 h-3.5" />
              <span>Creator-to-Creator Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Influencer Collaboration Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Find fellow influencers to co-host podcasts, cross-promote channels, co-create video shoots, or swap shoutouts. Pitch offers and manage requests directly with creators in your niche.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="shrink-0 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer border border-white/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Collab Post</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search collab posts by keyword, concept, title, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Search Posts
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Niche Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Niche:</span>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Niches</option>
                <option value="Tech">Tech & AI</option>
                <option value="Fashion">Fashion & Style</option>
                <option value="Fitness">Fitness & Health</option>
                <option value="Gaming">Gaming & Esports</option>
                <option value="Beauty">Beauty & Skincare</option>
                <option value="Travel">Travel & Food</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            {/* Platform Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Platform:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Platforms</option>
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Podcast">Podcast</option>
                <option value="Twitter">Twitter / X</option>
                <option value="Twitch">Twitch</option>
              </select>
            </div>

            {/* Collab Type Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Type:</span>
              <select
                value={selectedCollabType}
                onChange={(e) => setSelectedCollabType(e.target.value)}
                className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Collab Types</option>
                <option value="Cross-Promotion">Cross-Promotion</option>
                <option value="Co-Created Content">Co-Created Content</option>
                <option value="Guest Appearance">Guest Appearance</option>
                <option value="Podcast Feature">Podcast Feature</option>
                <option value="Shoutout Swap">Shoutout Swap</option>
              </select>
            </div>

          </div>

          {/* Quick Toggle: Matched to My Niche */}
          <button
            onClick={() => setFilterMyNicheOnly(!filterMyNicheOnly)}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer border ${
              filterMyNicheOnly
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matched to My Interests</span>
          </button>
        </div>
      </div>

      {/* Posts Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-12 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Share2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">No Collaboration Posts Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            There are currently no open collaboration inquiries matching your selected filters. Be the first influencer to publish a post!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create a Collab Inquiry</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => {
            const isMyPost = post.authorId === activeCreator.id;
            const hasApplied = post.requests.some(r => r.applicantId === activeCreator.id);
            const pendingRequests = post.requests.filter(r => r.status === 'pending');

            return (
              <div
                key={post.id}
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-sm text-slate-900">{post.authorName}</span>
                        <BadgeCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>{post.authorHandle}</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-600">{(post.authorFollowers / 1000).toFixed(0)}k followers</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                    post.status === 'open'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}>
                    {post.status === 'open' ? 'OPEN INQUIRY' : 'IN COLLABORATION'}
                  </span>
                </div>

                {/* Post Title & Badges */}
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {post.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                      Niche: {post.nicheCategory}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      Type: {post.collabType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700">
                      Comp: {post.compensationType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700">
                      Min Size: {post.followerRequirement}
                    </span>
                  </div>
                </div>

                {/* Description Body */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                  "{post.description}"
                </p>

                {/* Details Footer Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Platforms: <strong className="text-slate-800">{post.targetPlatforms.join(', ')}</strong></span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Location: <strong className="text-slate-800">{post.locationRequirement}</strong></span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>{post.requests.length} Offer{post.requests.length !== 1 ? 's' : ''} Received</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* If this post belongs to current user or if viewing in demo mode */}
                    <button
                      onClick={() => setSelectedPostForManage(post)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Offers ({post.requests.length})
                    </button>

                    {!isMyPost && (
                      <button
                        onClick={() => setSelectedPostForApply(post)}
                        disabled={hasApplied}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                          hasApplied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        }`}
                      >
                        {hasApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Offer Sent</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Offer</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL 1: CREATE COLLAB POST ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Post Collaboration Inquiry</h2>
                  <p className="text-xs text-slate-500">Connect with influencers for co-creation, podcast dual-streams, or cross-promotions.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                  Inquiry Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Looking for Tech Creator for YouTube Podcast Dual-Stream"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                    Primary Niche / Category
                  </label>
                  <select
                    value={newNicheCategory}
                    onChange={(e) => setNewNicheCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Tech">Tech & AI</option>
                    <option value="Fashion">Fashion & Style</option>
                    <option value="Fitness">Fitness & Health</option>
                    <option value="Gaming">Gaming & Esports</option>
                    <option value="Beauty">Beauty & Skincare</option>
                    <option value="Travel">Travel & Food</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                    Collaboration Type
                  </label>
                  <select
                    value={newCollabType}
                    onChange={(e) => setNewCollabType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Co-Created Content">Co-Created Content</option>
                    <option value="Cross-Promotion">Cross-Promotion</option>
                    <option value="Guest Appearance">Guest Appearance</option>
                    <option value="Podcast Feature">Podcast Feature</option>
                    <option value="Shoutout Swap">Shoutout Swap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                  Target Social Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {['YouTube', 'Instagram', 'TikTok', 'Podcast', 'Twitter', 'Twitch'].map((plat) => {
                    const isSelected = newPlatforms.includes(plat);
                    return (
                      <button
                        type="button"
                        key={plat}
                        onClick={() => togglePlatformSelection(plat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {plat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                    Min Follower Requirement
                  </label>
                  <select
                    value={newFollowerRequirement}
                    onChange={(e) => setNewFollowerRequirement(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="Any">Any Size</option>
                    <option value="10k+">10k+ Followers</option>
                    <option value="50k+">50k+ Followers</option>
                    <option value="100k+">100k+ Followers</option>
                    <option value="500k+">500k+ Followers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                    Compensation
                  </label>
                  <select
                    value={newCompensationType}
                    onChange={(e) => setNewCompensationType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="Equal Cross-Promo">Equal Cross-Promo</option>
                    <option value="Paid Sponsorship">Paid Sponsorship</option>
                    <option value="Revenue Share">Revenue Share</option>
                    <option value="Free Product Swap">Free Product Swap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <select
                    value={newLocationRequirement}
                    onChange={(e) => setNewLocationRequirement(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="Remote/Online">Remote / Online</option>
                    <option value="In-Person (Specify)">In-Person Shoot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                  Detailed Concept & Collaboration Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your collaboration idea, goals, format, production schedule, or requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPost}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {submittingPost ? 'Publishing...' : 'Publish Collaboration Post'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: SEND COLLAB OFFER / REQUEST ================= */}
      {selectedPostForApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-6 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Send Collaboration Offer</h3>
                <p className="text-xs text-slate-500">To <strong className="text-slate-800">{selectedPostForApply.authorName}</strong> for "{selectedPostForApply.title}"</p>
              </div>
              <button
                onClick={() => setSelectedPostForApply(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                  Your Pitch & Collaboration Idea *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Introduce yourself and explain why you're a great fit for this collab..."
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                  Proposed Date or Timeline
                </label>
                <input
                  type="text"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  placeholder="e.g., Next week, Aug 15-20"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                  Collaboration Offer Terms
                </label>
                <input
                  type="text"
                  value={collaborationValue}
                  onChange={(e) => setCollaborationValue(e.target.value)}
                  placeholder="e.g., Equal YouTube & Instagram Cross-Promo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedPostForApply(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOffer}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  {submittingOffer ? 'Sending...' : 'Submit Collab Offer'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 3: MANAGE OFFERS & REQUESTS ================= */}
      {selectedPostForManage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider">Managing Requests</span>
                <h3 className="text-lg font-black text-slate-900">{selectedPostForManage.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPostForManage(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedPostForManage.requests.length === 0 ? (
              <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No Offers or Requests Submitted Yet</p>
                <p className="text-[11px] text-slate-500">When other influencers apply to your post, their proposals will appear here for review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPostForManage.requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={req.applicantAvatar}
                          alt={req.applicantName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">{req.applicantName}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">
                            {req.applicantHandle} • {(req.applicantFollowers / 1000).toFixed(0)}k followers
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        req.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                      "{req.pitchMessage}"
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                      <div>Timeline: <strong className="text-slate-800">{req.proposedDate}</strong></div>
                      <div>Offer: <strong className="text-indigo-600">{req.collaborationValue}</strong></div>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => handleActionRequest(selectedPostForManage.id, req.id, 'reject')}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleActionRequest(selectedPostForManage.id, req.id, 'accept')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedPostForManage(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
