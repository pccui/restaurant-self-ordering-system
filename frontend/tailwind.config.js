/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 500: '#10b981', 700: '#047857' },
        accent: { 50: '#fff7ed', 500: '#fb923c' },
        muted: { 50: '#f8fafc', 500: '#94a3b8' },
        destructive: { 500: '#ef4444' }
      },
      spacing: { 'container': '1rem' },
      borderRadius: { 'lg-2xl': '1rem' }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
