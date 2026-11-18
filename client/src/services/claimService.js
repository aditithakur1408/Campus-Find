import api from './api';

export const claimService = {
  submitClaim: async (itemId, data) => {
    const response = await api.post(`/claims/items/${itemId}`, data);
    return response.data;
  },

  getClaimsForItem: async (itemId) => {
    const response = await api.get(`/claims/items/${itemId}`);
    return response.data;
  },

  updateClaimStatus: async (claimId, status) => {
    const response = await api.put(`/claims/${claimId}/status`, { status });
    return response.data;
  },

  verifyHandover: async (itemId, otp) => {
    const response = await api.post(`/claims/items/${itemId}/verify-handover`, { otp });
    return response.data;
  },
};
