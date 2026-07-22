"use client";

//  FIX: useLayoutEffect add kiya
import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api, { deleteNotificationByInquiry } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MyInquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isAuthenticated, authChecking } = useAuth();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [flash, setFlash] = useState("");

  // ✅ FIX: chatContainerRef — scrollable div pe lagega
  const chatContainerRef = useRef(null);

  // ✅ FIX: useLayoutEffect — replies change hone pe direct scrollTop set karo
  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [inquiry?.replies?.length]);

  const fetchInquiry = useCallback(
    async (isSilent = false) => {
      if (!token) return;
      try {
        const res = await api.get("/inquiry/my-inquiries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = res.data.inquiries || [];
        const found = all.find((inq) => inq._id === params.id);
        setInquiry(found || null);

        // ✅ ADDED: Only mark as read if the tab is visible
        const isTabActive = document.visibilityState === "visible";

        if (!isSilent || (isTabActive && found && !found.isViewedByUser)) {
          await api.patch(
            `/inquiry/${params.id}/viewed`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          );
          await deleteNotificationByInquiry(token, params.id).catch(() => {});

          // ✅ ADDED: Sync Notification Bell instantly
          window.dispatchEvent(new Event("notifications_read"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isSilent) setLoading(false);
      }
    },
    [token, params.id],
  );

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecking, isAuthenticated, router]);

  useEffect(() => {
    if (token && params.id) fetchInquiry(false);
  }, [token, params.id, fetchInquiry]);

  useEffect(() => {
    if (!token || !params.id) return;
    const handleGlobalSync = () => fetchInquiry(true);
    window.addEventListener("global_60s_sync", handleGlobalSync);
    return () =>
      window.removeEventListener("global_60s_sync", handleGlobalSync);
  }, [token, params.id, fetchInquiry]);

  
  const handleSendReply = async () => {
    if (!replyText.trim() || !token) return;
    setSending(true);
    setFlash("");
    try {
      await api.post(
        `/inquiry/${params.id}/reply`,
        { message: replyText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReplyText("");
      setFlash("Reply sent!");
      await fetchInquiry(true);
      setTimeout(() => setFlash(""), 3000);
    } catch (err) {
      setFlash("Failed to send reply.");
    } finally {
      setSending(false);
    }
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

  if (!inquiry) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
          <p className="font-sans text-sm text-red-500">Inquiry not found.</p>
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
            onClick={() => router.push("/my-inquiries")}
            className="mb-6 font-sans text-[10px] tracking-widest uppercase text-[#70543E] hover:text-[#574325] border-b border-[#70543E] pb-1 transition-colors"
          >
            ← Back to My Inquiries
          </button>

          <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6">
            <h1 className="font-display text-2xl text-[#574325] mb-1 flex items-center flex-wrap gap-4">
              {inquiry.productCategory ||
                inquiry.productName ||
                "General Inquiry"}

              {/* ✅ ADDED: Admin / Support Online Badge */}
              {inquiry.isAdminOnline && (
                <span className="text-[10px] bg-green-100 border border-green-200 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-sans font-bold tracking-[0.1em] shadow-sm w-max">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                  SUPPORT ONLINE
                </span>
              )}
            </h1>
            <p className="font-sans text-xs text-[#a07f61] uppercase tracking-widest">
              Status:{" "}
              <span className="font-bold text-[#574325]">{inquiry.status}</span>
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6">
            <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
              Your Original Message
            </h3>
            <p className="font-sans text-sm text-[#70543E] whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </div>

          {inquiry.replies && inquiry.replies.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6 mb-6">
              <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#C9A84C] mb-6">
                Conversation
              </h3>
              {/* ✅ FIX: chatContainerRef yahan — direct scrollTop control */}
              <div
                ref={chatContainerRef}
                className="space-y-4 max-h-[50vh] overflow-y-auto pr-2"
              >
                {inquiry.replies.map((reply, index) => {
                  const isAdmin =
                    reply.role === "admin" || reply.role === "staff";
                  const isUnreadAdminReply = isAdmin && !inquiry.isViewedByUser;

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isAdmin ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-4 font-sans text-sm rounded-xl ${
                          isAdmin
                            ? `bg-[#FAF3E8] text-[#574325] border ${
                                isUnreadAdminReply &&
                                index === inquiry.replies.length - 1
                                  ? "border-[#C9A84C] border-2 shadow-sm"
                                  : "border-[#E8D5A3]/40"
                              }`
                            : "bg-[#6F4E37] text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-[10px] uppercase tracking-widest opacity-70">
                            {isAdmin ? "Sanwariyas Team" : "You"}
                          </p>
                          {isAdmin &&
                            isUnreadAdminReply &&
                            index === inquiry.replies.length - 1 && (
                              <span className="bg-[#C9A84C] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                                NEW
                              </span>
                            )}
                        </div>
                        <p className="whitespace-pre-wrap">{reply.message}</p>
                        <p className="text-[10px] opacity-50 mt-2">
                          {new Date(reply.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-[#E8D5A3]/40 p-6">
            <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
              Send a Reply
            </h3>

            {flash && (
              <p
                className={`mb-4 text-xs font-sans p-3 border rounded ${
                  flash.toLowerCase().includes("failed")
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-green-50 text-green-700 border-green-200"
                }`}
              >
                {flash}
              </p>
            )}

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full p-4 border border-[#E8D5A3]/60 rounded-lg focus:outline-none focus:border-[#6F4E37] font-sans text-sm resize-none mb-4"
            />

            <button
              onClick={handleSendReply}
              disabled={sending || !replyText.trim()}
              className="px-6 py-3 bg-[#6F4E37] text-white font-sans text-[10px] tracking-[0.2em] uppercase rounded-lg hover:bg-[#574325] disabled:opacity-50 transition-colors"
            >
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
