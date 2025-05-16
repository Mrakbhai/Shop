import React, { useEffect, useState } from 'react';
import { useTheme } from '@/lib/themeContext';
import { THEMES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { 
  Moon, 
  Sun, 
  Check, 
  Palette, 
  PaintBucket, 
  CircleUser,
  Sparkles 
} from 'lucide-react';

type ThemeKey = 'light' | 'dark' | 'premium' | 'minimalist' | 'colorful';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render theme switcher after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply a theme immediately when selected
  const applyTheme = (themeKey: ThemeKey) => {
    setTheme(themeKey);
    localStorage.setItem('preferred-theme', themeKey);
    document.documentElement.className = THEMES[themeKey].bodyClasses;
  };

  // Get icon for the current theme
  const getCurrentThemeIcon = () => {
    switch (currentTheme) {
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'premium':
        return <Sparkles className="h-5 w-5 text-amber-400" />;
      case 'colorful':
        return <PaintBucket className="h-5 w-5 text-purple-500" />;
      case 'minimalist':
        return <Palette className="h-5 w-5 text-gray-800" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  // Get icon for a specific theme
  const getThemeIcon = (themeKey: ThemeKey) => {
    switch (themeKey) {
      case 'dark':
        return <Moon className="h-4 w-4 text-indigo-400" />;
      case 'light':
        return <Sun className="h-4 w-4 text-blue-500" />;
      case 'premium':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      case 'colorful':
        return <PaintBucket className="h-4 w-4 text-purple-500" />;
      case 'minimalist':
        return <Palette className="h-4 w-4 text-gray-800" />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return <div className="w-9 h-9"></div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Change theme"
          className="rounded-full w-9 h-9 p-0"
          title={`Current: ${THEMES[currentTheme as ThemeKey].name}`}
        >
          {getCurrentThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end" className="w-48 z-50 mt-1">
          <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
          {(Object.keys(THEMES) as Array<ThemeKey>).map((themeKey) => {
            const themeData = THEMES[themeKey];
            const isSelected = currentTheme === themeKey;
            
            return (
              <DropdownMenuItem
                key={themeKey}
                className={`flex items-center gap-2 cursor-pointer py-2 ${isSelected ? 'bg-primary/10 font-medium' : ''}`}
                onClick={() => applyTheme(themeKey)}
              >
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: themeData.primaryColor }}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <span>{themeData.name}</span>
                <div className="ml-auto">
                  {getThemeIcon(themeKey)}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;