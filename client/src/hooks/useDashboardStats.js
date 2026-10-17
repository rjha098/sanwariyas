// FILE: client/src/hooks/useDashboardStats.js
import { useState, useEffect, useCallback, useRef } from "react";
import api, { fetchAdminProducts } from "@/lib/api";

const EMPTY = {
  productsTotal: 0,
  featuredTotal: 0,
  openInquiries: 0,
  resolvedInquiries: 0,
};

/**
 * Totals for the overview page only. It requests one product per call and one
 * inquiry per call, because only pagination.total / stats are needed, never the
 * rows. Section pages keep their own hooks and never fetch each other's data.
 */
export function useDashboardStats(token) {
  const [stats, setStats] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const loadStats = useCallback(
    async (isSilent = false) => {
      if (!token) return;
      const current = ++requestId.current;
      if (!isSilent) setLoading(true);

      const [allRes, featuredRes, inquiryRes] = await Promise.allSettled([
        fetchAdminProducts(token, { page: 1, limit: 1 }),
        fetchAdminProducts(token, { page: 1, limit: 1, isFeatured: true }),
        api.get("/inquiry?page=1&limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Ignore stale responses (newer request started, or the page unmounted).
      if (current !== requestId.current) return;

      // A 404 from these list endpoints means "empty", matching the old hooks.
      const totalOf = (res) =>
        res.status === "fulfilled"
          ? (res.value?.pagination?.total ?? 0)
          : res.reason?.response?.status === 404
            ? 0
            : null;

      const productsTotal = totalOf(allRes);
      const featuredTotal = totalOf(featuredRes);
      const inquiryStats =
        inquiryRes.status === "fulfilled" ? inquiryRes.value.data?.stats : null;

      // Keep the last known value for any request that failed, rather than showing 0.
      setStats((prev) => ({
        productsTotal: productsTotal ?? prev.productsTotal,
        featuredTotal: featuredTotal ?? prev.featuredTotal,
        openInquiries: inquiryStats?.pending ?? prev.openInquiries,
        resolvedInquiries: inquiryStats?.resolved ?? prev.resolvedInquiries,
      }));

      const failed = [allRes, featuredRes, inquiryRes].some(
        (r) => r.status === "rejected" && r.reason?.response?.status !== 404,
      );
      setError(failed ? "Some statistics could not be refreshed." : "");
      if (!isSilent) setLoading(false);
    },
    [token],
  );

  // Initial load, and again when the token changes.
  useEffect(() => {
    loadStats();
    return () => {
      requestId.current += 1; // invalidate in-flight requests on unmount
    };
  }, [loadStats]);

  // Background refresh on the shared 60s event. One listener, removed on unmount.
  useEffect(() => {
    if (!token) return;
    const handleSync = () => loadStats(true);
    window.addEventListener("global_60s_sync", handleSync);
    return () => window.removeEventListener("global_60s_sync", handleSync);
  }, [token, loadStats]);

  return { stats, loading, error, reloadStats: loadStats };
}
