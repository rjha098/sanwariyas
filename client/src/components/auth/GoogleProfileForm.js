// FILE: client/src/components/auth/GoogleProfileForm.js
// PURPOSE: Step 2 for a FIRST-TIME Google user. Google gives us a verified
// email + name; this B2B site also needs phone, company and country.
"use client";

import { useState } from "react";
import PhoneInput from "@/components/ui/PhoneInput";
import CountrySelect from "@/components/ui/CountrySelect";
import {
  validateName,
  validatePhoneLocal,
  validateCompany,
  validateCountry,
  validateCountryMatchesDial,
} from "@/utils/phoneRules";

const inp =
  "w-full min-w-0 border border-brand-lightgold/60 px-4 py-3 text-base sm:text-sm bg-white focus:outline-none focus:border-brand-coffee transition-colors";
const lbl =
  "block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2";
const btn =
  "w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const Err = ({ message }) =>
  message ? (
    <p className="mt-1 font-sans text-[11px] text-red-700" role="alert">
      {message}
    </p>
  ) : null;

export default function GoogleProfileForm({
  profile,
  submitting,
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState("");
  const [parts, setParts] = useState({ dial: "91", local: "" });
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});
  const [countryManual, setCountryManual] = useState(false);

  const autoSetCountry = (c) => {
    setCountry(c);
    setErrors((e) => ({ ...e, country: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const next = {};
    const n = validateName(name);
    if (n) next.name = n;
    const p = validatePhoneLocal(parts.dial, parts.local);
    if (p) next.phone = p;
    const c = validateCompany(company);
    if (c) next.company = c;

    const k =
      validateCountry(country) ||
      validateCountryMatchesDial(country, parts.dial);
    if (k) next.country = k;

    setErrors(next);
    if (Object.keys(next).length) return;

    const result = await onSubmit({
      name: name.trim(),
      phone,
      countryCode: parts.dial,
      company: company.trim(),
      country: country.trim(),
    });
    // Backend field-wise errors (e.g. phone already registered).
    if (result && result.success === false && result.fieldErrors) {
      setErrors(result.fieldErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="pb-4 border-b border-brand-lightgold/30">
        <h2 className="font-display text-2xl text-brand-african">
          Almost done
        </h2>
        <p className="font-sans text-xs text-brand-mud mt-1">
          Signing up as <strong>{profile?.email}</strong>. Add a few business
          details to finish creating your wholesale account.
        </p>
      </div>

      <div>
        <label className={lbl}>Full Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inp}
          autoComplete="name"
        />
        <Err message={errors.name} />
      </div>

      <div>
        <label className={lbl}>Phone *</label>
        <PhoneInput
          id="google-phone"
          value={phone}
          onChange={setPhone}
          onPartsChange={setParts}
          onCountryChange={(name) => {
            if (!countryManual) autoSetCountry(name);
          }}
          onDetect={({ countries, ambiguous }) => {
            if (!ambiguous && !countryManual) autoSetCountry(countries[0]);
          }}
          error={!!errors.phone}
          textClassName="text-brand-mud"
          placeholder="Phone number"
        />
        <Err message={errors.phone} />
      </div>

      <div>
        <label className={lbl}>Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inp}
          autoComplete="organization"
        />
        <Err message={errors.company} />
      </div>

      <div>
        <label className={lbl}>Country *</label>
        <CountrySelect
          id="google-country"
          value={country}
          onChange={(v) => {
            setCountryManual(true);
            setCountry(v);
          }}
          error={!!errors.country}
          className={inp}
          placeholder="Select country"
        />
        <Err message={errors.country} />
      </div>

      <button type="submit" disabled={submitting} className={btn}>
        {submitting ? "Creating account..." : "Create Account"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee"
      >
        ← Cancel
      </button>
    </form>
  );
}
