// FILE: client/src/app/my-inquiries/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
// import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const STATUS_MAP = {
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
};

export default function MyInquiriesPage() {
  const { token, isAuthenticated, authChecking } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecking, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;
    api
      .get("/inquiry/my-inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInquiries(res.data.inquiries || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

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

  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen bg-[#FAF3E8] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/*  Back to Dashboard button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-6 font-sans text-[10px] tracking-widest uppercase text-[#70543E] hover:text-[#574325] border-b border-[#70543E] pb-1 transition-colors"
          >
            ← Back to Dashboard
          </button>

          <h1 className="font-display text-3xl text-[#574325] mb-8">
            My Inquiries
          </h1>

          {inquiries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-[#E8D5A3]/40">
              <p className="font-sans text-sm text-[#a07f61]">
                No inquiries yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => {
                const status = STATUS_MAP[inq.status] || {
                  label: inq.status,
                  cls: "bg-gray-50 text-gray-600 border-gray-200",
                };
                const hasUnread =
                  !inq.isViewedByUser && inq.replies?.length > 0;

                return (
                  <div
                    key={inq._id}
                    onClick={() => router.push(`/my-inquiries/${inq._id}`)}
                    className={`cursor-pointer bg-white rounded-xl border p-5 hover:shadow-md transition-all ${
                      hasUnread
                        ? "border-[#C9A84C] bg-[#FEF9F0]"
                        : "border-[#E8D5A3]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {hasUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#C9A84C] flex-shrink-0 animate-pulse" />
                          )}
                          <h3 className="font-sans font-semibold text-[#574325] text-sm flex items-center gap-2">
                            {inq.productCategory ||
                              inq.productName ||
                              "General Inquiry"}
                            {hasUnread && (
                              <span className="text-[8px] bg-[#C9A84C] text-white px-1.5 py-0.5 rounded-full font-sans font-bold tracking-[0.1em] shadow-sm flex-shrink-0">
                                NEW
                              </span>
                            )}
                          </h3>
                        </div>
                        <p className="font-sans text-xs text-[#70543E]/70 line-clamp-2">
                          {inq.message}
                        </p>
                        <p className="font-sans text-[10px] text-[#a07f61] mt-2">
                          {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border ${status.cls}`}
                        >
                          {status.label}
                        </span>
                        {inq.replies?.length > 0 && (
                          <span className="font-sans text-[10px] text-[#6F4E37] bg-[#6F4E37]/10 px-2 py-0.5 rounded-full">
                            {inq.replies.length} replies
                          </span>
                        )}
                      </div>
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