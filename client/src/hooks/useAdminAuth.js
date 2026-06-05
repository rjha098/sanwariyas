import { useState, useEffect } from 'react';
import { adminLogin, adminSession } from '@/lib/api';

const ADMIN_TOKEN_KEY = 'sanwariyas_admin_token';

export function useAdminAuth() {
  const [token, setToken] = useState('');
  const [admin, setAdmin] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!savedToken) {
      setAuthChecking(false);
      return;
    }

    adminSession(savedToken)
      .then((data) => {
        setToken(savedToken);
        setAdmin(data.admin);
      })
      .catch(() => {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY);
      })
      .finally(() => setAuthChecking(false));
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const data = await adminLogin(loginForm);
      window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setToken(data.token);
      setAdmin(data.admin);
      setLoginForm({ username: '', password: '' });
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
    setAdmin(null);
  };

  return {
    token,
    admin,
    authChecking,
    loginForm,
    setLoginForm,
    loginError,
    loggingIn,
    handleLoginSubmit,
    handleLogout,
  };
}




