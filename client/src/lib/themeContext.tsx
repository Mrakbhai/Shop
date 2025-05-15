import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from './constants';

type ThemeType = 'light' | 'dark' | 'premium' | 'minimalist' | 'experimental';

interface ThemeContextType {
  theme: {
    name: string;
    bodyClasses: string;
    headerClasses: string;
    accentColor: string;
    backgroundPreview: string;
    borderColor: string;
  };
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.light,
  currentTheme: 'light',
  setTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
  const [theme, setThemeData] = useState(THEMES.light);

  useEffect(() => {
    // Load saved theme from localStorage on mount
    const savedTheme = localStorage.getItem('preferred-theme') as ThemeType;
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
      setThemeData(THEMES[savedTheme]);
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
    setThemeData(THEMES[newTheme]);
    localStorage.setItem('preferred-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
