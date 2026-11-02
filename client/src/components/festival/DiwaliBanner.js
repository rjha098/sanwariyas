// FILE: client/src/components/festival/DiwaliBanner.js
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./diwali.css";
import { DIWALI, isDiwaliLive } from "./diwaliConfig";
import { DiwaliFonts, Diya, Toran, Lantern } from "./DiwaliArt";

/* fixed (not random) values => identical on server & client, no hydration warning */
const SPARKS = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 90,
  s: 3 + ((i * 7) % 5) * 1.6,
  d: ((i * 13) % 30) / 10,
  t: 2.6 + ((i * 5) % 9) / 3,
}));

function useCountdown(targetMs) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, targetMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return left;
}

const pad = (n) => String(n).padStart(2, "0");

export default function DiwaliBanner() {
  const ref = useRef(null);
  const [live, setLive] = useState(true);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);
  const left = useCountdown(new Date(DIWALI.target).getTime());

  useEffect(() => {
    setLive(isDiwaliLive());
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setArmed(true);
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live]);

  if (!DIWALI.enabled || !live) return null;

  const total = left === null ? null : Math.floor(left / 1000);
  const parts =
    total === null
      ? ["--", "--", "--", "--"]
      : [
          pad(Math.floor(total / 86400)),
          pad(Math.floor((total % 86400) / 3600)),
          pad(Math.floor((total % 3600) / 60)),
          pad(total % 60),
        ];
  const done = left === 0;

  return (
    <section
      ref={ref}
      className={`dw-scope dw-banner${armed ? " is-armed" : ""}${inView ? " is-in" : ""}`}
      aria-label="Diwali greetings from SANWARIYAS"
    >
      <DiwaliFonts />
      <div className="dw-banner-jaali" aria-hidden="true" />
      <div className="dw-banner-sparks" aria-hidden="true">
        {SPARKS.map((s, i) => (
          <span
            key={i}
            className="dw-spark"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              "--s": `${s.s}px`,
              "--d": `${s.d}s`,
              "--t": `${s.t}s`,
            }}
          />
        ))}
      </div>
      <Toran className="dw-banner-toran" height={96} />

      <div className="dw-banner-inner">
        <div className="dw-banner-copy">
          <span className="dw-chip dw-rise" style={{ "--d": "0s" }}>
            <i />
            {DIWALI.bannerEyebrow}
          </span>
          <h2
            className="dw-hindi dw-gold-text dw-banner-title dw-rise"
            lang="hi"
            style={{ "--d": ".12s" }}
          >
            {DIWALI.hindi}
          </h2>
          <p className="dw-banner-english dw-rise" style={{ "--d": ".24s" }}>
            {DIWALI.english} — {DIWALI.bannerLine}
          </p>
          <p className="dw-banner-wish dw-rise" style={{ "--d": ".36s" }}>
            {DIWALI.bannerWish}
          </p>

          {done ? (
            <p className="dw-done dw-rise" style={{ "--d": ".48s" }}>
              {DIWALI.doneLine}
            </p>
          ) : (
            <>
              <p
                className="dw-countdown-label dw-rise"
                style={{ "--d": ".48s" }}
              >
                {DIWALI.countdownLabel}
              </p>
              <div
                className="dw-countdown dw-rise"
                role="timer"
                style={{ "--d": ".56s" }}
              >
                {["Days", "Hours", "Mins", "Secs"].map((label, i) => (
                  <div className="dw-tile" key={label}>
                    <b>{parts[i]}</b>
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="dw-banner-ctas dw-rise" style={{ "--d": ".68s" }}>
            <Link href={DIWALI.primaryCta.href} className="dw-btn dw-btn--gold">
              {DIWALI.primaryCta.label}
            </Link>
            {DIWALI.secondaryCta?.label && DIWALI.secondaryCta?.href && (
              <Link
                href={DIWALI.secondaryCta.href}
                className="dw-btn dw-btn--ghost"
              >
                {DIWALI.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>

        {/* one diya, soft static glow — nothing rotating */}
        <div
          className="dw-stage dw-rise"
          style={{ "--d": ".3s" }}
          aria-hidden="true"
        >
          <div className="dw-stage-core">
            <Diya className="dw-stage-diya" />
          </div>
        </div>
      </div>

      <div className="dw-banner-lanterns" aria-hidden="true">
        <div className="dw-banner-lantern dw-banner-lantern--a">
          <div className="dw-sway">
            <Lantern drop={64} />
          </div>
        </div>
        <div className="dw-banner-lantern dw-banner-lantern--b">
          <div className="dw-sway">
            <Lantern drop={18} />
          </div>
        </div>
        <div className="dw-banner-lantern dw-banner-lantern--c">
          <div className="dw-sway">
            <Lantern drop={80} />
          </div>
        </div>
      </div>
    </section>
  );
}
