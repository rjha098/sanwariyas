// FILE: client/src/components/admin/AdminThemeProvider.jsx
"use client";

import { useState, useEffect } from "react";

export default function AdminThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_dark_mode");
    if (savedTheme === "true") {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("admin_dark_mode", newMode);
  };

  return (
    <div className={`admin-wrapper min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900 text-gray-100" : "bg-[#f8f4ec] text-gray-900"}`}>
      
      {/* Floating Dark Mode Toggle Button */} 
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 rounded-full shadow-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
            darkMode 
              ? "bg-[#E8D5A3] text-gray-950 hover:bg-white" 
              : "bg-[#7A3D2A] text-white hover:bg-[#BE6E5B]"
          }`}
          aria-label="Toggle Admin Dark Mode"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Dark styling now lives in globals.css under ".admin-wrapper.dark" and
          covers the whole panel (sidebar, header, cards, tables, forms). */}
      <div>
        {children}
      </div>
    </div>
  );
}