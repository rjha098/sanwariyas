// FILE: client/src/components/admin/BlogManager.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export default function BlogManager({ token, showToast }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const loadBlogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const res = await api.get("/blogs/admin/list", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setBlogs(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, pages: 1 });
    } catch (err) {
      showToast?.("Failed to load blogs.", "error");
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast?.("Blog deleted successfully.", "success");
      loadBlogs();
    } catch (err) {
      showToast?.("Failed to delete blog.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold tracking-widest uppercase ${
        status === "published"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="bg-white rounded-xl border border-brand-lightgold/40 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-lightgold/30 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h2 className="font-display text-xl text-brand-african">
            Blog Posts
          </h2>
          <p className="font-sans text-xs text-brand-mud/60 mt-0.5">
            {pagination.total} posts total
          </p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search blogs..."
            className="px-3 py-2 border border-brand-lightgold/50 rounded-lg font-sans text-sm text-brand-african placeholder-brand-mud/40 focus:outline-none focus:border-brand-coffee w-48"
          />
          <button
            onClick={() => router.push("/operations-center/blog/create")}
            className="font-sans text-xs tracking-[0.2em] uppercase bg-brand-coffee text-brand-cream px-4 py-2 rounded-lg hover:bg-brand-african transition-colors whitespace-nowrap"
          >
            + New Blog
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-brand-parchment/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-parchment flex items-center justify-center mx-auto mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1.5"
              className="w-7 h-7"
            >
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <p className="font-display text-lg text-brand-african mb-1">
            No blog posts yet
          </p>
          <p className="font-sans text-sm text-brand-mud/60 mb-5">
            Create your first blog post to get started.
          </p>
          <button
            onClick={() => router.push("/operations-center/blog/create")}
            className="font-sans text-xs tracking-[0.2em] uppercase bg-brand-coffee text-brand-cream px-5 py-2.5 rounded-lg hover:bg-brand-african transition-colors"
          >
            Create Blog Post
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-lightgold/30 bg-brand-parchment/30">
                  <th className="text-left px-6 py-3 font-sans text-[10px] tracking-[0.2em] uppercase text-brand-mud/60">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.2em] uppercase text-brand-mud/60">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.2em] uppercase text-brand-mud/60">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.2em] uppercase text-brand-mud/60">
                    Date
                  </th>
                  <th className="text-right px-6 py-3 font-sans text-[10px] tracking-[0.2em] uppercase text-brand-mud/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-lightgold/20">
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-brand-parchment/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {blog.featuredImage && (
                          <img
                            src={`${BACKEND_URL}${blog.featuredImage}`}
                            alt={blog.title}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-sans text-sm font-semibold text-brand-african line-clamp-1">
                            {blog.title}
                          </p>
                          <p className="font-sans text-[11px] text-brand-mud/50">
                            /blog/{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-xs text-brand-mud">
                        {blog.category?.name || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4">{statusBadge(blog.status)}</td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-xs text-brand-mud/60">
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-xs text-brand-mud hover:text-brand-coffee transition-colors px-2 py-1"
                        >
                          View
                        </a>
                        <button
                          onClick={() =>
                            router.push(
                              `/operations-center/blog/edit/${blog._id}`,
                            )
                          }
                          className="font-sans text-xs text-brand-coffee hover:text-brand-african transition-colors px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={deletingId === blog._id}
                          className="font-sans text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 disabled:opacity-40"
                        >
                          {deletingId === blog._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-brand-lightgold/30 flex items-center justify-between">
              <p className="font-sans text-xs text-brand-mud/60">
                Page {page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-sans text-xs px-3 py-1.5 border border-brand-lightgold/50 rounded-lg text-brand-mud hover:bg-brand-parchment transition-colors disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  className="font-sans text-xs px-3 py-1.5 border border-brand-lightgold/50 rounded-lg text-brand-mud hover:bg-brand-parchment transition-colors disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
