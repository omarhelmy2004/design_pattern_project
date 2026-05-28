import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  FOREST_LIGHT: 'forest-light',
  FOREST_DARK: 'forest-dark',
  SAGE_LIGHT: 'sage-light',
  SAGE_DARK: 'sage-dark'
};

export const ThemeProvider = ({ children, defaultTheme = THEMES.FOREST_LIGHT }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('withme-theme');
    return saved || defaultTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('withme-theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const value = {
    theme,
    setTheme: toggleTheme,
    isForest: theme.includes('forest'),
    isDark: theme.includes('dark')
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
