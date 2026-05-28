import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check local storage or system preference first
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('withme_theme');
    if (saved) return saved;
    // Default to dark, but respect system if it strictly prefers light
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    // Apply theme to the HTML tag so global CSS variables take effect
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('withme_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
