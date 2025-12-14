/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom colors from the reference image
        'one': '#ffffff',
        'two': '#686f9d',
        'three': '#424669',
        'four': '#2d3250',
        'five': '#f8b179',
      },
    },
  },
  plugins: [],
}