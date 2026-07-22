// FILE: client/src/components/admin/AdminHeader.js
"use client";

import NotificationBell from "@/components/ui/NotificationBell";

export default function AdminHeader({
  admin,
  activeTab,
  setActiveTab,
  handleLogout,
  countdown,
}) {
  return (
    <header className="bg-white border-b border-brand-lightgold/40 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-4">
            <span className="font-display text-xl text-brand-african">
              SANWARIYAS
            </span>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-brand-mud bg-brand-cream px-2 py-1">
              Operations Center
            </span>
          </div>

          {/* Right side only — notification + admin name + logout */}
          <div className="flex items-center gap-4">
            <NotificationBell showMuteToggle={true} />

            {admin && (
              <span className="font-sans text-xs text-brand-mud hidden sm:block">
                {admin.username || admin.email}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="font-sans text-xs tracking-[0.2em] uppercase text-brand-mud hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}