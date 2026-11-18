import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('campusfind_user');
    const token = localStorage.getItem('campusfind_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify with backend
        api.get('/auth/me')
          .then((res) => {
            if (res.data?.data) {
              setUser(res.data.data);
              localStorage.setItem('campusfind_user', JSON.stringify(res.data.data));
            }
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('campusfind_token', token);
    localStorage.setItem('campusfind_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('campusfind_token');
    localStorage.removeItem('campusfind_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
