// FILE: client/src/components/product/AddToCartBox.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, computeMoq, SET_SIZE, MIN_PIECES } from "@/hooks/useCart";

export default function AddToCartBox({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [pieces, setPieces] = useState(MIN_PIECES);
  const [added, setAdded] = useState(false);

  const meta = computeMoq(pieces);

  //  CHECK IF OUT OF STOCK OR INSUFFICIENT STOCK FOR MOQ
  const isOutOfStock = typeof product.stock === 'number' && product.stock < MIN_PIECES;

  const addSet = () => setPieces((p) => p + SET_SIZE);
  const removeSet = () => setPieces((p) => Math.max(0, p - SET_SIZE));
  const handleManual = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setPieces(val === "" ? 0 : parseInt(val, 10));
  };

  const handleAddToCart = () => {
    if (!meta.moqMet) return;
    addItem(product, meta.pieces);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!meta.moqMet) return;
    addItem(product, meta.pieces);
    router.push("/cart");
  };

  //  IF OUT OF STOCK, SHOW THIS BEAUTIFUL PREMIUM CARD INSTEAD
  if (isOutOfStock) {
    return (
      <div className="bg-[#FAF3E8] p-6 rounded-xl border border-red-300 shadow-sm mb-8 text-center flex flex-col items-center justify-center">
        <h3 className="font-display text-2xl font-bold text-red-600 mb-2 tracking-wide">
          OUT OF STOCK
        </h3>
        <p className="font-sans text-xs text-[#a07f61] max-w-[250px]">
          We are currently completely sold out of this design. Please inquire below for restock dates.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 p-6 rounded-xl border border-[#C9A84C]/30 shadow-sm mb-8">
      <h3 className="font-display text-lg font-bold text-[#7A3D2A] mb-1">
        Smart Set Calculator
      </h3>
      <p className="font-sans text-xs text-[#a07f61] mb-5">
        1 Set = {SET_SIZE} pieces. Minimum order = 2 Sets ({MIN_PIECES} pieces).
        {typeof product.stock === 'number' && (
          <span className="block mt-1 font-bold text-green-700">✓ {product.stock} pieces available in stock.</span>
        )}
      </p>

      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={removeSet}
          className="w-10 h-10 border border-[#BE6E5B]/40 text-[#7A3D2A] font-bold text-lg rounded-md hover:bg-[#FDF7F2] transition-colors"
          aria-label="Remove one set"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={pieces}
          onChange={handleManual}
          className="w-24 text-center border border-[#BE6E5B]/40 rounded-md py-2 font-sans font-bold text-[#7A3D2A]"
          aria-label="Number of pieces"
        />
        <button
          type="button"
          onClick={addSet}
          className="w-10 h-10 border border-[#BE6E5B]/40 text-[#7A3D2A] font-bold text-lg rounded-md hover:bg-[#FDF7F2] transition-colors"
          aria-label="Add one set (5 pieces)"
        >
          +
        </button>
        <span className="font-sans text-xs text-[#a07f61]">pieces</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-[#FDF7F2] rounded-md py-2">
          <p className="font-display text-xl font-bold text-[#7A3D2A]">{meta.sets}</p>
          <p className="font-sans text-[9px] uppercase tracking-widest text-[#a07f61]">Full Sets</p>
        </div>
        <div className="bg-[#FDF7F2] rounded-md py-2">
          <p className="font-display text-xl font-bold text-[#7A3D2A]">{meta.remainderPieces}</p>
          <p className="font-sans text-[9px] uppercase tracking-widest text-[#a07f61]">Extra Pieces</p>
        </div>
        <div className="bg-[#FDF7F2] rounded-md py-2">
          <p className="font-display text-xl font-bold text-[#7A3D2A]">
            ₹{(pieces * product.price).toLocaleString("en-IN")}
          </p>
          <p className="font-sans text-[9px] uppercase tracking-widest text-[#a07f61]">Subtotal</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between font-sans text-[10px] uppercase tracking-widest text-[#a07f61] mb-1">
          <span>MOQ Progress</span>
          <span>{meta.progressPercent}%</span>
        </div>
        <div className="h-2 bg-[#FDF7F2] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${meta.moqMet ? "bg-green-600" : "bg-[#BE6E5B]"}`}
            style={{ width: `${meta.progressPercent}%` }}
          />
        </div>
        {!meta.moqMet && (
          <p className="font-sans text-[11px] text-[#BE6E5B] mt-1">
            Add {MIN_PIECES - meta.pieces} more piece(s) to meet the minimum order.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!meta.moqMet || (typeof product.stock === 'number' && pieces > product.stock)}
          className="flex-1 bg-white border-2 border-[#7A3D2A] text-[#7A3D2A] py-3 font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#FDF7F2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!meta.moqMet || (typeof product.stock === 'number' && pieces > product.stock)}
          className="flex-1 bg-[#7A3D2A] text-white py-3 font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#5c2d1f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
      
      {typeof product.stock === 'number' && pieces > product.stock && (
        <p className="text-center font-sans text-[11px] text-red-600 mt-3 font-bold">
          Cannot order more than available stock ({product.stock} pieces).
        </p>
      )}
    </div>
  );
}