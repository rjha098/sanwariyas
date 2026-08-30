// FILE: client/src/app/operations-center/blog/edit/[id]/page.js

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import Toast from "@/components/ui/Toast";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

// 🔴 NAYA FIX: Smart URL Builder jo galat paths (null, undefined) ko filter karta hai
const getImageUrl = (path) => {
  if (!path || path === "undefined" || path === "null" || path.trim() === "")
    return null;
  if (path.startsWith("http")) return path;
  return `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

function RichEditor({ onChange, initialHtml }) {
  const editorRef = useRef(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (editorRef.current && initialHtml && !initialised.current) {
      editorRef.current.innerHTML = initialHtml;
      initialised.current = true;
    }
  }, [initialHtml]);

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const toolbarBtns = [
    { label: "B", cmd: "bold", cls: "font-bold" },
    { label: "I", cmd: "italic", cls: "italic" },
    { label: "U", cmd: "underline", cls: "underline" },
    { label: "H2", cmd: "formatBlock", val: "h2" },
    { label: "H3", cmd: "formatBlock", val: "h3" },
    { label: "P", cmd: "formatBlock", val: "p" },
    { label: "• ", cmd: "insertUnorderedList" },
    { label: "1.", cmd: "insertOrderedList" },
    { label: "——", cmd: "insertHorizontalRule" },
    { label: "🔗", cmd: "createLink", prompt: "Enter URL:" },
  ];

  return (
    <div className="border border-[#E8D5A3]/60 rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-[#FAF3E8] border-b border-[#E8D5A3]/60">
        {toolbarBtns.map(({ label, cmd, val, cls, prompt: pr }) => (
          <button
            key={label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (pr) {
                const url = window.prompt(pr);
                if (url) exec(cmd, url);
              } else exec(cmd, val || null);
            }}
            className={`px-2.5 py-1 rounded font-sans text-xs text-[#574325] hover:bg-[#E8D5A3]/60 transition-colors ${cls || ""}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || "")}
        className="min-h-[300px] p-4 font-sans text-sm text-[#574325] focus:outline-none prose prose-sm max-w-none"
        style={{ lineHeight: "1.7" }}
      />
      <style>{`
        [contenteditable] h2{font-size:1.4rem;font-weight:700;margin:1rem 0 .5rem;color:#574325}
        [contenteditable] h3{font-size:1.1rem;font-weight:600;margin:.8rem 0 .4rem;color:#574325}
        [contenteditable] p{margin:.5rem 0}
        [contenteditable] ul{list-style:disc;padding-left:1.5rem}
        [contenteditable] ol{list-style:decimal;padding-left:1.5rem}
        [contenteditable] hr{border-color:#E8D5A3;margin:1rem 0}
        [contenteditable] a{color:#BE6E5B;text-decoration:underline}
      `}</style>
    </div>
  );
}

function TagInput({ tags, setTags }) {
  const [input, setInput] = useState("");
  const addTag = (val) => {
    const t = val.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setInput("");
  };
  return (
    <div className="border border-[#E8D5A3]/60 rounded-lg p-3 flex flex-wrap gap-2 focus-within:border-[#BE6E5B] transition-colors bg-white">
      {tags.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF3E8] border border-[#E8D5A3] rounded-full font-sans text-xs text-[#574325]"
        >
          {t}
          <button
            type="button"
            onClick={() => setTags(tags.filter((x) => x !== t))}
            className="text-[#a07f61] hover:text-red-500 ml-1"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
          }
        }}
        onBlur={() => input && addTag(input)}
        placeholder="Add tag..."
        className="flex-1 min-w-[100px] outline-none font-sans text-sm text-[#574325] placeholder-[#a07f61]/50 bg-transparent"
      />
    </div>
  );
}

export default function EditBlogPage() {
  const { token, isAdmin, authChecking } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [bannerPreview, setBannerPreview] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [catLoading, setCatLoading] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // 🔴 DELETE CATEGORY STATE
  const [selectedCatId, setSelectedCatId] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [imagePreview, bannerPreview]);

  useEffect(() => {
    if (!authChecking && !isAdmin) router.replace("/login");
  }, [authChecking, isAdmin, router]);

  useEffect(() => {
    if (!token || !id) return;
    setFetching(true);

    Promise.all([
      api.get(`/blogs/admin/list?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get("/blogs/categories", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([blogRes, catRes]) => {
        const fetchedBlogs = blogRes.data.data || [];
        const foundBlog = fetchedBlogs[0];

        if (foundBlog) {
          setBlog(foundBlog);
          setContent(foundBlog.content || "");
          setTags(foundBlog.tags || []);
          // Set initial category for deletion
          if (foundBlog.category) {
            setSelectedCatId(foundBlog.category._id || foundBlog.category);
          }
        } else {
          showToast("Blog not found!", "error");
        }
        setCategories(catRes.data.data || []);
      })
      .catch(() => showToast("Failed to load blog.", "error"))
      .finally(() => setFetching(false));
  }, [token, id]);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setCatLoading(true);
    try {
      const r = await api.post(
        "/blogs/categories",
        { name: newCatName.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCategories((prev) => [...prev, r.data.data]);
      setNewCatName("");
      showToast(`Category "${r.data.data.name}" created.`, "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to create category.",
        "error",
      );
    } finally {
      setCatLoading(false);
    }
  };

  // 🔴 DELETE CATEGORY LOGIC
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await api.delete(`/blogs/categories/${catId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((c) => c._id !== catId));
      if (selectedCatId === catId) setSelectedCatId("");
      showToast("Category deleted successfully.", "success");
    } catch (err) {
      showToast("Failed to delete category.", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setSelectedBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      showToast("Content cannot be empty.", "error");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      formData.set("content", content);
      formData.set("tags", JSON.stringify(tags));

      // Update Category with Local State
      formData.set("category", selectedCatId);

      if (selectedFile) formData.set("image", selectedFile);
      if (selectedBanner) formData.set("bannerImage", selectedBanner);

      await api.put(`/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": undefined,
        },
      });

      showToast("Blog updated successfully!", "success");
      setTimeout(() => router.push("/operations-center"), 1500);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update blog.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  if (authChecking || fetching) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50">
          Loading Blog Data...
        </p>
      </div>
    );
  }

  if (!blog && !fetching) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center flex-col gap-4">
        <p className="font-display text-2xl text-[#574325]">Blog not found</p>
        <button
          onClick={() => router.push("/operations-center")}
          className="text-[#BE6E5B] underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const inp =
    "w-full px-4 py-3 border border-[#E8D5A3]/60 rounded-lg font-sans text-sm text-[#574325] placeholder-[#a07f61]/50 focus:outline-none focus:border-[#BE6E5B] transition-colors bg-white";
  const lbl =
    "block font-sans text-[11px] tracking-[0.2em] uppercase text-[#70543E] mb-2 font-semibold";

  return (
    <>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
      />

      <div className="min-h-screen bg-[#FAF3E8]">
        <div className="bg-white border-b border-[#E8D5A3]/60 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/operations-center")}
                className="text-[#70543E] hover:text-[#574325] transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
              </button>
              <div>
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
                  Operations Center
                </p>
                <p className="font-display text-sm text-[#574325]">
                  Edit Blog Post
                </p>
              </div>
            </div>
            <button
              form="edit-form"
              type="submit"
              disabled={loading}
              className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-6 py-2.5 rounded-lg hover:bg-[#574325] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <form
            id="edit-form"
            onSubmit={handleSubmit}
            className="grid lg:grid-cols-[1fr_300px] gap-6"
          >
            <div className="space-y-5">
              <div>
                <label className={lbl}>Blog Title *</label>
                <input
                  name="title"
                  defaultValue={blog?.title}
                  className={`${inp} text-lg font-display`}
                  required
                />
              </div>
              <div>
                <label className={lbl}>URL Slug *</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-[#FAF3E8] border border-[#E8D5A3]/60 border-r-0 rounded-l-lg font-sans text-xs text-[#a07f61]">
                    /blog/
                  </span>
                  <input
                    name="slug"
                    defaultValue={blog?.slug}
                    className={`${inp} rounded-l-none flex-1`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={lbl}>Content *</label>
                <RichEditor onChange={setContent} initialHtml={blog?.content} />
              </div>
              <div>
                <label className={lbl}>Excerpt</label>
                <textarea
                  name="excerpt"
                  defaultValue={blog?.excerpt}
                  rows={3}
                  className={`${inp} resize-none`}
                />
              </div>
            </div>

            <div className="space-y-5">
              {/* ✅ SMART FIX: FEATURED IMAGE */}
              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>Featured Image</label>
                {imagePreview ? (
                  <div className="relative mb-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (imagePreview) URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                        setSelectedFile(null);
                        document.getElementById("edit-image-upload").value = "";
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full text-[#574325] text-xs flex items-center justify-center shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : getImageUrl(blog?.featuredImage) ? (
                  <label
                    className="cursor-pointer block relative mb-2 group"
                    title="Click to change image"
                  >
                    <img
                      src={getImageUrl(blog.featuredImage)}
                      alt="Current Image"
                      className="w-full h-40 object-cover rounded-lg group-hover:opacity-60 transition-opacity"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/600x400/FAF3E8/a07f61?text=Image+Missing";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/70 text-white px-3 py-1.5 rounded-full font-sans text-[10px] tracking-widest uppercase shadow-lg">
                        Click to Change
                      </span>
                    </div>
                    <input
                      id="edit-image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <span className="font-sans text-xs text-[#BE6E5B] underline">
                      + Upload Featured Image
                    </span>
                  </label>
                )}
              </div>

              {/* ✅ SMART FIX: BANNER IMAGE */}
              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>Banner Image</label>
                {bannerPreview ? (
                  <div className="relative mb-2">
                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
                        setBannerPreview(null);
                        setSelectedBanner(null);
                        document.getElementById("edit-banner-upload").value =
                          "";
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full text-[#574325] text-xs flex items-center justify-center shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : getImageUrl(blog?.bannerImage) ? (
                  <label
                    className="cursor-pointer block relative mb-2 group"
                    title="Click to change banner"
                  >
                    <img
                      src={getImageUrl(blog.bannerImage)}
                      alt="Current Banner"
                      className="w-full h-40 object-cover rounded-lg group-hover:opacity-60 transition-opacity"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/800x400/FAF3E8/a07f61?text=Banner+Missing";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/70 text-white px-3 py-1.5 rounded-full font-sans text-[10px] tracking-widest uppercase shadow-lg">
                        Click to Change
                      </span>
                    </div>
                    <input
                      id="edit-banner-upload"
                      name="bannerImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerChange}
                    />
                  </label>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerChange}
                    />
                    <span className="font-sans text-xs text-[#BE6E5B] underline">
                      + Upload Banner Image
                    </span>
                  </label>
                )}
              </div>

              {/* 🔴 NAYA FIX: Category Selection With Delete Button */}
              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>Category</label>
                <div className="flex gap-2">
                  <select
                    name="category"
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    className={inp}
                  >
                    <option value="">— No category —</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {selectedCatId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(selectedCatId)}
                      className="px-3 py-2 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Selected Category"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleCreateCategory())
                    }
                    placeholder="New category..."
                    className="flex-1 px-3 py-2 border border-[#E8D5A3]/60 rounded-lg font-sans text-xs text-[#574325] placeholder-[#a07f61]/50 focus:outline-none focus:border-[#BE6E5B]"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={catLoading || !newCatName.trim()}
                    className="px-3 py-2 bg-[#FAF3E8] border border-[#E8D5A3] rounded-lg font-sans text-xs text-[#574325] hover:bg-[#E8D5A3]/60 transition-colors disabled:opacity-50"
                  >
                    {catLoading ? "..." : "+ Add"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>Tags</label>
                <TagInput tags={tags} setTags={setTags} />
              </div>

              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>SEO</label>
                <div className="space-y-3">
                  <input
                    name="metaTitle"
                    defaultValue={blog?.metaTitle}
                    placeholder="Meta title"
                    maxLength={60}
                    className={inp}
                  />
                  <textarea
                    name="metaDescription"
                    defaultValue={blog?.metaDescription}
                    placeholder="Meta description"
                    maxLength={160}
                    rows={3}
                    className={`${inp} resize-none`}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>Status</label>
                <select
                  name="status"
                  defaultValue={blog?.status || "draft"}
                  className={inp}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
