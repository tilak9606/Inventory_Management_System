/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      darkbg: "#0f172a", // slate-900
      darkcard: "#1e293b", // slate-800
    },
  },
},

  plugins: [],
};
