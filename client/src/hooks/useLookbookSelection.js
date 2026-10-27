// FILE: client/src/hooks/useLookbookSelection.js
// Multi-select state for the Lookbook. Stores design IDs (in the order they
// were picked) in localStorage so selections survive view switches, page
// reloads and closing/reopening the viewer. One source of truth for grid,
// magazine, lightbox and the review panel.
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MAX_SELECTION } from "@/lib/lookbookWhatsApp";

const KEY = "sanwariyas_lookbook_selection_v2";
const LEGACY_KEY = "sanwariyas_lookbook_shortlist"; // array of full item objects
const ID_RE = /^[a-f\d]{24}$/i;

const readStored = (key) => {
  try {
    const v2 = JSON.parse(localStorage.getItem(key) || "null");
    if (Array.isArray(v2)) return v2.filter((x) => ID_RE.test(String(x)));
    if (key !== KEY) return [];
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
    if (Array.isArray(legacy)) {
      return legacy
        .map((x) => (typeof x === "string" ? x : x?._id))
        .filter((x) => ID_RE.test(String(x)));
    }
  } catch {
    // corrupted / blocked storage → start empty
  }
  return [];
};

// `scope` = catalogue id: every catalogue keeps its own, independent selection.
export default function useLookbookSelection(items, itemsComplete, scope = "") {
  const storageKey = scope ? `${KEY}:${scope}` : KEY;
  const [ids, setIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);

  useEffect(() => {
    setHydrated(false);
    setIds(Array.from(new Set(readStored(storageKey))).slice(0, MAX_SELECTION));
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch {
      // storage unavailable – selection still works for this session
    }
  }, [ids, hydrated, storageKey]);

  const byId = useMemo(() => new Map(items.map((i) => [i._id, i])), [items]);

  // Drop selections whose design was deleted/unpublished – but only once the
  // complete list has loaded, so a slow network never wipes a valid selection.
  useEffect(() => {
    if (!hydrated || !itemsComplete) return;
    setIds((prev) => {
      const next = prev.filter((id) => byId.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [hydrated, itemsComplete, byId]);

  const flash = useCallback((text) => {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3200);
  }, []);
  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const selectedSet = useMemo(() => new Set(ids), [ids]);

  const toggle = useCallback(
    (id) => {
      setIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= MAX_SELECTION) {
          flash(`You can select up to ${MAX_SELECTION} designs per inquiry.`);
          return prev;
        }
        return [...prev, id];
      });
    },
    [flash],
  );

  const remove = useCallback(
    (id) => setIds((prev) => prev.filter((x) => x !== id)),
    [],
  );
  const clear = useCallback(() => setIds([]), []);

  // Used for shared links (?items=a,b,c)
  const addMany = useCallback((list) => {
    setIds((prev) => {
      const merged = [...prev];
      for (const id of list) {
        if (ID_RE.test(id) && !merged.includes(id)) merged.push(id);
      }
      return merged.slice(0, MAX_SELECTION);
    });
  }, []);

  const selectedItems = useMemo(
    () => ids.map((id) => byId.get(id)).filter(Boolean),
    [ids, byId],
  );

  return {
    hydrated,
    selectedSet,
    selectedItems,
    count: selectedItems.length,
    toggle,
    remove,
    clear,
    addMany,
    notice,
  };
}