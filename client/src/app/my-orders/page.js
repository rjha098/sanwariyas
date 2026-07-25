// FILE: client/src/app/my-orders/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyOrders } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const STATUS_MAP = {
  pending:    { label: "Pending",    cls: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed:  { label: "Confirmed",  cls: "bg-blue-50 text-blue-700 border-blue-200" },
  processing: { label: "Processing", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  shipped:    { label: "Shipped",    cls: "bg-purple-50 text-purple-700 border-purple-200" },
  delivered:  { label: "Delivered",  cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled:  { label: "Cancelled",  cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function MyOrdersPage() {
  const { token, isAuthenticated, authChecking } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecking, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;
    fetchMyOrders(token)
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF3E8] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-6 font-sans text-[10px] tracking-widest uppercase text-[#70543E] hover:text-[#574325] border-b border-[#70543E] pb-1 transition-colors"
          >
            ← Back to Dashboard
          </button>

          <h1 className="font-display text-3xl text-[#574325] mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-[#E8D5A3]/40">
              <p className="font-sans text-sm text-[#a07f61] mb-4">No orders yet.</p>
              <button
                onClick={() => router.push("/products")}
                className="inline-block bg-[#7A3D2A] text-white px-6 py-3 font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-md hover:bg-[#5c2d1f] transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = STATUS_MAP[order.status] || {
                  label: order.status,
                  cls: "bg-gray-50 text-gray-600 border-gray-200",
                };
                return (
                  <div
                    key={order._id}
                    onClick={() => router.push(`/my-orders/${order._id}`)}
                    className="cursor-pointer bg-white rounded-xl border border-[#E8D5A3]/40 p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-sans font-semibold text-[#574325] text-sm mb-1">
                          {order.orderNumber}
                        </h3>
                        <p className="font-sans text-xs text-[#70543E]/70">
                          {order.totalPieces} pieces ({order.totalSets} sets) · ₹
                          {order.totalAmount.toLocaleString("en-IN")}
                        </p>
                        <p className="font-sans text-[10px] text-[#a07f61] mt-2">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border ${status.cls}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}