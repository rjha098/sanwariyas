"use client";

import { useId } from "react";

const sid = (raw) => raw.replace(/[^a-zA-Z0-9_-]/g, "");

/* Hydration-safe: computed numbers are always rounded to strings */
const r1 = (n) => n.toFixed(1);
const cb = (t, a, b, c, d) => {
  const m = 1 - t;
  return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * d;
};

/* ---------- BIG pointed arch (ulte V / ogee) on the front ----------
   tips at the sides (y=126), tall peak in the centre (y=66)          */
const PEAK_Y = 66;
const XL = [14, 80, 142, 160];
const YL = [126, 122, 104, PEAK_Y];
const XR = [160, 178, 240, 306];
const YR = [PEAK_Y, 104, 122, 126];

const FRONT = "M14 126C80 122 142 104 160 66C178 104 240 122 306 126";
const BACK = "M14 126C60 94 260 94 306 126";
const BODY = `${FRONT}C300 196 240 236 160 236C80 236 20 196 14 126Z`;
const OPENING = `${BACK}Z`;

const STEPS = 7;
const PTS = [
  ...Array.from({ length: STEPS + 1 }, (_, i) => i / STEPS).map((t) => [
    cb(t, ...XL),
    cb(t, ...YL),
  ]),
  ...Array.from({ length: STEPS }, (_, i) => (i + 1) / STEPS).map((t) => [
    cb(t, ...XR),
    cb(t, ...YR),
  ]),
];

/* draped gold swags hanging from the arch */
const SWAGS = PTS.slice(0, -1).map(([x1, y1], i) => {
  const [x2, y2] = PTS[i + 1];
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const drop = 5 + dist * 0.2;
  const mx = (x1 + x2) / 2;
  const base = Math.max(y1, y2);
  const outer = `M${r1(x1)} ${r1(y1 + 3)}Q${r1(mx)} ${r1(base + drop + 5)} ${r1(x2)} ${r1(y2 + 3)}`;
  const inner = `M${r1(x1)} ${r1(y1 + 4.5)}Q${r1(mx)} ${r1(base + drop)} ${r1(x2)} ${r1(y2 + 4.5)}`;
  return { fill: `${outer}Z`, outer, inner };
});

/* engraved gold lotus band around the belly (premium detail) */
const BAND = "M20 160Q160 210 300 160";
const BAND2 = "M21 168Q160 219 299 168";
const PETALS = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 0.5) / 9;
  const m = 1 - t;
  const x = m * m * 20 + 2 * m * t * 160 + t * t * 300;
  const y = m * m * 160 + 2 * m * t * 210 + t * t * 160;
  const dx = 2 * m * 140 + 2 * t * 140;
  const dy = 2 * m * 50 + 2 * t * -50;
  return { x: r1(x), y: r1(y), a: r1((Math.atan2(dy, dx) * 180) / Math.PI) };
});

const GLITTER = [
  [30, 262, 1.6],
  [58, 268, 1.2],
  [84, 260, 1.8],
  [112, 270, 1.3],
  [140, 264, 1.6],
  [176, 270, 1.4],
  [204, 262, 1.8],
  [232, 268, 1.2],
  [258, 260, 1.6],
  [288, 266, 1.4],
  [70, 256, 1],
  [250, 256, 1],
  [160, 273, 1.2],
  [18, 252, 1.2],
  [302, 254, 1.2],
];

const star = (x, y, r) =>
  `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`;

const SPARKLES = [
  [70, 50, 9, 0],
  [252, 34, 7, 0.9],
  [100, 0, 5, 1.6],
  [226, 100, 8, 0.4],
  [38, 120, 6, 1.2],
  [290, 140, 5, 2],
];

const OUTER = Array.from({ length: 12 }, (_, i) => i * 30);
const INNER = Array.from({ length: 10 }, (_, i) => i * 36 + 18);

function Marigold({ x, y, s = 1, uid }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {OUTER.map((a) => (
        <path
          key={`o${a}`}
          transform={`rotate(${a})`}
          d="M0 0C-7 -9 -7 -22 0 -28C7 -22 7 -9 0 0Z"
          fill={`url(#${uid}mg)`}
          stroke="#b8480f"
          strokeWidth=".5"
        />
      ))}
      {INNER.map((a) => (
        <path
          key={`i${a}`}
          transform={`rotate(${a})`}
          d="M0 0C-5 -6 -5 -15 0 -19C5 -15 5 -6 0 0Z"
          fill="#ffb938"
          stroke="#c8560f"
          strokeWidth=".4"
        />
      ))}
      <circle r="4.2" fill="#ffe27a" />
      <circle r="1.8" fill="#d9760f" />
    </g>
  );
}

/* long pointed flame; base hides behind the arch peak */
const FLAME =
  "M160 -34C158 6 138 38 141 76C143 96 151 106 160 107C169 106 177 96 179 76C182 38 162 6 160 -34Z";

export default function DiyaLamp({ className = "", style, flowers = true }) {
  const id = sid(useId());
  const u = (k) => `url(#${id}${k})`;
  return (
    <svg
      className={className}
      viewBox="0 -44 320 320"
      style={{ overflow: "visible", ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* antique bronze-copper bowl — same brown family as the site buttons */}
        <linearGradient id={`${id}mr`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22110a" />
          <stop offset=".18" stopColor="#5b3216" />
          <stop offset=".38" stopColor="#b8733c" />
          <stop offset=".5" stopColor="#d99a5e" />
          <stop offset=".66" stopColor="#7a431b" />
          <stop offset=".88" stopColor="#3a1d0d" />
          <stop offset="1" stopColor="#1c0d07" />
        </linearGradient>
        <linearGradient id={`${id}gb`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6420" />
          <stop offset=".3" stopColor="#e6c26a" />
          <stop offset=".5" stopColor="#fff4c4" />
          <stop offset=".7" stopColor="#d9b04c" />
          <stop offset="1" stopColor="#8a6420" />
        </linearGradient>
        <linearGradient id={`${id}sh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".3" stopColor="#140306" stopOpacity="0" />
          <stop offset="1" stopColor="#140306" stopOpacity=".62" />
        </linearGradient>
        <linearGradient id={`${id}br`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a5416" />
          <stop offset=".2" stopColor="#d9b45a" />
          <stop offset=".42" stopColor="#fff2b8" />
          <stop offset=".62" stopColor="#e0b64f" />
          <stop offset=".85" stopColor="#a9812c" />
          <stop offset="1" stopColor="#6a4810" />
        </linearGradient>
        <linearGradient id={`${id}sw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6df9b" />
          <stop offset="1" stopColor="#b88a2e" />
        </linearGradient>
        <radialGradient id={`${id}ruby`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#ff8a8a" />
          <stop offset=".5" stopColor="#c4182f" />
          <stop offset="1" stopColor="#6a0a18" />
        </radialGradient>
        <radialGradient id={`${id}oil`} cx=".5" cy=".6" r=".7">
          <stop offset="0" stopColor="#e69a35" />
          <stop offset=".55" stopColor="#7a3f0c" />
          <stop offset="1" stopColor="#2a1204" />
        </radialGradient>
        <linearGradient id={`${id}fo`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff9a1f" />
          <stop offset=".55" stopColor="#ff8a1f" />
          <stop offset="1" stopColor="#f6b44a" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id={`${id}fm`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffc43a" />
          <stop offset="1" stopColor="#ffeaa6" />
        </linearGradient>
        <linearGradient id={`${id}fc`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff3c0" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={`${id}hl`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffb347" stopOpacity=".95" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity=".15" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffd36b" stopOpacity=".7" />
          <stop offset=".5" stopColor="#ffa43a" stopOpacity=".2" />
          <stop offset="1" stopColor="#ffa43a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}gr`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffcf6a" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffcf6a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}mg`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e2561b" />
          <stop offset="1" stopColor="#ffa530" />
        </linearGradient>
        <filter id={`${id}b1`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id={`${id}b6`} x="-80%" y="-40%" width="260%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${id}b14`} x="-120%" y="-40%" width="340%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <clipPath id={`${id}body`}>
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* round aura + glowing ground + glitter */}
      <ellipse
        className="dw-glow"
        cx="160"
        cy="52"
        rx="175"
        ry="160"
        fill={u("glow")}
      />
      <ellipse cx="160" cy="262" rx="158" ry="18" fill={u("gr")} />
      {GLITTER.map(([x, y, rr], i) => (
        <circle key={i} cx={x} cy={y} r={rr} fill="#ffe9a8" opacity=".85" />
      ))}
      {SPARKLES.map(([x, y, rr, d]) => (
        <path
          key={`${x}-${y}`}
          className="dw-glow"
          d={star(x, y, rr)}
          fill="#ffe9a8"
          style={{ animationDelay: `${d}s` }}
        />
      ))}

      {/* back rim + oil opening (visible at the sides, behind the arch) */}
      <path
        d={BACK}
        fill="none"
        stroke={u("br")}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={OPENING}
        fill={u("oil")}
        stroke="#3a1a06"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* flame group — sits behind the arch peak */}
      <g transform="translate(0 -30)">
        <g className="dw-glow" style={{ transformOrigin: "160px 107px" }}>
          <g transform="translate(160 107) scale(2.4 1.4) translate(-160 -107)">
            <path d={FLAME} fill={u("hl")} opacity=".5" filter={u("b14")} />
          </g>
        </g>
        <g transform="translate(160 107) scale(1.5 1.16) translate(-160 -107)">
          <path d={FLAME} fill={u("hl")} opacity=".6" filter={u("b6")} />
        </g>
        <g className="dw-flame">
          <path d={FLAME} fill={u("fo")} filter={u("b1")} />
          <path
            d="M160 10C153 38 147 60 149 82C150 98 155 108 160 109C165 108 170 98 171 82C173 60 167 38 160 10Z"
            fill={u("fm")}
            filter={u("b1")}
          />
          <path
            d="M160 56C155 74 153 90 156 102C157 107 159 109 160 109C161 109 163 107 164 102C167 90 165 74 160 56Z"
            fill={u("fc")}
            filter={u("b1")}
          />
        </g>
      </g>

      {/* bowl body — the front wall rises into a tall pointed arch */}
      <path d={BODY} fill={u("mr")} />

      {/* gold draped swags under the arch */}
      {SWAGS.map((s, i) => (
        <g key={i}>
          <path
            d={s.fill}
            fill={u("sw")}
            stroke="#7a5416"
            strokeWidth=".9"
            strokeLinejoin="round"
          />
          <path
            d={s.inner}
            fill="none"
            stroke="#fff6cc"
            strokeOpacity=".8"
            strokeWidth=".9"
            strokeDasharray="1 3"
            strokeLinecap="round"
          />
          <path
            d={s.outer}
            fill="none"
            stroke="#fff2b8"
            strokeOpacity=".55"
            strokeWidth=".8"
          />
        </g>
      ))}

      {/* thick gold arch trim */}
      <path
        d={FRONT}
        fill="none"
        stroke="#7a5416"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={FRONT}
        fill="none"
        stroke={u("br")}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={FRONT}
        fill="none"
        stroke="#fff6cc"
        strokeOpacity=".7"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {PTS.map(([x, y], i) => (
        <circle
          key={i}
          cx={r1(x)}
          cy={r1(y + 3)}
          r="2.3"
          fill="#fff6cc"
          stroke="#a9812c"
          strokeWidth=".7"
        />
      ))}

      {/* ruby jewel on the peak */}
      <circle
        cx="160"
        cy={PEAK_Y + 9}
        r="5.2"
        fill={u("ruby")}
        stroke="#7a5416"
        strokeWidth="1.4"
      />
      <circle cx="158.4" cy={PEAK_Y + 7.4} r="1.3" fill="#fff" opacity=".8" />

      {flowers && (
        <g className="dw-flowers">
          <Marigold x={34} y={240} s={1.05} uid={id} />
          <Marigold x={286} y={240} s={1.05} uid={id} />
        </g>
      )}
    </svg>
  );
}
