// FILE: client/src/components/auth/GoogleSignInButton.js
// PURPOSE: "Continue with Google" button (Google Identity Services).
// Renders nothing unless NEXT_PUBLIC_GOOGLE_CLIENT_ID is set, so the login
// page keeps working exactly as before until Google is configured.
"use client";

import { useEffect, useRef, useState } from "react";

const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

let gsiPromise = null;
const loadGsi = () => {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = GSI_SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => {
        gsiPromise = null; // allow a retry on next mount
        reject(new Error("Failed to load Google sign-in."));
      };
      document.head.appendChild(s);
    });
  }
  return gsiPromise;
};

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const boxRef = useRef(null);
  const cbRef = useRef(onCredential);
  const [failed, setFailed] = useState(false);

  // Keep the latest callback without re-initialising Google every render.
  useEffect(() => {
    cbRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!CLIENT_ID) return undefined;
    let cancelled = false;

    loadGsi()
      .then(() => {
        if (cancelled || !boxRef.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (resp) => {
            if (resp?.credential) cbRef.current?.(resp.credential);
          },
          ux_mode: "popup",
        });
        const width = Math.min(
          400,
          Math.max(200, Math.floor(boxRef.current.offsetWidth || 320)),
        );
        window.google.accounts.id.renderButton(boxRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width,
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!CLIENT_ID || failed) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="flex-1 h-px bg-brand-lightgold/40" />
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-mud/60">
          or
        </span>
        <span className="flex-1 h-px bg-brand-lightgold/40" />
      </div>
      <div
        ref={boxRef}
        className={`w-full flex justify-center min-h-[44px] ${
          disabled ? "pointer-events-none opacity-50" : ""
        }`}
      />
    </div>
  );
}