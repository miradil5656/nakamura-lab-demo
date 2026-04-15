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
        primary: {
          DEFAULT: "#006633",
          light: "#008844",
          dark: "#004d26",
        },
        accent: {
          DEFAULT: "#1a1a2e",
          light: "#2a2a4e",
        },
        base: {
          DEFAULT: "#ffffff",
          light: "#f5f7fa",
          muted: "#e8ecf0",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Inter"', '"Noto Sans JP"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
