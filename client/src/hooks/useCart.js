// FILE: client/src/hooks/useCart.js
"use client";

import { useContext } from "react";
import { CartContext, computeMoq, SET_SIZE, MIN_SETS, MIN_PIECES } from "@/providers/CartProvider";

export { computeMoq, SET_SIZE, MIN_SETS, MIN_PIECES };

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}