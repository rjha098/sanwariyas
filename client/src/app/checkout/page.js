// FILE: client/src/app/checkout/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { placeOrder } from "@/lib/api";
import Toast from "@/components/ui/Toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user, isAuthenticated, authChecking } = useAuth();
  const { items, totalPieces, totalAmount, allMoqMet, clearCart, hydrated } = useCart();

  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login?mode=signin");
    }
  }, [authChecking, isAuthenticated, router]);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  const handlePlaceOrder = async () => {
    if (!allMoqMet) {
      showToast("Some items do not meet the minimum order quantity.", "error");
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        buyerName: user?.name,
        buyerEmail: user?.email,
        buyerCompany: user?.company || "",
        items: items.map((i) => ({ productId: i.productId, name: i.name, pieces: i.pieces })),
      };
      const res = await placeOrder(token, payload);
      clearCart();
      showToast("Order placed successfully!", "success");
      setTimeout(() => {
        router.push(`/my-orders/${res.order._id}`);
      }, 1200);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to place order.", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (authChecking || !hydrated) {
    return (
      <main className="min-h-screen bg-[#f5efe4] flex items-center justify-center">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-mud/50">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5efe4] px-4 sm:px-6 lg:px-8 py-12">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={hideToast} />
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl text-[#7A3D2A] mb-8">Review &amp; Place Order</h1>

        <div className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-6 mb-6">
          <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-3">
            Buyer Details
          </h2>
          <p className="font-sans text-sm text-[#7A3D2A]">{user?.name}</p>
          <p className="font-sans text-sm text-[#a07f61]">{user?.email}</p>
          {user?.company && <p className="font-sans text-sm text-[#a07f61]">{user.company}</p>}
        </div>

        <div className="bg-white/80 border border-[#BE6E5B]/20 rounded-xl p-6 mb-6">
          <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-4">
            Order Items
          </h2>
          <div className="divide-y divide-[#BE6E5B]/10">
            {items.map((item) => (
              <div key={item.productId} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-sans text-sm text-[#7A3D2A]">{item.name}</p>
                  <p className="font-sans text-xs text-[#a07f61]">{item.pieces} pieces</p>
                </div>
                <p className="font-sans text-sm font-bold text-[#7A3D2A]">
                  ₹{(item.pieces * item.price).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#BE6E5B]/20">
            <p className="font-sans text-xs uppercase tracking-widest text-[#a07f61]">
              Total ({totalPieces} pieces)
            </p>
            <p className="font-display text-2xl text-[#7A3D2A]">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing || !allMoqMet}
          className="w-full bg-[#7A3D2A] text-white py-4 font-sans text-sm tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#5c2d1f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </main>
  );
}