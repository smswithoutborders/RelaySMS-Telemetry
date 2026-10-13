import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import adminApi, { onUnauthorized } from 'api/admin';

// ==============================|| AUTH CONTEXT ||============================== //

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [credential, setCredential] = useState(null);
  const [endReason, setEndReason] = useState(null);
  const statusRef = useRef(status);
  statusRef.current = status;

  const applySession = useCallback((me) => {
    setCredential(me || null);
    setStatus(me ? 'authenticated' : 'anonymous');
    if (me) setEndReason(null);
  }, []);

  const endSession = useCallback(() => {
    if (statusRef.current === 'authenticated') setEndReason('session-ended');
    applySession(null);
  }, [applySession]);

  const refresh = useCallback(async () => {
    try {
      const { data } = await adminApi.get('auth/me');
      applySession(data);
    } catch {
      endSession();
    }
  }, [applySession, endSession]);

  useEffect(() => {
    const unsubscribe = onUnauthorized(endSession);
    refresh();
    return unsubscribe;
  }, [endSession, refresh]);

  useEffect(() => {
    if (status !== 'authenticated') return undefined;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [status, refresh]);

  const login = useCallback(
    async (username, password) => {
      const { data } = await adminApi.post('auth/login', { username, password });
      applySession(data);
      return data;
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    try {
      await adminApi.post('auth/logout');
    } finally {
      setEndReason('signed-out');
      applySession(null);
    }
  }, [applySession]);

  const clearEndReason = useCallback(() => setEndReason(null), []);

  const hasScope = useCallback((scope) => !scope || Boolean(credential?.scopes?.includes(scope)), [credential]);

  const value = useMemo(
    () => ({ status, credential, isAuthenticated: status === 'authenticated', endReason, clearEndReason, hasScope, login, logout }),
    [status, credential, endReason, clearEndReason, hasScope, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
