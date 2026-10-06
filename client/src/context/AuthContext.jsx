import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';
import { isTokenExpired } from '../utils/authUtils';

const AuthContext = createContext(null);

const getInitialAuthState = () => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!storedToken || isTokenExpired(storedToken)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { token: null, user: null };
  }

  try {
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const validRoles = ['student', 'company', 'admin'];
    if (!parsedUser || !validRoles.includes(parsedUser.role)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { token: null, user: null };
    }
    return { token: storedToken, user: parsedUser };
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuthState] = useState(getInitialAuthState);
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ token: null, user: null });
  }, []);

  // Listen to 401 unauthorized events from axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setAuthState({ token: res.token, user: res.user });
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      if (res.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setAuthState({ token: res.token, user: res.user });
        return res;
      }
      throw new Error(res.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setAuthState((prev) => ({ ...prev, user: newUser }));
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    role: user?.role || null,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
