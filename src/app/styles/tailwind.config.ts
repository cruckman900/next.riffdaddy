/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 👈 enables theme switching via class
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        riff: '#00ff80', // glowing lime for active tabs
      },
    },
  },
  plugins: [],
}
