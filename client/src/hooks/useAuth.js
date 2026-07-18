// FILE: client/src/hooks/useAuth.js
"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AppProviders wrapper");
  }
  return context;
}