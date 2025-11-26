'use client'
import React, { useContext } from 'react'
import { ThemeContext } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useContext(ThemeContext);

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" disabled>
        🌞
      </button>
    );
  }

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
      {theme === 'dark' ? '🌜' : '🌞'}
    </button>
  )
}
