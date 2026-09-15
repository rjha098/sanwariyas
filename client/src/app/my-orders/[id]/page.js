// FILE: client/src/app/my-orders/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { fetchOrderById } from "@/lib/api";
// import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getImageUrl } from "@/lib/imageUrl";

// Map reused for customer side
const generateTrackingLink = (courier, awb) => {
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
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load order."),
      )
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
        {/* <Navbar /> */}
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
        {/* <Navbar /> */}
        <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center px-4">
          <p className="font-sans text-sm text-red-600">
            {error || "Order not found."}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen bg-[#FAF3E8] pt-32 pb-20 px-4 print:pt-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-6 font-sans text-[10px] tracking-widest uppercase text-[#70543E] hover:text-[#574325] border-b border-[#70543E] pb-1 transition-colors print:hidden"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-2xl text-[#574325]">
              {order.orderNumber}
            </h1>
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

          {order.shippingAddress && (
            <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6">
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-2">
                Shipping To
              </p>
              <p className="font-sans text-sm text-[#574325] leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 &&
                  `, ${order.shippingAddress.addressLine2}`}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pincode}
                {order.shippingAddress.alternatePhone && (
                  <>
                    <br />
                    Alt. Phone: {order.shippingAddress.alternatePhone}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Dynamic Smart Courier Tracking Button */}
          {order.status !== "cancelled" &&
            (order.awbNumber ? (
              <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-1">
                    Tracking Number ({order.courierPartner})
                  </p>
                  <p className="font-display text-2xl text-[#574325]">
                    {order.awbNumber}
                  </p>
                </div>
                <a
                  href={generateTrackingLink(
                    order.courierPartner,
                    order.awbNumber,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#7A3D2A] text-white font-sans text-xs tracking-widest uppercase px-6 py-3 rounded-md hover:bg-[#5c2d1f] transition-colors shadow-sm text-center"
                >
                  Track on {order.courierPartner}
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6 flex items-center justify-center">
                <p className="font-sans text-sm text-[#a07f61] text-center">
                  Your order is currently being processed. Tracking details will
                  appear here once dispatched.
                </p>
              </div>
            ))}

          {/* Invoice */}
          <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6">
            <h2 className="font-sans text-[11px] uppercase tracking-widest text-[#a07f61] mb-4">
              Invoice
            </h2>
            <div className="divide-y divide-[#E8D5A3]/30">
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
                      className="w-12 h-12 object-cover rounded-md border border-[#E8D5A3]/40 flex-shrink-0 bg-[#FAF3E8]"
                    />
                    <div>
                      <p className="font-sans text-sm text-[#574325]">
                        {item.name}
                      </p>
                      <p className="font-sans text-xs text-[#a07f61]">
                        {item.pieces} pieces @ ₹
                        {item.pricePerPiece.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <p className="font-sans text-sm font-bold text-[#574325]">
                    ₹{item.subtotal.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#E8D5A3]/40">
              <p className="font-sans text-xs uppercase tracking-widest text-[#a07f61]">
                Total
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
