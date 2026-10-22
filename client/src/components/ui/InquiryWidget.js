// FILE: client/src/components/ui/InquiryWidget.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Pages where the button would be redundant or in the way:
//  /contact  -> already the inquiry form
//  /dashboard, /checkout -> logged-in / payment screens
const HIDDEN_ON = ["/contact", "/dashboard", "/checkout"];

export default function InquiryWidget() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const hidden = HIDDEN_ON.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`),
  );
  if (hidden) return null;

  return (
    <aside
      role="complementary"
      aria-label="Send an inquiry"
      className="fixed
             bottom-[max(1rem,env(safe-area-inset-bottom))]
             md:bottom-[max(1.5rem,env(safe-area-inset-bottom))]
             left-4
             md:left-6
             z-50
             animate-fade-in
             group
             flex
             flex-col
             items-center
             gap-2
             pointer-events-none"
    >
      {/* "Get in Touch" label — standing (vertical) text, sits directly
          above the button, styled and wired up to look and behave like a
          real clickable button (not decoration) */}
      <Link
        href="/contact"
        aria-label="Get in Touch - send a wholesale inquiry"
        title="Get in Touch"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        className="
          flex items-center gap-1.5
          bg-brand-african
          border border-brand-gold/40
          text-brand-cream
          text-[10px]
          font-bold
          tracking-widest
          uppercase
          px-2
          py-3
          rounded-sm
          shadow-lg
          whitespace-nowrap
          pointer-events-auto
          cursor-pointer
          transition-transform
          duration-200
          hover:scale-105
          hover:bg-[#3a2a1c]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-offset-2
          focus-visible:ring-[#BE6E5B]
        "
      >
        Get in Touch
        <span className="text-brand-gold">&#10022;</span>
      </Link>

      {/* Inquiry button -> same destination as the navbar "Inquire Now" */}
      <Link
        href="/contact"
        aria-label="Inquire Now - send a wholesale inquiry"
        title="Inquire Now"
        className="sw-inquiry-blink relative flex items-center justify-center w-14 h-14 text-white rounded-full bg-gradient-to-br from-[#a07f61] to-[#BE6E5B] border border-[#8C4535] hover:scale-110 transition-transform duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#BE6E5B] pointer-events-auto"
      >
        {/* Pulsing ring */}
        <span
          className="absolute inset-0 rounded-full border-2 border-[#BE6E5B] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 motion-reduce:animate-none"
          aria-hidden="true"
        />

        {/* Envelope icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </Link>
    </aside>
  );
}