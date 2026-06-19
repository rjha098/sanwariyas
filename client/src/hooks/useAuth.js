// // FILE: client/src/hooks/useAuth.js
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { unifiedLogin, verifyOTP, checkAuthSession, customerSignup, authLogout } from '@/lib/api';

// export function useAuth() {
//   const [token, setToken]               = useState(null);
//   const [user, setUser]                 = useState(null);
//   const [authChecking, setAuthChecking] = useState(true);

//   // Login step 1
//   const [loginError, setLoginError]   = useState('');
//   const [loggingIn, setLoggingIn]     = useState(false);

//   // OTP step 2
//   const [otpPending, setOtpPending]     = useState(false);
//   const [emailHint, setEmailHint]       = useState('');
//   const [devOtp, setDevOtp]             = useState('');
//   const [otpRole, setOtpRole]           = useState('');
//   const [otpIdentifier, setOtpIdentifier] = useState('');
//   const [otpError, setOtpError]         = useState('');
//   const [verifyingOtp, setVerifyingOtp] = useState(false);

//   // Signup
//   const [signupError, setSignupError]   = useState('');
//   const [signingUp, setSigningUp]       = useState(false);
//   const [signupDone, setSignupDone]     = useState(false);

//   // ── Restore session on page reload ──────────────────────────
//   useEffect(() => {
//     const saved = sessionStorage.getItem('sanwariyas_token');
//     if (!saved) { setAuthChecking(false); return; }

//     checkAuthSession(saved)
//       .then((data) => {
//         if (data?.token && data?.user) {
//           sessionStorage.setItem('sanwariyas_token', data.token);
//           setToken(data.token);
//           setUser(data.user);
//         }
//       })
//       .catch(() => sessionStorage.removeItem('sanwariyas_token'))
//       .finally(() => setAuthChecking(false));
//   }, []);

//   // ── LOGIN STEP 1 ─────────────────────────────────────────────
//   const login = useCallback(async (identifier, password) => {
//     setLoggingIn(true);
//     setLoginError('');
//     try {
//       const data = await unifiedLogin({ identifier, password });

//       if (data.requires2FA) {
//         setOtpPending(true);
//         setOtpRole(data.role || 'admin');
//         setOtpIdentifier(identifier);
//         setEmailHint(data.emailHint || '');
//         setDevOtp(data.devOtp || '');
//         return { success: true, requires2FA: true };
//       }

//       // Direct success (no 2FA)
//       sessionStorage.setItem('sanwariyas_token', data.token);
//       setToken(data.token);
//       setUser(data.user);
//       return { success: true, role: data.user.role };
//     } catch (err) {
//       const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
//       setLoginError(message);
//       return { success: false, error: message };
//     } finally {
//       setLoggingIn(false);
//     }
//   }, []);

//   // ── OTP STEP 2 ───────────────────────────────────────────────
//   const submitOtp = useCallback(async (otp) => {
//     setVerifyingOtp(true);
//     setOtpError('');
//     try {
//       const data = await verifyOTP({ otp, role: otpRole || 'admin', identifier: otpIdentifier });
//       sessionStorage.setItem('sanwariyas_token', data.token);
//       setToken(data.token);
//       setUser(data.user);
//       setOtpPending(false);
//       setOtpRole('');
//       setOtpIdentifier('');
//       setDevOtp('');
//       return { success: true, role: data.user.role };
//     } catch (err) {
//       const message = err.response?.data?.message || 'Invalid OTP. Please try again.';
//       setOtpError(message);
//       return { success: false, error: message };
//     } finally {
//       setVerifyingOtp(false);
//     }
//   }, [otpRole, otpIdentifier]);

//   const cancelOtp = useCallback(() => {
//     setOtpPending(false);
//     setOtpError('');
//     setEmailHint('');
//     setDevOtp('');
//     setOtpRole('');
//     setOtpIdentifier('');
//   }, []);

//   // ── SIGNUP ───────────────────────────────────────────────────
//   const signup = useCallback(async (formData) => {
//     setSigningUp(true);
//     setSignupError('');
//     setSignupDone(false);
//     try {
//       await customerSignup(formData);
//       setSignupDone(true);
//       return { success: true };
//     } catch (err) {
//       const message = err.response?.data?.message || 'Signup failed. Please try again.';
//       setSignupError(message);
//       return { success: false, error: message };
//     } finally {
//       setSigningUp(false);
//     }
//   }, []);

//   // ── LOGOUT ───────────────────────────────────────────────────
//   const logout = useCallback(() => {
//     const saved = token || sessionStorage.getItem('sanwariyas_token');
//     if (saved) authLogout(saved).catch(() => {});
//     sessionStorage.removeItem('sanwariyas_token');
//     setToken(null);
//     setUser(null);
//     setLoginError('');
//     setOtpPending(false);
//     setOtpRole('');
//     setOtpIdentifier('');
//     setDevOtp('');
//   }, [token]);

//   const isAdmin         = user?.role === 'admin';
//   const isStaff         = user?.role === 'staff';
//   const isCustomer      = user?.role === 'customer';
//   const isAuthenticated = !!token && !!user;

//   return {
//     token, user, authChecking, isAuthenticated,
//     isAdmin, isStaff, isCustomer,
//     login, loginError, setLoginError, loggingIn,
//     otpPending, emailHint, devOtp, otpError, verifyingOtp, submitOtp, cancelOtp,
//     signup, signupError, setSignupError, signingUp, signupDone,
//     logout,
//   };
// }



// FILE: client/src/hooks/useAuth.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { unifiedLogin, verifyOTP, checkAuthSession, customerSignup, authLogout } from '@/lib/api';
import { tokenStorage } from '@/lib/tokenStorage';

export function useAuth() {
  const [token, setToken]               = useState(null);
  const [user, setUser]                 = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Login step 1
  const [loginError, setLoginError]   = useState('');
  const [loggingIn, setLoggingIn]     = useState(false);

  // OTP step 2
  const [otpPending, setOtpPending]       = useState(false);
  const [emailHint, setEmailHint]         = useState('');
  const [devOtp, setDevOtp]               = useState('');
  const [otpRole, setOtpRole]             = useState('');
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpError, setOtpError]           = useState('');
  const [verifyingOtp, setVerifyingOtp]   = useState(false);

  // Signup
  const [signupError, setSignupError]   = useState('');
  const [signingUp, setSigningUp]       = useState(false);
  const [signupDone, setSignupDone]     = useState(false);

  // ── Restore session on page load ──────────────────────────────
  // CHANGED: was sessionStorage (per-tab) — now localStorage via tokenStorage
  // helper, so opening a new tab keeps you logged in instead of bouncing
  // to /login. Token is still re-validated against the server every load,
  // so an expired/revoked token is caught immediately either way.
  useEffect(() => {
    const saved = tokenStorage.get();
    if (!saved) { setAuthChecking(false); return; }

    checkAuthSession(saved)
      .then((data) => {
        if (data?.token && data?.user) {
          tokenStorage.set(data.token);
          setToken(data.token);
          setUser(data.user);
        } else {
          tokenStorage.clear();
        }
      })
      .catch(() => tokenStorage.clear())
      .finally(() => setAuthChecking(false));
  }, []);

  // ── Cross-tab sync ───────────────────────────────────────────
  // BONUS FIX: if the user logs out in Tab A, Tab B should also reflect
  // that immediately instead of silently keeping a dead session in memory.
  // localStorage's 'storage' event fires in OTHER tabs automatically.
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== 'sanwariyas_token') return;
      if (!e.newValue) {
        // Token was cleared in another tab — log out here too.
        setToken(null);
        setUser(null);
      } else if (e.newValue !== token) {
        // Token was refreshed/changed in another tab — pick it up.
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  // ── LOGIN STEP 1 ─────────────────────────────────────────────
  const login = useCallback(async (identifier, password) => {
    setLoggingIn(true);
    setLoginError('');
    try {
      const data = await unifiedLogin({ identifier, password });

      if (data.requires2FA) {
        setOtpPending(true);
        setOtpRole(data.role || 'admin');
        setOtpIdentifier(identifier);
        setEmailHint(data.emailHint || '');
        setDevOtp(data.devOtp || '');
        return { success: true, requires2FA: true };
      }

      // Direct success (no 2FA)
      tokenStorage.set(data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setLoginError(message);
      return { success: false, error: message };
    } finally {
      setLoggingIn(false);
    }
  }, []);

  // ── OTP STEP 2 ───────────────────────────────────────────────
  const submitOtp = useCallback(async (otp) => {
    setVerifyingOtp(true);
    setOtpError('');
    try {
      const data = await verifyOTP({ otp, role: otpRole || 'admin', identifier: otpIdentifier });
      tokenStorage.set(data.token);
      setToken(data.token);
      setUser(data.user);
      setOtpPending(false);
      setOtpRole('');
      setOtpIdentifier('');
      setDevOtp('');
      return { success: true, role: data.user.role };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(message);
      return { success: false, error: message };
    } finally {
      setVerifyingOtp(false);
    }
  }, [otpRole, otpIdentifier]);

  const cancelOtp = useCallback(() => {
    setOtpPending(false);
    setOtpError('');
    setEmailHint('');
    setDevOtp('');
    setOtpRole('');
    setOtpIdentifier('');
  }, []);

  // ── SIGNUP ───────────────────────────────────────────────────
  const signup = useCallback(async (formData) => {
    setSigningUp(true);
    setSignupError('');
    setSignupDone(false);
    try {
      await customerSignup(formData);
      setSignupDone(true);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setSignupError(message);
      return { success: false, error: message };
    } finally {
      setSigningUp(false);
    }
  }, []);

  // ── LOGOUT ───────────────────────────────────────────────────
  const logout = useCallback(() => {
    const saved = token || tokenStorage.get();
    if (saved) authLogout(saved).catch(() => {});
    tokenStorage.clear();
    setToken(null);
    setUser(null);
    setLoginError('');
    setOtpPending(false);
    setOtpRole('');
    setOtpIdentifier('');
    setDevOtp('');
  }, [token]);

  const isAdmin         = user?.role === 'admin';
  const isStaff         = user?.role === 'staff';
  const isCustomer      = user?.role === 'customer';
  const isAuthenticated = !!token && !!user;

  return {
    token, user, authChecking, isAuthenticated,
    isAdmin, isStaff, isCustomer,
    login, loginError, setLoginError, loggingIn,
    otpPending, emailHint, devOtp, otpError, verifyingOtp, submitOtp, cancelOtp,
    signup, signupError, setSignupError, signingUp, signupDone,
    logout,
  };
}