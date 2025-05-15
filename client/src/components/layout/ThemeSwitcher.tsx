import React, { useState, useEffect } from 'react';
import { useTheme } from '@/lib/themeContext';
import { THEMES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { Moon, Sun, Check, Palette, X } from 'lucide-react';
import { motion } from 'framer-motion';

type ThemeKey = keyof typeof THEMES;

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, theme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(currentTheme as ThemeKey);
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveTheme = () => {
    setTheme(selectedTheme);
    document.documentElement.className = THEMES[selectedTheme].bodyClasses;
    localStorage.setItem('preferred-theme', selectedTheme);
    setIsOpen(false);
  };

  // Update selected theme when current theme changes
  useEffect(() => {
    setSelectedTheme(currentTheme as ThemeKey);
  }, [currentTheme]);

  // Icon based on current theme
  const ThemeIcon = () => {
    if (currentTheme === 'dark' || currentTheme === 'premium' || currentTheme === 'experimental') {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    } else if (currentTheme === 'light') {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    } else {
      return <Palette className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Change theme"
          className="transition-all duration-200 hover:bg-primary/10"
        >
          <ThemeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${theme.cardClass} border-2`}>
        <DialogHeader className="relative">
          <DialogTitle className={`${theme.fontFamily} text-xl font-bold pr-8 ${theme.headingClass}`}>
            Choose Your Theme
          </DialogTitle>
          <DialogDescription>
            Select a theme that best matches your style preference
          </DialogDescription>
          <DialogClose className="absolute right-0 top-0 p-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {(Object.keys(THEMES) as Array<ThemeKey>).map((themeKey) => {
            const themeData = THEMES[themeKey];
            const isSelected = selectedTheme === themeKey;
            
            return (
              <motion.button
                key={themeKey}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`relative p-4 rounded-lg border-2 flex flex-col items-center
                  ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'}
                  transition-all duration-200 hover:border-primary/70`}
                onClick={() => setSelectedTheme(themeKey)}
                style={{ 
                  backgroundColor: themeData.backgroundPreview,
                }}
              >
                {/* Theme preview */}
                <div className="w-full h-24 rounded mb-2 overflow-hidden relative">
                  {/* Header */}
                  <div 
                    className="w-full h-6"
                    style={{ 
                      backgroundColor: themeKey === 'light' ? '#ffffff' : 
                        themeKey === 'dark' ? '#1e293b' : 
                        themeKey === 'premium' ? '#27272a' : 
                        themeKey === 'minimalist' ? '#fafafa' : 
                        '#312e81'
                    }}
                  >
                    <div className="flex justify-between px-2">
                      <div className="w-10 h-2 mt-2 rounded-full" style={{ backgroundColor: themeData.accentColor }} />
                      <div className="flex space-x-1 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-2">
                    <div 
                      className="w-full h-3 rounded-full mb-2"
                      style={{ backgroundColor: themeData.borderColor }}
                    />
                    <div 
                      className="w-3/4 h-3 rounded-full mb-2"
                      style={{ backgroundColor: themeData.borderColor }}
                    />
                    <div 
                      className="w-16 h-4 rounded-md mt-3"
                      style={{ backgroundColor: themeData.accentColor }}
                    />
                  </div>
                </div>
                
                {/* Theme name */}
                <span 
                  className={`text-sm font-medium mt-1
                    ${themeKey === 'light' || themeKey === 'minimalist' ? 'text-black' : 'text-white'}`}
                >
                  {themeData.name}
                </span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <Button 
          onClick={handleSaveTheme} 
          className={`w-full ${THEMES[selectedTheme].buttonClass}`}
        >
          Apply Theme
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSwitcher;