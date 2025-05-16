import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from './constants';

// Define theme type based on the available themes
export type ThemeType = 'light' | 'dark' | 'premium';

// Define the theme data interface based on the structure in constants.ts
interface ThemeData {
  name: string;
  bodyClasses: string;
  headerClasses: string;
  accentColor: string;
  backgroundPreview: string;
  borderColor: string;
  buttonClass: string;
  cardClass: string;
  fontFamily: string;
  headingClass: string;
  inputClass: string;
}

interface ThemeContextType {
  theme: ThemeData;
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.light as ThemeData,
  currentTheme: 'light',
  setTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
  const [theme, setThemeData] = useState<ThemeData>(THEMES.light as ThemeData);

  useEffect(() => {
    // Load saved theme from localStorage on mount
    const savedTheme = localStorage.getItem('preferred-theme') as ThemeType | null;
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
      setThemeData(THEMES[savedTheme] as ThemeData);
      
      // Apply the theme class name directly
      document.documentElement.className = savedTheme;
    } else {
      // Apply default theme if no saved theme
      document.documentElement.className = 'light';
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    if (THEMES[newTheme]) {
      setCurrentTheme(newTheme);
      setThemeData(THEMES[newTheme] as ThemeData);
      
      // Apply the theme class name directly - just the theme name
      document.documentElement.className = newTheme;
      localStorage.setItem('preferred-theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
