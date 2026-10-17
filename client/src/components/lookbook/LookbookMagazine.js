// FILE: client/src/components/lookbook/LookbookMagazine.js
//
// Lookbook rendered like a printed fashion magazine:
//  • always opens on a "SANWARIYAS LOOKBOOK" cover (closed book, cover centred)
//  • desktop → open two-page spread with a real 3D page-turn and stacked paper edges
//  • mobile  → one full page at a time, swipe / slide
//  • every photo page is full-bleed, with a printed caption band underneath
//    (big brand-style title, style number, category) like a magazine ad page
//  • question pages between photos (managed from the admin panel), a final
//    "send inquiry" page and (desktop) a back cover
//  • auto-plays, pauses on hover / touch / question pages, keyboard + swipe nav
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

const FLIP_MS = 950;
const AUTOPLAY_MS = 5200;
const COVER_HOLD_MS = 3500; // let people read the cover before auto-playing

const badgeStyles = {
  Bestseller: "bg-[#BE6E5B]",
  Trending: "bg-[#D4A24C]",
  "New Arrival": "bg-[#4C8C6C]",
};

// Caption-band paper tones (sand, rose, parchment, sage mist) — rotate page by
// page, the way ad pages in a printed magazine alternate. No pure white.
const BAND_TONES = ["#EFE0CC", "#EBCFC3", "#E8DCC4", "#D9E0D3"];

const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = "/images/placeholder.png";
};

/* ───────────────────────────── page faces ───────────────────────────── */

function CoverPage({ coverItem, backendUrl, categories, issueLabel, onOpen }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#2b1710] select-none"
      style={{ containerType: "inline-size" }}
    >
      {coverItem && (
        <img
          src={`${backendUrl}${coverItem.image}`}
          onError={onImgError}
          alt=""
          draggable={false}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* darken top (masthead) and bottom (cover lines) so the type stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,8,4,.80) 0%, rgba(20,8,4,.22) 30%, rgba(20,8,4,0) 50%, rgba(20,8,4,.86) 100%)",
        }}
      />

      {/* masthead */}
      <div
        className="absolute inset-x-0 top-0 text-center"
        style={{ paddingTop: "6cqw" }}
      >
        <p
          className="font-sans font-bold text-[#E8D5A3]"
          style={{
            fontSize: "clamp(8px, 2.2cqw, 12px)",
            letterSpacing: "0.5em",
            paddingLeft: "0.5em",
          }}
        >
          WHOLESALE · JAIPUR
        </p>
        <h2
          className="font-display font-bold text-white leading-none"
          style={{
            fontSize: "clamp(24px, 10.2cqw, 64px)",
            letterSpacing: "0.06em",
            marginTop: "2cqw",
            textShadow: "0 2px 18px rgba(0,0,0,.35)",
          }}
        >
          SANWARIYAS
        </h2>
        <p
          className="font-display text-[#E8D5A3]"
          style={{
            fontSize: "clamp(11px, 4.4cqw, 26px)",
            letterSpacing: "0.9em",
            paddingLeft: "0.9em",
            marginTop: "1.5cqw",
          }}
        >
          LOOKBOOK
        </p>
      </div>

      {/* cover lines */}
      <div
        className="absolute inset-x-0 bottom-0 text-center"
        style={{ padding: "0 6cqw 6cqw" }}
      >
        <p
          className="font-serif italic text-white/85"
          style={{ fontSize: "clamp(11px, 3.4cqw, 17px)" }}
        >
          Wholesale ethnic wear collections
        </p>
        {categories.length > 0 && (
          <p
            className="font-sans font-semibold text-white/80"
            style={{
              fontSize: "clamp(8px, 2.1cqw, 11px)",
              letterSpacing: "0.28em",
              marginTop: "1.6cqw",
            }}
          >
            {categories.join("  ·  ").toUpperCase()}
          </p>
        )}
        <p
          className="font-sans text-[#E8D5A3]"
          style={{
            fontSize: "clamp(8px, 2cqw, 11px)",
            letterSpacing: "0.35em",
            marginTop: "2.4cqw",
          }}
        >
          {issueLabel.toUpperCase()}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-4 px-7 py-2.5 rounded-full border border-white/70 text-white font-sans text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-white hover:text-[#7A3D2A] transition-colors active:scale-95"
        >
          Open the lookbook
        </button>
      </div>
    </div>
  );
}

function PhotoPage({
  page,
  side,
  folio,
  tone,
  backendUrl,
  isAdded,
  onToggle,
  eager,
}) {
  const { item } = page;
  const alignRight = side === "right";

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none"
      style={{ background: tone, containerType: "inline-size" }}
    >
      {/* the photograph — full width, edge to edge */}
      <div className="absolute inset-x-0 top-0 h-[84%] overflow-hidden bg-[#EFE6DA]">
        <img
          src={`${backendUrl}${item.image}`}
          onError={onImgError}
          alt={`${item.styleNumber ? item.styleNumber + " – " : ""}${item.title}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* add to inquiry — outer corner, away from the spine */}
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isAdded}
          className={`absolute top-3 ${alignRight ? "right-3" : "left-3"} z-10 flex items-center gap-1.5 pl-2.5 pr-3.5 h-9 rounded-full font-sans text-[10px] tracking-[0.18em] uppercase font-bold backdrop-blur-md border transition-all duration-300 active:scale-95 ${
            isAdded
              ? "bg-[#7A3D2A] text-white border-[#7A3D2A] shadow-lg"
              : "bg-black/45 text-white border-white/70 shadow-md hover:bg-white hover:text-[#7A3D2A]"
          }`}
        >
          <span className="text-sm leading-none">{isAdded ? "✓" : "+"}</span>
          {isAdded ? "Added" : "Inquire"}
        </button>

        {item.badge && item.badge !== "None" && (
          <span
            className={`absolute top-3 ${alignRight ? "left-3" : "right-3"} px-2.5 py-1 rounded-full text-[8px] font-bold tracking-[0.2em] uppercase text-white shadow-md ${
              badgeStyles[item.badge] || "bg-[#7A3D2A]"
            }`}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* printed caption band: big title like a brand name on an ad page */}
      <div
        className={`absolute inset-x-0 bottom-0 h-[16%] flex flex-col justify-center ${
          alignRight ? "items-end text-right" : "items-start text-left"
        }`}
        style={{ paddingInline: "5cqw" }}
      >
        <h3
          className="font-display font-bold uppercase leading-[1.05] line-clamp-2"
          style={{
            fontSize: "clamp(13px, 5.4cqw, 30px)",
            letterSpacing: "0.1em",
            color: "#2b1710",
          }}
        >
          {item.title}
        </h3>
        <p
          className="font-sans font-semibold uppercase text-[#7A3D2A]"
          style={{
            fontSize: "clamp(8px, 2.1cqw, 11px)",
            letterSpacing: "0.26em",
            marginTop: "1.2cqw",
          }}
        >
          {item.styleNumber ? `Style ${item.styleNumber} · ` : ""}
          {item.category}
        </p>
      </div>

      {/* folio on the inner bottom corner, like a printed page number */}
      <span
        className="absolute font-serif italic text-[#a07f61]"
        style={{
          bottom: "2.2cqw",
          [alignRight ? "left" : "right"]: "5cqw",
          fontSize: "clamp(10px, 2.8cqw, 14px)",
        }}
      >
        {folio}
      </span>
    </div>
  );
}

function QuestionPage({ page, answer, onAnswer, onSkip }) {
  const { question: q } = page;
  const selected = answer || [];
  const multiple = q.type === "multiple";

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#4A2316] to-[#2b1710] overflow-y-auto">
      <div
        aria-hidden="true"
        className="absolute inset-3 sm:inset-4 border border-[#E8D5A3]/30 pointer-events-none"
      />
      <div className="relative min-h-full flex flex-col items-center justify-center text-center px-6 sm:px-9 py-10">
        <span className="text-[#E8D5A3] text-xl mb-2">✦</span>
        <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.5em] uppercase text-[#E8D5A3] font-bold mb-3">
          A quick question
        </p>
        <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#F6E7CC] font-bold leading-snug mb-6 max-w-sm">
          {q.text}
        </h3>

        <div className="w-full max-w-xs space-y-2.5">
          {q.options.map((opt) => {
            const on = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onAnswer(opt)}
                aria-pressed={on}
                className={`w-full flex items-center justify-between gap-3 px-5 py-3 rounded-full border font-sans text-xs tracking-[0.12em] uppercase font-semibold transition-all duration-300 active:scale-[0.98] ${
                  on
                    ? "bg-[#E8D5A3] text-[#3B1F14] border-[#E8D5A3] shadow-md"
                    : "bg-white/5 text-[#F6E7CC] border-[#E8D5A3]/40 hover:border-[#E8D5A3] hover:bg-white/10"
                }`}
              >
                <span className="text-left">{opt}</span>
                <span aria-hidden="true">{on ? "✓" : ""}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-5">
          {multiple && selected.length > 0 && (
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-2.5 rounded-full bg-[#BE6E5B] text-white font-sans text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[#d4806b] transition-colors"
            >
              Continue →
            </button>
          )}
          <button
            type="button"
            onClick={onSkip}
            className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#E8D5A3]/80 hover:text-white underline-offset-4 hover:underline"
          >
            {selected.length > 0 && !multiple ? "Next page" : "Skip"}
          </button>
        </div>
        {multiple && (
          <p className="mt-3 font-serif italic text-xs text-[#E8D5A3]/70">
            Pick as many as you like
          </p>
        )}
      </div>
    </div>
  );
}

function EndPage({ count, onInquire, onRestart, onGrid }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#7A3D2A] to-[#4A2316] text-center overflow-y-auto">
      <div
        aria-hidden="true"
        className="absolute inset-3 sm:inset-4 border border-[#E8D5A3]/30 pointer-events-none"
      />
      <div className="relative min-h-full flex flex-col items-center justify-center px-6 sm:px-9 py-10">
        <span className="text-[#E8D5A3] text-xl mb-2">✦</span>
        <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#E8D5A3] font-bold mb-3">
          End of this issue
        </p>
        <h3 className="font-display text-2xl sm:text-3xl text-white font-bold leading-snug mb-3">
          {count > 0
            ? `You picked ${count} style${count > 1 ? "s" : ""}`
            : "Loved something?"}
        </h3>
        <p className="font-serif italic text-white/80 text-base max-w-xs mb-7">
          {count > 0
            ? "Send all of them in one single inquiry — we’ll reply with pricing & MOQ."
            : "Tap “Inquire” on any photo, then send everything in one single inquiry."}
        </p>

        {count > 0 && (
          <button
            type="button"
            onClick={onInquire}
            className="px-8 py-3.5 rounded-full bg-[#25D366] text-white font-sans text-[11px] tracking-[0.2em] uppercase font-bold shadow-xl hover:brightness-110 active:scale-95 transition"
          >
            Send my inquiry →
          </button>
        )}
        <div className="mt-5 flex items-center gap-6">
          <button
            type="button"
            onClick={onRestart}
            className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#E8D5A3] hover:text-white underline-offset-4 hover:underline"
          >
            ↺ Back to cover
          </button>
          <button
            type="button"
            onClick={onGrid}
            className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#E8D5A3] hover:text-white underline-offset-4 hover:underline"
          >
            View as grid
          </button>
        </div>
      </div>
    </div>
  );
}

function BackCoverPage() {
  return (
    <div
      className="absolute inset-0 bg-[#2b1710] overflow-hidden select-none"
      style={{ containerType: "inline-size" }}
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#E8D5A3]/25"
        style={{ inset: "4cqw" }}
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <span
          className="text-[#E8D5A3]"
          style={{ fontSize: "clamp(16px, 5cqw, 28px)" }}
        >
          ✦
        </span>
        <p
          className="font-display font-bold text-white mt-3"
          style={{
            fontSize: "clamp(18px, 8cqw, 40px)",
            letterSpacing: "0.12em",
          }}
        >
          SANWARIYAS
        </p>
        <p
          className="font-sans text-[#E8D5A3] mt-3"
          style={{
            fontSize: "clamp(8px, 2cqw, 11px)",
            letterSpacing: "0.4em",
            paddingLeft: "0.4em",
          }}
        >
          CRAFTED IN JAIPUR
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────── main component ───────────────────────────── */

export default function LookbookMagazine({
  items,
  questions = [],
  backendUrl,
  shortlist,
  toggleShortlist,
  answers,
  setAnswer,
  onOpenInquiry,
  onSwitchToGrid,
  initialItemId = null,
  keyboardEnabled = true,
}) {
  /* ── layout mode (read synchronously: this component only mounts client-side,
        after the lookbook data has loaded, so there is no hydration mismatch) ── */
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mq.matches);
      setReduceMotion(rm.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  /* ── page list: [blank] + cover + photos/questions + end (+ back cover) ──
     On desktop a blank page sits before the cover so the cover lands on the
     RIGHT-hand page, exactly like a closed magazine lying on a table. */
  const pages = useMemo(() => {
    const qs = [...questions].sort((a, b) => a.afterPhoto - b.afterPhoto);
    const out = [];
    if (!isMobile) out.push({ type: "blank", key: "blank" });
    out.push({ type: "cover", key: "cover" });

    let qi = 0;
    let photoNo = 0;
    items.forEach((item) => {
      out.push({ type: "photo", key: `p-${item._id}`, item });
      photoNo += 1;
      while (qi < qs.length && qs[qi].afterPhoto <= photoNo) {
        out.push({
          type: "question",
          key: `q-${qs[qi]._id}`,
          question: qs[qi],
        });
        qi += 1;
      }
    });
    while (qi < qs.length) {
      out.push({ type: "question", key: `q-${qs[qi]._id}`, question: qs[qi] });
      qi += 1;
    }
    out.push({ type: "end", key: "end" });
    // keep spreads complete: never leave the last right-hand page empty
    if (!isMobile && out.length % 2 === 1)
      out.push({ type: "back", key: "back" });
    return out;
  }, [items, questions, isMobile]);

  // running photo number (folio) + rotating caption-band tone, per photo page
  const pageMeta = useMemo(() => {
    let n = 0;
    return pages.map((p) => {
      if (p.type !== "photo") return { folio: "", tone: BAND_TONES[0] };
      const meta = {
        folio: String(n + 1).padStart(2, "0"),
        tone: BAND_TONES[n % BAND_TONES.length],
      };
      n += 1;
      return meta;
    });
  }, [pages]);

  // cover content comes from the real catalogue
  const coverItem = items[0] || null;
  const coverCategories = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.category).filter(Boolean))).slice(
        0,
        4,
      ),
    [items],
  );
  const issueLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
    [],
  );

  /* ── position ── pos = page index (mobile) | spread index (desktop) ── */
  const perView = isMobile ? 1 : 2;
  const total = Math.ceil(pages.length / perView);
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState(null); // {dir:'next'|'prev', go:boolean}
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const pausedUntil = useRef(0);
  const flipTimer = useRef(null);

  // let the cover be read before autoplay starts turning pages
  useEffect(() => {
    pausedUntil.current = Date.now() + COVER_HOLD_MS;
  }, []);

  // jump to a shared item (?item=<id>) once
  const jumped = useRef(false);
  useEffect(() => {
    if (jumped.current || !initialItemId) return;
    const idx = pages.findIndex(
      (p) => p.type === "photo" && p.item._id === initialItemId,
    );
    if (idx >= 0) {
      jumped.current = true;
      setPos(Math.floor(idx / perView));
      setPlaying(false);
    }
  }, [initialItemId, pages, perView]);

  // keep pos valid when switching mobile <-> desktop
  useEffect(() => {
    setPos((p) => Math.min(p, Math.max(total - 1, 0)));
    setFlip(null);
  }, [total]);

  useEffect(() => () => clearTimeout(flipTimer.current), []);

  const holdAutoplay = (ms = 9000) => {
    pausedUntil.current = Date.now() + ms;
  };

  const step = useCallback(
    (dir, manual = false) => {
      if (manual) holdAutoplay();
      if (flip) return;
      const target = pos + (dir === "next" ? 1 : -1);
      if (target < 0 || target >= total) return;

      if (isMobile || reduceMotion) {
        setPos(target);
        return;
      }
      setFlip({ dir, go: false });
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          setFlip((f) => (f ? { ...f, go: true } : f)),
        ),
      );
      flipTimer.current = setTimeout(() => {
        setPos(target);
        setFlip(null);
      }, FLIP_MS + 30);
    },
    [flip, pos, total, isMobile, reduceMotion],
  );

  const jumpTo = (target) => {
    holdAutoplay();
    clearTimeout(flipTimer.current);
    setFlip(null);
    setPos(Math.min(Math.max(target, 0), total - 1));
  };

  /* ── what is on screen right now ── */
  const visibleIdx = isMobile ? [pos] : [pos * 2, pos * 2 + 1];
  const questionOnScreen = visibleIdx.some(
    (i) => pages[i]?.type === "question",
  );
  const atEnd = pos >= total - 1;

  /* ── autoplay ── */
  useEffect(() => {
    if (
      !playing ||
      reduceMotion ||
      atEnd ||
      flip ||
      hovering ||
      questionOnScreen
    )
      return;
    const id = setInterval(() => {
      if (document.hidden || Date.now() < pausedUntil.current) return;
      step("next");
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [playing, reduceMotion, atEnd, flip, hovering, questionOnScreen, step]);

  /* ── keyboard ── */
  useEffect(() => {
    if (!keyboardEnabled) return;
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      if (e.key === "ArrowRight") step("next", true);
      if (e.key === "ArrowLeft") step("prev", true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboardEnabled, step]);

  /* ── preload neighbouring images ── */
  useEffect(() => {
    const from = (pos - 1) * perView;
    const to = (pos + 3) * perView;
    pages.slice(Math.max(from, 0), to).forEach((p) => {
      if (p.type === "photo") {
        const img = new Image();
        img.src = `${backendUrl}${p.item.image}`;
      }
    });
  }, [pos, pages, perView, backendUrl]);

  /* ── touch swipe (mobile) ── */
  const touch = useRef({ x: 0, y: 0 });
  const onTouchStart = (e) => {
    holdAutoplay(12000);
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      step(dx < 0 ? "next" : "prev", true);
    }
  };

  /* ── helpers to render a page ── */
  const isAdded = (item) => shortlist.some((s) => s._id === item._id);

  const handleAnswer = (page, opt) => {
    const q = page.question;
    const current = answers[q._id]?.answer || [];
    if (q.type === "multiple") {
      const next = current.includes(opt)
        ? current.filter((o) => o !== opt)
        : [...current, opt];
      setAnswer(q, next);
    } else {
      setAnswer(q, [opt]);
      holdAutoplay(2500);
      // answered → turn the page automatically (feels like a magazine quiz)
      setTimeout(() => step("next"), 650);
    }
  };

  const renderPage = (index, side, eager = false) => {
    const page = pages[index];
    if (!page || page.type === "blank") {
      return <div className="absolute inset-0" aria-hidden="true" />;
    }
    if (page.type === "cover") {
      return (
        <CoverPage
          coverItem={coverItem}
          backendUrl={backendUrl}
          categories={coverCategories}
          issueLabel={issueLabel}
          onOpen={() => step("next", true)}
        />
      );
    }
    if (page.type === "photo") {
      return (
        <PhotoPage
          page={page}
          side={side}
          folio={pageMeta[index].folio}
          tone={pageMeta[index].tone}
          backendUrl={backendUrl}
          eager={eager}
          isAdded={isAdded(page.item)}
          onToggle={() => {
            holdAutoplay(12000);
            toggleShortlist(page.item);
          }}
        />
      );
    }
    if (page.type === "question") {
      return (
        <QuestionPage
          page={page}
          answer={answers[page.question._id]?.answer}
          onAnswer={(opt) => handleAnswer(page, opt)}
          onSkip={() => step("next", true)}
        />
      );
    }
    if (page.type === "back") return <BackCoverPage />;
    return (
      <EndPage
        count={shortlist.length}
        onInquire={onOpenInquiry}
        onRestart={() => jumpTo(0)}
        onGrid={onSwitchToGrid}
      />
    );
  };

  if (!pages.length) return null;

  /* ───────────── DESKTOP SPREAD ───────────── */
  const L = pos * 2;
  const underLeftIdx = flip?.dir === "prev" ? L - 2 : L;
  const underRightIdx = flip?.dir === "next" ? L + 3 : L + 1;
  const isBlank = (i) => !pages[i] || pages[i].type === "blank";
  const leftBlank = isBlank(underLeftIdx);
  const rightBlank = isBlank(underRightIdx);
  // closed book: slide the cover to the middle until the first page is turned
  const closedCover = pos === 0 && !flip;

  const desktopBook = (
    <div
      className="relative flex-none"
      style={{
        // fit the whole stage: as tall as it can be, as long as two 3:4 pages fit its width
        "--bh": "min(calc(100cqh - 28px), calc((100cqw - 40px) / 1.5))",
        height: "var(--bh)",
        width: "calc(var(--bh) * 1.5)",
        perspective: "2400px",
        transform: closedCover ? "translateX(-25%)" : "translateX(0)",
        transition: reduceMotion
          ? "none"
          : "transform 700ms cubic-bezier(.3,.7,.2,1)",
      }}
    >
      {/* soft shadow under the book (only under the pages that exist) */}
      <div
        aria-hidden="true"
        className="absolute -bottom-3 top-3 rounded-md bg-black/45 blur-xl"
        style={{ left: leftBlank ? "50%" : "-12px", right: "-12px" }}
      />

      {/* stacked paper edges, left and right */}
      {!leftBlank && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 w-1/2 h-full rounded-l-md pointer-events-none"
          style={{
            boxShadow:
              "-3px 2px 0 -1px #f4eee4, -6px 4px 0 -2px #e3d9ca, -9px 6px 0 -3px #cfc2ae",
          }}
        />
      )}
      {!rightBlank && (
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 w-1/2 h-full rounded-r-md pointer-events-none"
          style={{
            boxShadow:
              "3px 2px 0 -1px #f4eee4, 6px 4px 0 -2px #e3d9ca, 9px 6px 0 -3px #cfc2ae",
          }}
        />
      )}

      {/* LEFT half (under layer) */}
      <div
        className={`absolute left-0 top-0 w-1/2 h-full overflow-hidden rounded-l-md ${
          leftBlank ? "" : "shadow-md"
        }`}
      >
        {renderPage(underLeftIdx, "left", true)}
      </div>
      {/* RIGHT half (under layer) */}
      <div
        className={`absolute right-0 top-0 w-1/2 h-full overflow-hidden rounded-r-md ${
          rightBlank ? "" : "shadow-md"
        }`}
      >
        {renderPage(underRightIdx, "right", true)}
      </div>

      {/* turning leaf */}
      {flip && (
        <div
          className="absolute top-0 h-full w-1/2"
          style={{
            [flip.dir === "next" ? "right" : "left"]: 0,
            transformOrigin:
              flip.dir === "next" ? "left center" : "right center",
            transformStyle: "preserve-3d",
            transform: flip.go
              ? `rotateY(${flip.dir === "next" ? -180 : 180}deg)`
              : "rotateY(0deg)",
            transition: flip.go
              ? `transform ${FLIP_MS}ms cubic-bezier(.45,.05,.25,1)`
              : "none",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {renderPage(
              flip.dir === "next" ? L + 1 : L,
              flip.dir === "next" ? "right" : "left",
              true,
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  flip.dir === "next"
                    ? "linear-gradient(90deg, rgba(0,0,0,.28), rgba(0,0,0,0) 35%)"
                    : "linear-gradient(270deg, rgba(0,0,0,.28), rgba(0,0,0,0) 35%)",
                opacity: flip.go ? 1 : 0,
                transition: `opacity ${FLIP_MS}ms ease-in`,
              }}
            />
          </div>
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {renderPage(
              flip.dir === "next" ? L + 2 : L - 1,
              flip.dir === "next" ? "left" : "right",
              true,
            )}
          </div>
        </div>
      )}

      {/* spine / gutter shadow — hidden while the book is closed on its cover */}
      {!leftBlank && (
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 pointer-events-none z-40"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.22) 46%, rgba(0,0,0,.3) 50%, rgba(0,0,0,.22) 54%, rgba(0,0,0,0) 100%)",
          }}
        />
      )}

      {/* click zones on the outer edges */}
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => step("prev", true)}
        disabled={pos === 0}
        className="absolute left-0 top-0 h-full w-10 z-50 cursor-w-resize disabled:cursor-default"
      />
      <button
        type="button"
        aria-label="Next page"
        onClick={() => step("next", true)}
        disabled={atEnd}
        className="absolute right-0 top-0 h-full w-10 z-50 cursor-e-resize disabled:cursor-default"
      />
    </div>
  );

  /* ───────────── MOBILE SINGLE PAGE ───────────── */
  const mobileBook = (
    <div
      className="relative flex-none overflow-hidden rounded-md shadow-2xl"
      style={{
        "--bh": "min(calc(100cqh - 12px), calc((100cqw - 16px) * 1.3333))",
        height: "var(--bh)",
        width: "calc(var(--bh) * 0.75)",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex h-full"
        style={{
          width: `${pages.length * 100}%`,
          transform: `translateX(-${(pos * 100) / pages.length}%)`,
          transition: reduceMotion
            ? "none"
            : "transform 650ms cubic-bezier(.3,.7,.2,1)",
        }}
      >
        {pages.map((p, i) => (
          <div
            key={p.key}
            className="relative h-full"
            style={{ width: `${100 / pages.length}%` }}
            aria-hidden={i !== pos}
          >
            {Math.abs(i - pos) <= 2
              ? renderPage(i, "right", Math.abs(i - pos) <= 1)
              : null}
          </div>
        ))}
      </div>
    </div>
  );

  /* ───────────── controls ───────────── */
  const progress = total > 1 ? (pos / (total - 1)) * 100 : 100;

  // page numbers shown to the reader: the cover is page 1, the blank filler page
  // on desktop is never counted
  const offset = isMobile ? 0 : 1;
  const shown = visibleIdx.filter((i) => pages[i] && pages[i].type !== "blank");
  const first = shown.length ? shown[0] - offset + 1 : 1;
  const last = shown.length ? shown[shown.length - 1] - offset + 1 : first;
  const totalPages = pages.length - offset;
  const pageLabel =
    pos === 0
      ? "Cover"
      : first === last
        ? `Page ${first} of ${totalPages}`
        : `Pages ${first}–${last} of ${totalPages}`;

  return (
    <section
      aria-label="Lookbook magazine"
      className="relative h-full w-full flex flex-col overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* stage: takes all the room left between the top bar and the controls.
          container-type:size lets the book size itself from this box (cqw / cqh). */}
      <div
        className="flex-1 min-h-0 px-2 sm:px-6"
        style={{ containerType: "size" }}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isMobile ? mobileBook : desktopBook}
        </div>
      </div>

      <div className="shrink-0 w-full max-w-3xl mx-auto px-3 sm:px-6 pt-2 pb-3 sm:pb-4 flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={() => step("prev", true)}
          disabled={pos === 0 || !!flip}
          aria-label="Previous"
          className="w-10 h-10 shrink-0 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-[#7A3D2A] transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
        >
          ←
        </button>

        <div className="flex-1 min-w-0">
          <div
            className="relative h-6 flex items-center cursor-pointer"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              jumpTo(
                Math.round(((e.clientX - r.left) / r.width) * (total - 1)),
              );
            }}
            role="slider"
            aria-label="Magazine progress"
            aria-valuemin={1}
            aria-valuemax={totalPages}
            aria-valuenow={first}
          >
            <div className="h-[3px] w-full rounded-full bg-white/20" />
            <div
              className="absolute left-0 h-[3px] rounded-full bg-[#E8D5A3]"
              style={{ width: `${progress}%`, transition: "width 600ms ease" }}
            />
            <div
              className="absolute w-3 h-3 -ml-1.5 rounded-full bg-[#E8D5A3] shadow"
              style={{ left: `${progress}%`, transition: "left 600ms ease" }}
            />
          </div>
          <p className="text-center font-sans text-[10px] tracking-[0.3em] uppercase text-white/60">
            {pageLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause auto slide" : "Play auto slide"}
          title={playing ? "Pause auto slide" : "Play auto slide"}
          className="w-10 h-10 shrink-0 rounded-full border border-white/30 text-white text-xs flex items-center justify-center hover:bg-white hover:text-[#7A3D2A] transition"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          onClick={() => step("next", true)}
          disabled={atEnd || !!flip}
          aria-label="Next"
          className="w-10 h-10 shrink-0 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-[#7A3D2A] transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
        >
          →
        </button>
      </div>
    </section>
  );
}
