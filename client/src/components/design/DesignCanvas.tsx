import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  initializeCanvas, 
  addText, 
  setCanvasBackground, 
  deleteSelected,
  saveCanvasAsJSON,
  saveCanvasAsImage
} from '@/lib/fabricHelper';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PRODUCT_COLORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

interface DesignCanvasProps {
  onSaveDesign?: (designData: { json: string, imageUrl: string }) => void;
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ onSaveDesign }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<any | null>(null);
  const [selectedColor, setSelectedColor] = useState('white');
  const [shirtPreview, setShirtPreview] = useState('https://images.unsplash.com/photo-1581655353564-df123a1eb820');
  const [activeTab, setActiveTab] = useState('front');
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Check if Fabric.js is loaded
  const checkFabricLoaded = useCallback(() => {
    if (typeof window !== 'undefined' && window.fabric) {
      console.log("Fabric.js is loaded!");
      setIsFabricLoaded(true);
      return true;
    }
    console.log("Fabric.js is not loaded yet");
    return false;
  }, []);

  // Try to initialize canvas with retry mechanism
  const initCanvas = useCallback(() => {
    if (!canvasRef.current || isInitializing) return;
    
    setIsInitializing(true);
    
    // If Fabric.js is not loaded, set up a polling mechanism
    if (!checkFabricLoaded()) {
      console.log("Setting up polling for Fabric.js");
      const checkInterval = setInterval(() => {
        if (checkFabricLoaded()) {
          clearInterval(checkInterval);
          initCanvas();
        }
      }, 200);
      
      // Clean up interval after 10 seconds (50 attempts) to avoid infinite polling
      setTimeout(() => {
        clearInterval(checkInterval);
        setIsInitializing(false);
        console.error("Timed out waiting for Fabric.js to load");
      }, 10000);
      
      return;
    }
    
    try {
      console.log("Initializing canvas with Fabric.js");
      const fabricCanvas = initializeCanvas('tshirt-canvas', 400, 500);
      
      if (fabricCanvas) {
        console.log("Canvas initialized successfully");
        setCanvas(fabricCanvas);
      } else {
        console.error("initializeCanvas returned null");
      }
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }
    
    setIsInitializing(false);
  }, [canvasRef, checkFabricLoaded, isInitializing]);

  // Initialize canvas on component mount
  useEffect(() => {
    // Try to initialize the canvas
    if (!canvas && !isInitializing) {
      initCanvas();
    }
    
    // Clean up canvas on component unmount
    return () => {
      try {
        if (canvas && typeof canvas.dispose === 'function') {
          canvas.dispose();
        }
      } catch (error) {
        console.error("Error disposing canvas:", error);
      }
    };
  }, [canvas, initCanvas, isInitializing]);

  // Handle color change
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    
    // Change shirt preview based on color
    if (color === 'black') {
      setShirtPreview('https://images.unsplash.com/photo-1503341504253-dff4815485f1');
    } else if (color === 'white') {
      setShirtPreview('https://images.unsplash.com/photo-1581655353564-df123a1eb820');
    } else if (color === 'blue') {
      setShirtPreview('https://images.unsplash.com/photo-1576566588028-4147f3842f27');
    } else if (color === 'gray') {
      setShirtPreview('https://images.unsplash.com/photo-1622445275463-afa2ab738c34');
    } else {
      setShirtPreview('https://images.unsplash.com/photo-1581655353564-df123a1eb820');
    }
  };

  // Text functions
  const handleAddText = () => {
    if (canvas) {
      addText(canvas);
    }
  };

  // Delete selected object
  const handleDeleteSelected = () => {
    if (canvas) {
      deleteSelected(canvas);
    }
  };

  // Save design
  const handleSaveDesign = () => {
    if (canvas && onSaveDesign) {
      const json = saveCanvasAsJSON(canvas);
      const imageUrl = saveCanvasAsImage(canvas);
      onSaveDesign({ json, imageUrl });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <motion.div 
        className="flex-1 bg-secondary rounded-[12px] p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isInitializing && !canvas && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-secondary/50">
            <div className="flex flex-col items-center">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground text-sm">Loading design tools...</p>
            </div>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="front">Front</TabsTrigger>
            <TabsTrigger value="back">Back</TabsTrigger>
          </TabsList>
          <TabsContent value="front" className="mt-0">
            <div className="relative">
              <img 
                src={shirtPreview} 
                alt="T-shirt preview" 
                className="w-full rounded-md"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <canvas ref={canvasRef} id="tshirt-canvas" className="border-2 border-dashed border-gray-300" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="back" className="mt-0">
            <div className="relative">
              <img 
                src={shirtPreview} 
                alt="T-shirt back preview" 
                className="w-full rounded-md"
              />
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Back design editor coming soon!</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Select Color</h3>
          <div className="flex space-x-3 mb-6">
            {PRODUCT_COLORS.slice(0, 6).map((color) => (
              <button
                key={color.id}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.id ? 'border-primary' : 'border-gray-300'}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => handleColorChange(color.id)}
                title={color.name}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="sm" onClick={handleAddText}>Add Text</Button>
            <Button size="sm" variant="outline" onClick={handleDeleteSelected}>Delete Selected</Button>
            <Button size="sm" variant="default" onClick={handleSaveDesign}>Save Design</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DesignCanvas;
