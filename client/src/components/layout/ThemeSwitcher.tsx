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
} from '@/components/ui/dropdown-menu';
import { 
  Moon, 
  Sun, 
  Check, 
  Palette, 
  PaintBucket,
  Sparkles 
} from 'lucide-react';

type ThemeKey = 'light' | 'dark' | 'premium';

const ThemeSwitcher = () => {
  const { currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only render theme switcher after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply a theme immediately when selected with smooth transition
  const applyTheme = (themeKey: ThemeKey) => {
    // Add transition classes for smooth theme change
    document.documentElement.classList.add('transition-colors');
    document.documentElement.classList.add('duration-300');
    
    // Change the theme
    setTheme(themeKey);
    localStorage.setItem('preferred-theme', themeKey);
    
    // Apply the theme class
    const currentClass = document.documentElement.className
      .split(' ')
      .filter(cls => !['light', 'dark', 'premium', 'minimalist', 'colorful'].includes(cls))
      .join(' ');
      
    document.documentElement.className = currentClass + ' ' + themeKey;
    
    // Remove transition classes after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('transition-colors');
      document.documentElement.classList.remove('duration-300');
    }, 300);
  };

  // Get icon for the current theme with proper colors
  const getCurrentThemeIcon = () => {
    switch (currentTheme) {
      case 'dark':
        return <Moon className="h-5 w-5 text-[#3b82f6]" />;
      case 'light':
        return <Sun className="h-5 w-5 text-blue-500" />;
      case 'premium':
        return <Sparkles className="h-5 w-5 text-amber-400" />;
      default:
        return <Sun className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get icon for a specific theme with proper colors
  const getThemeIcon = (themeKey: ThemeKey) => {
    switch (themeKey) {
      case 'dark':
        return <Moon className="h-4 w-4 text-[#3b82f6]" />;
      case 'light':
        return <Sun className="h-4 w-4 text-blue-500" />;
      case 'premium':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return <div className="w-9 h-9"></div>;
  }

  // Mobile UI with color dots
  if (isMobile) {
    return (
      <div className="flex gap-2 items-center">
        {(Object.keys(THEMES) as Array<ThemeKey>).map((themeKey) => {
          const themeData = THEMES[themeKey];
          const isActive = currentTheme === themeKey;
          
          return (
            <button
              key={themeKey}
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${isActive ? 'ring-2 ring-offset-2 ring-primary' : ''}
                transition-all duration-200`}
              style={{ backgroundColor: themeData.primaryColor }}
              onClick={() => applyTheme(themeKey)}
              title={themeData.name}
            >
              {isActive && <Check className="h-4 w-4 text-white" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop version with dropdown
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
      <DropdownMenuContent 
        align="end" 
        className="w-56 z-[9999]" 
        sideOffset={8}
      >
        <DropdownMenuLabel>Current Theme: {THEMES[currentTheme as ThemeKey].name}</DropdownMenuLabel>
        
        <div className="py-2 px-1">
          {(Object.keys(THEMES) as Array<ThemeKey>).map((themeKey) => {
            const themeData = THEMES[themeKey];
            const isActive = currentTheme === themeKey;
            
            return (
              <DropdownMenuItem
                key={themeKey}
                className={`flex items-center gap-2 cursor-pointer py-2 px-2 my-1 rounded-md
                  ${isActive ? 'bg-primary/10 font-medium' : 'hover:bg-accent/50'}`}
                onClick={() => applyTheme(themeKey)}
                disabled={isActive}
              >
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center
                    ${isActive ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                  style={{ backgroundColor: themeData.primaryColor }}
                >
                  {isActive && <Check className="h-3 w-3 text-white" />}
                </div>
                <span>{themeData.name}</span>
                <div className="ml-auto">
                  {getThemeIcon(themeKey)}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;