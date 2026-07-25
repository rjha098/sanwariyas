// FILE: client/src/app/operations-center/orders/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchOrderById, updateAdminOrderStatus } from "@/lib/api";
import Toast from "@/components/ui/Toast";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  const loadOrder = () => {
    if (!token || !params.id) return;
    fetchOrderById(token, params.id)
      .then((data) => {
        setOrder(data.order);
        setNewStatus(data.order.status);
      })
      .catch(() => showToast("Failed to load order.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, params.id]);

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      await updateAdminOrderStatus(token, params.id, { status: newStatus, note });
      showToast("Order status updated.", "success");
      setNote("");
      loadOrder();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="font-sans text-xs text-brand-mud p-8">Loading order...</p>;
  }

  if (!order) {
    return <p className="font-sans text-xs text-red-600 p-8">Order not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={hideToast} />

      <button
        onClick={() => router.push("/operations-center?tab=orders")}
        className="mb-6 font-sans text-[10px] tracking-widest uppercase text-brand-mud hover:text-brand-coffee border-b border-brand-mud pb-1 transition-colors"
      >
        ← Back to Orders
      </button>

      <h1 className="font-display text-2xl text-brand-african mb-1">{order.orderNumber}</h1>
      <p className="font-sans text-xs text-brand-mud mb-8">
        {order.buyerName} · {order.buyerEmail} · {order.buyerCompany}
      </p>

      <div className="bg-white border border-brand-lightgold/40 rounded-xl p-6 mb-6">
        <h2 className="font-sans text-[11px] uppercase tracking-widest text-brand-mud mb-4">
          Items
        </h2>
        <div className="divide-y divide-brand-lightgold/20">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex justify-between">
              <div>
                <p className="font-sans text-sm text-brand-african">{item.name}</p>
                <p className="font-sans text-xs text-brand-mud">
                  {item.pieces} pieces ({item.sets} sets + {item.remainderPieces} extra)
                </p>
              </div>
              <p className="font-sans text-sm font-bold text-brand-african">
                ₹{item.subtotal.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4 mt-2 border-t border-brand-lightgold/40">
          <p className="font-sans text-xs uppercase tracking-widest text-brand-mud">
            Total ({order.totalPieces} pieces)
          </p>
          <p className="font-display text-xl text-brand-african">
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="bg-white border border-brand-lightgold/40 rounded-xl p-6 mb-6">
        <h2 className="font-sans text-[11px] uppercase tracking-widest text-brand-mud mb-4">
          Update Status
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border border-brand-lightgold/60 px-3 py-2 text-sm rounded-md"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional tracking note (e.g. courier + AWB number)"
            className="flex-1 border border-brand-lightgold/60 px-3 py-2 text-sm rounded-md"
          />
          <button
            onClick={handleUpdateStatus}
            disabled={saving}
            className="bg-brand-coffee text-white px-5 py-2 font-sans text-xs uppercase tracking-widest rounded-md hover:bg-brand-african disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-brand-lightgold/40 rounded-xl p-6">
        <h2 className="font-sans text-[11px] uppercase tracking-widest text-brand-mud mb-4">
          Tracking History
        </h2>
        <div className="space-y-3">
          {order.tracking?.slice().reverse().map((t, idx) => (
            <div key={idx} className="flex justify-between border-b border-brand-lightgold/10 pb-2">
              <div>
                <p className="font-sans text-sm font-semibold text-brand-african capitalize">
                  {t.status}
                </p>
                {t.note && <p className="font-sans text-xs text-brand-mud">{t.note}</p>}
              </div>
              <p className="font-sans text-[10px] text-brand-mud">
                {new Date(t.at).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}