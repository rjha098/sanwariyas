// FILE: server/controllers/passwordSetController.js
// Two-step "set a password" flow for a signed-in Google-first customer:
//   1. POST /auth/password/set/verify  { otp }                       -> { verifyToken }
//   2. POST /auth/password/set/confirm { verifyToken, newPassword, confirmPassword }
// The user id always comes from the verified access token, never from the body.
import * as accountService from "../services/accountService.js";

const accountError = (res, error) =>
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : "Server error. Please try again.",
    ...(error.meta || {}),
  });

const requireCustomerId = (req, res) => {
  if (req.authUser?.role === "customer" && req.authUser.id) {
    return req.authUser.id;
  }
  res
    .status(403)
    .json({ success: false, message: "Customer account required." });
  return null;
};

export const setPasswordVerify = async (req, res) => {
  try {
    const userId = requireCustomerId(req, res);
    if (!userId) return undefined;
    const { otp } = req.body || {};
    if (typeof otp !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Please enter the 6-digit code." });
    }
    const result = await accountService.verifySetPasswordCode(userId, otp);
    return res.json({
      success: true,
      message: "Code verified. Now choose your new password.",
      ...result,
    });
  } catch (error) {
    return accountError(res, error);
  }
};

export const setPasswordConfirm = async (req, res) => {
  try {
    const userId = requireCustomerId(req, res);
    if (!userId) return undefined;
    const { otp, verifyToken, newPassword, confirmPassword } = req.body || {};
    if (
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string" ||
      (typeof verifyToken !== "string" && typeof otp !== "string")
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    await accountService.confirmSetPassword(
      userId,
      otp,
      newPassword,
      confirmPassword,
      verifyToken,
    );
    const security = await accountService.getSecurityInfo(userId);
    return res.json({
      success: true,
      message: "Password set. You can now sign in with email and password too.",
      security,
    });
  } catch (error) {
    return accountError(res, error);
  }
};