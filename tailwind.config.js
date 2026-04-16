/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // ── Background fields ─────────────────────────
        // Section bg alternates: black → light → white (Apple cinematic rhythm)
        'apple-black': '#000000',
        'apple-light': '#f5f5f7',   // not quite white — slight blue-gray tint
        'near-black':  '#1d1d1f',   // primary text on light bg, slightly warm

        // ── Dark surfaces (cards on dark sections) ────
        'surface-1': '#272729',
        'surface-2': '#2a2a2d',

        // ── Interactive ────────────────────────────────
        // University green takes the Apple Blue (#0071e3) role.
        // Used ONLY for interactive elements: links, CTAs, focus rings.
        'cu-green':        '#006633',
        'cu-green-dark':   '#005529',
        'cu-green-bright': '#3aaa70',  // higher luminance — legible on black bg

        // ── Legacy aliases (keeps old templates from breaking) ────
        primary: {
          DEFAULT: '#006633',
          light:   '#3aaa70',
          dark:    '#005529',
        },
        accent: {
          DEFAULT: '#1d1d1f',
        },
        base: {
          DEFAULT: '#ffffff',
          light:   '#f5f5f7',
          muted:   '#e8ecf0',
        },
      },

      fontFamily: {
        // SF Pro is a macOS/iOS system font — no CDN download.
        // Noto Sans JP provides Japanese glyphs as the first fallback.
        display: ['"SF Pro Display"', '"Noto Sans JP"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        body:    ['"SF Pro Text"',    '"Noto Sans JP"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans:    ['"SF Pro Text"',    '"Noto Sans JP"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },

      // ── Apple letter-spacing ─────────────────────────
      letterSpacing: {
        'hero':    '-0.28px',
        'body-ap': '-0.022em',    // ~-0.374px at 17px
        'caption': '-0.016em',    // ~-0.224px at 14px
        'micro':   '-0.010em',    // ~-0.12px at 12px
      },

      // ── Apple line-heights ───────────────────────────
      lineHeight: {
        'hero':    '1.07',
        'heading': '1.10',
        'tile':    '1.14',
        'card':    '1.19',
        'body-ap': '1.47',
      },

      // ── Apple border-radius scale ─────────────────────
      borderRadius: {
        'apple-sm':   '5px',
        'apple':      '8px',
        'apple-input':'11px',
        'apple-card': '12px',
        'pill':       '980px',
      },

      // ── Apple card shadow ─────────────────────────────
      boxShadow: {
        'apple': 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px',
      },
    },
  },
  plugins: [],
};
