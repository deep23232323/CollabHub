import React, { useState } from 'react';
import { Creator, Offer, Contract, EscrowTransaction } from '../types';
import { DollarSign, MessageSquare, FileText, Sparkles, TrendingUp, ShieldCheck, CheckCircle2, Instagram, Link2, ExternalLink, RefreshCw, Youtube, Video } from 'lucide-react';

interface CreatorDashboardProps {
  creator: Creator;
  offers: Offer[];
  contracts: Contract[];
  escrowList: EscrowTransaction[];
  onOpenOfferChat: (offer: Offer) => void;
  onOpenContentInspector: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  creator,
  offers,
  contracts,
  escrowList,
  onOpenOfferChat,
  onOpenContentInspector
}) => {
  const myOffers = offers.filter(o => o.creatorId === creator.id || o.creatorName === creator.name);
  const pendingPayouts = escrowList.reduce((sum, e) => sum + e.amount, 0);

  const [isConnecting, setIsConnecting] = useState(false);

  // Instagram Connection Trigger
  const handleConnectInstagram = async () => {
    try {
      setIsConnecting(true);
      
      // Fetch OAuth URL from backend server
      const redirectUri = `${window.location.origin}/instagram-callback`;
      const res = await fetch(`/api/instagram/auth-url?redirectUri=${encodeURIComponent(redirectUri)}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Redirect to Instagram OAuth Authorization
          window.location.href = data.url;
          return;
        }
      }

      // Direct Fallback OAuth Authorize URL
      const appId = '1762360358516003';
      const scopes = 'instagram_business_basic,instagram_business_manage_insights';
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
      
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating Instagram connection:', err);
      // Fallback direct navigate
      window.location.href = `https://api.instagram.com/oauth/authorize?client_id=1762360358516003&redirect_uri=${encodeURIComponent(window.location.origin + '/instagram-callback')}&scope=instagram_business_basic,instagram_business_manage_insights&response_type=code`;
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Creator Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src={creator.avatar} alt={creator.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{creator.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Creator Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{creator.handle} • {creator.niche.join(', ')}</p>
          </div>
        </div>

        <button
          onClick={onOpenContentInspector}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>AI Content Inspector</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Total Subscribers</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{(creator.totalFollowers / 1000).toFixed(0)}K</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+4.2% this month</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Incoming Offers</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{myOffers.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Brand sponsorship deals</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Escrow Payout</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">${pendingPayouts.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Guaranteed upon deliverable</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Authenticity Score</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{creator.authenticityScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Verified organic audience</div>
        </div>
      </div>

      {/* Instagram Social Account Connection Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
        
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-rose-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-base text-white">Instagram Account Connection</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Sync</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connected via Instagram Business Graph API • App ID: <span className="font-mono text-slate-300">1762360358516003</span>
                </p>
              </div>
            </div>

            {/* Social Account Profile Summary */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Connected Profile</span>
                <span className="font-bold text-white flex items-center space-x-1 mt-0.5">
                  <Instagram className="w-3.5 h-3.5 text-rose-400" />
                  <span>{creator.handle}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Account Type</span>
                <span className="font-bold text-rose-300 mt-0.5 block">Business / Creator</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Followers</span>
                <span className="font-bold text-white mt-0.5 block">{(creator.totalFollowers / 1000).toFixed(0)}K</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Authenticity</span>
                <span className="font-bold text-purple-300 mt-0.5 block">{creator.authenticityScore}% Verified</span>
              </div>
            </div>

            {/* Configured Scopes & Firestore path info */}
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                instagram_business_basic
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                instagram_business_manage_insights
              </span>
              <span className="text-slate-500 text-[10px]">
                → Firestore: <code className="text-slate-300">influencers/{creator.id}/socialAccounts/instagram</code>
              </span>
            </div>
          </div>

          {/* Connect / Re-Sync Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={handleConnectInstagram}
              disabled={isConnecting}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:via-rose-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {isConnecting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
              <span>Connect / Re-sync Instagram</span>
            </button>

            <a
              href={`https://influencer-marketing-platform.ai.studio/instagram-callback`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold text-center border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>View Callback Endpoint</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Future Integrations Teaser */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next Platform Connections:</span>
          </span>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube Data v3</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>TikTok Display Kit</span>
            </span>
          </div>
        </div>

      </div>

      {/* Incoming Offers Stream */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>My Sponsorship Offers & Counter-Offers</span>
        </h3>

        <div className="space-y-3">
          {myOffers.map((off) => (
            <div
              key={off.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center space-x-3">
                <img src={off.brandLogo} alt={off.brandName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-slate-900">{off.brandName}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {off.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{off.campaignTitle}</p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-600 mt-1 font-mono">
                    <span>Offer Amount: <strong className="text-emerald-600">${off.amount}</strong></span>
                    <span>•</span>
                    <span>Deliverables: <strong>{off.deliverables.join(', ')}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenOfferChat(off)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Open Negotiation Chat
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

