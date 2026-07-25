// // FILE: client/src/providers/AuthProvider.js
"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useMemo,
} from "react";
import api, {
  unifiedLogin,
  verifyOTP,
  checkAuthSession,
  customerSignup,
  authLogout,
} from "@/lib/api";

import { tokenStorage } from "@/lib/tokenStorage";

export const AuthContext = createContext(null);

const CACHE_KEY = "sanwariyas_session_verified";
const USER_KEY = "sanwariyas_user";
const CACHE_TTL_MS = 60 * 1000;

// Request Promise Deduplication with TTL Safety
let activeSessionValidationPromise = null;
let activeValidationTimeout = null;

//  ENTERPRISE FIX: Protect against LocalStorage XSS Poisoning
const decodeJWTPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [otpPending, setOtpPending] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [otpRole, setOtpRole] = useState("");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [signupError, setSignupError] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  // ── Restore session on page load ─────────
  useEffect(() => {
    let isMounted = true;
    const savedToken = tokenStorage.get();
    const savedUserStr = localStorage.getItem(USER_KEY);

    if (!savedToken) {
      if (isMounted) setAuthChecking(false);
      return;
    }

    if (savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        const decodedToken = decodeJWTPayload(savedToken);

        // XSS Verification: Local user object MUST match signed JWT claims
        if (
          !decodedToken ||
          decodedToken.role !== parsedUser.role ||
          decodedToken.email !== parsedUser.email
        ) {
          throw new Error("Local cache poisoned or mismatched with JWT.");
        }

        setToken(savedToken);
        setUser(parsedUser);

        const lastVerified = sessionStorage.getItem(CACHE_KEY);
        if (
          lastVerified &&
          Date.now() - parseInt(lastVerified, 10) < CACHE_TTL_MS
        ) {
          if (isMounted) setAuthChecking(false);
          return;
        }
      } catch (e) {
        tokenStorage.clear();
        localStorage.removeItem(USER_KEY);
      }
    }

    // Safe Promise Deduplication with TTL
    if (!activeSessionValidationPromise) {
      activeSessionValidationPromise = checkAuthSession(savedToken).finally(
        () => {
          activeSessionValidationPromise = null;
          if (activeValidationTimeout) clearTimeout(activeValidationTimeout);
        },
      );

      activeValidationTimeout = setTimeout(() => {
        activeSessionValidationPromise = null;
      }, 10000);
    }

    activeSessionValidationPromise
      .then((data) => {
        if (!isMounted) return;
        if (data && data.success && data.token && data.user) {
          tokenStorage.set(data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          sessionStorage.setItem(CACHE_KEY, Date.now().toString());
          setToken(data.token);
          setUser(data.user);
        } else {
          tokenStorage.clear();
          localStorage.removeItem(USER_KEY);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (
          err.isLocalPreflightReject ||
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          tokenStorage.clear();
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) setAuthChecking(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== "sanwariyas_token") return;
      if (!e.newValue) {
        setToken(null);
        setUser(null);
        localStorage.removeItem(USER_KEY);
      } else if (e.newValue !== token) {
        setToken(e.newValue);
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (err) {}
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token]);

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

      if (data && data.success && data.token && data.user) {
        tokenStorage.set(data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        sessionStorage.setItem(CACHE_KEY, Date.now().toString());
        setToken(data.token);
        setUser(data.user);
        return {
          success: true,
          requires2FA: false,
          role: data.user.role,
          token: data.token,
          user: data.user,
        };
      } else {
        throw new Error("Invalid authentication response received.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setLoginError(message);
      return { success: false, error: message };
    } finally {
      setLoggingIn(false);
    }
  }, []);

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

        if (data && data.success && data.token && data.user) {
          tokenStorage.set(data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          sessionStorage.setItem(CACHE_KEY, Date.now().toString());
          setToken(data.token);
          setUser(data.user);

          setOtpPending(false);
          setOtpRole("");
          setOtpIdentifier("");
          setDevOtp("");
          return { success: true, role: data.user.role };
        } else {
          throw new Error("Invalid backend token response.");
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Invalid OTP. Please try again.";
        setOtpError(message);
        return { success: false, error: message };
      } finally {
        setVerifyingOtp(false);
      }
    },
    [otpRole, otpIdentifier],
  );

  const cancelOtp = useCallback(() => {
    setOtpPending(false);
    setOtpError("");
    setEmailHint("");
    setDevOtp("");
    setOtpRole("");
    setOtpIdentifier("");
  }, []);

  const signup = useCallback(async (formData) => {
    setSigningUp(true);
    setSignupError("");
    setSignupDone(false);
    try {
      await customerSignup(formData);
      setSignupDone(true);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";
      setSignupError(message);
      return { success: false, error: message };
    } finally {
      setSigningUp(false);
    }
  }, []);

  const logout = useCallback(() => {
    const saved = token || tokenStorage.get();
    if (saved) authLogout(saved).catch(() => {});

    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(CACHE_KEY);
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


  //Universal heartbeat — fires for EVERY authenticated user (customer
  // or admin) on EVERY page, regardless of screen size.
  useEffect(() => {
    if (!token) return;

    const ping = () => {
      api.post("/auth/heartbeat", {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    };

    ping();
    const intervalId = setInterval(ping, 60000);
    return () => clearInterval(intervalId);
  }, [token]);


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
      token,
      user,
      authChecking,
      loginError,
      loggingIn,
      otpPending,
      emailHint,
      devOtp,
      otpError,
      verifyingOtp,
      signupError,
      signingUp,
      signupDone,
      login,
      submitOtp,
      cancelOtp,
      signup,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
