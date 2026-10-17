// FILE: client/src/components/lookbook/LookbookMagazineBar.js
//
// Slim top bar for the full-screen magazine. Keeps only what is needed on the
// bar (brand, collections, search icon, grid, inquiry box); the rest sits in a
// small "⋯" menu so nothing is crowded, on desktop or on a phone.
"use client";

import { useState } from "react";

const chip = (active) =>
  `shrink-0 px-3 py-1 rounded-full font-sans text-[9px] sm:text-[10px] tracking-[0.16em] uppercase font-semibold whitespace-nowrap border transition-all ${
    active
      ? "bg-[#E8D5A3] text-[#2b1710] border-[#E8D5A3]"
      : "bg-white/5 text-white/70 border-white/15 hover:bg-white/15 hover:text-white"
  }`;

const iconBtn =
  "h-9 min-w-9 px-2.5 shrink-0 rounded-full border border-white/20 text-white/85 font-sans text-[10px] tracking-[0.14em] uppercase font-bold flex items-center justify-center gap-1.5 hover:bg-white hover:text-[#7A3D2A] transition-colors";

export default function LookbookMagazineBar({
  categories,
  hiddenCategories,
  activeCategory,
  onCategory,
  searchQuery,
  onSearch,
  hasFeatured,
  featuredOnly,
  onToggleFeatured,
  canShuffle,
  onShuffle,
  onGrid,
  onOpenInbox,
  count,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const showSearch = searchOpen || searchQuery;

  return (
    <div className="shrink-0 px-3 sm:px-5 py-2 border-b border-white/10 flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-2">
      <a
        href="/"
        title="Back to the website"
        className="font-display font-bold text-[#E8D5A3] tracking-[0.14em] text-sm whitespace-nowrap hover:text-white transition-colors"
      >
        ← SANWARIYAS
      </a>

      {/* collections: one scrollable line (own row on phones) */}
      <div
        className="order-last md:order-none w-full md:w-auto md:flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Collections"
      >
        {categories.map((cat) => (
          <button key={cat} onClick={() => onCategory(cat)} className={chip(activeCategory === cat)}>
            {cat}
          </button>
        ))}
        {hiddenCategories.length > 0 && (
          <select
            aria-label="More categories"
            value={hiddenCategories.includes(activeCategory) ? activeCategory : ""}
            onChange={(e) => e.target.value && onCategory(e.target.value)}
            className={`${chip(hiddenCategories.includes(activeCategory))} cursor-pointer focus:outline-none [&>option]:text-black`}
          >
            <option value="">More</option>
            {hiddenCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {showSearch ? (
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onBlur={() => !searchQuery && setSearchOpen(false)}
            placeholder="Search…"
            aria-label="Search collections"
            className="h-9 w-28 sm:w-44 px-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/45 text-xs tracking-widest focus:outline-none focus:border-[#E8D5A3]"
          />
        ) : (
          <button type="button" onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search" title="Search">
            🔍
          </button>
        )}

        <button type="button" onClick={onGrid} className={iconBtn} title="Switch to grid view">
          ▦ <span className="hidden sm:inline">Grid</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="More options"
            className={iconBtn}
          >
            ⋯
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 w-48 rounded-xl bg-[#2b1710] border border-white/15 shadow-2xl p-1.5 font-sans text-[11px] tracking-[0.12em] uppercase">
                {hasFeatured && (
                  <button
                    onClick={() => {
                      onToggleFeatured();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-white/85 hover:bg-white/10"
                  >
                    {featuredOnly ? "✓ " : ""}★ Featured only
                  </button>
                )}
                {canShuffle && (
                  <button
                    onClick={() => {
                      onShuffle();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-white/85 hover:bg-white/10"
                  >
                    ✨ Surprise me
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenInbox}
          className="h-9 inline-flex items-center gap-2 pl-1.5 pr-3.5 rounded-full bg-[#25D366] text-white font-sans text-[10px] tracking-[0.16em] uppercase font-bold shadow-lg hover:brightness-110 active:scale-95 transition whitespace-nowrap"
        >
          <span className="flex items-center justify-center bg-white text-[#1d8a47] w-6 h-6 rounded-full text-[11px]">
            {count}
          </span>
          Inquiry<span className="hidden sm:inline"> box</span>
        </button>
      </div>
    </div>
  );
}