// FILE: server/middlewares/validateSignup.js
//
// usage ----->>>>>  Runs BEFORE the signup controller. It rejects bad input
// with HTTP 400 (field-wise errors) and duplicate accounts with HTTP 409, so
// the controller / service only ever see clean, valid data.
//
// Error response shape (the frontend uses `errors` to show each message
// right next to the field it belongs to):
//
//   { success: false, message: "...", errors: { email: "...", phone: "..." } }

import User from "../models/User.js";
import { normalizeEmail, normalizePhone } from "../utils/normalize.js";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateCompany,
  validateCountry,
  validateCountryMatchesDial,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators.js";

const sendFieldErrors = (res, status, message, errors) =>
  res.status(status).json({ success: false, message, errors });

export const validateSignup = async (req, res, next) => {
  try {
    const body = req.body;

    // Body must be a plain JSON object (blocks arrays, strings, null).
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request." });
    }

    const countryCode = String(body.countryCode ?? "")
      .replace(/\D/g, "")
      .trim();

    const errors = {};

    const nameErr = validateName(body.name);
    if (nameErr) errors.name = nameErr;

    const emailErr = validateEmail(body.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validatePhone(body.phone, countryCode);
    if (phoneErr) errors.phone = phoneErr;

    const companyErr = validateCompany(body.company);
    if (companyErr) errors.company = companyErr;

    // Country must be the one that owns the phone code (India + +60 = reject).
    const countryErr =
      validateCountry(body.country) ||
      validateCountryMatchesDial(body.country, countryCode);
    if (countryErr) errors.country = countryErr;

    const passwordErr = validatePassword(body.password);
    if (passwordErr) errors.password = passwordErr;

    // Only compare confirm-password when the password itself is acceptable,
    // otherwise the user sees two messages for one mistake.
    const confirmErr = validateConfirmPassword(
      body.password,
      body.confirmPassword,
    );
    if (confirmErr) errors.confirmPassword = confirmErr;

    if (Object.keys(errors).length > 0) {
      return sendFieldErrors(
        res,
        400,
        "Please correct the highlighted fields.",
        errors,
      );
    }

    // Normalise what the service will receive.
    body.name = body.name.trim();
    body.email = normalizeEmail(body.email);
    body.phone = normalizePhone(body.phone);
    body.countryCode = countryCode;
    body.company = typeof body.company === "string" ? body.company.trim() : "";
    body.country = body.country.trim();

    // ── Duplicate check (friendly, field-wise) ───────────────────────────
    // The unique indexes in the User model remain the final safety net for
    // two requests arriving at the same instant (controller handles 11000).
    const existing = await User.findOne({
      $or: [{ email: body.email }, { phone: body.phone }],
    })
      .select("email phone")
      .lean();

    if (existing) {
      const duplicateErrors = {};
      if (existing.email === body.email) {
        duplicateErrors.email = "An account with this email already exists.";
      }
      if (existing.phone === body.phone) {
        duplicateErrors.phone =
          "An account with this phone number already exists.";
      }
      return sendFieldErrors(
        res,
        409,
        Object.values(duplicateErrors)[0],
        duplicateErrors,
      );
    }

    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error during signup." });
  }
};

export default validateSignup;
