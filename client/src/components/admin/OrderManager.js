// FILE: client/src/components/admin/OrderManager.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminOrders, fetchOrderAnalytics } from "@/lib/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  processing: "bg-indigo-100 text-indigo-800 border-indigo-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function OrderManager({ token, showToast }) {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [page, setPage] = useState(1);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const loadOrders = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetchAdminOrders(token, {
      page,
      status: statusFilter || undefined,
      search: searchTerm.trim() || undefined,
    })
      .then((data) => {
        setOrders(data.orders || []);
        setPagination(data.pagination || { total: 0, pages: 1 });
      })

      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setOrders([]);
          setPagination({ total: 0, pages: 1 });
        } else if (typeof showToast === "function") {
          showToast(
            error.userMessage ||
              error.response?.data?.message ||
              "Failed to load orders.",
            "error",
          );
        }
      })

      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, statusFilter, searchTerm]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!token) return;
    fetchOrderAnalytics(token)
      .then((data) => setStats(data.stats))
      .catch(() => {});
  }, [token]);

  return (
    <section
      aria-label="Order Management"
      className="bg-white border border-brand-lightgold/50 shadow-sm p-6 relative"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-1">
            Order Desk
          </p>
          <h2 className="font-display text-2xl">Manage Orders</h2>
        </div>

        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name or Order #..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="border border-brand-lightgold/60 px-4 py-2.5 text-sm rounded-lg font-sans focus:outline-none focus:border-brand-coffee min-w-[250px]"
          />
        </div>
      </div>

      {/* Basic Analytics */}
      {stats && (
        <div className="mb-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-brand-cream/40 rounded-lg p-4">
              <p className="font-display text-xl text-brand-african">
                {stats.totalOrders}
              </p>
              <p className="font-sans text-[9px] uppercase tracking-widest text-brand-mud">
                Total Orders
              </p>
            </div>
            <div className="bg-brand-cream/40 rounded-lg p-4">
              <p className="font-display text-xl text-brand-african">
                {stats.totalPieces}
              </p>
              <p className="font-sans text-[9px] uppercase tracking-widest text-brand-mud">
                Pieces Sold
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-display text-xl text-green-800">
                ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
              </p>
              <p className="font-sans text-[9px] uppercase tracking-widest text-green-700 font-semibold">
                Total Revenue
              </p>
            </div>
            <div className="bg-brand-cream/40 rounded-lg p-4">
              <p className="font-display text-xl text-brand-african">
                {stats.byStatus?.pending || 0}
              </p>
              <p className="font-sans text-[9px] uppercase tracking-widest text-brand-mud">
                Pending Orders
              </p>
            </div>
          </div>

          {/* Top Products */}
          {stats.topProducts && stats.topProducts.length > 0 && (
            <div className="border border-brand-lightgold/40 rounded-xl overflow-hidden bg-white max-w-2xl">
              <div className="bg-brand-cream/30 px-4 py-3 border-b border-brand-lightgold/40">
                <h3 className="font-display text-sm text-brand-african">
                  Top Selling Products
                </h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-brand-cream/10">
                    <tr className="text-brand-mud">
                      <th className="py-2.5 px-4 font-sans text-[10px] uppercase tracking-widest">
                        Product Name
                      </th>
                      <th className="py-2.5 px-4 font-sans text-[10px] uppercase tracking-widest text-right">
                        Pieces Sold
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-lightgold/20">
                    {stats.topProducts.map((prod, idx) => (
                      <tr
                        key={prod._id || idx}
                        className="hover:bg-brand-cream/20"
                      >
                        <td className="py-2 px-4 font-sans text-xs font-semibold text-brand-african truncate max-w-[300px]">
                          {prod.name}
                        </td>
                        <td className="py-2 px-4 font-sans text-xs text-brand-mud text-right">
                          {prod.piecesSold} pcs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STATUS FILTERS ONLY */}
      <div
        className="flex flex-wrap gap-2 mb-6"
        role="group"
        aria-label="Filter orders by status"
      >
        {[
          "",
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status || "all"}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-3 py-1.5 font-sans text-[10px] tracking-widest uppercase rounded-md border transition-colors ${
              statusFilter === status
                ? "bg-brand-coffee text-white border-brand-coffee font-bold"
                : "bg-white text-brand-mud border-brand-lightgold/50 hover:border-brand-coffee"
            }`}
          >
            {status || "All Orders"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-sans text-xs text-brand-mud text-center py-10">
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <p className="font-sans text-xs text-brand-mud text-center py-10">
          No orders found matching criteria.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-lightgold/40 text-brand-mud">
                <th className="py-3 font-sans text-[10px] uppercase tracking-widest">
                  Order #
                </th>
                <th className="py-3 font-sans text-[10px] uppercase tracking-widest">
                  Buyer
                </th>
                <th className="py-3 font-sans text-[10px] uppercase tracking-widest">
                  Pieces
                </th>
                <th className="py-3 font-sans text-[10px] uppercase tracking-widest">
                  Amount
                </th>
                <th className="py-3 font-sans text-[10px] uppercase tracking-widest">
                  Status
                </th>
                <th className="py-3 font-sans text-[10px] uppercase tracking-widest">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-lightgold/20">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() =>
                    router.push(`/operations-center/orders/${order._id}`)
                  }
                  className="cursor-pointer hover:bg-brand-cream/30 transition-colors"
                >
                  <td className="py-4 font-sans text-xs font-semibold text-brand-african">
                    {order.orderNumber}
                  </td>
                  <td className="py-4 font-sans text-xs text-brand-mud">
                    {order.buyerName}
                  </td>
                  <td className="py-4 font-sans text-xs text-brand-mud">
                    {order.totalPieces} ({order.totalSets} sets)
                  </td>
                  <td className="py-4 font-sans text-xs font-bold text-brand-african">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border ${
                        STATUS_COLORS[order.status] ||
                        "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : order.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700 border-red-300"
                            : "bg-amber-100 text-amber-700 border-amber-300"
                      }`}
                    >
                      {order.paymentStatus || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-md font-sans text-xs ${
                      page === p
                        ? "bg-brand-coffee text-white"
                        : "bg-white border border-brand-lightgold/40 text-brand-mud hover:bg-brand-cream"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}