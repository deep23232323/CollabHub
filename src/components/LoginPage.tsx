import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLoginButton } from './GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserInState, checkAuth } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLoginSuccess = async (user: any) => {
    if (user) {
      updateUserInState(user);
      console.log(user)
      await checkAuth();
    }
    if (user && !user.onboardingCompleted) {
      navigate('/onboarding', { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Glowing Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Nav */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CreatorPulse
            </span>
            <span className="block text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              Enterprise Influencer Platform
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 my-auto">
        
        {/* Left Column: Platform Value Highlights */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>AI-Powered Creator & Brand Matchmaking</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Empowering Next-Gen <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Influencer Collaborations
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            Streamline brand deals, automated social verification, DocuSign-grade smart contracts, and escrow payment protection in one production platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { title: 'Official API Account Verification', desc: 'YouTube, Instagram & TikTok API checks' },
              { title: 'Escrow Payment Protection', desc: 'Automated milestone payout release' },
              { title: 'Smart Contract Generator', desc: 'DocuSign legal agreement e-signatures' },
              { title: 'Fake Follower Detection', desc: 'AI audience authenticity inspection' }
            ].map((feat, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xs">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{feat.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Google Login Box */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative space-y-6">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">Welcome Back</h2>
              <p className="text-xs text-slate-400">
                Sign in or create your account using Firebase Google Authentication.
              </p>
            </div>

            <div className="pt-2">
              <GoogleLoginButton onAuthChange={handleLoginSuccess} />
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
              <p className="text-[11px] text-slate-500 leading-normal">
                By continuing, you agree to CreatorPulse Terms of Service, Privacy Policy, and automated API social verification guidelines.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 z-10 gap-4">
        <div>© 2026 CreatorPulse Platform. All rights reserved.</div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Security & Escrow</a>
        </div>
      </footer>

    </div>
  );
};
