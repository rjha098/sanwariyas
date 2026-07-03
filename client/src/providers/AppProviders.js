// FILE: client/src/providers/AppProviders.js
"use client";

import { AuthProvider } from "@/providers/AuthProvider";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      {/* Any future providers (React Query, Theme, etc.) go here */}
      {children}
    </AuthProvider>
  );
}