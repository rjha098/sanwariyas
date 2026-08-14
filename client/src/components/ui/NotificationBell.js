 "use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api, {
  fetchUnreadCount,
  fetchNotifications,
  markNotificationsRead,
  clearReadNotifications,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

// Soft "Ting" Sound generator (No external MP3 file needed)
const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch ting
    gain.gain.setValueAtTime(0.1, ctx.currentTime); // Volume
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // console.error("Audio play error:", e);
  }
};

export default function NotificationBell({ showMuteToggle = false }) {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const dropdownRef = useRef(null);
  const prevCountRef = useRef(0);

  // Load mute preference on mount
  useEffect(() => {
    const muted = localStorage.getItem("admin_muted") === "true";
    setIsMuted(muted);
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("admin_muted", newMuted);
  };

  const loadNotifications = async () => {
    if (!token) return;
    try {
      api.post("/auth/heartbeat", {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});

      const countRes = await fetchUnreadCount(token);
      const newCount = countRes.count || 0;

      //  Play Sound ONLY if new notification comes and NOT muted
      if (newCount > prevCountRef.current && !isMuted) {
        playBeep();
      }
      
      prevCountRef.current = newCount;
      setCount(newCount);

      const notifRes = await fetchNotifications(token);
      setNotifications(notifRes.notifications || []);
    } catch (err) {
      if (err.response && err.response.status === 429) return;
      // console.error(err);
    }
  };

  //  GLOBAL 60s SYNC TIMER
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
      window.dispatchEvent(new Event("global_60s_sync"));
    }, 60000);

    return () => clearInterval(interval);
  }, [token, isAuthenticated, isMuted]);

  //  Instantly set offline on Tab Close / Hide
  useEffect(() => {
    if (!token) return;

    const handleSetOffline = () => {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, "")}/api`;

      fetch(`${API_URL}/auth/offline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      }).catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleSetOffline(); 
      } else {
        api.post("/auth/heartbeat", {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleSetOffline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleSetOffline);
    };
  }, [token]);

  // Custom Event Listener to sync Bell instantly without page reload
  useEffect(() => {
    const handleUpdate = () => loadNotifications();
    window.addEventListener("notifications_read", handleUpdate);
    return () => window.removeEventListener("notifications_read", handleUpdate);
  }, [token]);

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
        prevCountRef.current = 0;
      } catch (err) {
        // console.error(err);
      }
    }
  };

  const handleNotificationClick = (n) => {
    setOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  };

  const handleClearAll = async () => {
    if (!token || notifications.length === 0) return;
    try {
      await markNotificationsRead(token);
      await clearReadNotifications(token);
      setNotifications([]);
      setCount(0);
      prevCountRef.current = 0;
    } catch (err) {
      // console.error("Failed to clear notifications:", err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      {/*  Admin Mute Toggle Button */}
      {showMuteToggle && (
        <button 
          onClick={toggleMute} 
          title={isMuted ? "Unmute Notifications" : "Mute Notifications"}
          className="text-[#A67C52] hover:text-[#7A3D2A] transition-colors p-1"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      )}

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
        <div className="absolute right-0 top-10 mt-3 w-80 bg-white border shadow-xl rounded-lg z-50 max-h-96 overflow-y-auto">
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
            <ul className="list-none p-0 m-0" aria-label="Notification list">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3 border-b transition-colors ${
                    n.link ? "cursor-pointer hover:bg-[#FAF3E8]" : "hover:bg-gray-50"
                  } ${!n.isRead ? "bg-[#FEF9F0] border-l-4 border-l-[#C9A84C]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {n.link && (
                      <span className="text-[#C9A84C] text-xs mt-1">→</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}