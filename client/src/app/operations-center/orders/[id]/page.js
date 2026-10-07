// FILE: client/src/app/operations-center/orders/[id]/page.js
"use client";

import { formatPhone } from "@/utils/formatPhone";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchOrderById, updateAdminOrderStatus } from "@/lib/api";
import { getImageUrl } from "@/lib/imageUrl";
import Toast from "@/components/ui/Toast";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// Universal Courier Logic Retained
export const COURIER_PARTNERS = [
  "DTDC",
  "Delhivery",
  "BlueDart",
  "XpressBees",
  "Ecom Express",
  "Shadowfax",
  "Trackon",
  "India Post",
  "Shree Maruti",
  "Amazon Shipping",
  "Ekart Logistics",
  "Safexpress",
  "Tirupati Courier",
  "Gati",
  "Other",
];

export const generateTrackingLink = (courier, awb) => {
  if (!awb) return "#";
  const map = {
    DTDC: `https://www.dtdc.in/tracking/tracking_results.asp?trackType=awb&trackNo=${awb}`,
    Delhivery: `https://www.delhivery.com/tracking?id=${awb}`,
    BlueDart: `https://www.bluedart.com/tracking`,
    XpressBees: `https://www.xpressbees.com/track?awb=${awb}`,
    "Ecom Express": `https://ecomexpress.in/tracking/?awb=${awb}`,
    Shadowfax: `https://track.shadowfax.in/track?awb=${awb}`,
    Trackon: `https://trackon.in/Tracking/MultipleTracking?awb=${awb}`,
    "India Post": `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`,
    "Shree Maruti": `https://www.shreemaruti.com/track-your-shipment?awb=${awb}`,
  };
  return (
    map[courier] || `https://www.google.com/search?q=${courier}+tracking+${awb}`
  );
};

export default function AdminOrderDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [awbNumber, setAwbNumber] = useState("");
  const [courierPartner, setCourierPartner] = useState("DTDC");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  const loadOrder = () => {
    if (!token || !params.id) return;
    fetchOrderById(token, params.id)
      .then((data) => {
        setOrder(data.order);
        setNewStatus(data.order.status);
        setAwbNumber(data.order.awbNumber || "");
        setCourierPartner(data.order.courierPartner || "DTDC");
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
      await updateAdminOrderStatus(token, params.id, {
        status: newStatus,
        awbNumber: awbNumber.trim(),
        courierPartner,
      });
      showToast("Dispatch Details Saved.", "success");
      loadOrder();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update tracking.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="font-sans text-xs text-brand-mud p-8">Loading order...</p>
    );
  if (!order)
    return (
      <p className="font-sans text-xs text-red-600 p-8">Order not found.</p>
    );

  const trackingLink = generateTrackingLink(courierPartner, order.awbNumber);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <button
        onClick={() => router.push("/operations-center?tab=orders")}
        className="mb-6 font-sans text-[10px] tracking-widest uppercase text-brand-mud hover:text-brand-coffee border-b border-brand-mud pb-1 transition-colors"
      >
        ← Back to Orders
      </button>

      <h1 className="font-display text-2xl text-brand-african mb-1">
        {order.orderNumber}
      </h1>

      <p className="font-sans text-xs text-brand-mud mb-2">
        Buyer: {order.buyerName} <br />
        Email: {order.buyerEmail || "N/A"} <br />
        Phone: {order.buyerPhone ? formatPhone(order.buyerPhone) : "N/A"}{" "}
        {order.buyerCompany && (
          <>
            <br />
            Company: {order.buyerCompany}
          </>
        )}
      </p>

      <div className="mb-6">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-[11px] font-semibold uppercase border ${
            order.paymentStatus === "paid"
              ? "bg-green-100 text-green-700 border-green-300"
              : order.paymentStatus === "failed"
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-amber-100 text-amber-700 border-amber-300"
          }`}
        >
          Payment: {order.paymentStatus || "pending"}
        </span>
        {order.paymentStatus !== "paid" && (
          <p className="font-sans text-[11px] text-red-600 mt-2">
            ⚠ This order has not been paid for yet. Confirm payment before
            dispatching.
          </p>
        )}
      </div>

      {order.shippingAddress && (
        <div className="bg-white border border-brand-lightgold/40 rounded-xl p-6 mb-6">
          <h2 className="font-sans text-[11px] uppercase tracking-widest text-brand-mud mb-2">
            Ship To
          </h2>
          <p className="font-sans text-sm text-brand-african leading-relaxed">
            {order.shippingAddress.addressLine1}
            {order.shippingAddress.addressLine2 &&
              `, ${order.shippingAddress.addressLine2}`}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
            {order.shippingAddress.pincode}
            {order.shippingAddress.country && (
              <>, {order.shippingAddress.country}</>
            )}
            {order.shippingAddress.alternatePhone && (
              <>
                <br />
                Alt. Phone:{" "}
                {formatPhone(order.shippingAddress.alternatePhone, {
                  assumeIndia: true,
                })}
              </>
            )}
          </p>
        </div>
      )}
      <div className="bg-white border border-brand-lightgold/40 rounded-xl p-6 mb-6">
        <h2 className="font-sans text-[11px] uppercase tracking-widest text-brand-mud mb-4">
          Items
        </h2>
        <div className="divide-y divide-brand-lightgold/20">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="py-3 flex justify-between items-center gap-3"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}

                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md border border-brand-lightgold/40 flex-shrink-0 bg-brand-cream"
                />
                <div>
                  <p className="font-sans text-sm text-brand-african">
                    {item.name}
                  </p>
                  <p className="font-sans text-xs text-brand-mud">
                    {item.pieces} pieces ({item.sets} sets)
                  </p>
                </div>
              </div>
              <p className="font-sans text-sm font-bold text-brand-african">
                ₹{item.subtotal.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4 mt-2 border-t border-brand-lightgold/40">
          <p className="font-sans text-xs uppercase tracking-widest text-brand-mud">
            Total ({order.totalPieces} pcs)
          </p>
          <p className="font-display text-xl text-brand-african">
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="bg-white border border-brand-lightgold/40 rounded-xl p-6 mb-6">
        <h2 className="font-sans text-[11px] uppercase tracking-widest text-brand-mud mb-4">
          Dispatch & Tracking Details
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
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
          <select
            value={courierPartner}
            onChange={(e) => setCourierPartner(e.target.value)}
            className="border border-brand-lightgold/60 px-3 py-2 text-sm rounded-md"
          >
            {COURIER_PARTNERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={awbNumber}
            onChange={(e) => setAwbNumber(e.target.value)}
            placeholder="Enter Tracking / AWB Number..."
            className="flex-1 border border-brand-lightgold/60 px-3 py-2 text-sm rounded-md"
          />
          <button
            onClick={handleUpdateStatus}
            disabled={saving}
            className="bg-brand-coffee text-white px-5 py-2 font-sans text-xs uppercase tracking-widest rounded-md hover:bg-brand-african disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Details"}
          </button>
        </div>

        {order.awbNumber && (
          <div className="mt-4 p-4 bg-brand-cream/30 border border-brand-lightgold/50 rounded-lg flex items-center justify-between">
            <p className="font-sans text-xs text-brand-mud truncate mr-4">
              <span className="font-bold text-brand-coffee">
                {order.courierPartner} Tracking Link:
              </span>
              <br />
              {trackingLink}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `Aapka order dispatch ho gaya hai. Yahan track karein: ${trackingLink}`,
                );
                showToast("Copied to clipboard for WhatsApp!", "success");
              }}
              className="flex-shrink-0 bg-brand-lightgold/30 text-brand-coffee px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-brand-lightgold/50"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
