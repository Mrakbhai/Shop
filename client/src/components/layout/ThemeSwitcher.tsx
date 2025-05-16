import React from 'react';
import { useTheme } from '@/lib/themeContext';
import { THEMES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Moon, 
  Sun, 
  Check, 
  Palette, 
  PaintBucket, 
  CircleUser, 
  Settings 
} from 'lucide-react';

type ThemeKey = 'light' | 'dark' | 'premium' | 'minimalist' | 'colorful';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

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
        return <CircleUser className="h-5 w-5" />;
      case 'colorful':
        return <PaintBucket className="h-5 w-5" />;
      case 'minimalist':
        return <Palette className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  // Get icon for a specific theme
  const getThemeIcon = (themeKey: ThemeKey) => {
    switch (themeKey) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'premium':
        return <CircleUser className="h-4 w-4" />;
      case 'colorful':
        return <PaintBucket className="h-4 w-4" />;
      case 'minimalist':
        return <Palette className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Change theme"
          className="rounded-full w-9 h-9 p-0"
        >
          {getCurrentThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
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
    </DropdownMenu>
  );
};

export default ThemeSwitcher;