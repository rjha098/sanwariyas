// FILE: client/src/components/admin/AdminHeader.js
'use client';

import NotificationBell from '@/components/ui/NotificationBell';

export default function AdminHeader({ admin, activeTab, setActiveTab, handleLogout, countdown }) {
  const tabs = [
    // { id: 'products', label: 'Products' },
    { id: 'blogs', label: 'Blogs' },      
    { id: 'lookbook', label: 'Lookbook' },
    { id: 'inquiries', label: 'Inquiries' },
  ];

  return (
    <header className="bg-white border-b border-brand-lightgold/40 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <span className="font-display text-xl text-brand-african">SANWARIYAS</span>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-brand-mud bg-brand-cream px-2 py-1">
              Operations Center
            </span>
          </div>

          {/* Tabs */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Dashboard sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-sans text-xs tracking-[0.2em] uppercase transition-colors ${
                  activeTab === tab.id
                    ? 'text-brand-coffee border-b-2 border-brand-coffee'
                    : 'text-brand-mud hover:text-brand-coffee'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-4">
            {/* Live Timer shown only on inquiries tab */}
            {activeTab === 'inquiries' && (
              <span className="font-sans text-[10px] tracking-widest text-[#BE6E5B] font-semibold hidden sm:flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
                </svg>
                {countdown}s
              </span>
            )}
            
            <NotificationBell />
            
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

        {/* Mobile tabs */}
        <div className="flex md:hidden gap-1 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 font-sans text-[10px] tracking-[0.2em] uppercase transition-colors ${
                activeTab === tab.id
                  ? 'text-brand-coffee border-b-2 border-brand-coffee'
                  : 'text-brand-mud'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}



