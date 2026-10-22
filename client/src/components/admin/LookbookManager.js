// FILE: client/src/components/admin/LookbookManager.js

"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import LookbookQuestionsManager from "@/components/admin/LookbookQuestionsManager";
import LookbookInquiriesManager from "@/components/admin/LookbookInquiriesManager";
import {
  fetchLookbook,
  createLookbookItem,
  updateLookbookItem,
  deleteLookbookItem,
  bulkDeleteLookbookItems,
} from "@/lib/api";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const DEFAULT_CATEGORIES = [
  "Anarkali",
  "Short Kurtis",
  "Long Kurtis",
  "Co-ord Set",
  "Straight Kurti Set",
  "A-line Suit",
];
const BADGES = ["None", "Bestseller", "Trending", "New Arrival"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // must match multer limit on the server

const fieldCls =
  "w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee";

export default function LookbookManager({ token, showToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  // Form state (shared by Add + Edit)
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [styleNumber, setStyleNumber] = useState("");
  const [category, setCategory] = useState("");
  const [badge, setBadge] = useState("None");
  const [isFeatured, setIsFeatured] = useState(false);
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Table tools
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selected, setSelected] = useState([]);

  const formRef = useRef(null);

  const existingCategories = useMemo(
    () =>
      Array.from(
        new Set([
          ...DEFAULT_CATEGORIES,
          ...items.map((item) => item.category).filter(Boolean),
        ]),
      ),
    [items],
  );

  const editingItem = editingId
    ? items.find((i) => i._id === editingId)
    : null;

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  const errorText = (error, fallback) =>
    error.response?.data?.message || error.userMessage || fallback;

  const loadLookbook = async () => {
    try {
      const data = await fetchLookbook();
      if (data.success) {
        setItems(data.items);
        setCategory((c) => c || "Anarkali");
        // drop selections for items that no longer exist
        setSelected((prev) =>
          prev.filter((id) => data.items.some((i) => i._id === id)),
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setItems([]);
      } else if (typeof showToast === "function") {
        showToast(errorText(error, "Failed to load lookbook"), "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLookbook();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setStyleNumber("");
    setCategory(existingCategories[0] || "Anarkali");
    setBadge("None");
    setIsFeatured(false);
    setFile(null);
    setFileInputKey((k) => k + 1);
    setIsCustomCategory(false);
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setStyleNumber(item.styleNumber || "");
    setCategory(item.category || "");
    setBadge(item.badge || "None");
    setIsFeatured(Boolean(item.isFeatured));
    setFile(null);
    setFileInputKey((k) => k + 1);
    setIsCustomCategory(false);
    setMessage("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0] || null;
    if (picked && picked.size > MAX_IMAGE_BYTES) {
      flash("Image must be 2 MB or smaller.");
      e.target.value = "";
      setFile(null);
      return;
    }
    setFile(picked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return flash("Please enter a title");
    if (!category.trim()) return flash("Please select or type a category");
    if (!editingId && !file) return flash("Please select an image");

    setSaving(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("styleNumber", styleNumber.trim());
    formData.append("category", category.trim());
    formData.append("badge", badge);
    formData.append("isFeatured", String(isFeatured));
    if (file) formData.append("image", file);

    try {
      if (editingId) {
        await updateLookbookItem(token, editingId, formData);
        flash("Changes saved!");
      } else {
        await createLookbookItem(token, formData);
        flash("Image added successfully!");
      }
      resetForm();
      await loadLookbook();
    } catch (error) {
      flash(errorText(error, editingId ? "Failed to save changes" : "Failed to upload image"));
    } finally {
      setSaving(false);
    }
  };

  // One-click pin / unpin (only sends isFeatured, image + other fields untouched)
  const togglePin = async (item) => {
    setBusyId(item._id);
    try {
      const formData = new FormData();
      formData.append("isFeatured", String(!item.isFeatured));
      await updateLookbookItem(token, item._id, formData);
      flash(item.isFeatured ? "Unpinned." : "Pinned to top!");
      await loadLookbook();
    } catch (error) {
      flash(errorText(error, "Failed to update"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    setBusyId(id);
    try {
      await deleteLookbookItem(token, id);
      if (editingId === id) resetForm();
      flash("Image deleted!");
      await loadLookbook();
    } catch (error) {
      flash(errorText(error, "Failed to delete"));
    } finally {
      setBusyId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (
      !window.confirm(
        `Delete ${selected.length} selected image(s)? This cannot be undone.`,
      )
    )
      return;
    setSaving(true);
    try {
      const res = await bulkDeleteLookbookItems(token, selected);
      if (selected.includes(editingId)) resetForm();
      setSelected([]);
      flash(res.message || "Selected items deleted.");
      await loadLookbook();
    } catch (error) {
      flash(errorText(error, "Failed to delete selected items"));
    } finally {
      setSaving(false);
    }
  };

  // ── Table filtering / selection ──
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((item) => {
      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;
      const matchesSearch =
        !q ||
        (item.title || "").toLowerCase().includes(q) ||
        (item.styleNumber || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [items, search, filterCategory]);

  const allFilteredSelected =
    filteredItems.length > 0 &&
    filteredItems.every((i) => selected.includes(i._id));

  const toggleSelectAll = () => {
    const ids = filteredItems.map((i) => i._id);
    setSelected((prev) =>
      allFilteredSelected
        ? prev.filter((id) => !ids.includes(id))
        : Array.from(new Set([...prev, ...ids])),
    );
  };

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const featuredCount = items.filter((i) => i.isFeatured).length;

  return (
    <>
    <section className="space-y-6">
      {/* ADD / EDIT FORM */}
      <div
        ref={formRef}
        className="bg-white border border-brand-lightgold/50 shadow-sm p-6"
      >
        <h2 className="font-display text-2xl text-brand-african mb-4">
          {editingId ? "Edit Gallery Item" : "Add to Gallery"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <input
              type="text"
              placeholder="Style Number (e.g., SW-1042) — leave blank to auto-generate"
              value={styleNumber}
              onChange={(e) => setStyleNumber(e.target.value)}
              maxLength={40}
              className={`${fieldCls} uppercase tracking-wider`}
            />
            <p className="font-sans text-[11px] text-brand-mud mt-1">
              Shown on the magazine page and inside the customer&apos;s inquiry.
            </p>
          </div>

          <input
            type="text"
            placeholder="Image Title (e.g., Pure Cotton Floral Anarkali)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={150}
            className={fieldCls}
          />

          {!isCustomCategory ? (
            <select
              value={category}
              onChange={(e) => {
                if (e.target.value === "___ADD_NEW___") {
                  setIsCustomCategory(true);
                  setCategory("");
                } else {
                  setCategory(e.target.value);
                }
              }}
              className={fieldCls}
            >
              {/* keep an edited item's category selectable even if unusual */}
              {category && !existingCategories.includes(category) && (
                <option value={category}>{category}</option>
              )}
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option disabled>──────────</option>
              <option value="___ADD_NEW___" className="font-bold text-[#BE6E5B]">
                + Add New Category
              </option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type new category name..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                autoFocus
                maxLength={80}
                className="flex-1 border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
              />
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(false);
                  setCategory(
                    editingItem?.category || existingCategories[0] || "Anarkali",
                  );
                }}
                className="px-4 py-3 border border-brand-lightgold/60 text-[10px] tracking-[0.2em] uppercase text-brand-mud hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              aria-label="Badge"
              className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
            >
              {BADGES.map((b) => (
                <option key={b} value={b}>
                  {b === "None" ? "No badge" : b}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Pin to top (Featured)
            </label>
          </div>

          {editingItem && (
            <div className="flex items-center gap-4 bg-brand-parchment border border-brand-lightgold/60 p-3">
              <img
                src={`${BACKEND_URL}${editingItem.image}`}
                alt={editingItem.title}
                width={64}
                height={80}
                className="w-16 h-20 object-cover rounded border border-brand-lightgold/30"
              />
              <p className="font-sans text-xs text-brand-mud">
                Current image. Choose a file below only if you want to replace it.
              </p>
            </div>
          )}

          <input
            key={fileInputKey}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            required={!editingId}
            className={fieldCls}
          />
          <p className="font-sans text-[11px] text-brand-mud/70 -mt-2">
            JPEG, PNG, WEBP or GIF — max 2 MB.
          </p>

          {message && (
            <p className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3">
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-coffee text-brand-cream px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60 hover:bg-[#574325] transition-colors"
            >
              {saving
                ? editingId
                  ? "Saving..."
                  : "Uploading..."
                : editingId
                  ? "Save Changes"
                  : "Upload Image"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="px-5 py-3 border border-brand-lightgold/60 font-sans text-xs tracking-[0.3em] uppercase text-brand-mud hover:bg-gray-50 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* GALLERY TABLE */}
      <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-2xl text-brand-african">
              Manage Gallery
            </h2>
            <p className="font-sans text-xs text-brand-mud mt-1">
              {items.length} total · {featuredCount} pinned
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search style no. / title / category..."
              aria-label="Search gallery"
              className="border border-brand-lightgold/60 px-3 py-2 text-xs focus:outline-none focus:border-brand-coffee"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter by category"
              className="border border-brand-lightgold/60 px-3 py-2 text-xs focus:outline-none focus:border-brand-coffee"
            >
              <option value="All">All categories</option>
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={saving}
                className="px-3 py-2 text-[10px] font-bold tracking-[0.1em] uppercase border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors rounded disabled:opacity-60"
              >
                Delete selected ({selected.length})
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="font-sans text-sm text-brand-mud">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse"
              aria-label="Lookbook gallery management"
            >
              <thead>
                <tr className="border-b border-brand-lightgold/60 text-[10px] uppercase tracking-[0.2em] text-brand-mud/70">
                  <th className="py-3 px-2 w-8">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all shown items"
                    />
                  </th>
                  <th className="py-3 px-2">Image</th>
                  <th className="py-3 px-2">Style No.</th>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Badge</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-8 text-center text-sm text-brand-mud italic"
                    >
                      {items.length === 0
                        ? "No images found. Upload your first image above."
                        : "No items match your search / filter."}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item._id}
                      className={`border-b border-brand-lightgold/20 hover:bg-gray-50/50 ${
                        editingId === item._id ? "bg-brand-parchment" : ""
                      }`}
                    >
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(item._id)}
                          onChange={() => toggleSelect(item._id)}
                          aria-label={`Select ${item.title}`}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <img
                          src={`${BACKEND_URL}${item.image}`}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover border border-brand-lightgold/30 rounded"
                        />
                      </td>
                      <td className="py-3 px-2 font-sans text-xs font-bold tracking-wider text-brand-coffee whitespace-nowrap">
                        {item.styleNumber || "—"}
                      </td>
                      <td className="py-3 px-2 font-sans text-sm font-medium text-brand-african">
                        {item.title}
                      </td>
                      <td className="py-3 px-2 font-sans text-xs text-brand-mud">
                        <span className="bg-brand-parchment px-2 py-1 rounded border border-brand-lightgold/30">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-sans text-xs text-brand-mud">
                        {item.badge && item.badge !== "None" ? item.badge : "—"}
                        {item.isFeatured ? " ★" : ""}
                      </td>
                      <td className="py-3 px-2 text-right whitespace-nowrap">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => togglePin(item)}
                            disabled={busyId === item._id}
                            title={item.isFeatured ? "Unpin from top" : "Pin to top"}
                            className="px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase border border-brand-lightgold text-brand-coffee bg-brand-parchment hover:bg-brand-coffee hover:text-white transition-colors rounded disabled:opacity-60"
                          >
                            {item.isFeatured ? "Unpin" : "Pin"}
                          </button>
                          <button
                            onClick={() => startEdit(item)}
                            disabled={busyId === item._id}
                            className="px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors rounded disabled:opacity-60"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={busyId === item._id}
                            className="px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors rounded disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
    <LookbookQuestionsManager token={token} showToast={showToast} />
    <LookbookInquiriesManager token={token} showToast={showToast} />
    </>
  );
}