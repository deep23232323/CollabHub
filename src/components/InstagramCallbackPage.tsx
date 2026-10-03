import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ShieldCheck, Sparkles, Instagram, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUserInfo, updateUserInfo } from '../store/slices/userSlice';

export const InstagramCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUserInState } = useAuth();
  const dispatch = useDispatch();

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [step, setStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any>(null);

  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');

  useEffect(() => {
    if (errorParam) {
      setStatus('error');
      setErrorMessage(errorReason || 'Instagram authorization was declined or cancelled.');
      return;
    }

    processCallback();
  }, [code, errorParam]);

  const processCallback = async () => {
    try {
      setStatus('processing');
      setStep(1);

      // Step 1: Simulated progress steps
      setTimeout(() => setStep(2), 800);
      setTimeout(() => setStep(3), 1600);

      // Use the redirect URI that was stored before the OAuth redirect started
      const storedRedirectUri = localStorage.getItem('ig_redirect_uri');
      const redirectUri = storedRedirectUri || `${window.location.origin}/instagram-callback`;

      // Resolve uid: prefer stored localStorage value (most reliable on fresh page load)
      // because auth state might not have re-hydrated yet after the OAuth redirect.
      const storedUid = localStorage.getItem('ig_connect_uid');
      const uid = storedUid || user?.firebaseUid || user?.id || user?._id;

      if (!uid) {
        throw new Error('Could not determine user ID. Please log in and try again.');
      }

      console.log('Processing Instagram callback for uid:', uid, 'redirectUri:', redirectUri);

      // Call Backend Instagram Exchange & Sync Endpoint
      const response = await fetch('/api/instagram/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code || undefined,
          redirectUri,
          uid
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync Instagram profile with server');
      }

      setStep(4);
      setSyncResult(data);
      setStatus('success');

      // Update Redux store and AuthContext with the fresh user data
      if (data.user) {
        dispatch(updateUserInfo(data.user));
        updateUserInState(data.user);
      }

      // Clean up localStorage
      localStorage.removeItem('ig_connect_uid');
      localStorage.removeItem('ig_redirect_uri');

      // If opened in popup window, send postMessage to opener
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'INSTAGRAM_CONNECTED',
            data: { socialAccount: data.socialAccount, user: data.user }
          },
          '*'
        );
        setTimeout(() => {
          window.close();
        }, 3000);
      } else {
        // Redirect to dashboard after 2.5s
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2500);
      }

    } catch (err: any) {
      console.error('Error in Instagram callback processing:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Error connecting Instagram account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Instagram Gradient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 text-center space-y-6 backdrop-blur-md">
        
        {/* Instagram Brand Header */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg ring-4 ring-rose-500/20 animate-pulse">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
              <Instagram className="w-8 h-8 text-rose-500" />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Instagram Account Sync
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Influencer Social Verification & Firestore Integration
          </p>
        </div>

        {/* PROCESSING STATE */}
        {status === 'processing' && (
          <div className="space-y-4 py-2">
            <div className="flex justify-center">
              <RefreshCw className="w-7 h-7 text-rose-400 animate-spin" />
            </div>

            <div className="space-y-2 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
              <div className={`flex items-center space-x-2.5 ${step >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>1. Exchanging OAuth Code with Instagram Graph API...</span>
              </div>

              <div className={`flex items-center space-x-2.5 ${step >= 2 ? 'text-emerald-400 font-bold' : step === 1 ? 'text-rose-400 animate-pulse' : 'text-slate-600'}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>2. Fetching Instagram Profile, Followers & Media Count...</span>
              </div>

              <div className={`flex items-center space-x-2.5 ${step >= 3 ? 'text-emerald-400 font-bold' : step === 2 ? 'text-purple-400 animate-pulse' : 'text-slate-600'}`}>
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>3. Calculating AI Audience Authenticity Score...</span>
              </div>

              <div className={`flex items-center space-x-2.5 ${step >= 4 ? 'text-emerald-400 font-bold' : step === 3 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`}>
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>4. Saving to Firestore (influencers/uid/socialAccounts)...</span>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && syncResult && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Instagram Connected Successfully!</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-extrabold text-slate-400">Username</div>
                  <div className="font-extrabold text-white">{syncResult.socialAccount?.username}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-extrabold text-slate-400">Followers</div>
                  <div className="font-extrabold text-white">{(syncResult.socialAccount?.followers / 1000).toFixed(0)}K</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-extrabold text-slate-400">Account Type</div>
                  <div className="font-extrabold text-rose-300">{syncResult.socialAccount?.accountType}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-extrabold text-slate-400">Authenticity</div>
                  <div className="font-extrabold text-purple-300">{syncResult.authenticityScore}%</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-1">
                Saved to Firestore: <span className="text-slate-300">influencers/{syncResult.uid}/socialAccounts/instagram</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Redirecting back to your Influencer Dashboard...
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Return to Dashboard Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-left space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Instagram Connection Error</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
