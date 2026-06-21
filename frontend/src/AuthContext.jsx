import { createContext, useState, useEffect } from 'react';
import api from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const signup = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.signup(username, email, password);
      if (data.error) {
        setError(data.error);
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (err) {
      setError('Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      if (data.error) {
        setError(data.error);
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (err) {
      setError('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
