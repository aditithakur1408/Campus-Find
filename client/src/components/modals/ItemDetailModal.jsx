import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Shield, Sparkles, Key, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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
  const myClaim = user && !isOwner && !isSecurity ? details?.claims?.find((c) => c.claimantId === user.id) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191712]/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-[#fbf6e6] rounded-[255px_14px_225px_16px/16px_225px_14px_255px] max-w-2xl w-full border-[2.5px] border-[#191712] shadow-[6px_8px_0_#191712] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-7 pb-3 border-b-2 border-dashed border-[#191712]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`stamp-badge ${
                isFound ? 'bg-[#b8ecd0] text-[#191712]' : 'bg-[#ffc9dc] text-[#d9584d] border-[#d9584d]'
              }`}
            >
              {item.itemType} NOTICE
            </span>
            <span className="font-hand font-bold text-xl text-[#5d5744]">
              · {item.category?.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffe45e] transition-colors"
          >
            <X className="w-5 h-5 text-[#191712]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main Title & Stamp */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-hand font-bold text-4xl sm:text-5xl text-[#191712] leading-tight">
                {item.title}
              </h2>
              {item.status === 'RESOLVED' && (
                <span className="shrink-0 stamp-badge bg-[#191712] text-[#fbf6e6] text-xs py-1">
                  HANDED OVER
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 font-type text-xs text-[#5d5744]">
              <div className="flex items-center gap-1.5 bg-[#f2ead4] px-3 py-1 rounded-lg border border-[#191712]">
                <MapPin className="w-3.5 h-3.5 text-[#d9584d]" />
                <span>{item.location?.buildingName} — {item.location?.zoneFloor}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f2ead4] px-3 py-1 rounded-lg border border-[#191712]">
                <Calendar className="w-3.5 h-3.5 text-[#191712]" />
                <span>{new Date(item.incidentDate).toLocaleDateString()}</span>
              </div>
              {item.brandColor && (
                <div className="flex items-center gap-1.5 bg-[#f2ead4] px-3 py-1 rounded-lg border border-[#191712]">
                  <span>COLOR: {item.brandColor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          {item.images && item.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {item.images.map((img) => (
                <div key={img.id} className="aspect-video rounded-xl overflow-hidden border-2 border-[#191712] shadow-[3px_3px_0_#191712] bg-[#f2ead4]">
                  <img src={img.imageUrl} alt="Item attachment" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-[#f2ead4] rounded-2xl p-4 border-2 border-[#191712] shadow-[3px_3px_0_rgba(25,23,18,0.1)]">
            <h4 className="font-type text-xs text-[#d9584d] uppercase tracking-wider mb-1">
              [NOTICE DETAILS]
            </h4>
            <p className="font-neat text-xl text-[#191712] leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Custody Info */}
          {isFound && (
            <div className="p-4 rounded-2xl bg-[#c2e5f7] border-2 border-[#191712] flex items-center justify-between shadow-[3px_3px_0_#191712]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#191712] bg-[#ffe45e] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#191712]" />
                </div>
                <div>
                  <h4 className="font-hand font-bold text-2xl text-[#191712] leading-none">
                    Custody & Handover Station
                  </h4>
                  <p className="font-neat text-base text-[#5d5744] mt-0.5">
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
            <div className="p-4 rounded-2xl bg-[#ffe45e] border-2 border-[#191712] shadow-[3px_3px_0_#191712] transform -rotate-0.5">
              <div className="flex items-center gap-2 text-[#191712] font-hand font-bold text-xl mb-1">
                <Shield className="w-5 h-5 text-[#d9584d]" />
                <span>Finder's Secret Verification Question:</span>
              </div>
              <p className="font-hand font-bold text-2xl text-[#191712] italic">"{item.proofQuestion}"</p>
              <p className="font-type text-[11px] text-[#5d5744] mt-1">
                To claim this item, you must submit a claim answering this question accurately.
              </p>
            </div>
          )}

          {/* Claimant's Own Claim Status Section */}
          {myClaim && (
            <div className="border-t-2 border-dashed border-[#191712]/30 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-hand font-bold text-3xl text-[#191712] flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#d9584d]" />
                  <span>Your Claim Status</span>
                </h3>
                {myClaim.claimStatus === 'APPROVED' ? (
                  <span className="stamp-badge bg-[#b8ecd0] text-[#191712]">
                    CLAIM APPROVED
                  </span>
                ) : myClaim.claimStatus === 'REJECTED' ? (
                  <span className="stamp-badge bg-[#ffc9dc] text-[#d9584d] border-[#d9584d]">
                    CLAIM REJECTED
                  </span>
                ) : myClaim.claimStatus === 'COMPLETED' ? (
                  <span className="stamp-badge bg-[#191712] text-[#fbf6e6]">
                    HANDED OVER
                  </span>
                ) : (
                  <span className="stamp-badge bg-[#ffe45e] text-[#191712]">
                    UNDER REVIEW
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl border-2 border-[#191712] bg-[#fbf6e6] shadow-[2px_3px_0_#191712] space-y-2">
                <div className="bg-[#f2ead4] p-3 rounded-xl border border-[#191712]">
                  <p className="font-type text-xs text-[#5d5744]">Your Submitted Proof Answer:</p>
                  <p className="font-neat text-lg text-[#191712] mt-0.5">{myClaim.proofAnswer}</p>
                  {myClaim.additionalDetails && (
                    <p className="font-neat text-sm text-[#5d5744] mt-1 italic">Note: {myClaim.additionalDetails}</p>
                  )}
                </div>

                {myClaim.claimStatus === 'APPROVED' && item.status !== 'RESOLVED' && (
                  <div className="p-3.5 bg-[#b8ecd0] border-2 border-[#191712] rounded-xl shadow-[2px_2px_0_#191712] text-[#191712] space-y-1">
                    <p className="font-hand font-bold text-2xl flex items-center gap-1.5 text-[#191712]">
                      <CheckCircle className="w-5 h-5 text-[#2f6f46]" />
                      Claim Approved by Finder!
                    </p>
                    <p className="font-neat text-base text-[#191712]">
                      Meet in person at <strong>{item.custodyType === 'AT_SECURITY_DESK' ? 'Campus Security Desk' : 'the campus location with finder'}</strong> to complete the verification handover.
                    </p>
                  </div>
                )}

                {myClaim.claimStatus === 'PENDING' && (
                  <p className="font-neat text-base text-[#5d5744] flex items-center gap-1.5 italic">
                    <Clock className="w-4 h-4 text-[#5d5744]" />
                    Your ownership proof is under review by the finder. Check back shortly.
                  </p>
                )}

                {myClaim.claimStatus === 'REJECTED' && (
                  <p className="font-neat text-base text-[#d9584d] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#d9584d]" />
                    The finder was unable to verify ownership based on this answer.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Owner / Staff Verification Management Section */}
          {(isOwner || isSecurity) && (
            <div className="border-t-2 border-dashed border-[#191712]/30 pt-5 space-y-4">
              <h3 className="font-hand font-bold text-3xl text-[#191712] flex items-center gap-2">
                <Key className="w-6 h-6 text-[#d9584d]" />
                <span>Claims & Handover Verification</span>
              </h3>

              {otpMessage && (
                <div className="p-3 bg-[#b8ecd0] border-2 border-[#191712] font-neat text-lg text-[#191712] rounded-xl shadow-[2px_2px_0_#191712]">
                  {otpMessage}
                </div>
              )}

              {otpError && (
                <div className="p-3 bg-[#ffc9dc] border-2 border-[#191712] font-neat text-lg text-[#d9584d] rounded-xl shadow-[2px_2px_0_#191712]">
                  {otpError}
                </div>
              )}

              {/* Handover OTP Verification Form */}
              {item.status !== 'RESOLVED' && (
                <form onSubmit={handleVerifyOtp} className="p-4 rounded-2xl bg-[#f2ead4] border-2 border-[#191712] flex flex-col sm:flex-row items-center gap-3 shadow-[3px_3px_0_#191712]">
                  <div className="flex-1 w-full">
                    <label className="block font-type text-xs text-[#5d5744] uppercase mb-1">
                      In-Person Handover PIN (Claimant's 6-digit OTP):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 849201"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full px-3 py-2 font-type tracking-widest text-xl rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sketch-button !text-lg !py-2 sm:mt-auto"
                  >
                    Confirm Handover
                  </button>
                </form>
              )}

              {/* Received Claims List */}
              <div className="space-y-3">
                <h4 className="font-type text-xs text-[#5d5744] uppercase">
                  Received Claims ({details?.claims?.length || 0})
                </h4>
                {details?.claims?.length === 0 ? (
                  <p className="font-neat text-base text-[#5d5744] italic">No claims filed yet.</p>
                ) : (
                  details?.claims?.map((claim) => (
                    <div key={claim.id} className="p-4 rounded-2xl border-2 border-[#191712] bg-[#fbf6e6] shadow-[2px_3px_0_#191712] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-hand font-bold text-2xl text-[#191712]">{claim.claimant?.fullName}</span>
                        <span className="stamp-badge bg-[#ffe45e] text-[#191712]">
                          {claim.claimStatus}
                        </span>
                      </div>

                      <div className="bg-[#f2ead4] p-3 rounded-xl border border-[#191712]">
                        <p className="font-type text-xs text-[#5d5744]">Answer to Secret Question:</p>
                        <p className="font-neat text-lg text-[#191712] mt-0.5">{claim.proofAnswer}</p>
                        {claim.additionalDetails && (
                          <p className="font-neat text-sm text-[#5d5744] mt-1 italic">Note: {claim.additionalDetails}</p>
                        )}
                      </div>

                      {claim.claimStatus === 'PENDING' && item.status !== 'RESOLVED' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleUpdateClaim(claim.id, 'APPROVED')}
                            className="sketch-button !text-base !py-1 !px-3"
                          >
                            Approve & Generate OTP
                          </button>
                          <button
                            onClick={() => handleUpdateClaim(claim.id, 'REJECTED')}
                            className="sketch-button-secondary !text-base !py-1 !px-3"
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
            <div className="border-t-2 border-dashed border-[#191712]/30 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#d9584d]" />
                <h4 className="font-hand font-bold text-2xl text-[#191712]">
                  Possible Matching Belongings on Campus ({matches.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matches.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border-2 border-[#191712] bg-[#f2ead4] shadow-[2px_2px_0_#191712] flex items-center justify-between">
                    <div>
                      <p className="font-hand font-bold text-xl text-[#191712] line-clamp-1">{m.title}</p>
                      <p className="font-type text-[10px] text-[#5d5744]">{m.location?.buildingName}</p>
                    </div>
                    <span className="stamp-badge bg-[#ffe45e] text-[#191712]">
                      {m.itemType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t-2 border-[#191712] bg-[#f2ead4] flex items-center justify-between shrink-0">
          <div className="font-type text-xs text-[#5d5744]">
            PINNED BY: <strong className="text-[#191712]">{details?.user?.fullName || 'Campus Member'}</strong>
          </div>

          {item.status === 'RESOLVED' ? (
            <span className="font-hand font-bold text-2xl text-[#2f6f46] flex items-center gap-1.5">
              <CheckCircle className="w-6 h-6 text-[#2f6f46]" />
              Item Reunited with Owner
            </span>
          ) : !isOwner && isFound ? (
            <button
              onClick={() => {
                onClose();
                onOpenClaim(item);
              }}
              disabled={hasUserClaimed}
              className={`sketch-button !text-xl !py-2 !px-5 ${
                hasUserClaimed ? 'opacity-60 cursor-not-allowed !bg-[#5d5744]' : ''
              }`}
            >
              {hasUserClaimed ? 'Claim Already Submitted' : 'Claim This Item'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
