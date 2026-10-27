// FILE: client/src/components/lookbook/LookbookMagazineBar.js
// Sticky toolbar for the Lookbook: collections, search, view switch, filters.
"use client";

const VISIBLE_LIMIT = 5;

export default function LookbookMagazineBar({
  categories,
  activeCategory,
  onCategory,
  searchQuery,
  onSearch,
  viewMode,
  onView,
  hasFeatured,
  featuredOnly,
  onToggleFeatured,
  selectedOnly,
  onToggleSelectedOnly,
  selectedCount,
  resultCount,
}) {
  const visible = categories.slice(0, VISIBLE_LIMIT);
  const hidden = categories.slice(VISIBLE_LIMIT);

  return (
    <div className="lb-toolbar">
      <div className="lb-wrap lb-toolbar-inner">
        {categories.length > 0 ? (
        <div className="lb-chips" role="group" aria-label="Collections">
          {visible.map((cat) => (
            <button
              key={cat}
              type="button"
              className="lb-chip"
              aria-pressed={activeCategory === cat}
              onClick={() => onCategory(cat)}
            >
              {cat}
            </button>
          ))}
          {hidden.length > 0 && (
            <select
              className={`lb-chip${hidden.includes(activeCategory) ? " is-active" : ""}`}
              aria-label="More collections"
              value={hidden.includes(activeCategory) ? activeCategory : ""}
              onChange={(e) => e.target.value && onCategory(e.target.value)}
            >
              <option value="">More</option>
              {hidden.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
        ) : (
          <span />
        )}

        <div className="lb-tools">
          <input
            type="search"
            className="lb-search"
            placeholder="Search design code"
            aria-label="Search by design code or title"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          {hasFeatured && (
            <button
              type="button"
              className="lb-chip"
              aria-pressed={featuredOnly}
              onClick={onToggleFeatured}
            >
              Bestsellers
            </button>
          )}
          <button
            type="button"
            className="lb-chip"
            aria-pressed={selectedOnly}
            onClick={onToggleSelectedOnly}
            disabled={!selectedCount && !selectedOnly}
          >
            Selected ({selectedCount})
          </button>
          <div className="lb-seg" role="group" aria-label="View mode">
            <button
              type="button"
              aria-pressed={viewMode === "grid"}
              onClick={() => onView("grid")}
            >
              Grid
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "magazine"}
              onClick={() => onView("magazine")}
            >
              Magazine
            </button>
          </div>
          <span className="lb-count" aria-live="polite">
            {resultCount} design{resultCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}