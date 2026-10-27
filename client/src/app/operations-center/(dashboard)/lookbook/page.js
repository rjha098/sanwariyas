// FILE: client/src/app/operations-center/(dashboard)/lookbook/page.js
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/components/admin/AdminDashboardContext";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import LookbookCatalogueManager from "@/components/admin/LookbookCatalogueManager";

export default function LookbookPage() {
  const { token } = useAuth();
  const { showToast } = useAdminDashboard();
  return (
    <>
      <AdminSectionCard>
        <section aria-label="PDF Catalogue Management">
          <LookbookCatalogueManager token={token} showToast={showToast} />
        </section>
      </AdminSectionCard>
    </>
  );
}