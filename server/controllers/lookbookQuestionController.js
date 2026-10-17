// FILE: server/controllers/lookbookQuestionController.js
import LookbookQuestion from "../models/LookbookQuestion.js";

const clean = (body = {}) => {
  const out = {};
  if (body.text !== undefined) out.text = String(body.text).trim();
  if (body.type !== undefined)
    out.type = body.type === "multiple" ? "multiple" : "single";
  if (body.options !== undefined) {
    const arr = Array.isArray(body.options) ? body.options : [];
    out.options = Array.from(
      new Set(arr.map((o) => String(o || "").trim()).filter(Boolean)),
    );
  }
  if (body.afterPhoto !== undefined) {
    out.afterPhoto = Math.min(
      Math.max(parseInt(body.afterPhoto, 10) || 1, 1),
      500,
    );
  }
  if (body.isActive !== undefined)
    out.isActive = body.isActive === true || body.isActive === "true";
  return out;
};

const fail = (res, error) => {
  const status =
    error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;
  res.status(status).json({ success: false, message: error.message });
};

// PUBLIC — only active questions, in the order they appear in the magazine
export const getActiveQuestions = async (_req, res) => {
  try {
    const questions = await LookbookQuestion.find({ isActive: true })
      .sort({ afterPhoto: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, questions });
  } catch (error) {
    fail(res, error);
  }
};

// ADMIN — everything, including hidden ones
export const getAllQuestions = async (_req, res) => {
  try {
    const questions = await LookbookQuestion.find()
      .sort({ afterPhoto: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, questions });
  } catch (error) {
    fail(res, error);
  }
};

export const createQuestion = async (req, res) => {
  try {
    const question = await LookbookQuestion.create(clean(req.body));
    res.status(201).json({ success: true, question });
  } catch (error) {
    fail(res, error);
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await LookbookQuestion.findById(req.params.id);
    if (!question)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    Object.assign(question, clean(req.body));
    await question.save();
    res.json({ success: true, question });
  } catch (error) {
    fail(res, error);
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const q = await LookbookQuestion.findByIdAndDelete(req.params.id);
    if (!q)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    res.json({ success: true, message: "Question removed" });
  } catch (error) {
    fail(res, error);
  }
};