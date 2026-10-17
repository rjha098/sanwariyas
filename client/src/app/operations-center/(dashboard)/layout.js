// FILE: client/src/app/operations-center/(dashboard)/layout.js
import AdminShell from "@/components/admin/AdminShell";

// Route group: "(dashboard)" does not appear in URLs. It exists so the sidebar shell
// wraps only the six section pages. The detail/edit routes (inquiries/[id],
// orders/[id], blog/create, blog/edit/[id]) stay outside it and keep their full-page UI.
// Auth is still enforced by the parent operations-center/layout.js (AdminGuard).
export default function DashboardLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}