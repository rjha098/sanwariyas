// FILE: client/src/app/operations-center/(dashboard)/inquiries/page.js
"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useInquiries } from "@/hooks/useInquiries";
import { useAdminDashboard } from "@/components/admin/AdminDashboardContext";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import InquiryTable from "@/components/admin/InquiryTable";
import {
  buildInquiryListHref,
  parseInquiryStatus,
  parseListPage,
} from "@/lib/adminRoutes";

const isErrorMessage = (msg) => {
  const m = msg.toLowerCase();
  return m.includes("unable") || m.includes("error") || m.includes("failed");
};

function InquiriesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { showToast } = useAdminDashboard();

  const urlStatus = parseInquiryStatus(searchParams.get("status"));
  const urlPage = parseListPage(searchParams.get("page"));
  const idParam = searchParams.get("id");

  // Filter/page start from the URL, so a refresh or a Back from a detail page
  // restores the exact list state with a single initial fetch.
  const {
    inquiries,
    inquiryPagination,
    inquiryPage,
    setInquiryPage,
    inquiryFilter,
    setInquiryFilter,
    inquiriesLoading,
    inquiryMessage,
    handleInquiryStatus,
    deleteInquiry,
    markAsViewed,
    loadInquiries,
    exportInquiries,
    exporting,
  } = useInquiries(token, "admin", { page: urlPage, filter: urlStatus });

  // Latest filter state, tracked in a ref so several setter calls in the same tick
  // (InquiryTable calls setFilter then setPage(1)) produce ONE consistent URL update.
  const paramsRef = useRef({ status: urlStatus, page: urlPage });

  const writeUrl = useCallback(
    (status, page) => {
      paramsRef.current = { status, page };
      router.replace(buildInquiryListHref({ status, page }), { scroll: false });
    },
    [router],
  );

  // Changing the filter always resets to page 1 (same as the old behaviour), in one
  // state update and one URL update.
  const handleSetFilter = useCallback(
    (status) => {
      const next = parseInquiryStatus(status);
      setInquiryFilter(next);
      setInquiryPage(1);
      writeUrl(next, 1);
    },
    [setInquiryFilter, setInquiryPage, writeUrl],
  );

  const handleSetPage = useCallback(
    (pageOrUpdater) => {
      // Pagination may pass a number or an updater function; resolve it first.
      const requested =
        typeof pageOrUpdater === "function"
          ? pageOrUpdater(paramsRef.current.page)
          : pageOrUpdater;
      const next = parseListPage(requested);
      // InquiryTable calls setInquiryPage(1) right after the filter change; the
      // filter handler already handled it, so skip the duplicate.
      if (next === paramsRef.current.page) return;
      setInquiryPage(next);
      writeUrl(paramsRef.current.status, next);
    },
    [setInquiryPage, writeUrl],
  );

  // URL -> state for changes we did not make ourselves (sidebar click on
  // "Inquiries" while a filter is active, browser Back/Forward).
  useEffect(() => {
    if (
      urlStatus === paramsRef.current.status &&
      urlPage === paramsRef.current.page
    ) {
      return;
    }
    paramsRef.current = { status: urlStatus, page: urlPage };
    setInquiryFilter(urlStatus);
    setInquiryPage(urlPage);
  }, [urlStatus, urlPage, setInquiryFilter, setInquiryPage]);

  // Highlighted inquiry (?id=...). Cleared after 3s, as before. The id stays in the URL.
  const [highlightedInquiryId, setHighlightedInquiryId] = useState(null);
  useEffect(() => {
    if (!idParam) {
      setHighlightedInquiryId(null);
      return;
    }
    setHighlightedInquiryId(idParam);
    const timer = setTimeout(() => setHighlightedInquiryId(null), 3000);
    return () => clearTimeout(timer);
  }, [idParam]);

  // Background refresh on the shared 60s event. The ref avoids re-subscribing every
  // time page/filter change; the listener is registered once and removed on unmount.
  const refreshRef = useRef(null);
  useEffect(() => {
    refreshRef.current = () => loadInquiries(inquiryPage, inquiryFilter, true);
  });
  useEffect(() => {
    if (!token) return;
    const handleSync = () => refreshRef.current?.();
    window.addEventListener("global_60s_sync", handleSync);
    return () => window.removeEventListener("global_60s_sync", handleSync);
  }, [token]);

  useEffect(() => {
    if (!inquiryMessage) return;
    showToast(
      inquiryMessage,
      isErrorMessage(inquiryMessage) ? "error" : "success",
    );
  }, [inquiryMessage, showToast]);

  return (
    <AdminSectionCard>
      <section aria-label="Inquiries Management">
        <InquiryTable
          inquiries={inquiries}
          inquiriesLoading={inquiriesLoading}
          inquiryPagination={inquiryPagination}
          inquiryPage={inquiryPage}
          setInquiryPage={handleSetPage}
          inquiryFilter={inquiryFilter}
          setInquiryFilter={handleSetFilter}
          inquiryMessage={inquiryMessage}
          handleInquiryStatus={handleInquiryStatus}
          deleteInquiry={deleteInquiry}
          markAsViewed={markAsViewed}
          exportInquiries={exportInquiries}
          exporting={exporting}
          highlightedInquiryId={highlightedInquiryId}
        />
      </section>
    </AdminSectionCard>
  );
}

export default function InquiriesPage() {
  // useSearchParams requires a Suspense boundary for production builds.
  return (
    <Suspense
      fallback={
        <p className="py-16 text-center font-sans text-sm text-[#7A3D2A] font-bold animate-pulse">
          Loading Inquiries...
        </p>
      }
    >
      <InquiriesContent />
    </Suspense>
  );
}
