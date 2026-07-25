// FILE: client/src/lib/imageUrl.js
// PURPOSE: Resolve product image paths to a working URL, whether they come
// from the old Unsplash-seeded data (already absolute) or the new
// directory-upload system (relative "/uploads/products/xxx.jpg" — only
// exists on the backend server, not the Next.js frontend origin).

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export function getImageUrl(path) {
  if (!path) return "/images/placeholder.jpg";
  if (path.startsWith("http")) return path; // already absolute (e.g. Unsplash seed data)
  return `${BACKEND_URL}${path}`; // relative upload path — prefix with backend origin
}