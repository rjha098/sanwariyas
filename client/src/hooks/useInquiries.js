// FILE: client/src/hooks/useInquiries.js
import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/api";

export function useInquiries(token, role = "admin") {
  const [inquiries, setInquiries] = useState([]);
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryFilter, setInquiryFilter] = useState("all");
  const [inquiryPagination, setInquiryPagination] = useState({
    pages: 0,
    total: 0,
  });

  const [inquiryStats, setInquiryStats] = useState({ pending: 0, resolved: 0 });

  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");

  const flashTimeout = useRef(null);

  // Memoized flash message handler to prevent memory leaks
  const setFlash = useCallback((message) => {
    if (flashTimeout.current) {
      clearTimeout(flashTimeout.current);
    }

    setInquiryMessage(message);

    flashTimeout.current = window.setTimeout(() => {
      setInquiryMessage("");
      flashTimeout.current = null;
    }, 4000);
  }, []);

  // Enterprise Optimization: Added 'isSilent' parameter for background polling
  const loadInquiries = useCallback(
    async (pageOverride, filterOverride, isSilent = false) => {
      if (!token) return;

      // If it is a background poll, DO NOT trigger the loading spinner UI
      if (!isSilent) setInquiriesLoading(true);

      try {
        const currentPage =
          pageOverride !== undefined ? pageOverride : inquiryPage;
        const currentFilter =
          filterOverride !== undefined ? filterOverride : inquiryFilter;

        let endpoint =
          role === "admin"
            ? `/inquiry?page=${currentPage}`
            : "/inquiry/my-inquiries";

        if (role === "admin" && currentFilter && currentFilter !== "all") {
          endpoint += `&status=${currentFilter}`;
        }

        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ FIX: Sort logic to bring the latest activity (new inquiry or new reply) to the TOP
        const rawInquiries = res.data.inquiries || [];

        const sortedInquiries = rawInquiries.sort((a, b) => {
          const aLatest = a.replies?.length
            ? new Date(a.replies[a.replies.length - 1].createdAt).getTime()
            : new Date(a.updatedAt || a.createdAt).getTime();

          const bLatest = b.replies?.length
            ? new Date(b.replies[b.replies.length - 1].createdAt).getTime()
            : new Date(b.updatedAt || b.createdAt).getTime();

          return bLatest - aLatest; // Descending order (Newest first)
        });

        setInquiries(sortedInquiries);

        if (res.data.pagination) {
          setInquiryPagination(res.data.pagination);
        }

        if (res.data.stats) {
          setInquiryStats(res.data.stats);
        }
      } catch (error) {
        setFlash(error.response?.data?.message || "Unable to load inquiries");
      } finally {
        if (!isSilent) setInquiriesLoading(false);
      }
    },
    [token, inquiryPage, inquiryFilter, role, setFlash],
  );

  // Fetch inquiries on mount or when dependencies change
  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const sendReply = useCallback(
    async (inquiryId, message) => {
      try {
        await api.post(
          `/inquiry/${inquiryId}/reply`,
          { message },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setFlash("Reply sent successfully.");
        // Pass true for 'isSilent' so the table doesn't flash a loading spinner after replying
        loadInquiries(undefined, undefined, true);
      } catch (error) {
        setFlash(error.response?.data?.message || "Failed to send reply.");
      }
    },
    [token, loadInquiries, setFlash],
  );

  const markAsViewed = useCallback(
    async (inquiryId) => {
      try {
        await api.patch(
          `/inquiry/${inquiryId}/viewed`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        loadInquiries(undefined, undefined, true);
      } catch (error) {
        // console.error("Failed to mark as viewed", error);
      }
    },
    [token, loadInquiries],
  );

  const handleInquiryStatus = useCallback(
    async (inquiryId, status) => {
      try {
        await api.patch(
          `/inquiry/${inquiryId}/status`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setFlash(`Inquiry marked as ${status}.`);
        loadInquiries(undefined, undefined, true);
      } catch (error) {
        setFlash(error.response?.data?.message || "Failed to update status.");
      }
    },
    [token, loadInquiries, setFlash],
  );

  const deleteInquiry = useCallback(
    async (inquiryId) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this inquiry? This action cannot be undone.",
        )
      )
        return;

      try {
        await api.delete(`/inquiry/${inquiryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlash("Inquiry deleted successfully.");
        loadInquiries(undefined, undefined, true);
      } catch (error) {
        setFlash(error.response?.data?.message || "Failed to delete inquiry.");
      }
    },
    [token, loadInquiries, setFlash],
  );

  // Clean up the timeout if the component unmounts

  useEffect(() => {
    return () => {
      if (flashTimeout.current) {
        clearTimeout(flashTimeout.current);
      }
    };
  }, []);

  return {
    inquiries,
    inquiryPage,
    setInquiryPage,
    inquiryFilter,
    setInquiryFilter,
    inquiryPagination,
    inquiriesLoading,
    inquiryMessage,
    loadInquiries,
    sendReply,
    deleteInquiry,
    markAsViewed,
    handleInquiryStatus,
    inquiryStats,
  };
}
