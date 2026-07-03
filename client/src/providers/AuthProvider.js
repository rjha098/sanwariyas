// FILE: client/src/providers/AuthProvider.js
"use client";

import { useState, useEffect, useCallback, createContext, useMemo } from "react";
import {
  unifiedLogin,
  verifyOTP,
  checkAuthSession,
  customerSignup,
  authLogout,
} from "@/lib/api";
import { tokenStorage } from "@/lib/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Login step 1
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // OTP step 2
  const [otpPending, setOtpPending] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [otpRole, setOtpRole] = useState("");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Signup
  const [signupError, setSignupError] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  // ── Restore session on page load (Strict Mode Safe) ─────────
  useEffect(() => {
    let isMounted = true;
    const saved = tokenStorage.get();
    
    if (!saved) {
      if (isMounted) setAuthChecking(false);
      return;
    }

    checkAuthSession(saved)
      .then((data) => {
        if (!isMounted) return;
        if (data?.token && data?.user) {
          tokenStorage.set(data.token);
          setToken(data.token);
          setUser(data.user);
        } else {
          tokenStorage.clear();
        }
      })
      .catch(() => {
        if (isMounted) tokenStorage.clear();
      })
      .finally(() => {
        if (isMounted) setAuthChecking(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Cross-tab sync ───────────────────────────────────────────
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== "sanwariyas_token") return;
      if (!e.newValue) {
        setToken(null);
        setUser(null);
      } else if (e.newValue !== token) {
        setToken(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token]);

  // ── LOGIN STEP 1 ─────────────────────────────────────────────
  const login = useCallback(async (identifier, password) => {
    setLoggingIn(true);
    setLoginError("");
    setSignupError("");
    setSignupDone(false);

    try {
      const data = await unifiedLogin({ identifier, password });

      if (data.requires2FA) {
        setOtpPending(true);
        setOtpRole(data.role || "admin");
        setOtpIdentifier(identifier);
        setEmailHint(data.emailHint || "");
        setDevOtp(data.devOtp || "");
        return { success: true, requires2FA: true };
      }

      tokenStorage.set(data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please check your credentials.";
      setLoginError(message);
      return { success: false, error: message };
    } finally {
      setLoggingIn(false);
    }
  }, []);

  // ── OTP STEP 2 ───────────────────────────────────────────────
  const submitOtp = useCallback(
    async (otp) => {
      setVerifyingOtp(true);
      setOtpError("");
      try {
        const data = await verifyOTP({
          otp,
          role: otpRole || "admin",
          identifier: otpIdentifier,
        });
        tokenStorage.set(data.token);
        setToken(data.token);
        setUser(data.user);
        setOtpPending(false);
        setOtpRole("");
        setOtpIdentifier("");
        setDevOtp("");
        return { success: true, role: data.user.role };
      } catch (err) {
        const message = err.response?.data?.message || "Invalid OTP. Please try again.";
        setOtpError(message);
        return { success: false, error: message };
      } finally {
        setVerifyingOtp(false);
      }
    },
    [otpRole, otpIdentifier]
  );

  const cancelOtp = useCallback(() => {
    setOtpPending(false);
    setOtpError("");
    setEmailHint("");
    setDevOtp("");
    setOtpRole("");
    setOtpIdentifier("");
  }, []);

  // ── SIGNUP ───────────────────────────────────────────────────
  const signup = useCallback(async (formData) => {
    setSigningUp(true);
    setSignupError("");
    setSignupDone(false);
    try {
      await customerSignup(formData);
      setSignupDone(true);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed. Please try again.";
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
    setLoginError("");
    setOtpError("");
    setOtpPending(false);
    setOtpRole("");
    setOtpIdentifier("");
    setDevOtp("");
    setSignupError("");
    setSignupDone(false);
  }, [token]);

  // ── ENTERPRISE MEMOIZATION ───────────────────────────────────
  const contextValue = useMemo(
    () => ({
      token,
      user,
      authChecking,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === "admin",
      isStaff: user?.role === "staff",
      isCustomer: user?.role === "customer",
      login,
      loginError,
      setLoginError,
      loggingIn,
      otpPending,
      emailHint,
      devOtp,
      otpError,
      verifyingOtp,
      submitOtp,
      cancelOtp,
      signup,
      signupError,
      setSignupError,
      signingUp,
      signupDone,
      logout,
    }),
    [
      token, user, authChecking, loginError, loggingIn, otpPending,
      emailHint, devOtp, otpError, verifyingOtp, signupError,
      signingUp, signupDone, login, submitOtp, cancelOtp, signup, logout
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}