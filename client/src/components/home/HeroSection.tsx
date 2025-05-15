import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const [dynamicText, setDynamicText] = useState('Design');
  const [_, setLocation] = useLocation();
  const textOptions = ['Design', 'Create', 'Inspire', 'Express'];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % textOptions.length;
      setDynamicText(textOptions[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="theme-transition relative bg-gradient-to-br from-background to-secondary py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-accent blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0 md:pr-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-inter text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
              <span className="block">{dynamicText}.</span> 
              <span className="mt-1 block">Your Story.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Create custom apparel that speaks your language or shop from thousands of unique designs from independent creators.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Button 
                className="btn-primary text-base md:text-lg py-4 px-8 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                onClick={() => setLocation('/shop')}
              >
                Explore Designs
                <ArrowRight size={20} />
              </Button>
              <Button 
                variant="secondary"
                className="text-base md:text-lg py-4 px-8 rounded-full flex items-center justify-center gap-2"
                onClick={() => setLocation('/create')}
              >
                Create Your Own
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -top-6 -left-6 w-24 h-24 rounded-lg bg-primary/20 z-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-secondary/50 z-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />

              <img 
                src="https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Collection of custom printed apparel" 
                className="rounded-2xl shadow-xl w-full h-auto z-10 relative"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;