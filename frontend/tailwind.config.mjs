import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wolt-style blue primary palette
        primary: {
          50: '#e6f4fc',
          100: '#b3dff5',
          200: '#80caee',
          300: '#4db5e7',
          400: '#26a5e0',
          500: '#009de0',
          600: '#0088c6',
          700: '#0073a8',
          800: '#005e8a',
          900: '#004d70',
        },
        accent: { 50: '#fff7ed', 500: '#fb923c' },
        muted: { 50: '#f8fafc', 500: '#94a3b8' },
        destructive: { 500: '#ef4444' }
      },
      spacing: { 'container': '1rem' },
      borderRadius: { 'lg-2xl': '1rem' }
    },
  },
  plugins: [typography],
}
