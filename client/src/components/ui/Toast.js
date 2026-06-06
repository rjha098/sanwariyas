// FILE: client/src/components/ui/Toast.js
'use client';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => { onClose(); }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      role={type === 'success' ? 'status' : 'alert'}
      aria-live={type === 'success' ? 'polite' : 'assertive'}
      aria-atomic="true"
      className={`fixed top-8 right-8 z-[9999] flex items-center gap-4 px-6 py-4 min-w-[340px] max-w-sm rounded-xl border backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      } ${
        type === 'success'
          ? 'bg-[#FDF7F2]/95 border-[#BE6E5B]/20 text-[#5C3120]'
          : 'bg-[#FFF5F5]/95 border-[#8C3B3B]/20 text-[#8C3B3B]' // Enhanced deep crimson error
      }`}
    >
      {/* Top accent bar */}
      <div
        aria-hidden="true"
        className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl ${
          type === 'success'
            ? 'bg-gradient-to-r from-[#BE6E5B] to-[#7A3D2A]'
            : 'bg-gradient-to-r from-[#8C3B3B] to-[#A52A2A]'
        }`}
      />

      {/* Icon circle */}
      <div
        aria-hidden="true"
        className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border ${
          type === 'success'
            ? 'border-[#BE6E5B]/20 bg-[#BE6E5B]/10 text-[#7A3D2A]'
            : 'border-[#8C3B3B]/20 bg-[#8C3B3B]/10 text-[#8C3B3B]'
        }`}
      >
        <span className="text-lg font-black leading-none">
          {type === 'success' ? '✓' : '⚠'}
        </span>
      </div>
      
      <p className="font-sans text-[13px] font-bold tracking-wide flex-1 leading-tight">
        {message}
      </p>
      
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-sm ${
          type === 'success'
            ? 'text-[#7A3D2A]/60 hover:text-[#7A3D2A] hover:bg-[#BE6E5B]/10'
            : 'text-[#8C3B3B]/60 hover:text-[#8C3B3B] hover:bg-[#8C3B3B]/10'
        }`}
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}