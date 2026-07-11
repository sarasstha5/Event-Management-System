import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // JWT helper to decode role and id
  const decodeToken = (t) => {
    try {
      const base64Url = t.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await api.getProfile();
          // Profile returns user object from DB (which includes role)
          setUser(profile);
          setToken(storedToken);
        } catch (err) {
          console.error('Failed to load profile on start:', err);
          // Token might be invalid or expired
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      // res contains { message, token, user }
      localStorage.setItem('token', res.token);
      setToken(res.token);

      // Decoded token contains role and user_id
      const decoded = decodeToken(res.token);
      
      // Let's get full profile to ensure all fields are loaded in local state
      const profile = await api.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      throw err;
    }
  };

  const register = async (fullname, email, phone, password) => {
    try {
      const res = await api.register(fullname, email, phone, password);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
