import React, { useState, useEffect } from 'react';
import { UserRole, Creator, Campaign, Offer, Contract, EscrowTransaction, Message } from '../types';
import { Navbar } from './Navbar';
import { CreatorDirectory } from './CreatorDirectory';
import { CreatorProfileModal } from './CreatorProfileModal';
import { CreatorComparisonModal } from './CreatorComparisonModal';
import { AICreatorFinderModal } from './AICreatorFinderModal';
import { CampaignBuilderModal } from './CampaignBuilderModal';
import { NegotiationChatModal } from './NegotiationChatModal';
import { SmartContractModal } from './SmartContractModal';
import { ContentAnalyzerModal } from './ContentAnalyzerModal';
import { MultiPlatformAnalytics } from './MultiPlatformAnalytics';
import { BrandDashboard } from './BrandDashboard';
import { CreatorDashboard } from './CreatorDashboard';
import { AgencyDashboard } from './AgencyDashboard';
import { AdminDashboard } from './AdminDashboard';
import { EscrowView } from './EscrowView';
import { CollabPostsView } from './CollabPostsView';
import { UserProfilePage } from './UserProfilePage';
import { AuthUser } from './GoogleLoginButton';

export function DashboardContent() {
  const [currentRole, setCurrentRole] = useState<UserRole>('brand');
  const [activeTab, setActiveTab] = useState<string>('directory');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [escrowList, setEscrowList] = useState<EscrowTransaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Modals state
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [comparedCreators, setComparedCreators] = useState<Creator[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const [showAIMatchModal, setShowAIMatchModal] = useState<boolean>(false);
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [activeNegotiationOffer, setActiveNegotiationOffer] = useState<Offer | null>(null);
  const [activeContractModal, setActiveContractModal] = useState<Contract | null>(null);
  const [showContentInspectorModal, setShowContentInspectorModal] = useState<boolean>(false);

  const [authenticityResult, setAuthenticityResult] = useState<any>(null);
  const [loadingAuthCheck, setLoadingAuthCheck] = useState<boolean>(false);

  // Initial Data Fetching from Express Server
  useEffect(() => {
    fetchCreators();
    fetchCampaigns();
    fetchOffers();
    fetchContracts();
    fetchEscrow();
    fetchMessages();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await fetch('/api/creators');
      const data = await res.json();
      if (data.creators) setCreators(data.creators);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      setOffers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchContracts = async () => {
    try {
      const res = await fetch('/api/contracts');
      const data = await res.json();
      setContracts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEscrow = async () => {
    try {
      const res = await fetch('/api/escrow');
      const data = await res.json();
      setEscrowList(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Comparison toggle
  const handleToggleCompare = (creator: Creator) => {
    if (comparedCreators.some(c => c.id === creator.id)) {
      setComparedCreators(comparedCreators.filter(c => c.id !== creator.id));
    } else {
      if (comparedCreators.length >= 3) {
        alert('You can compare a maximum of 3 creators at once.');
        return;
      }
      setComparedCreators([...comparedCreators, creator]);
    }
  };

  // Run AI Fake Follower Check
  const handleRunAuthenticityCheck = async (creator: Creator) => {
    setLoadingAuthCheck(true);
    try {
      const res = await fetch('/api/ai/check-authenticity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId: creator.id })
      });
      const data = await res.json();
      setAuthenticityResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAuthCheck(false);
    }
  };

  // Create Campaign
  const handleCreateCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaignData,
          brandName: currentRole === 'brand' ? 'Nike' : 'Brand Client'
        })
      });
      const newCamp = await res.json();
      setCampaigns([newCamp, ...campaigns]);
    } catch (e) {
      console.error(e);
    }
  };

  // Send Direct Offer
  const handleSendOfferToCreator = async (creator: Creator) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaigns[0]?.id || 'camp1',
          campaignTitle: campaigns[0]?.title || 'Influencer Sponsorship Campaign',
          brandId: 'b1',
          brandName: 'Nike',
          brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
          creatorId: creator.id,
          creatorName: creator.name,
          creatorAvatar: creator.avatar,
          amount: creator.pricePerPost,
          deliverables: ['1 Dedicated Reel/Video', '1 Story Set']
        })
      });
      const newOffer = await res.json();
      setOffers([newOffer, ...offers]);
      setActiveNegotiationOffer(newOffer);
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  // Counter Offer
  const handleSubmitCounterOffer = async (offerId: string, amount: number, deliverables: string[], note: string) => {
    try {
      const res = await fetch('/api/offers/counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          senderRole: currentRole,
          amount,
          deliverables,
          note
        })
      });
      const updatedOffer = await res.json();
      setOffers(offers.map(o => o.id === offerId ? updatedOffer : o));
      if (activeNegotiationOffer?.id === offerId) {
        setActiveNegotiationOffer(updatedOffer);
      }
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  // Accept Offer
  const handleAcceptOffer = async (offerId: string) => {
    try {
      const res = await fetch('/api/offers/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId })
      });
      const data = await res.json();
      setOffers(offers.map(o => o.id === offerId ? data.offer : o));
      if (activeNegotiationOffer?.id === offerId) {
        setActiveNegotiationOffer(data.offer);
      }
      fetchContracts();
      fetchEscrow();
      fetchMessages();
      if (data.contract) {
        setActiveContractModal(data.contract);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sign Contract
  const handleSignContract = async (contractId: string, role: UserRole) => {
    try {
      const res = await fetch('/api/contracts/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, role })
      });
      const updatedContract = await res.json();
      setContracts(contracts.map(c => c.id === contractId ? updatedContract : c));
      if (activeContractModal?.id === contractId) {
        setActiveContractModal(updatedContract);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Release Escrow
  const handleReleaseEscrow = async (escrowId: string) => {
    try {
      const res = await fetch('/api/escrow/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escrowId })
      });
      const updatedTx = await res.json();
      setEscrowList(escrowList.map(e => e.id === escrowId ? updatedTx : e));
    } catch (e) {
      console.error(e);
    }
  };

  // Send Text Chat Message
  const handleSendTextMessage = async (text: string) => {
    if (!activeNegotiationOffer) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeNegotiationOffer.id,
          senderId: currentRole === 'brand' ? activeNegotiationOffer.brandId : activeNegotiationOffer.creatorId,
          senderName: currentRole === 'brand' ? activeNegotiationOffer.brandName : activeNegotiationOffer.creatorName,
          senderRole: currentRole,
          senderAvatar: currentRole === 'brand' ? activeNegotiationOffer.brandLogo : activeNegotiationOffer.creatorAvatar,
          text
        })
      });
      const newMsg = await res.json();
      setMessages([...messages, newMsg]);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMessagesForActiveOffer = activeNegotiationOffer
    ? messages.filter(m => m.conversationId === activeNegotiationOffer.id)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={messages.length}
        openAIMatchModal={() => setShowAIMatchModal(true)}
        openCampaignModal={() => setShowCampaignModal(true)}
        onAuthUserChange={setAuthUser}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab 1: Creator Directory */}
        {activeTab === 'directory' && (
          <CreatorDirectory
            creators={creators}
            onSelectCreator={(c) => setSelectedCreator(c)}
            onSendOffer={handleSendOfferToCreator}
            onCheckAuthenticity={handleRunAuthenticityCheck}
            comparedCreators={comparedCreators}
            onToggleCompare={handleToggleCompare}
            onOpenComparison={() => setShowComparisonModal(true)}
            openAIMatchModal={() => setShowAIMatchModal(true)}
          />
        )}

        {/* Tab 2: Creator Collab Hub & Inquiries */}
        {activeTab === 'collab' && (
          <CollabPostsView
            creators={creators}
            currentCreator={creators[0]}
            onOpenOfferChat={(o) => setActiveNegotiationOffer(o)}
          />
        )}

        {/* Tab 2: Campaigns & Dashboard */}
        {activeTab === 'campaigns' && (
          currentRole === 'brand' ? (
            <BrandDashboard
              campaigns={campaigns}
              offers={offers}
              escrowList={escrowList}
              creators={creators}
              openCampaignModal={() => setShowCampaignModal(true)}
              openAIMatchModal={() => setShowAIMatchModal(true)}
              onOpenOfferChat={(o) => setActiveNegotiationOffer(o)}
              onOpenCreatorDirectory={() => setActiveTab('directory')}
            />
          ) : currentRole === 'creator' ? (
            <CreatorDashboard
              creator={creators[0] || {} as Creator}
              offers={offers}
              contracts={contracts}
              escrowList={escrowList}
              onOpenOfferChat={(o) => setActiveNegotiationOffer(o)}
              onOpenContentInspector={() => setShowContentInspectorModal(true)}
            />
          ) : currentRole === 'agency' ? (
            <AgencyDashboard
              creators={creators}
              offers={offers}
              onSelectCreator={(c) => setSelectedCreator(c)}
            />
          ) : (
            <AdminDashboard
              creators={creators}
              campaigns={campaigns}
              offers={offers}
              contracts={contracts}
              escrowList={escrowList}
            />
          )
        )}

        {/* Tab 3: Smart Contracts */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl font-extrabold text-slate-900">DocuSign Smart Contracts Registry</h1>
              <p className="text-xs text-slate-500 mt-1">Review legal terms, digital signatures, and automated escrow locking.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contracts.map((cnt) => (
                <div key={cnt.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">{cnt.campaignTitle}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      cnt.status === 'fully_signed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {cnt.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 font-mono">
                    <div>Brand: <strong className="text-slate-900">{cnt.brandName}</strong> ({cnt.brandSigned ? 'Signed' : 'Pending'})</div>
                    <div>Creator: <strong className="text-slate-900">{cnt.creatorName}</strong> ({cnt.creatorSigned ? 'Signed' : 'Pending'})</div>
                    <div>Compensation: <strong className="text-emerald-600">${cnt.amount}</strong></div>
                  </div>

                  <button
                    onClick={() => setActiveContractModal(cnt)}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    View & Sign Agreement
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Multi-Platform Social Blade Analytics */}
        {activeTab === 'analytics' && (
          <MultiPlatformAnalytics creator={selectedCreator || creators[0] || {} as Creator} />
        )}

        {/* Tab 5: Negotiation Chat & Offers */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl font-extrabold text-slate-900">Active Offer Conversations</h1>
              <p className="text-xs text-slate-500 mt-1">Upwork-style proposal negotiations, counter-offers, and real-time messaging.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((off) => (
                <div key={off.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{off.campaignTitle}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      ${off.amount}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Between <strong className="text-slate-800">{off.brandName}</strong> & <strong className="text-slate-800">{off.creatorName}</strong>
                  </div>

                  <button
                    onClick={() => setActiveNegotiationOffer(off)}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Open Negotiation Room
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Escrow Vault */}
        {activeTab === 'escrow' && (
          <EscrowView
            escrowList={escrowList}
            currentRole={currentRole}
            onReleaseEscrow={handleReleaseEscrow}
          />
        )}

        {/* Tab 7: My Profile */}
        {activeTab === 'profile' && (
          <UserProfilePage />
        )}

      </main>

      {/* MODALS */}
      
      {/* 1. Creator Profile Modal */}
      {selectedCreator && (
        <CreatorProfileModal
          creator={selectedCreator}
          onClose={() => {
            setSelectedCreator(null);
            setAuthenticityResult(null);
          }}
          onSendOffer={handleSendOfferToCreator}
          onRunAuthenticityCheck={handleRunAuthenticityCheck}
          authenticityResult={authenticityResult}
          loadingAuthCheck={loadingAuthCheck}
        />
      )}

      {/* 2. Creator Comparison Modal */}
      {showComparisonModal && (
        <CreatorComparisonModal
          creators={comparedCreators}
          onClose={() => setShowComparisonModal(false)}
          onSendOffer={handleSendOfferToCreator}
          onRemoveFromCompare={(c) => setComparedCreators(comparedCreators.filter(item => item.id !== c.id))}
        />
      )}

      {/* 3. AI Creator Finder Modal */}
      {showAIMatchModal && (
        <AICreatorFinderModal
          creators={creators}
          onClose={() => setShowAIMatchModal(false)}
          onSendOffer={handleSendOfferToCreator}
        />
      )}

      {/* 4. Campaign Builder Modal */}
      {showCampaignModal && (
        <CampaignBuilderModal
          onClose={() => setShowCampaignModal(false)}
          onCreateCampaign={handleCreateCampaign}
        />
      )}

      {/* 5. Negotiation Chat Modal */}
      {activeNegotiationOffer && (
        <NegotiationChatModal
          offer={activeNegotiationOffer}
          messages={filteredMessagesForActiveOffer}
          currentRole={currentRole}
          onClose={() => setActiveNegotiationOffer(null)}
          onSendTextMessage={handleSendTextMessage}
          onSubmitCounterOffer={handleSubmitCounterOffer}
          onAcceptOffer={handleAcceptOffer}
          onViewContract={(cid) => {
            const cnt = contracts.find(c => c.id === cid);
            if (cnt) setActiveContractModal(cnt);
          }}
          contracts={contracts}
        />
      )}

      {/* 6. Smart Contract Modal */}
      {activeContractModal && (
        <SmartContractModal
          contract={activeContractModal}
          currentRole={currentRole}
          onClose={() => setActiveContractModal(null)}
          onSignContract={handleSignContract}
        />
      )}

      {/* 7. Content Analyzer Modal */}
      {showContentInspectorModal && (
        <ContentAnalyzerModal
          onClose={() => setShowContentInspectorModal(false)}
        />
      )}

    </div>
  );
}
