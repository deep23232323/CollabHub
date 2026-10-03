import React, { useState } from 'react';
import { Contract, UserRole } from '../types';
import { X, FileText, CheckCircle2, ShieldCheck, Download, Sparkles, PenTool } from 'lucide-react';

interface SmartContractModalProps {
  contract: Contract | null;
  currentRole: UserRole;
  onClose: () => void;
  onSignContract: (contractId: string, role: UserRole) => void;
}

export const SmartContractModal: React.FC<SmartContractModalProps> = ({
  contract,
  currentRole,
  onClose,
  onSignContract
}) => {
  if (!contract) return null;

  const [signatureName, setSignatureName] = useState(
    currentRole === 'brand' ? contract.brandName : contract.creatorName
  );
  const [signedSuccess, setSignedSuccess] = useState(false);

  const isSignedByMe = currentRole === 'brand' ? contract.brandSigned : contract.creatorSigned;

  const handleSign = () => {
    onSignContract(contract.id, currentRole);
    setSignedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl relative text-slate-900 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-900">Smart Legal Agreement (DocuSign Style)</h2>
                {contract.status === 'fully_signed' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Fully Executed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Binding agreement generated for "{contract.campaignTitle}".</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Paper Document Container */}
        <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 text-xs text-slate-700 font-mono leading-relaxed">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="font-extrabold text-sm text-slate-900 font-sans uppercase tracking-wider">
                Influencer Sponsorship Contract
              </div>
              <div className="text-[11px] text-slate-500">ID: {contract.id} • Date: {contract.generatedAt}</div>
            </div>

            <div className="text-right font-sans">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Escrow Value</div>
              <div className="text-lg font-extrabold text-emerald-600">${contract.amount}</div>
            </div>
          </div>

          <pre className="whitespace-pre-wrap font-mono text-slate-800 leading-relaxed text-xs">
            {contract.termsText}
          </pre>

          {/* Signature Block */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
            
            {/* Brand Signature */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Brand Signature</div>
              <div className="font-bold text-slate-900 text-sm">{contract.brandName}</div>
              
              {contract.brandSigned ? (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Signed on {contract.brandSignDate || 'Today'}</span>
                </div>
              ) : (
                <div className="text-xs text-amber-600 font-semibold">Awaiting Brand Signature</div>
              )}
            </div>

            {/* Creator Signature */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Creator Signature</div>
              <div className="font-bold text-slate-900 text-sm">{contract.creatorName}</div>
              
              {contract.creatorSigned ? (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Signed on {contract.creatorSignDate || 'Today'}</span>
                </div>
              ) : (
                <div className="text-xs text-amber-600 font-semibold">Awaiting Creator Signature</div>
              )}
            </div>

          </div>
        </div>

        {/* E-Signature Action Bar */}
        {!isSignedByMe ? (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Type Full Legal Name to Digital Sign:
              </label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full sm:w-72 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <button
              onClick={handleSign}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all"
            >
              <PenTool className="w-4 h-4" />
              <span>E-Sign Contract Legally</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-semibold text-emerald-700">
            You have successfully e-signed this agreement.
          </div>
        )}

      </div>
    </div>
  );
};
