import React, { useState, useEffect } from 'react';
import { signInWithGoogle, logoutFirebase } from '../firebase';
import { LogOut, ShieldCheck, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../store/slices/userSlice';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  firebaseUid: string;
  onboardingCompleted?: boolean;
}

interface GoogleLoginButtonProps {
  onAuthChange?: (user: AuthUser | null) => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onAuthChange }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingInitialAuth, setCheckingInitialAuth] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Optional AuthContext integration


const dispatch = useDispatch();


  let authContext: any = null;
  try {
    authContext = useAuth();
  } catch (e) {
    // AuthContext might not be wrapped in some standalone navbar views
  }

  // Check if user is already logged in via JWT cookie on mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('cp_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/auth/me', { headers, credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (authContext?.updateUserInState) {
            authContext.updateUserInState(data.user);
          }
          if (onAuthChange) onAuthChange(data.user);
        }
      }
    } catch (err) {
      console.log('No existing session active');
    } finally {
      setCheckingInitialAuth(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Sign in with Google Popup via Firebase Client SDK
      const authResult = await signInWithGoogle();

      // Step 2: Send Firebase ID Token to Node.js / Express backend
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          idToken: authResult.idToken,
          user: authResult.user || {
            displayName: authResult.displayName,
            email: authResult.email,
            photoURL: authResult.photoURL,
            uid: authResult.uid
          }
        })
      });

      const data = await res.json();
      console.log('Backend auth response:', authResult, data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Backend authentication failed');
      }

      if (data.token) {
        localStorage.setItem('cp_token', data.token);
      }

      // Step 3: Successfully authenticated, update user state
      setUser(data.user);
      dispatch(setUserInfo(data.user));
      if (authContext?.updateUserInState) {
        authContext.updateUserInState(data.user);
      }
      if (onAuthChange) onAuthChange(data.user);
      console.log(data.user)
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        const currentDomain = window.location.hostname;
        setError(`Domain not authorized in Firebase Console! Add "${currentDomain}" to Firebase Console -> Authentication -> Settings -> Authorized Domains. Or use Instant Demo Sign-In below.`);
      } else if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup')) {
        setError('Google login popup was blocked by browser. Please enable popups or try Instant Demo Sign-In.');
      } else {
        setError(err.message || 'Google sign-in attempt failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'creator' | 'brand' | 'agency' = 'creator') => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Demo login failed');
      }

      if (data.token) {
        localStorage.setItem('cp_token', data.token);
      }

      setUser(data.user);
      if (authContext?.updateUserInState) {
        authContext.updateUserInState(data.user);
      }
      if (onAuthChange) onAuthChange(data.user);
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(err.message || 'Demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await logoutFirebase();

      localStorage.removeItem('cp_token');
      setUser(null);
      if (authContext?.updateUserInState) {
        authContext.updateUserInState(null);
      }
      if (onAuthChange) onAuthChange(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingInitialAuth) {
    return (
      <div className="flex items-center space-x-2 text-xs text-slate-400 py-1 px-3 bg-slate-900 rounded-xl border border-slate-800 animate-pulse">
        <div className="w-3 h-3 rounded-full bg-slate-700" />
        <span>Verifying auth...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2 text-white shadow-md">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
        />
        <div className="text-left hidden sm:block">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-bold text-white truncate max-w-[120px]">{user.name}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">{user.email}</span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          title="Sign Out"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-colors flex items-center space-x-1 text-xs font-semibold cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 w-full">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{loading ? 'Authenticating...' : 'Sign in with Google'}</span>
      </button>

      <div className="relative my-2 flex items-center justify-center">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest absolute">
          or preview demo
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleDemoLogin('creator')}
          disabled={loading}
          className="py-2.5 px-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Creator</span>
        </button>

        <button
          onClick={() => handleDemoLogin('brand')}
          disabled={loading}
          className="py-2.5 px-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-white text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Brand</span>
        </button>

        <button
          onClick={() => handleDemoLogin('agency')}
          disabled={loading}
          className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agency</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start space-x-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-left shadow-md mt-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-normal">{error}</span>
        </div>
      )}
    </div>
  );
};
