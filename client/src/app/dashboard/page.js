// FILE: client/src/app/dashboard/page.js
"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import api, { deleteNotificationByInquiry } from "@/lib/api";
import Toast from "@/components/ui/Toast";

const Icon = {
  order: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  inquiry: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  reply: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  ),
  profile: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  bell: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  send: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  chevron: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  home: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  clock: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-4 h-4"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    contacted: {
      label: "In Review",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    resolved: {
      label: "Resolved",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    confirmed: {
      label: "Confirmed",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    processing: {
      label: "Processing",
      cls: "bg-purple-50 text-purple-700 border-purple-200",
    },
    shipped: {
      label: "Shipped",
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    delivered: {
      label: "Delivered",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const { label, cls } = map[status] || {
    label: status,
    cls: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border ${cls}`}
    >
      {label}
    </span>
  );
}

// ── Inquiry Card ──────────────────────────────────────────────────────────────
function InquiryCard({ inquiry, onReply, onSelect, isSelected }) {
  const hasReplies = inquiry.replies?.length > 0;
  const adminReplies =
    inquiry.replies?.filter((r) => r.role === "admin" || r.role === "staff") ||
    [];
  const lastReply = adminReplies[adminReplies.length - 1];

  return (
    <div
      onClick={() => onSelect(inquiry)}
      className={`cursor-pointer rounded-xl border transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-[#6F4E37] shadow-md"
          : "border-[#E8D5A3]/60 hover:border-[#6F4E37]/40"
      } ${!inquiry.isViewedByUser && hasReplies ? "bg-[#FAF3E8]" : "bg-white"}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!inquiry.isViewedByUser && hasReplies && (
                <span className="w-2 h-2 rounded-full bg-[#6F4E37] flex-shrink-0" />
              )}
              {/*  ADDED: Flex styling and mini-badge for the sidebar list */}
              <h3 className="font-sans font-semibold text-[#574325] text-sm truncate flex items-center gap-2">
                {inquiry.productCategory ||
                  inquiry.productName ||
                  "General Inquiry"}

                {inquiry.isAdminOnline && (
                  <span className="text-[8px] bg-green-100 border border-green-200 text-green-700 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 font-sans font-bold tracking-[0.1em] shadow-sm flex-shrink-0">
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>{" "}
                    ONLINE
                  </span>
                )}
              </h3>
            </div>
            <p className="font-sans text-xs text-[#70543E]/70 line-clamp-2">
              {inquiry.message}
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <StatusBadge status={inquiry.status} />
            {adminReplies.length > 0 && (
              <span className="font-sans text-[10px] text-[#6F4E37] font-semibold bg-[#6F4E37]/10 px-2 py-0.5 rounded-full">
                {adminReplies.length}{" "}
                {adminReplies.length === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>
        </div>

        {lastReply && (
          <div className="mt-3 pt-3 border-t border-[#E8D5A3]/50">
            <p className="font-sans text-[11px] text-[#70543E]/60 mb-1 uppercase tracking-wider">
              Latest reply
            </p>
            <p className="font-sans text-xs text-[#574325] line-clamp-2 italic">
              "{lastReply.message}"
            </p>
          </div>
        )}

        <div className="flex items-center gap-1 mt-3 text-[#70543E]/50">
          <Icon.clock />
          <span className="font-sans text-[11px]">
            {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Inquiry Detail Panel ──────────────────────────────────────────────────────

function InquiryDetail({ inquiry, token, onClose, onRefresh }) {
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  // Ref for the scrollable messages container
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const allMessages = [
    {
      role: "customer",
      message: inquiry.message,
      createdAt: inquiry.createdAt,
      name: inquiry.name,
    },
    ...(inquiry.replies || []),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  //  TASK 1: useLayoutEffect — robust scroll, fires after DOM paint, no setTimeout
  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [allMessages.length]);

  //  TASK 1: Scroll on inquiry switch (when user clicks a different inquiry card)
  useLayoutEffect(() => {
    if (inquiry && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [inquiry?._id]);

  const handleSend = async () => {
    if (!replyMsg.trim()) return;
    setSending(true);
    try {
      await api.post(
        `/inquiry/${inquiry._id}/reply`,
        { message: replyMsg.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReplyMsg("");
      onRefresh();
    } catch (err) {
      // console.error("Reply failed", err);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (inquiry && !inquiry.isViewedByUser) {
      api
        .patch(
          `/inquiry/${inquiry._id}/viewed`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .catch(() => {});
      deleteNotificationByInquiry(token, inquiry._id)
        .then(() => onRefresh())
        .catch(() => {});
    }
  }, [inquiry?._id, token]);

  return (
    <div className="bg-white rounded-xl border border-[#E8D5A3]/60 flex flex-col h-[550px] max-h-[75vh]">
      {/* Header — same as before, no changes */}
      <div className="px-6 py-4 border-b border-[#E8D5A3]/50 flex items-center justify-between">
        <div>
          {/*  ADDED: Added flex classes to position the badge next to the title */}
          <h3 className="font-display text-lg text-[#574325] flex items-center flex-wrap gap-3">
            {inquiry.productCategory ||
              inquiry.productName ||
              "General Inquiry"}

            {/*  ADDED: The specific Support Online Badge you requested */}
            {inquiry.isAdminOnline && (
              <span className="text-[10px] bg-green-100 border border-green-200 text-green-700 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 font-sans font-bold tracking-[0.1em] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                SUPPORT ONLINE
              </span>
            )}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={inquiry.status} />
            <span className="font-sans text-[11px] text-[#70543E]/50">
              {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/my-inquiries/${inquiry._id}`)}
            aria-label="Maximize inquiry details"
            title="Open in full page"
            className="text-[#70543E]/40 hover:text-[#C9A84C] transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
          </button>
          <button
            onClick={onClose}
            aria-label="Close inquiry details"
            title="Close details"
            className="text-[#70543E]/40 hover:text-red-500 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Details strip */}
      <div className="px-6 py-3 bg-[#FAF3E8]/50 border-b border-[#E8D5A3]/30 grid grid-cols-2 gap-2 text-xs font-sans flex-shrink-0">
        <span>
          <span className="text-[#70543E]/50 uppercase tracking-wider text-[10px]">
            Qty:{" "}
          </span>
          <span className="text-[#574325] font-semibold">
            {inquiry.quantity} pcs
          </span>
        </span>
        <span>
          <span className="text-[#70543E]/50 uppercase tracking-wider text-[10px]">
            Budget:{" "}
          </span>
          <span className="text-[#574325] font-semibold">
            {inquiry.budgetRange || "Not specified"}
          </span>
        </span>
        <span>
          <span className="text-[#70543E]/50 uppercase tracking-wider text-[10px]">
            Country:{" "}
          </span>
          <span className="text-[#574325] font-semibold">
            {inquiry.country}
          </span>
        </span>
        <span>
          <span className="text-[#70543E]/50 uppercase tracking-wider text-[10px]">
            WhatsApp:{" "}
          </span>
          <span className="text-[#574325] font-semibold">
            {inquiry.whatsapp}
          </span>
        </span>
      </div>

      {/*  TASK 1: chatContainerRef attached here */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#fdfbf7]"
      >
        {allMessages.map((msg, idx) => {
          const isAdmin = msg.role === "admin" || msg.role === "staff";
          return (
            <div
              key={idx}
              className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl font-sans text-sm ${
                  isAdmin
                    ? "bg-white border border-[#E8D5A3]/60 text-[#574325] rounded-tl-sm"
                    : "bg-[#6F4E37] text-white rounded-tr-sm"
                }`}
              >
                <p className="text-[10px] uppercase tracking-wider opacity-50 mb-1">
                  {isAdmin ? "Sanwariyas Team" : "You"}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
                <p className="text-[10px] opacity-40 mt-1.5 text-right">
                  {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        {/* Sentinel */}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply input */}
      <div className="px-6 py-4 border-t border-[#E8D5A3]/40 bg-white flex-shrink-0">
        <div className="flex gap-3">
          <textarea
            value={replyMsg}
            onChange={(e) => setReplyMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message... (Enter to send)"
            rows={2}
            className="flex-1 p-3 border border-[#E8D5A3]/60 rounded-xl focus:outline-none focus:border-[#6F4E37] font-sans text-sm resize-none"
          />
          <button
            onClick={handleSend}
            disabled={sending || !replyMsg.trim()}
            className="px-4 py-2 bg-[#6F4E37] text-white rounded-xl hover:bg-[#574325] disabled:opacity-40 transition-colors flex-shrink-0 self-end"
          >
            <Icon.send />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const { token, user, isAuthenticated, authChecking, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("orders"); // Default tab orders kar diya
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Profile States ──
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    company: "",
    country: "",
  });

  // ── Delete Account States ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  useEffect(() => {
    if (!authChecking && !isAuthenticated) router.replace("/login");
  }, [authChecking, isAuthenticated, router]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const res = await api.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      // console.error("Failed to load orders", err);
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);

  const loadInquiries = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/inquiry/my-inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      showToast("Failed to load inquiries.", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const silentRefreshInquiries = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/inquiry/my-inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(res.data.inquiries || []);

      setSelectedInquiry((prev) => {
        if (!prev) return null;
        const fresh = (res.data.inquiries || []).find(
          (i) => i._id === prev._id,
        );
        return fresh || prev;
      });
    } catch (err) {}
  }, [token]);

  useEffect(() => {
    if (token) {
      loadInquiries();
      loadOrders();

      // NAYA: Listen to global sync
      window.addEventListener("global_60s_sync", silentRefreshInquiries);

      return () =>
        window.removeEventListener("global_60s_sync", silentRefreshInquiries);
    }
  }, [token, loadInquiries, silentRefreshInquiries]);

  // Fetch Profile Data from DB
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setProfileLoading(true);
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data.user || res.data.data || res.data;
      setProfileData({
        name: userData.name || user?.name || "",
        phone: userData.phone || "",
        company: userData.company || "",
        country: userData.country || "",
      });
    } catch (err) {
      // console.error("Failed to fetch profile details", err);

      setProfileData({
        name: user?.name || "",
        phone: user?.phone || "",
        company: user?.company || "",
        country: user?.country || "",
      });
    } finally {
      setProfileLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (activeTab === "profile" && token) {
      fetchProfile();
    }
  }, [activeTab, token, fetchProfile]);

  // Update Profile Data
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await api.put("/auth/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Profile updated successfully!", "success");
      setIsEditingProfile(false);
      fetchProfile();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update profile.",
        "error",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "success");
    setTimeout(() => router.replace("/login"), 1500);
  };

  //  Account Deletion Function
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await api.delete("/auth/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(res.data.message || "Account deleted successfully.", "success");
      setShowDeleteModal(false);

      // Auto logout and redirect after successful deletion
      setTimeout(() => {
        logout();
        router.replace("/");
      }, 2000);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete account.",
        "error",
      );
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const unreadCount = inquiries.filter(
    (i) =>
      !i.isViewedByUser &&
      i.replies?.some((r) => r.role === "admin" || r.role === "staff"),
  ).length;
  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const resolvedCount = inquiries.filter((i) => i.status === "resolved").length;

  const navItems = [
    { key: "orders", label: "My Orders", icon: <Icon.order /> },
    {
      key: "inquiries",
      label: "My Inquiries",
      icon: <Icon.inquiry />,
      badge: unreadCount,
    },
    { key: "profile", label: "My Profile", icon: <Icon.profile /> },
  ];

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50">
          Loading...
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full px-4 py-2.5 border border-[#E8D5A3]/60 rounded-lg font-sans text-sm text-[#574325] placeholder-[#a07f61]/50 focus:outline-none focus:border-[#6F4E37] transition-colors bg-[#FAF3E8]/50";
  const labelCls =
    "block font-sans text-[11px] tracking-[0.2em] uppercase text-[#70543E] mb-2 font-semibold";

  return (
    <>
      {/*  SEO FIX: Injected NoIndex tag and Metadata for Private Dashboard Route */}

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      {/*  DELETION CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#E8D5A3] p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display text-xl text-red-600 mb-2">
              Delete Account?
            </h3>
            <p className="font-sans text-sm text-[#70543E] mb-6 leading-relaxed">
              Are you completely sure? This action is permanent. All your
              personal data and wholesale inquiries will be deleted and cannot
              be recovered.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2 font-sans text-xs tracking-widest uppercase text-[#574325] border border-[#E8D5A3] rounded-lg hover:bg-[#FAF3E8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-5 py-2 font-sans text-xs tracking-widest uppercase bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#FAF3E8]">
        {/* Top bar */}
        <div className="bg-white border-b border-[#E8D5A3]/60 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/*  SEO FIX: Descriptive aria-label for accessibility */}
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label="Toggle Dashboard Sidebar Navigation"
                title="Open Sidebar"
                className="lg:hidden text-[#70543E] p-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">
                  Sanwariyas
                </p>
                <p className="font-display text-sm text-[#574325]">
                  My Account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <button
                  onClick={() => setActiveTab("inquiries")}
                  aria-label={`You have ${unreadCount} unread inquiries`}
                  className="relative text-[#70543E] hover:text-[#574325] transition-colors"
                  title={`You have unread replies in ${unreadCount} inquiry topic(s)`}
                >
                  <Icon.bell />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#6F4E37] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                </button>
              )}
              {/*  SEO FIX: Added titles for accessibility */}
              <button
                onClick={() => router.push("/")}
                aria-label="Return to SANWARIYAS Home"
                title="Return to Homepage"
                className="text-[#70543E] hover:text-[#574325] transition-colors"
              >
                <Icon.home />
              </button>
              <div
                className="w-8 h-8 rounded-full bg-[#6F4E37] flex items-center justify-center"
                title="User Profile"
              >
                <span className="font-sans text-white text-xs font-semibold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
          {/* Sidebar */}
          <aside
            className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E8D5A3]/60 transform transition-transform lg:static lg:translate-x-0 lg:h-auto lg:z-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            {/* User info */}
            <div className="p-6 border-b border-[#E8D5A3]/40 mt-16 lg:mt-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#6F4E37] flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-white text-lg">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-semibold text-[#574325] truncate">
                    {user?.name || "Customer"}
                  </p>
                  <p className="font-sans text-[11px] text-[#70543E]/60 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Total", value: inquiries.length },
                  { label: "Pending", value: pendingCount },
                  { label: "Done", value: resolvedCount },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center bg-[#FAF3E8] rounded-lg py-2"
                  >
                    <p className="font-display text-lg text-[#574325]">
                      {s.value}
                    </p>
                    <p className="font-sans text-[10px] text-[#70543E]/50 uppercase tracking-wider">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm transition-all duration-150 ${
                    activeTab === item.key
                      ? "bg-[#6F4E37] text-white shadow-sm"
                      : "text-[#70543E] hover:bg-[#FAF3E8] hover:text-[#574325]"
                  }`}
                >
                  <span
                    className={
                      activeTab === item.key ? "text-white" : "text-[#C9A84C]"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="w-5 h-5 bg-white text-[#6F4E37] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-[#E8D5A3]/40 absolute bottom-0 w-full lg:static">
              {/*  SEO FIX: Descriptive title attribute */}
              <button
                onClick={handleLogout}
                title="Securely log out of your wholesale account"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Icon.logout />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-display text-2xl text-[#574325]">
                      My Orders
                    </h1>
                    <p className="font-sans text-xs text-[#70543E]/60 mt-0.5">
                      {orders.length} total orders
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/products")}
                    className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-5 py-2.5 hover:bg-[#574325] transition-colors rounded-lg"
                  >
                    Browse Catalog
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-28 bg-white rounded-xl border border-[#E8D5A3]/40 animate-pulse"
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#E8D5A3]/60 py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#FAF3E8] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
                      <Icon.order />
                    </div>
                    <h3 className="font-display text-xl text-[#574325] mb-2">
                      No orders yet.
                    </h3>
                    <p className="font-sans text-sm text-[#70543E]/60 mb-6">
                      You haven't placed any wholesale orders yet.
                    </p>
                    <button
                      onClick={() => router.push("/products")}
                      className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-6 py-3 hover:bg-[#574325] transition-colors rounded-lg"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-xl border border-[#E8D5A3]/60 p-5 hover:shadow-md transition-all hover:border-[#6F4E37]/40 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-sans font-bold text-[#574325] text-base">
                                {order.orderNumber}
                              </h3>
                              <p className="font-sans text-[11px] text-[#70543E]/60 mt-1 uppercase tracking-wider">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-4 pt-4 border-t border-[#E8D5A3]/30">
                          <div>
                            <p className="font-sans text-[10px] uppercase tracking-widest text-[#70543E]/50">
                              Total Amount
                            </p>
                            <p className="font-display text-lg text-[#7A3D2A] font-bold mt-0.5">
                              ₹{order.totalAmount?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              router.push(`/my-orders/${order._id}`)
                            }
                            className="font-sans text-[10px] tracking-widest uppercase text-[#6F4E37] border border-[#6F4E37]/30 px-3 py-1.5 rounded-md hover:bg-[#FAF3E8] transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Inquiries Tab */}
            {activeTab === "inquiries" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-display text-2xl text-[#574325]">
                      My Inquiries
                    </h1>
                    <p className="font-sans text-xs text-[#70543E]/60 mt-0.5">
                      {inquiries.length} total · {unreadCount} unread{" "}
                      {unreadCount > 0 ? "🔔" : ""}
                    </p>
                  </div>
                  {/*  SEO FIX: Descriptive title attribute */}
                  <button
                    onClick={() => router.push("/contact")}
                    title="Submit a new B2B Wholesale Inquiry"
                    className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-5 py-2.5 hover:bg-[#574325] transition-colors rounded-lg"
                  >
                    + New Inquiry
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-28 bg-white rounded-xl border border-[#E8D5A3]/40 animate-pulse"
                      />
                    ))}
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#E8D5A3]/60 py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#FAF3E8] flex items-center justify-center mx-auto mb-4">
                      <Icon.inquiry />
                    </div>
                    <h3 className="font-display text-xl text-[#574325] mb-2">
                      No inquiries yet.
                    </h3>
                    <p className="font-sans text-sm text-[#70543E]/60 mb-6">
                      Submit your first wholesale inquiry to get started.
                    </p>
                    <button
                      onClick={() => router.push("/contact")}
                      title="Submit a new B2B Wholesale Inquiry"
                      className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-6 py-3 hover:bg-[#574325] transition-colors rounded-lg"
                    >
                      Submit Inquiry
                    </button>
                  </div>
                ) : (
                  <div
                    className={`grid gap-4 ${selectedInquiry ? "lg:grid-cols-2" : "grid-cols-1"}`}
                  >
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <InquiryCard
                          key={inq._id}
                          inquiry={inq}
                          onSelect={(i) =>
                            setSelectedInquiry((prev) =>
                              prev?._id === i._id ? null : i,
                            )
                          }
                          isSelected={selectedInquiry?._id === inq._id}
                          onReply={() => {}}
                        />
                      ))}
                    </div>

                    {selectedInquiry && (
                      <div className="sticky top-24">
                        <InquiryDetail
                          inquiry={selectedInquiry}
                          token={token}
                          onClose={() => setSelectedInquiry(null)}
                          onRefresh={() => {
                            loadInquiries();
                            api
                              .get("/inquiry/my-inquiries", {
                                headers: { Authorization: `Bearer ${token}` },
                              })
                              .then((r) => {
                                const fresh = (r.data.inquiries || []).find(
                                  (i) => i._id === selectedInquiry._id,
                                );
                                if (fresh) setSelectedInquiry(fresh);
                              })
                              .catch(() => {});
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-display text-2xl text-[#574325]">
                    My Profile
                  </h1>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-5 py-2.5 hover:bg-[#574325] transition-colors rounded-lg"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-6 md:p-8">
                  {profileLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-10 bg-[#FAF3E8]/50 rounded w-full"></div>
                      <div className="h-10 bg-[#FAF3E8]/50 rounded w-full"></div>
                      <div className="h-10 bg-[#FAF3E8]/50 rounded w-full"></div>
                    </div>
                  ) : isEditingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={labelCls}>Full Name *</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                name: e.target.value,
                              })
                            }
                            className={inputCls}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Email Address</label>
                          <input
                            type="email"
                            value={user?.email || ""}
                            readOnly
                            className={`${inputCls} opacity-60 cursor-not-allowed`}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Phone Number</label>
                          <input
                            type="text"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+1 (xxx) xxx-xxxx"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Company / Boutique</label>
                          <input
                            type="text"
                            value={profileData.company}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                company: e.target.value,
                              })
                            }
                            placeholder="Your Business Name"
                            className={inputCls}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelCls}>Country</label>
                          <input
                            type="text"
                            value={profileData.country}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                country: e.target.value,
                              })
                            }
                            placeholder="e.g. United States, India, UK"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#E8D5A3]/40">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            fetchProfile(); // Reset fields to DB data if cancelled
                          }}
                          className="font-sans text-xs tracking-[0.2em] uppercase px-5 py-2.5 text-[#70543E] hover:bg-[#FAF3E8] rounded-lg transition-colors border border-[#E8D5A3]/60"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-6 py-2.5 hover:bg-[#574325] transition-colors rounded-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        {[
                          {
                            label: "Full Name",
                            value: profileData.name || user?.name,
                          },
                          { label: "Email", value: user?.email },
                          {
                            label: "Phone",
                            value: profileData.phone || "Not Provided",
                          },
                          {
                            label: "Company",
                            value: profileData.company || "Not Provided",
                          },
                          {
                            label: "Country",
                            value: profileData.country || "Not Provided",
                          },
                          {
                            label: "Account Type",
                            value: "Wholesale Customer",
                          },
                        ].map((f) => (
                          <div
                            key={f.label}
                            className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#E8D5A3]/30 last:border-0 gap-1 sm:gap-4"
                          >
                            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-[#70543E]/50 w-32 flex-shrink-0">
                              {f.label}
                            </span>
                            <span className="font-sans text-[13px] sm:text-sm text-[#574325] font-medium">
                              {f.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/*  DELETE ACCOUNT BUTTON */}
                      <div className="pt-6 mt-6 border-t border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-sans text-sm font-semibold text-red-600">
                            Danger Zone
                          </h4>
                          <p className="font-sans text-xs text-[#70543E]/60 mt-1">
                            Permanently delete your account and all associated
                            inquiries.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="font-sans text-xs tracking-widest uppercase px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
