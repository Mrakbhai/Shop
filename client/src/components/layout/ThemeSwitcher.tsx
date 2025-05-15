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
  DialogClose
} from '@/components/ui/dialog';
import { Moon, X } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const handleSaveTheme = () => {
    setTheme(selectedTheme);
    document.documentElement.className = THEMES[selectedTheme].bodyClasses;
    localStorage.setItem('preferred-theme', selectedTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme') as keyof typeof THEMES;
    if (savedTheme && THEMES[savedTheme]) {
      setSelectedTheme(savedTheme);
      document.documentElement.className = THEMES[savedTheme].bodyClasses;
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change theme">
          <Moon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="font-inter text-xl font-bold pr-8">Choose Theme</DialogTitle>
          <DialogClose className="absolute right-0 top-0 p-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((themeKey) => {
            const themeData = THEMES[themeKey];
            return (
              <Button
                key={themeKey}
                variant="outline"
                className={`p-4 h-auto flex flex-col items-center ${
                  selectedTheme === themeKey ? 'border-primary border-2' : ''
                }`}
                onClick={() => setSelectedTheme(themeKey)}
              >
                <div 
                  className="w-full h-12 rounded mb-2 border"
                  style={{ 
                    backgroundColor: themeData.backgroundPreview,
                    borderColor: themeData.borderColor
                  }}
                >
                  <div 
                    className="w-6 h-2 rounded-full mx-auto mt-5"
                    style={{ backgroundColor: themeData.accentColor }}
                  />
                </div>
                <span className="text-sm font-medium">{themeData.name}</span>
              </Button>
            );
          })}
        </div>

        <DialogClose asChild>
          <Button onClick={handleSaveTheme} className="w-full">
            Apply Theme
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSwitcher;