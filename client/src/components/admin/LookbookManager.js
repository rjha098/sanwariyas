// FILE: client/src/components/admin/LookbookManager.js

"use client";

import { useState, useEffect } from "react";
import {
  fetchLookbook,
  createLookbookItem,
  deleteLookbookItem,
} from "@/lib/api";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export default function LookbookManager({ token, showToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  //  NEW STATE: To toggle between Dropdown and Text Input
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  //  Automatically compute unique categories from database + YOUR SPECIFIC PRODUCTS
  const existingCategories = Array.from(
    new Set([
      "Short Kurti",
      "Anarkali",
      "A-Line Suit",
      "Straight 3 Piece Suit",
      "Cord Sets",
      "Long Kurtis",
      ...items.map((item) => item.category).filter(Boolean),
    ]),
  );

  const loadLookbook = async () => {
    try {
      const data = await fetchLookbook();
      if (data.success) {
        setItems(data.items);
        // Default select the first category if empty (Set to your first product)
        if (!category) {
          setCategory("Short Kurti");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setItems([]);
      } else {
        if (typeof showToast === "function") {
          showToast(
            error.userMessage ||
              error.response?.data?.message ||
              "Failed to load lookbook",
            "error",
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLookbook();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");
    if (!category.trim()) return alert("Please select or type a category");

    setUploading(true);

    // to  send   the   file   making  the formdata
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category.trim()); // trim removes extra spaces
    formData.append("image", file);

    try {
      await createLookbookItem(token, formData);
      setMessage("Image added successfully!");
      setTitle("");
      setFile(null);
      setIsCustomCategory(false); // Reset to dropdown view

      // reload  the  whole  data
      loadLookbook();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteLookbookItem(token, id);
      setMessage("Image deleted!");
      loadLookbook();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <section className="space-y-6">
      {/* UPLOAD FORM */}
      <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
        <h2 className="font-display text-2xl text-brand-african mb-4">
          Add to Gallery
        </h2>
        <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
          <input
            type="text"
            placeholder="Image Title (e.g., Pure Cotton Floral Anarkali)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />

          {/*  HYBRID CATEGORY INPUT LOGIC */}
          {!isCustomCategory ? (
            <select
              value={category}
              onChange={(e) => {
                if (e.target.value === "___ADD_NEW___") {
                  setIsCustomCategory(true);
                  setCategory(""); // Clear it so admin can type fresh
                } else {
                  setCategory(e.target.value);
                }
              }}
              className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
            >
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option disabled>──────────</option>
              <option
                value="___ADD_NEW___"
                className="font-bold text-[#BE6E5B]"
              >
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
                className="flex-1 border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
              />
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(false);
                  //  CHANGED: Fallback to your main category instead of Bridal Export
                  setCategory(existingCategories[0] || "Short Kurti");
                }}
                className="px-4 py-3 border border-brand-lightgold/60 text-[10px] tracking-[0.2em] uppercase text-brand-mud hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/*  FILE INPUT FOR IMAGE */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />

          {message && (
            <p className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-brand-coffee text-brand-cream px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60 hover:bg-[#574325] transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>

      {/* GALLERY TABLE */}
      <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
        <h2 className="font-display text-2xl text-brand-african mb-4">
          Manage Gallery
        </h2>

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
                  <th className="py-3 px-2">Image</th>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-8 text-center text-sm text-brand-mud italic"
                    >
                      No images found. Upload your first image above.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-brand-lightgold/20 hover:bg-gray-50/50"
                    >
                      <td className="py-3 px-2">
                        <img
                          src={`${BACKEND_URL}${item.image}`}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover border border-brand-lightgold/30 rounded"
                        />
                      </td>
                      <td className="py-3 px-2 font-sans text-sm font-medium text-brand-african">
                        {item.title}
                      </td>
                      <td className="py-3 px-2 font-sans text-xs text-brand-mud">
                        <span className="bg-brand-parchment px-2 py-1 rounded border border-brand-lightgold/30">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors rounded"
                        >
                          Delete
                        </button>
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
  );
}
