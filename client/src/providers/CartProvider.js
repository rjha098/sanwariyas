"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { getImageUrl } from "@/lib/imageUrl"; //  FIX: Added import

export const CartContext = createContext(null);

const STORAGE_KEY = "sanwariyas_cart";
export const SET_SIZE = 5;
export const MIN_SETS = 2;
export const MIN_PIECES = MIN_SETS * SET_SIZE; // 10

// Smart Set Calculator
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
      // storage full
    }
  }, [items, hydrated]);

  const addItem = useCallback((product, pieces) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id 
            ? { ...i, pieces: parseInt(i.pieces || 0, 10) + parseInt(pieces, 10) } 
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: getImageUrl(product.image), 
          price: product.price,
          pieces: parseInt(pieces, 10),
        },
      ];
    });
  }, []);

  const updatePieces = useCallback((productId, pieces) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId) {
          //  Allow empty string to live in state so user can type freely
          if (pieces === "") return { ...i, pieces: "" };
          const safePieces = Math.max(0, parseInt(pieces, 10) || 0);
          return { ...i, pieces: safePieces };
        }
        return i;
      }).filter((i) => i.pieces !== 0) // Only remove if strictly 0
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const loadItems = useCallback((newItems) => setItems(newItems), []);

  //  Handle empty strings gracefully in reduce functions
  const totalPieces = items.reduce((sum, i) => sum + (parseInt(i.pieces, 10) || 0), 0);
  const totalAmount = items.reduce((sum, i) => sum + (parseInt(i.pieces, 10) || 0) * i.price, 0);
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
        MIN_PIECES, 
        SET_SIZE
      }}
    >
      {children}
    </CartContext.Provider>
  );
}