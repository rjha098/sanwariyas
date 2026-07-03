// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import {
//   fetchUnreadCount,
//   fetchNotifications,
//   markNotificationsRead,
//   clearReadNotifications
// } from '@/lib/api';
// import { useAuth } from '@/hooks/useAuth';

// export default function NotificationBell() {
//   const { token, isAuthenticated } = useAuth();

//   const [open, setOpen] = useState(false);
//   const [count, setCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const dropdownRef = useRef(null);

//   const loadNotifications = async () => {
//     if (!token) return;

//     try {
//       const countRes = await fetchUnreadCount(token);
//       setCount(countRes.count || 0);

//       const notifRes = await fetchNotifications(token);
//       setNotifications(notifRes.notifications || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (!isAuthenticated || !token) return;

//     loadNotifications();

//     const interval = setInterval(loadNotifications, 15000);

//     return () => clearInterval(interval);
//   }, [token, isAuthenticated]);

//   // ✅ Click Outside: Ab ye sirf panel ko close karega, data delete NAI karega
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [open]);

//   const handleOpen = async () => {
//     const nextOpen = !open;
//     setOpen(nextOpen);

//     // Jab dropdown khule, toh unread count badge ko background mein read mark kar do
//     if (nextOpen && count > 0) {
//       try {
//         await markNotificationsRead(token);
//         setCount(0); // Badge instantly 0 ho jaye
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   // ✅ NEW FEATURE: Manual Clear All Button Function
//   const handleClearAll = async () => {
//     if (!token || notifications.length === 0) return;

//     try {
//       // 1. Pehle saari notifications ko read mark karo taaki clear-read API unhe detect kar sake
//       await markNotificationsRead(token);

//       // 2. Fir database se wipe-out (delete) kar do
//       await clearReadNotifications(token);

//       // 3. Frontend state ko instantly khali kar do
//       setNotifications([]);
//       setCount(0);
//     } catch (err) {
//       console.error("Failed to clear notifications:", err);
//     }
//   };

//   if (!isAuthenticated) return null;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={handleOpen}
//         className="relative flex items-center justify-center"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.8}
//           stroke="currentColor"
//           className="w-6 h-6 text-[#A67C52]"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0018 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 00-2.311 6.022 23.848 23.848 0 005.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
//           />
//         </svg>

//         {count > 0 && (
//           <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
//             {count}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-3 w-80 bg-white border shadow-xl rounded-lg z-50 max-h-96 overflow-y-auto">

//           {/* ✅ UI SECTION: Title + Manual Clear All Button */}
//           <div className="p-3 border-b flex justify-between items-center bg-[#FAF3E8]/30">
//             <span className="font-semibold text-sm text-[#574325]">Notifications</span>
//             {notifications.length > 0 && (
//               <button
//                 onClick={handleClearAll}
//                 className="text-[10px] font-bold text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider bg-red-50 hover:bg-red-100/50 px-2 py-1 rounded"
//               >
//                 Clear All
//               </button>
//             )}
//           </div>

//           {notifications.length === 0 ? (
//             <div className="p-4 text-sm text-gray-500 text-center italic">
//               No notifications
//             </div>
//           ) : (
//             notifications.map((n) => (
//               <div
//                 key={n._id}
//                 className="p-3 border-b hover:bg-gray-50 transition-colors"
//               >
//                 <p className="font-medium text-sm text-gray-900">
//                   {n.title}
//                 </p>

//                 <p className="text-xs text-gray-600 mt-1">
//                   {n.message}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



// FILE: client/src/components/ui/NotificationBell.js
"use client";

import { useEffect, useState, useRef } from "react";
import {
  fetchUnreadCount,
  fetchNotifications,
  markNotificationsRead,
  clearReadNotifications,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationBell() {
  const { token, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    if (!token) return;
    try {
      const countRes = await fetchUnreadCount(token);
      setCount(countRes.count || 0);
      const notifRes = await fetchNotifications(token);
      setNotifications(notifRes.notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [token, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && count > 0) {
      try {
        await markNotificationsRead(token);
        setCount(0);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClearAll = async () => {
    if (!token || notifications.length === 0) return;
    try {
      await markNotificationsRead(token);
      await clearReadNotifications(token);
      setNotifications([]);
      setCount(0);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ✅ SEO FIX: Added aria-expanded, aria-haspopup for semantic correctness */}
      <button
        onClick={handleOpen}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`${count} unread notifications. Toggle notification panel.`}
        className="relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#A67C52] rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-6 h-6 text-[#A67C52]"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0018 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 00-2.311 6.022 23.848 23.848 0 005.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold"
          >
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border shadow-xl rounded-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center bg-[#FAF3E8]/30">
            <span className="font-semibold text-sm text-[#574325]">
              Notifications
            </span>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                aria-label="Clear all notifications"
                className="text-[10px] font-bold text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider bg-red-50 hover:bg-red-100/50 px-2 py-1 rounded"
              >
                Clear All
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div
              role="status"
              aria-live="polite"
              className="p-4 text-sm text-gray-500 text-center italic"
            >
              No notifications
            </div>
          ) : (
            // ✅ SEO FIX: Semantic list structure for notification items
            <ul className="list-none p-0 m-0" aria-label="Notification list">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className="p-3 border-b hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-sm text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
