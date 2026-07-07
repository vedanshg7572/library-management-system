import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login state on load
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('lib_token');
      if (token) {
        try {
          // Fetch fresh user data from server
          const res = await API.get('/auth/me');
          const userData = {
            id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            createdAt: res.data.createdAt
          };
          localStorage.setItem('lib_user', JSON.stringify(userData));
          setUser(userData);
        } catch (error) {
          console.error('Failed to verify token:', error);
          // Clear invalid credentials
          localStorage.removeItem('lib_token');
          localStorage.removeItem('lib_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLogin();
  }, []);

  // Signup API Call
  const signup = async (name, email, password, role = 'student', adminCode = '') => {
    setLoading(true);
    try {
      const res = await API.post('/auth/signup', {
        name,
        email,
        password,
        role,
        adminCode
      });
      
      const data = res.data;
      const userData = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt
      };

      localStorage.setItem('lib_token', data.token);
      localStorage.setItem('lib_user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  // Login API Call
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      
      const data = res.data;
      const userData = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt
      };

      localStorage.setItem('lib_token', data.token);
      localStorage.setItem('lib_user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Logout API Call
  const logout = () => {
    localStorage.removeItem('lib_token');
    localStorage.removeItem('lib_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
