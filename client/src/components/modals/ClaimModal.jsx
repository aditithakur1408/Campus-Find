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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191712]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-[#fbf6e6] rounded-[255px_14px_225px_16px/16px_225px_14px_255px] max-w-lg w-full border-[2.5px] border-[#191712] shadow-[6px_8px_0_#191712] overflow-hidden">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-7 pb-3 border-b-2 border-dashed border-[#191712]/30 flex items-center justify-between">
          <div>
            <h2 className="font-hand font-bold text-3xl text-[#191712]">Submit Ownership Proof</h2>
            <p className="font-type text-[11px] text-[#eb4d4b] uppercase tracking-wider font-bold">
              [CLAIM FOR: "{item.title}"]
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffd32a] transition-colors"
          >
            <X className="w-5 h-5 text-[#191712]" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#ff7979] border-2 border-[#191712] font-neat text-lg text-[#191712] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#eb4d4b] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Question Prompt */}
          {item.proofQuestion ? (
            <div className="p-4 rounded-2xl bg-[#ffd32a] border-2 border-[#191712] shadow-[3px_3px_0_#191712]">
              <p className="font-type text-xs text-[#5d5744] uppercase font-bold">Verification Question from Finder:</p>
              <p className="font-hand font-bold text-2xl text-[#191712] mt-1 italic">"{item.proofQuestion}"</p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#70a1ff] border-2 border-[#191712] font-neat text-lg text-[#191712] shadow-[3px_3px_0_#191712]">
              Please describe unique details or identifying marks only the real owner would know.
            </div>
          )}

          <div>
            <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1 font-bold">
              Your Proof Answer *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. The wallpaper is a photo of a mountain, and the sticker on top-right is GitHub octocat."
              value={proofAnswer}
              onChange={(e) => setProofAnswer(e.target.value)}
              className="w-full px-3.5 py-2 text-xl rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
            />
          </div>

          <div>
            <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1 font-bold">
              Additional Details / Serial Number / Note
            </label>
            <input
              type="text"
              placeholder="Optional notes or contact preference"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="w-full px-3.5 py-2 text-xl rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="sketch-button w-full !text-2xl !py-2.5 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? 'Submitting Claim...' : 'Submit Proof to Finder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
