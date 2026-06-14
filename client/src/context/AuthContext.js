import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  AUTH_STORAGE_KEY
} from '../constants/auth';

const AuthContext = createContext(null);

// Read the persisted auth flag defensively — localStorage can throw in
// private-mode / sandboxed browsers, so never let it crash the app.
const readStoredAuth = () => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch (err) {
    console.warn('Unable to read auth state from storage:', err);
    return false;
  }
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredAuth);

  // Returns { ok: true } on success or { ok: false, error } on bad credentials.
  const login = useCallback((username, password) => {
    const usernameOk = (username || '').trim() === ADMIN_USERNAME;
    const passwordOk = (password || '') === ADMIN_PASSWORD;

    if (!usernameOk || !passwordOk) {
      return { ok: false, error: 'Invalid username or password.' };
    }

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } catch (err) {
      // Persistence failing is non-fatal — the user is still logged in for
      // this session, they just won't stay logged in after a reload.
      console.warn('Unable to persist auth state:', err);
    }
    setIsAuthenticated(true);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.warn('Unable to clear auth state:', err);
    }
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
