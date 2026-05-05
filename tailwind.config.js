/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
        fredericka: ['"Fredericka the Great"', 'cursive'], // Your new chalkboard brand font
      },
    },
  },
  plugins: [],
}