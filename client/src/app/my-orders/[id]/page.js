// FILE: client/src/app/my-orders/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { fetchOrderById } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function MyOrderDetailPage() {
  const { token, isAuthenticated, authChecking } = useAuth();
  const { loadItems } = useCart();
  const router = useRouter();
  const params = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecking, isAuthenticated, router]);

  useEffect(() => {
    if (!token || !params.id) return;
    fetchOrderById(token, params.id)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.response?.data?.message || "Failed to load order."))
      .finally(() => setLoading(false));
  }, [token, params.id]);

  const handleReorder = () => {
    if (!order) return;
    const cartItems = order.items.map((i) => ({
      productId: i.product,
      name: i.name,
      slug: "",
      image: i.image,
      price: i.pricePerPiece,
      pieces: i.pieces,
    }));
    loadItems(cartItems);
    router.push("/cart");
  };

  if (authChecking || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50">
            Loading...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center px-4">
          <p className="font-sans text-sm text-red-600">{error || "Order not found."}</p>
        </div>
        <Footer />
      </>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF3E8] pt-32 pb-20 px-4 print:pt-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/my-orders")}
            className="mb-6 font-sans text-[10px] tracking-widest uppercase text-[#70543E] hover:text-[#574325] border-b border-[#70543E] pb-1 transition-colors print:hidden"
          >
            ← Back to My Orders
          </button>

          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-2xl text-[#574325]">{order.orderNumber}</h1>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="font-sans text-[10px] tracking-widest uppercase text-[#70543E] border border-[#70543E]/40 px-3 py-2 rounded-md hover:bg-[#70543E]/5"
              >
                Print Invoice
              </button>
              {order.status !== "cancelled" && (
                <button
                  onClick={handleReorder}
                  className="font-sans text-[10px] tracking-widest uppercase text-white bg-[#7A3D2A] px-3 py-2 rounded-md hover:bg-[#5c2d1f]"
                >
                  Reorder
                </button>
              )}
            </div>
          </div>
          <p className="font-sans text-xs text-[#a07f61] mb-8">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Order Tracking */}
          {order.status !== "cancelled" && (
            <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6">
              <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-5">
                Order Tracking
              </h2>
              <div className="flex justify-between">
                {STATUS_STEPS.map((step, idx) => (
                  <div key={step} className="flex-1 flex flex-col items-center relative">
                    {idx > 0 && (
                      <div
                        className={`absolute top-3 right-1/2 w-full h-0.5 ${
                          idx <= currentStepIndex ? "bg-green-600" : "bg-[#E8D5A3]"
                        }`}
                      />
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                        idx <= currentStepIndex
                          ? "bg-green-600 text-white"
                          : "bg-[#E8D5A3] text-[#a07f61]"
                      }`}
                    >
                      {idx <= currentStepIndex ? "✓" : idx + 1}
                    </div>
                    <p className="font-sans text-[9px] uppercase tracking-widest text-[#a07f61] mt-2 text-center capitalize">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice */}
          <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6">
            <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-4">
              Invoice
            </h2>
            <div className="divide-y divide-[#E8D5A3]/30">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-sans text-sm text-[#574325]">{item.name}</p>
                    <p className="font-sans text-xs text-[#a07f61]">
                      {item.pieces} pieces ({item.sets} sets + {item.remainderPieces} extra) @ ₹
                      {item.pricePerPiece.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="font-sans text-sm font-bold text-[#574325]">
                    ₹{item.subtotal.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#E8D5A3]/40">
              <p className="font-sans text-xs uppercase tracking-widest text-[#a07f61]">
                Total ({order.totalPieces} pieces / {order.totalSets} sets)
              </p>
              <p className="font-display text-2xl text-[#574325]">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}