// FILE: client/src/components/admin/LookbookCatalogueManager.js
// Admin: upload a PDF catalogue, watch processing, review/edit/reorder the
// generated images, preview, publish, archive or delete.
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LookbookGrid from "@/components/lookbook/LookbookGrid";
import LookbookMagazine from "@/components/lookbook/LookbookMagazine";
import LookbookModal from "@/components/lookbook/LookbookModal";
import { getImageUrl } from "@/lib/imageUrl";
import {
  deleteCatalogue,
  fetchAdminCatalogue,
  fetchAdminCatalogues,
  retryCatalogue,
  saveCatalogueOrder,
  setCatalogueItemsPublished,
  updateCatalogue,
  updateCatalogueItem,
  uploadCataloguePdf,
} from "@/lib/lookbookApi";
import "@/components/lookbook/lookbook.css";

const errText = (err, fallback) =>
  err?.response?.data?.message || err?.userMessage || fallback;

const STATUS_LABEL = {
  processing: "Processing",
  failed: "Needs retry",
  draft: "Ready · not published",
  published: "Published",
  archived: "Archived",
};

const EMPTY_SET = new Set();
const noop = () => {};

const fmtMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// ───────────────────────────── upload ─────────────────────────────
function UploadPanel({ token, limits, onUploaded, toast }) {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState({
    title: "",
    collectionName: "",
    season: "",
    description: "",
  });
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | uploading | validating
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const pick = (e) => {
    const f = e.target.files?.[0];
    setError("");
    if (!f) return setFile(null);
    if (!/\.pdf$/i.test(f.name) || (f.type && f.type !== "application/pdf")) {
      setFile(null);
      e.target.value = "";
      return setError("Please choose a PDF file.");
    }
    if (limits && f.size > limits.maxPdfMb * 1024 * 1024) {
      setFile(null);
      e.target.value = "";
      return setError(
        `This PDF is ${fmtMb(f.size)}. The maximum allowed is ${limits.maxPdfMb} MB.`,
      );
    }
    setFile(f);
    setFields((v) => ({ ...v, title: v.title || f.name.replace(/\.pdf$/i, "") }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file || phase !== "idle") return;
    setError("");
    setPct(0);
    setPhase("uploading");
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
    fd.append("pdf", file);
    try {
      const res = await uploadCataloguePdf(token, fd, (p) => {
        setPct(p);
        if (p >= 100) setPhase("validating");
      });
      toast(res.message || "PDF accepted. Processing started.");
      setFile(null);
      setFields({ title: "", collectionName: "", season: "", description: "" });
      if (inputRef.current) inputRef.current.value = "";
      onUploaded();
    } catch (err) {
      setError(errText(err, "Upload failed. Please try again."));
    } finally {
      setPhase("idle");
      setPct(0);
    }
  };

  const busy = phase !== "idle";
  const set = (k) => (e) => setFields((v) => ({ ...v, [k]: e.target.value }));

  return (
    <form className="lb-panel" onSubmit={submit} aria-label="Upload catalogue PDF">
      <h2 style={{ fontSize: 18 }}>Upload a PDF catalogue</h2>
      <p className="lb-sub" style={{ marginBottom: 12 }}>
        Every page of the PDF becomes one full-page image, in the same order
        as the PDF.
        {limits && ` Limit: ${limits.maxPdfMb} MB and ${limits.maxPages} pages.`}
      </p>
      <div className="lb-field">
        <label htmlFor="lb-pdf">PDF file *</label>
        <input
          id="lb-pdf"
          ref={inputRef}
          className="lb-input"
          style={{ paddingTop: 8 }}
          type="file"
          accept="application/pdf,.pdf"
          onChange={pick}
          disabled={busy}
        />
      </div>
      <div className="lb-form-grid">
        <div className="lb-field">
          <label htmlFor="lb-c-title">Catalogue title *</label>
          <input id="lb-c-title" className="lb-input" value={fields.title} onChange={set("title")} maxLength={150} disabled={busy} />
        </div>
        <div className="lb-field">
          <label htmlFor="lb-c-coll">Collection name</label>
          <input id="lb-c-coll" className="lb-input" value={fields.collectionName} onChange={set("collectionName")} maxLength={80} placeholder="e.g. Festive Collection" disabled={busy} />
        </div>
        <div className="lb-field">
          <label htmlFor="lb-c-season">Season</label>
          <input id="lb-c-season" className="lb-input" value={fields.season} onChange={set("season")} maxLength={60} placeholder="e.g. Winter 2026" disabled={busy} />
        </div>
      </div>
      <div className="lb-field">
        <label htmlFor="lb-c-desc">Description (optional)</label>
        <textarea id="lb-c-desc" className="lb-input" value={fields.description} onChange={set("description")} maxLength={1000} disabled={busy} />
      </div>

      {busy && (
        <div role="status" aria-live="polite" style={{ marginBottom: 12 }}>
          <div className="lb-progress">
            <span style={{ width: `${phase === "validating" ? 100 : pct}%` }} />
          </div>
          <p className="lb-meta" style={{ marginTop: 6 }}>
            {phase === "validating"
              ? "Upload complete — validating the PDF on the server…"
              : `Uploading… ${pct}%`}
          </p>
        </div>
      )}
      {error && (
        <p className="lb-err" role="alert" style={{ marginBottom: 10 }}>
          {error}
        </p>
      )}
      <button type="submit" className="lb-btn lb-btn--accent" disabled={!file || busy}>
        {busy ? "Please wait…" : "Upload & process PDF"}
      </button>
    </form>
  );
}

// ───────────────────────────── card ─────────────────────────────
function CatalogueCard({ c, busyId, onReview, onAction, showToast }) {
  const [copied, setCopied] = useState(false);
  // Customer link that opens ONLY this catalogue.
  const copyLink = async () => {
    const url = `${window.location.origin}/lookbook?catalogue=${c._id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (showToast) showToast("Customer link copied.", "success");
    } catch {
      window.prompt("Copy this customer link:", url);
    }
  };
  const processing = c.status === "processing";
  const pct = c.totalPages ? Math.round((c.donePages / c.totalPages) * 100) : 0;
  const r = c.report || {};
  const busy = busyId === c._id;
  return (
    <li className="lb-panel">
      <div className="lb-cat-row">
        {c.cover ? (
          <img className="lb-cat-cover" src={getImageUrl(c.cover)} alt="" loading="lazy" />
        ) : (
          <div className="lb-cat-cover" aria-hidden="true" />
        )}
        <div className="lb-cat-main">
          <div className="lb-row" style={{ justifyContent: "flex-start", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{c.title}</h3>
            <span className={`lb-pill lb-pill--${c.status}`}>{STATUS_LABEL[c.status]}</span>
          </div>
          <p className="lb-meta">
            {[c.collectionName, c.season, c.originalName && `${c.originalName} (${fmtMb(c.pdfBytes)})`]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {processing && (
            <div style={{ marginTop: 10 }} role="status" aria-live="polite">
              <div className="lb-progress"><span style={{ width: `${pct}%` }} /></div>
              <p className="lb-meta" style={{ marginTop: 6 }}>
                {c.stage || "Working"} · {c.donePages}/{c.totalPages || "?"} pages ({pct}%)
              </p>
            </div>
          )}

          {c.status === "failed" && (
            <p className="lb-warn" role="alert">
              {c.error || "Processing failed."} ({c.donePages}/{c.totalPages || "?"} pages already done — they will not be repeated.)
            </p>
          )}

          {!processing && c.counts.total > 0 && (
            <p className="lb-meta" style={{ marginTop: 8 }}>
              {c.counts.pages} page image{c.counts.pages === 1 ? "" : "s"} ·{" "}
              {c.counts.published} visible to customers
            </p>
          )}
          {(c.warnings || []).map((w) => (
            <p key={w} className="lb-warn">{w}</p>
          ))}

          <div className="lb-actions">
            {c.counts.total > 0 && (
              <button type="button" className="lb-btn lb-btn--sm lb-btn--accent" onClick={() => onReview(c._id)}>
                Review images
              </button>
            )}
            {c.status === "failed" && (
              <button type="button" className="lb-btn lb-btn--sm" disabled={busy} onClick={() => onAction("retry", c)}>
                Retry processing
              </button>
            )}
            {c.status === "draft" && (
              <button type="button" className="lb-btn lb-btn--sm" disabled={busy} onClick={() => onAction("publish", c)}>
                Publish catalogue
              </button>
            )}
            {c.status === "published" && (
              <button type="button" className="lb-btn lb-btn--sm lb-btn--accent" onClick={copyLink}>
                {copied ? "Link copied ✓" : "Copy customer link"}
              </button>
            )}
            {c.status === "published" && (
              <button type="button" className="lb-btn lb-btn--sm" disabled={busy} onClick={() => onAction("unpublish", c)}>
                Unpublish
              </button>
            )}
            {["draft", "published"].includes(c.status) && (
              <button type="button" className="lb-btn lb-btn--sm" disabled={busy} onClick={() => onAction("archive", c)}>
                Archive
              </button>
            )}
            {c.status === "archived" && (
              <button type="button" className="lb-btn lb-btn--sm" disabled={busy} onClick={() => onAction("restore", c)}>
                Restore as draft
              </button>
            )}
            {!processing && (
              <button type="button" className="lb-btn lb-btn--sm lb-btn--danger" disabled={busy} onClick={() => onAction("delete", c)}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

// ───────────────────────────── editor ─────────────────────────────
function CatalogueEditor({ token, id, onClose, onChanged, toast }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState(null);
  const [order, setOrder] = useState([]);
  const [orderDirty, setOrderDirty] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState(null); // null | { view }
  const [viewer, setViewer] = useState(null);
  const [overId, setOverId] = useState(null);
  const dragId = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await fetchAdminCatalogue(token, id);
      setData(res);
      setMeta({
        title: res.catalogue.title,
        collectionName: res.catalogue.collectionName,
        season: res.catalogue.season,
        description: res.catalogue.description,
      });
      setOrder(res.items.map((i) => i._id));
      setOrderDirty(false);
      setDrafts({});
      setError("");
    } catch (err) {
      setError(errText(err, "Could not load this catalogue."));
    }
  }, [token, id]);

  useEffect(() => {
    load();
  }, [load]);

  const byId = useMemo(
    () => new Map((data?.items || []).map((i) => [i._id, i])),
    [data],
  );
  const ordered = useMemo(
    () => order.map((x) => byId.get(x)).filter(Boolean),
    [order, byId],
  );
  const shown = ordered.filter((i) => filter === "all" || i.sourceType === filter);
  const previewItems = ordered.filter((i) => i.isPublished);

  const run = async (fn, okMsg) => {
    try {
      const res = await fn();
      toast(res?.message || okMsg);
      await load();
      onChanged();
    } catch (err) {
      toast(errText(err, "Action failed."), "error");
    }
  };

  const move = (itemId, delta) => {
    setOrder((prev) => {
      const i = prev.indexOf(itemId);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setOrderDirty(true);
  };

  const drop = (targetId) => {
    const from = dragId.current;
    dragId.current = null;
    setOverId(null);
    if (!from || from === targetId) return;
    setOrder((prev) => {
      const next = prev.filter((x) => x !== from);
      next.splice(next.indexOf(targetId), 0, from);
      return next;
    });
    setOrderDirty(true);
  };

  const draftOf = (item) =>
    drafts[item._id] || { title: item.title, styleNumber: item.styleNumber };
  const setDraft = (item, patch) =>
    setDrafts((d) => ({ ...d, [item._id]: { ...draftOf(item), ...patch } }));
  const isDirty = (item) => {
    const d = drafts[item._id];
    return !!d && (d.title !== item.title || d.styleNumber !== item.styleNumber);
  };

  if (error) {
    return (
      <div className="lb-panel">
        <p className="lb-err" role="alert">{error}</p>
        <button type="button" className="lb-btn lb-btn--sm" onClick={onClose}>Back</button>
      </div>
    );
  }
  if (!data) return <div className="lb-panel" aria-busy="true">Loading images…</div>;

  const c = data.catalogue;
  const editable = c.status !== "processing";

  return (
    <div>
      <div className="lb-row" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <button type="button" className="lb-btn lb-btn--sm" onClick={onClose}>← All catalogues</button>
        <div className="lb-actions" style={{ marginTop: 0 }}>
          <button type="button" className="lb-btn lb-btn--sm lb-btn--accent" onClick={() => setPreview({ view: "grid" })} disabled={!previewItems.length}>
            Preview as customer
          </button>
          {c.status === "draft" && (
            <button type="button" className="lb-btn lb-btn--sm" onClick={() => run(() => updateCatalogue(token, id, { status: "published" }), "Catalogue published.")}>
              Publish catalogue
            </button>
          )}
          {c.status === "published" && (
            <button type="button" className="lb-btn lb-btn--sm" onClick={() => run(() => updateCatalogue(token, id, { status: "draft" }), "Catalogue unpublished.")}>
              Unpublish
            </button>
          )}
        </div>
      </div>

      <section className="lb-panel" aria-label="Catalogue details">
        <div className="lb-row" style={{ justifyContent: "flex-start", gap: 10, marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 17 }}>Catalogue details</h3>
          <span className={`lb-pill lb-pill--${c.status}`}>{STATUS_LABEL[c.status]}</span>
        </div>
        <div className="lb-form-grid">
          {[["title", "Title", 150], ["collectionName", "Collection name", 80], ["season", "Season", 60]].map(([k, label, max]) => (
            <div className="lb-field" key={k}>
              <label htmlFor={`lb-m-${k}`}>{label}</label>
              <input id={`lb-m-${k}`} className="lb-input" value={meta[k]} maxLength={max} onChange={(e) => setMeta((m) => ({ ...m, [k]: e.target.value }))} />
            </div>
          ))}
        </div>
        <div className="lb-field">
          <label htmlFor="lb-m-desc">Description</label>
          <textarea id="lb-m-desc" className="lb-input" value={meta.description} maxLength={1000} onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))} />
        </div>
        <button type="button" className="lb-btn lb-btn--sm lb-btn--accent" onClick={() => run(() => updateCatalogue(token, id, meta), "Details saved.")}>
          Save details
        </button>
      </section>

      <section className="lb-panel" aria-label="Images">
        <div className="lb-row" style={{ flexWrap: "wrap", marginBottom: 12 }}>
          <div className="lb-seg" role="group" aria-label="Filter images">
            {[["all", `All pages (${data.items.length})`]].map(([k, label]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>
            ))}
          </div>
          <div className="lb-actions" style={{ marginTop: 0 }}>
            <button type="button" className="lb-btn lb-btn--sm" disabled={!editable} onClick={() => run(() => setCatalogueItemsPublished(token, id, { sourceType: "page", isPublished: true }), "Pages published.")}>Show all pages</button>
            <button type="button" className="lb-btn lb-btn--sm" disabled={!editable} onClick={() => run(() => setCatalogueItemsPublished(token, id, { sourceType: "page", isPublished: false }), "Pages hidden.")}>Hide all pages</button>
          </div>
        </div>

        {orderDirty && (
          <div className="lb-note" style={{ marginBottom: 12 }} role="status">
            Order changed.{" "}
            <button type="button" className="lb-btn lb-btn--sm lb-btn--accent" onClick={() => run(() => saveCatalogueOrder(token, id, order), "Order saved.")}>Save order</button>{" "}
            <button type="button" className="lb-btn lb-btn--sm" onClick={load}>Discard</button>
          </div>
        )}
        {filter !== "all" && (
          <p className="lb-meta" style={{ marginBottom: 10 }}>Switch to “All” to reorder images.</p>
        )}

        {!shown.length ? (
          <p className="lb-meta">No images to show here.</p>
        ) : (
          <ul className="lb-admin-grid">
            {shown.map((item) => {
              const d = draftOf(item);
              return (
                <li
                  key={item._id}
                  className={`lb-admin-card${item.isPublished ? "" : " is-hidden"}${overId === item._id ? " is-over" : ""}`}
                  onDragOver={(e) => { if (filter === "all") { e.preventDefault(); setOverId(item._id); } }}
                  onDragLeave={() => setOverId((o) => (o === item._id ? null : o))}
                  onDrop={(e) => { e.preventDefault(); if (filter === "all") drop(item._id); }}
                >
                  <img
                    src={getImageUrl(item.thumb)}
                    alt={item.title}
                    loading="lazy"
                    draggable={filter === "all" && editable}
                    onDragStart={() => { dragId.current = item._id; }}
                    onClick={() => setViewer({ items: shown, index: shown.indexOf(item) })}
                  />
                  <p className="lb-meta">
                    Page {item.pageNumber}
                  </p>
                  <input className="lb-input" style={{ height: 34, fontSize: 13 }} aria-label="Design code" value={d.styleNumber} maxLength={40} onChange={(e) => setDraft(item, { styleNumber: e.target.value })} disabled={!editable} />
                  <input className="lb-input" style={{ height: 34, fontSize: 13 }} aria-label="Image title" value={d.title} maxLength={150} onChange={(e) => setDraft(item, { title: e.target.value })} disabled={!editable} />
                  <label className="lb-meta">
                    <input type="checkbox" checked={item.isPublished} disabled={!editable} onChange={(e) => run(() => updateCatalogueItem(token, id, item._id, { isPublished: e.target.checked }), e.target.checked ? "Image published." : "Image hidden.")} />{" "}
                    Visible to customers
                  </label>
                  <div className="lb-row">
                    <div>
                      <button type="button" className="lb-icon-btn" style={{ width: 30, height: 30, fontSize: 14 }} aria-label="Move earlier" disabled={!editable || filter !== "all"} onClick={() => move(item._id, -1)}>↑</button>{" "}
                      <button type="button" className="lb-icon-btn" style={{ width: 30, height: 30, fontSize: 14 }} aria-label="Move later" disabled={!editable || filter !== "all"} onClick={() => move(item._id, 1)}>↓</button>
                    </div>
                    <button type="button" className="lb-btn lb-btn--sm lb-btn--accent" disabled={!isDirty(item)} onClick={() => run(() => updateCatalogueItem(token, id, item._id, { title: d.title, styleNumber: d.styleNumber }), "Image updated.")}>Save</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {viewer && (
        <LookbookModal
          items={viewer.items}
          index={viewer.index}
          selectedSet={EMPTY_SET}
          selectable={false}
          onIndex={(index) => setViewer((v) => v && { ...v, index })}
          onClose={() => setViewer(null)}
          onToggle={noop}
        />
      )}

      {preview && (
        <div className="lb-root lb-overlay" role="dialog" aria-modal="true" aria-label="Customer preview" style={{ overflowY: "auto" }}>
          <div className="lb-lightbox-top">
            <strong>Customer preview — {previewItems.length} visible image(s)</strong>
            <div className="lb-tools">
              <div className="lb-seg" role="group" aria-label="Preview layout">
                <button type="button" aria-pressed={preview.view === "grid"} onClick={() => setPreview({ view: "grid" })}>Grid</button>
                <button type="button" aria-pressed={preview.view === "magazine"} onClick={() => setPreview({ view: "magazine" })}>Magazine</button>
              </div>
              <button type="button" className="lb-btn lb-btn--sm" onClick={() => setPreview(null)}>Close preview</button>
            </div>
          </div>
          <div className="lb-wrap" style={{ width: "100%" }}>
            {preview.view === "grid" ? (
              <LookbookGrid items={previewItems} selectedSet={EMPTY_SET} selectable={false} onToggle={noop} onOpen={(itemId) => setViewer({ items: previewItems, index: previewItems.findIndex((i) => i._id === itemId) })} />
            ) : (
              <LookbookMagazine items={previewItems} selectedSet={EMPTY_SET} selectable={false} keysEnabled={!viewer} onToggle={noop} onOpen={(itemId) => setViewer({ items: previewItems, index: previewItems.findIndex((i) => i._id === itemId) })} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────── manager ─────────────────────────────
export default function LookbookCatalogueManager({ token, showToast }) {
  const [catalogues, setCatalogues] = useState([]);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // catalogue to delete

  const toast = useCallback(
    (message, type = "success") =>
      typeof showToast === "function" && showToast(message, type),
    [showToast],
  );

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetchAdminCatalogues(token);
      setCatalogues(res.catalogues || []);
      setLimits(res.limits || null);
      setLoadError("");
    } catch (err) {
      setLoadError(errText(err, "Could not load catalogues."));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // poll only while something is processing
  const anyProcessing = catalogues.some((c) => c.status === "processing");
  useEffect(() => {
    if (!anyProcessing) return undefined;
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [anyProcessing, load]);

  const act = async (action, c) => {
    if (action === "delete") return setConfirm(c);
    setBusyId(c._id);
    try {
      let res;
      if (action === "retry") res = await retryCatalogue(token, c._id);
      else {
        const status = { publish: "published", unpublish: "draft", archive: "archived", restore: "draft" }[action];
        res = await updateCatalogue(token, c._id, { status });
      }
      toast(res?.message || "Done.");
      await load();
    } catch (err) {
      toast(errText(err, "Action failed."), "error");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    const c = confirm;
    setConfirm(null);
    if (!c) return;
    setBusyId(c._id);
    try {
      const res = await deleteCatalogue(token, c._id);
      toast(res.message || "Catalogue deleted.");
      await load();
    } catch (err) {
      toast(errText(err, "Delete failed."), "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="lb-root lb-admin">
      <h2>PDF Catalogues</h2>
      <p className="lb-sub">
        Upload a catalogue PDF, review the generated images, then publish it to
        the customer Lookbook.
      </p>

      {editingId ? (
        <CatalogueEditor
          token={token}
          id={editingId}
          onClose={() => { setEditingId(null); load(); }}
          onChanged={load}
          toast={toast}
        />
      ) : (
        <>
          <UploadPanel token={token} limits={limits} onUploaded={load} toast={toast} />
          {loading ? (
            <p className="lb-meta" aria-busy="true">Loading catalogues…</p>
          ) : loadError ? (
            <p className="lb-err" role="alert">{loadError}</p>
          ) : !catalogues.length ? (
            <p className="lb-meta">No catalogues yet. Upload your first PDF above.</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {catalogues.map((c) => (
                <CatalogueCard key={c._id} c={c} busyId={busyId} onReview={setEditingId} onAction={act} showToast={showToast} />
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete this catalogue?"
        message={
          confirm
            ? `“${confirm.title}” and all ${confirm.counts.total} of its generated images will be permanently deleted. Customers' saved selections of these designs will be removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete permanently"
        onConfirm={confirmDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}