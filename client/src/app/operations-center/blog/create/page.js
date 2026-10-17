// FILE: client/src/app/operations-center/blog/create/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import Toast from "@/components/ui/Toast";

function RichEditor({ onChange }) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null); // Cursor selection save karne ke liye

  // Selection save karna (prompt ya color picker khulne se pehle)
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  // Selection wapas lana (command run karne se pehle)
  const restoreSelection = () => {
    editorRef.current?.focus();
    if (savedRangeRef.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current);
    }
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    handleInput();
  };

  // Naye features ke actions
  const handleLink = () => {
    saveSelection();
    const url = window.prompt("Enter URL (e.g., https://google.com):");
    if (!url) return;

    restoreSelection();
    const selection = window.getSelection();

    // Agar koi text select nahi kiya hai, toh direct link text insert kar do
    if (selection.toString().length === 0) {
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
      );
    } else {
      document.execCommand("createLink", false, url);
      // Ensure created link opens in new tab
      const links = editorRef.current.querySelectorAll("a:not([target])");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }
    handleInput();
  };

  const changeFontSize = (step) => {
    saveSelection();
    restoreSelection();
    let currentSize = document.queryCommandValue("fontSize") || 3;
    let newSize = Math.max(1, Math.min(7, parseInt(currentSize) + step));
    document.execCommand("fontSize", false, newSize);
    handleInput();
  };

  // Editor ke andar link par click karne ke liye
  const handleEditorClick = (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      window.open(e.target.href, "_blank");
    }
  };

  const toolbarBtns = [
    // Basic Formatting
    { label: "B", title: "Bold", cmd: "bold", cls: "font-bold" },
    { label: "I", title: "Italic", cmd: "italic", cls: "italic" },
    { label: "U", title: "Underline", cmd: "underline", cls: "underline" },
    {
      label: "S",
      title: "Strikethrough",
      cmd: "strikeThrough",
      cls: "line-through",
    },
    { isSeparator: true },

    // Word Like Sizing
    {
      label: "A+",
      title: "Increase Size",
      action: "increaseSize",
      cls: "font-bold text-sm",
    },
    {
      label: "A-",
      title: "Decrease Size",
      action: "decreaseSize",
      cls: "font-bold text-[10px]",
    },
    { isSeparator: true },

    // Colors (Text & Background - DONO YAHAN HAIN)
    {
      label: "Text",
      isColor: true,
      cmd: "foreColor",
      title: "Text Color",
      defaultHex: "#574325",
    },
    {
      label: "Bg",
      isColor: true,
      cmd: "backColor",
      title: "Background Color",
      defaultHex: "#FFFF00",
    },
    { isSeparator: true },

    // Headings (H1, H2 hata kar clean names rakhe hain)
    {
      label: "Title",
      title: "Main Heading",
      cmd: "formatBlock",
      val: "h2",
      cls: "font-bold",
    },
    {
      label: "Subtitle",
      title: "Sub Heading",
      cmd: "formatBlock",
      val: "h3",
      cls: "font-semibold",
    },
    { label: "Normal", title: "Paragraph", cmd: "formatBlock", val: "p" },
    {
      label: "”",
      title: "Quote",
      cmd: "formatBlock",
      val: "blockquote",
      cls: "font-serif text-lg font-bold",
    },
    { isSeparator: true },

    // Lists & Alignments
    { label: "•", title: "Bullet List", cmd: "insertUnorderedList" },
    { label: "1.", title: "Numbered List", cmd: "insertOrderedList" },
    { label: "⇤", title: "Align Left", cmd: "justifyLeft" },
    { label: "↔", title: "Align Center", cmd: "justifyCenter" },
    { label: "⇥", title: "Align Right", cmd: "justifyRight" },
    { isSeparator: true },

    // Insertions & Actions
    { label: "——", title: "Divider", cmd: "insertHorizontalRule" },
    { label: "🔗", title: "Insert Link", isLink: true },
    { isSeparator: true },

    { label: "↺", title: "Undo", cmd: "undo" },
    { label: "↻", title: "Redo", cmd: "redo" },
    { label: "✕", title: "Clear Format", cmd: "removeFormat" },
  ];

  return (
    <div className="border border-[#E8D5A3]/60 rounded-xl overflow-hidden shadow-sm">
      <div className="flex flex-wrap gap-1 p-2 bg-[#FAF3E8] border-b border-[#E8D5A3]/60 items-center">
        {toolbarBtns.map((btn, index) => {
          if (btn.isSeparator) {
            return (
              <span
                key={`sep-${index}`}
                className="w-px h-4 bg-[#E8D5A3] mx-1"
              ></span>
            );
          }

          if (btn.isColor) {
            return (
              <div
                key={`color-${index}`}
                className="flex items-center mx-1 gap-1"
                title={btn.title}
              >
                <span className="font-sans text-[10px] uppercase tracking-wider text-[#70543E] font-semibold">
                  {btn.label}
                </span>
                <input
                  type="color"
                  defaultValue={btn.defaultHex}
                  onMouseDown={saveSelection}
                  onInput={(e) => {
                    restoreSelection();
                    document.execCommand(btn.cmd, false, e.target.value);
                    handleInput();
                  }}
                  className="w-[22px] h-[22px] p-0 border border-[#E8D5A3] cursor-pointer rounded-sm bg-white hover:shadow-sm"
                />
              </div>
            );
          }

          return (
            <button
              key={`btn-${index}`}
              type="button"
              title={btn.title}
              onMouseDown={(e) => {
                e.preventDefault();
                if (btn.isLink) {
                  handleLink();
                } else if (btn.action === "increaseSize") {
                  changeFontSize(1);
                } else if (btn.action === "decreaseSize") {
                  changeFontSize(-1);
                } else {
                  exec(btn.cmd, btn.val || null);
                }
              }}
              className={`px-2.5 py-1.5 rounded font-sans text-xs text-[#574325] hover:bg-[#E8D5A3]/80 hover:shadow-sm transition-all border border-transparent hover:border-[#E8D5A3] ${btn.cls || ""}`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onClick={handleEditorClick}
        className="min-h-[350px] p-5 font-sans text-sm text-[#574325] focus:outline-none prose prose-sm max-w-none bg-white"
        style={{ lineHeight: "1.7" }}
        data-placeholder="Start writing your amazing blog content here..."
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #a07f61;
          pointer-events: none;
        }
        [contenteditable] h2 { font-size: 1.5rem; font-weight: 700; margin: 1.2rem 0 0.5rem; color: #574325; }
        [contenteditable] h3 { font-size: 1.2rem; font-weight: 600; margin: 1rem 0 0.4rem; color: #574325; }
        [contenteditable] p  { margin: 0.5rem 0; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] hr { border-color: #E8D5A3; margin: 1.5rem 0; opacity: 0.5; }
        [contenteditable] a  { color: #BE6E5B; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
        [contenteditable] blockquote { 
          border-left: 4px solid #BE6E5B; 
          background: #FAF3E8;
          padding: 0.8rem 1.2rem; 
          margin: 1.2rem 0; 
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #70543E;
        }
        [contenteditable] strike { color: #a07f61; }
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

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

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
            onClick={() => removeTag(t)}
            className="text-[#a07f61] hover:text-red-500 transition-colors ml-1"
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
          if (e.key === "Backspace" && !input && tags.length)
            removeTag(tags[tags.length - 1]);
        }}
        onBlur={() => input && addTag(input)}
        placeholder={
          tags.length === 0 ? "Type tag, press Enter..." : "Add more..."
        }
        className="flex-1 min-w-[120px] outline-none font-sans text-sm text-[#574325] placeholder-[#a07f61]/50 bg-transparent"
      />
    </div>
  );
}

export default function CreateBlogPage() {
  const { token, isAdmin, authChecking } = useAuth();
  const router = useRouter();

  const [titleValue, setTitleValue] = useState("");
  const [slugValue, setSlugValue] = useState("");
  const slugManuallyEdited = useRef(false);
  const formRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  // States for Thumbnail Image
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // States for Banner Image
  const [bannerPreview, setBannerPreview] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // Category Selection State For Deletion
  const [selectedCatId, setSelectedCatId] = useState("");

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  useEffect(() => {
    if (!authChecking && !isAdmin) {
      router.replace("/login");
    }
  }, [authChecking, isAdmin, router]);

  useEffect(() => {
    if (!token) return;
    api
      .get("/blogs/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setCategories(r.data.data || []))
      .catch(() => {});
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Thumbnail photo size is bigger than the 2MB limit!", "error");
      e.target.value = "";
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Banner photo size is bigger than the 2MB limit!", "error");
      e.target.value = "";
      return;
    }

    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setSelectedBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

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

  // Delete Category Call
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await api.delete(`/blogs/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((c) => c._id !== id));
      if (selectedCatId === id) setSelectedCatId("");
      showToast("Category deleted successfully.", "success");
    } catch (err) {
      showToast("Failed to delete category.", "error");
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const validateFormBeforeSubmit = () => {
    const errors = [];
    if (!titleValue.trim()) errors.push("Blog title is required.");
    if (!selectedFile) errors.push("Featured Thumbnail image is required.");
    if (!content || content === "<br>" || content.trim() === "")
      errors.push("Blog content cannot be empty.");
    return errors;
  };

  const handleSubmit = async (intendedStatus) => {
    const formErrors = validateFormBeforeSubmit();
    if (formErrors.length > 0) {
      showToast(formErrors[0], "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(formRef.current);
      formData.set("content", content);
      formData.set("tags", JSON.stringify(tags));
      formData.set("slug", slugValue);
      formData.set("category", selectedCatId);
      formData.set("status", intendedStatus);

      if (selectedFile) formData.set("image", selectedFile);
      if (selectedBanner) formData.set("bannerImage", selectedBanner);

      const response = await api.post("/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": undefined,
        },
      });

      const finalSlug = response.data.data.slug;

      if (intendedStatus === "draft") {
        showToast("Blog saved as draft successfully!", "success");
        setTimeout(() => router.push("/operations-center/blogs"), 1200);
      } else {
        showToast("Blog published successfully!", "success");
        setTimeout(() => router.push(`/blog/${finalSlug}`), 1200);
      }
    } catch (err) {
      const fallback =
        intendedStatus === "draft"
          ? "Failed to save draft."
          : "Failed to publish blog.";
      showToast(err.response?.data?.message || fallback, "error");
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50">
          Loading...
        </p>
      </div>
    );
  }

  const inp =
    "w-full px-4 py-3 border border-[#E8D5A3]/60 rounded-lg font-sans text-sm text-[#574325] placeholder-[#a07f61]/50 focus:outline-none focus:border-[#BE6E5B] transition-colors bg-white";
  const lbl =
    "block font-sans text-[11px] tracking-[0.2em] uppercase text-[#70543E] mb-2 font-semibold";

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <div className="min-h-screen bg-[#FAF3E8]">
        <div className="bg-white border-b border-[#E8D5A3]/60 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/operations-center/blogs")}
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
                  Create New Blog Post
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit("draft")}
                className="font-sans text-xs tracking-[0.2em] uppercase bg-white text-[#6F4E37] border border-[#6F4E37]/40 px-6 py-2.5 rounded-lg hover:bg-[#FAF3E8] transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit("published")}
                className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-6 py-2.5 rounded-lg hover:bg-[#574325] transition-colors disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Blog"}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <form
            id="blog-form"
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            noValidate
            className="grid lg:grid-cols-[1fr_300px] gap-6"
          >
            <div className="space-y-5">
              <div>
                <label className={lbl}>Blog Title *</label>
                <input
                  name="title"
                  value={titleValue}
                  onChange={(e) => {
                    setTitleValue(e.target.value);
                    if (!slugManuallyEdited.current) {
                      setSlugValue(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Enter a compelling blog title..."
                  className={`${inp} text-lg font-display`}
                />
              </div>

              <div>
                <label className={lbl}>
                  URL Slug{" "}
                  <span className="text-[#a07f61] normal-case tracking-normal">
                    (auto-generated — editable)
                  </span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-[#FAF3E8] border border-[#E8D5A3]/60 border-r-0 rounded-l-lg font-sans text-xs text-[#a07f61]">
                    /blog/
                  </span>
                  <input
                    value={slugValue}
                    onChange={(e) => {
                      slugManuallyEdited.current = true;
                      setSlugValue(generateSlug(e.target.value));
                    }}
                    placeholder="your-blog-url"
                    className={`${inp} rounded-l-none flex-1`}
                  />
                </div>
                <p className="font-sans text-[10px] text-[#a07f61] mt-1">
                  Title type karne pe auto-fill hoga — manually bhi edit kar
                  sakte ho.
                </p>
              </div>

              <div>
                <label className={lbl}>Content *</label>
                <RichEditor onChange={setContent} />
              </div>

              <div>
                <label className={lbl}>
                  Excerpt{" "}
                  <span className="text-[#a07f61] normal-case tracking-normal">
                    (short description)
                  </span>
                </label>
                <textarea
                  name="excerpt"
                  placeholder="A brief summary of the blog post (shown in listings)..."
                  rows={3}
                  className={`${inp} resize-none`}
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>
                  Thumbnail Image (For Outer Side) *
                </label>
                <div className="relative">
                  <input
                    id="blog-image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                          setSelectedFile(null);
                          document.getElementById("blog-image-upload").value =
                            "";
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full text-[#574325] text-xs flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="blog-image-upload"
                      className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-[#E8D5A3] rounded-lg cursor-pointer hover:border-[#BE6E5B] transition-colors bg-[#FAF3E8]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="1.5"
                        className="w-8 h-8 mb-2"
                      >
                        <path d="M12 16v-8m0 0l-3 3m3-3l3 3M20 16.5A3.5 3.5 0 0016.5 20H7A5 5 0 117 10h.5A6.5 6.5 0 0120 12.5v4z" />
                      </svg>
                      <span className="font-sans text-xs text-[#a07f61]">
                        + Thumbnail Photo (Portrait)
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>Banner Image (Inner Side)</label>
                <div className="relative">
                  <input
                    id="blog-banner-upload"
                    name="bannerImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />

                  {bannerPreview ? (
                    <div className="relative">
                      <img
                        src={bannerPreview}
                        alt="Banner Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(bannerPreview);
                          setBannerPreview(null);
                          setSelectedBanner(null);
                          document.getElementById("blog-banner-upload").value =
                            "";
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full text-[#574325] text-xs flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="blog-banner-upload"
                      className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[#E8D5A3] rounded-lg cursor-pointer hover:border-[#BE6E5B] transition-colors bg-[#FAF3E8]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="1.5"
                        className="w-6 h-6 mb-1"
                      >
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-sans text-xs text-[#a07f61] text-center px-2">
                        + Banner Photo (Landscape)
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>Category</label>
                <div className="flex gap-2">
                  <select
                    name="category"
                    className={inp}
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                  >
                    <option value="">— Select category —</option>
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
                <p className="font-sans text-[10px] text-[#a07f61] mt-2">
                  Press Enter or comma to add a tag
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5">
                <label className={lbl}>SEO</label>
                <div className="space-y-3">
                  <input
                    name="metaTitle"
                    placeholder="Meta title (60 chars)"
                    maxLength={60}
                    className={inp}
                  />
                  <textarea
                    name="metaDescription"
                    placeholder="Meta description (160 chars)"
                    maxLength={160}
                    rows={3}
                    className={`${inp} resize-none`}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
