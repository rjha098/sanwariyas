// FILE: client/src/hooks/useInquiries.js
import { useState, useEffect } from 'react';
import api from '@/lib/api'; 

export function useInquiries(token, role = 'admin') {
  
  const [inquiries, setInquiries] = useState([]);
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryFilter, setInquiryFilter] = useState('all'); 
  const [inquiryPagination, setInquiryPagination] = useState({ pages: 0, total: 0 });
  
  const [inquiryStats, setInquiryStats] = useState({ pending: 0, resolved: 0 });
  
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');

  const setFlash = (message) => {
    setInquiryMessage(message);
    window.setTimeout(() => setInquiryMessage(''), 4000);
  };

  const loadInquiries = async () => {
    if (!token) return; 
    setInquiriesLoading(true);
    
    try {
      let endpoint = role === 'admin' ? `/inquiry?page=${inquiryPage}` : '/inquiry/my-inquiries';
      
      if (role === 'admin' && inquiryFilter && inquiryFilter !== 'all') {
        endpoint += `&status=${inquiryFilter}`;
      }

      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInquiries(res.data.inquiries || []);
      
      if (res.data.pagination) {
        setInquiryPagination(res.data.pagination);
      }

      if (res.data.stats) {
        setInquiryStats(res.data.stats);
      }

    } catch (error) {
      setFlash(error.response?.data?.message || 'Unable to load inquiries');
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [token, inquiryPage, inquiryFilter, role]);

  const sendReply = async (inquiryId, message) => {
    try {
      await api.post(`/inquiry/${inquiryId}/reply`, { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFlash('Reply sent successfully.');
      loadInquiries(); 
    } catch (error) {
      setFlash(error.response?.data?.message || 'Failed to send reply.');
    }
  };

  const markAsViewed = async (inquiryId) => {
    try {
      await api.patch(`/inquiry/${inquiryId}/viewed`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadInquiries(); 
    } catch (error) {
      console.error('Failed to mark as viewed', error);
    }
  };

  const handleInquiryStatus = async (inquiryId, status) => {
    try {
      await api.patch(`/inquiry/${inquiryId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFlash(`Inquiry marked as ${status}.`);
      loadInquiries();
    } catch (error) {
      setFlash(error.response?.data?.message || 'Failed to update status.');
    }
  };

  const deleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/inquiry/${inquiryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFlash('Inquiry deleted successfully.');
      loadInquiries(); 
    } catch (error) {
      setFlash(error.response?.data?.message || 'Failed to delete inquiry.');
    }
  };
  
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
    inquiryStats 
  };
}