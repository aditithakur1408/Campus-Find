/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a7f6',
          500: '#0c8ce9',
          600: '#006ec7',
          700: '#0157a0',
          800: '#064b84',
          900: '#0a3f6e',
          950: '#072849',
        },
      },
    },
  },
  plugins: [],
}
