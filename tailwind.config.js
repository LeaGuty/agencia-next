/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // <--- Esta línea cubre TODO dentro de src
  ],
  theme: {
    extend: {
      colors: {
        primary: "#137fec", // Asegúrate de que esta línea exista
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};