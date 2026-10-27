// FILE: client/src/components/lookbook/LookbookMagazine.js
// Editorial "magazine" view: two-page spreads on desktop, one page on phones.
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getImageUrl } from "@/lib/imageUrl";
import { itemCaption } from "@/components/lookbook/LookbookGrid";

const fallback = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = "/images/placeholder.png";
};

const isTyping = (el) =>
  el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);

// Pages of one catalogue stay together and run in PDF page order; pages of
// different catalogues are never interleaved. Items without a page number keep
// their original relative position after numbered pages.
export const orderPages = (items) => {
  const groupOrder = new Map();
  items.forEach((it) => {
    const g = it.catalogueId || "legacy";
    if (!groupOrder.has(g)) groupOrder.set(g, groupOrder.size);
  });
  return items
    .map((it, i) => ({ it, i }))
    .sort((a, b) => {
      const ga = groupOrder.get(a.it.catalogueId || "legacy");
      const gb = groupOrder.get(b.it.catalogueId || "legacy");
      if (ga !== gb) return ga - gb;
      const pa = a.it.pageNumber || Number.MAX_SAFE_INTEGER;
      const pb = b.it.pageNumber || Number.MAX_SAFE_INTEGER;
      if (pa !== pb) return pa - pb;
      return a.i - b.i;
    })
    .map((x) => x.it);
};

export default function LookbookMagazine({
  items: rawItems,
  selectedSet,
  selectable = true,
  keysEnabled = true,
  focusId = null,
  onFocus,
  onToggle,
  onOpen,
}) {
  const items = useMemo(() => orderPages(rawItems), [rawItems]);
  const [perView, setPerView] = useState(1);
  const [spread, setSpread] = useState(0);
  const swipe = useRef(null);
  const positioned = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const apply = () => setPerView(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Real-book layout: on wide screens the cover (page 1) stands alone, then
  // pages face each other as 2-3, 4-5 ... On phones every page is its own spread.
  const rangeOf = (s) => {
    if (perView === 1) return [s, s + 1];
    if (s === 0) return [0, 1];
    const start = 1 + (s - 1) * 2;
    return [start, start + 2];
  };
  const spreadOf = (at) =>
    perView === 1 ? at : at === 0 ? 0 : 1 + Math.floor((at - 1) / 2);
  const spreads =
    perView === 1
      ? Math.max(items.length, 1)
      : Math.max(1 + Math.ceil(Math.max(items.length - 1, 0) / 2), 1);

  // Open at the design the customer was last on (grid -> magazine switch).
  useEffect(() => {
    if (positioned.current || !focusId) return;
    const at = items.findIndex((i) => i._id === focusId);
    if (at >= 0) {
      positioned.current = true;
      setSpread(spreadOf(at));
    }
  }, [focusId, items, perView]);

  // Reset to the first page ONLY when the list of designs really changes
  // (filter/search/category) - never because a design was selected.
  const listKey = useMemo(() => items.map((i) => i._id).join(","), [items]);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSpread(0);
  }, [listKey]);
  useEffect(() => setSpread((s) => Math.min(s, spreads - 1)), [spreads]);

  // Keep the shared "current position" in step with page turns.
  const spreadMounted = useRef(false);
  useEffect(() => {
    if (!spreadMounted.current) {
      spreadMounted.current = true;
      return;
    }
    const lead = items[rangeOf(spread)[0]];
    if (lead && onFocus) onFocus(lead._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spread]);

  const go = (next) => setSpread(Math.min(Math.max(next, 0), spreads - 1));

  useEffect(() => {
    if (!keysEnabled) return undefined;
    const onKey = (e) => {
      if (isTyping(document.activeElement)) return;
      if (e.key === "ArrowRight")
        setSpread((s) => Math.min(s + 1, spreads - 1));
      if (e.key === "ArrowLeft") setSpread((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keysEnabled, spreads]);

  const current = items.slice(...rangeOf(spread));

  // Warm the next spread so page turns feel instant.
  useEffect(() => {
    items.slice(...rangeOf(spread + 1)).forEach((it) => {
      const img = new Image();
      img.src = getImageUrl(it.display || it.image);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, spread, perView]);

  if (!items.length) return null;
  const first = rangeOf(spread)[0] + 1;
  const last = Math.min(first + current.length - 1, items.length);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(dx < 0 ? spread + 1 : spread - 1);
  };

  return (
    <section className="lb-mag" aria-label="Magazine view">
      <div
        className={`lb-spread${perView === 2 ? " is-double" : ""}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {current.map((item, i) => {
          const selected = selectedSet.has(item._id);
          const code = item.styleNumber || item.title;
          return (
            <figure
              key={item._id}
              className={`lb-page${selected ? " is-selected" : ""}`}
              style={{ touchAction: "pan-y" }}
            >
              <button
                type="button"
                className="lb-page-img"
                onClick={() => onOpen(item._id)}
                aria-label={`View ${code} full screen`}
              >
                <img
                  src={getImageUrl(item.display || item.image)}
                  alt={item.title || code}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  decoding="async"
                  onError={fallback}
                />
              </button>
              <figcaption>
                <div>
                  {item.styleNumber && (
                    <h3 className="lb-page-title">{item.styleNumber}</h3>
                  )}
                  <p className="lb-meta">{itemCaption(item)}</p>
                </div>
                {selectable && !item.unselectable && (
                  <button
                    type="button"
                    className={`lb-btn lb-btn--sm${selected ? " lb-btn--accent" : ""}`}
                    aria-pressed={selected}
                    onClick={() => onToggle(item._id)}
                  >
                    {selected ? "✓ Selected" : "Select design"}
                  </button>
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="lb-pager">
        <button
          type="button"
          className="lb-icon-btn"
          onClick={() => go(spread - 1)}
          disabled={spread === 0}
          aria-label="Previous pages"
        >
          ‹
        </button>
        <input
          type="range"
          min={1}
          max={spreads}
          value={spread + 1}
          onChange={(e) => go(Number(e.target.value) - 1)}
          aria-label="Go to page"
        />
        <span className="lb-pager-label" aria-live="polite">
          {first === last ? `${first}` : `${first}–${last}`} of {items.length}
        </span>
        <button
          type="button"
          className="lb-icon-btn"
          onClick={() => go(spread + 1)}
          disabled={spread >= spreads - 1}
          aria-label="Next pages"
        >
          ›
        </button>
      </div>
    </section>
  );
}
