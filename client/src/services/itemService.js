import api from './api';

export const itemService = {
  getItems: async (params) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  createItem: async (formData) => {
    const response = await api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMatches: async (id) => {
    const response = await api.get(`/items/${id}/matches`);
    return response.data;
  },
};
