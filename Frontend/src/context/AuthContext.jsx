import { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { api } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => Cookies.get('accessToken') || null);
  const [loading, setLoading] = useState(true);

  // JWT helper to decode role and id (kept for compatibility if needed, but not strictly required)
  const decodeToken = (t) => {
    try {
      const base64Url = t.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = Cookies.get('accessToken');
      if (storedToken) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
          setToken(storedToken);
        } catch (err) {
          console.error('Failed to load profile on start:', err);
          localStorage.removeItem('user');
          Cookies.remove('accessToken');
          setUser(null);
          setToken(null);
        }
      } else {
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      // res contains { message, token, user }
      
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      Cookies.set('accessToken', res.token, { expires: 7 });

      return res.user;
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
    localStorage.removeItem('user');
    Cookies.remove('accessToken');
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
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
