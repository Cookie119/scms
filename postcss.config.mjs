const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B3C66",      // Deep Blue
        accent: "#F15A29",       // Vibrant Orange
        background: "#F8FAFC",   // Light gray
        textPrimary: "#1E293B",  // Dark slate
      },
    },
  },
  plugins: [],
};
