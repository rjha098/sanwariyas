// // FILE: client/src/components/ui/InquiryModal.js
// "use client";
// import { formatPhone } from "@/utils/formatPhone";
// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter, usePathname } from "next/navigation";
// import api from "@/lib/api";
// import Toast from "@/components/ui/Toast";
// import PhoneInput from "@/components/ui/PhoneInput";

// // ── Custom field error message ──
// function FieldError({ message }) {
//   if (!message) return null;
//   return (
//     <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/70 transition-all duration-300">
//       <svg
//         viewBox="0 0 16 16"
//         fill="none"
//         className="w-3.5 h-3.5 flex-shrink-0 text-red-500"
//       >
//         <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
//         <path
//           d="M8 5v3.5M8 11v.5"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//         />
//       </svg>
//       <p className="font-sans text-xs text-red-600">{message}</p>
//     </div>
//   );
// }

// // ── Styled input wrapper ──
// function StyledInput({
//   id,
//   name,
//   type = "text",
//   value,
//   onChange,
//   onBlur,
//   required,
//   readOnly,
//   placeholder,
//   min,
//   error,
//   success,
//   className = "",
//   ...rest
// }) {
//   const borderCls = error
//     ? "border-red-400 focus:border-red-500 bg-red-50/30"
//     : success
//       ? "border-green-400 focus:border-green-500 bg-green-50/20"
//       : "border-[#a07f61]/30 focus:border-[#BE6E5B] bg-[#f8f4ec]";

//   return (
//     <input
//       type={type}
//       id={id}
//       name={name}
//       value={value}
//       onChange={onChange}
//       onBlur={onBlur}
//       required={required}
//       readOnly={readOnly}
//       placeholder={placeholder}
//       min={min}
//       className={`w-full px-4 py-3 border text-sm text-[#7A3D2A] focus:outline-none transition-all duration-300 ${borderCls} ${readOnly ? "cursor-not-allowed opacity-70" : ""} ${className}`}
//       {...rest}
//     />
//   );
// }

// // ── Login prompt banner ──
// function LoginPromptBanner({ router, closeModal }) {
//   return (
//     <div className="relative overflow-hidden rounded-xl border border-[#C9A84C]/40 bg-gradient-to-br from-[#FAF3E8] to-[#FDF7F2] p-5 shadow-sm">
//       <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C9A84C] via-[#BE6E5B] to-[#C9A84C]" />
//       <div className="flex items-start gap-4">
//         <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center">
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="#C9A84C"
//             strokeWidth="1.8"
//             className="w-5 h-5"
//           >
//             <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//           </svg>
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] font-semibold mb-1">
//             Track Your Inquiry
//           </p>
//           {/* ✅ FIX: Clear instruction text — both fields required together */}
//           <p className="font-sans text-sm text-[#574325] leading-relaxed">
//             Your inquiry has been submitted! Please log in or create an account
//             using the <strong>exact same Email AND Phone Number</strong> you
//             entered below, to track its status and view admin responses.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-2 mt-4">
//             <button
//               onClick={() => {
//                 closeModal();
//                 router.push("/login");
//               }}
//               className="flex-1 py-2.5 px-4 bg-[#6F4E37] text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#574325] transition-colors rounded-lg"
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => {
//                 closeModal();
//                 router.push("/login?mode=signup");
//               }}
//               className="flex-1 py-2.5 px-4 border border-[#C9A84C]/50 text-[#574325] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 transition-colors rounded-lg"
//             >
//               Create Account
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Logged in info banner ──
// function LoggedInBanner({ user, router, closeModal }) {
//   return (
//     <div className="relative overflow-hidden rounded-xl border border-[#6F4E37]/20 bg-[#FAF3E8] p-4 mb-6">
//       <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6F4E37] to-[#C9A84C]" />
//       <div className="flex items-center gap-3">
//         <div className="w-8 h-8 rounded-full bg-[#6F4E37] flex items-center justify-center flex-shrink-0">
//           <span className="font-sans text-white text-xs font-bold">
//             {user?.name?.[0]?.toUpperCase() || "U"}
//           </span>
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="font-sans text-xs font-semibold text-[#574325]">
//             Signed in as <span className="text-[#6F4E37]">{user?.name}</span>
//           </p>
//           <p className="font-sans text-[11px] text-[#70543E]/60">
//             Responses will appear in your{" "}
//             <button
//               onClick={() => {
//                 closeModal();
//                 router.push("/dashboard");
//               }}
//               className="text-[#6F4E37] underline hover:text-[#574325] transition-colors"
//             >
//               dashboard
//             </button>
//           </p>
//         </div>
//         <button
//           onClick={() => {
//             closeModal();
//             router.push("/dashboard");
//           }}
//           className="flex-shrink-0 font-sans text-[10px] tracking-[0.2em] uppercase text-[#6F4E37] border border-[#6F4E37]/30 px-3 py-1.5 rounded-lg hover:bg-[#6F4E37]/10 transition-colors"
//         >
//           Dashboard
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── MAIN MODAL COMPONENT ──
// export default function InquiryModal() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   // Snapshot of the email/phone the user actually submitted with — needed
//   // because formData gets reset to blank right after a successful submit,
//   // and the success screen (shown below) needs these values.
//   const [submittedContact, setSubmittedContact] = useState({
//     email: "",
//     phone: "",
//   });

//   const { isAuthenticated, user, token } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [loading, setLoading] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [touchedFields, setTouchedFields] = useState({});
//   const formTopRef = useRef(null);
//   const promptRef = useRef(null);

//   const [toastConfig, setToastConfig] = useState({
//     isVisible: false,
//     message: "",
//     type: "success",
//   });

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     whatsapp: "",
//     country: "",
//     companyName: "",
//     productCategory: "",
//     quantity: "",
//     message: "",
//     userId: "",
//   });

//   const [fullProfile, setFullProfile] = useState(null);

//   // ── Timer Logic ──
//   useEffect(() => {
//     if (pathname === "/contact" || pathname.startsWith("/operations-center"))
//       return;

//     const isClosed = sessionStorage.getItem("inquiry_modal_closed");
//     if (!isClosed) {
//       const timer = setTimeout(() => {
//         setIsVisible(true);
//       }, 10000);
//       return () => clearTimeout(timer);
//     }
//   }, [pathname]);

//   const handleCloseModal = () => {
//     setIsVisible(false);
//     setIsSuccess(false);
//     sessionStorage.setItem("inquiry_modal_closed", "true");
//   };

//   // ── Auto-fill Logic ──
//   useEffect(() => {
//     if (isAuthenticated && user && isVisible && !isSuccess) {
//       setFormData((prev) => ({
//         ...prev,
//         name: user.name || user.username || prev.name,
//         email: user.email || prev.email,
//         userId: user.id || user._id || "",
//       }));

//       if (token) {
//         api
//           .get("/auth/session", {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .then((res) => {
//             const userData = res.data.user || res.data.data || res.data;
//             if (userData) {
//               setFullProfile(userData);
//               setFormData((prev) => ({
//                 ...prev,
//                 whatsapp: userData.phone || userData.whatsapp || prev.whatsapp,
//                 companyName: userData.company || prev.companyName,
//                 country: userData.country || prev.country,
//               }));
//             }
//           })
//           .catch(() => {});
//       }
//     }
//   }, [isAuthenticated, user, token, isVisible, isSuccess]);

//   // ── Validation & Submission ──
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setTouchedFields((prev) => ({ ...prev, [name]: true }));
//     validateField(name, value);
//   };

//   const validateField = (name, value) => {
//     let error = "";
//     if (name === "name" && !value.trim()) error = "Full name is required.";
//     if (name === "email") {
//       if (!value.trim()) error = "Email address is required.";
//       else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
//         error = "Please enter a valid email address.";
//     }
//     if (name === "message" && !value.trim())
//       error = "Please describe your requirements.";
//     if (name === "quantity") {
//       const num = parseInt(value);
//       if (value && (isNaN(num) || num < 10))
//         error = "Minimum order quantity is 10 pieces.";
//     }
//     setFieldErrors((prev) => ({ ...prev, [name]: error }));
//     return error;
//   };

//   const validateAll = () => {
//     const errors = {};
//     if (!formData.name.trim()) errors.name = "Full name is required.";
//     if (!formData.email.trim()) errors.email = "Email address is required.";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       errors.email = "Please enter a valid email address.";
//     if (!formData.message.trim())
//       errors.message = "Please describe your requirements.";
//     if (formData.quantity) {
//       const num = parseInt(formData.quantity);
//       if (isNaN(num) || num < 10)
//         errors.quantity = "Minimum order quantity is 10 pieces.";
//     }
//     setFieldErrors(errors);
//     setTouchedFields({
//       name: true,
//       email: true,
//       message: true,
//       quantity: true,
//     });
//     return Object.keys(errors).length === 0;
//   };

//   const closeToast = () =>
//     setToastConfig((prev) => ({ ...prev, isVisible: false }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateAll()) {
//       formTopRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//       setToastConfig({
//         isVisible: true,
//         type: "error",
//         message: "Please check your form inputs.",
//       });
//       return;
//     }

//     setLoading(true);
//     closeToast();

//     try {
//       const headers =
//         isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {};
//       await api.post("/inquiry", formData, { headers });

//       setIsSuccess(true);

//       // Snapshot the submitted email/phone before we blank the form below.
//       setSubmittedContact({
//         email: formData.email,
//         phone: formData.whatsapp,
//       });

//       setFormData({
//         name: "",
//         email: "",
//         whatsapp: "",
//         country: "",
//         companyName: "",
//         productCategory: "",
//         quantity: "",
//         message: "",
//         userId: "",
//       });
//       setFieldErrors({});
//       setTouchedFields({});

//       if (isAuthenticated) {
//         setTimeout(() => handleCloseModal(), 3000);
//       }
//     } catch (error) {
//       let rawError =
//         error.response?.data?.message || "Failed to submit inquiry.";
//       if (rawError.includes("quantity") && rawError.includes("minimum"))
//         rawError = "Quantity must be at least 10.";
//       setToastConfig({ isVisible: true, type: "error", message: rawError });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="absolute top-4 z-[100000] w-full max-w-md px-4 pointer-events-none">
//         <Toast
//           isVisible={toastConfig.isVisible}
//           message={toastConfig.message}
//           type={toastConfig.type}
//           onClose={closeToast}
//         />
//       </div>

//       <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
//         <button
//           onClick={handleCloseModal}
//           className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#f8f4ec] text-[#7A3D2A] hover:bg-red-100 hover:text-red-600 transition-colors border border-[#BE6E5B]/30 shadow-sm"
//           aria-label="Close"
//         >
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             className="w-4 h-4"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>

//         {isSuccess ? (
//           <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center overflow-y-auto">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 border-4 border-green-50 shadow-sm">
//               <svg
//                 className="w-10 h-10 text-green-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="3"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>

//             <h2 className="font-display text-3xl text-[#7A3D2A] font-bold mb-2">
//               Inquiry Submitted!
//             </h2>

//             {!isAuthenticated ? (
//               <>
//                 <div className="bg-gradient-to-br from-[#FAF3E8] to-[#FDF7F2] border border-[#C9A84C]/40 rounded-xl p-5 mb-8 w-full max-w-sm shadow-sm mt-4">
//                   <p className="font-sans text-sm text-[#7A3D2A] font-bold tracking-[0.1em] uppercase">
//                     Sign in to view admin response
//                   </p>
//                   {/*  FIX: Clear instruction text — shows the exact
//                       email + phone the customer just typed, since BOTH
//                       must match exactly when they sign up or log in. */}
//                   <p className="font-sans text-xs text-[#a07f61] mt-2 leading-relaxed">
//                     To track this inquiry, log in or create an account using{" "}
//                     <strong>both</strong> of these — exactly as typed:
//                   </p>
//                   <div className="mt-3 bg-white/60 border border-[#C9A84C]/30 rounded-lg px-3 py-2 space-y-1">
//                     <p className="font-sans text-xs text-[#574325]">
//                       <span className="text-[#a07f61]">Email: </span>
//                       <strong>{submittedContact.email}</strong>
//                     </p>
//                     <p className="font-sans text-xs text-[#574325]">
//                       <span className="text-[#a07f61]">Phone: </span>
//                       <strong>{formatPhone(submittedContact.phone)}</strong>
//                     </p>
//                   </div>
//                   <p className="font-sans text-[11px] text-[#a07f61] mt-2 leading-relaxed">
//                     Using a different email or phone number will not show this
//                     inquiry in your dashboard.
//                   </p>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
//                   <button
//                     onClick={() => {
//                       handleCloseModal();
//                       router.push("/login");
//                     }}
//                     className="flex-1 py-3 px-4 bg-[#7A3D2A] text-white font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#5C2E1F] transition-all rounded-xl shadow-sm"
//                   >
//                     Sign In
//                   </button>
//                   <button
//                     onClick={() => {
//                       handleCloseModal();
//                       router.push("/login?mode=signup");
//                     }}
//                     className="flex-1 py-3 px-4 border border-[#C9A84C]/50 text-[#7A3D2A] font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 transition-all rounded-xl"
//                   >
//                     Create Account
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <p className="font-sans text-sm text-[#a07f61] max-w-md leading-relaxed mt-4">
//                 Thank you, {user?.name}! We will get back to you shortly.
//                 Responses will appear in your dashboard.
//               </p>
//             )}

//             <button
//               onClick={handleCloseModal}
//               className="mt-8 font-sans text-xs tracking-widest text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors"
//             >
//               Close this window
//             </button>
//           </div>
//         ) : (
//           /* ── FORM SCREEN ── */
//           <>
//             <div className="p-6 md:p-8 bg-gradient-to-b from-[#FAF3E8] to-white border-b border-[#BE6E5B]/10 shrink-0">
//               <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-2">
//                 Trade Inquiry
//               </p>
//               <h2 className="font-display text-2xl md:text-3xl text-[#7A3D2A] font-bold">
//                 Send Your Bulk Inquiry
//               </h2>
//               <p className="font-sans text-xs md:text-sm text-[#a07f61] mt-2">
//                 Fill in the form below and our export team will get back to you
//                 with custom pricing and availability.
//               </p>
//             </div>

//             <div className="p-6 md:p-8 overflow-y-auto w-full">
//               {isAuthenticated && (
//                 <LoggedInBanner
//                   user={user}
//                   router={router}
//                   closeModal={handleCloseModal}
//                 />
//               )}
//               {showLoginPrompt && !isAuthenticated && (
//                 <div ref={promptRef} className="mb-6">
//                   <LoginPromptBanner
//                     router={router}
//                     closeModal={handleCloseModal}
//                   />
//                 </div>
//               )}

//               <div ref={formTopRef} />

//               <form
//                 onSubmit={handleSubmit}
//                 noValidate
//                 className="space-y-5 font-sans"
//               >
//                 <div>
//                   <label
//                     htmlFor="modal-name"
//                     className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
//                   >
//                     Full Name *
//                   </label>
//                   <StyledInput
//                     id="modal-name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     required
//                     readOnly={isAuthenticated && !!user?.name}
//                     error={!!fieldErrors.name}
//                     success={
//                       touchedFields.name &&
//                       !fieldErrors.name &&
//                       formData.name.trim()
//                     }
//                   />
//                   <FieldError message={fieldErrors.name} />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="modal-email"
//                     className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
//                   >
//                     Email Address *
//                   </label>
//                   <StyledInput
//                     id="modal-email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     required
//                     readOnly={isAuthenticated}
//                     error={!!fieldErrors.email}
//                     success={
//                       touchedFields.email &&
//                       !fieldErrors.email &&
//                       formData.email.trim()
//                     }
//                   />
//                   <FieldError message={fieldErrors.email} />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label
//                       htmlFor="modal-whatsapp"
//                       className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
//                     >
//                       WhatsApp Number
//                     </label>
//                     <PhoneInput
//                       value={formData.whatsapp}
//                       onChange={(combined) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           whatsapp: combined,
//                         }))
//                       }
//                       readOnly={isAuthenticated && !!fullProfile?.phone}
//                       className="flex items-stretch w-full border text-sm transition-all duration-300 border-[#a07f61]/30 focus-within:border-[#BE6E5B] bg-[#f8f4ec]"
//                       textClassName="text-[#7A3D2A]"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="modal-country"
//                       className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
//                     >
//                       Country
//                     </label>
//                     <StyledInput
//                       id="modal-country"
//                       name="country"
//                       value={formData.country}
//                       onChange={handleChange}
//                       readOnly={isAuthenticated && !!fullProfile?.country}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label
//                       htmlFor="modal-companyName"
//                       className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
//                     >
//                       Company Name
//                     </label>
//                     <StyledInput
//                       id="modal-companyName"
//                       name="companyName"
//                       value={formData.companyName}
//                       onChange={handleChange}
//                       readOnly={isAuthenticated && !!fullProfile?.company}
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="modal-productCategory"
//                       className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
//                     >
//                       Product Category
//                     </label>
//                     <StyledInput
//                       id="modal-productCategory"
//                       name="productCategory"
//                       placeholder="e.g. Cotton Suits, Kurtis"
//                       value={formData.productCategory}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="modal-quantity"
//                     className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
//                   >
//                     Estimated Quantity{" "}
//                     <span className="text-[#BE6E5B]">(Min. 10 pieces)</span>
//                   </label>
//                   <div className="relative">
//                     <StyledInput
//                       id="modal-quantity"
//                       name="quantity"
//                       type="number"
//                       value={formData.quantity}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       placeholder="e.g. 100"
//                       error={!!fieldErrors.quantity}
//                       success={
//                         touchedFields.quantity &&
//                         !fieldErrors.quantity &&
//                         formData.quantity &&
//                         parseInt(formData.quantity) >= 10
//                       }
//                     />
//                     <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[11px] text-[#a07f61] pointer-events-none">
//                       pcs
//                     </span>
//                   </div>
//                   <FieldError message={fieldErrors.quantity} />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="modal-message"
//                     className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
//                   >
//                     Your Message *
//                   </label>
//                   <textarea
//                     id="modal-message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     required
//                     rows={3}
//                     className={`w-full px-4 py-3 border text-sm text-[#7A3D2A] focus:outline-none transition-all duration-300 resize-none ${fieldErrors.message ? "border-red-400 bg-red-50/30" : touchedFields.message && formData.message.trim() ? "border-green-400 bg-green-50/20" : "border-[#a07f61]/30 bg-[#f8f4ec] focus:border-[#BE6E5B]"}`}
//                     placeholder="Describe your requirements..."
//                   />
//                   <FieldError message={fieldErrors.message} />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full py-4 mt-2 bg-[#7A3D2A] text-white text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#5C2E1F] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md"
//                 >
//                   {loading ? "Sending..." : "Submit Inquiry"}
//                 </button>
//               </form>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }







 // FILE: client/src/components/ui/InquiryModal.js
"use client";
import { formatPhone } from "@/utils/formatPhone";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";
import Toast from "@/components/ui/Toast";
import PhoneInput from "@/components/ui/PhoneInput";

// ── Custom field error message ──
function FieldError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/70 transition-all duration-300">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="w-3.5 h-3.5 flex-shrink-0 text-red-500"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 5v3.5M8 11v.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="font-sans text-xs text-red-600">{message}</p>
    </div>
  );
}

// ── Styled input wrapper ──
function StyledInput({
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  required,
  readOnly,
  placeholder,
  min,
  error,
  success,
  className = "",
  ...rest
}) {
  const borderCls = error
    ? "border-red-400 focus:border-red-500 bg-red-50/30"
    : success
      ? "border-green-400 focus:border-green-500 bg-green-50/20"
      : "border-[#a07f61]/30 focus:border-[#BE6E5B] bg-[#f8f4ec]";

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      readOnly={readOnly}
      placeholder={placeholder}
      min={min}
      className={`w-full px-4 py-3 border text-sm text-[#7A3D2A] focus:outline-none transition-all duration-300 ${borderCls} ${readOnly ? "cursor-not-allowed opacity-70" : ""} ${className}`}
      {...rest}
    />
  );
}

// ── Login prompt banner ──
function LoginPromptBanner({ router, closeModal }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#C9A84C]/40 bg-gradient-to-br from-[#FAF3E8] to-[#FDF7F2] p-5 shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C9A84C] via-[#BE6E5B] to-[#C9A84C]" />
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="1.8"
            className="w-5 h-5"
          >
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] font-semibold mb-1">
            Track Your Inquiry
          </p>
          {/* ✅ FIX: Clear instruction text — both fields required together */}
          <p className="font-sans text-sm text-[#574325] leading-relaxed">
            Your inquiry has been submitted! Please log in or create an account
            using the <strong>exact same Email AND Phone Number</strong> you
            entered below, to track its status and view admin responses.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() => {
                closeModal();
                router.push("/login");
              }}
              className="flex-1 py-2.5 px-4 bg-[#6F4E37] text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#574325] transition-colors rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                closeModal();
                router.push("/login?mode=signup");
              }}
              className="flex-1 py-2.5 px-4 border border-[#C9A84C]/50 text-[#574325] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 transition-colors rounded-lg"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Logged in info banner ──
function LoggedInBanner({ user, router, closeModal }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#6F4E37]/20 bg-[#FAF3E8] p-4 mb-6">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6F4E37] to-[#C9A84C]" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#6F4E37] flex items-center justify-center flex-shrink-0">
          <span className="font-sans text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs font-semibold text-[#574325]">
            Signed in as <span className="text-[#6F4E37]">{user?.name}</span>
          </p>
          <p className="font-sans text-[11px] text-[#70543E]/60">
            Responses will appear in your{" "}
            <button
              onClick={() => {
                closeModal();
                router.push("/dashboard");
              }}
              className="text-[#6F4E37] underline hover:text-[#574325] transition-colors"
            >
              dashboard
            </button>
          </p>
        </div>
        <button
          onClick={() => {
            closeModal();
            router.push("/dashboard");
          }}
          className="flex-shrink-0 font-sans text-[10px] tracking-[0.2em] uppercase text-[#6F4E37] border border-[#6F4E37]/30 px-3 py-1.5 rounded-lg hover:bg-[#6F4E37]/10 transition-colors"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

// ── MAIN MODAL COMPONENT ──
const STATE_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'&-]*$/u;

export default function InquiryModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Snapshot of the email/phone the user actually submitted with — needed
  // because formData gets reset to blank right after a successful submit,
  // and the success screen (shown below) needs these values.
  const [submittedContact, setSubmittedContact] = useState({
    email: "",
    phone: "",
  });

  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const formTopRef = useRef(null);
  const promptRef = useRef(null);

  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    country: "",
    state: "",
    companyName: "",
    productCategory: "",
    quantity: "",
    message: "",
    userId: "",
  });

  const [fullProfile, setFullProfile] = useState(null);

  // ── Timer Logic ──
  useEffect(() => {
    if (pathname === "/contact" || pathname.startsWith("/operations-center"))
      return;

    const isClosed = sessionStorage.getItem("inquiry_modal_closed");
    if (!isClosed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleCloseModal = () => {
    setIsVisible(false);
    setIsSuccess(false);
    sessionStorage.setItem("inquiry_modal_closed", "true");
  };

  // ── Auto-fill Logic ──
  useEffect(() => {
    if (isAuthenticated && user && isVisible && !isSuccess) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || user.username || prev.name,
        email: user.email || prev.email,
        userId: user.id || user._id || "",
      }));

      if (token) {
        api
          .get("/auth/session", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const userData = res.data.user || res.data.data || res.data;
            if (userData) {
              setFullProfile(userData);
              setFormData((prev) => ({
                ...prev,
                whatsapp: userData.phone || userData.whatsapp || prev.whatsapp,
                companyName: userData.company || prev.companyName,
                country: userData.country || prev.country,
              }));
            }
          })
          .catch(() => {});
      }
    }
  }, [isAuthenticated, user, token, isVisible, isSuccess]);

  // ── Validation & Submission ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "name" && !value.trim()) error = "Full name is required.";
    if (name === "email") {
      if (!value.trim()) error = "Email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Please enter a valid email address.";
    }
    if (name === "state" && !STATE_RE.test(value.trim()))
      error = "Please enter your state.";
    if (name === "message" && !value.trim())
      error = "Please describe your requirements.";
    if (name === "quantity") {
      const num = parseInt(value);
      if (value && (isNaN(num) || num < 10))
        error = "Minimum order quantity is 10 pieces.";
    }
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateAll = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.email.trim()) errors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Please enter a valid email address.";
    if (!STATE_RE.test(formData.state.trim()))
      errors.state = "Please enter your state.";
    if (!formData.message.trim())
      errors.message = "Please describe your requirements.";
    if (formData.quantity) {
      const num = parseInt(formData.quantity);
      if (isNaN(num) || num < 10)
        errors.quantity = "Minimum order quantity is 10 pieces.";
    }
    setFieldErrors(errors);
    setTouchedFields({
      name: true,
      email: true,
      state: true,
      message: true,
      quantity: true,
    });
    return Object.keys(errors).length === 0;
  };

  const closeToast = () =>
    setToastConfig((prev) => ({ ...prev, isVisible: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      formTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setToastConfig({
        isVisible: true,
        type: "error",
        message: "Please check your form inputs.",
      });
      return;
    }

    setLoading(true);
    closeToast();

    try {
      const headers =
        isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {};
      await api.post("/inquiry", formData, { headers });

      setIsSuccess(true);

      // Snapshot the submitted email/phone before we blank the form below.
      setSubmittedContact({
        email: formData.email,
        phone: formData.whatsapp,
      });

      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        country: "",
        state: "",
        companyName: "",
        productCategory: "",
        quantity: "",
        message: "",
        userId: "",
      });
      setFieldErrors({});
      setTouchedFields({});

      if (isAuthenticated) {
        setTimeout(() => handleCloseModal(), 3000);
      }
    } catch (error) {
      let rawError =
        error.response?.data?.message || "Failed to submit inquiry.";
      if (rawError.includes("quantity") && rawError.includes("minimum"))
        rawError = "Quantity must be at least 10.";
      setToastConfig({ isVisible: true, type: "error", message: rawError });
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="absolute top-4 z-[100000] w-full max-w-md px-4 pointer-events-none">
        <Toast
          isVisible={toastConfig.isVisible}
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={closeToast}
        />
      </div>

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#f8f4ec] text-[#7A3D2A] hover:bg-red-100 hover:text-red-600 transition-colors border border-[#BE6E5B]/30 shadow-sm"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {isSuccess ? (
          <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center overflow-y-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 border-4 border-green-50 shadow-sm">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="font-display text-3xl text-[#7A3D2A] font-bold mb-2">
              Inquiry Submitted!
            </h2>

            {!isAuthenticated ? (
              <>
                <div className="bg-gradient-to-br from-[#FAF3E8] to-[#FDF7F2] border border-[#C9A84C]/40 rounded-xl p-5 mb-8 w-full max-w-sm shadow-sm mt-4">
                  <p className="font-sans text-sm text-[#7A3D2A] font-bold tracking-[0.1em] uppercase">
                    Sign in to view admin response
                  </p>
                  {/*  FIX: Clear instruction text — shows the exact
                      email + phone the customer just typed, since BOTH
                      must match exactly when they sign up or log in. */}
                  <p className="font-sans text-xs text-[#a07f61] mt-2 leading-relaxed">
                    To track this inquiry, log in or create an account using{" "}
                    <strong>both</strong> of these — exactly as typed:
                  </p>
                  <div className="mt-3 bg-white/60 border border-[#C9A84C]/30 rounded-lg px-3 py-2 space-y-1">
                    <p className="font-sans text-xs text-[#574325]">
                      <span className="text-[#a07f61]">Email: </span>
                      <strong>{submittedContact.email}</strong>
                    </p>
                    <p className="font-sans text-xs text-[#574325]">
                      <span className="text-[#a07f61]">Phone: </span>
                      <strong>{formatPhone(submittedContact.phone)}</strong>
                    </p>
                  </div>
                  <p className="font-sans text-[11px] text-[#a07f61] mt-2 leading-relaxed">
                    Using a different email or phone number will not show this
                    inquiry in your dashboard.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                  <button
                    onClick={() => {
                      handleCloseModal();
                      router.push("/login");
                    }}
                    className="flex-1 py-3 px-4 bg-[#7A3D2A] text-white font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#5C2E1F] transition-all rounded-xl shadow-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleCloseModal();
                      router.push("/login?mode=signup");
                    }}
                    className="flex-1 py-3 px-4 border border-[#C9A84C]/50 text-[#7A3D2A] font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 transition-all rounded-xl"
                  >
                    Create Account
                  </button>
                </div>
              </>
            ) : (
              <p className="font-sans text-sm text-[#a07f61] max-w-md leading-relaxed mt-4">
                Thank you, {user?.name}! We will get back to you shortly.
                Responses will appear in your dashboard.
              </p>
            )}

            <button
              onClick={handleCloseModal}
              className="mt-8 font-sans text-xs tracking-widest text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors"
            >
              Close this window
            </button>
          </div>
        ) : (
          /* ── FORM SCREEN ── */
          <>
            <div className="p-6 md:p-8 bg-gradient-to-b from-[#FAF3E8] to-white border-b border-[#BE6E5B]/10 shrink-0">
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-2">
                Trade Inquiry
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-[#7A3D2A] font-bold">
                Send Your Bulk Inquiry
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#a07f61] mt-2">
                Fill in the form below and our export team will get back to you
                with custom pricing and availability.
              </p>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto w-full">
              {isAuthenticated && (
                <LoggedInBanner
                  user={user}
                  router={router}
                  closeModal={handleCloseModal}
                />
              )}
              {showLoginPrompt && !isAuthenticated && (
                <div ref={promptRef} className="mb-6">
                  <LoginPromptBanner
                    router={router}
                    closeModal={handleCloseModal}
                  />
                </div>
              )}

              <div ref={formTopRef} />

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5 font-sans"
              >
                <div>
                  <label
                    htmlFor="modal-name"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    Full Name *
                  </label>
                  <StyledInput
                    id="modal-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    readOnly={isAuthenticated && !!user?.name}
                    error={!!fieldErrors.name}
                    success={
                      touchedFields.name &&
                      !fieldErrors.name &&
                      formData.name.trim()
                    }
                  />
                  <FieldError message={fieldErrors.name} />
                </div>

                <div>
                  <label
                    htmlFor="modal-email"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    Email Address *
                  </label>
                  <StyledInput
                    id="modal-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    readOnly={isAuthenticated}
                    error={!!fieldErrors.email}
                    success={
                      touchedFields.email &&
                      !fieldErrors.email &&
                      formData.email.trim()
                    }
                  />
                  <FieldError message={fieldErrors.email} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="modal-whatsapp"
                      className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                    >
                      WhatsApp Number
                    </label>
                    <PhoneInput
                      value={formData.whatsapp}
                      onChange={(combined) =>
                        setFormData((prev) => ({
                          ...prev,
                          whatsapp: combined,
                        }))
                      }
                      readOnly={isAuthenticated && !!fullProfile?.phone}
                      className="flex items-stretch w-full border text-sm transition-all duration-300 border-[#a07f61]/30 focus-within:border-[#BE6E5B] bg-[#f8f4ec]"
                      textClassName="text-[#7A3D2A]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="modal-country"
                      className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                    >
                      Country
                    </label>
                    <StyledInput
                      id="modal-country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      readOnly={isAuthenticated && !!fullProfile?.country}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modal-state"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    State
                  </label>
                  <StyledInput
                    id="modal-state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={80}
                    placeholder="e.g. Rajasthan"
                  />
                  {fieldErrors.state && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      {fieldErrors.state}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="modal-companyName"
                      className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                    >
                      Company Name
                    </label>
                    <StyledInput
                      id="modal-companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      readOnly={isAuthenticated && !!fullProfile?.company}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="modal-productCategory"
                      className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                    >
                      Product Category
                    </label>
                    <StyledInput
                      id="modal-productCategory"
                      name="productCategory"
                      placeholder="e.g. Cotton Suits, Kurtis"
                      value={formData.productCategory}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modal-quantity"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    Estimated Quantity{" "}
                    <span className="text-[#BE6E5B]">(Min. 10 pieces)</span>
                  </label>
                  <div className="relative">
                    <StyledInput
                      id="modal-quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 100"
                      error={!!fieldErrors.quantity}
                      success={
                        touchedFields.quantity &&
                        !fieldErrors.quantity &&
                        formData.quantity &&
                        parseInt(formData.quantity) >= 10
                      }
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[11px] text-[#a07f61] pointer-events-none">
                      pcs
                    </span>
                  </div>
                  <FieldError message={fieldErrors.quantity} />
                </div>

                <div>
                  <label
                    htmlFor="modal-message"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="modal-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    rows={3}
                    className={`w-full px-4 py-3 border text-sm text-[#7A3D2A] focus:outline-none transition-all duration-300 resize-none ${fieldErrors.message ? "border-red-400 bg-red-50/30" : touchedFields.message && formData.message.trim() ? "border-green-400 bg-green-50/20" : "border-[#a07f61]/30 bg-[#f8f4ec] focus:border-[#BE6E5B]"}`}
                    placeholder="Describe your requirements..."
                  />
                  <FieldError message={fieldErrors.message} />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-2 bg-[#7A3D2A] text-white text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#5C2E1F] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md"
                >
                  {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}