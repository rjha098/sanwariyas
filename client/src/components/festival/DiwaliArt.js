// FILE: client/src/components/festival/DiwaliArt.js
"use client";

import { useId } from "react";

const sid = (raw) => raw.replace(/[^a-zA-Z0-9_-]/g, "");

/* Loads the two display fonts. A plain <link> on purpose: if the request is
   blocked (ad-blocker, offline) it fails silently and the CSS falls back to
   the serif stack — nothing breaks. */
export function DiwaliFonts() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap"
    />
  );
}

/* ───────────────────────── DIYA (clay lamp) ───────────────────────── */
export function Diya({ className = "", delay = 0, glow = true, style }) {
  const id = sid(useId());
  return (
    <svg
      className={className}
      viewBox="0 0 120 100"
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6df9b" />
          <stop offset=".45" stopColor="#d9b45a" />
          <stop offset="1" stopColor="#8a5f17" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff7d1" />
          <stop offset=".35" stopColor="#ffd36b" />
          <stop offset=".75" stopColor="#ff8a1f" />
          <stop offset="1" stopColor="#e2391b" stopOpacity=".85" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffd36b" stopOpacity=".85" />
          <stop offset=".5" stopColor="#ff9a2e" stopOpacity=".28" />
          <stop offset="1" stopColor="#ff9a2e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && (
        <ellipse
          className="dw-glow"
          cx="60"
          cy="32"
          rx="58"
          ry="40"
          fill={`url(#${id}g)`}
          style={{ animationDelay: `${delay}s` }}
        />
      )}

      <path d="M44 88h32l-5 8H49z" fill={`url(#${id}b)`} />
      <path
        d="M8 52C8 76 32 90 60 90s52-14 52-38c-16 8-34 11-52 11S24 60 8 52z"
        fill={`url(#${id}b)`}
      />
      <path
        d="M8 52c16-8 34-11 52-11s36 3 52 11c-16 8-34 11-52 11S24 60 8 52z"
        fill="#5a2a08"
      />
      <path
        d="M17 52c13-6 27-8 43-8s30 2 43 8c-13 5-27 7-43 7S30 57 17 52z"
        fill="#8a4410"
        opacity=".9"
      />
      <path
        d="M8 52c16-8 34-11 52-11s36 3 52 11"
        fill="none"
        stroke="#fff1c2"
        strokeOpacity=".7"
        strokeWidth="1.4"
      />
      {[
        [30, 74],
        [45, 80],
        [60, 82],
        [75, 80],
        [90, 74],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.2" fill="#fff1c2" opacity=".75" />
      ))}

      <rect x="58.5" y="37" width="3" height="9" rx="1.5" fill="#2a1206" />
      <g className="dw-flame" style={{ animationDelay: `${delay}s` }}>
        <path
          d="M60 4C51 19 49 29 54 37c2.5 4 9.5 4 12 0 5-8 3-18-6-33z"
          fill={`url(#${id}f)`}
        />
        <path
          d="M60 18c-4 8-4 14-2 18 1.5 2 2.5 2 4 0 2-4 2-10-2-18z"
          fill="#fffbe6"
          opacity=".95"
        />
      </g>
    </svg>
  );
}

/* ─────────────────────── RANGOLI / MANDALA ─────────────────────── */
function petals(count, inner, outer, width) {
  const span = outer - inner;
  return Array.from({ length: count }, (_, i) => (
    <path
      key={i}
      transform={`rotate(${(360 / count) * i})`}
      d={`M0 ${-inner} C ${width} ${-(inner + span * 0.33)} ${width} ${-(inner + span * 0.66)} 0 ${-outer} C ${-width} ${-(inner + span * 0.66)} ${-width} ${-(inner + span * 0.33)} 0 ${-inner}Z`}
    />
  ));
}

export function Mandala({ className = "" }) {
  const id = sid(useId());
  const dots = Array.from({ length: 48 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 48;
    return (
      <circle
        key={i}
        cx={(Math.cos(a) * 196).toFixed(2)}
        cy={(Math.sin(a) * 196).toFixed(2)}
        r={i % 2 ? 1.2 : 2}
        fill="#f6df9b"
        stroke="none"
      />
    );
  });

  return (
    <svg
      className={className}
      viewBox="-200 -200 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}c`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffd36b" stopOpacity=".55" />
          <stop offset=".6" stopColor="#ff9a2e" stopOpacity=".12" />
          <stop offset="1" stopColor="#ff9a2e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="120" fill={`url(#${id}c)`} />

      <g className="dw-spin" fill="none" stroke="#d9b45a" strokeWidth="1.1">
        <g opacity=".75">{dots}</g>
        <circle r="188" opacity=".55" />
        <g fill="rgba(217,180,90,0.06)">{petals(24, 148, 184, 11)}</g>
      </g>

      <g
        className="dw-spin dw-spin--rev"
        fill="none"
        stroke="#f6df9b"
        strokeWidth="1"
      >
        <circle r="146" strokeDasharray="1.5 6" opacity=".8" />
        <g fill="rgba(246,223,155,0.07)">{petals(16, 96, 146, 21)}</g>
      </g>

      <g
        className="dw-spin dw-spin--slow"
        fill="none"
        stroke="#d9b45a"
        strokeWidth="1.1"
      >
        <circle r="98" opacity=".7" />
        <g fill="rgba(255,154,46,0.10)">{petals(12, 52, 96, 16)}</g>
      </g>

      <g fill="rgba(255,211,107,0.18)" stroke="#f6df9b" strokeWidth="1">
        {petals(8, 18, 54, 10)}
        <circle r="18" fill="none" />
      </g>
    </svg>
  );
}

/* ───────────────────────── TORAN (door garland) ───────────────────────── */
export function Toran({ className = "", height = 96 }) {
  const id = sid(useId());
  return (
    <svg
      className={className}
      width="100%"
      height={height}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a9812c" />
          <stop offset=".5" stopColor="#f6df9b" />
          <stop offset="1" stopColor="#a9812c" />
        </linearGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset=".55" stopColor="#ff7a18" />
          <stop offset="1" stopColor="#b3122f" />
        </linearGradient>
        <pattern
          id={`${id}t`}
          width="132"
          height="96"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 8Q66 34 132 8"
            fill="none"
            stroke={`url(#${id}r)`}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M66 22C52 36 52 58 66 74 80 58 80 36 66 22z"
            fill={`url(#${id}p)`}
            stroke="#f6df9b"
            strokeWidth="1.2"
          />
          <path
            d="M66 30C60 42 60 56 66 66"
            fill="none"
            stroke="#fff1c2"
            strokeOpacity=".65"
          />
          <circle cx="66" cy="80" r="4.2" fill="#f6df9b" />
          <path d="M66 84v7" stroke="#d9b45a" strokeWidth="1.5" />
          <circle cx="66" cy="93" r="2.2" fill="#ffd36b" />
          {[33, 99].map((x) => (
            <g key={x}>
              <circle cx={x} cy="25" r="5.5" fill="#ff9a2e" stroke="#f6df9b" />
              <circle cx={x} cy="25" r="2" fill="#fff1c2" />
            </g>
          ))}
          <circle cx="0" cy="8" r="4" fill="#f6df9b" />
          <circle cx="132" cy="8" r="4" fill="#f6df9b" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id}t)`} />
      <rect width="100%" height="5" fill={`url(#${id}r)`} />
    </svg>
  );
}

/* ───────────────────────── LANTERN (akash kandil) ───────────────────────── */
export function Lantern({ className = "", drop = 0 }) {
  const id = sid(useId());
  const H = 190 + drop;
  return (
    <svg
      className={className}
      viewBox={`0 0 80 ${H}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8c1d34" />
          <stop offset=".5" stopColor="#ff7a18" />
          <stop offset="1" stopColor="#8c1d34" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff1c2" stopOpacity=".95" />
          <stop offset=".45" stopColor="#ffb347" stopOpacity=".35" />
          <stop offset="1" stopColor="#ff9a2e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <line
        x1="40"
        y1="0"
        x2="40"
        y2={46 + drop}
        stroke="#d9b45a"
        strokeWidth="1.4"
      />
      <g transform={`translate(0 ${drop})`}>
        <circle
          className="dw-glow"
          cx="40"
          cy="96"
          r="52"
          fill={`url(#${id}g)`}
        />
        <path d="M26 46h28l4 9H22z" fill="#d9b45a" />
        <path
          d="M22 55C4 72 4 120 22 138h36c18-18 18-66 0-83z"
          fill={`url(#${id}b)`}
          stroke="#f6df9b"
          strokeWidth="1.2"
        />
        <ellipse cx="40" cy="96" rx="13" ry="30" fill={`url(#${id}g)`} />
        <g fill="none" stroke="#f6df9b" strokeOpacity=".75" strokeWidth=".9">
          <path d="M40 55v83" />
          <path d="M31 55C20 80 20 112 31 138" />
          <path d="M49 55c11 25 11 57 0 83" />
        </g>
        <path d="M20 66h40M17 126h46" stroke="#f6df9b" strokeWidth="1.6" />
        <path d="M24 138h32l-4 8H28z" fill="#d9b45a" />
        <path d="M40 146v18" stroke="#d9b45a" strokeWidth="1.4" />
        <path
          d="M34 164h12l-2 20h-8z"
          fill="#b3122f"
          stroke="#f6df9b"
          strokeWidth=".8"
        />
      </g>
    </svg>
  );
}
