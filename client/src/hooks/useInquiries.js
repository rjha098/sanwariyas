import { useState, useEffect } from 'react';
import { fetchAdminInquiries, updateAdminInquiryStatus } from '@/lib/api';

export function useInquiries(token) {
  const [inquiries, setInquiries] = useState([]);
  const [inquiryPagination, setInquiryPagination] = useState({});
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryFilter, setInquiryFilter] = useState('');
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');

  const setFlash = (setter, message) => {
    setter(message);
    window.setTimeout(() => setter(''), 4000);
  };

  const loadInquiries = async (authToken, page = inquiryPage, status = inquiryFilter) => {
    if (!authToken) return;
    setInquiriesLoading(true);
    try {
      const data = await fetchAdminInquiries(authToken, { status: status || undefined, page, limit: 15 });
      setInquiries(data.inquiries || []);
      setInquiryPagination(data.pagination || {});
    } catch (error) {
      setFlash(setInquiryMessage, error.response?.data?.message || 'Unable to load inquiries');
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setInquiries([]);
      setInquiryPage(1);
      return;
    }
    loadInquiries(token, inquiryPage, inquiryFilter);
  }, [token, inquiryPage, inquiryFilter]);

  const handleInquiryStatus = async (id, status) => {
    if (!token) return;
    try {
      await updateAdminInquiryStatus(token, id, { status });
      setFlash(setInquiryMessage, `Inquiry marked as ${status}`);
      await loadInquiries(token, inquiryPage, inquiryFilter);
    } catch (error) {
      setFlash(setInquiryMessage, error.response?.data?.message || 'Unable to update inquiry');
    }
  };

  return {
    inquiries, inquiryPagination, inquiryPage, setInquiryPage, inquiryFilter, setInquiryFilter,
    inquiriesLoading, inquiryMessage, handleInquiryStatus
  };
}