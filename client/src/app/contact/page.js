"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Toast from "@/components/ui/Toast";

// ── Contact info ──────────────────────────────────────────────────────────────

const contactItems = [ 
  {
    label: "Visit Us",
    line1:
      "Shop No. 12,13, 1st Floor, Shiv Plaza, Near HDFC Bank, Printers Colony, Dada Gurudev Nagar, Sanganer",
    line2: "Jaipur, Rajasthan 302029",
    href: "https://www.google.com/maps/place/SANWARIYAS/@26.8187965,75.7826464,17z/data=!3m1!4b1!4m6!3m5!1s0x396c4b51b58d103b:0xe385440bc09f2694!8m2!3d26.8187965!4d75.7826464!16s%2Fg%2F11v3hb_9y0",
    external: true,
    isAddress: true,

    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#BE6E5B"
        strokeWidth="1.2"
        className="w-5 h-5 flex-shrink-0"
      >
        <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5z" />
        <circle cx="8" cy="6" r="1.5" />
      </svg>
    ),
  },
  {
    label: "Call Us",
    line1: "+91 9251171306",
    line2: "Mon – Sat: 10am – 7pm (IST)",
    href: "tel:+919251171306",
    external: false,
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#BE6E5B"
        strokeWidth="1.2"
        className="w-5 h-5 flex-shrink-0"
      >
        <path d="M3 2.5h3l1 3-1.5 1a8 8 0 003 3l1-1.5 3 1v3A1.5 1.5 0 0112 13 9.5 9.5 0 012.5 4 1.5 1.5 0 014 2.5H3z" />
      </svg>
    ),
  },
  {
    label: "Email Us",
    line1: "hrsanwariyas@gmail.com",
    line2: "We respond within 24-48 hours",
    href: "mailto:hrsanwariyas@gmail.com",
    external: false,
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#BE6E5B"
        strokeWidth="1.2"
        className="w-5 h-5 flex-shrink-0"
      >
        <rect x="1.5" y="3.5" width="13" height="9" rx="1" />
        <path d="M1.5 5l6.5 4 6.5-4" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    line1: "+91 9251171306",
    line2: "Quick responses on WhatsApp",
    href: "https://wa.me/919680812813?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20wholesale%20products.",
    external: true,
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#BE6E5B"
        strokeWidth="1.2"
        className="w-5 h-5 flex-shrink-0"
      >
        <path d="M13.5 11.5l-2-2a1 1 0 00-1.4 0l-.8.8a7.4 7.4 0 01-3.6-3.6l.8-.8a1 1 0 000-1.4l-2-2a1 1 0 00-1.4 0C1.5 4 2 9 6.5 11.5S14 14.5 13.5 11.5z" />
      </svg>
    ),
  },
];

// ── Custom field error message ─────────────────────────────────────────────────
function FieldError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/70">
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

// ── Styled input wrapper — shows red/green border on validation ───────────────
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
      className={`w-full px-4 py-3 border text-sm text-[#7A3D2A] focus:outline-none transition-colors duration-200 ${borderCls} ${readOnly ? "cursor-not-allowed opacity-70" : ""} ${className}`}
      {...rest}
    />
  );
}

// ── Login prompt banner (shown to guest after submission) ─────────────────────
function LoginPromptBanner({ router }) {
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
          {/* ✅ FIX: Clear instruction text added here */}
          <p className="font-sans text-sm text-[#574325] leading-relaxed">
            Your inquiry has been submitted! Please log in or create an account
            with the <strong>exact same Email or Phone Number</strong> used in
            this inquiry to track its status and view admin responses.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() => router.push("/login")}
              title="Sign In to B2B Dashboard"
              className="flex-1 py-2.5 px-4 bg-[#6F4E37] text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#574325] transition-colors rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/login?mode=signup")}
              title="Create Wholesale Account"
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

// ── Logged in info banner ─────────────────────────────────────────────────────

function LoggedInBanner({ user, router }) {
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
              onClick={() => router.push("/dashboard")}
              title="Go to Wholesale Dashboard"
              className="text-[#6F4E37] underline hover:text-[#574325] transition-colors"
            >
              dashboard
            </button>
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          title="Go to Wholesale Dashboard"
          className="flex-shrink-0 font-sans text-[10px] tracking-[0.2em] uppercase text-[#6F4E37] border border-[#6F4E37]/30 px-3 py-1.5 rounded-lg hover:bg-[#6F4E37]/10 transition-colors"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Custom field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Refs for scroll-to behaviour
  const promptRef = useRef(null);
  const formTopRef = useRef(null);

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
    companyName: "",
    productCategory: "",
    quantity: "",
    message: "",
    userId: "",
  });

  // Store full profile data for freeze logic
  const [fullProfile, setFullProfile] = useState(null);

  // Auto-fill when logged in & fetch full profile
  useEffect(() => {
    if (isAuthenticated && user) {
      // 1. Fill basic info immediately from session
      setFormData((prev) => ({
        ...prev,
        name: user.name || user.username || prev.name,
        email: user.email || prev.email,
        userId: user.id || user._id || "",
      }));
      setShowLoginPrompt(false);

      // 2. Fetch full profile from DB to get Phone, Company, Country
      if (token) {
        api
          .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            const userData = res.data.user || res.data.data || res.data;
            setFullProfile(userData); // Save for readOnly logic
            setFormData((prev) => ({
              ...prev,
              whatsapp: userData.phone || prev.whatsapp,
              companyName: userData.company || prev.companyName,
              country: userData.country || prev.country,
            }));
          })
          .catch((err) => {
            if (
              err.response &&
              (err.response.status === 404 || err.response.status === 429)
            ) {
              return;
            }
            // console.error("Failed to fetch full profile", err);
          });
      }
    }
  }, [isAuthenticated, user, token]);

  // Scroll to login prompt after guest submits
  useEffect(() => {
    if (showLoginPrompt && promptRef.current) {
      promptRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showLoginPrompt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate on blur (when user leaves the field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  //  Added robust email regex validation
  const validateField = (name, value) => {
    let error = "";
    if (name === "name" && !value.trim()) {
      error = "Full name is required.";
    }
    if (name === "email") {
      if (!value.trim()) {
        error = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email address (e.g., name@gmail.com).";
      }
    }
    if (name === "message" && !value.trim()) {
      error = "Please describe your requirements.";
    }
    if (name === "quantity") {
      const num = parseInt(value);
      if (value && (isNaN(num) || num < 10)) {
        error = "Minimum order quantity is 10 pieces (2 Sets).";
      }
    }
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // Full form validation before submit
  const validateAll = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required.";

    // Apply regex validation on full submit too
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email =
        "Please enter a valid email address (e.g., name@gmail.com).";
    }

    if (!formData.message.trim())
      errors.message = "Please describe your requirements.";
    if (formData.quantity) {
      const num = parseInt(formData.quantity);
      if (isNaN(num) || num < 10)
        errors.quantity = "Minimum order quantity is 10 pieces (2 Sets).";
    }
    setFieldErrors(errors);

    // Mark all as touched so borders turn red immediately
    setTouchedFields({
      name: true,
      email: true,
      message: true,
      quantity: true,
    });
    return Object.keys(errors).length === 0;
  };

  const closeToast = () =>
    setToastConfig((prev) => ({ ...prev, isVisible: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoginPrompt(false);

    // Run custom validation first and show Toast if invalid
    if (!validateAll()) {
      // Scroll to first error
      formTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Toast message for empty or invalid inputs
      setToastConfig({
        isVisible: true,
        type: "error",
        message:
          "Please check your form inputs. Some fields are empty or invalid.",
      });
      return; // Stop form submission
    }

    setLoading(true);
    closeToast();

    try {
      const headers =
        isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {};
      await api.post("/inquiry", formData, { headers });

      setToastConfig({
        isVisible: true,
        type: "success",
        message: isAuthenticated
          ? "Inquiry submitted! Check your dashboard for responses."
          : "Inquiry submitted successfully!",
      });

      // Reset form
      setFormData((prev) => ({
        ...prev,
        whatsapp: "",
        country: "",
        companyName: "",
        productCategory: "",
        quantity: "",
        message: "",
        name: isAuthenticated && user ? user.name || user.username : "",
        email: isAuthenticated && user ? user.email : "",
        userId: isAuthenticated && user ? user.id || user._id : "",
      }));
      setFieldErrors({});
      setTouchedFields({});

      // Show login prompt for guests — useEffect above will scroll to it
      if (!isAuthenticated) setShowLoginPrompt(true);
    } catch (error) {
      let rawError =
        error.response?.data?.message ||
        "Failed to submit inquiry. Please try again.";
      let cleanError = rawError;
      if (rawError.includes("validation failed")) {
        if (rawError.includes("quantity") && rawError.includes("minimum"))
          cleanError = "Quantity must be at least 10.";
        else
          cleanError =
            "Please check your form inputs. Some required fields are empty or contain invalid data.";
      }
      setToastConfig({ isVisible: true, type: "error", message: cleanError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={closeToast}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .cg-wrap { width:100%;max-width:1280px;margin:0 auto;padding:0 16px;box-sizing:border-box; }
        @media(min-width:640px){.cg-wrap{padding:0 24px;}}
        @media(min-width:1024px){.cg-wrap{padding:0 32px;}}
        .cg-grid{display:grid;grid-template-columns:1fr;gap:32px;align-items:start;}
        .cg-grid>*{min-width:0;width:100%;box-sizing:border-box;}
        @media(min-width:1024px){.cg-grid{grid-template-columns:1fr 1fr;gap:48px;}}
        .cc-card{display:flex;align-items:flex-start;gap:16px;padding:18px 20px;background:rgba(255,255,255,0.62);backdrop-filter:blur(8px);border:1.5px solid rgba(190,110,91,0.20);border-radius:12px;text-decoration:none;transition:border-color .3s,background .3s,box-shadow .3s,transform .3s;color:inherit;}
        .cc-card:hover{border-color:rgba(190,110,91,0.55);background:rgba(255,255,255,0.90);box-shadow:0 8px 28px rgba(122,61,42,0.10);transform:translateY(-2px);}
        .cc-icon{width:40px;height:40px;flex-shrink:0;background:white;border:1px solid rgba(190,110,91,0.30);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .3s,border-color .3s;}
        .cc-card:hover .cc-icon{background:rgba(190,110,91,0.10);border-color:rgba(190,110,91,0.60);}
        /* Remove browser default number input arrows on quantity */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{opacity:1;}
      `,
        }}
      />

      <Navbar />

      <main
        id="main-content"
        className="min-h-screen pt-32 pb-24"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <header className="relative text-center px-4 pb-14 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(190,110,91,0.1) 40px,rgba(190,110,91,0.1) 41px)",
            }}
          />
          <div className="relative z-10 pt-8">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              Reach Out
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold drop-shadow-sm">
              Get In Touch
            </h1>
            <p className="font-serif italic text-[#7A3D2A] mt-4 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              Our export desk is here to help you finalize bulk requirements,
              custom manufacturing, and global logistics.
            </p>
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mt-8"
            >
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] animate-pulse">✦</span>
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
          </div>
        </header>

        <div className="cg-wrap">
          <div className="cg-grid">
            {/* ── Left: Contact info ── */}
            <section aria-labelledby="contact-info-heading">
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-3">
                Our Details
              </p>
              <h2
                id="contact-info-heading"
                className="font-display text-3xl md:text-4xl text-[#7A3D2A] font-bold mb-4"
              >
                Let us Connect
              </h2>
              <p className="font-sans text-sm text-[#a07f61] leading-relaxed">
                Whether you are looking for wholesale sourcing, a custom
                manufacturing partner, or international dispatch details — we
                are ready to assist.
              </p>
              <div
                aria-hidden="true"
                className="w-12 h-[2px] bg-[#BE6E5B] mt-6 mb-8"
              />

              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {contactItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      title={`Contact SANWARIYAS Wholesale Supplier via ${item.label}`}
                      aria-label={`${item.label}: ${item.line1}`}
                      className="cc-card"
                    >
                      <div className="cc-icon">{item.icon}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-1">
                          {item.label}
                        </p>
                        {item.isAddress ? (
                          <address className="not-italic">
                            <p className="font-sans text-sm text-[#7A3D2A] font-semibold break-words">
                              {item.line1}
                            </p>
                            <p className="font-sans text-xs text-[#a07f61] mt-0.5">
                              {item.line2}
                            </p>
                          </address>
                        ) : (
                          <>
                            <p className="font-sans text-sm text-[#7A3D2A] font-semibold break-words">
                              {item.line1}
                            </p>
                            <p className="font-sans text-xs text-[#a07f61] mt-0.5">
                              {item.line2}
                            </p>
                          </>
                        )}
                      </div>
                      <span
                        aria-hidden="true"
                        className="text-[#BE6E5B] opacity-40 flex-shrink-0 self-center pl-2 text-lg"
                      >
                        ›
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Map */}
              <div
                className="mt-6 rounded-xl overflow-hidden border border-[#BE6E5B]/20 shadow-sm"
                style={{ height: "220px" }}
              >
                <iframe
                  title="SANWARIYAS Jaipur Ethnic Wear Manufacturer Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.664904327016!2d75.78264639999999!3d26.818796499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4b51b58d103b%3A0xe385440bc09f2694!2sSANWARIYAS!5e0!3m2!1sen!2sin!4v1783946287931!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              {/* 24hr guarantee */}
              <aside
                aria-label="Service Guarantee"
                className="mt-6 relative overflow-hidden rounded-xl border border-[#BE6E5B]/20 bg-white/50 backdrop-blur-md p-6 text-center shadow-sm"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(190,110,91,0.07),transparent_60%)] pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center gap-3 mb-3 relative z-10"
                >
                  <div className="w-8 h-px bg-[#BE6E5B]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#BE6E5B]" />
                  <div className="w-8 h-px bg-[#BE6E5B]" />
                </div>
                <p className="font-display text-lg text-[#7A3D2A] font-bold mb-1 relative z-10">
                  24-48 Hour Response Guarantee
                </p>
                <p className="font-sans text-xs text-[#a07f61] leading-relaxed relative z-10">
                  We respond to every wholesale inquiry within 24-48 business
                  hours.
                </p>
              </aside>
            </section>

            {/* ── Right: Inquiry form ── */}
            <section
              aria-labelledby="inquiry-form-heading"
              className="bg-white/70 backdrop-blur-md border border-[#BE6E5B]/20 rounded-xl shadow-sm p-8 md:p-10"
            >
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-3">
                Trade Inquiry
              </p>
              <h2
                id="inquiry-form-heading"
                className="font-display text-3xl md:text-4xl text-[#7A3D2A] font-bold mb-4"
              >
                Send Your Bulk Inquiry
              </h2>
              <p className="font-sans text-sm text-[#a07f61] leading-relaxed">
                Fill in the form below and our export team will get back to you
                with custom pricing and availability.
              </p>
              <div
                aria-hidden="true"
                className="w-12 h-[2px] bg-[#BE6E5B] mt-6 mb-6"
              />

              {/* Logged in banner */}
              {isAuthenticated && (
                <LoggedInBanner user={user} router={router} />
              )}

              {/* Guest login prompt — shown after submission, auto-scrolled to */}
              {showLoginPrompt && !isAuthenticated && (
                <div ref={promptRef} className="mb-6">
                  <LoginPromptBanner router={router} />
                </div>
              )}

              {/* Form top anchor for scroll-to-error */}
              <div ref={formTopRef} />

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6 font-sans"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    Full Name *
                  </label>
                  <StyledInput
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    readOnly={isAuthenticated && !!user?.name} // FREEZE FIX
                    error={!!fieldErrors.name}
                    success={
                      touchedFields.name &&
                      !fieldErrors.name &&
                      formData.name.trim()
                    }
                  />
                  <FieldError message={fieldErrors.name} />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    Email Address *
                  </label>
                  <StyledInput
                    id="email"
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
                  {isAuthenticated && (
                    <p className="text-[10px] tracking-wider text-[#a07f61] mt-1">
                      Using your registered account email. Replies will appear
                      in your dashboard.
                    </p>
                  )}
                  <FieldError message={fieldErrors.email} />
                </div>

                {/* WhatsApp + Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                    >
                      WhatsApp Number
                    </label>
                    <StyledInput
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      readOnly={isAuthenticated && !!fullProfile?.phone}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                    >
                      Country
                    </label>
                    <StyledInput
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      readOnly={isAuthenticated && !!fullProfile?.country}
                    />
                  </div>
                </div>

                {/* Company + Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                    >
                      Company Name
                    </label>
                    <StyledInput
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      readOnly={isAuthenticated && !!fullProfile?.company}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="productCategory"
                      className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                    >
                      Product Category
                    </label>
                    <StyledInput
                      id="productCategory"
                      name="productCategory"
                      placeholder="e.g. Cotton Suits, Kurtis"
                      value={formData.productCategory}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Quantity — custom validation, no browser tooltip */}
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    Estimated Quantity{" "}
                    <span className="text-[#BE6E5B]">
                      (Min. 10 Pieces / 2 Sets)
                    </span>
                  </label>
                  <div className="relative">
                    <StyledInput
                      id="quantity"
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
                    {/* Suffix label */}
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[11px] text-[#a07f61] pointer-events-none">
                      pcs
                    </span>
                  </div>
                  <FieldError message={fieldErrors.quantity} />
                  {!fieldErrors.quantity && (
                    <p className="font-sans text-[11px] text-[#a07f61] mt-1.5">
                      Minimum wholesale order is 10 Pieces (2 Sets).{" "}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 border text-sm text-[#7A3D2A] focus:outline-none transition-colors duration-200 resize-none ${
                      fieldErrors.message
                        ? "border-red-400 bg-red-50/30"
                        : touchedFields.message && formData.message.trim()
                          ? "border-green-400 bg-green-50/20"
                          : "border-[#a07f61]/30 bg-[#f8f4ec] focus:border-[#BE6E5B]"
                    }`}
                    placeholder="Describe your requirements, preferred fabrics, delivery timeline, etc."
                  />
                  <FieldError message={fieldErrors.message} />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-4 bg-[#7A3D2A] text-white text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#5C2E1F] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
