// FILE: client/src/components/festival/DiwaliAnar.js
"use client";

import { useEffect, useId, useRef } from "react";

const sid = (raw) => raw.replace(/[^a-zA-Z0-9_-]/g, "");

/* ───────────────────────── ANAR (cone firework) ─────────────────────────
   Cone shape: small opening on top, wide flat base, zigzag paper bands.
   Opening sits at y=29 of the 100x134 viewBox, so the CSS spark-mouth
   (top: 21.6%) still lines up. */
const CONE = "M43 29L57 29L87 124L13 124Z";

const zig = (y, amp = 4.5, step = 9) => {
  let d = `M-4 ${y}`;
  let up = false;
  for (let x = -4 + step / 2; x <= 108; x += step / 2) {
    d += `L${x.toFixed(1)} ${up ? y : y + amp}`;
    up = !up;
  }
  return d;
};

/* [y of zigzag line] — yellow line + orange line right below it */
const ZIGS = [42, 59, 76, 93, 110];
/* dot rows sit between the zigzags */
const DOT_ROWS = [52, 69, 86, 103].map((y, r) => ({
  y,
  xs: Array.from({ length: 9 }, (_, i) => 6 + i * 11.5 + (r % 2 ? 5.7 : 0)),
}));

function AnarSvg({ mouthRef }) {
  const id = sid(useId());
  const u = (k) => `url(#${id}${k})`;
  return (
    <div className="dw-anar-wrap">
      <svg viewBox="0 0 100 134" aria-hidden="true" focusable="false">
        <defs>
          {/* deep maroon paper body */}
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4a1006" />
            <stop offset=".25" stopColor="#8a2410" />
            <stop offset=".42" stopColor="#b53a16" />
            <stop offset=".7" stopColor="#7a1f0e" />
            <stop offset="1" stopColor="#3d0d05" />
          </linearGradient>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9a7424" />
            <stop offset=".35" stopColor="#f6e4a0" />
            <stop offset=".6" stopColor="#d4b455" />
            <stop offset="1" stopColor="#8a6620" />
          </linearGradient>
          <linearGradient id={`${id}d`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b1a0a" />
            <stop offset=".5" stopColor="#7a4a22" />
            <stop offset="1" stopColor="#3b1a0a" />
          </linearGradient>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity=".38" />
            <stop offset=".35" stopColor="#000" stopOpacity="0" />
            <stop offset=".62" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".5" />
          </linearGradient>
          <radialGradient id={`${id}m`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#fffbe0" />
            <stop offset=".4" stopColor="#ffc94d" />
            <stop offset="1" stopColor="#ff7a18" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}h`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#ffb347" stopOpacity=".75" />
            <stop offset="1" stopColor="#ff7a18" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}c`}>
            <path d={CONE} />
          </clipPath>
        </defs>

        {/* ground shadow + flat base */}
        <ellipse cx="50" cy="130" rx="42" ry="3.6" fill="#000" opacity=".4" />
        <path d="M11 124H89L92 129.5H8Z" fill={u("d")} />
        <path d="M11 124H89" stroke="#e0b95a" strokeWidth="1.2" />

        {/* cone body */}
        <path d={CONE} fill={u("b")} />

        <g clipPath={u("c")}>
          {/* top paper cap */}
          <rect x="0" y="26" width="100" height="9" fill={u("g")} />
          <path d="M0 35H100" stroke="#7a5416" strokeWidth=".8" />

          {/* zigzag bands: orange underlay + yellow line */}
          {ZIGS.map((y) => (
            <g key={y} fill="none" strokeLinejoin="round" strokeLinecap="round">
              <path d={zig(y + 3.2)} stroke="#e8651c" strokeWidth="3.4" />
              <path d={zig(y)} stroke="#ffcf2e" strokeWidth="3" />
            </g>
          ))}

          {/* little dots between bands */}
          {DOT_ROWS.map((row) =>
            row.xs.map((x) => (
              <circle
                key={`${row.y}-${x}`}
                cx={x}
                cy={row.y}
                r="1.7"
                fill="#ffd84a"
              />
            )),
          )}

          {/* bottom band */}
          <rect x="0" y="116" width="100" height="10" fill={u("g")} />
          <path d="M0 116H100" stroke="#7a5416" strokeWidth=".8" />

          {/* roundness shading + soft highlight */}
          <rect x="0" y="26" width="100" height="100" fill={u("s")} />
          <path
            d="M44 40L26 104"
            fill="none"
            stroke="#fff"
            strokeOpacity=".22"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* top lip + glowing mouth */}
        <ellipse cx="50" cy="29" rx="8.5" ry="2.8" fill={u("g")} />
        <ellipse cx="50" cy="29" rx="5.6" ry="1.7" fill="#1b0a04" />
        <ellipse
          className="dw-glow"
          cx="50"
          cy="24"
          rx="20"
          ry="14"
          fill={u("h")}
        />
        <ellipse
          className="dw-glow"
          cx="50"
          cy="29"
          rx="7"
          ry="2.2"
          fill={u("m")}
        />
      </svg>
      {/* invisible marker: exact spot the sparks shoot from */}
      <span className="dw-anar-mouth" ref={mouthRef} />
    </div>
  );
}

/* ───────────────────────── sparks ───────────────────────── */
export default function DiwaliAnar() {
  const canvasRef = useRef(null);
  const leftMouth = useRef(null);
  const rightMouth = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0,
      k = 1,
      raf = 0,
      last = 0,
      t = 0;
    let mouths = [];
    let sparks = [];
    const MAX = 1000;

    const measure = () => {
      const c = canvas.getBoundingClientRect();
      w = c.width;
      h = c.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      k = Math.min(1.1, Math.max(0.4, w / 1440));
      mouths = [leftMouth, rightMouth]
        .map((r, i) => {
          const b = r.current?.getBoundingClientRect();
          return b
            ? {
                x: b.left + b.width / 2 - c.left,
                y: b.top + b.height / 2 - c.top,
                phase: i * 1.9,
                acc: 0,
              }
            : null;
        })
        .filter(Boolean);
    };

    const gauss = () =>
      (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    const emit = (m, n) => {
      for (let i = 0; i < n && sparks.length < MAX; i++) {
        const ang = -Math.PI / 2 + gauss() * 0.62;
        const sp = (280 + Math.random() * 420) * k;
        sparks.push({
          x: m.x + gauss() * 4 * k,
          y: m.y,
          px: m.x,
          py: m.y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 0,
          max: 0.8 + Math.random() * 1.1,
          glitter: Math.random() < 0.16,
        });
      }
    };

    const colorAt = (p, a) => {
      if (p < 0.18) return `rgba(255,246,208,${a})`;
      if (p < 0.5) return `rgba(255,205,86,${a})`;
      if (p < 0.8) return `rgba(255,140,40,${a})`;
      return `rgba(220,70,25,${a})`;
    };

    const G = () => 640 * k;

    const frame = (now) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      t += dt;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const m of mouths) {
        const surge =
          0.7 +
          0.3 * Math.sin(t * 2.1 + m.phase) +
          0.25 * Math.max(0, Math.sin(t * 0.9 + m.phase * 2));
        m.acc += 260 * surge * dt;
        const n = Math.floor(m.acc);
        m.acc -= n;
        emit(m, n);

        const gr = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 70 * k);
        gr.addColorStop(0, `rgba(255,190,80,${0.32 * surge})`);
        gr.addColorStop(1, "rgba(255,140,40,0)");
        ctx.fillStyle = gr;
        ctx.fillRect(m.x - 80 * k, m.y - 80 * k, 160 * k, 160 * k);
      }

      const g = G();
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.max || s.y > h + 20) {
          sparks.splice(i, 1);
          continue;
        }
        s.px = s.x;
        s.py = s.y;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += g * dt;
        s.vx *= 1 - 0.55 * dt;
        const p = s.life / s.max;
        const a = (1 - p) * (s.glitter ? 0.5 + 0.5 * Math.sin(s.life * 40) : 1);
        ctx.strokeStyle = colorAt(p, Math.max(0, a));
        ctx.lineWidth = (s.glitter ? 2.8 : 1.9) * Math.max(0.75, k);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.px - s.vx * dt * 1.2, s.py - s.vy * dt * 1.2);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };

    measure();
    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="dw-anar-fx" />
      <div className="dw-anar dw-anar--l">
        <AnarSvg mouthRef={leftMouth} />
      </div>
      <div className="dw-anar dw-anar--r">
        <AnarSvg mouthRef={rightMouth} />
      </div>
    </>
  );
}
