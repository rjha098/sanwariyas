// FILE: client/src/lib/lookbookApi.js
// Lookbook-only API calls (magazine questions, lookbook inquiries, PDF
// catalogues). Kept in its own file so the shared lib/api.js stays untouched.
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
    .get("/lookbook/inquiries", {
      ...auth(token),
      params: status ? { status } : {},
    })
    .then((r) => r.data);
export const updateLookbookInquiryStatus = (token, id, status) =>
  api
    .patch(`/lookbook/inquiries/${id}`, { status }, auth(token))
    .then((r) => r.data);
export const deleteLookbookInquiry = (token, id) =>
  api.delete(`/lookbook/inquiries/${id}`, auth(token)).then((r) => r.data);

// ── customer: catalogue-aware feed + settings ───────────────────────────────
export const fetchLookbookConfig = () =>
  api.get("/lookbook/config").then((r) => r.data);
export const fetchPublishedCatalogues = () =>
  api.get("/lookbook/catalogues").then((r) => r.data);

// Loads legacy photos + published catalogue images page by page. `onPage`
// receives the items accumulated so far, so the UI can render immediately.
export const fetchAllLookbookItems = async (onPage) => {
  const PAGE_SIZE = 60;
  let page = 1;
  let all = [];
  for (;;) {
    const { data } = await api.get("/lookbook", {
      params: { scope: "all", page, limit: PAGE_SIZE },
    });
    if (!data.success)
      throw new Error(data.message || "Could not load lookbook");
    all = all.concat(data.items || []);
    if (onPage) onPage(all, data.pagination);
    if (!data.pagination?.pages || page >= data.pagination.pages) break;
    page += 1;
  }
  return all;
};

// Loads ONE published catalogue (its own pages only, in PDF order).
export const fetchCatalogueItems = async (catalogueId, onPage) => {
  const PAGE_SIZE = 60;
  let page = 1;
  let all = [];
  for (;;) {
    const { data } = await api.get("/lookbook", {
      params: { catalogue: catalogueId, page, limit: PAGE_SIZE },
    });
    if (!data.success)
      throw new Error(data.message || "Could not load catalogue");
    all = all.concat(data.items || []);
    if (onPage) onPage(all, data.pagination);
    if (!data.pagination?.pages || page >= data.pagination.pages) break;
    page += 1;
  }
  return all;
};

// ── admin: PDF catalogues ───────────────────────────────────────────────────
export const fetchAdminCatalogues = (token) =>
  api.get("/lookbook/catalogues/admin/all", auth(token)).then((r) => r.data);
export const fetchAdminCatalogue = (token, id, type = "") =>
  api
    .get(`/lookbook/catalogues/admin/${id}`, {
      ...auth(token),
      params: type ? { type } : {},
    })
    .then((r) => r.data);

// multipart upload with real progress (0-100) reported via onProgress
export const uploadCataloguePdf = (token, formData, onProgress) =>
  api
    .post("/lookbook/catalogues", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 0,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    })
    .then((r) => r.data);

export const retryCatalogue = (token, id) =>
  api
    .post(`/lookbook/catalogues/${id}/retry`, {}, auth(token))
    .then((r) => r.data);
export const updateCatalogue = (token, id, body) =>
  api
    .patch(`/lookbook/catalogues/${id}`, body, auth(token))
    .then((r) => r.data);
export const deleteCatalogue = (token, id) =>
  api.delete(`/lookbook/catalogues/${id}`, auth(token)).then((r) => r.data);
export const updateCatalogueItem = (token, id, itemId, body) =>
  api
    .patch(`/lookbook/catalogues/${id}/items/${itemId}`, body, auth(token))
    .then((r) => r.data);
export const setCatalogueItemsPublished = (token, id, body) =>
  api
    .post(`/lookbook/catalogues/${id}/publish-items`, body, auth(token))
    .then((r) => r.data);
export const saveCatalogueOrder = (token, id, ids) =>
  api
    .put(`/lookbook/catalogues/${id}/order`, { ids }, auth(token))
    .then((r) => r.data);
