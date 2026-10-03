import React, { useState } from 'react';
import { Offer, Message, UserRole, Contract } from '../types';
import { 
  X, 
  Send, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRightLeft, 
  Sparkles,
  Paperclip
} from 'lucide-react';

interface NegotiationChatModalProps {
  offer: Offer | null;
  messages: Message[];
  currentRole: UserRole;
  onClose: () => void;
  onSendTextMessage: (text: string) => void;
  onSubmitCounterOffer: (offerId: string, amount: number, deliverables: string[], note: string) => void;
  onAcceptOffer: (offerId: string) => void;
  onViewContract: (contractId: string) => void;
  contracts: Contract[];
}

export const NegotiationChatModal: React.FC<NegotiationChatModalProps> = ({
  offer,
  messages,
  currentRole,
  onClose,
  onSendTextMessage,
  onSubmitCounterOffer,
  onAcceptOffer,
  onViewContract,
  contracts
}) => {
  if (!offer) return null;

  const [messageText, setMessageText] = useState('');
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterAmount, setCounterAmount] = useState(offer.amount);
  const [counterDeliverablesText, setCounterDeliverablesText] = useState(offer.deliverables.join(', '));
  const [counterNote, setCounterNote] = useState('');

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onSendTextMessage(messageText);
    setMessageText('');
  };

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deliverables = counterDeliverablesText.split(',').map(s => s.trim()).filter(Boolean);
    onSubmitCounterOffer(offer.id, counterAmount, deliverables, counterNote);
    setShowCounterForm(false);
  };

  const associatedContract = contracts.find(c => c.offerId === offer.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-xl relative text-slate-900">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <img
              src={currentRole === 'brand' ? offer.creatorAvatar : offer.brandLogo}
              alt="Avatar"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-slate-900">
                  {currentRole === 'brand' ? offer.creatorName : offer.brandName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Status: {offer.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500">Campaign: {offer.campaignTitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {associatedContract && (
              <button
                onClick={() => onViewContract(associatedContract.id)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>View Smart Contract</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Offer Status Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-slate-500">Active Offer Amount:</span>
              <span className="font-extrabold text-emerald-600 ml-1.5 text-sm">${offer.amount}</span>
            </div>
            <div>
              <span className="text-slate-500">Deliverables:</span>
              <span className="font-semibold text-slate-800 ml-1.5">{offer.deliverables.join(' • ')}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {offer.status !== 'accepted' && offer.status !== 'contract_generated' && (
              <>
                <button
                  onClick={() => setShowCounterForm(!showCounterForm)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold"
                >
                  {showCounterForm ? 'Cancel Counter' : 'Counter Offer'}
                </button>

                <button
                  onClick={() => onAcceptOffer(offer.id)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Accept Offer (${offer.amount})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Counter Offer Form Drawer */}
        {showCounterForm && (
          <form onSubmit={handleCounterSubmit} className="bg-slate-100 border-b border-slate-200 p-4 space-y-3 text-xs">
            <div className="font-bold text-slate-900 flex items-center space-x-1">
              <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              <span>Submit Upwork-Style Counter Offer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Counter Amount ($)</label>
                <input
                  type="number"
                  required
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Deliverables</label>
                <input
                  type="text"
                  required
                  value={counterDeliverablesText}
                  onChange={(e) => setCounterDeliverablesText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Negotiation Note</label>
              <input
                type="text"
                placeholder="Reason for price adjustment..."
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
              >
                Send Counter Offer
              </button>
            </div>
          </form>
        )}

        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isMe = m.senderRole === currentRole;

            return (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 max-w-xl ${isMe ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
              >
                <img src={m.senderAvatar} alt={m.senderName} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 mt-1" />
                <div className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 px-1">
                    <span className="font-bold text-slate-600">{m.senderName}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                  }`}>
                    {m.text}

                    {m.attachment?.type === 'contract' && associatedContract && (
                      <div className="mt-2.5 p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-900">
                        <div className="flex items-center space-x-2 text-purple-700 font-semibold">
                          <FileText className="w-4 h-4" />
                          <span>{m.attachment.title}</span>
                        </div>
                        <button
                          onClick={() => onViewContract(associatedContract.id)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]"
                        >
                          View & Sign
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendText} className="p-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-3 rounded-b-2xl">
          <input
            type="text"
            placeholder="Type message or ask for clarification..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
};
