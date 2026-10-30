// FILE: client/src/components/admin/AdminShell.js
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Toast from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import NotificationBell from "@/components/ui/NotificationBell";
import { AdminDashboardContext } from "@/components/admin/AdminDashboardContext";
import { ADMIN_ROUTES } from "@/lib/adminRoutes";

const NAV_ITEMS = [
  {
    href: ADMIN_ROUTES.overview,
    label: "Overview",
    title: "Dashboard Overview",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  // {
  //   href: ADMIN_ROUTES.products,
  //   label: "Products",
  //   title: "Products Dashboard",
  //   icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  // },
  {
    href: ADMIN_ROUTES.blogs,
    label: "Blogs",
    title: "Blogs Dashboard",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    href: ADMIN_ROUTES.lookbook,
    label: "Lookbook",
    title: "Lookbook Dashboard",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    href: ADMIN_ROUTES.inquiries,
    label: "Inquiries",
    title: "Inquiries Dashboard",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  // {  
  //   href: ADMIN_ROUTES.orders,
  //   label: "Orders",
  //   title: "Orders Dashboard",
  //   icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  // },
];

// The overview route must match exactly, otherwise it would be "active" on every
// section. Section routes also match their sub-paths.
const isActivePath = (pathname, href) =>
  href === ADMIN_ROUTES.overview
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { token, user, logout } = useAuth();

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [countdown, setCountdown] = useState(60);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [desktopSidebar, setDesktopSidebar] = useState(true); // Desktop

  // Stable identities: section pages list showToast in effect deps, so a new
  // function on every render would re-run those effects.
  const showToast = useCallback(
    (message, type = "success") => setToast({ isVisible: true, message, type }),
    [],
  );
  const hideToast = useCallback(
    () => setToast((t) => ({ ...t, isVisible: false })),
    [],
  );

  // The shell lives in the (dashboard) layout, so it stays mounted while the admin
  // moves between sections. That means exactly one countdown interval, one
  // global_60s_sync listener, and one NotificationBell (the dispatcher of that event).
  useEffect(() => {
    if (!token) return;

    const tick = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    const handleSync = () => setCountdown(60);

    window.addEventListener("global_60s_sync", handleSync);
    return () => {
      clearInterval(tick);
      window.removeEventListener("global_60s_sync", handleSync);
    };
  }, [token]);

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.replace("/login");
  };

  const activeItem =
    NAV_ITEMS.find((item) => isActivePath(pathname, item.href)) || NAV_ITEMS[0];

  const contextValue = useMemo(
    () => ({ countdown, showToast }),
    [countdown, showToast],
  );

  return (
    <AdminDashboardContext.Provider value={contextValue}>
      <div className="flex min-h-screen bg-[#FAF3E8] font-sans">
        <ConfirmDialog
          open={showLogoutConfirm}
          title="Log out?"
          message="Are you sure you want to log out of your account?"
          confirmLabel="Log out"
          cancelLabel="Stay logged in"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
        <Toast
          isVisible={toast.isVisible}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-[#3E1E13]/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}

        {/* ── LEFT SIDEBAR ── */}
        <aside
          className={`
            bg-[#EBDCCB] border-r border-[#BE6E5B]/20 text-[#5C3120] flex flex-col transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none z-40
            fixed inset-y-0 left-0
            lg:sticky lg:self-start lg:top-0 lg:h-screen
            ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0"}
            ${desktopSidebar ? "lg:w-64" : "lg:w-0 lg:overflow-hidden lg:opacity-0 lg:border-none"}
          `}
        >
          <div className="w-64 flex flex-col h-full overflow-hidden">
            <div className="shrink-0 flex items-center justify-between p-6 border-b border-[#BE6E5B]/15">
              <h1 className="text-xl font-display font-bold tracking-widest text-[#7A3D2A]">
                SANWARIYAS
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-[#7A3D2A]/70 hover:text-[#7A3D2A]"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="shrink-0 px-6 py-6 border-b border-[#BE6E5B]/15">
              <p className="text-[15px] font-bold tracking-wide text-[#7A3D2A]">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-[#BE6E5B] mt-1 font-bold tracking-wider uppercase">
                Role: {user?.role || "admin"}
              </p>
            </div>

            <nav
              className="flex-1 min-h-0 overflow-y-auto space-y-1 py-4"
              aria-label="Dashboard sections"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 w-full text-left px-6 py-3.5 text-sm font-bold transition-all duration-200 border-l-4 ${
                      isActive
                        ? "bg-[#FDF7F2] border-[#BE6E5B] text-[#7A3D2A] shadow-sm"
                        : "border-transparent text-[#7A3D2A]/80 hover:bg-[#FDF7F2]/50 hover:text-[#7A3D2A]"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="shrink-0 p-6 pb-8 border-t border-[#BE6E5B]/10">
              <button
                onClick={handleLogout}
                className="w-full px-6 py-2.5 text-sm font-bold text-[#7A3D2A] border border-[#7A3D2A]/30 rounded-lg hover:bg-[#7A3D2A] hover:text-[#FDF7F2] transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN CONTENT AREA ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF3E8]">
          <header className="bg-white border-b border-[#BE6E5B]/15 flex items-center justify-between px-4 sm:px-8 py-4 shrink-0 shadow-sm z-30 sticky top-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#7A3D2A] hover:bg-[#BE6E5B]/10 p-1.5 rounded-lg focus:outline-none transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <button
                onClick={() => setDesktopSidebar(!desktopSidebar)}
                className="hidden lg:block text-[#7A3D2A] hover:bg-[#BE6E5B]/10 p-1.5 rounded-lg focus:outline-none transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#BE6E5B] hidden sm:block tracking-widest uppercase">
                Live Sync: {countdown}s
              </span>
              <NotificationBell showMuteToggle={true} />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-8" id="main-content">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-3xl font-display font-bold text-[#5C3120] tracking-wide">
                {activeItem.title}
              </h2>
            </div>

            {children}
          </main>
        </div>
      </div>
    </AdminDashboardContext.Provider>
  );
}
