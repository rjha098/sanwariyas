// FILE: client/src/lib/lookbookApi.js
// Lookbook-only API calls (magazine questions + lookbook inquiries).
// Kept in its own file so the shared lib/api.js stays untouched.
import api from "@/lib/api";

const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// magazine questions
export const fetchLookbookQuestions = () =>
  api.get("/lookbook/questions").then((r) => r.data);
export const fetchAllLookbookQuestions = (token) =>
  api.get("/lookbook/questions/all", auth(token)).then((r) => r.data);
export const createLookbookQuestion = (token, body) =>
  api.post("/lookbook/questions", body, auth(token)).then((r) => r.data);
export const updateLookbookQuestion = (token, id, body) =>
  api.patch(`/lookbook/questions/${id}`, body, auth(token)).then((r) => r.data);
export const deleteLookbookQuestion = (token, id) =>
  api.delete(`/lookbook/questions/${id}`, auth(token)).then((r) => r.data);

// lookbook inquiries
export const submitLookbookInquiry = (body) =>
  api.post("/lookbook/inquiries", body).then((r) => r.data);
export const fetchLookbookInquiries = (token, status = "") =>
  api
    .get("/lookbook/inquiries", { ...auth(token), params: status ? { status } : {} })
    .then((r) => r.data);
export const updateLookbookInquiryStatus = (token, id, status) =>
  api.patch(`/lookbook/inquiries/${id}`, { status }, auth(token)).then((r) => r.data);
export const deleteLookbookInquiry = (token, id) =>
  api.delete(`/lookbook/inquiries/${id}`, auth(token)).then((r) => r.data);