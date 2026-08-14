"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { deleteNotificationByInquiry } from "@/lib/api";

export default function InquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const [adminVisible, setAdminVisible] = useState(true);

  const chatContainerRef = useRef(null);
  const mutationObserverRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    const node = chatContainerRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, []);

  const setChatContainerRef = useCallback(
    (node) => {
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
        mutationObserverRef.current = null;
      }
      chatContainerRef.current = node;

      if (node) {
        const observer = new MutationObserver(() => {
          requestAnimationFrame(scrollToBottom);
        });

        observer.observe(node, {
          childList: true,
          subtree: true,
          characterData: true,
        });

        mutationObserverRef.current = observer;
        requestAnimationFrame(scrollToBottom);
      }
    },
    [scrollToBottom],
  );

  useEffect(() => {
    return () => {
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
        mutationObserverRef.current = null;
      }
    };
  }, []);

  // ✅ FIX: Fetch Admin Visibility Configuration
  useEffect(() => {
    if (token) {
      api
        .get("/auth/visibility", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAdminVisible(res.data.isVisible))
        .catch(() => {});
    }
  }, [token]);

  const toggleAdminVisibility = async () => {
    try {
      const res = await api.patch(
        "/auth/visibility",
        { isVisible: !adminVisible },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAdminVisible(res.data.isVisible);
    } catch (err) {
      // console.error(err);
    }
  };

  const fetchInquiryDetails = useCallback(
    async (isSilent = false) => {
      if (!token) return;
      if (!isSilent) setError(null);

      try {
        const res = await api.get(`/inquiry/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedInquiry = res.data.inquiry;
        setInquiry(fetchedInquiry);

        // ✅ FIX: Only clear notifications if the user is actively viewing this tab
        const isTabActive = document.visibilityState === "visible";

        if (!isSilent || isTabActive) {
          await api
            .patch(
              `/inquiry/${params.id}/viewed`,
              {},
              { headers: { Authorization: `Bearer ${token}` } },
            )
            .catch(() => {});
          await deleteNotificationByInquiry(token, params.id).catch(() => {});

          //  FIX: Tell NotificationBell to remove the red dot
          window.dispatchEvent(new Event("notifications_read"));
        }
      } catch (err) {
        // console.error("Failed to load inquiry", err);
        if (!isSilent) {
          if (
            err.isTimeout ||
            err.code === "ECONNABORTED" ||
            err.message?.includes("timeout")
          ) {
            setError("timeout");
          } else if (!err.response) {
            setError("network");
          } else if (err.response.status === 404) {
            setError("notfound");
          } else {
            setError("server");
          }
        }
      } finally {
        if (!isSilent) setLoading(false);
      }
    },
    [token, params.id],
  );

  useEffect(() => {
    if (params.id && token) {
      fetchInquiryDetails(false);
    }
  }, [params.id, token, fetchInquiryDetails]);

  useEffect(() => {
    if (!token || !params.id) return;
    const intervalId = setInterval(() => {
      fetchInquiryDetails(true);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [token, params.id, fetchInquiryDetails]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !token) return;
    setSendingReply(true);
    setFlashMessage("");
    try {
      await api.post(
        `/inquiry/${params.id}/reply`,
        { message: replyText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFlashMessage("Reply sent successfully!");
      setReplyText("");
      await fetchInquiryDetails(true);
      setTimeout(() => setFlashMessage(""), 3000);
    } catch (error) {
      setFlashMessage(error.response?.data?.message || "Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="p-10 text-center font-sans text-brand-mud animate-pulse">
        Loading inquiry details...
      </div>
    );
  }

  if (error) {
    const messages = {
      timeout: {
        icon: "⏱️",
        title: "Request Timed Out",
        desc: "The server took too long to respond. This is usually temporary.",
      },
      network: {
        icon: "📡",
        title: "No Connection",
        desc: "Unable to reach the server. Check your internet connection.",
      },
      server: {
        icon: "⚠️",
        title: "Server Error",
        desc: "Something went wrong on the server. Please try again.",
      },
      notfound: {
        icon: "🗑️",
        title: "Inquiry Not Found",
        desc: "This inquiry might have been deleted from the database.",
      },
    };
    const { icon, title, desc } = messages[error] || messages.server;

    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="bg-white border border-brand-lightgold/50 shadow-sm p-12 text-center">
          <p className="text-4xl mb-4">{icon}</p>
          <h2 className="font-display text-2xl text-brand-african mb-2">
            {title}
          </h2>
          <p className="font-sans text-sm text-brand-mud/70 mb-8 max-w-sm mx-auto">
            {desc}
          </p>
          <div className="flex items-center justify-center gap-4">
            {error !== "notfound" && (
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchInquiryDetails(false);
                }}
                className="px-6 py-3 bg-brand-coffee text-brand-cream font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-brand-african transition-colors"
              >
                🔄 Retry
              </button>
            )}
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-brand-lightgold/60 text-brand-mud font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="p-10 text-center text-red-500 font-sans">
        Inquiry not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white border border-brand-lightgold/50 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="font-sans text-[10px] tracking-widest uppercase text-brand-mud hover:text-brand-coffee border-b border-brand-mud pb-1 transition-colors"
        >
          ← Back to Inquiries List
        </button>

        {/* ✅ FIX: Admin Visibility Toggle UI */}
        <div className="flex items-center gap-3 bg-[#FAF3E8] py-2 px-4 rounded-lg border border-[#E8D5A3]/50">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A3D2A]">
            Your Status: {adminVisible ? "VISIBLE" : "HIDDEN"}
          </span>
          <button
            onClick={toggleAdminVisibility}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${adminVisible ? "bg-green-500" : "bg-gray-400"}`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${adminVisible ? "translate-x-5" : "translate-x-1"}`}
            />
          </button>
        </div>
      </div>

      <div className="border-l-4 border-brand-gold pl-4 mb-8">
        <h1 className="font-display text-3xl text-brand-african flex items-center gap-4 flex-wrap">
          {inquiry.companyName || inquiry.name}

          {/* ✅ FIX: Customer Online Indicator */}
          {inquiry.isCustomerOnline ? (
            <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-sans font-bold tracking-[0.1em] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
              ONLINE
            </span>
          ) : (
            <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-sans font-bold tracking-[0.1em] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>{" "}
              OFFLINE
            </span>
          )}
        </h1>
        <p className="font-sans text-xs uppercase tracking-widest text-brand-mud/70 mt-2">
          Current Status:{" "}
          <span className="font-bold text-brand-coffee">{inquiry.status}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 font-sans">
        <div className="bg-brand-parchment p-6">
          <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-4">
            Contact Info
          </h3>
          <p className="text-sm mb-2">
            <strong className="text-brand-african">Name:</strong> {inquiry.name}
          </p>
          <p className="text-sm mb-2">
            <strong className="text-brand-african">Email:</strong>{" "}
            {inquiry.email}
          </p>
          <p className="text-sm mb-2">
            <strong className="text-brand-african">WhatsApp:</strong>{" "}
            {inquiry.whatsapp}
          </p>
          <p className="text-sm">
            <strong className="text-brand-african">Country:</strong>{" "}
            {inquiry.country}
          </p>
        </div>

        <div className="bg-brand-parchment p-6">
          <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-4">
            Order Requirements
          </h3>
          <p className="text-sm mb-2">
            <strong className="text-brand-african">Product:</strong>{" "}
            {inquiry.productName || "General"}
          </p>
          <p className="text-sm mb-2">
            <strong className="text-brand-african">Category:</strong>{" "}
            {inquiry.productCategory}
          </p>
          <p className="text-sm mb-2">
            <strong className="text-brand-african">Quantity:</strong>{" "}
            {inquiry.quantity} pcs
          </p>
          <p className="text-sm">
            <strong className="text-brand-african">Budget:</strong>{" "}
            {inquiry.budgetRange || "Not specified"}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-3 font-sans">
          Customer Message
        </h3>
        <div className="bg-gray-50 p-6 border border-gray-100 font-sans text-sm leading-relaxed text-brand-mud whitespace-pre-wrap">
          {inquiry.message}
        </div>
      </div>

      {inquiry.replies && inquiry.replies.length > 0 && (
        <div className="mb-8 border-t border-brand-lightgold/40 pt-8">
          <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-6 font-sans">
            Conversation History
          </h3>
          <div
            ref={setChatContainerRef}
            className="space-y-4 max-h-[50vh] overflow-y-auto pr-2"
          >
            {inquiry.replies.map((reply, index) => (
              <div
                key={index}
                className={`flex ${
                  reply.role === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 font-sans text-sm ${
                    reply.role === "admin"
                      ? "bg-brand-coffee text-brand-cream rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                      : "bg-brand-parchment text-brand-african rounded-tl-xl rounded-tr-xl rounded-br-xl"
                  } ${
                    reply.role === "customer" && reply.isReadByAdmin === false
                      ? "border-2 border-green-400 shadow-sm"
                      : "border border-brand-lightgold/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[10px] uppercase tracking-widest opacity-70">
                      {reply.role === "admin"
                        ? "Sanwariyas Team"
                        : inquiry.name}
                    </p>
                    {reply.role === "customer" &&
                      reply.isReadByAdmin === false && (
                        <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                          NEW
                        </span>
                      )}
                  </div>
                  <p className="whitespace-pre-wrap">{reply.message}</p>
                  <p className="text-[10px] opacity-50 mt-2">
                    {new Date(reply.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-brand-lightgold/40 pt-8">
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-3 font-sans">
          Send a Reply
        </h3>

        {flashMessage && (
          <p
            className={`mb-4 text-xs font-sans p-3 border ${
              flashMessage.toLowerCase().includes("failed") ||
              flashMessage.toLowerCase().includes("error")
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {flashMessage}
          </p>
        )}

        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply to the customer here..."
          rows={4}
          className="w-full p-4 border border-brand-lightgold/60 focus:outline-none focus:border-brand-coffee font-sans text-sm resize-none mb-4"
        />

        <button
          onClick={handleSendReply}
          disabled={sendingReply || !replyText.trim()}
          className="px-6 py-3 bg-brand-coffee text-brand-cream font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-brand-african disabled:opacity-50 transition-colors"
        >
          {sendingReply ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </div>
  );
}
