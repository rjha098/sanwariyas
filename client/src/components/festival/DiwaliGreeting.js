// FILE: client/src/components/festival/DiwaliGreeting.js
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import "./diwali.css";
import { DIWALI, isDiwaliLive } from "./diwaliConfig";
import { DiwaliFonts, Diya, Toran, Lantern } from "./DiwaliArt";
import DiwaliAnar from "./DiwaliAnar";
import DiyaLamp from "./DiyaLamp";

/* Rising golden embers + crackers (rockets that burst, and two "anaar"
   fountains at the bottom corners). Everything is drawn on one canvas, so it
   stays smooth even on mobile. Stops completely when the popup closes. */
const FW_COLORS = [
  "255,211,107", // gold
  "255,154,46", // saffron
  "255,110,140", // pink
  "255,244,214", // cream
  "240,80,100", // ruby
];
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
    let rockets = [],
      sparks = [],
      launchIn = 0.5;

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

    const pick = () => FW_COLORS[(Math.random() * FW_COLORS.length) | 0];
    const scale = () => Math.max(0.6, Math.min(1.25, w / 1200));

    const launch = () => {
      const k = scale();
      const targetY = h * (0.12 + Math.random() * 0.36);
      const g = 520 * k;
      rockets.push({
        x: w * (0.1 + Math.random() * 0.8),
        y: h + 8,
        vx: (Math.random() - 0.5) * 40,
        vy: -Math.sqrt(2 * g * (h - targetY)),
        g,
      });
    };

    const burst = (x, y) => {
      const k = scale();
      const main = pick();
      const second = Math.random() < 0.5 ? pick() : "255,244,214";
      const n = 46 + ((Math.random() * 26) | 0);
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.12;
        const sp = (70 + Math.random() * 150) * k;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          g: 120,
          drag: 1.5,
          life: 0,
          max: 1.1 + Math.random() * 0.8,
          c: i % 3 === 0 ? second : main,
          w: 2,
        });
      }
    };

    const fountain = (x, dir, dt) => {
      const k = scale();
      const count = Math.max(1, Math.round(dt * 90));
      for (let i = 0; i < count; i++) {
        sparks.push({
          x: x + (Math.random() - 0.5) * 8,
          y: h - 4,
          vx:
            (dir * (20 + Math.random() * 60) + (Math.random() - 0.5) * 70) * k,
          vy: -(300 + Math.random() * 260) * k,
          g: 560 * k,
          drag: 0.2,
          life: 0,
          max: 0.9 + Math.random() * 0.8,
          c: Math.random() < 0.55 ? "255,211,107" : "255,154,46",
          w: 1.8,
        });
      }
      if (sparks.length > 900) sparks.splice(0, sparks.length - 900);
    };

    const crackers = (dt) => {
      launchIn -= dt;
      if (launchIn <= 0) {
        launch();
        if (Math.random() < 0.35) launch();
        launchIn = 0.9 + Math.random() * 1.3;
      }
      fountain(w * 0.07, 1, dt);
      fountain(w * 0.93, -1, dt);

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.vy += r.g * dt;
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        // short glowing trail
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = "rgba(255,226,150,1)";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(r.x - r.vx * 0.05, r.y - r.vy * 0.05);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        if (r.vy >= -30) {
          burst(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life += dt;
        if (p.life >= p.max) {
          sparks.splice(i, 1);
          continue;
        }
        p.vx *= 1 - p.drag * dt;
        p.vy = p.vy * (1 - p.drag * dt) + p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = 1 - p.life / p.max;
        ctx.globalAlpha = a;
        ctx.strokeStyle = `rgba(${p.c},1)`;
        ctx.lineWidth = p.w * (0.6 + 0.4 * a);
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
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
      if (!reduce) crackers(dt);
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
        <DiwaliAnar />
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
          <DiyaLamp className="dw-ov-diya dw-rise" style={{ "--d": ".15s" }} />{" "}
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
