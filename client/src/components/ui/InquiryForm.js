// FILE: client/src/components/ui/InquiryForm.js
"use client";
import { useState } from "react";

import { submitInquiry } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import SampleImageUpload, {
  useSampleImages,
  buildInquiryFormData,
} from "@/components/ui/SampleImageUpload";
import Link from "next/link";

export default function InquiryForm({ productId = null, productName = "" }) {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    whatsapp: "",
    country: "",
    state: "",
    productCategory: "Cotton Suits",
    quantity: 10,
    budgetRange: "",
    message: productName
      ? `I am interested in: ${productName}. Please share pricing and availability.`
      : "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success

  // Optional product sample images (max 2, validated inside the hook)
  const sampleImages = useSampleImages();

  // Custom Toast State
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleWhatsAppRedirect = () => {
    const adminPhone = "919680812813";
    const text = `Hi, I just submitted an inquiry on your website.\n\nCompany: ${form.companyName}\nCategory: ${form.productCategory}\nQuantity: ${form.quantity} pcs\n\nCan we discuss further?`;
    window.open(
      `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'&-]{1,79}$/u.test(form.state.trim())) {
      setStatus("idle");
      showToast("Please enter your state.", "error");
      return;
    }

    if (form.quantity < 10) {
      setStatus("idle");
      showToast("Minimum Order Quantity (MOQ) is 10 pieces.", "error");
      return;
    }

    try {
      const token = sessionStorage.getItem("sanwariyas_token");

      // multipart/form-data: submitInquiry() (lib/api.js) unsets the default JSON
      // Content-Type so the browser sends the FormData with its own boundary.
      await submitInquiry(
        buildInquiryFormData(
          { ...form, productId, productName },
          sampleImages.files,
        ),
        token,
      );

      setStatus("success");
    } catch (err) {
      setStatus("idle");

      showToast(
        err.response?.data?.message || "Something went wrong.",
        "error",
      );
    }
  };

  return (
    <>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-brand-parchment border border-brand-gold/40 p-8 text-center animate-fade-in"
        >
          <div aria-hidden="true" className="text-4xl mb-4 text-brand-gold">
            ✦
          </div>
          <h3 className="font-display text-2xl text-brand-african mb-3">
            Inquiry Received!
          </h3>
          <p className="font-sans text-sm text-brand-mud leading-relaxed mb-6">
            Our wholesale team will review your requirements and contact you
            within 24-48 hours.
            <br />
            <br />
            <strong>Want to track responses or view custom quotes?</strong>
            <br />
            Please <Link href="/login">Login</Link> to view your inquiry
            dashboard.
          </p>

          <button
            onClick={handleWhatsAppRedirect}
            aria-label="Chat with SANWARIYAS Wholesale Manufacturing Team on WhatsApp"
            className="w-full bg-[#25D366] text-white font-sans text-xs tracking-[0.2em] uppercase py-4 hover:bg-[#1DA851] transition-all duration-300 flex items-center justify-center gap-3 mb-4 shadow-lg"
          >
            <span aria-hidden="true">✦</span> Connect on WhatsApp Now
          </button>

          <button
            onClick={() => {
              setStatus("idle");
              sampleImages.reset();
              setForm({
                name: "",
                companyName: "",
                email: "",
                whatsapp: "",
                country: "",
                state: "",
                productCategory: "Cotton Suits",
                quantity: 10,
                budgetRange: "",
                message: "",
              });
            }}
            className="font-sans text-[10px] tracking-widest uppercase text-brand-coffee border-b border-brand-coffee pb-0.5 hover:text-brand-african transition-colors"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label="Wholesale Inquiry Form"
        >
          {productName && (
            <div className="bg-brand-lightgold/20 border-l-2 border-brand-gold px-4 py-3">
              <p className="font-sans text-[10px] tracking-widest uppercase text-brand-gold mb-0.5">
                Inquiring About
              </p>
              <p className="font-display text-brand-african text-lg">
                {productName}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="inquiry-name"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                Full Name{" "}
                <span aria-hidden="true" className="text-brand-gold">
                  *
                </span>
              </label>
              <input
                id="inquiry-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="name"
                placeholder="Your full name"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="inquiry-company"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                Company / Boutique Name{" "}
                <span aria-hidden="true" className="text-brand-gold">
                  *
                </span>
              </label>
              <input
                id="inquiry-company"
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="organization"
                placeholder="Your business name"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="inquiry-email"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                Email Address{" "}
                <span aria-hidden="true" className="text-brand-gold">
                  *
                </span>
              </label>
              <input
                id="inquiry-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="inquiry-whatsapp"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                WhatsApp Number{" "}
                <span aria-hidden="true" className="text-brand-gold">
                  *
                </span>
              </label>
              <input
                id="inquiry-whatsapp"
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="tel"
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="inquiry-country"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                Country{" "}
                <span aria-hidden="true" className="text-brand-gold">
                  *
                </span>
              </label>
              <input
                id="inquiry-country"
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="country-name"
                placeholder="e.g. USA, UK, India"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="inquiry-state"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                State{" "}
                <span aria-hidden="true" className="text-brand-gold">
                  *
                </span>
              </label>
              <input
                id="inquiry-state"
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                aria-required="true"
                maxLength={80}
                autoComplete="address-level1"
                placeholder="e.g. Rajasthan"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="inquiry-category"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                Product Category{" "}
                <span aria-hidden="true" className="text-brand-gold">
                  *
                </span>
              </label>
              <select
                id="inquiry-category"
                name="productCategory"
                title="Select Product Category"
                value={form.productCategory}
                onChange={handleChange}
                aria-required="true"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african focus:outline-none focus:border-brand-coffee transition-colors duration-300 appearance-none"
              >
                <option value="Cotton Suits">Cotton Suits</option>
                <option value="Anarkali">Anarkali</option>
                <option value="A-Line">A-Line Suits</option>
                <option value="Straight 3 Piece">Straight 3 Piece</option>
                <option value="Co-Ord Set">Co-Ord Set</option>
                <option value="Short Kurti">Short Kurti</option>
                <option value="Long Kurti">Long Kurti</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="inquiry-qty"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                Quantity (MOQ: 10){" "}
                <span aria-hidden="true" className="text-brand-gold">
                  *
                </span>
              </label>
              {/* ✅ SEO FIX: Attached aria-describedby to link validation rule directly to the input */}
              <input
                id="inquiry-qty"
                type="number"
                name="quantity"
                min="10"
                value={form.quantity}
                onChange={handleChange}
                required
                aria-required="true"
                aria-describedby="moq-warning"
                aria-invalid={form.quantity < 10}
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="inquiry-budget"
                className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
              >
                Target Budget (Optional)
              </label>
              <input
                id="inquiry-budget"
                type="text"
                name="budgetRange"
                value={form.budgetRange}
                onChange={handleChange}
                placeholder="e.g. $10-$15 per piece"
                className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="inquiry-message"
              className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
            >
              Message{" "}
              <span aria-hidden="true" className="text-brand-gold">
                *
              </span>
            </label>
            <textarea
              id="inquiry-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              aria-required="true"
              rows={4}
              placeholder="Tell us about your requirements, specific designs, or fabrics..."
              className="w-full bg-white border border-brand-lightgold/60 px-4 py-3 font-sans text-sm text-brand-african placeholder:text-brand-mud/40 focus:outline-none focus:border-brand-coffee transition-colors duration-300 resize-none"
            />
          </div>

          {/* Product sample images — optional */}
          <SampleImageUpload
            images={sampleImages}
            disabled={status === "loading"}
            labelClassName="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            aria-busy={status === "loading"}
            aria-label="Submit Wholesale Ethnic Wear Inquiry to SANWARIYAS"
            className="w-full bg-brand-coffee text-brand-cream font-sans text-xs tracking-[0.3em] uppercase py-4 hover:bg-brand-african transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {status === "loading" ? (
              <>
                <span
                  aria-hidden="true"
                  className="w-4 h-4 border-2 border-brand-cream/30 border-t-brand-cream rounded-full animate-spin"
                />{" "}
                Sending...
              </>
            ) : (
              <>
                <span aria-hidden="true">✦</span> Send Inquiry
              </>
            )}
          </button>

          {/*  SEO FIX: Linked this text to the quantity input via ID for screen readers */}
          <p
            id="moq-warning"
            className="font-sans text-[10px] text-brand-mud/50 text-center uppercase tracking-widest"
            aria-live="polite"
          >
            Strictly Wholesale Only. Minimum Order Quantity is 10 Pieces.
          </p>
        </form>
      )}
    </>
  );
}
