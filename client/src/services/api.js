import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusfind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear local storage
      if (localStorage.getItem('campusfind_token')) {
        localStorage.removeItem('campusfind_token');
        localStorage.removeItem('campusfind_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
