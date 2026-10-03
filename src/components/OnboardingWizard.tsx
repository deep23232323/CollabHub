import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  ShieldCheck,
  User,
  Share2,
  Check,
  Camera,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Instagram,
  Youtube,
  Globe,
  DollarSign,
  Tag,
  Briefcase
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateOnboardingProfile, updateSocialLinks, setUserInfo } from '../store/slices/userSlice';
import ConnectInstagramStep from './ConnectInstagramStep';

export const OnboardingWizard: React.FC = () => {
  const { user, updateUserInState } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 State
  const [fullName, setFullName] = useState<string>(user?.fullName || '');
  const [username, setUsername] = useState<string>(user?.username || '');
  const [country, setCountry] = useState<string>(user?.country || 'United States');
  const [city, setCity] = useState<string>(user?.city || 'Los Angeles');
  const [language, setLanguage] = useState<string>(user?.language || 'English');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [category, setCategory] = useState<string>(user?.category || 'Lifestyle');
  const [bio, setBio] = useState<string>(user?.bio || '');

  // Step 2 & 3 State
  const [instagram, setInstagram] = useState<string>(user?.socialAccounts?.instagram || '');
  const [youtube, setYoutube] = useState<string>(user?.socialAccounts?.youtube || '');
  const [tiktok, setTiktok] = useState<string>(user?.socialAccounts?.tiktok || '');
  const [twitter, setTwitter] = useState<string>(user?.socialAccounts?.twitter || '');
  const [linkedin, setLinkedin] = useState<string>(user?.socialAccounts?.linkedin || '');
  const [website, setWebsite] = useState<string>(user?.socialAccounts?.website || '');
  const [verificationReport, setVerificationReport] = useState<any>(null);

  // Step 4 State
  const [profilePhoto, setProfilePhoto] = useState<string>(user?.profilePhoto || '');
  const [coverPhoto, setCoverPhoto] = useState<string>(user?.coverPhoto || '');
  const [role, setRole] = useState<'creator' | 'brand' | 'agency'>((user?.role as any) || 'creator');
  const [selectedNiches, setSelectedNiches] = useState<string[]>(['Lifestyle', 'Tech']);
  const [collaborationRates, setCollaborationRates] = useState({
    post: 500,
    reel: 850,
    story: 250,
    video: 1200
  });

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.username) setUsername(user.username);
      if (user.profilePhoto) setProfilePhoto(user.profilePhoto);
      if (user.onboardingCompleted) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('cp_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // Handle Step 1 Submit
  const handleStep1Submit = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);
  setError(null);

  try {
    const res = await fetch("/api/onboarding/step-1", {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        fullName,
        username,
        country,
        city,
        language,
        phone,
        category,
        bio,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to save Step 1");
    }

    // Update Redux state
    updateOnboardingProfile({
      fullName,
      username,
      country,
      city,
      language,
      phone,
      category,
      bio,
    });

    setStep(2);
  } catch (err: any) {
    setError(err.message || "Error saving Step 1");
  } finally {
    setLoading(false);
  }
};
  // Handle Step 2 & 3 Social API Verification
  const handleStep2Verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding/step-2-verify', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ instagram, youtube, tiktok, twitter, linkedin, website })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify social accounts');

      setVerificationReport(data.verificationReport);
      if (data.user) updateUserInState(data.user);
      
      updateSocialLinks({
        instagram: "https://instagram.com/gagandeep",
        youtube: "https://youtube.com/@gagandeep",
        tiktok: "https://tiktok.com/@gagandeep",
        twitter: "https://twitter.com/gagandeep",
        linkedin: "https://linkedin.com/in/gagandeep",
        website: "https://gagandeep.dev",
      })
    
      setStep(3); // Show Verification Inspection Results Page
    } catch (err: any) {
      setError(err.message || 'Error verifying social accounts');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 4 Final Complete
  const handleStep4Complete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding/step-4-complete', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          profilePhoto: profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          coverPhoto: coverPhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          collaborationInterests: ['Sponsored Posts', 'Brand Ambassador', 'Affiliate Sales'],
          preferredBrands: ['Nike', 'Apple', 'Sephora'],
          collaborationRates,
          role,
          portfolioLinks: [website].filter(Boolean)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to finish onboarding');

      if (data.user) {
        updateUserInState(data.user);
        dispatch(setUserInfo(data.user));
        // Role-based redirect after onboarding
        if (data.user.role === 'brand') {
          navigate('/dashboard/brand', { replace: true });
        } else if (data.user.role === 'agency') {
          navigate('/dashboard/brand', { replace: true });
        } else {
          navigate('/dashboard/creator', { replace: true });
        }
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Error completing onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white py-8 px-4 sm:px-6">
      
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-white">CreatorPulse Onboarding</span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Step {step} of 4</span>
        </div>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label: 'Basic Info', icon: User },
            { label: 'Social Accounts', icon: Share2 },
            { label: 'API Verification', icon: ShieldCheck },
            { label: 'Complete Profile', icon: CheckCircle2 }
          ].map((st, i) => {
            const num = i + 1;
            const IconComponent = st.icon;
            const isActive = step === num;
            const isDone = step > num;

            return (
              <div
                key={i}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : isActive
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : isActive
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : num}
                </div>
                <span className="truncate hidden sm:inline">{st.label}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Box */}
      <div className="max-w-4xl mx-auto w-full bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative my-auto">
        
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">Step 1: Basic Creator Profile</h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell brands who you are, your location, and your primary content category.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform Username *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. sarahjenkins_fit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Los Angeles, CA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="English"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Creator Category / Main Niche</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Lifestyle">Lifestyle & Fashion</option>
                <option value="Tech">Technology & Gaming</option>
                <option value="Fitness">Fitness & Wellness</option>
                <option value="Travel">Travel & Culinary</option>
                <option value="Beauty">Beauty & Cosmetics</option>
                <option value="Business">Business & Tech</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Creator Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your content style, audience demographics, and brand sponsorship history..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Continue to Socials</span>}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Social Media Accounts */}
        {step === 2 && (
          <form onSubmit={handleStep2Verify} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">Step 2: Connect Social Media Handles</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your official channel handles. Our system will call YouTube Data API & Instagram APIs to verify ownership.
              </p>
            </div>

            <div className="space-y-4">
              {/* Official Instagram API Connect OAuth Button */}
              <div className="mb-4">
                <ConnectInstagramStep userId={user?.id || user?._id || user?.firebaseUid || ''} />
              </div>

              

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center space-x-3">
                <Youtube className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-300">YouTube Channel Handle or URL</label>
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="@SarahJenkinsTech"
                    className="w-full bg-transparent border-none text-xs text-white focus:outline-none mt-0.5"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center space-x-3">
                <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-300">TikTok Username</label>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="@sarah_tok"
                    className="w-full bg-transparent border-none text-xs text-white focus:outline-none mt-0.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Twitter / X Handle</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@sarahj_tweets"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Personal Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://sarahjenkins.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Run API Verification</span>}
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: API Verification Results Inspection */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Official Social API Verification Report</span>
              </div>
              <h2 className="text-2xl font-black text-white">Verification Status Summary</h2>
              <p className="text-xs text-slate-400 mt-1">
                Our automated verifier queried YouTube Data API & Instagram Graph API to confirm channel metadata.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {verificationReport?.verificationResults?.youtube && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <Youtube className="w-4 h-4" /> YouTube API
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-lg font-black text-white">
                    {verificationReport.verificationResults.youtube.subscribers.toLocaleString()} Subs
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Channel ID: {verificationReport.verificationResults.youtube.channelId}
                  </p>
                </div>
              )}

              {verificationReport?.verificationResults?.instagram && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                      <Instagram className="w-4 h-4" /> Instagram API
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-lg font-black text-white">
                    {user?.creatorStats?.followersCount || 2509} Followers
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Handle: {verificationReport.verificationResults.instagram.handle}
                  </p>
                </div>
              )}

              {verificationReport?.verificationResults?.tiktok && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> TikTok API
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-lg font-black text-white">
                    {verificationReport.verificationResults.tiktok.followers.toLocaleString()} Followers
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Handle: {verificationReport.verificationResults.tiktok.handle}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-xs text-slate-300 space-y-1">
              <div className="font-bold text-white">Audience Verification Note:</div>
              <p className="text-slate-400">{verificationReport?.notes || 'Data saved directly to Mongoose user record.'}</p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Handles</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
              >
                <span>Proceed to Final Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Complete Profile */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">Step 4: Finalize Creator Rates & Role</h2>
              <p className="text-xs text-slate-400 mt-1">
                Set your preferred brand collaboration rates and primary account role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profile Photo URL</label>
                <input
                  type="text"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cover Image URL</label>
                <input
                  type="text"
                  value={coverPhoto}
                  onChange={(e) => setCoverPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Platform Account Role</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'creator', label: 'Creator / Influencer' },
                  { key: 'brand', label: 'Brand Client' },
                  { key: 'agency', label: 'Talent Agency' }
                ].map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                      role === r.key
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Sponsorship Rates ($ USD)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Instagram Post</span>
                  <input
                    type="number"
                    value={collaborationRates.post}
                    onChange={(e) => setCollaborationRates({ ...collaborationRates, post: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Dedicated Reel</span>
                  <input
                    type="number"
                    value={collaborationRates.reel}
                    onChange={(e) => setCollaborationRates({ ...collaborationRates, reel: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Story Package</span>
                  <input
                    type="number"
                    value={collaborationRates.story}
                    onChange={(e) => setCollaborationRates({ ...collaborationRates, story: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">YouTube Video</span>
                  <input
                    type="number"
                    value={collaborationRates.video}
                    onChange={(e) => setCollaborationRates({ ...collaborationRates, video: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleStep4Complete}
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Complete Onboarding & Launch Dashboard</span>}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer info */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 mt-8">
        Need assistance with your channel verification? Contact our creator support team at support@creatorpulse.io
      </div>

    </div>
  );
};
