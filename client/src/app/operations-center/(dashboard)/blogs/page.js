// FILE: client/src/app/operations-center/(dashboard)/blogs/page.js
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/components/admin/AdminDashboardContext";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import BlogManager from "@/components/admin/BlogManager";

export default function BlogsPage() {
  const { token } = useAuth();
  const { showToast } = useAdminDashboard();
  return (
    <AdminSectionCard>
      <section aria-label="Blog Management">
        <BlogManager token={token} showToast={showToast} />
      </section>
    </AdminSectionCard>
  );
}