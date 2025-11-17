'use client'
import React, { useEffect, useState } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {}
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const local = localStorage.getItem('theme');
    if (local === 'dark' || local === 'light') return local;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
