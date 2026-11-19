import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Shield, Sparkles, Key } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ItemDetailModal({ isOpen, onClose, item, onOpenClaim, onRefresh }) {
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [otpMessage, setOtpMessage] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (item?.id && isOpen) {
      fetchItemDetails(item.id);
      fetchMatches(item.id);
    }
  }, [item?.id, isOpen]);

  const fetchItemDetails = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/items/${id}`);
      if (res.data?.data) {
        setDetails(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (id) => {
    try {
      const res = await api.get(`/items/${id}/matches`);
      if (res.data?.data) {
        setMatches(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateClaim = async (claimId, status) => {
    try {
      const res = await api.put(`/claims/${claimId}/status`, { status });
      if (res.data?.success) {
        if (res.data.data?.handoverOtp) {
          setOtpMessage(`Claim Approved! Handover Code is: ${res.data.data.handoverOtp}. The claimant has also received this code.`);
        }
        fetchItemDetails(item.id);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating claim.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError(null);
    setOtpMessage(null);

    try {
      const res = await api.post(`/claims/items/${item.id}/verify-handover`, { otp: otpInput });
      if (res.data?.success) {
        setOtpMessage('Handover successfully confirmed! Item marked as RESOLVED & RETURNED.');
        setOtpInput('');
        fetchItemDetails(item.id);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid handover code.');
    }
  };

  if (!isOpen || !item) return null;

  const isOwner = user && details?.userId === user.id;
  const isSecurity = user?.role === 'SECURITY_STAFF' || user?.role === 'ADMIN';
  const isFound = item.itemType === 'FOUND';
  const hasUserClaimed = user && details?.claims?.some((c) => c.claimantId === user.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181b]/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border-2 border-[#18181b] shadow-[6px_6px_0_#18181b] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-6 pb-3 border-b border-dashed border-[#18181b]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`stamp-badge ${
                isFound ? 'bg-[#dcfce7] text-[#166534] border-[#4ade80]' : 'bg-[#fee2e2] text-[#991b1b] border-[#f87171]'
              }`}
            >
              {item.itemType} NOTICE
            </span>
            <span className="font-sans font-semibold text-sm text-[#52525b]">
              · {item.category?.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border-2 border-[#18181b] bg-white hover:bg-[#f1ede4] transition-colors"
          >
            <X className="w-4 h-4 text-[#18181b]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main Title & Stamp */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#18181b] leading-tight">
                {item.title}
              </h2>
              {item.status === 'RESOLVED' && (
                <span className="shrink-0 stamp-badge bg-[#18181b] text-white text-xs py-1">
                  HANDED OVER
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-3 font-type text-xs text-[#52525b]">
              <div className="flex items-center gap-1.5 bg-[#f8f6f0] px-2.5 py-1 rounded-lg border border-[#18181b]/30">
                <MapPin className="w-3.5 h-3.5 text-[#b91c1c]" />
                <span>{item.location?.buildingName} — {item.location?.zoneFloor}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f8f6f0] px-2.5 py-1 rounded-lg border border-[#18181b]/30">
                <Calendar className="w-3.5 h-3.5 text-[#18181b]" />
                <span>{new Date(item.incidentDate).toLocaleDateString()}</span>
              </div>
              {item.brandColor && (
                <div className="flex items-center gap-1.5 bg-[#f8f6f0] px-2.5 py-1 rounded-lg border border-[#18181b]/30">
                  <span>COLOR: {item.brandColor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          {item.images && item.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {item.images.map((img) => (
                <div key={img.id} className="aspect-video rounded-xl overflow-hidden border-2 border-[#18181b] shadow-[3px_3px_0_#18181b] bg-[#f8f6f0]">
                  <img src={img.imageUrl} alt="Item attachment" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-[#f8f6f0] rounded-xl p-4 border border-[#18181b]/20 shadow-[2px_2px_0_rgba(24,24,27,0.06)]">
            <h4 className="font-type text-xs text-[#b91c1c] uppercase tracking-wider mb-1 font-bold">
              [NOTICE DETAILS]
            </h4>
            <p className="font-sans text-sm text-[#18181b] leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Custody Info */}
          {isFound && (
            <div className="p-4 rounded-xl bg-[#e0e7ff] border-2 border-[#18181b] flex items-center justify-between shadow-[3px_3px_0_#18181b]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border-2 border-[#18181b] bg-white flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[#3730a3]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#1e1b4b] leading-none">
                    Custody & Handover Station
                  </h4>
                  <p className="font-sans text-xs text-[#3730a3] mt-1">
                    {item.custodyType === 'AT_SECURITY_DESK'
                      ? 'Deposited at Central Campus Security Desk for safe custody.'
                      : 'Currently held with the finder on campus.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Anti-Fraud Proof Question Notice */}
          {isFound && item.proofQuestion && (
            <div className="p-4 rounded-xl bg-[#fef3c7] border-2 border-[#18181b] shadow-[3px_3px_0_#18181b]">
              <div className="flex items-center gap-2 text-[#92400e] font-sans font-bold text-sm mb-1">
                <Shield className="w-4 h-4 text-[#b45309]" />
                <span>Finder's Secret Verification Question:</span>
              </div>
              <p className="font-sans font-bold text-base text-[#78350f] italic">"{item.proofQuestion}"</p>
              <p className="font-type text-[11px] text-[#92400e] mt-1">
                To claim this item, you must submit a claim answering this question accurately.
              </p>
            </div>
          )}

          {/* Owner / Staff Verification Management Section */}
          {(isOwner || isSecurity) && (
            <div className="border-t border-dashed border-[#18181b]/20 pt-5 space-y-4">
              <h3 className="font-display font-bold text-xl text-[#18181b] flex items-center gap-2">
                <Key className="w-5 h-5 text-[#b91c1c]" />
                <span>Claims & Handover Verification</span>
              </h3>

              {otpMessage && (
                <div className="p-3 bg-[#dcfce7] border-2 border-[#18181b] font-sans text-sm text-[#166534] rounded-xl shadow-[2px_2px_0_#18181b]">
                  {otpMessage}
                </div>
              )}

              {otpError && (
                <div className="p-3 bg-[#fee2e2] border-2 border-[#18181b] font-sans text-sm text-[#991b1b] rounded-xl shadow-[2px_2px_0_#18181b]">
                  {otpError}
                </div>
              )}

              {/* Handover OTP Verification Form */}
              {item.status !== 'RESOLVED' && (
                <form onSubmit={handleVerifyOtp} className="p-4 rounded-xl bg-[#f8f6f0] border-2 border-[#18181b] flex flex-col sm:flex-row items-center gap-3 shadow-[3px_3px_0_#18181b]">
                  <div className="flex-1 w-full">
                    <label className="block font-type text-xs text-[#52525b] uppercase mb-1">
                      In-Person Handover PIN (Claimant's 6-digit OTP):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 849201"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full px-3 py-2 font-type tracking-widest text-lg rounded-xl border-2 border-[#18181b] bg-white text-[#18181b]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sketch-button text-sm !py-2 sm:mt-auto"
                  >
                    Confirm Handover
                  </button>
                </form>
              )}

              {/* Received Claims List */}
              <div className="space-y-3">
                <h4 className="font-type text-xs text-[#52525b] uppercase font-bold">
                  Received Claims ({details?.claims?.length || 0})
                </h4>
                {details?.claims?.length === 0 ? (
                  <p className="font-sans text-sm text-[#71717a] italic">No claims filed yet.</p>
                ) : (
                  details?.claims?.map((claim) => (
                    <div key={claim.id} className="p-4 rounded-xl border-2 border-[#18181b] bg-white shadow-[2px_3px_0_#18181b] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-base text-[#18181b]">{claim.claimant?.fullName}</span>
                        <span className="stamp-badge bg-[#fef3c7] text-[#92400e] border-[#fbbf24]">
                          {claim.claimStatus}
                        </span>
                      </div>

                      <div className="bg-[#f8f6f0] p-3 rounded-xl border border-[#18181b]/20">
                        <p className="font-type text-xs text-[#71717a]">Answer to Secret Question:</p>
                        <p className="font-sans text-sm text-[#18181b] font-medium mt-0.5">{claim.proofAnswer}</p>
                        {claim.additionalDetails && (
                          <p className="font-sans text-xs text-[#71717a] mt-1 italic">Note: {claim.additionalDetails}</p>
                        )}
                      </div>

                      {claim.claimStatus === 'PENDING' && item.status !== 'RESOLVED' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleUpdateClaim(claim.id, 'APPROVED')}
                            className="sketch-button text-xs !py-1.5 !px-3"
                          >
                            Approve & Generate OTP
                          </button>
                          <button
                            onClick={() => handleUpdateClaim(claim.id, 'REJECTED')}
                            className="sketch-button-secondary text-xs !py-1.5 !px-3"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Potential Matches */}
          {matches.length > 0 && (
            <div className="border-t border-dashed border-[#18181b]/20 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#b91c1c]" />
                <h4 className="font-display font-bold text-lg text-[#18181b]">
                  Possible Matching Belongings on Campus ({matches.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matches.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border-2 border-[#18181b] bg-[#f8f6f0] shadow-[2px_2px_0_#18181b] flex items-center justify-between">
                    <div>
                      <p className="font-sans font-bold text-sm text-[#18181b] line-clamp-1">{m.title}</p>
                      <p className="font-type text-[10px] text-[#71717a]">{m.location?.buildingName}</p>
                    </div>
                    <span className="stamp-badge bg-[#fef3c7] text-[#92400e] border-[#fbbf24]">
                      {m.itemType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t-2 border-[#18181b] bg-[#f8f6f0] flex items-center justify-between shrink-0">
          <div className="font-type text-xs text-[#71717a]">
            PINNED BY: <strong className="text-[#18181b]">{details?.user?.fullName || 'Campus Member'}</strong>
          </div>

          {!isOwner && isFound && item.status !== 'RESOLVED' && (
            <button
              onClick={() => {
                onClose();
                onOpenClaim(item);
              }}
              disabled={hasUserClaimed}
              className="sketch-button text-sm !py-2 !px-4"
            >
              {hasUserClaimed ? 'Claim Already Submitted' : 'Claim This Item'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
