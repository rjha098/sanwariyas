// FILE: client/src/components/ui/SampleImageUpload.js
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Rules (must match server/middlewares/inquiryUpload.js) ───────────────────
export const MAX_SAMPLE_IMAGES = 2;
export const MAX_SAMPLE_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const ACCEPT_ATTR = [...ALLOWED_EXTENSIONS, ...ALLOWED_TYPES].join(",");

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// Returns an error string, or "" when the file is acceptable.
const validateImage = (file) => {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return `"${file.name}" is not allowed. Only JPG, JPEG, PNG or WEBP images.`;
  }
  if (file.size > MAX_SAMPLE_IMAGE_BYTES) {
    return `"${file.name}" is ${formatSize(file.size)}. Each image must be 3MB or smaller.`;
  }
  if (file.size === 0) return `"${file.name}" is empty.`;
  return "";
};

const sameFile = (a, b) =>
  a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

// ── State hook: the parent form owns this so it can append the files on submit
// and call reset() after a successful submission. ─────────────────────────────
export function useSampleImages() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const addFiles = useCallback(
    (incoming) => {
      const messages = [];
      const next = [...files];
      let overflow = false;

      for (const file of incoming) {
        const problem = validateImage(file);
        if (problem) {
          messages.push(problem);
        } else if (next.some((f) => sameFile(f, file))) {
          messages.push(`"${file.name}" is already added.`);
        } else if (next.length >= MAX_SAMPLE_IMAGES) {
          overflow = true;
        } else {
          next.push(file);
        }
      }
      if (overflow) {
        messages.push(`You can upload a maximum of ${MAX_SAMPLE_IMAGES} images.`);
      }

      setFiles(next);
      setError(messages.join(" "));
    },
    [files],
  );

  const removeFile = useCallback((index) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setError("");
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setError("");
  }, []);

  return { files, error, addFiles, removeFile, reset };
}

// ── Builds the multipart body. Do NOT set Content-Type when sending this —
// the browser must add "multipart/form-data; boundary=..." itself. ───────────
export function buildInquiryFormData(fields, imageFiles = []) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    // FormData would turn null/undefined into the strings "null"/"undefined"
    if (value !== null && value !== undefined) formData.append(key, value);
  });
  imageFiles.forEach((file) => formData.append("sampleImages", file));
  return formData;
}

// ── UI ───────────────────────────────────────────────────────────────────────
export default function SampleImageUpload({
  images,
  disabled = false,
  labelClassName = "block text-xs font-bold tracking-widest uppercase text-[#7A3D2A] mb-2",
}) {
  const { files, error, addFiles, removeFile } = images;
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  // Create thumbnail URLs and always release them again (no memory leaks)
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const isFull = files.length >= MAX_SAMPLE_IMAGES;

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) addFiles(selected);
    e.target.value = ""; // lets the same file be picked again after removing it
  };

  return (
    <div>
      <label htmlFor="sampleImages" className={labelClassName}>
        Product Sample Images{" "}
        <span className="text-[#BE6E5B] normal-case tracking-normal">
          (Optional)
        </span>
      </label>

      <input
        ref={inputRef}
        id="sampleImages"
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        onChange={handleSelect}
        disabled={disabled || isFull}
        className="sr-only"
        aria-describedby="sampleImages-help"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isFull}
        className="w-full px-4 py-5 border border-dashed border-[#a07f61]/50 bg-[#f8f4ec] text-sm text-[#7A3D2A] hover:border-[#BE6E5B] hover:bg-[#FDF1EA] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isFull
          ? `Maximum ${MAX_SAMPLE_IMAGES} images added`
          : files.length === 0
            ? "Click to add sample images"
            : "Add one more image"}
      </button>

      <p
        id="sampleImages-help"
        className="font-sans text-[11px] text-[#a07f61] mt-1.5"
      >
        Up to {MAX_SAMPLE_IMAGES} images · JPG, PNG or WEBP · max 3MB each
      </p>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/70"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-500"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M8 5v3.5M8 11v.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="font-sans text-xs text-red-600">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <ul className="flex flex-wrap gap-3 mt-3 list-none p-0">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="relative w-24"
            >
              <div className="w-24 h-24 overflow-hidden border border-[#a07f61]/30 bg-white">
                {previews[index] && (
                  // eslint-disable-next-line @next/next/no-img-element -- blob: preview URL
                  <img
                    src={previews[index]}
                    alt={`Selected sample ${index + 1}: ${file.name}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p
                className="font-sans text-[10px] text-[#a07f61] mt-1 truncate"
                title={file.name}
              >
                {formatSize(file.size)}
              </p>
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#7A3D2A] text-white text-sm leading-none flex items-center justify-center shadow hover:bg-[#5C2E1F] transition-colors disabled:opacity-50"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}