// // FILE: client/src/app/lookbook/page.js
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { getImageUrl } from "@/lib/imageUrl";
// import Footer from "@/components/layout/Footer";
// import LookbookGrid from "@/components/lookbook/LookbookGrid";
// import LookbookMagazine, {
//   orderPages,
// } from "@/components/lookbook/LookbookMagazine";
// import LookbookMagazineBar from "@/components/lookbook/LookbookMagazineBar";
// import LookbookModal from "@/components/lookbook/LookbookModal";
// import LookbookInquirySheet from "@/components/lookbook/LookbookInquirySheet";
// import useLookbookSelection from "@/hooks/useLookbookSelection";
// import {
//   fetchCatalogueItems,
//   fetchLookbookConfig,
//   fetchLookbookQuestions,
//   fetchPublishedCatalogues,
// } from "@/lib/lookbookApi";
// import "@/components/lookbook/lookbook.css";

// const ALL = "All Collections";
// const ANSWERS_KEY = "sanwariyas_lookbook_answers";
// const VIEW_KEY = "sanwariyas_lookbook_view";

// // null = no usable catalogue in the URL; invalid = the URL had a malformed id
// const readCatalogueParam = () => {
//   const raw = new URLSearchParams(window.location.search).get("catalogue");
//   if (raw === null) return { id: null, invalid: false };
//   if (/^[a-f\d]{24}$/i.test(raw)) return { id: raw, invalid: false };
//   return { id: null, invalid: true };
// };

// export default function LookbookPage() {
//   // undefined = still reading the URL, null = show the catalogue chooser, string = open catalogue
//   const [catalogueId, setCatalogueId] = useState(undefined);
//   const [cataloguesLoaded, setCataloguesLoaded] = useState(false);
//   const [shareMsg, setShareMsg] = useState("");
//   const [linkNotice, setLinkNotice] = useState("");
//   const [badLink, setBadLink] = useState(false);
//   const [items, setItems] = useState([]);
//   const [complete, setComplete] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
//   const [reloadKey, setReloadKey] = useState(0);

//   const [activeCategory, setActiveCategory] = useState(ALL);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [featuredOnly, setFeaturedOnly] = useState(false);
//   const [selectedOnly, setSelectedOnly] = useState(false);
//   const [viewMode, setViewMode] = useState("grid");
//   // last design the customer touched/viewed: lets Grid and Magazine reopen at the same spot
//   const [focusId, setFocusId] = useState(null);

//   const [lightbox, setLightbox] = useState(null); // { items, index }
//   const [sheetOpen, setSheetOpen] = useState(false);

//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [catalogues, setCatalogues] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});

//   const selection = useLookbookSelection(
//     items,
//     complete,
//     catalogueId || "none",
//   );
//   const { selectedSet, selectedItems, count, toggle, remove, clear, addMany } =
//     selection;

//   // ── one-time setup: settings, questions, saved view + answers ───────────
//   useEffect(() => {
//     try {
//       const v = localStorage.getItem(VIEW_KEY);
//       if (v === "grid" || v === "magazine") setViewMode(v);
//       const saved = JSON.parse(localStorage.getItem(ANSWERS_KEY) || "{}");
//       if (saved && typeof saved === "object") setAnswers(saved);
//     } catch {
//       // ignore corrupted storage
//     }
//     fetchLookbookConfig()
//       .then((d) => d.success && setWhatsappNumber(d.whatsappNumber || ""))
//       .catch(() => {});
//     fetchLookbookQuestions()
//       .then((d) => d.success && setQuestions(d.questions || []))
//       .catch(() => {});
//     fetchPublishedCatalogues()
//       .then((d) => d.success && setCatalogues(d.catalogues || []))
//       .catch(() => {})
//       .finally(() => setCataloguesLoaded(true));

//     const resolve = () => {
//       const { id, invalid } = readCatalogueParam();
//       setBadLink(invalid);
//       // a malformed link is replaced by the clean catalogue list URL
//       if (invalid) window.history.replaceState(null, "", "/lookbook");
//       setCatalogueId(id);
//     };
//     resolve();
//     const onPop = () => resolve();
//     window.addEventListener("popstate", onPop);
//     return () => window.removeEventListener("popstate", onPop);
//   }, []);

//   // ── load all designs (progressively) ─────────────────────────────────────
//   useEffect(() => {
//     let cancelled = false;
//     setItems([]);
//     setLightbox(null);
//     setFocusId(null);
//     setLinkNotice("");
//     if (!catalogueId) {
//       setLoading(false);
//       setComplete(false);
//       return undefined;
//     }
//     setLoading(true);
//     setLoadError("");
//     setComplete(false);
//     fetchCatalogueItems(catalogueId, (soFar) => {
//       if (cancelled) return;
//       setItems(soFar);
//       setLoading(false);
//     })
//       .then((all) => {
//         if (cancelled) return;
//         setItems(all);
//         setComplete(true);
//       })
//       .catch((err) => {
//         if (cancelled) return;
//         setLoadError(
//           err.userMessage || "We couldn't load the lookbook. Please try again.",
//         );
//       })
//       .finally(() => !cancelled && setLoading(false));
//     return () => {
//       cancelled = true;
//     };
//   }, [reloadKey, catalogueId]);

//   // ── deep links: ?item=<id> opens the viewer, ?items=a,b,c preselects ────
//   useEffect(() => {
//     if (!complete) return;
//     const params = new URLSearchParams(window.location.search);
//     const bundle = params.get("items");
//     if (bundle) {
//       const ids = bundle.split(",").slice(0, 40);
//       addMany(ids);
//       setSelectedOnly(true);
//     }
//     const one = params.get("item");
//     if (one) {
//       const idx = items.findIndex((i) => i._id === one);
//       if (idx >= 0) setLightbox({ items, index: idx });
//       else
//         setLinkNotice(
//           "Sorry, the design from this link is no longer available. Here is the current catalogue.",
//         );
//     } else if (
//       bundle &&
//       !bundle.split(",").some((id) => items.some((i) => i._id === id))
//     ) {
//       setLinkNotice(
//         "Sorry, the designs from this link are no longer available. Here is the current catalogue.",
//       );
//     }
//     // run once after the first complete load
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [complete]);

//   useEffect(() => {
//     try {
//       localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
//     } catch {
//       // storage blocked – fine
//     }
//   }, [answers]);

//   const changeView = (mode) => {
//     setViewMode(mode);
//     try {
//       localStorage.setItem(VIEW_KEY, mode);
//     } catch {
//       // ignore
//     }
//   };

//   const onAnswer = useCallback((q, option) => {
//     setAnswers((prev) => {
//       const current = prev[q._id]?.answer || [];
//       let nextAnswer;
//       if (q.type === "multiple") {
//         nextAnswer = current.includes(option)
//           ? current.filter((o) => o !== option)
//           : [...current, option];
//       } else {
//         nextAnswer = current[0] === option ? [] : [option];
//       }
//       const next = { ...prev };
//       if (nextAnswer.length)
//         next[q._id] = { question: q.text, answer: nextAnswer };
//       else delete next[q._id];
//       return next;
//     });
//   }, []);

//   // ── filtering ────────────────────────────────────────────────────────────
//   // ROOT CAUSE of "jumps back to page 1": `filtered` used to depend on
//   // selectedSet always, so every select/deselect produced a new array and the
//   // Grid/Magazine reset their position. It now only depends on the selection
//   // while "Selected only" is on.
//   const selectionFilter = selectedOnly ? selectedSet : null;

//   const filtered = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     return items.filter((i) => {
//       if (activeCategory !== ALL && i.category !== activeCategory) return false;
//       if (featuredOnly && !i.isFeatured) return false;
//       if (selectionFilter && !selectionFilter.has(i._id)) return false;
//       if (!q) return true;
//       return [i.styleNumber, i.title, i.category, i.catalogueTitle]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(q));
//     });
//   }, [items, activeCategory, featuredOnly, selectionFilter, searchQuery]);

//   // "Selected only" with nothing left selected would show a blank page.
//   useEffect(() => {
//     if (selectedOnly && count === 0) setSelectedOnly(false);
//   }, [selectedOnly, count]);

//   const toggleDesign = useCallback(
//     (id) => {
//       setFocusId(id);
//       toggle(id);
//     },
//     [toggle],
//   );

//   const openViewer = useCallback(
//     (id) => {
//       setFocusId(id);
//       const list = viewMode === "magazine" ? orderPages(filtered) : filtered;
//       const idx = list.findIndex((i) => i._id === id);
//       if (idx >= 0) setLightbox({ items: list, index: idx });
//     },
//     [filtered, viewMode],
//   );

//   const activeCatalogue = catalogues.find((c) => c._id === catalogueId);

//   const openCatalogue = (id, replace = false) => {
//     setBadLink(false);
//     window.history[replace ? "replaceState" : "pushState"](
//       null,
//       "",
//       id ? `/lookbook?catalogue=${id}` : "/lookbook",
//     );
//     setActiveCategory(ALL);
//     setSearchQuery("");
//     setFeaturedOnly(false);
//     setSelectedOnly(false);
//     setCatalogueId(id);
//     window.scrollTo({ top: 0 });
//   };

//   // Only one catalogue published: open it directly.
//   useEffect(() => {
//     if (cataloguesLoaded && catalogueId === null && catalogues.length === 1) {
//       openCatalogue(catalogues[0]._id, true);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [cataloguesLoaded, catalogueId, catalogues]);

//   const shareCatalogue = async () => {
//     const url = `${window.location.origin}/lookbook?catalogue=${catalogueId}`;
//     const title = activeCatalogue?.title || "SANWARIYAS Catalogue";
//     try {
//       if (navigator.share) {
//         await navigator.share({ title, url });
//         return;
//       }
//       await navigator.clipboard.writeText(url);
//       setShareMsg("Catalogue link copied");
//     } catch {
//       setShareMsg(url);
//     }
//     setTimeout(() => setShareMsg(""), 3500);
//   };

//   const clearFilters = () => {
//     setActiveCategory(ALL);
//     setSearchQuery("");
//     setFeaturedOnly(false);
//     setSelectedOnly(false);
//   };

//   if (
//     catalogueId === undefined ||
//     (catalogueId === null && !cataloguesLoaded)
//   ) {
//     return (
//       <div className="lb-root min-h-screen">
//         <div className="lb-wrap">
//           <div className="lb-grid" aria-busy="true">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="lb-skel" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (catalogueId === null) {
//     return (
//       <div className="lb-root min-h-screen">
//         <header className="lb-hero">
//           <div className="lb-wrap">
//             <p className="lb-eyebrow">SANWARIYAS · Wholesale Ethnic Wear</p>
//             <h1 className="lb-title">Our Catalogues</h1>
//             <p className="lb-sub">
//               Choose a catalogue to browse, tick the designs you like and send
//               them to us in one WhatsApp inquiry.
//             </p>
//             {badLink && (
//               <p className="lb-notice" role="status">
//                 Sorry, that catalogue link is not valid. Please choose a
//                 catalogue below.
//               </p>
//             )}
//           </div>
//         </header>
//         <main className="lb-wrap" id="lookbook-content">
//           {catalogues.length === 0 ? (
//             <div className="lb-empty">
//               <h2>New designs are on their way</h2>
//               <p>
//                 No catalogue has been published yet. Please check back soon.
//               </p>
//             </div>
//           ) : (
//             <ul className="lb-cat-grid">
//               {catalogues.map((c) => (
//                 <li key={c._id}>
//                   <button
//                     type="button"
//                     className="lb-cat-card"
//                     onClick={() => openCatalogue(c._id)}
//                   >
//                     <span className="lb-pick-cover">
//                       {c.cover ? (
//                         // eslint-disable-next-line @next/next/no-img-element
//                         <img
//                           src={getImageUrl(c.cover)}
//                           alt={`${c.title} cover`}
//                           loading="lazy"
//                         />
//                       ) : null}
//                     </span>
//                     <span className="lb-cat-body">
//                       <strong>{c.title}</strong>
//                       <span className="lb-meta">
//                         {[c.season, `${c.count} designs`]
//                           .filter(Boolean)
//                           .join(" · ")}
//                       </span>
//                       <span className="lb-cat-open">View catalogue →</span>
//                     </span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (complete && !items.length && !loadError) {
//     return (
//       <div className="lb-root min-h-screen">
//         <header className="lb-hero">
//           <div className="lb-wrap">
//             <p className="lb-eyebrow">SANWARIYAS · Wholesale Ethnic Wear</p>
//             <h1 className="lb-title">This catalogue is no longer available</h1>
//             <p className="lb-sub">
//               Sorry, the catalogue or image from this link has been removed or
//               replaced. Please see our current catalogues.
//             </p>
//           </div>
//         </header>
//         <main className="lb-wrap" id="lookbook-content">
//           <div className="lb-empty">
//             <button
//               type="button"
//               className="lb-btn lb-btn--accent"
//               onClick={() => openCatalogue(null)}
//             >
//               See the new catalogues
//             </button>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="lb-root min-h-screen">
//       <header className="lb-hero">
//         <div className="lb-wrap">
//           <p className="lb-eyebrow">SANWARIYAS · Wholesale Ethnic Wear</p>
//           <h1 className="lb-title">
//             {activeCatalogue ? activeCatalogue.title : "Catalogue"}
//           </h1>
//           <p className="lb-sub">
//             {activeCatalogue
//               ? [activeCatalogue.season, activeCatalogue.description]
//                   .filter(Boolean)
//                   .join(" · ") ||
//                 "Browse the collection and select your favourites."
//               : "Tick every design you like and send them all to us in one WhatsApp inquiry."}
//           </p>
//           <div className="lb-hero-actions">
//             {catalogues.length > 1 && (
//               <button
//                 type="button"
//                 className="lb-chip"
//                 onClick={() => openCatalogue(null)}
//               >
//                 ← All catalogues
//               </button>
//             )}
//             <button type="button" className="lb-chip" onClick={shareCatalogue}>
//               Share this catalogue
//             </button>
//           </div>
//           {shareMsg && (
//             <p className="lb-meta" role="status">
//               {shareMsg}
//             </p>
//           )}
//           {linkNotice && (
//             <p className="lb-notice" role="status">
//               {linkNotice}
//             </p>
//           )}
//         </div>
//       </header>

//       <LookbookMagazineBar
//         categories={[]}
//         activeCategory={activeCategory}
//         onCategory={setActiveCategory}
//         searchQuery={searchQuery}
//         onSearch={setSearchQuery}
//         viewMode={viewMode}
//         onView={changeView}
//         hasFeatured={items.some((i) => i.isFeatured)}
//         featuredOnly={featuredOnly}
//         onToggleFeatured={() => setFeaturedOnly((v) => !v)}
//         selectedOnly={selectedOnly}
//         onToggleSelectedOnly={() => setSelectedOnly((v) => !v)}
//         selectedCount={count}
//         resultCount={filtered.length}
//       />

//       <main className="lb-wrap" id="lookbook-content">
//         {loading && !items.length ? (
//           <div
//             className="lb-grid"
//             aria-busy="true"
//             aria-label="Loading designs"
//           >
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="lb-skel" />
//             ))}
//           </div>
//         ) : loadError && !items.length ? (
//           <div className="lb-empty" role="alert">
//             <h2>Couldn&apos;t load the lookbook</h2>
//             <p>{loadError}</p>
//             <button
//               type="button"
//               className="lb-btn lb-btn--accent"
//               onClick={() => setReloadKey((k) => k + 1)}
//             >
//               Try again
//             </button>
//           </div>
//         ) : !items.length ? (
//           <div className="lb-empty">
//             <h2>Catalogue unavailable</h2>
//             <p>
//               This catalogue is not available. It may have been unpublished.
//             </p>
//             {catalogues.length > 0 && (
//               <button
//                 type="button"
//                 className="lb-btn lb-btn--accent"
//                 onClick={() => openCatalogue(null)}
//               >
//                 View all catalogues
//               </button>
//             )}
//           </div>
//         ) : !filtered.length ? (
//           <div className="lb-empty">
//             <h2>No designs match</h2>
//             <p>Try a different collection or search term.</p>
//             <button
//               type="button"
//               className="lb-btn lb-btn--accent"
//               onClick={clearFilters}
//             >
//               Clear filters
//             </button>
//           </div>
//         ) : viewMode === "grid" ? (
//           <LookbookGrid
//             items={filtered}
//             selectedSet={selectedSet}
//             focusId={focusId}
//             onFocus={setFocusId}
//             onToggle={toggleDesign}
//             onOpen={openViewer}
//           />
//         ) : (
//           <LookbookMagazine
//             items={filtered}
//             selectedSet={selectedSet}
//             keysEnabled={!lightbox && !sheetOpen}
//             focusId={focusId}
//             onFocus={setFocusId}
//             onToggle={toggleDesign}
//             onOpen={openViewer}
//           />
//         )}
//         {loadError && items.length > 0 && (
//           <p className="lb-note" role="alert">
//             Some designs could not be loaded. {loadError}
//           </p>
//         )}
//       </main>

//       {count > 0 && !sheetOpen && !lightbox && (
//         <button
//           type="button"
//           className="lb-btn lb-btn--wa lb-fab"
//           onClick={() => setSheetOpen(true)}
//         >
//           Send Inquiry on WhatsApp ({count} Design{count === 1 ? "" : "s"})
//         </button>
//       )}

//       {selection.notice && (
//         <div className="lb-toast" role="status">
//           {selection.notice}
//         </div>
//       )}

//       {lightbox && (
//         <LookbookModal
//           items={lightbox.items}
//           index={lightbox.index}
//           selectedSet={selectedSet}
//           onIndex={(index) =>
//             setLightbox((l) => {
//               if (l?.items[index]) setFocusId(l.items[index]._id);
//               return l && { ...l, index };
//             })
//           }
//           onClose={() => setLightbox(null)}
//           onToggle={toggleDesign}
//         />
//       )}

//       {sheetOpen && (
//         <LookbookInquirySheet
//           open
//           items={selectedItems}
//           questions={questions}
//           answers={answers}
//           whatsappNumber={whatsappNumber}
//           onAnswer={onAnswer}
//           onRemove={remove}
//           onClear={clear}
//           onClose={() => setSheetOpen(false)}
//         />
//       )}

//       <Footer />
//     </div>
//   );
// }

// FILE: client/src/app/lookbook/page.js
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@/lib/imageUrl";
import Footer from "@/components/layout/Footer";
import LookbookGrid from "@/components/lookbook/LookbookGrid";
import LookbookMagazine, {
  orderPages,
} from "@/components/lookbook/LookbookMagazine";
import LookbookMagazineBar from "@/components/lookbook/LookbookMagazineBar";
import LookbookModal from "@/components/lookbook/LookbookModal";
import LookbookInquirySheet from "@/components/lookbook/LookbookInquirySheet";
import useLookbookSelection from "@/hooks/useLookbookSelection";
import {
  fetchCatalogueItems,
  fetchLookbookConfig,
  fetchLookbookQuestions,
  fetchPublishedCatalogues,
} from "@/lib/lookbookApi";
import "@/components/lookbook/lookbook.css";

const ALL = "All Collections";
const ANSWERS_KEY = "sanwariyas_lookbook_answers";
const VIEW_KEY = "sanwariyas_lookbook_view";

// The first page (cover) and the last page (closing / thank-you page) of a
// catalogue are not designs, so they cannot be selected. The last page is only
// known once every page has loaded.
const markEdges = (list, done) => {
  const numbers = list
    .filter((i) => i.sourceType === "page" && i.pageNumber)
    .map((i) => i.pageNumber);
  if (numbers.length < 3) return list;
  const first = Math.min(...numbers);
  const last = Math.max(...numbers);
  return list.map((i) =>
    i.sourceType === "page" &&
    (i.pageNumber === first || (done && i.pageNumber === last))
      ? { ...i, unselectable: true }
      : i,
  );
};

// null = no usable catalogue in the URL; invalid = the URL had a malformed id
const readCatalogueParam = () => {
  const raw = new URLSearchParams(window.location.search).get("catalogue");
  if (raw === null) return { id: null, invalid: false };
  if (/^[a-f\d]{24}$/i.test(raw)) return { id: raw, invalid: false };
  return { id: null, invalid: true };
};

export default function LookbookPage() {
  // undefined = still reading the URL, null = show the catalogue chooser, string = open catalogue
  const [catalogueId, setCatalogueId] = useState(undefined);
  const [cataloguesLoaded, setCataloguesLoaded] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [linkNotice, setLinkNotice] = useState("");
  const [badLink, setBadLink] = useState(false);
  const [items, setItems] = useState([]);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [activeCategory, setActiveCategory] = useState(ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  // last design the customer touched/viewed: lets Grid and Magazine reopen at the same spot
  const [focusId, setFocusId] = useState(null);

  const [lightbox, setLightbox] = useState(null); // { items, index }
  const [sheetOpen, setSheetOpen] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [catalogues, setCatalogues] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const selectableItems = useMemo(
    () => items.filter((i) => !i.unselectable),
    [items],
  );
  const selection = useLookbookSelection(
    selectableItems,
    complete,
    catalogueId || "none",
  );
  const { selectedSet, selectedItems, count, toggle, remove, clear, addMany } =
    selection;

  // ── one-time setup: settings, questions, saved view + answers ───────────
  useEffect(() => {
    try {
      const v = localStorage.getItem(VIEW_KEY);
      if (v === "grid" || v === "magazine") setViewMode(v);
      const saved = JSON.parse(localStorage.getItem(ANSWERS_KEY) || "{}");
      if (saved && typeof saved === "object") setAnswers(saved);
    } catch {
      // ignore corrupted storage
    }
    fetchLookbookConfig()
      .then((d) => d.success && setWhatsappNumber(d.whatsappNumber || ""))
      .catch(() => {});
    fetchLookbookQuestions()
      .then((d) => d.success && setQuestions(d.questions || []))
      .catch(() => {});
    fetchPublishedCatalogues()
      .then((d) => d.success && setCatalogues(d.catalogues || []))
      .catch(() => {})
      .finally(() => setCataloguesLoaded(true));

    const resolve = () => {
      const { id, invalid } = readCatalogueParam();
      setBadLink(invalid);
      // a malformed link is replaced by the clean catalogue list URL
      if (invalid) window.history.replaceState(null, "", "/lookbook");
      setCatalogueId(id);
    };
    resolve();
    const onPop = () => resolve();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ── load all designs (progressively) ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setItems([]);
    setLightbox(null);
    setFocusId(null);
    setLinkNotice("");
    if (!catalogueId) {
      setLoading(false);
      setComplete(false);
      return undefined;
    }
    setLoading(true);
    setLoadError("");
    setComplete(false);
    fetchCatalogueItems(catalogueId, (soFar) => {
      if (cancelled) return;
      setItems(markEdges(soFar, false));
      setLoading(false);
    })
      .then((all) => {
        if (cancelled) return;
        setItems(markEdges(all, true));
        setComplete(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err.userMessage || "We couldn't load the lookbook. Please try again.",
        );
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [reloadKey, catalogueId]);

  // ── deep links: ?item=<id> opens the viewer, ?items=a,b,c preselects ────
  useEffect(() => {
    if (!complete) return;
    const params = new URLSearchParams(window.location.search);
    const bundle = params.get("items");
    if (bundle) {
      const ids = bundle.split(",").slice(0, 40);
      addMany(ids);
      setSelectedOnly(true);
    }
    const one = params.get("item");
    if (one) {
      const idx = items.findIndex((i) => i._id === one);
      if (idx >= 0) setLightbox({ items, index: idx });
      else
        setLinkNotice(
          "Sorry, the design from this link is no longer available. Here is the current catalogue.",
        );
    } else if (
      bundle &&
      !bundle.split(",").some((id) => items.some((i) => i._id === id))
    ) {
      setLinkNotice(
        "Sorry, the designs from this link are no longer available. Here is the current catalogue.",
      );
    }
    // run once after the first complete load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete]);

  useEffect(() => {
    try {
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    } catch {
      // storage blocked – fine
    }
  }, [answers]);

  const changeView = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_KEY, mode);
    } catch {
      // ignore
    }
  };

  const onAnswer = useCallback((q, option) => {
    setAnswers((prev) => {
      const current = prev[q._id]?.answer || [];
      let nextAnswer;
      if (q.type === "multiple") {
        nextAnswer = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
      } else {
        nextAnswer = current[0] === option ? [] : [option];
      }
      const next = { ...prev };
      if (nextAnswer.length)
        next[q._id] = { question: q.text, answer: nextAnswer };
      else delete next[q._id];
      return next;
    });
  }, []);

  // ── filtering ────────────────────────────────────────────────────────────
  // ROOT CAUSE of "jumps back to page 1": `filtered` used to depend on
  // selectedSet always, so every select/deselect produced a new array and the
  // Grid/Magazine reset their position. It now only depends on the selection
  // while "Selected only" is on.
  const selectionFilter = selectedOnly ? selectedSet : null;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((i) => {
      if (activeCategory !== ALL && i.category !== activeCategory) return false;
      if (featuredOnly && !i.isFeatured) return false;
      if (selectionFilter && !selectionFilter.has(i._id)) return false;
      if (!q) return true;
      return [i.styleNumber, i.title, i.category, i.catalogueTitle]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [items, activeCategory, featuredOnly, selectionFilter, searchQuery]);

  // "Selected only" with nothing left selected would show a blank page.
  useEffect(() => {
    if (selectedOnly && count === 0) setSelectedOnly(false);
  }, [selectedOnly, count]);

  const toggleDesign = useCallback(
    (id) => {
      if (items.find((i) => i._id === id)?.unselectable) return;
      setFocusId(id);
      toggle(id);
    },
    [toggle, items],
  );

  const openViewer = useCallback(
    (id) => {
      setFocusId(id);
      const list = viewMode === "magazine" ? orderPages(filtered) : filtered;
      const idx = list.findIndex((i) => i._id === id);
      if (idx >= 0) setLightbox({ items: list, index: idx });
    },
    [filtered, viewMode],
  );

  const activeCatalogue = catalogues.find((c) => c._id === catalogueId);

  const openCatalogue = (id, replace = false) => {
    setBadLink(false);
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      id ? `/lookbook?catalogue=${id}` : "/lookbook",
    );
    setActiveCategory(ALL);
    setSearchQuery("");
    setFeaturedOnly(false);
    setSelectedOnly(false);
    setCatalogueId(id);
    window.scrollTo({ top: 0 });
  };

  // Only one catalogue published: open it directly.
  useEffect(() => {
    if (cataloguesLoaded && catalogueId === null && catalogues.length === 1) {
      openCatalogue(catalogues[0]._id, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cataloguesLoaded, catalogueId, catalogues]);

  const shareCatalogue = async () => {
    const url = `${window.location.origin}/lookbook?catalogue=${catalogueId}`;
    const title = activeCatalogue?.title || "SANWARIYAS Catalogue";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMsg("Catalogue link copied");
    } catch {
      setShareMsg(url);
    }
    setTimeout(() => setShareMsg(""), 3500);
  };

  const clearFilters = () => {
    setActiveCategory(ALL);
    setSearchQuery("");
    setFeaturedOnly(false);
    setSelectedOnly(false);
  };

  if (
    catalogueId === undefined ||
    (catalogueId === null && !cataloguesLoaded)
  ) {
    return (
      <div className="lb-root min-h-screen">
        <div className="lb-wrap">
          <div className="lb-grid" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="lb-skel" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (catalogueId === null) {
    return (
      <div className="lb-root min-h-screen">
        <header className="lb-hero">
          <div className="lb-wrap">
            <p className="lb-eyebrow">SANWARIYAS · Wholesale Ethnic Wear</p>
            <h1 className="lb-title">Our Catalogues</h1>
            <p className="lb-sub">
              Choose a catalogue to browse, tick the designs you like and send
              them to us in one WhatsApp inquiry.
            </p>
            {badLink && (
              <p className="lb-notice" role="status">
                Sorry, that catalogue link is not valid. Please choose a
                catalogue below.
              </p>
            )}
          </div>
        </header>
        <main className="lb-wrap" id="lookbook-content">
          {catalogues.length === 0 ? (
            <div className="lb-empty">
              <h2>New designs are on their way</h2>
              <p>
                No catalogue has been published yet. Please check back soon.
              </p>
            </div>
          ) : (
            <ul className="lb-cat-grid">
              {catalogues.map((c) => (
                <li key={c._id}>
                  <button
                    type="button"
                    className="lb-cat-card"
                    onClick={() => openCatalogue(c._id)}
                  >
                    <span className="lb-pick-cover">
                      {c.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getImageUrl(c.cover)}
                          alt={`${c.title} cover`}
                          loading="lazy"
                        />
                      ) : null}
                    </span>
                    <span className="lb-cat-body">
                      <strong>{c.title}</strong>
                      <span className="lb-meta">
                        {[c.season, `${c.count} designs`]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                      <span className="lb-cat-open">View catalogue →</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (complete && !items.length && !loadError) {
    return (
      <div className="lb-root min-h-screen">
        <header className="lb-hero">
          <div className="lb-wrap">
            <p className="lb-eyebrow">SANWARIYAS · Wholesale Ethnic Wear</p>
            <h1 className="lb-title">This catalogue is no longer available</h1>
            <p className="lb-sub">
              Sorry, the catalogue or image from this link has been removed or
              replaced. Please see our current catalogues.
            </p>
          </div>
        </header>
        <main className="lb-wrap" id="lookbook-content">
          <div className="lb-empty">
            <button
              type="button"
              className="lb-btn lb-btn--accent"
              onClick={() => openCatalogue(null)}
            >
              See the new catalogues
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="lb-root min-h-screen">
      <header className="lb-hero">
        <div className="lb-wrap">
          <p className="lb-eyebrow">SANWARIYAS · Wholesale Ethnic Wear</p>
          <h1 className="lb-title">
            {activeCatalogue ? activeCatalogue.title : "Catalogue"}
          </h1>
          <p className="lb-sub">
            {activeCatalogue
              ? [activeCatalogue.season, activeCatalogue.description]
                  .filter(Boolean)
                  .join(" · ") ||
                "Browse the collection and select your favourites."
              : "Tick every design you like and send them all to us in one WhatsApp inquiry."}
          </p>
          <div className="lb-hero-actions">
            {catalogues.length > 1 && (
              <button
                type="button"
                className="lb-chip"
                onClick={() => openCatalogue(null)}
              >
                ← All catalogues
              </button>
            )}
            <button type="button" className="lb-chip" onClick={shareCatalogue}>
              Share this catalogue
            </button>
          </div>
          {shareMsg && (
            <p className="lb-meta" role="status">
              {shareMsg}
            </p>
          )}
          {linkNotice && (
            <p className="lb-notice" role="status">
              {linkNotice}
            </p>
          )}
        </div>
      </header>

      <LookbookMagazineBar
        categories={[]}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        viewMode={viewMode}
        onView={changeView}
        hasFeatured={items.some((i) => i.isFeatured)}
        featuredOnly={featuredOnly}
        onToggleFeatured={() => setFeaturedOnly((v) => !v)}
        selectedOnly={selectedOnly}
        onToggleSelectedOnly={() => setSelectedOnly((v) => !v)}
        selectedCount={count}
        resultCount={filtered.length}
      />

      <main className="lb-wrap" id="lookbook-content">
        {loading && !items.length ? (
          <div
            className="lb-grid"
            aria-busy="true"
            aria-label="Loading designs"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="lb-skel" />
            ))}
          </div>
        ) : loadError && !items.length ? (
          <div className="lb-empty" role="alert">
            <h2>Couldn&apos;t load the lookbook</h2>
            <p>{loadError}</p>
            <button
              type="button"
              className="lb-btn lb-btn--accent"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              Try again
            </button>
          </div>
        ) : !items.length ? (
          <div className="lb-empty">
            <h2>Catalogue unavailable</h2>
            <p>
              This catalogue is not available. It may have been unpublished.
            </p>
            {catalogues.length > 0 && (
              <button
                type="button"
                className="lb-btn lb-btn--accent"
                onClick={() => openCatalogue(null)}
              >
                View all catalogues
              </button>
            )}
          </div>
        ) : !filtered.length ? (
          <div className="lb-empty">
            <h2>No designs match</h2>
            <p>Try a different collection or search term.</p>
            <button
              type="button"
              className="lb-btn lb-btn--accent"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <LookbookGrid
            items={filtered}
            selectedSet={selectedSet}
            focusId={focusId}
            onFocus={setFocusId}
            onToggle={toggleDesign}
            onOpen={openViewer}
          />
        ) : (
          <LookbookMagazine
            items={filtered}
            selectedSet={selectedSet}
            keysEnabled={!lightbox && !sheetOpen}
            focusId={focusId}
            onFocus={setFocusId}
            onToggle={toggleDesign}
            onOpen={openViewer}
          />
        )}
        {loadError && items.length > 0 && (
          <p className="lb-note" role="alert">
            Some designs could not be loaded. {loadError}
          </p>
        )}
      </main>

      {count > 0 && !sheetOpen && !lightbox && (
        <button
          type="button"
          className="lb-btn lb-btn--wa lb-fab"
          onClick={() => setSheetOpen(true)}
        >
          Send Inquiry on WhatsApp ({count} Design{count === 1 ? "" : "s"})
        </button>
      )}

      {selection.notice && (
        <div className="lb-toast" role="status">
          {selection.notice}
        </div>
      )}

      {lightbox && (
        <LookbookModal
          items={lightbox.items}
          index={lightbox.index}
          selectedSet={selectedSet}
          onIndex={(index) =>
            setLightbox((l) => {
              if (l?.items[index]) setFocusId(l.items[index]._id);
              return l && { ...l, index };
            })
          }
          onClose={() => setLightbox(null)}
          onToggle={toggleDesign}
        />
      )}

      {sheetOpen && (
        <LookbookInquirySheet
          open
          items={selectedItems}
          questions={questions}
          answers={answers}
          whatsappNumber={whatsappNumber}
          onAnswer={onAnswer}
          onRemove={remove}
          onClear={clear}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
