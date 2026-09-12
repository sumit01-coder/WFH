/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#1E293B',
        accent: '#22C55E',
        background: '#020617',
        foreground: '#F8FAFC'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
