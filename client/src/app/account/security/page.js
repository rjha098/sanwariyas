// // FILE: client/src/app/account/security/page.js
// // PURPOSE: Account security for a signed-in CUSTOMER:
// //   - see which sign-in methods the account has (email, password, Google)
// //   - connect Google
// //   - set a password (Google-first accounts)
// //   - add earlier GUEST inquiries to this account (verified with a code sent
// //     to the inquiry email)
// // The account email is read-only here. The account id never changes in any of
// // these flows; the backend takes it from the verified token, never from this
// // page.
// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import api from "@/lib/api";
// import Toast from "@/components/ui/Toast";
// import Footer from "@/components/layout/Footer";
// import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
// import {
//   PASSWORD_CHECKS,
//   validatePassword,
//   validateConfirmPassword,
// } from "@/utils/phoneRules";

// const inp =
//   "w-full min-w-0 border border-[#E8D5A3] px-4 py-3 text-base sm:text-sm bg-white focus:outline-none focus:border-[#574325] transition-colors disabled:opacity-50";
// const lbl =
//   "block font-sans text-[11px] tracking-[0.2em] uppercase text-[#70543E] mb-2";
// const btn =
//   "w-full sm:w-auto bg-[#574325] text-[#FAF3E8] px-6 py-3 font-sans text-xs tracking-[0.25em] uppercase hover:bg-[#3f2f1b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
// const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// // Lockout / resend timers mirrored from what the BACKEND answers.
// function useOtpTimers() {
//   const [lockSeconds, setLockSeconds] = useState(0);
//   const [resendSeconds, setResendSeconds] = useState(0);
//   const [attemptsLeft, setAttemptsLeft] = useState(null);
//   const wasLocked = useRef(false);

//   useEffect(() => {
//     if (lockSeconds <= 0 && resendSeconds <= 0) return undefined;
//     const t = setTimeout(() => {
//       setLockSeconds((s) => (s > 0 ? s - 1 : 0));
//       setResendSeconds((s) => (s > 0 ? s - 1 : 0));
//     }, 1000);
//     return () => clearTimeout(t);
//   }, [lockSeconds, resendSeconds]);

//   const sync = useCallback((d) => {
//     if (!d) return;
//     setLockSeconds(d.locked ? d.retryAfterSeconds || 0 : 0);
//     setResendSeconds(d.resendAfterSeconds || 0);
//     setAttemptsLeft(d.locked ? null : (d.attemptsLeft ?? null));
//   }, []);

//   const fromError = useCallback((err, fallback) => {
//     const d = err.response?.data || {};
//     if (err.response?.status === 429) {
//       if (d.code === "OTP_LOCKED") {
//         setLockSeconds(d.retryAfterSeconds || 60);
//         setResendSeconds(d.retryAfterSeconds || 60);
//         setAttemptsLeft(null);
//         return "";
//       }
//       if (d.resendAfterSeconds) {
//         setResendSeconds(d.resendAfterSeconds);
//         return d.message || "Please wait before requesting another code.";
//       }
//       const ra = parseInt(err.response?.headers?.["retry-after"], 10);
//       setLockSeconds(Number.isFinite(ra) && ra > 0 ? ra : 60);
//       return "";
//     }
//     if (d.attemptsLeft != null) setAttemptsLeft(d.attemptsLeft);
//     return d.message || fallback;
//   }, []);

//   return {
//     lockSeconds,
//     resendSeconds,
//     attemptsLeft,
//     sync,
//     fromError,
//     wasLocked,
//     setResendSeconds,
//   };
// }

// function Section({ id, title, subtitle, children }) {
//   return (
//     <section
//       id={id}
//       className="bg-white border border-[#E8D5A3]/60 rounded-xl p-5 sm:p-7 mb-6 shadow-[0_1px_2px_rgba(87,67,37,0.04)]"
//     >
//       <h2 className="font-display text-xl text-[#574325]">{title}</h2>
//       {subtitle && (
//         <p className="font-sans text-xs text-[#70543E] mt-1 mb-5 leading-relaxed">
//           {subtitle}
//         </p>
//       )}
//       <div className={subtitle ? "" : "mt-5"}>{children}</div>
//     </section>
//   );
// }

// const Msg = ({ children, kind = "error" }) =>
//   children ? (
//     <p
//       className={`font-sans text-xs px-4 py-3 border ${
//         kind === "ok"
//           ? "text-green-800 bg-green-50 border-green-200"
//           : "text-red-700 bg-red-50 border-red-200"
//       }`}
//       role={kind === "ok" ? "status" : "alert"}
//     >
//       {children}
//     </p>
//   ) : null;

// const LockBox = ({ seconds }) =>
//   seconds > 0 ? (
//     <Msg>
//       Too many incorrect attempts. Please try again in{" "}
//       <strong>{mmss(seconds)}</strong>.
//     </Msg>
//   ) : null;

// const IconKey = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
//     <circle cx="8" cy="15" r="4" />
//     <path d="M11 12l9-9M16 7l3 3M14 9l2 2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );
// const IconInbox = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
//     <path d="M3 13l2.5-7.5A2 2 0 017.4 4h9.2a2 2 0 011.9 1.5L21 13v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" strokeLinejoin="round" />
//     <path d="M3 13h5l1.5 2.5h5L16 13h5" strokeLinejoin="round" />
//   </svg>
// );

// const SECTIONS = [
//   { id: "methods", label: "Sign-in Methods", hint: "Email, password and Google", Icon: IconKey },
//   { id: "claim", label: "Add Earlier Inquiries", hint: "Link inquiries sent as a guest", Icon: IconInbox },
// ];

// const StatusPill = ({ ok, children }) => (
//   <span
//     className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[11px] tracking-wide whitespace-nowrap ${
//       ok
//         ? "bg-green-50 text-green-800 border-green-200"
//         : "bg-[#FAF3E8] text-[#70543E] border-[#E8D5A3]"
//     }`}
//   >
//     <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-600" : "bg-[#C9A84C]"}`} />
//     {children}
//   </span>
// );

// const MethodRow = ({ title, detail, ok, status }) => (
//   <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 py-4 border-t border-[#E8D5A3]/60 first:border-t-0">
//     <div className="min-w-0">
//       <p className="font-sans text-sm font-semibold text-[#574325]">{title}</p>
//       <p className="font-sans text-xs text-[#70543E] mt-0.5 leading-relaxed">{detail}</p>
//     </div>
//     <StatusPill ok={ok}>{status}</StatusPill>
//   </div>
// );

// export default function AccountSecurityPage() {
//   const router = useRouter();
//   const { token, isAuthenticated, authChecking, isAdmin, isStaff } = useAuth();
//   const cfg = { headers: { Authorization: `Bearer ${token}` }, skipRateLimitRetry: true };

//   const [security, setSecurity] = useState(null);
//   const [active, setActive] = useState("methods");
//   const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });
//   const showToast = (message, type = "success") =>
//     setToast({ isVisible: true, message, type });

//   const loadSecurity = useCallback(async () => {
//     try {
//       const res = await api.get("/auth/security", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSecurity(res.data.security);
//     } catch {
//       showToast("Could not load your account details.", "error");
//     }
//   }, [token]);

//   useEffect(() => {
//     if (authChecking) return;
//     if (!isAuthenticated) {
//       router.replace("/login?redirect=/account/security");
//       return;
//     }
//     if (token && !isAdmin && !isStaff) loadSecurity();
//   }, [authChecking, isAuthenticated, isAdmin, isStaff, token, router, loadSecurity]);

//   // Open the section named in the URL hash (e.g. /account/security#claim).
//   useEffect(() => {
//     const fromHash = () => {
//       const id = window.location.hash.replace("#", "");
//       if (SECTIONS.some((s) => s.id === id)) setActive(id);
//     };
//     fromHash();
//     window.addEventListener("hashchange", fromHash);
//     return () => window.removeEventListener("hashchange", fromHash);
//   }, []);

//   const selectSection = (id) => {
//     setActive(id);
//     window.history.replaceState(null, "", `#${id}`);
//   };

//   if (authChecking || !isAuthenticated) {
//     return (
//       <main className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
//         <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#70543E]/60">
//           Loading...
//         </p>
//       </main>
//     );
//   }

//   if (isAdmin || isStaff) {
//     return (
//       <main className="min-h-screen bg-[#FAF3E8] flex items-center justify-center px-4">
//         <p className="font-sans text-sm text-[#70543E]">
//           Account security is available for customer accounts only.
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
//         onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
//       />
//       <main className="min-h-screen bg-[#FAF3E8] pt-8 pb-28 sm:pt-28 sm:pb-16 px-4">
//         <div className="max-w-5xl mx-auto">
//           <button
//             onClick={() => router.push("/dashboard")}
//             className="mb-6 font-sans text-[10px] tracking-widest uppercase text-[#70543E] hover:text-[#574325] border-b border-[#70543E] pb-1 transition-colors"
//           >
//             ← Back to Dashboard
//           </button>

//           <header className="mb-8">
//             <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] font-semibold mb-2">
//               Account
//             </p>
//             <h1 className="font-display text-3xl sm:text-4xl text-[#574325]">
//               Account Security
//             </h1>
//             <p className="font-sans text-sm text-[#70543E] mt-2 max-w-xl leading-relaxed">
//               See how you sign in to SANWARIYAS and keep your inquiries connected
//               to your account.
//             </p>
//           </header>

//           <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 items-start">
//             <nav
//               aria-label="Account security sections"
//               className="mb-6 lg:mb-0 lg:sticky lg:top-28"
//             >
//               <div className="bg-white border border-[#E8D5A3]/60 rounded-xl p-2 flex flex-col gap-1 shadow-[0_1px_2px_rgba(87,67,37,0.04)]">
//                 {SECTIONS.map(({ id, label, hint, Icon }) => {
//                   const on = active === id;
//                   return (
//                     <button
//                       key={id}
//                       type="button"
//                       onClick={() => selectSection(id)}
//                       aria-current={on ? "page" : undefined}
//                       className={`flex w-full items-start gap-3 text-left rounded-lg px-4 py-3 transition-colors ${
//                         on
//                           ? "bg-[#574325] text-[#FAF3E8]"
//                           : "text-[#574325] hover:bg-[#FAF3E8]"
//                       }`}
//                     >
//                       <span className={on ? "text-[#C9A84C]" : "text-[#70543E]"}>
//                         <Icon />
//                       </span>
//                       <span className="min-w-0">
//                         <span className="block font-sans text-sm font-semibold">
//                           {label}
//                         </span>
//                         <span
//                           className={`block font-sans text-[11px] mt-0.5 ${
//                             on ? "text-[#FAF3E8]/70" : "text-[#70543E]/80"
//                           }`}
//                         >
//                           {hint}
//                         </span>
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </nav>

//             <div className="min-w-0">
//               {active === "methods" && (
//                 <>
//                   <Section
//                     title="Sign-in methods"
//                     subtitle="The ways you can access your SANWARIYAS account."
//                   >
//                     {!security ? (
//                       <p className="font-sans text-sm text-[#70543E]">Loading...</p>
//                     ) : (
//                       <>
//                         <div className="mb-5">
//                           <label htmlFor="account-email" className={lbl}>
//                             Email address
//                           </label>
//                           <input
//                             id="account-email"
//                             type="email"
//                             readOnly
//                             value={security.email || ""}
//                             className={`${inp.replace("bg-white", "bg-[#FAF3E8]/60")} text-[#574325] cursor-not-allowed`}
//                           />
//                         </div>
//                         <MethodRow
//                           title="Password"
//                           detail={
//                             security.hasPassword
//                               ? "You can sign in with your email and password."
//                               : "Not set. Add one to also sign in with your email."
//                           }
//                           ok={!!security.hasPassword}
//                           status={security.hasPassword ? "Set" : "Not set"}
//                         />
//                         <MethodRow
//                           title="Google"
//                           detail={
//                             security.googleLinked
//                               ? "You can sign in with your Google account."
//                               : "Connect Google to sign in with one click."
//                           }
//                           ok={!!security.googleLinked}
//                           status={security.googleLinked ? "Connected" : "Not connected"}
//                         />
//                       </>
//                     )}
//                   </Section>

//                   {security && !security.googleLinked && (
//                     <ConnectGoogle
//                       cfg={cfg}
//                       onDone={(msg) => {
//                         showToast(msg);
//                         loadSecurity();
//                       }}
//                       onError={(msg) => showToast(msg, "error")}
//                     />
//                   )}

//                   {security && !security.hasPassword && (
//                     <SetPassword
//                       cfg={cfg}
//                       onDone={(msg) => {
//                         showToast(msg);
//                         loadSecurity();
//                       }}
//                     />
//                   )}
//                 </>
//               )}

//               {active === "claim" &&
//                 (security ? (
//                   <ClaimInquiries
//                     cfg={cfg}
//                     accountEmail={security.email}
//                     onDone={(msg) => showToast(msg)}
//                   />
//                 ) : (
//                   <Section title="Add earlier inquiries">
//                     <p className="font-sans text-sm text-[#70543E]">Loading...</p>
//                   </Section>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }

// // ── Connect Google ───────────────────────────────────────────────────────
// function ConnectGoogle({ cfg, onDone, onError }) {
//   const [busy, setBusy] = useState(false);
//   const handleCredential = async (credential) => {
//     setBusy(true);
//     try {
//       const res = await api.post("/auth/google/link", { credential }, cfg);
//       onDone(res.data.message || "Google connected.");
//     } catch (err) {
//       onError(err.response?.data?.message || "Could not connect Google.");
//     } finally {
//       setBusy(false);
//     }
//   };
//   if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;
//   return (
//     <Section
//       title="Connect Google"
//       subtitle="Link your Google account so you can also sign in with Google. Your account, inquiries and orders stay the same."
//     >
//       <GoogleSignInButton onCredential={handleCredential} disabled={busy} />
//     </Section>
//   );
// }

// // ── Set password (Google-first accounts) ─────────────────────────────────
// function SetPassword({ cfg, onDone }) {
//   const t = useOtpTimers();
//   const [sent, setSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [pw, setPw] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [err, setErr] = useState("");
//   const [busy, setBusy] = useState(false);
//   const locked = t.lockSeconds > 0;

//   useEffect(() => {
//     api
//       .get("/auth/account/otp-status?flow=setpw", cfg)
//       .then((r) => {
//         t.sync(r.data);
//         if (r.data.resendAfterSeconds > 0 || r.data.locked) setSent(true);
//       })
//       .catch(() => {});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const request = async () => {
//     setBusy(true);
//     setErr("");
//     try {
//       const res = await api.post("/auth/password/set/request", {}, cfg);
//       setSent(true);
//       t.setResendSeconds(res.data.resendAfterSeconds || 60);
//     } catch (e) {
//       setErr(t.fromError(e, "Could not send the code."));
//     } finally {
//       setBusy(false);
//     }
//   };

//   const confirm_ = async (e) => {
//     e.preventDefault();
//     const pwErr = validatePassword(pw) || validateConfirmPassword(pw, confirm);
//     if (pwErr) return setErr(pwErr);
//     setBusy(true);
//     setErr("");
//     try {
//       const res = await api.post(
//         "/auth/password/set/confirm",
//         { otp, newPassword: pw, confirmPassword: confirm },
//         cfg,
//       );
//       onDone(res.data.message);
//     } catch (e2) {
//       setOtp("");
//       setErr(t.fromError(e2, "Could not set the password."));
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <Section
//       title="Set a password"
//       subtitle="You signed up with Google. Add a password to also sign in with your email. We email a code to your account email to confirm it is you."
//     >
//       {!sent ? (
//         <button onClick={request} disabled={busy || locked} className={btn}>
//           {busy ? "Sending..." : "Send code to my email"}
//         </button>
//       ) : (
//         <form onSubmit={confirm_} className="space-y-4" noValidate>
//           <div>
//             <label className={lbl}>6-digit code</label>
//             <input
//               className={`${inp} text-center tracking-[0.4em] font-mono`}
//               inputMode="numeric"
//               maxLength={6}
//               value={otp}
//               disabled={locked}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//             />
//           </div>
//           <div>
//             <label className={lbl}>New password</label>
//             <input type="password" autoComplete="new-password" className={inp} value={pw} disabled={locked} onChange={(e) => setPw(e.target.value)} />
//             {pw.length > 0 && (
//               <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
//                 {PASSWORD_CHECKS.map((c) => (
//                   <li key={c.key} className={`font-sans text-[11px] ${c.test(pw) ? "text-green-700" : "text-[#70543E]/70"}`}>
//                     {c.test(pw) ? "✓" : "○"} {c.label}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//           <div>
//             <label className={lbl}>Confirm password</label>
//             <input type="password" autoComplete="new-password" className={inp} value={confirm} disabled={locked} onChange={(e) => setConfirm(e.target.value)} />
//           </div>
//           <LockBox seconds={t.lockSeconds} />
//           {!locked && t.attemptsLeft != null && t.attemptsLeft < 5 && (
//             <p className="font-sans text-[11px] text-[#70543E]">{t.attemptsLeft} attempt(s) left.</p>
//           )}
//           <Msg>{err}</Msg>
//           <div className="flex flex-wrap items-center gap-4">
//             <button type="submit" disabled={busy || locked || otp.length !== 6 || !pw || !confirm} className={btn}>
//               {busy ? "Saving..." : "Set password"}
//             </button>
//             {!locked && (
//               <button type="button" onClick={request} disabled={busy || t.resendSeconds > 0} className="font-sans text-xs text-[#70543E] underline disabled:opacity-50 disabled:no-underline">
//                 {t.resendSeconds > 0 ? `Resend code in ${t.resendSeconds}s` : "Resend code"}
//               </button>
//             )}
//           </div>
//         </form>
//       )}
//       {!sent && <Msg>{err}</Msg>}
//     </Section>
//   );
// }

// // ── Claim earlier guest inquiries ────────────────────────────────────────
// function ClaimInquiries({ cfg, accountEmail, onDone }) {
//   const t = useOtpTimers();
//   const [sent, setSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [err, setErr] = useState("");
//   const [info, setInfo] = useState("");
//   const [busy, setBusy] = useState(false);
//   const locked = t.lockSeconds > 0;

//   const request = async (e) => {
//     e?.preventDefault();
//     setBusy(true);
//     setErr("");
//     try {
//       const res = await api.post("/inquiry/claim/request", {}, cfg);
//       setSent(true);
//       setInfo(res.data.message);
//       t.setResendSeconds(res.data.resendAfterSeconds || 60);
//     } catch (e2) {
//       setErr(t.fromError(e2, "Could not send the code."));
//     } finally {
//       setBusy(false);
//     }
//   };

//   const confirm = async (e) => {
//     e.preventDefault();
//     setBusy(true);
//     setErr("");
//     try {
//       const res = await api.post("/inquiry/claim/confirm", { otp }, cfg);
//       setSent(false);
//       setOtp("");
//       onDone(res.data.message);
//     } catch (e2) {
//       setOtp("");
//       setErr(t.fromError(e2, "Could not verify the code."));
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <Section
//       id="claim"
//       title="Add earlier inquiries"
//       subtitle="Sent an inquiry as a guest using your account email? We send a code to that email, and after you confirm, those inquiries and their replies appear in My Inquiries."
//     >
//       {!sent ? (
//         <form onSubmit={request} className="space-y-4" noValidate>
//           <div>
//             <label className={lbl}>Inquiry email</label>
//             <input type="email" className={`${inp} bg-[#FAF3E8] cursor-not-allowed`} value={accountEmail} readOnly disabled />
//             <p className="font-sans text-[11px] text-[#70543E]/80 mt-2">
//               Only inquiries sent with your account email can be added.
//             </p>
//           </div>
//           <LockBox seconds={t.lockSeconds} />
//           <Msg>{err}</Msg>
//           <button type="submit" disabled={busy || locked || t.resendSeconds > 0} className={btn}>
//             {busy ? "Sending..." : t.resendSeconds > 0 && !locked ? `Wait ${t.resendSeconds}s` : "Send code"}
//           </button>
//         </form>
//       ) : (
//         <form onSubmit={confirm} className="space-y-4" noValidate>
//           <Msg kind="ok">{info}</Msg>
//           <div>
//             <label className={lbl}>6-digit code</label>
//             <input className={`${inp} text-center tracking-[0.4em] font-mono`} inputMode="numeric" maxLength={6} value={otp} disabled={locked} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
//           </div>
//           <LockBox seconds={t.lockSeconds} />
//           {!locked && t.attemptsLeft != null && t.attemptsLeft < 5 && (
//             <p className="font-sans text-[11px] text-[#70543E]">{t.attemptsLeft} attempt(s) left.</p>
//           )}
//           <Msg>{err}</Msg>
//           <div className="flex flex-wrap items-center gap-4">
//             <button type="submit" disabled={busy || locked || otp.length !== 6} className={btn}>
//               {busy ? "Verifying..." : "Add my inquiries"}
//             </button>
//             {!locked && (
//               <button type="button" onClick={() => request()} disabled={busy || t.resendSeconds > 0} className="font-sans text-xs text-[#70543E] underline disabled:opacity-50 disabled:no-underline">
//                 {t.resendSeconds > 0 ? `Resend code in ${t.resendSeconds}s` : "Resend code"}
//               </button>
//             )}
//           </div>
//         </form>
//       )}
//     </Section>
//   );
// }

// FILE: client/src/app/account/security/page.js
// PURPOSE: Account security for a signed-in CUSTOMER:
//   - see which sign-in methods the account has (email, password, Google)
//   - connect Google
//   - set a password (Google-first accounts)
//   - add earlier GUEST inquiries to this account (verified with a code sent
//     to the inquiry email)
// The account email is read-only here. The account id never changes in any of
// these flows; the backend takes it from the verified token, never from this
// page.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import Toast from "@/components/ui/Toast";
import Footer from "@/components/layout/Footer";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import {
  PASSWORD_CHECKS,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/phoneRules";

const inp =
  "w-full min-w-0 border border-[#E8D5A3] px-4 py-3 text-base sm:text-sm bg-white focus:outline-none focus:border-[#574325] transition-colors disabled:opacity-50";
const lbl =
  "block font-sans text-[11px] tracking-[0.2em] uppercase text-[#70543E] mb-2";
const btn =
  "w-full sm:w-auto bg-[#574325] text-[#FAF3E8] px-6 py-3 font-sans text-xs tracking-[0.25em] uppercase hover:bg-[#3f2f1b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Lockout / resend timers mirrored from what the BACKEND answers.
function useOtpTimers() {
  const [lockSeconds, setLockSeconds] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const wasLocked = useRef(false);

  useEffect(() => {
    if (lockSeconds <= 0 && resendSeconds <= 0) return undefined;
    const t = setTimeout(() => {
      setLockSeconds((s) => (s > 0 ? s - 1 : 0));
      setResendSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearTimeout(t);
  }, [lockSeconds, resendSeconds]);

  const sync = useCallback((d) => {
    if (!d) return;
    setLockSeconds(d.locked ? d.retryAfterSeconds || 0 : 0);
    setResendSeconds(d.resendAfterSeconds || 0);
    setAttemptsLeft(d.locked ? null : (d.attemptsLeft ?? null));
  }, []);

  const fromError = useCallback((err, fallback) => {
    const d = err.response?.data || {};
    if (err.response?.status === 429) {
      if (d.code === "OTP_LOCKED") {
        setLockSeconds(d.retryAfterSeconds || 60);
        setResendSeconds(d.retryAfterSeconds || 60);
        setAttemptsLeft(null);
        return "";
      }
      if (d.resendAfterSeconds) {
        setResendSeconds(d.resendAfterSeconds);
        return d.message || "Please wait before requesting another code.";
      }
      const ra = parseInt(err.response?.headers?.["retry-after"], 10);
      setLockSeconds(Number.isFinite(ra) && ra > 0 ? ra : 60);
      return "";
    }
    if (d.attemptsLeft != null) setAttemptsLeft(d.attemptsLeft);
    return d.message || fallback;
  }, []);

  return {
    lockSeconds,
    resendSeconds,
    attemptsLeft,
    sync,
    fromError,
    wasLocked,
    setResendSeconds,
  };
}

function Section({ id, title, subtitle, children }) {
  return (
    <section
      id={id}
      className="bg-white border border-[#E8D5A3]/60 rounded-xl p-5 sm:p-7 mb-6 shadow-[0_1px_2px_rgba(87,67,37,0.04)]"
    >
      <h2 className="font-display text-xl text-[#574325]">{title}</h2>
      {subtitle && (
        <p className="font-sans text-xs text-[#70543E] mt-1 mb-5 leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={subtitle ? "" : "mt-5"}>{children}</div>
    </section>
  );
}

const Msg = ({ children, kind = "error" }) =>
  children ? (
    <p
      className={`font-sans text-xs px-4 py-3 border ${
        kind === "ok"
          ? "text-green-800 bg-green-50 border-green-200"
          : "text-red-700 bg-red-50 border-red-200"
      }`}
      role={kind === "ok" ? "status" : "alert"}
    >
      {children}
    </p>
  ) : null;

const LockBox = ({ seconds }) =>
  seconds > 0 ? (
    <Msg>
      Too many incorrect attempts. Please try again in{" "}
      <strong>{mmss(seconds)}</strong>.
    </Msg>
  ) : null;

const IconKey = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="w-5 h-5 flex-shrink-0"
    aria-hidden="true"
  >
    <circle cx="8" cy="15" r="4" />
    <path
      d="M11 12l9-9M16 7l3 3M14 9l2 2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconInbox = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="w-5 h-5 flex-shrink-0"
    aria-hidden="true"
  >
    <path
      d="M3 13l2.5-7.5A2 2 0 017.4 4h9.2a2 2 0 011.9 1.5L21 13v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z"
      strokeLinejoin="round"
    />
    <path d="M3 13h5l1.5 2.5h5L16 13h5" strokeLinejoin="round" />
  </svg>
);

const SECTIONS = [
  {
    id: "methods",
    label: "Sign-in Methods",
    hint: "Email, password and Google",
    Icon: IconKey,
  },
  {
    id: "claim",
    label: "Add Earlier Inquiries",
    hint: "Link inquiries sent as a guest",
    Icon: IconInbox,
  },
];

const StatusPill = ({ ok, children }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[11px] tracking-wide whitespace-nowrap ${
      ok
        ? "bg-green-50 text-green-800 border-green-200"
        : "bg-[#FAF3E8] text-[#70543E] border-[#E8D5A3]"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-600" : "bg-[#C9A84C]"}`}
    />
    {children}
  </span>
);

const MethodRow = ({ title, detail, ok, status }) => (
  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 py-4 border-t border-[#E8D5A3]/60 first:border-t-0">
    <div className="min-w-0">
      <p className="font-sans text-sm font-semibold text-[#574325]">{title}</p>
      <p className="font-sans text-xs text-[#70543E] mt-0.5 leading-relaxed">
        {detail}
      </p>
    </div>
    <StatusPill ok={ok}>{status}</StatusPill>
  </div>
);

export default function AccountSecurityPage() {
  const router = useRouter();
  const { token, isAuthenticated, authChecking, isAdmin, isStaff } = useAuth();
  const cfg = {
    headers: { Authorization: `Bearer ${token}` },
    skipRateLimitRetry: true,
  };

  const [security, setSecurity] = useState(null);
  const [active, setActive] = useState("methods");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });

  const loadSecurity = useCallback(async () => {
    try {
      const res = await api.get("/auth/security", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSecurity(res.data.security);
    } catch {
      showToast("Could not load your account details.", "error");
    }
  }, [token]);

  useEffect(() => {
    if (authChecking) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/account/security");
      return;
    }
    if (token && !isAdmin && !isStaff) loadSecurity();
  }, [
    authChecking,
    isAuthenticated,
    isAdmin,
    isStaff,
    token,
    router,
    loadSecurity,
  ]);

  // Open the section named in the URL hash (e.g. /account/security#claim).
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (SECTIONS.some((s) => s.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const selectSection = (id) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  if (authChecking || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#70543E]/60">
          Loading...
        </p>
      </main>
    );
  }

  if (isAdmin || isStaff) {
    return (
      <main className="min-h-screen bg-[#FAF3E8] flex items-center justify-center px-4">
        <p className="font-sans text-sm text-[#70543E]">
          Account security is available for customer accounts only.
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
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
      />
      <main className="min-h-screen bg-[#FAF3E8] pt-8 pb-28 sm:pt-28 sm:pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-6 font-sans text-[10px] tracking-widest uppercase text-[#70543E] hover:text-[#574325] border-b border-[#70543E] pb-1 transition-colors"
          >
            ← Back to Dashboard
          </button>

          <header className="mb-8">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A84C] font-semibold mb-2">
              Account
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-[#574325]">
              Account Security
            </h1>
            <p className="font-sans text-sm text-[#70543E] mt-2 max-w-xl leading-relaxed">
              See how you sign in to SANWARIYAS and keep your inquiries
              connected to your account.
            </p>
          </header>

          <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 items-start">
            <nav
              aria-label="Account security sections"
              className="mb-6 lg:mb-0 lg:sticky lg:top-28"
            >
              <div className="bg-white border border-[#E8D5A3]/60 rounded-xl p-2 flex flex-col gap-1 shadow-[0_1px_2px_rgba(87,67,37,0.04)]">
                {SECTIONS.map(({ id, label, hint, Icon }) => {
                  const on = active === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectSection(id)}
                      aria-current={on ? "page" : undefined}
                      className={`flex w-full items-start gap-3 text-left rounded-lg px-4 py-3 transition-colors ${
                        on
                          ? "bg-[#574325] text-[#FAF3E8]"
                          : "text-[#574325] hover:bg-[#FAF3E8]"
                      }`}
                    >
                      <span
                        className={on ? "text-[#C9A84C]" : "text-[#70543E]"}
                      >
                        <Icon />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-sans text-sm font-semibold">
                          {label}
                        </span>
                        <span
                          className={`block font-sans text-[11px] mt-0.5 ${
                            on ? "text-[#FAF3E8]/70" : "text-[#70543E]/80"
                          }`}
                        >
                          {hint}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="min-w-0">
              {active === "methods" && (
                <>
                  <Section
                    title="Sign-in methods"
                    subtitle="The ways you can access your SANWARIYAS account."
                  >
                    {!security ? (
                      <p className="font-sans text-sm text-[#70543E]">
                        Loading...
                      </p>
                    ) : (
                      <>
                        <div className="mb-5">
                          <label htmlFor="account-email" className={lbl}>
                            Email address
                          </label>
                          <input
                            id="account-email"
                            type="email"
                            readOnly
                            value={security.email || ""}
                            className={`${inp.replace("bg-white", "bg-[#FAF3E8]/60")} text-[#574325] cursor-not-allowed`}
                          />
                        </div>
                        <MethodRow
                          title="Password"
                          detail={
                            security.hasPassword
                              ? "You can sign in with your email and password."
                              : "Not set. Add one to also sign in with your email."
                          }
                          ok={!!security.hasPassword}
                          status={security.hasPassword ? "Set" : "Not set"}
                        />
                        <MethodRow
                          title="Google"
                          detail={
                            security.googleLinked
                              ? "You can sign in with your Google account."
                              : "Connect Google to sign in with one click."
                          }
                          ok={!!security.googleLinked}
                          status={
                            security.googleLinked
                              ? "Connected"
                              : "Not connected"
                          }
                        />
                      </>
                    )}
                  </Section>

                  {security && !security.googleLinked && (
                    <ConnectGoogle
                      cfg={cfg}
                      onDone={(msg) => {
                        showToast(msg);
                        loadSecurity();
                      }}
                      onError={(msg) => showToast(msg, "error")}
                    />
                  )}

                  {security && !security.hasPassword && (
                    <SetPassword
                      cfg={cfg}
                      onDone={(msg) => {
                        showToast(msg);
                        loadSecurity();
                      }}
                    />
                  )}
                </>
              )}

              {active === "claim" &&
                (security ? (
                  <ClaimInquiries
                    cfg={cfg}
                    accountEmail={security.email}
                    onDone={(msg) => showToast(msg)}
                  />
                ) : (
                  <Section title="Add earlier inquiries">
                    <p className="font-sans text-sm text-[#70543E]">
                      Loading...
                    </p>
                  </Section>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── Connect Google ───────────────────────────────────────────────────────
function ConnectGoogle({ cfg, onDone, onError }) {
  const [busy, setBusy] = useState(false);
  const handleCredential = async (credential) => {
    setBusy(true);
    try {
      const res = await api.post("/auth/google/link", { credential }, cfg);
      onDone(res.data.message || "Google connected.");
    } catch (err) {
      onError(err.response?.data?.message || "Could not connect Google.");
    } finally {
      setBusy(false);
    }
  };
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;
  return (
    <Section
      title="Connect Google"
      subtitle="Link your Google account so you can also sign in with Google. Your account, inquiries and orders stay the same."
    >
      <GoogleSignInButton onCredential={handleCredential} disabled={busy} />
    </Section>
  );
}

// ── Set password (Google-first accounts) ─────────────────────────────────
function SetPassword({ cfg, onDone }) {
  const t = useOtpTimers();
  const [sent, setSent] = useState(false);
  // "code" = enter the emailed code, "password" = code verified, choose password
  const [step, setStep] = useState("code");
  const [verifyToken, setVerifyToken] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const locked = t.lockSeconds > 0;

  useEffect(() => {
    api
      .get("/auth/account/otp-status?flow=setpw", cfg)
      .then((r) => {
        t.sync(r.data);
        if (r.data.resendAfterSeconds > 0 || r.data.locked) setSent(true);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const request = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await api.post("/auth/password/set/request", {}, cfg);
      setSent(true);
      setStep("code");
      setVerifyToken("");
      setOtp("");
      t.setResendSeconds(res.data.resendAfterSeconds || 60);
    } catch (e) {
      setErr(t.fromError(e, "Could not send the code."));
    } finally {
      setBusy(false);
    }
  };

  // Step 1: check the code on its own, before any password is asked for.
  const verifyCode = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setErr("Enter the 6-digit code.");
    setBusy(true);
    setErr("");
    try {
      const res = await api.post("/auth/password/set/verify", { otp }, cfg);
      setVerifyToken(res.data.verifyToken);
      setStep("password");
    } catch (e2) {
      setOtp("");
      setErr(t.fromError(e2, "Could not verify the code."));
    } finally {
      setBusy(false);
    }
  };

  // Step 2: set the new password using the verification token.
  const savePassword = async (e) => {
    e.preventDefault();
    const pwErr = validatePassword(pw) || validateConfirmPassword(pw, confirm);
    if (pwErr) return setErr(pwErr);
    setBusy(true);
    setErr("");
    try {
      const res = await api.post(
        "/auth/password/set/confirm",
        { verifyToken, newPassword: pw, confirmPassword: confirm },
        cfg,
      );
      onDone(res.data.message);
    } catch (e2) {
      const message = e2?.response?.data?.message || "";
      if (/expired/i.test(message)) {
        // verification ran out: go back and ask for a fresh code
        setStep("code");
        setVerifyToken("");
        setOtp("");
        setPw("");
        setConfirm("");
      }
      setErr(t.fromError(e2, "Could not set the password."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      title="Set a password"
      subtitle="You signed up with Google. Add a password to also sign in with your email. We email a code to your account email to confirm it is you."
    >
      {!sent ? (
        <button onClick={request} disabled={busy || locked} className={btn}>
          {busy ? "Sending..." : "Send code to my email"}
        </button>
      ) : step === "code" ? (
        <form onSubmit={verifyCode} className="space-y-4" noValidate>
          <div>
            <label className={lbl}>6-digit code</label>
            <input
              className={`${inp} text-center tracking-[0.4em] font-mono`}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              disabled={locked}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <LockBox seconds={t.lockSeconds} />
          {!locked && t.attemptsLeft != null && t.attemptsLeft < 5 && (
            <p className="font-sans text-[11px] text-[#70543E]">
              {t.attemptsLeft} attempt(s) left.
            </p>
          )}
          <Msg>{err}</Msg>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={busy || locked || otp.length !== 6}
              className={btn}
            >
              {busy ? "Verifying..." : "Verify code"}
            </button>
            {!locked && (
              <button
                type="button"
                onClick={request}
                disabled={busy || t.resendSeconds > 0}
                className="font-sans text-xs text-[#70543E] underline disabled:opacity-50 disabled:no-underline"
              >
                {t.resendSeconds > 0
                  ? `Resend code in ${t.resendSeconds}s`
                  : "Resend code"}
              </button>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={savePassword} className="space-y-4" noValidate>
          <p className="font-sans text-xs text-green-700">
            Code verified. Now choose your new password.
          </p>
          <div>
            <label className={lbl}>New password</label>
            <input
              type="password"
              autoComplete="new-password"
              className={inp}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            {pw.length > 0 && (
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                {PASSWORD_CHECKS.map((c) => (
                  <li
                    key={c.key}
                    className={`font-sans text-[11px] ${c.test(pw) ? "text-green-700" : "text-[#70543E]/70"}`}
                  >
                    {c.test(pw) ? "\u2713" : "\u25CB"} {c.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className={lbl}>Confirm password</label>
            <input
              type="password"
              autoComplete="new-password"
              className={inp}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Msg>{err}</Msg>
          <button
            type="submit"
            disabled={busy || !pw || !confirm}
            className={btn}
          >
            {busy ? "Saving..." : "Set password"}
          </button>
        </form>
      )}
      {!sent && <Msg>{err}</Msg>}
    </Section>
  );
}

// ── Claim earlier guest inquiries ────────────────────────────────────────
function ClaimInquiries({ cfg, accountEmail, onDone }) {
  const t = useOtpTimers();
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const locked = t.lockSeconds > 0;

  const request = async (e) => {
    e?.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await api.post("/inquiry/claim/request", {}, cfg);
      setSent(true);
      setInfo(res.data.message);
      t.setResendSeconds(res.data.resendAfterSeconds || 60);
    } catch (e2) {
      setErr(t.fromError(e2, "Could not send the code."));
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await api.post("/inquiry/claim/confirm", { otp }, cfg);
      setSent(false);
      setOtp("");
      onDone(res.data.message);
    } catch (e2) {
      setOtp("");
      setErr(t.fromError(e2, "Could not verify the code."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      id="claim"
      title="Add earlier inquiries"
      subtitle="Sent an inquiry as a guest using your account email? We send a code to that email, and after you confirm, those inquiries and their replies appear in My Inquiries."
    >
      {!sent ? (
        <form onSubmit={request} className="space-y-4" noValidate>
          <div>
            <label className={lbl}>Inquiry email</label>
            <input
              type="email"
              className={`${inp} bg-[#FAF3E8] cursor-not-allowed`}
              value={accountEmail}
              readOnly
              disabled
            />
            <p className="font-sans text-[11px] text-[#70543E]/80 mt-2">
              Only inquiries sent with your account email can be added.
            </p>
          </div>
          <LockBox seconds={t.lockSeconds} />
          <Msg>{err}</Msg>
          <button
            type="submit"
            disabled={busy || locked || t.resendSeconds > 0}
            className={btn}
          >
            {busy
              ? "Sending..."
              : t.resendSeconds > 0 && !locked
                ? `Wait ${t.resendSeconds}s`
                : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={confirm} className="space-y-4" noValidate>
          <Msg kind="ok">{info}</Msg>
          <div>
            <label className={lbl}>6-digit code</label>
            <input
              className={`${inp} text-center tracking-[0.4em] font-mono`}
              inputMode="numeric"
              maxLength={6}
              value={otp}
              disabled={locked}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <LockBox seconds={t.lockSeconds} />
          {!locked && t.attemptsLeft != null && t.attemptsLeft < 5 && (
            <p className="font-sans text-[11px] text-[#70543E]">
              {t.attemptsLeft} attempt(s) left.
            </p>
          )}
          <Msg>{err}</Msg>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={busy || locked || otp.length !== 6}
              className={btn}
            >
              {busy ? "Verifying..." : "Add my inquiries"}
            </button>
            {!locked && (
              <button
                type="button"
                onClick={() => request()}
                disabled={busy || t.resendSeconds > 0}
                className="font-sans text-xs text-[#70543E] underline disabled:opacity-50 disabled:no-underline"
              >
                {t.resendSeconds > 0
                  ? `Resend code in ${t.resendSeconds}s`
                  : "Resend code"}
              </button>
            )}
          </div>
        </form>
      )}
    </Section>
  );
}
