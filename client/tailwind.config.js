// FILE: client/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/app/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {

      // ── BRAND COLORS ─────────────────────────────────────────
      // Every brand-* class used across the project is defined here.
      // opacity modifiers like brand-gold/40 work automatically
      // as long as the value is a plain hex (no CSS variables).
      colors: {
        brand: {
          // Browns & darks
          african:    '#574325',   // darkest brown  — headings, strong text
          coffee:     '#6F4E37',   // medium brown   — buttons, borders
          old:        '#634236',   // alias old-brown
          dark:       '#5D432C',   // alias dark-brown
          chocolate:  '#713600',
          taupe:      '#483C32',
          irish:      '#5D432C',
          mud:        '#70543E',   // body text, labels, muted text

          // Lights & accents
          cream:      '#F5EFE6',   // button text, light backgrounds
          parchment:  '#FAF3E8',   // page background
          gold:       '#C9A84C',   // accent gold — borders, highlights
          lightgold:  '#E8D5A3',   // soft gold   — dividers, placeholders
        },
      },

      // ── FONT FAMILIES ────────────────────────────────────────
      // Maps to CSS variables defined in globals.css :root
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],  // font-display
        serif:   ['var(--font-cormorant)', 'Georgia', 'serif'], // font-serif
        sans:    ['var(--font-jost)', 'system-ui', 'sans-serif'], // font-sans
      },

      // ── ANIMATIONS ───────────────────────────────────────────
      // animate-fade-in and animate-slide-up are used in InquiryForm
      // and success states across the project
      animation: {
        'fade-in':   'fadeIn 0.6s ease-out both',
        'slide-up':  'slideUp 0.5s ease-out both',
        'shimmer':   'shimmer 2s linear infinite',
        'spin-slow': 'spin 35s linear infinite',
        'slide':     'slide 30s linear infinite',
        'pulse':     'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },

      // ── KEYFRAMES ────────────────────────────────────────────
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        slide: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      // ── BACKGROUND IMAGES ────────────────────────────────────
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'texture-paper':   "url('/textures/paper.png')",
      },

      // ── SPACING & SIZING EXTRAS ──────────────────────────────
      // Covers hover:shadow-[0_20px_50px_...] arbitrary values —
      // those work out of the box, no config needed.
      // Adding a few useful spacing tokens for consistency.
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      // ── BOX SHADOWS ──────────────────────────────────────────
      boxShadow: {
        'warm-sm':  '0 4px 16px rgba(111,78,55,0.10)',
        'warm-md':  '0 8px 32px rgba(111,78,55,0.14)',
        'warm-lg':  '0 16px 48px rgba(111,78,55,0.18)',
        'warm-xl':  '0 24px 64px rgba(111,78,55,0.22)',
        'gold-glow':'0 0 24px rgba(201,168,76,0.25)',
      },

      // ── BORDER RADIUS ────────────────────────────────────────
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },

      // ── TRANSITION DURATION ──────────────────────────────────
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
       '1500': '1500ms',
      },

      // ── LETTER SPACING ───────────────────────────────────────
      letterSpacing: {
        'superwide': '0.5em',
        'ultrawide': '0.7em',
      },

      // ── BACKDROP BLUR ────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  plugins: [],
};