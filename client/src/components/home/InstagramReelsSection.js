// // FILE: client/src/components/home/InstagramReelsSection.js
// /* eslint-disable @next/next/no-img-element */
// "use client";

// import { useEffect, useRef, useState } from "react";
// import api from "@/lib/api";

// // Change this if the Instagram account ever changes.
// const INSTAGRAM_USERNAME = "sanwariyas_jaipur";
// const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

// export default function InstagramReelsSection() {
//   const [reels, setReels] = useState([]);
//   const [playingId, setPlayingId] = useState(null);
//   // Reels whose video failed to load (e.g. Instagram's CDN link expired
//   // between syncs) — these fall back to "Watch on Instagram" instead of
//   // showing a dead player.
//   const [brokenIds, setBrokenIds] = useState(() => new Set());
//   const stripRef = useRef(null);

//   useEffect(() => {
//     let cancelled = false;
//     api
//       .get("/instagram/reels", { params: { limit: 12 } })
//       .then((res) => {
//         if (!cancelled) setReels(res.data?.reels || []);
//       })
//       .catch(() => {
//         // This section is a nice-to-have. If the request fails (or the
//         // Instagram sync hasn't been set up yet), it simply doesn't render
//         // — it must never break the rest of the homepage.
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const scrollByCards = (direction) => {
//     const el = stripRef.current;
//     if (!el) return;
//     setPlayingId(null); // stop any playing video when the user moves on
//     el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
//   };

//   if (reels.length === 0) return null;

//   return (
//     <section
//       aria-labelledby="instagram-reels-heading"
//       className="bg-[#FDF7F2] py-16 md:py-20 border-y border-[#BE6E5B]/15"
//     >
//       <style>{`
//         .ig-reels-strip::-webkit-scrollbar { display: none; }
//         .ig-reels-strip { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Heading */}
//         <div className="text-center mb-10 md:mb-12">
//           <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
//             Follow Us On Instagram
//           </p>
//           <h2
//             id="instagram-reels-heading"
//             className="font-display text-3xl md:text-5xl text-[#7A3D2A] font-bold"
//           >
//             Watch Our Latest Reels
//           </h2>
//           <p className="font-serif italic text-[#a07f61] mt-5 text-sm md:text-lg max-w-2xl mx-auto font-medium">
//             See our newest collections in motion. Follow{" "}
//             <a
//               href={INSTAGRAM_PROFILE_URL}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="underline underline-offset-4 hover:text-[#7A3D2A] transition-colors"
//             >
//               @{INSTAGRAM_USERNAME}
//             </a>{" "}
//             for fresh designs every week.
//           </p>
//         </div>

//         {/* Carousel */}
//         <div className="relative">
//           <button
//             type="button"
//             onClick={() => scrollByCards(-1)}
//             aria-label="Previous reels"
//             className="hidden md:flex absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white border border-[#E8D5A3] shadow-lg text-[#7A3D2A] hover:bg-[#7A3D2A] hover:text-white transition-colors"
//           >
//             <svg
//               aria-hidden="true"
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="15 18 9 12 15 6" />
//             </svg>
//           </button>
//           <button
//             type="button"
//             onClick={() => scrollByCards(1)}
//             aria-label="Next reels"
//             className="hidden md:flex absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white border border-[#E8D5A3] shadow-lg text-[#7A3D2A] hover:bg-[#7A3D2A] hover:text-white transition-colors"
//           >
//             <svg
//               aria-hidden="true"
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="9 18 15 12 9 6" />
//             </svg>
//           </button>

//           <div
//             ref={stripRef}
//             className="ig-reels-strip flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 pb-4"
//           >
//             {reels.map((reel) => {
//               const isPlaying = playingId === reel.mediaId;
//               const canPlayInline =
//                 Boolean(reel.mediaUrl) && !brokenIds.has(reel.mediaId);
//               // Captions are often long with hashtags — show the first line only.
//               const title = (reel.caption || "").split("\n")[0].slice(0, 90);

//               const thumb = reel.thumbnailUrl ? (
//                 <img
//                   src={reel.thumbnailUrl}
//                   alt={title || "SANWARIYAS Instagram reel"}
//                   loading="lazy"
//                   referrerPolicy="no-referrer"
//                   className="absolute inset-0 w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="absolute inset-0 bg-gradient-to-br from-[#BE6E5B]/50 to-[#7A3D2A]/70" />
//               );

//               const playIcon = (
//                 <span
//                   aria-hidden="true"
//                   className="absolute inset-0 flex items-center justify-center"
//                 >
//                   <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-[#7A3D2A] shadow-lg transition-transform duration-300 group-hover:scale-110">
//                     <svg
//                       width="22"
//                       height="22"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <polygon points="8 5 19 12 8 19 8 5" />
//                     </svg>
//                   </span>
//                 </span>
//               );

//               return (
//                 <article
//                   key={reel.mediaId}
//                   className="group relative flex-shrink-0 snap-start w-[220px] sm:w-[240px] lg:w-[260px] aspect-[9/16] rounded-2xl overflow-hidden bg-[#E8D5A3]/40 shadow-md border border-[#E8D5A3]/60"
//                 >
//                   {isPlaying && canPlayInline ? (
//                     <video
//                       src={reel.mediaUrl}
//                       poster={reel.thumbnailUrl || undefined}
//                       autoPlay
//                       muted
//                       loop
//                       playsInline
//                       controls
//                       preload="metadata"
//                       onError={() => {
//                         setBrokenIds((prev) => new Set(prev).add(reel.mediaId));
//                         setPlayingId(null);
//                       }}
//                       className="absolute inset-0 w-full h-full object-cover bg-black"
//                     />
//                   ) : canPlayInline ? (
//                     <button
//                       type="button"
//                       onClick={() => setPlayingId(reel.mediaId)}
//                       aria-label={`Play reel${title ? `: ${title}` : ""}`}
//                       className="absolute inset-0 w-full h-full"
//                     >
//                       {thumb}
//                       {playIcon}
//                     </button>
//                   ) : (
//                     <a
//                       href={reel.permalink || INSTAGRAM_PROFILE_URL}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       aria-label={`Watch this reel on Instagram${title ? `: ${title}` : ""}`}
//                       className="absolute inset-0 w-full h-full"
//                     >
//                       {thumb}
//                       {playIcon}
//                     </a>
//                   )}

//                   {/* Caption strip — pointer-events-none so it never blocks clicks */}
//                   {!isPlaying && title && (
//                     <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
//                       <p className="font-sans text-xs font-semibold text-white line-clamp-2">
//                         {title}
//                       </p>
//                     </div>
//                   )}

//                   {/* Link out to the original reel */}
//                   {reel.permalink && (
//                     <a
//                       href={reel.permalink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       aria-label="Open this reel on Instagram"
//                       className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#7A3D2A] text-sm font-bold shadow hover:bg-white transition-colors"
//                     >
//                       <span aria-hidden="true">↗</span>
//                     </a>
//                   )}
//                 </article>
//               );
//             })}
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="text-center mt-8">
//           <a
//             href={INSTAGRAM_PROFILE_URL}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7A3D2A] text-[#FDF7F2] rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#BE6E5B] transition-colors shadow-md"
//           >
//             Follow @{INSTAGRAM_USERNAME} <span aria-hidden="true">→</span>
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// FILE: client/src/components/home/InstagramReelsSection.js
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

// Change this if the Instagram account ever changes.
const INSTAGRAM_USERNAME = "sanwariyas_jaipur";
const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

export default function InstagramReelsSection() {
  const [reels, setReels] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  // Muted state for whichever reel is currently playing — starts muted
  // (autoplay requires it) and the viewer can tap to unmute, Reels-style.
  const [isMuted, setIsMuted] = useState(true);
  // Reels whose video failed to load (e.g. Instagram's CDN link expired
  // between syncs) — these fall back to "Watch on Instagram" instead of
  // showing a dead player.
  const [brokenIds, setBrokenIds] = useState(() => new Set());
  const stripRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/instagram/reels", { params: { limit: 12 } })
      .then((res) => {
        if (!cancelled) setReels(res.data?.reels || []);
      })
      .catch(() => {
        // This section is a nice-to-have. If the request fails (or the
        // Instagram sync hasn't been set up yet), it simply doesn't render
        // — it must never break the rest of the homepage.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollByCards = (direction) => {
    const el = stripRef.current;
    if (!el) return;
    setPlayingId(null); // stop any playing video when the user moves on
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (reels.length === 0) return null;

  return (
    <section
      aria-labelledby="instagram-reels-heading"
      className="bg-[#FDF7F2] py-16 md:py-20 border-y border-[#BE6E5B]/15"
    >
      <style>{`
        .ig-reels-strip::-webkit-scrollbar { display: none; }
        .ig-reels-strip { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
            Follow Us On Instagram
          </p>
          <h2
            id="instagram-reels-heading"
            className="font-display text-3xl md:text-5xl text-[#7A3D2A] font-bold"
          >
            Watch Our Latest Reels
          </h2>
          <p className="font-serif italic text-[#a07f61] mt-5 text-sm md:text-lg max-w-2xl mx-auto font-medium">
            See our newest collections in motion. Follow{" "}
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-[#7A3D2A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#7A3D2A] focus-visible:ring-offset-2 rounded-sm"
            >
              @{INSTAGRAM_USERNAME}
            </a>{" "}
            for fresh designs every week.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Previous reels"
            className="hidden md:flex absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white border border-[#E8D5A3] shadow-lg text-[#7A3D2A] hover:bg-[#7A3D2A] hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#7A3D2A] focus-visible:ring-offset-2"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Next reels"
            className="hidden md:flex absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white border border-[#E8D5A3] shadow-lg text-[#7A3D2A] hover:bg-[#7A3D2A] hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#7A3D2A] focus-visible:ring-offset-2"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            ref={stripRef}
            className="ig-reels-strip flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 pb-4"
          >
            {reels.map((reel) => {
              const isPlaying = playingId === reel.mediaId;
              const canPlayInline =
                Boolean(reel.mediaUrl) && !brokenIds.has(reel.mediaId);
              // Captions are often long with hashtags — show the first line only.
              const title = (reel.caption || "").split("\n")[0].slice(0, 90);

              const thumb = reel.thumbnailUrl ? (
                <video
                  src={reel.mediaUrl}
                  poster={reel.thumbnailUrl || undefined}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => {
                    setBrokenIds((prev) => new Set(prev).add(reel.mediaId));
                    setPlayingId(null);
                  }}
                  onClick={() => setPlayingId(null)}
                  style={{ backgroundColor: "transparent" }}
                  className="absolute inset-0 w-full h-full object-cover object-center scale-[1.15] cursor-pointer outline-none"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#BE6E5B]/50 to-[#7A3D2A]/70" />
              );

              const playIcon = (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-[#7A3D2A] shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  </span>
                </span>
              );

              return (
                <article
                  key={reel.mediaId}
                  style={{ border: "1px solid rgba(232,213,163,0.6)" }}
                  className="group relative flex-shrink-0 snap-start w-[220px] sm:w-[240px] lg:w-[260px] aspect-[9/16] rounded-2xl overflow-hidden bg-[#7A3D2A] shadow-md"
                >
                  {isPlaying && canPlayInline ? (
                    <div className="absolute inset-0">
                      {/*
                        No native `controls` (that's what was drawing the
                        black control bar), no default outline. Click the
                        video to stop; separate small button to mute/unmute.
                      */}

                      <video
                        src={reel.mediaUrl}
                        poster={reel.thumbnailUrl || undefined}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        preload="metadata"
                        onError={() => {
                          setBrokenIds((prev) =>
                            new Set(prev).add(reel.mediaId),
                          );
                          setPlayingId(null);
                        }}
                        onClick={() => setPlayingId(null)}
                        style={{
                          backgroundColor: "transparent",
                          outline: "none",
                          border: "none",
                          boxShadow: "none",
                        }}
                        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.15] cursor-pointer"
                      />
                      {/* Mute / unmute — stops click from also closing the video */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted((m) => !m);
                        }}
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                        className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#7A3D2A] shadow hover:bg-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {isMuted ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ) : canPlayInline ? (
                    <button
                      type="button"
                      onClick={() => setPlayingId(reel.mediaId)}
                      aria-label={`Play reel${title ? `: ${title}` : ""}`}
                      className="absolute inset-0 w-full h-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7A3D2A]"
                    >
                      {thumb}
                      {playIcon}
                    </button>
                  ) : (
                    <a
                      href={reel.permalink || INSTAGRAM_PROFILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Watch this reel on Instagram${title ? `: ${title}` : ""}`}
                      className="absolute inset-0 w-full h-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7A3D2A]"
                    >
                      {thumb}
                      {playIcon}
                    </a>
                  )}

                  {/* Caption strip — pointer-events-none so it never blocks clicks */}
                  {!isPlaying && title && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                      <p className="font-sans text-xs font-semibold text-white line-clamp-2">
                        {title}
                      </p>
                    </div>
                  )}

                  {/* Link out to the original reel */}
                  {reel.permalink && !isPlaying && (
                    <a
                      href={reel.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open this reel on Instagram"
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#7A3D2A] text-sm font-bold shadow hover:bg-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7A3D2A] text-[#FDF7F2] rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#BE6E5B] transition-colors shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#7A3D2A] focus-visible:ring-offset-2"
          >
            Follow @{INSTAGRAM_USERNAME} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
