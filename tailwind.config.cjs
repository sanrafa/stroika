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
      },
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        inset: "inset 0px 2px 4px rgba(0, 0, 0, 0.17)",
      },
    },
  },
  plugins: [],
};
