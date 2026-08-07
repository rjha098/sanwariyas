// FILE: client/src/app/cart/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart, computeMoq, MIN_PIECES } from "@/hooks/useCart";
import { getImageUrl } from "@/lib/imageUrl";
import { fetchProducts } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, authChecking } = useAuth();
  const {
    items,
    updatePieces,
    removeItem,
    totalPieces,
    totalAmount,
    allMoqMet,
    hydrated,
  } = useCart();

  //  fix  to  track the  loading  track
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login?mode=signin&redirect=/cart");
    }
  }, [authChecking, isAuthenticated, router]);

  // 3. FIX: Database Verification Logic (to  remove  the  orphan  product )
  useEffect(() => {
    async function verifyCartItems() {
      if (!hydrated) return;

      if (items.length > 0) {
        try {
          // fetch  the  active  product  from  database
          const response = await fetchProducts();
          const activeProducts = response.products || [];
          const activeProductIds = activeProducts.map((p) => p._id);

          // check  which   product  is in cart and  not  available  in database

          items.forEach((cartItem) => {
            if (!activeProductIds.includes(cartItem.productId)) {
              console.log(`Auto-removing deleted product: ${cartItem.name}`);
              removeItem(cartItem.productId);
            }
          });
        } catch (error) {
          console.error("Failed to verify cart items:", error);
        }
      }
      setIsVerifying(false);
    }

    verifyCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, items.length]);

  // 4. FIX: in loader   verifying  is  added

  if (authChecking || !hydrated || isVerifying) {
    return (
      <main className="min-h-screen bg-[#f5efe4] flex items-center justify-center">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-mud/50">
          Loading...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f5efe4] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl text-[#7A3D2A] mb-2">
          Your Wholesale Cart
        </h1>
        <p className="font-sans text-xs text-[#a07f61] mb-8">
          Each item must meet the minimum order of {MIN_PIECES} pieces (2 sets)
          to proceed.
        </p>

        {items.length === 0 ? (
          <div className="bg-white/70 border border-[#BE6E5B]/20 rounded-xl p-10 text-center">
            <p className="font-sans text-sm text-[#a07f61] mb-4">
              Your cart is empty.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#7A3D2A] text-white px-6 py-3 font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#5c2d1f] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => {
                const meta = computeMoq(item.pieces);
                return (
                  <div
                    key={item.productId}
                    className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-5 flex flex-col sm:flex-row gap-4"
                  >
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full sm:w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-display text-lg text-[#7A3D2A]">
                            {item.name}
                          </p>
                          <p className="font-sans text-xs text-[#a07f61]">
                            ₹{item.price.toLocaleString("en-IN")} / piece
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="font-sans text-[10px] uppercase tracking-widest text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.pieces}
                          onChange={(e) =>
                            updatePieces(
                              item.productId,
                              e.target.value.replace(/\D/g, ""),
                            )
                          }
                          className="w-20 text-center border border-[#BE6E5B]/40 rounded-md py-1.5 font-sans font-bold text-[#7A3D2A]"
                        />
                        <span className="font-sans text-xs text-[#a07f61]">
                          pieces ({meta.sets} sets + {meta.remainderPieces}{" "}
                          extra)
                        </span>
                        <span className="ml-auto font-sans text-sm font-bold text-[#7A3D2A]">
                          ₹{(item.pieces * item.price).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="h-1.5 bg-[#FDF7F2] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            meta.moqMet ? "bg-green-600" : "bg-[#BE6E5B]"
                          }`}
                          style={{ width: `${meta.progressPercent}%` }}
                        />
                      </div>
                      {!meta.moqMet && (
                        <p className="font-sans text-[11px] text-[#BE6E5B] mt-1">
                          Add {MIN_PIECES - item.pieces} more piece(s) to meet
                          MOQ.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-sans text-xs text-[#a07f61] uppercase tracking-widest mb-1">
                  Order Summary
                </p>
                <p className="font-display text-2xl text-[#7A3D2A]">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </p>
                <p className="font-sans text-xs text-[#a07f61]">
                  {totalPieces} pieces total
                </p>
              </div>
              <button
                type="button"
                disabled={!allMoqMet}
                onClick={() => router.push("/checkout")}
                className="bg-[#7A3D2A] text-white px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#5c2d1f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
            {!allMoqMet && (
              <p className="font-sans text-xs text-red-600 mt-3 text-right">
                One or more items have not met the minimum order quantity.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
