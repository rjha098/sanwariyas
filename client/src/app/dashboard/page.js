// // FILE: client/src/app/dashboard/page.js
// 'use client';
// import { useState, useEffect } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { useInquiries } from '@/hooks/useInquiries';
// import { useRouter } from 'next/navigation';
// import { markNotificationsRead } from '@/lib/api';

// export default function UserDashboard() {
//   const { token, isAuthenticated, authChecking, logout } = useAuth();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('inquiries');
//   const { inquiries = [], inquiriesLoading } = useInquiries(token, 'customer');

//   useEffect(() => {
//     if (!authChecking && !isAuthenticated) router.push('/login');
//   }, [authChecking, isAuthenticated]);

//   useEffect(() => {
//   if (token && activeTab === 'responses') {
//     markNotificationsRead(token);
//   }
// }, [activeTab, token]);

//   if (authChecking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   return (
//     <main className="min-h-screen bg-[#FDF7F2] pt-32 pb-20 px-6">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
//         {/* Sidebar */}
//         <aside className="w-full md:w-64 flex flex-col gap-2">
//           <button onClick={() => setActiveTab('inquiries')} className={`p-4 text-left font-bold ${activeTab === 'inquiries' ? 'bg-[#7A3D2A] text-white' : 'bg-white'}`}>My Inquiries</button>
//           <button onClick={() => setActiveTab('responses')} className={`p-4 text-left font-bold ${activeTab === 'responses' ? 'bg-[#7A3D2A] text-white' : 'bg-white'}`}>Admin Responses</button>
//           <button onClick={logout} className="p-4 text-left text-red-600 font-bold bg-white mt-10">Logout</button>
//         </aside>

//         {/* Content */}
//         <section className="flex-1 bg-white p-8 rounded-lg shadow-sm border">
//           {activeTab === 'inquiries' ? (
//             <div>
//               <h2 className="text-2xl font-bold mb-6">Recent Inquiries</h2>
//               {inquiriesLoading ? (
//                 <p>Loading...</p>
//               ) : inquiries.length === 0 ? (
//                 <p className="text-gray-500 italic">No inquiries found. Submit a new inquiry to see it here.</p>
//               ) : (
//                 inquiries.map(i => (
//                   <div key={i._id} className="mb-4 p-4 border-b">
//                     {/* ✅ FIX: Added productCategory support */}
//                     <p className="font-bold">{i.productCategory || i.productName || 'General Inquiry'}</p>
//                     <p className="text-sm text-gray-600">{i.message}</p>
//                     <p className="text-xs text-[#BE6E5B] mt-1 font-bold uppercase tracking-widest">Status: {i.status}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           ) : (
//             <div>
//               <h2 className="text-2xl font-bold mb-6">Admin Responses</h2>
//               {inquiriesLoading ? (
//                 <p>Loading...</p>
//               ) : inquiries.filter(i => i.replies?.length > 0).length === 0 ? (
//                 <p className="text-gray-500 italic">No responses yet. Admin will reply soon.</p>
//               ) : (
//                 inquiries.filter(i => i.replies?.length > 0).map(i => (
//                   <div key={i._id} className="p-4 bg-green-50 mb-4 rounded border border-green-200">
//                     <p className="font-bold text-green-800">Regarding: {i.productCategory || i.productName || 'General Inquiry'}</p>
//                     {i.replies.map((r, idx) => (
//                       <p key={idx} className="text-sm mt-2 text-gray-800">- {r.message}</p>
//                     ))}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }





// FILE: client/src/app/dashboard/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Toast from '@/components/ui/Toast';

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  inquiry:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>,
  reply:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>,
  profile:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  orders:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  wishlist: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
  logout:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  bell:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  send:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  chevron:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M9 18l6-6-6-6"/></svg>,
  home:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  clock:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
};

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    contacted: { label: 'In Review', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    resolved:  { label: 'Resolved',  cls: 'bg-green-50 text-green-700 border-green-200' },
  };
  const { label, cls } = map[status] || { label: status, cls: 'bg-gray-50 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border ${cls}`}>
      {label}
    </span>
  );
}

// ── Inquiry Card ──────────────────────────────────────────────────────────────
function InquiryCard({ inquiry, onReply, onSelect, isSelected }) {
  const hasReplies = inquiry.replies?.length > 0;
  const adminReplies = inquiry.replies?.filter(r => r.role === 'admin' || r.role === 'staff') || [];
  const lastReply = adminReplies[adminReplies.length - 1];

  return (
    <div
      onClick={() => onSelect(inquiry)}
      className={`cursor-pointer rounded-xl border transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-[#6F4E37] shadow-md' : 'border-[#E8D5A3]/60 hover:border-[#6F4E37]/40'
      } ${!inquiry.isViewedByUser && hasReplies ? 'bg-[#FAF3E8]' : 'bg-white'}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!inquiry.isViewedByUser && hasReplies && (
                <span className="w-2 h-2 rounded-full bg-[#6F4E37] flex-shrink-0" />
              )}
              <h3 className="font-sans font-semibold text-[#574325] text-sm truncate">
                {inquiry.productCategory || inquiry.productName || 'General Inquiry'}
              </h3>
            </div>
            <p className="font-sans text-xs text-[#70543E]/70 line-clamp-2">{inquiry.message}</p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <StatusBadge status={inquiry.status} />
            {adminReplies.length > 0 && (
              <span className="font-sans text-[10px] text-[#6F4E37] font-semibold bg-[#6F4E37]/10 px-2 py-0.5 rounded-full">
                {adminReplies.length} {adminReplies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>
        </div>

        {lastReply && (
          <div className="mt-3 pt-3 border-t border-[#E8D5A3]/50">
            <p className="font-sans text-[11px] text-[#70543E]/60 mb-1 uppercase tracking-wider">Latest reply</p>
            <p className="font-sans text-xs text-[#574325] line-clamp-2 italic">"{lastReply.message}"</p>
          </div>
        )}

        <div className="flex items-center gap-1 mt-3 text-[#70543E]/50">
          <Icon.clock />
          <span className="font-sans text-[11px]">
            {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Inquiry Detail Panel ──────────────────────────────────────────────────────
function InquiryDetail({ inquiry, token, onClose, onRefresh }) {
  const [replyMsg, setReplyMsg] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  const handleSend = async () => {
    if (!replyMsg.trim()) return;
    setSending(true);
    try {
      await api.post(`/inquiry/${inquiry._id}/reply`,
        { message: replyMsg.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyMsg('');
      onRefresh();
    } catch (err) {
      console.error('Reply failed', err);
    } finally {
      setSending(false);
    }
  };

  // Mark as viewed
  useEffect(() => {
    if (inquiry && !inquiry.isViewedByUser) {
      api.patch(`/inquiry/${inquiry._id}/viewed`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => {});
    }
  }, [inquiry?._id]);

  const allMessages = [
    { role: 'customer', message: inquiry.message, createdAt: inquiry.createdAt, name: inquiry.name },
    ...(inquiry.replies || []),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="bg-white rounded-xl border border-[#E8D5A3]/60 flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E8D5A3]/50 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg text-[#574325]">
            {inquiry.productCategory || inquiry.productName || 'General Inquiry'}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={inquiry.status} />
            <span className="font-sans text-[11px] text-[#70543E]/50">
              {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-[#70543E]/40 hover:text-[#574325] transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Inquiry details */}
      <div className="px-6 py-3 bg-[#FAF3E8]/50 border-b border-[#E8D5A3]/30 grid grid-cols-2 gap-2 text-xs font-sans">
        <span><span className="text-[#70543E]/50 uppercase tracking-wider text-[10px]">Qty: </span><span className="text-[#574325] font-semibold">{inquiry.quantity} pcs</span></span>
        <span><span className="text-[#70543E]/50 uppercase tracking-wider text-[10px]">Budget: </span><span className="text-[#574325] font-semibold">{inquiry.budgetRange || 'Not specified'}</span></span>
        <span><span className="text-[#70543E]/50 uppercase tracking-wider text-[10px]">Country: </span><span className="text-[#574325] font-semibold">{inquiry.country}</span></span>
        <span><span className="text-[#70543E]/50 uppercase tracking-wider text-[10px]">WhatsApp: </span><span className="text-[#574325] font-semibold">{inquiry.whatsapp}</span></span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {allMessages.map((msg, idx) => {
          const isAdmin = msg.role === 'admin' || msg.role === 'staff';
          return (
            <div key={idx} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${isAdmin ? 'order-2' : 'order-1'}`}>
                <div className={`px-4 py-3 rounded-2xl font-sans text-sm leading-relaxed ${
                  isAdmin
                    ? 'bg-[#FAF3E8] text-[#574325] rounded-tl-sm border border-[#E8D5A3]/60'
                    : 'bg-[#6F4E37] text-white rounded-tr-sm'
                }`}>
                  {msg.message}
                </div>
                <p className={`font-sans text-[10px] text-[#70543E]/40 mt-1 ${isAdmin ? 'text-left' : 'text-right'}`}>
                  {isAdmin ? 'Sanwariyas Team' : 'You'} · {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply input */}
      <div className="px-6 py-4 border-t border-[#E8D5A3]/50">
        <div className="flex gap-3">
          <textarea
            value={replyMsg}
            onChange={(e) => setReplyMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 border border-[#E8D5A3]/60 rounded-lg px-3 py-2 font-sans text-sm text-[#574325] placeholder-[#70543E]/30 focus:outline-none focus:border-[#6F4E37] resize-none"
          />
          <button
            onClick={handleSend}
            disabled={sending || !replyMsg.trim()}
            className="flex-shrink-0 w-10 h-10 self-end bg-[#6F4E37] text-white rounded-lg flex items-center justify-center hover:bg-[#574325] transition-colors disabled:opacity-40"
          >
            <Icon.send />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Coming Soon Block ─────────────────────────────────────────────────────────
function ComingSoon({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[#E8D5A3]/30 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" className="w-8 h-8">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <h3 className="font-display text-xl text-[#574325] mb-2">{title}</h3>
      <p className="font-sans text-sm text-[#70543E]/60 max-w-xs">{description}</p>
      <span className="mt-4 inline-block px-4 py-1.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] font-sans text-xs font-semibold tracking-widest uppercase border border-[#C9A84C]/20">
        Coming Soon
      </span>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const { token, user, isAuthenticated, authChecking, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (message, type = 'success') => setToast({ isVisible: true, message, type });
  const hideToast = () => setToast(t => ({ ...t, isVisible: false }));

  useEffect(() => {
    if (!authChecking && !isAuthenticated) router.replace('/login');
  }, [authChecking, isAuthenticated]);

  const loadInquiries = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get('/inquiry/my-inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      showToast('Failed to load inquiries.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadInquiries();
  }, [token]);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'success');
    setTimeout(() => router.replace('/login'), 1500);
  };

  const unreadCount = inquiries.filter(i => !i.isViewedByUser && i.replies?.some(r => r.role === 'admin' || r.role === 'staff')).length;
  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const resolvedCount = inquiries.filter(i => i.status === 'resolved').length;

  const navItems = [
    { key: 'inquiries', label: 'My Inquiries', icon: <Icon.inquiry />, badge: unreadCount },
    { key: 'profile',   label: 'My Profile',   icon: <Icon.profile /> },
    { key: 'orders',    label: 'Order History', icon: <Icon.orders />,  soon: true },
    { key: 'wishlist',  label: 'Saved Items',   icon: <Icon.wishlist />, soon: true },
  ];

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="min-h-screen bg-[#FAF3E8]">
        {/* Top bar */}
        <div className="bg-white border-b border-[#E8D5A3]/60 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(o => !o)}
                className="lg:hidden text-[#70543E] p-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <div>
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]">Sanwariyas</p>
                <p className="font-display text-sm text-[#574325]">My Account</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="relative text-[#70543E] hover:text-[#574325] transition-colors"
                >
                  <Icon.bell />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#6F4E37] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                </button>
              )}
              <button onClick={() => router.push('/')} className="text-[#70543E] hover:text-[#574325] transition-colors">
                <Icon.home />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#6F4E37] flex items-center justify-center">
                <span className="font-sans text-white text-xs font-semibold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">

          {/* Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E8D5A3]/60 transform transition-transform lg:static lg:translate-x-0 lg:h-auto lg:z-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* User info */}
            <div className="p-6 border-b border-[#E8D5A3]/40 mt-16 lg:mt-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#6F4E37] flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-white text-lg">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-semibold text-[#574325] truncate">{user?.name || 'Customer'}</p>
                  <p className="font-sans text-[11px] text-[#70543E]/60 truncate">{user?.email || ''}</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: 'Total', value: inquiries.length },
                  { label: 'Pending', value: pendingCount },
                  { label: 'Done', value: resolvedCount },
                ].map(s => (
                  <div key={s.label} className="text-center bg-[#FAF3E8] rounded-lg py-2">
                    <p className="font-display text-lg text-[#574325]">{s.value}</p>
                    <p className="font-sans text-[10px] text-[#70543E]/50 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <nav className="p-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm transition-all duration-150 ${
                    activeTab === item.key
                      ? 'bg-[#6F4E37] text-white shadow-sm'
                      : 'text-[#70543E] hover:bg-[#FAF3E8] hover:text-[#574325]'
                  }`}
                >
                  <span className={activeTab === item.key ? 'text-white' : 'text-[#C9A84C]'}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="w-5 h-5 bg-white text-[#6F4E37] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {item.soon && (
                    <span className="font-sans text-[9px] uppercase tracking-wider bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-[#E8D5A3]/40 absolute bottom-0 w-full lg:static">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Icon.logout />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* Inquiries Tab */}
            {activeTab === 'inquiries' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-display text-2xl text-[#574325]">My Inquiries</h1>
                    <p className="font-sans text-xs text-[#70543E]/60 mt-0.5">
                      {inquiries.length} total · {unreadCount} unread {unreadCount > 0 ? '🔔' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/inquire')}
                    className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-5 py-2.5 hover:bg-[#574325] transition-colors rounded-lg"
                  >
                    + New Inquiry
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-28 bg-white rounded-xl border border-[#E8D5A3]/40 animate-pulse" />
                    ))}
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#E8D5A3]/60 py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#FAF3E8] flex items-center justify-center mx-auto mb-4">
                      <Icon.inquiry />
                    </div>
                    <h3 className="font-display text-xl text-[#574325] mb-2">No inquiries yet</h3>
                    <p className="font-sans text-sm text-[#70543E]/60 mb-6">Submit your first wholesale inquiry to get started.</p>
                    <button
                      onClick={() => router.push('/inquire')}
                      className="font-sans text-xs tracking-[0.2em] uppercase bg-[#6F4E37] text-white px-6 py-3 hover:bg-[#574325] transition-colors rounded-lg"
                    >
                      Submit Inquiry
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-4 ${selectedInquiry ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="space-y-3">
                      {inquiries.map(inq => (
                        <InquiryCard
                          key={inq._id}
                          inquiry={inq}
                          onSelect={(i) => setSelectedInquiry(prev => prev?._id === i._id ? null : i)}
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
                            // update selected inquiry from fresh data
                            api.get('/inquiry/my-inquiries', { headers: { Authorization: `Bearer ${token}` } })
                              .then(r => {
                                const fresh = (r.data.inquiries || []).find(i => i._id === selectedInquiry._id);
                                if (fresh) setSelectedInquiry(fresh);
                              }).catch(() => {});
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h1 className="font-display text-2xl text-[#574325] mb-6">My Profile</h1>
                <div className="bg-white rounded-xl border border-[#E8D5A3]/60 p-6 space-y-5">
                  {[
                    { label: 'Full Name',    value: user?.name },
                    { label: 'Email',        value: user?.email },
                    { label: 'Phone',        value: user?.phone || '—' },
                    { label: 'Company',      value: user?.company || '—' },
                    { label: 'Country',      value: user?.country || '—' },
                    { label: 'Account Type', value: 'Wholesale Customer' },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-4 py-3 border-b border-[#E8D5A3]/30 last:border-0">
                      <span className="font-sans text-[11px] uppercase tracking-widest text-[#70543E]/50 w-28 flex-shrink-0">{f.label}</span>
                      <span className="font-sans text-sm text-[#574325] font-medium">{f.value}</span>
                    </div>
                  ))}
                  <p className="font-sans text-[11px] text-[#70543E]/40 pt-2">Profile editing — coming soon.</p>
                </div>
              </div>
            )}

            {/* Coming Soon Tabs */}
            {activeTab === 'orders' && (
              <div>
                <h1 className="font-display text-2xl text-[#574325] mb-6">Order History</h1>
                <div className="bg-white rounded-xl border border-[#E8D5A3]/60">
                  <ComingSoon title="Order Tracking" description="Track your wholesale orders, delivery status, and invoices — all in one place." />
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h1 className="font-display text-2xl text-[#574325] mb-6">Saved Items</h1>
                <div className="bg-white rounded-xl border border-[#E8D5A3]/60">
                  <ComingSoon title="Saved Collections" description="Save your favourite products and collections for quick access and future orders." />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}