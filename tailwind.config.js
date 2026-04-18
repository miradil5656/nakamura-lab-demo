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
        // ── Backgrounds ───────────────────────────────────
        'site-black':  '#000000',
        'site-light':  '#f5f5f7',
        'near-black':  '#1a1a1a',

        // ── Dark surfaces ─────────────────────────────────
        'surface-1': '#1a1a1a',
        'surface-2': '#272729',

        // ── Lab accent (NVIDIA-inspired electric green) ───
        // Signal color — borders, underlines, CTAs only. Never fills.
        'lab-green':        '#76b900',
        'lab-green-bright': '#bff230',
        'lab-green-dark':   '#5a8c00',

        // ── Legacy aliases — keep layouts from breaking ───
        'cu-green':        '#76b900',
        'cu-green-dark':   '#5a8c00',
        'cu-green-bright': '#bff230',
        'apple-black':     '#000000',
        'apple-light':     '#f5f5f7',
        primary: {
          DEFAULT: '#76b900',
          light:   '#bff230',
          dark:    '#5a8c00',
        },
        accent: {
          DEFAULT: '#1a1a1a',
        },
        base: {
          DEFAULT: '#ffffff',
          light:   '#f5f5f7',
          muted:   '#e8ecf0',
        },
      },

      fontFamily: {
        // Inter — geometric, industrial. Loads from Google Fonts.
        display: ['Inter', '"Noto Sans JP"', 'Arial', 'Helvetica', 'sans-serif'],
        body:    ['Inter', '"Noto Sans JP"', 'Arial', 'Helvetica', 'sans-serif'],
        sans:    ['Inter', '"Noto Sans JP"', 'Arial', 'Helvetica', 'sans-serif'],
      },

      // ── Letter-spacing ───────────────────────────────────
      letterSpacing: {
        'hero':    '-0.28px',
        'body-ap': '-0.022em',
        'caption': '-0.016em',
        'micro':   '-0.010em',
        'nav':     '0.08em',     // uppercase nav labels
      },

      // ── Line-heights ─────────────────────────────────────
      lineHeight: {
        'hero':    '1.07',
        'heading': '1.10',
        'tile':    '1.14',
        'card':    '1.19',
        'body-ap': '1.47',
      },

      // ── Border-radius (NVIDIA-style sharp corners) ────────
      borderRadius: {
        'nvidia':     '2px',    // primary — buttons, cards
        'apple-sm':   '2px',    // legacy alias → sharp
        'apple':      '4px',
        'apple-input':'4px',
        'apple-card': '4px',
        'pill':       '980px',  // only for badges
      },

      // ── Shadows ──────────────────────────────────────────
      boxShadow: {
        'nvidia': 'rgba(0, 0, 0, 0.3) 0px 0px 5px 0px',
        'apple':  'rgba(0, 0, 0, 0.3) 0px 0px 5px 0px',
      },
    },
  },
  plugins: [],
};
