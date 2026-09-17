import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/api/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    
    // Fetch user details
    const userRes = await API.get('/api/auth/me');
    setUser(userRes.data);
  };

  const signup = async (name, email, password) => {
    const res = await API.post('/api/auth/signup', { name, email, password });
    localStorage.setItem('token', res.data.access_token);
    
    const userRes = await API.get('/api/auth/me');
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

