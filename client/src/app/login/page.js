// // // // FILE: client/src/app/login/page.js
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import Toast from "@/components/ui/Toast";
// import api from "@/lib/api";

// const inp =
//   "w-full border border-brand-lightgold/60 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand-coffee transition-colors";
// const lbl =
//   "block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2";
// const btn =
//   "w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-50 disabled:cursor-not-allowed";


// // ── OTP Screen (Used for Admin login) ─────────────────────────────────────────
// function OtpScreen({ emailHint, devOtp, verifyingOtp, onSubmit, onBack }) {
//   const [otp, setOtp] = useState("");
//   return (
//     <div className="space-y-5">
//       <div className="pb-4 border-b border-brand-lightgold/30">
//         <h2 className="font-display text-2xl text-brand-african">Verify OTP</h2>
//         <p className="font-sans text-xs text-brand-mud mt-1">
//           A 6-digit code was sent to <strong>{emailHint}</strong>. Valid for 10
//           minutes.
//         </p>
//       </div>
//       {devOtp && (
//         <p className="font-sans text-xs text-brand-coffee bg-brand-lightgold/20 border border-brand-lightgold/50 px-4 py-3">
//           Local dev OTP: <strong>{devOtp}</strong>
//         </p>
//       )}
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (otp.length === 6) onSubmit(otp);
//         }}
//         className="space-y-5"
//         noValidate
//         aria-label="OTP Verification Form"
//       >
//         <div>
//           <label className={lbl}>One-Time Password</label>
//           <input
//             type="text"
//             inputMode="numeric"
//             maxLength={6}
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//             placeholder="• • • • • •"
//             aria-label="Enter 6-digit OTP"
//             className={`${inp} text-center text-2xl tracking-[0.6em] font-mono`}
//             autoFocus
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={verifyingOtp || otp.length !== 6}
//           className={btn}
//           title="Verify OTP and Sign In"
//         >
//           {verifyingOtp ? "Verifying..." : "Verify & Sign In"}
//         </button>
//         <button
//           type="button"
//           onClick={onBack}
//           title="Go back to login screen"
//           className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee transition-colors"
//         >
//           ← Back
//         </button>
//       </form>
//     </div>
//   );
// }

// // ── Forgot Password Screen

// function ForgotPasswordScreen({ onBack, onResetSuccess }) {
//   const [step, setStep] = useState(1);
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [localErr, setLocalErr] = useState("");

//   const handleRequestOtp = async (e) => {
//     e.preventDefault();
//     if (!identifier.trim()) return;
//     setLoading(true);
//     setLocalErr("");
//     try {
//       const res = await api.post("/auth/forgot-password", {
//         identifier: identifier.trim(),
//       });
//       if (res.data.success) {
//         setStep(2);
//       }
//     } catch (err) {
//       setLocalErr(err.response?.data?.message || "Failed to send OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = async (e) => {
//     e.preventDefault();
//     if (!otp || newPassword.length < 8) {
//       setLocalErr("OTP is required and Password must be at least 8 chars.");
//       return;
//     }
//     setLoading(true);
//     setLocalErr("");
//     try {
//       const res = await api.post("/auth/reset-password", {
//         email: identifier.trim().toLowerCase(),
//         otp,
//         newPassword,
//       });
//       if (res.data.success) onResetSuccess(res.data.message);
//     } catch (err) {
//       setLocalErr(err.response?.data?.message || "Failed to reset password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-5">
//       <div className="pb-4 border-b border-brand-lightgold/30">
//         <h2 className="font-display text-2xl text-brand-african">
//           Reset Password
//         </h2>
//         <p className="font-sans text-xs text-brand-mud mt-1">
//           {step === 1
//             ? "Enter your email or phone to receive a reset code."
//             : `An OTP was sent to ${identifier}`}
//         </p>
//       </div>

//       {step === 1 ? (
//         <form onSubmit={handleRequestOtp} className="space-y-5">
//           <div>
//             <label className={lbl}>Email or Phone</label>
//             <input
//               type="text"
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               placeholder="you@example.com"
//               className={inp}
//               required
//             />
//           </div>
//           {localErr && (
//             <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
//               {localErr}
//             </p>
//           )}
//           <button
//             type="submit"
//             disabled={loading || !identifier.trim()}
//             className={btn}
//           >
//             {loading ? "Sending..." : "Send Reset Code"}
//           </button>
//           <button
//             type="button"
//             onClick={onBack}
//             className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee"
//           >
//             ← Back to Login
//           </button>
//         </form>
//       ) : (
//         <form onSubmit={handleReset} className="space-y-5">
//           <div>
//             <label className={lbl}>Enter 6-digit OTP</label>
//             <input
//               type="text"
//               inputMode="numeric"
//               maxLength={6}
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//               placeholder="• • • • • •"
//               className={`${inp} text-center tracking-[0.4em] font-mono`}
//               required
//             />
//           </div>
//           <div>
//             <label className={lbl}>New Password</label>
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="Min. 8 characters"
//               className={inp}
//               required
//             />
//           </div>
//           {localErr && (
//             <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
//               {localErr}
//             </p>
//           )}
//           <button
//             type="submit"
//             disabled={loading || otp.length !== 6 || newPassword.length < 8}
//             className={btn}
//           >
//             {loading ? "Resetting..." : "Confirm & Reset"}
//           </button>
//           <button
//             type="button"
//             onClick={() => setStep(1)}
//             className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee"
//           >
//             ← Go Back
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

// // ── Sign In Form ──────────────────────────────────────────────────────────────
// function SignInForm({ onLogin, loggingIn, onForgot }) {
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onLogin(identifier.trim(), password);
//       }}
//       className="space-y-5"
//       noValidate
//       aria-label="B2B Wholesale Portal Sign In Form"
//     >
//       <div>
//         <label className={lbl}>Email or Phone</label>
//         <input
//           type="text"
//           value={identifier}
//           onChange={(e) => setIdentifier(e.target.value)}
//           placeholder="you@example.com or +91..."
//           className={inp}
//           autoComplete="username"
//           aria-label="Email or Phone Number for B2B Login"
//           required
//         />
//       </div>
//       <div>
//         <div className="flex justify-between items-center mb-2">
//           <label className={`${lbl} !mb-0`}>Password</label>
//           <button
//             type="button"
//             onClick={onForgot}
//             className="font-sans text-[10px] text-brand-coffee hover:underline uppercase tracking-wider transition-colors"
//           >
//             Forgot Password?
//           </button>
//         </div>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="••••••••"
//           className={inp}
//           autoComplete="current-password"
//           aria-label="Password"
//           required
//         />
//       </div>
//       <button
//         type="submit"
//         disabled={loggingIn || !identifier.trim() || !password.trim()}
//         className={btn}
//         title="Sign In to Wholesale Dashboard"
//       >
//         {loggingIn ? "Please wait..." : "Sign In"}
//       </button>
//     </form>
//   );
// }

// // ── Signup Form ───────────────────────────────────────────────────────────────
// function SignupForm({ onSignup, signingUp }) {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm: "",
//     company: "",
//     country: "",
//   });
//   const [localErr, setLocalErr] = useState("");
//   const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLocalErr("");

//     const trimmedName = form.name.trim();
//     if (trimmedName.length < 3) {
//       setLocalErr("Please enter a valid full name (min 3 characters).");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(form.email.trim())) {
//       setLocalErr(
//         "Please enter a valid email address (e.g., user@example.com).",
//       );
//       return;
//     }

//     const phoneRegex = /^\+?[0-9]{10,15}$/;
//     const cleanedPhone = form.phone.trim().replace(/[\s-]/g, "");
//     if (!phoneRegex.test(cleanedPhone)) {
//       setLocalErr("Please enter a valid 10 to 15 digit phone number.");
//       return;
//     }

//     if (form.password !== form.confirm) {
//       setLocalErr("Passwords do not match.");
//       return;
//     }
//     if (form.password.length < 8) {
//       setLocalErr("Password must be at least 8 characters.");
//       return;
//     }

//     const { confirm, ...payload } = form;
//     onSignup({
//       ...payload,
//       name: trimmedName,
//       email: payload.email.trim().toLowerCase(),
//       phone: cleanedPhone,
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4"
//       noValidate
//       aria-label="B2B Wholesale Buyer Registration Form"
//     >
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className={lbl}>Full Name *</label>
//           <input
//             type="text"
//             value={form.name}
//             onChange={set("name")}
//             placeholder="Your name"
//             aria-label="Full Name"
//             className={inp}
//             required
//           />
//         </div>
//         <div>
//           <label className={lbl}>Phone *</label>
//           <input
//             type="tel"
//             value={form.phone}
//             onChange={set("phone")}
//             placeholder="+91 98765 43210"
//             aria-label="Phone Number"
//             className={inp}
//             required
//           />
//         </div>
//       </div>
//       <div>
//         <label className={lbl}>Email *</label>
//         <input
//           type="email"
//           value={form.email}
//           onChange={set("email")}
//           placeholder="you@example.com"
//           aria-label="Email Address"
//           className={inp}
//           required
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className={lbl}>Company</label>
//           <input
//             type="text"
//             value={form.company}
//             onChange={set("company")}
//             placeholder="Your company"
//             aria-label="Company Name"
//             className={inp}
//           />
//         </div>
//         <div>
//           <label className={lbl}>Country</label>
//           <input
//             type="text"
//             value={form.country}
//             onChange={set("country")}
//             placeholder="India"
//             aria-label="Country"
//             className={inp}
//           />
//         </div>
//       </div>
//       <div>
//         <label className={lbl}>Password *</label>
//         <input
//           type="password"
//           value={form.password}
//           onChange={set("password")}
//           placeholder="Min. 8 characters"
//           aria-label="Password"
//           className={inp}
//           required
//         />
//       </div>
//       <div>
//         <label className={lbl}>Confirm Password *</label>
//         <input
//           type="password"
//           value={form.confirm}
//           onChange={set("confirm")}
//           placeholder="Repeat password"
//           aria-label="Confirm Password"
//           className={inp}
//           required
//         />
//       </div>
//       {localErr && (
//         <p
//           className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3"
//           role="alert"
//         >
//           {localErr}
//         </p>
//       )}
//       <button
//         type="submit"
//         disabled={signingUp}
//         className={btn}
//         title="Create Wholesale Account"
//       >
//         {signingUp ? "Creating Account..." : "Create Account"}
//       </button>
//     </form>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function LoginPage() {
//   const router = useRouter();
//   const [mode, setMode] = useState("signin");
//   const [toast, setToast] = useState({
//     isVisible: false,
//     message: "",
//     type: "success",
//   });
//   const [redirecting, setRedirecting] = useState(false);
//     const [returnTo, setReturnTo] = useState("/");   
//   const redirectTimeoutRef = useRef(null);
  

//   const showToast = (message, type = "success") =>
//     setToast({ isVisible: true, message, type });
//   const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

//   const {
//     login,
//     loginError,
//     setLoginError,
//     loggingIn,
//     otpPending,
//     emailHint,
//     devOtp,
//     otpError,
//     verifyingOtp,
//     submitOtp,
//     cancelOtp,
//     signup,
//     signupError,
//     setSignupError,
//     signingUp,
//     signupDone,
//     isAuthenticated,
//     isAdmin,
//     isStaff,
//     authChecking,
//   } = useAuth();

//   // ✅ ENTERPRISE FIX: Safe Cleanup of Unmounted Timeouts
//   useEffect(() => {
//     return () => {
//       if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const urlParams = new URLSearchParams(window.location.search);

//       const queryMode = urlParams.get("mode");
//       if (
//         queryMode === "signup" ||
//         queryMode === "signin" ||
//         queryMode === "forgot"
//       ) {
//         setMode(queryMode);
//       }

//       //  FIX: honor ?redirect=/cart (or /checkout) so a guest who tried to
//       // Buy Now / go to checkout lands back where they were after logging in.

//       const redirectParam = urlParams.get("redirect");
//       if (redirectParam && redirectParam.startsWith("/")) {
//         setReturnTo(redirectParam);
//       }

//       if (urlParams.get("session_expired") === "true") {
//         const reason = urlParams.get("reason");
//         showToast(
//           reason
//             ? decodeURIComponent(reason)
//             : "Session expired. Please log in again.",
//           "error",
//         );
//         const newUrl = queryMode ? `/login?mode=${queryMode}` : "/login";
//         window.history.replaceState({}, document.title, newUrl);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (loginError) {
//       showToast(loginError, "error");
//       setLoginError("");
//     }
//   }, [loginError, setLoginError]);

//   useEffect(() => {
//     if (otpError) showToast(otpError, "error");
//   }, [otpError]);

//   useEffect(() => {
//     if (signupError) {
//       showToast(signupError, "error");
//       setSignupError("");
//     }
//   }, [signupError, setSignupError]);

//   useEffect(() => {
//     if (signupDone) {
//       showToast(
//         "Account created! Sign in to access your dashboard.",
//         "success",
//       );
//       setMode("signin");
//     }
//   }, [signupDone]);

//   useEffect(() => {
//     if (!authChecking && isAuthenticated && !redirecting) {
//       router.replace(isAdmin || isStaff ? "/operations-center" : returnTo);
//     }
//   }, [
//     authChecking,
//     isAuthenticated,
//     isAdmin,
//     isStaff,
//     redirecting,
//     router,
//     returnTo,
//   ]);

//   const switchMode = (m) => {
//     setMode(m);
//     setLoginError?.("");
//     setSignupError?.("");
//   };

//   const handleLogin = async (identifier, password) => {
//     if (!identifier.trim()) {
//       showToast("Please enter your email, phone, or username.", "error");
//       return;
//     }

//     const result = await login(identifier, password);

//     if (result?.requires2FA) {
//       showToast("OTP sent to your registered email.", "success");
//     } else if (result?.success && !result?.requires2FA) {
//       setRedirecting(true);
//       showToast("Login successful. Welcome!", "success");

//      redirectTimeoutRef.current = setTimeout(() => {
//         if (result.role === "admin" || result.role === "staff") {
//           router.push("/operations-center");
//         } else {
//           router.push(returnTo);
//         }
//       }, 2000);
//     }
//   };

//   const handleOtp = async (otp) => {
//     const result = await submitOtp(otp);
//     if (result?.success) {
//       setRedirecting(true);
//       showToast("Login successful. Welcome!", "success");

//       redirectTimeoutRef.current = setTimeout(() => {
//         if (result.role === "admin" || result.role === "staff") {
//           router.push("/operations-center");
//         } else {
//           router.push(returnTo); 
//         }
//       }, 2000);
//     }
//   };

//   const handleCancelOtp = () => {
//     cancelOtp();
//     showToast("OTP cancelled. Please login again.", "error");
//   };

//   if (authChecking) {
//     return (
//       <main className="min-h-screen bg-[#f5efe4] flex items-center justify-center">
//         <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-mud/50">
//           Loading...
//         </p>
//       </main>
//     );
//   }

//   return (
//     <>
//       <Toast
//         isVisible={toast.isVisible}
//         message={toast.message}
//         type={toast.type}
//         onClose={hideToast}
//       />

//       <main
//         id="main-content"
//         className="min-h-screen bg-[#f5efe4] text-brand-african flex items-center justify-center px-4 py-12"
//       >
//         <div className="w-full max-w-md bg-white border border-brand-lightgold/60 shadow-xl">
//           <div className="px-8 pt-8 pb-5 border-b border-brand-lightgold/30">
//             <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-brand-gold">
//               Sanwariyas
//             </p>
//             <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-mud/40 mt-0.5">
//               A True Story of Elegance
//             </p>
//             {!otpPending && (
//               <>
//                 <h1 className="font-display text-2xl text-brand-african mt-3">
//                   {mode === "signin"
//                     ? "Welcome Back"
//                     : mode === "signup"
//                       ? "Create Account"
//                       : "Password Reset"}
//                 </h1>
//                 <p className="font-sans text-xs text-brand-mud mt-1">
//                   {mode === "signin"
//                     ? "Sign in to your wholesale account."
//                     : mode === "signup"
//                       ? "Register for B2B wholesale access."
//                       : "Securely regain access to your account."}
//                 </p>
//               </>
//             )}
//           </div>

//           {!otpPending && (
//             <div className="flex border-b border-brand-lightgold/30">
//               {[
//                 { key: "signin", label: "Sign In" },
//                 { key: "signup", label: "New Account" },
//               ].map(({ key, label }) => (
//                 <button
//                   key={key}
//                   onClick={() => switchMode(key)}
//                   title={`Switch to ${label}`}
//                   className={`flex-1 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
//                     mode === key || (mode === "forgot" && key === "signin")
//                       ? "border-brand-coffee text-brand-coffee"
//                       : "border-transparent text-brand-mud hover:text-brand-coffee"
//                   }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//           )}

//           <div className="px-8 py-7">
//             {otpPending ? (
//               <OtpScreen
//                 emailHint={emailHint}
//                 devOtp={devOtp}
//                 verifyingOtp={verifyingOtp}
//                 onSubmit={handleOtp}
//                 onBack={handleCancelOtp}
//               />
//             ) : mode === "signin" ? (
//               <SignInForm
//                 onLogin={handleLogin}
//                 loggingIn={loggingIn}
//                 onForgot={() => switchMode("forgot")}
//               />
//             ) : mode === "signup" ? (
//               <SignupForm onSignup={signup} signingUp={signingUp} />
//             ) : (
//               <ForgotPasswordScreen
//                 onBack={() => switchMode("signin")}
//                 onResetSuccess={(msg) => {
//                   showToast(msg, "success");
//                   switchMode("signin");
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
     

// // // FILE: client/src/app/login/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Toast from "@/components/ui/Toast";
import api from "@/lib/api";
import PhoneInput, { splitPhone } from "@/components/ui/PhoneInput";

const inp =
  "w-full border border-brand-lightgold/60 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand-coffee transition-colors";
const lbl =
  "block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2";
const btn =
  "w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-50 disabled:cursor-not-allowed";


// ── OTP Screen (Used for Admin login) ─────────────────────────────────────────
function OtpScreen({ emailHint, devOtp, verifyingOtp, onSubmit, onBack }) {
  const [otp, setOtp] = useState("");
  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-brand-lightgold/30">
        <h2 className="font-display text-2xl text-brand-african">Verify OTP</h2>
        <p className="font-sans text-xs text-brand-mud mt-1">
          A 6-digit code was sent to <strong>{emailHint}</strong>. Valid for 10
          minutes.
        </p>
      </div>
      {devOtp && (
        <p className="font-sans text-xs text-brand-coffee bg-brand-lightgold/20 border border-brand-lightgold/50 px-4 py-3">
          Local dev OTP: <strong>{devOtp}</strong>
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (otp.length === 6) onSubmit(otp);
        }}
        className="space-y-5"
        noValidate
        aria-label="OTP Verification Form"
      >
        <div>
          <label className={lbl}>One-Time Password</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="• • • • • •"
            aria-label="Enter 6-digit OTP"
            className={`${inp} text-center text-2xl tracking-[0.6em] font-mono`}
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={verifyingOtp || otp.length !== 6}
          className={btn}
          title="Verify OTP and Sign In"
        >
          {verifyingOtp ? "Verifying..." : "Verify & Sign In"}
        </button>
        <button
          type="button"
          onClick={onBack}
          title="Go back to login screen"
          className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee transition-colors"
        >
          ← Back
        </button>
      </form>
    </div>
  );
}

// ── Forgot Password Screen

function ForgotPasswordScreen({ onBack, onResetSuccess }) {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localErr, setLocalErr] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    setLocalErr("");
    try {
      const res = await api.post("/auth/forgot-password", {
        identifier: identifier.trim(),
      });
      if (res.data.success) {
        setStep(2);
      }
    } catch (err) {
      setLocalErr(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!otp || newPassword.length < 8) {
      setLocalErr("OTP is required and Password must be at least 8 chars.");
      return;
    }
    setLoading(true);
    setLocalErr("");
    try {
      const res = await api.post("/auth/reset-password", {
        email: identifier.trim().toLowerCase(),
        otp,
        newPassword,
      });
      if (res.data.success) onResetSuccess(res.data.message);
    } catch (err) {
      setLocalErr(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-brand-lightgold/30">
        <h2 className="font-display text-2xl text-brand-african">
          Reset Password
        </h2>
        <p className="font-sans text-xs text-brand-mud mt-1">
          {step === 1
            ? "Enter your email or phone to receive a reset code."
            : `An OTP was sent to ${identifier}`}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div>
            <label className={lbl}>Email or Phone</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              className={inp}
              required
            />
          </div>
          {localErr && (
            <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
              {localErr}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !identifier.trim()}
            className={btn}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee"
          >
            ← Back to Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className={lbl}>Enter 6-digit OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className={`${inp} text-center tracking-[0.4em] font-mono`}
              required
            />
          </div>
          <div>
            <label className={lbl}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={inp}
              required
            />
          </div>
          {localErr && (
            <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
              {localErr}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || otp.length !== 6 || newPassword.length < 8}
            className={btn}
          >
            {loading ? "Resetting..." : "Confirm & Reset"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee"
          >
            ← Go Back
          </button>
        </form>
      )}
    </div>
  );
}

// ── Sign In Form ──────────────────────────────────────────────────────────────
function SignInForm({ onLogin, loggingIn, onForgot }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(identifier.trim(), password);
      }}
      className="space-y-5"
      noValidate
      aria-label="B2B Wholesale Portal Sign In Form"
    >
      <div>
        <label className={lbl}>Email or Phone</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com or +91..."
          className={inp}
          autoComplete="username"
          aria-label="Email or Phone Number for B2B Login"
          required
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={`${lbl} !mb-0`}>Password</label>
          <button
            type="button"
            onClick={onForgot}
            className="font-sans text-[10px] text-brand-coffee hover:underline uppercase tracking-wider transition-colors"
          >
            Forgot Password?
          </button>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inp}
          autoComplete="current-password"
          aria-label="Password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loggingIn || !identifier.trim() || !password.trim()}
        className={btn}
        title="Sign In to Wholesale Dashboard"
      >
        {loggingIn ? "Please wait..." : "Sign In"}
      </button>
    </form>
  );
}

// ── Signup Form ───────────────────────────────────────────────────────────────
function SignupForm({ onSignup, signingUp }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    company: "",
    country: "",
  });
  const [localErr, setLocalErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalErr("");

    const trimmedName = form.name.trim();
    if (trimmedName.length < 3) {
      setLocalErr("Please enter a valid full name (min 3 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setLocalErr(
        "Please enter a valid email address (e.g., user@example.com).",
      );
      return;
    }

    const cleanedPhone = form.phone.trim();
    if (!/^[0-9]{8,15}$/.test(cleanedPhone)) {
      setLocalErr("Please select a country code and enter your phone number.");
      return;
    }

    if (form.password !== form.confirm) {
      setLocalErr("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setLocalErr("Password must be at least 8 characters.");
      return;
    }

    const { confirm, ...payload } = form;
    onSignup({
      ...payload,
      name: trimmedName,
      email: payload.email.trim().toLowerCase(),
      phone: cleanedPhone,
      countryCode: splitPhone(cleanedPhone).dial,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
      aria-label="B2B Wholesale Buyer Registration Form"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Full Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
            aria-label="Full Name"
            className={inp}
            required
          />
        </div>
        <div>
          <label className={lbl}>Phone *</label>
          <PhoneInput
            value={form.phone}
            onChange={(combined) =>
              setForm((f) => ({ ...f, phone: combined }))
            }
            className="flex items-stretch w-full border border-brand-lightgold/60 bg-white text-sm focus-within:border-brand-coffee transition-colors"
            textClassName="text-brand-mud"
            required
          />
        </div>
      </div>
      <div>
        <label className={lbl}>Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="you@example.com"
          aria-label="Email Address"
          className={inp}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Company</label>
          <input
            type="text"
            value={form.company}
            onChange={set("company")}
            placeholder="Your company"
            aria-label="Company Name"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Country</label>
          <input
            type="text"
            value={form.country}
            onChange={set("country")}
            placeholder="India"
            aria-label="Country"
            className={inp}
          />
        </div>
      </div>
      <div>
        <label className={lbl}>Password *</label>
        <input
          type="password"
          value={form.password}
          onChange={set("password")}
          placeholder="Min. 8 characters"
          aria-label="Password"
          className={inp}
          required
        />
      </div>
      <div>
        <label className={lbl}>Confirm Password *</label>
        <input
          type="password"
          value={form.confirm}
          onChange={set("confirm")}
          placeholder="Repeat password"
          aria-label="Confirm Password"
          className={inp}
          required
        />
      </div>
      {localErr && (
        <p
          className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3"
          role="alert"
        >
          {localErr}
        </p>
      )}
      <button
        type="submit"
        disabled={signingUp}
        className={btn}
        title="Create Wholesale Account"
      >
        {signingUp ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [redirecting, setRedirecting] = useState(false);
    const [returnTo, setReturnTo] = useState("/");   
  const redirectTimeoutRef = useRef(null);
  

  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  const {
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
    isAuthenticated,
    isAdmin,
    isStaff,
    authChecking,
  } = useAuth();

  // ✅ ENTERPRISE FIX: Safe Cleanup of Unmounted Timeouts
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);

      const queryMode = urlParams.get("mode");
      if (
        queryMode === "signup" ||
        queryMode === "signin" ||
        queryMode === "forgot"
      ) {
        setMode(queryMode);
      }

      //  FIX: honor ?redirect=/cart (or /checkout) so a guest who tried to
      // Buy Now / go to checkout lands back where they were after logging in.

      const redirectParam = urlParams.get("redirect");
      if (redirectParam && redirectParam.startsWith("/")) {
        setReturnTo(redirectParam);
      }

      if (urlParams.get("session_expired") === "true") {
        const reason = urlParams.get("reason");
        showToast(
          reason
            ? decodeURIComponent(reason)
            : "Session expired. Please log in again.",
          "error",
        );
        const newUrl = queryMode ? `/login?mode=${queryMode}` : "/login";
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  useEffect(() => {
    if (loginError) {
      showToast(loginError, "error");
      setLoginError("");
    }
  }, [loginError, setLoginError]);

  useEffect(() => {
    if (otpError) showToast(otpError, "error");
  }, [otpError]);

  useEffect(() => {
    if (signupError) {
      showToast(signupError, "error");
      setSignupError("");
    }
  }, [signupError, setSignupError]);

  useEffect(() => {
    if (signupDone) {
      showToast(
        "Account created! Sign in to access your dashboard.",
        "success",
      );
      setMode("signin");
    }
  }, [signupDone]);

  useEffect(() => {
    if (!authChecking && isAuthenticated && !redirecting) {
      router.replace(isAdmin || isStaff ? "/operations-center" : returnTo);
    }
  }, [
    authChecking,
    isAuthenticated,
    isAdmin,
    isStaff,
    redirecting,
    router,
    returnTo,
  ]);

  const switchMode = (m) => {
    setMode(m);
    setLoginError?.("");
    setSignupError?.("");
  };

  const handleLogin = async (identifier, password) => {
    if (!identifier.trim()) {
      showToast("Please enter your email, phone, or username.", "error");
      return;
    }

    const result = await login(identifier, password);

    if (result?.requires2FA) {
      showToast("OTP sent to your registered email.", "success");
    } else if (result?.success && !result?.requires2FA) {
      setRedirecting(true);
      showToast("Login successful. Welcome!", "success");

     redirectTimeoutRef.current = setTimeout(() => {
        if (result.role === "admin" || result.role === "staff") {
          router.push("/operations-center");
        } else {
          router.push(returnTo);
        }
      }, 2000);
    }
  };

  const handleOtp = async (otp) => {
    const result = await submitOtp(otp);
    if (result?.success) {
      setRedirecting(true);
      showToast("Login successful. Welcome!", "success");

      redirectTimeoutRef.current = setTimeout(() => {
        if (result.role === "admin" || result.role === "staff") {
          router.push("/operations-center");
        } else {
          router.push(returnTo); 
        }
      }, 2000);
    }
  };

  const handleCancelOtp = () => {
    cancelOtp();
    showToast("OTP cancelled. Please login again.", "error");
  };

  if (authChecking) {
    return (
      <main className="min-h-screen bg-[#f5efe4] flex items-center justify-center">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-mud/50">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <main
        id="main-content"
        className="min-h-screen bg-[#f5efe4] text-brand-african flex items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md bg-white border border-brand-lightgold/60 shadow-xl">
          <div className="px-8 pt-8 pb-5 border-b border-brand-lightgold/30">
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-brand-gold">
              Sanwariyas
            </p>
            <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-mud/40 mt-0.5">
              A True Story of Elegance
            </p>
            {!otpPending && (
              <>
                <h1 className="font-display text-2xl text-brand-african mt-3">
                  {mode === "signin"
                    ? "Welcome Back"
                    : mode === "signup"
                      ? "Create Account"
                      : "Password Reset"}
                </h1>
                <p className="font-sans text-xs text-brand-mud mt-1">
                  {mode === "signin"
                    ? "Sign in to your wholesale account."
                    : mode === "signup"
                      ? "Register for B2B wholesale access."
                      : "Securely regain access to your account."}
                </p>
              </>
            )}
          </div>

          {!otpPending && (
            <div className="flex border-b border-brand-lightgold/30">
              {[
                { key: "signin", label: "Sign In" },
                { key: "signup", label: "New Account" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => switchMode(key)}
                  title={`Switch to ${label}`}
                  className={`flex-1 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
                    mode === key || (mode === "forgot" && key === "signin")
                      ? "border-brand-coffee text-brand-coffee"
                      : "border-transparent text-brand-mud hover:text-brand-coffee"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="px-8 py-7">
            {otpPending ? (
              <OtpScreen
                emailHint={emailHint}
                devOtp={devOtp}
                verifyingOtp={verifyingOtp}
                onSubmit={handleOtp}
                onBack={handleCancelOtp}
              />
            ) : mode === "signin" ? (
              <SignInForm
                onLogin={handleLogin}
                loggingIn={loggingIn}
                onForgot={() => switchMode("forgot")}
              />
            ) : mode === "signup" ? (
              <SignupForm onSignup={signup} signingUp={signingUp} />
            ) : (
              <ForgotPasswordScreen
                onBack={() => switchMode("signin")}
                onResetSuccess={(msg) => {
                  showToast(msg, "success");
                  switchMode("signin");
                }}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}