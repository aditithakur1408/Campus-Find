import React, { useState } from 'react';
import { X, Shield, AlertTriangle, Send } from 'lucide-react';
import api from '../../services/api';

export default function ClaimModal({ isOpen, onClose, item, onClaimSubmitted }) {
  const [proofAnswer, setProofAnswer] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post(`/claims/items/${item.id}`, {
        proofAnswer,
        additionalDetails,
      });

      if (res.data?.success) {
        onClaimSubmitted(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181b]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-lg w-full border-2 border-[#18181b] shadow-[6px_6px_0_#18181b] overflow-hidden">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-6 pb-3 border-b border-dashed border-[#18181b]/20 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#18181b]">Submit Ownership Proof</h2>
            <p className="font-type text-[11px] text-[#b91c1c] uppercase tracking-wider font-bold">
              [CLAIM FOR: "{item.title}"]
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border-2 border-[#18181b] bg-white hover:bg-[#f1ede4] transition-colors"
          >
            <X className="w-4 h-4 text-[#18181b]" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#fee2e2] border-2 border-[#18181b] font-sans text-sm text-[#991b1b] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#b91c1c] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Question Prompt */}
          {item.proofQuestion ? (
            <div className="p-4 rounded-xl bg-[#fef3c7] border-2 border-[#18181b] shadow-[3px_3px_0_#18181b]">
              <p className="font-type text-xs text-[#92400e] uppercase font-bold">Verification Question from Finder:</p>
              <p className="font-sans font-bold text-base text-[#78350f] mt-1 italic">"{item.proofQuestion}"</p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#e0e7ff] border-2 border-[#18181b] font-sans text-sm text-[#1e1b4b] shadow-[3px_3px_0_#18181b]">
              Please describe unique details or identifying marks only the real owner would know.
            </div>
          )}

          <div>
            <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">
              Your Proof Answer *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. The wallpaper is a photo of a mountain, and the sticker on top-right is GitHub octocat."
              value={proofAnswer}
              onChange={(e) => setProofAnswer(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
            />
          </div>

          <div>
            <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">
              Additional Details / Serial Number / Note
            </label>
            <input
              type="text"
              placeholder="Optional notes or contact preference"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="sketch-button w-full text-base !py-2.5 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Claim...' : 'Send Claim for Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
