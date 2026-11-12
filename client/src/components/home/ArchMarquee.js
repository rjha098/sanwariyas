// FILE: client/src/components/home/ArchMarquee.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const STYLES = `
  .am-wrap {
    --am-w: clamp(168px, 44vw, 250px);
    --am-h: calc(var(--am-w) * 1.4);
    --am-gap: clamp(12px, 2vw, 24px);
  }

  .am-viewport {
    position: relative;
    overflow: hidden;
    padding: 60px 0 76px;
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
  }

  .am-track {
    display: flex;
    width: max-content;
    margin: 0;
    padding: 0;
    list-style: none;
    animation: amMoveRight 78s linear infinite;
    will-change: transform;
    backface-visibility: hidden;
  }
  .am-track[data-dir="left"] { animation-name: amMoveLeft; }
  .am-viewport:hover .am-track,
  .am-viewport:focus-within .am-track,
  .am-track[data-paused="true"] {
    animation-play-state: paused;
  }

  /* moves left → right; -50% is exactly one full set, so the loop never jumps */
  @keyframes amMoveRight {
    from { transform: translate3d(-50%, 0, 0); }
    to   { transform: translate3d(0, 0, 0); }
  }

  /* moves right → left */
  @keyframes amMoveLeft {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(-50%, 0, 0); }
  }

  .am-item {
    flex: 0 0 auto;
    width: var(--am-w);
    height: var(--am-h);
    margin-right: var(--am-gap);
  }
  .am-item:nth-child(even) { transform: translateY(18px); }

  /* tilted-card look (same as the hero cards) — straightens on hover */
  .am-tilt .am-item { perspective: 1000px; }
  .am-tilt .am-card { transform: rotateY(-14deg); }

  .am-card {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 999px 999px 18px 18px;
    text-decoration: none;
    color: #fdf7f2;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.7s ease;
    box-shadow: 0 14px 34px rgba(92, 49, 32, 0.20);
  }
  .am-item:has(.am-card:hover),
  .am-item:has(.am-card:focus-visible) { position: relative; z-index: 5; }

  .am-face {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
  }
  .am-face img {
    object-fit: cover;
    object-position: 50% 12%;
    transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .am-face::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(61, 31, 20, 0.7) 0%, rgba(61, 31, 20, 0) 46%);
    pointer-events: none;
  }
  .am-card::before {
    content: "";
    position: absolute;
    inset: 7px;
    z-index: 3;
    border: 1px solid rgba(255, 248, 235, 0.55);
    border-radius: 999px 999px 12px 12px;
    pointer-events: none;
    transition: border-color 0.5s ease;
  }

  .am-caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 4;
    padding: 0 14px 20px;
    text-align: center;
  }
  .am-name {
    display: block;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  .am-more {
    display: block;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.6s ease, opacity 0.6s ease, margin 0.6s ease;
  }
  .am-note { display: block; font-size: 12px; letter-spacing: 0.06em; color: rgba(253, 247, 242, 0.85); }
  .am-cta {
    display: inline-block;
    margin-top: 8px;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #E8D5A3;
    border-bottom: 1px solid rgba(232, 213, 163, 0.6);
    padding-bottom: 2px;
  }

  /* zoom (mouse hover / keyboard focus) */
  .am-card:focus-visible {
    box-shadow: 0 0 0 3px #FAF3E8, 0 0 0 6px #7A3D2A, 0 18px 40px rgba(92, 49, 32, 0.3);
  }
  @media (hover: hover) and (pointer: fine) {
    .am-card:hover,
    .am-tilt .am-card:hover { transform: rotateY(0deg) scale(1.16); box-shadow: 0 32px 60px rgba(92, 49, 32, 0.42); }
    .am-card:hover .am-face img { transform: scale(1.14); }
    .am-card:hover::before { border-color: rgba(232, 213, 163, 0.95); }
    .am-card:hover .am-more { max-height: 70px; opacity: 1; margin-top: 8px; }
  }
  .am-card:focus-visible,
  .am-tilt .am-card:focus-visible { transform: rotateY(0deg) scale(1.16); }
  .am-card:focus-visible .am-face img { transform: scale(1.12); }
  .am-card:focus-visible .am-more { max-height: 70px; opacity: 1; margin-top: 8px; }

  /* touch screens: no hover, so the extra line is always visible and a press zooms */
  @media (hover: none) {
    .am-more { max-height: 70px; opacity: 1; margin-top: 8px; }
    .am-card:active,
    .am-tilt .am-card:active { transform: rotateY(0deg) scale(1.06); }
  }

  .am-toggle {
    position: relative;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid rgba(122, 61, 42, 0.35);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.6);
    color: #7A3D2A;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.3s ease, border-color 0.3s ease;
  }
  .am-toggle:hover { background: #fff; border-color: #BE6E5B; }
  .am-toggle:focus-visible { outline: 2px solid #7A3D2A; outline-offset: 3px; }

  @media (prefers-reduced-motion: reduce) {
    .am-track, .am-track[data-dir] { animation: none; }
    .am-tilt .am-card { transform: none; }
    .am-viewport {
      overflow-x: auto;
      -webkit-mask-image: none;
      mask-image: none;
    }
    .am-clone, .am-toggle { display: none; }
    .am-card, .am-face img, .am-more { transition: none; }
  }
`;

function Card({ item, index, ctaLabel, clone = false }) {
  return (
    <li
      className={`am-item${clone ? " am-clone" : ""}`}
      {...(clone ? { "aria-hidden": "true" } : {})}
    >
      <Link
        href={item.href}
        className="am-card"
        aria-label={`${item.name} — ${ctaLabel}`}
        tabIndex={clone ? -1 : 0}
        title={item.alt}
      >
        <div className="am-face">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 44vw, 250px"
            loading={index < 5 && !clone ? "eager" : "lazy"}
            draggable={false}
          />
        </div>
        <div className="am-caption font-sans">
          <span className="am-name">{item.name}</span>
          <span className="am-more">
            {item.note && <span className="am-note">{item.note}</span>}
            <span className="am-cta">
              {ctaLabel} <span aria-hidden="true">→</span>
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}

// Seamless, continuously moving (left → right) strip of arch-shaped cards.
// Hover / keyboard focus zooms the card; the whole card is a link.
export default function ArchMarquee({
  items,
  label,
  ctaLabel = "View",
  direction = "right", // "right" = left → right, "left" = right → left
  tilt = false,
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={`am-wrap font-sans relative z-10${tilt ? " am-tilt" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="am-viewport">
        <ul
          className="am-track"
          aria-label={label}
          data-paused={paused ? "true" : "false"}
          data-dir={direction}
        >
          {items.map((item, i) => (
            <Card key={item.id} item={item} index={i} ctaLabel={ctaLabel} />
          ))}
          {items.map((item, i) => (
            <Card
              key={`${item.id}-clone`}
              item={item}
              index={i}
              ctaLabel={ctaLabel}
              clone
            />
          ))}
        </ul>
      </div>
      <div className="flex justify-center pb-10">
        <button
          type="button"
          className="am-toggle font-sans"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
          {paused ? "Play animation" : "Pause animation"}
        </button>
      </div>
    </div>
  );
}
