// FILE: client/src/components/lookbook/LookbookGrid.js
"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { getImageUrl } from "@/lib/imageUrl";

const CHUNK = 24;

const fallback = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = "/images/placeholder.png";
};

// The catalogue name is shown only on the first page (the cover); every other
// page shows just its page number.
export const itemCaption = (item) => {
  if (!item.pageNumber) return item.catalogueTitle || item.category || "";
  if (item.pageNumber === 1 && item.catalogueTitle) {
    return `${item.catalogueTitle} \u00B7 Page 1`;
  }
  return `Page ${item.pageNumber}`;
};

const GridCard = memo(function GridCard({
  item,
  selected,
  selectable,
  priority,
  onToggle,
  onOpen,
}) {
  const thumb = getImageUrl(item.thumb || item.image);
  const ratio =
    item.width && item.height && item.sourceType && item.sourceType !== "legacy"
      ? Math.min(Math.max(item.width / item.height, 0.4), 2.5)
      : null;
  const display = getImageUrl(item.display || item.image);
  const code = item.styleNumber || item.title;
  return (
    <li
      className={`lb-card${selected ? " is-selected" : ""}`}
      data-item-id={item._id}
    >
      <button
        type="button"
        className="lb-thumb"
        style={ratio ? { aspectRatio: String(ratio) } : undefined}
        onClick={() => onOpen(item._id)}
        aria-label={`View ${code} full screen`}
      >
        <img
          src={thumb}
          srcSet={
            thumb !== display ? `${thumb} 560w, ${display} 1400w` : undefined
          }
          sizes="(max-width: 640px) 50vw, 240px"
          alt={item.title || code}
          data-fit={
            item.sourceType && item.sourceType !== "legacy"
              ? "contain"
              : "cover"
          }
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onError={fallback}
        />
      </button>
      {item.badge && item.badge !== "None" && (
        <span className="lb-badge">{item.badge}</span>
      )}
      {selectable && (
        <button
          type="button"
          role="checkbox"
          aria-checked={selected}
          aria-label={`Select design ${code}`}
          className="lb-check"
          onClick={() => onToggle(item._id)}
        >
          {selected ? "✓" : "+"}
        </button>
      )}
      <div className="lb-card-body">
        <div>
          {item.styleNumber && <p className="lb-code">{item.styleNumber}</p>}
          <p className="lb-meta">{itemCaption(item)}</p>
        </div>
      </div>
    </li>
  );
});

export default function LookbookGrid({
  items,
  selectedSet,
  selectable = true,
  focusId = null,
  onToggle,
  onOpen,
}) {
  // Start far enough down to include the design the customer was last on
  // (e.g. when switching back from Magazine view).
  const [visible, setVisible] = useState(() => {
    const at = focusId ? items.findIndex((i) => i._id === focusId) : -1;
    return at >= 0 ? Math.min(items.length, at + CHUNK) : CHUNK;
  });
  const sentinel = useRef(null);
  const listRef = useRef(null);
  const restored = useRef(false);

  // Only collapse the window when the LIST OF DESIGNS really changes
  // (filter/search/category) - never because of a selection change.
  const listKey = useMemo(() => items.map((i) => i._id).join(","), [items]);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setVisible(CHUNK);
  }, [listKey]);

  useEffect(() => {
    if (restored.current || !focusId) return;
    restored.current = true;
    const node = listRef.current?.querySelector(`[data-item-id="${focusId}"]`);
    if (node) node.scrollIntoView({ block: "center" });
  }, [focusId]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || visible >= items.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((v) => Math.min(v + CHUNK, items.length));
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visible, items.length]);

  return (
    <>
      <ul className="lb-grid" aria-label="Catalogue designs" ref={listRef}>
        {items.slice(0, visible).map((item, i) => (
          <GridCard
            key={item._id}
            item={item}
            selected={selectedSet.has(item._id)}
            selectable={selectable && !item.unselectable}
            priority={i < 4}
            onToggle={onToggle}
            onOpen={onOpen}
          />
        ))}
      </ul>
      {visible < items.length && <div ref={sentinel} className="lb-sentinel" />}
    </>
  );
}
