// FILE: client/src/components/festival/DiwaliGreeting.js
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import "./diwali.css";
import { DIWALI, isDiwaliLive } from "./diwaliConfig";
import { DiwaliFonts, Diya, Toran, Lantern } from "./DiwaliArt";

/* Rising golden embers — drawn from one pre-rendered glow sprite, so it stays
   smooth even on mobile. Stops completely when the popup closes. */
function useEmbers(canvasRef, active) {
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0,
      raf = 0,
      last = 0,
      parts = [];

    const S = 64;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = S;
    const sctx = sprite.getContext("2d");
    const g = sctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, "rgba(255,246,207,1)");
    g.addColorStop(0.25, "rgba(255,211,107,.85)");
    g.addColorStop(0.6, "rgba(255,154,46,.25)");
    g.addColorStop(1, "rgba(255,154,46,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, S, S);

    const spawn = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 20,
      r: 3 + Math.random() * 9,
      vy: 14 + Math.random() * 36,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.4 + Math.random() * 1.1,
      amp: 8 + Math.random() * 26,
      tw: Math.random() * Math.PI * 2,
      twSpeed: 1.2 + Math.random() * 2.4,
      a: 0.35 + Math.random() * 0.65,
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, Math.max(26, w / 16)));
      parts = Array.from({ length: n }, () => spawn(true));
    };

    const render = (t) => {
      const dt = Math.min((t - (last || t)) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.y -= p.vy * dt;
        p.sway += p.swaySpeed * dt;
        p.tw += p.twSpeed * dt;
        const x = p.x + Math.sin(p.sway) * p.amp;
        const fade = Math.min(1, Math.max(0, p.y / (h * 0.25)));
        ctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(p.tw)) * fade;
        ctx.drawImage(sprite, x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        if (p.y < -20) Object.assign(p, spawn(false));
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      render(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) render(performance.now());
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, canvasRef]);
}

export default function DiwaliGreeting() {
  const pathname = usePathname();

  /* The popup is part of the very first HTML the server sends (when we are on
     an eligible page), so it is the first thing the visitor sees — the
     homepage never flashes before it. A repeat visit in the same browser
     session is closed again right after hydration (see effect below). */
  const eligible =
    DIWALI.enabled &&
    isDiwaliLive() &&
    DIWALI.greeting.showOnPaths.includes(pathname);

  const [open, setOpen] = useState(eligible);
  const [closing, setClosing] = useState(false);
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const enterRef = useRef(null);
  const closeTimer = useRef(null);
  const shownRef = useRef(false);

  useEmbers(canvasRef, open);

  const dismiss = useCallback(() => {
    setClosing(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 600);
  }, []);

  /* decide whether to keep it open (once per session) */
  useEffect(() => {
    if (!DIWALI.enabled) return;
    const g = DIWALI.greeting;
    // Add ?diwali=preview to any homepage URL to force-test it.
    const preview =
      new URLSearchParams(window.location.search).get("diwali") === "preview";

    if (preview) {
      shownRef.current = true;
      setOpen(true);
      return;
    }

    if (!isDiwaliLive() || !g.showOnPaths.includes(pathname)) return;
    if (shownRef.current) return; // already shown by this component instance

    let seen = false;
    try {
      seen =
        g.oncePerSession !== false && !!sessionStorage.getItem(g.storageKey);
    } catch {}

    if (seen) {
      setOpen(false);
      return;
    }

    shownRef.current = true;
    try {
      sessionStorage.setItem(g.storageKey, "1");
    } catch {}
    setOpen(true);
  }, [pathname]);

  /* scroll lock, Esc to close, auto-close, initial focus */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    enterRef.current?.focus({ preventScroll: true });
    const auto =
      DIWALI.greeting.autoCloseMs > 0
        ? setTimeout(dismiss, DIWALI.greeting.autoCloseMs)
        : null;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (auto) clearTimeout(auto);
    };
  }, [open, dismiss]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /* keep Tab inside the dialog */
  const trapTab = (e) => {
    if (e.key !== "Tab" || !rootRef.current) return;
    const f = rootRef.current.querySelectorAll("button, a[href]");
    if (!f.length) return;
    const first = f[0],
      last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      className={`dw-scope dw-overlay${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Diwali greetings from SANWARIYAS"
      onKeyDown={trapTab}
    >
      <DiwaliFonts />

      <div className="dw-ov-decor" aria-hidden="true">
        <canvas ref={canvasRef} />
        <Toran className="dw-ov-toran" height={96} />
        <div className="dw-ov-lantern dw-ov-lantern--a">
          <div className="dw-sway">
            <Lantern drop={30} />
          </div>
        </div>
        <div className="dw-ov-lantern dw-ov-lantern--b">
          <div className="dw-sway">
            <Lantern drop={0} />
          </div>
        </div>
        <div className="dw-ov-lantern dw-ov-lantern--c">
          <div className="dw-sway">
            <Lantern drop={0} />
          </div>
        </div>
        <div className="dw-ov-lantern dw-ov-lantern--d">
          <div className="dw-sway">
            <Lantern drop={30} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="dw-ov-close"
        onClick={dismiss}
        aria-label="Close Diwali greeting"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 3l10 10M13 3L3 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="dw-ov-scroll">
        <div className="dw-ov-content">
          <Diya className="dw-ov-diya dw-rise" style={{ "--d": ".1s" }} />
          <p className="dw-ov-eyebrow dw-rise" style={{ "--d": ".25s" }}>
            SANWARIYAS · Jaipur
          </p>
          <h2
            className="dw-hindi dw-gold-text dw-ov-title dw-rise"
            lang="hi"
            style={{ "--d": ".4s" }}
          >
            {DIWALI.hindi}
          </h2>
          <p className="dw-ov-english dw-rise" style={{ "--d": ".6s" }}>
            {DIWALI.english}
          </p>
          <div
            className="dw-orn dw-rise"
            style={{ "--d": ".75s" }}
            aria-hidden="true"
          >
            <span>✦</span>
          </div>
          <p className="dw-ov-wish dw-rise" style={{ "--d": ".9s" }}>
            {DIWALI.overlayWish}
          </p>
          <p className="dw-ov-sign dw-rise" style={{ "--d": "1s" }}>
            {DIWALI.overlaySign}
          </p>
          <div className="dw-ov-actions dw-rise" style={{ "--d": "1.15s" }}>
            <button
              ref={enterRef}
              type="button"
              className="dw-btn dw-btn--gold"
              onClick={dismiss}
            >
              {DIWALI.greeting.enterLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
