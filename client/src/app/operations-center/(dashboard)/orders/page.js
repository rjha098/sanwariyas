// FILE: client/src/app/operations-center/(dashboard)/orders/page.js
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAdminDashboard } from "@/components/admin/AdminDashboardContext";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import OrderManager from "@/components/admin/OrderManager";

export default function OrdersPage() {
  const { token } = useAuth();
  const { showToast } = useAdminDashboard();
  return (
    <AdminSectionCard>
      <section aria-label="Order Management">
        <OrderManager token={token} showToast={showToast} />
      </section>
    </AdminSectionCard>
  );
}