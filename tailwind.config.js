/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        microdex: {
          red: "#ef4444",
          ink: "#09090b",
          panel: "#18181b",
        },
      },
      boxShadow: {
        "red-glow": "0 0 28px rgb(239 68 68 / 0.28)",
      },
    },
  },
  plugins: [],
};
