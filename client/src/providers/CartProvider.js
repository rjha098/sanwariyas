// FILE: client/src/providers/CartProvider.js
"use client";

import { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext(null);

const STORAGE_KEY = "sanwariyas_cart";
export const SET_SIZE = 5;
export const MIN_SETS = 2;
export const MIN_PIECES = MIN_SETS * SET_SIZE; // 10

//  Smart Set Calculator — shared logic used across product page, cart, checkout
export function computeMoq(pieces) {
  const p = Math.max(0, parseInt(pieces, 10) || 0);
  const sets = Math.floor(p / SET_SIZE);
  const remainderPieces = p % SET_SIZE;
  const moqMet = p >= MIN_PIECES;
  const progressPercent = Math.min(100, Math.round((p / MIN_PIECES) * 100));
  return { pieces: p, sets, remainderPieces, moqMet, progressPercent };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / unavailable — non-fatal
    }
  }, [items, hydrated]);

  const addItem = useCallback((product, pieces) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, pieces: i.pieces + pieces } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: product.price,
          pieces,
        },
      ];
    });
  }, []);

  const updatePieces = useCallback((productId, pieces) => {
    const safePieces = Math.max(0, parseInt(pieces, 10) || 0);
    setItems((prev) =>
      safePieces === 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, pieces: safePieces } : i))
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const loadItems = useCallback((newItems) => setItems(newItems), []);

  const totalPieces = items.reduce((sum, i) => sum + i.pieces, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.pieces * i.price, 0);
  const allMoqMet = items.length > 0 && items.every((i) => computeMoq(i.pieces).moqMet);

  return (
    <CartContext.Provider
      value={{
        items,
        hydrated,
        addItem,
        updatePieces,
        removeItem,
        clearCart,
        loadItems,
        totalPieces,
        totalAmount,
        allMoqMet,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}