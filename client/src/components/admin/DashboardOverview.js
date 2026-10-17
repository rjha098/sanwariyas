// FILE: client/src/components/admin/DashboardOverview.js
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAdminDashboard } from "@/components/admin/AdminDashboardContext";
import DashboardStats from "@/components/admin/DashboardStats";

export default function DashboardOverview() {
  const { token } = useAuth();
  const { countdown } = useAdminDashboard();
  const { stats, loading, error } = useDashboardStats(token);

  // Show a placeholder (not a misleading 0) until the first load finishes.
  const show = (n) => (loading ? "…" : n);

  return (
    <>
      <DashboardStats
        productsTotal={show(stats.productsTotal)}
        featuredTotal={show(stats.featuredTotal)}
        openInquiriesTotal={show(stats.openInquiries)}
        resolvedInquiriesTotal={show(stats.resolvedInquiries)}
        countdown={countdown}
      />
      {error && (
        <p role="status" className="mt-4 text-xs text-[#BE6E5B] font-bold">
          {error}
        </p>
      )}
    </>
  );
}
