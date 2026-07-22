// FILE: client/src/components/admin/AdminGuard.js
"use client";

import { notFound } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * Gate for the entire /operations-center route subtree.
 *
 * WHY THIS EXISTS
 * This app resolves auth state (token + user) entirely client-side —
 * AuthProvider reads a stored token and calls checkAuthSession() inside a
 * useEffect. There is no Next.js Middleware / cookie-based check anywhere
 * in this project, so the server can never know who's asking on the very
 * first response; `authChecking` always starts `true`. Given that, this
 * guard does the earliest-possible correct thing:
 *
 *   1. While authChecking is true, show a small neutral loading shell
 *      (same "Checking session..." state the page used to show itself).
 *   2. Once resolved, if the visitor is NOT an authenticated admin/staff
 *      user, call the real Next.js notFound() — this renders the app's
 *      actual not-found.js and mounts nothing else in this subtree: no
 *      admin component, no admin hook, no admin API call.
 *   3. Otherwise render `children` — the real Operations Center pages.
 *
 * Because this lives in operations-center/layout.js, it automatically
 * protects every current and future route under /operations-center/*
 * (blog/create, blog/edit/[id], inquiries/[id], etc.) with zero changes
 * to those files.
 *
 * "staff" is treated as equal-access to "admin" here, matching the
 * convention already used elsewhere in this codebase: Navbar.js's
 * getDashboardLink(), the admin-activity endpoints in
 * server/controllers/authController.js, and the chat-role check in
 * dashboard/page.js all already treat role "admin" and "staff" the same
 * way. Change the condition below if you want admin-only instead.
 */
export default function AdminGuard({ children }) {
  const { authChecking, isAuthenticated, isAdmin, isStaff } = useAuth();

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">
          Checking session...
        </p>
      </div>
    );
  }

  const isAuthorizedTeamMember = isAuthenticated && (isAdmin || isStaff);

  if (!isAuthorizedTeamMember) {
    notFound();
  }

  return children;
}