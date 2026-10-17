// FILE: client/src/components/admin/AdminDashboardContext.js
"use client";

import { createContext, useContext } from "react";

// Shared by the shell and the section pages: one toast and one sync countdown.
export const AdminDashboardContext = createContext(null);

export function useAdminDashboard() {
  const ctx = useContext(AdminDashboardContext);
  if (!ctx) {
    throw new Error("useAdminDashboard must be used inside AdminShell");
  }
  return ctx;
}