// // operationcenter\inquiries\\[id]\page.js

// 'use client';
// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/hooks/useAuth'; // ✅ FIX: Official Auth Hook import kiya
// import api from '@/lib/api';

// export default function InquiryDetailsPage() {
//   const params = useParams();
//   const router = useRouter();

//   // ✅ FIX: Token ab hook se aayega
//   const { token, isAuthenticated } = useAuth();

//   const [inquiry, setInquiry] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [replyText, setReplyText] = useState('');
//   const [sendingReply, setSendingReply] = useState(false);
//   const [flashMessage, setFlashMessage] = useState('');

//   const fetchInquiryDetails = async () => {
//     if (!token) return; // Wait for token
//     try {
//       const res = await api.get(`/inquiry/${params.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const fetchedInquiry = res.data.inquiry;
//       setInquiry(fetchedInquiry);

//       if (!fetchedInquiry.isViewedByAdmin) {
//         await api.patch(`/inquiry/${params.id}/viewed`, {}, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       }
//     } catch (error) {
//       console.error("Failed to load inquiry", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (params.id && token) {
//       fetchInquiryDetails();
//     }
//   }, [params.id, token]);

//   const handleSendReply = async () => {
//     if (!replyText.trim() || !token) return;
//     setSendingReply(true);
//     setFlashMessage('');

//     try {
//       await api.post(`/inquiry/${params.id}/reply`, { message: replyText }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setFlashMessage('Reply sent successfully!');
//       setReplyText('');
//       fetchInquiryDetails();

//       setTimeout(() => setFlashMessage(''), 3000);
//     } catch (error) {
//       setFlashMessage(error.response?.data?.message || 'Failed to send reply.');
//     } finally {
//       setSendingReply(false);
//     }
//   };

//   if (!isAuthenticated) return null;
//   if (loading) return <div className="p-10 text-center font-sans text-brand-mud animate-pulse">Loading inquiry details...</div>;
//   if (!inquiry) return <div className="p-10 text-center text-red-500 font-sans">Inquiry not found.</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 mt-10 bg-white border border-brand-lightgold/50 shadow-sm">
//       <button
//         onClick={() => router.back()}
//         className="mb-6 font-sans text-[10px] tracking-widest uppercase text-brand-mud hover:text-brand-coffee border-b border-brand-mud pb-1 transition-colors"
//       >
//         ← Back to Inquiries List
//       </button>

//       <div className="border-l-4 border-brand-gold pl-4 mb-8">
//         <h1 className="font-display text-3xl text-brand-african">{inquiry.companyName || inquiry.name}</h1>
//         <p className="font-sans text-xs uppercase tracking-widest text-brand-mud/70 mt-2">
//           Current Status: <span className="font-bold text-brand-coffee">{inquiry.status}</span>
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 font-sans">
//         <div className="bg-brand-parchment p-6">
//           <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-4">Contact Info</h3>
//           <p className="text-sm mb-2"><strong className="text-brand-african">Name:</strong> {inquiry.name}</p>
//           <p className="text-sm mb-2"><strong className="text-brand-african">Email:</strong> {inquiry.email}</p>
//           <p className="text-sm mb-2"><strong className="text-brand-african">WhatsApp:</strong> {inquiry.whatsapp}</p>
//           <p className="text-sm"><strong className="text-brand-african">Country:</strong> {inquiry.country}</p>
//         </div>

//         <div className="bg-brand-parchment p-6">
//           <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-4">Order Requirements</h3>
//           <p className="text-sm mb-2"><strong className="text-brand-african">Product:</strong> {inquiry.productName || 'General'}</p>
//           <p className="text-sm mb-2"><strong className="text-brand-african">Category:</strong> {inquiry.productCategory}</p>
//           <p className="text-sm mb-2"><strong className="text-brand-african">Quantity:</strong> {inquiry.quantity} pcs</p>
//           <p className="text-sm"><strong className="text-brand-african">Budget:</strong> {inquiry.budgetRange || 'Not specified'}</p>
//         </div>
//       </div>

//       <div className="mb-8">
//         <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-3 font-sans">Customer Message</h3>
//         <div className="bg-gray-50 p-6 border border-gray-100 font-sans text-sm leading-relaxed text-brand-mud whitespace-pre-wrap">
//           {inquiry.message}
//         </div>
//       </div>

//       {inquiry.replies && inquiry.replies.length > 0 && (
//         <div className="mb-8 border-t border-brand-lightgold/40 pt-8">
//           <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-6 font-sans">Conversation History</h3>
//           <div className="space-y-4">
//             {inquiry.replies.map((reply, index) => (
//               <div key={index} className={`flex ${reply.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`max-w-[80%] p-4 font-sans text-sm ${
//                   reply.role === 'admin'
//                     ? 'bg-brand-coffee text-brand-cream rounded-tl-xl rounded-tr-xl rounded-bl-xl'
//                     : 'bg-brand-parchment text-brand-african border border-brand-lightgold/40 rounded-tl-xl rounded-tr-xl rounded-br-xl'
//                 }`}>
//                   <p className="text-[10px] uppercase tracking-widest mb-2 opacity-70">
//                     {reply.role === 'admin' ? 'Sanwariyas Team' : inquiry.name}
//                   </p>
//                   <p className="whitespace-pre-wrap">{reply.message}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="border-t border-brand-lightgold/40 pt-8">
//         <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-3 font-sans">Send a Reply</h3>

//         {/* ✅ FIX: Error ke time Box Red aur Success ke time Green hoga */}
//         {flashMessage && (
//           <p className={`mb-4 text-xs font-sans p-3 border ${
//             flashMessage.toLowerCase().includes('failed') || flashMessage.toLowerCase().includes('error')
//               ? 'bg-red-50 text-red-700 border-red-200'
//               : 'bg-green-50 text-green-700 border-green-200'
//           }`}>
//             {flashMessage}
//           </p>
//         )}

//         <textarea
//           value={replyText}
//           onChange={(e) => setReplyText(e.target.value)}
//           placeholder="Type your reply to the customer here..."
//           rows={4}
//           className="w-full p-4 border border-brand-lightgold/60 focus:outline-none focus:border-brand-coffee font-sans text-sm resize-none mb-4"
//         />

//         <button
//           onClick={handleSendReply}
//           disabled={sendingReply || !replyText.trim()}
//           className="px-6 py-3 bg-brand-coffee text-brand-cream font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-brand-african disabled:opacity-50 transition-colors"
//         >
//           {sendingReply ? 'Sending...' : 'Send Reply'}
//         </button>
//       </div>
//     </div>
//   );
// }





// FILE: client/src/app/operations-center/inquiries/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // ✅ FIX: Official Auth Hook import kiya
import api from "@/lib/api";

export default function InquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ FIX: Token ab hook se aayega
  const { token, isAuthenticated } = useAuth();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  const fetchInquiryDetails = async () => {
    if (!token) return; // Wait for token
    try {
      const res = await api.get(`/inquiry/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedInquiry = res.data.inquiry;
      setInquiry(fetchedInquiry);

      if (!fetchedInquiry.isViewedByAdmin) {
        await api.patch(
          `/inquiry/${params.id}/viewed`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
    } catch (error) {
      console.error("Failed to load inquiry", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id && token) {
      fetchInquiryDetails();
    }
  }, [params.id, token]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !token) return;
    setSendingReply(true);
    setFlashMessage("");

    try {
      await api.post(
        `/inquiry/${params.id}/reply`,
        { message: replyText },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setFlashMessage("Reply sent successfully!");
      setReplyText("");
      fetchInquiryDetails();

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
      <>
        <div className="p-10 text-center font-sans text-brand-mud animate-pulse">
          Loading inquiry details...
        </div>
      </>
    );
  }

  if (!inquiry) {
    return (
      <>
        <div className="p-10 text-center text-red-500 font-sans">
          Inquiry not found.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white border border-brand-lightgold/50 shadow-sm">
        <button
          onClick={() => router.back()}
          className="mb-6 font-sans text-[10px] tracking-widest uppercase text-brand-mud hover:text-brand-coffee border-b border-brand-mud pb-1 transition-colors"
        >
          ← Back to Inquiries List
        </button>

        <div className="border-l-4 border-brand-gold pl-4 mb-8">
          <h1 className="font-display text-3xl text-brand-african">
            {inquiry.companyName || inquiry.name}
          </h1>
          <p className="font-sans text-xs uppercase tracking-widest text-brand-mud/70 mt-2">
            Current Status:{" "}
            <span className="font-bold text-brand-coffee">
              {inquiry.status}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 font-sans">
          <div className="bg-brand-parchment p-6">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-4">
              Contact Info
            </h3>
            <p className="text-sm mb-2">
              <strong className="text-brand-african">Name:</strong>{" "}
              {inquiry.name}
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
            <div className="space-y-4">
              {inquiry.replies.map((reply, index) => (
                <div
                  key={index}
                  className={`flex ${reply.role === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 font-sans text-sm ${
                      reply.role === "admin"
                        ? "bg-brand-coffee text-brand-cream rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                        : "bg-brand-parchment text-brand-african border border-brand-lightgold/40 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-widest mb-2 opacity-70">
                      {reply.role === "admin"
                        ? "Sanwariyas Team"
                        : inquiry.name}
                    </p>
                    <p className="whitespace-pre-wrap">{reply.message}</p>
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

          {/* ✅ FIX: Error ke time Box Red aur Success ke time Green hoga */}
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
    </>
  );
}
