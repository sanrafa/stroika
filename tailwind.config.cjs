/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        compText: "#FDFDFC",
        category: "rgba(13, 65, 73, 0.6)",
        feature: "rgba(28, 132, 151, 0.5)",
        categoryToggleUnchecked: "rgba(130, 213, 232, 1)",
        categoryToggleChecked: "rgba(13, 65, 73, 1)",
        line: "rgba(130, 213, 232, 0.5)",
        project: "rgba(13, 65, 73, 0.3)",
        column: "rgba(253, 253, 252, 0.1)",
        columnBorder: "rgba(52, 190, 218, 0.3)",
        featureContainer: "rgba(4, 20, 22, 0.75)",
      },
      fontSize: {
        xxs: "11px",
      },
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        inset: "inset 0px 2px 4px rgba(0, 0, 0, 0.17)",
        category: "inset 2px 4px 4px rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        rotate180: {
          "0%, 100%": { transform: "rotate(180deg)" },
        },
        slideDown: {
          from: {
            height: 0,
          },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: { height: 0 },
        },
      },
      animation: {
        rotate180: "rotate180 500ms infinite",
        slideDown: "slideDown 150ms linear",
        slideUp: "slideUp 150ms linear",
      },
    },
  },
  plugins: [require("./src/plugins/tailwindcss/scrollbar.cjs")],
};
