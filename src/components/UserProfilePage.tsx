import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { updateUserInfo } from '../store/slices/userSlice';
import { 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Instagram, 
  Lock, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Globe, 
  Phone, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Loader2,
  AlertCircle
} from 'lucide-react';

interface RootState {
  user?: {
    data?: any;
  };
}

export const UserProfilePage: React.FC = () => {
  const reduxUser = useSelector((state: RootState) => state.user?.data);
  const { user: authUser, updateUserInState } = useAuth();
  const dispatch = useDispatch();

  const user = reduxUser || authUser || {};

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(user.fullName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [country, setCountry] = useState(user.country || 'United States');
  const [city, setCity] = useState(user.city || 'Los Angeles');
  const [language, setLanguage] = useState(user.language || 'English');
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || '');
  const [gender, setGender] = useState(user.gender || '');
  const [bio, setBio] = useState(user.bio || '');
  const [category, setCategory] = useState(user.category || 'Lifestyle');
  const [collaborationRates, setCollaborationRates] = useState({
    post: user.collaborationRates?.post || 500,
    reel: user.collaborationRates?.reel || 850,
    story: user.collaborationRates?.story || 250,
    video: user.collaborationRates?.video || 1200
  });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setCountry(user.country || 'United States');
      setCity(user.city || 'Los Angeles');
      setLanguage(user.language || 'English');
      setDateOfBirth(user.dateOfBirth || '');
      setGender(user.gender || '');
      setBio(user.bio || '');
      setCategory(user.category || 'Lifestyle');
      if (user.collaborationRates) {
        setCollaborationRates({
          post: user.collaborationRates.post || 500,
          reel: user.collaborationRates.reel || 850,
          story: user.collaborationRates.story || 250,
          video: user.collaborationRates.video || 1200
        });
      }
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName,
          phone,
          country,
          city,
          language,
          dateOfBirth,
          gender,
          bio,
          category,
          collaborationRates
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      if (data.user) {
        dispatch(updateUserInfo(data.user));
        updateUserInState(data.user);
        setSuccessMessage('Profile updated and saved to MongoDB successfully!');
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  const instagramHandle = user.socialAccounts?.instagram || '';
  const followersCount = user.creatorStats?.followersCount || 0;
  const engagementRate = user.creatorStats?.engagementRate || 0;
  const isVerified = user.isVerified || Boolean(instagramHandle);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Messages */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Cover Photo */}
        <div 
          className="h-44 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${user.coverPhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'})` }}
        >
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative z-10 -mt-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end space-x-4">
            <img
              src={user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={user.fullName || 'User'}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl bg-slate-800"
            />
            <div className="mb-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">{user.fullName || 'Creator Profile'}</h1>
                {isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>VERIFIED CREATOR</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                @{user.username || 'creator'} • {user.category || 'Lifestyle'}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{user.city || 'Los Angeles'}, {user.country || 'United States'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span>{user.language || 'English'}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* SYNCED INSTAGRAM STATS (LOCKED FROM MANUAL EDITING) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-orange-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Instagram className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">Synced Instagram API Data</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>LOCKED (API SYNCED)</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic follower & engagement metrics fetched directly via Instagram Graph API.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Connected Handle</span>
            <span className="font-extrabold text-white text-sm mt-0.5 block font-mono">
              {instagramHandle || '@not_connected'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Followers</span>
            <span className="font-extrabold text-white text-sm mt-0.5 block">
              {followersCount ? followersCount.toLocaleString() : '0'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Engagement Rate</span>
            <span className="font-extrabold text-emerald-400 text-sm mt-0.5 block flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{engagementRate ? `${engagementRate}%` : '0%'}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Account Status</span>
            <span className="font-extrabold text-indigo-400 text-sm mt-0.5 block flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isVerified ? 'Verified Organic' : 'Pending Sync'}</span>
            </span>
          </div>
        </div>

        <div className="mt-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl text-[11px] text-slate-400 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Note:</strong> Instagram handle, followers, and engagement rates cannot be edited manually. They are automatically retrieved and saved in MongoDB whenever you connect your Instagram account.
          </span>
        </div>
      </div>

      {/* EDIT PROFILE FORM / VIEW */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-black text-white mb-6 flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-400" />
          <span>Personal & Collaboration Information</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="text"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Country</label>
              <input
                type="text"
                disabled={!isEditing}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">City</label>
              <input
                type="text"
                disabled={!isEditing}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Language</label>
              <input
                type="text"
                disabled={!isEditing}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date of Birth</label>
              <input
                type="date"
                disabled={!isEditing}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Creator Bio</label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands about your audience and style..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Collaboration Rates */}
          <div>
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Standard Collaboration Rates ($USD)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Post</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={collaborationRates.post}
                  onChange={(e) => setCollaborationRates({ ...collaborationRates, post: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Reel</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={collaborationRates.reel}
                  onChange={(e) => setCollaborationRates({ ...collaborationRates, reel: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Story</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={collaborationRates.story}
                  onChange={(e) => setCollaborationRates({ ...collaborationRates, story: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Video</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={collaborationRates.video}
                  onChange={(e) => setCollaborationRates({ ...collaborationRates, video: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-60 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Profile to Database</span>
              </button>
            </div>
          )}
        </form>
      </div>

    </div>
  );
};
