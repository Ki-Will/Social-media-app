const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Saira", ...fontFamily.sans],
        unbounded: ["Unbounded", ...fontFamily.sans],
      },
      colors: {
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          hover: "var(--surface-hover)",
          elevated: "var(--surface-elevated)",
        },
        border: "var(--border)",
        divider: "var(--divider)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        brand: {
          DEFAULT: "var(--brand-primary)",
          hover: "var(--brand-hover)",
        },
        primary: {
          DEFAULT: "var(--brand-primary)",
          hover: "var(--brand-hover)",
        },
        secondary: {
          DEFAULT: "var(--surface)",
          hover: "var(--surface-hover)",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        full: "9999px",
      },
    },
  },
};
