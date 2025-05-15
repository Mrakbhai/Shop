import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Image as ImageIcon,
  Type,
  Shapes
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';

interface DesignControlsProps {
  canvas: any | null;
  onUploadImage?: (file: File) => void;
}

interface DesignElement {
  type: string;
  url: string;
  name: string;
}

const DesignControls: React.FC<DesignControlsProps> = ({ canvas, onUploadImage }) => {
  const [textValue, setTextValue] = useState('');
  const [fontSize, setFontSize] = useState(30);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock design elements
  const designElements: DesignElement[] = [
    { type: 'image', url: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png', name: 'Mountain' },
    { type: 'image', url: 'https://cdn-icons-png.flaticon.com/512/2072/2072181.png', name: 'Wave' },
    { type: 'image', url: 'https://cdn-icons-png.flaticon.com/512/2826/2826175.png', name: 'Sun' },
    { type: 'image', url: 'https://cdn-icons-png.flaticon.com/512/2720/2720652.png', name: 'Tree' },
    { type: 'image', url: 'https://cdn-icons-png.flaticon.com/512/628/628283.png', name: 'Star' },
    { type: 'image', url: 'https://cdn-icons-png.flaticon.com/512/1721/1721930.png', name: 'Heart' },
    { type: 'image', url: 'https://cdn-icons-png.flaticon.com/512/1850/1850309.png', name: 'Moon' },
    { type: 'image', url: 'https://cdn-icons-png.flaticon.com/512/5074/5074883.png', name: 'Lightning' }
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
    updateSelectedTextObject(e.target.value);
  };

  const handleFontSizeChange = (values: number[]) => {
    const newFontSize = values[0];
    setFontSize(newFontSize);
    updateSelectedTextStyle({ fontSize: newFontSize });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(e.target.value);
    updateSelectedTextStyle({ fontFamily: e.target.value });
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
    updateSelectedTextStyle({ fill: e.target.value });
  };

  const handleBoldClick = () => {
    const activeObject = canvas?.getActiveObject() as any;
    if (activeObject && activeObject.type === 'i-text') {
      const isBold = activeObject.fontWeight === 'bold';
      updateSelectedTextStyle({ fontWeight: isBold ? 'normal' : 'bold' });
    }
  };

  const handleItalicClick = () => {
    const activeObject = canvas?.getActiveObject() as any;
    if (activeObject && activeObject.type === 'i-text') {
      const isItalic = activeObject.fontStyle === 'italic';
      updateSelectedTextStyle({ fontStyle: isItalic ? 'normal' : 'italic' });
    }
  };

  const handleAlignClick = (align: string) => {
    const activeObject = canvas?.getActiveObject() as any;
    if (activeObject && activeObject.type === 'i-text') {
      updateSelectedTextStyle({ textAlign: align });
    }
  };

  const updateSelectedTextObject = (text: string) => {
    const activeObject = canvas?.getActiveObject() as any;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set({ text });
      canvas?.renderAll();
    }
  };

  const updateSelectedTextStyle = (styleObj: Record<string, any>) => {
    const activeObject = canvas?.getActiveObject() as any;
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set(styleObj);
      canvas?.renderAll();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadImage) {
      onUploadImage(file);
    }
  };

  const handleAddElement = (element: DesignElement) => {
    if (!canvas) return;

    // Add the element to the canvas
    // @ts-ignore - Using global window.fabric
    window.fabric.Image.fromURL(element.url, (img: any) => {
      img.scale(0.2); // Scale down the image
      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  return (
    <motion.div 
      className="bg-secondary rounded-[12px] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="text">
        <TabsList className="mb-4 w-full grid grid-cols-3">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="elements" className="flex items-center gap-2">
            <Shapes className="h-4 w-4" />
            <span>Elements</span>
          </TabsTrigger>
          <TabsTrigger value="uploads" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Uploads</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div>
            <Label htmlFor="text-input">Text</Label>
            <Input
              id="text-input"
              value={textValue}
              onChange={handleTextChange}
              placeholder="Enter your text here"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <select
              id="font-family"
              value={fontFamily}
              onChange={handleFontFamilyChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 mt-1"
            >
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Impact">Impact</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <Label htmlFor="font-size">Font Size</Label>
              <span className="text-sm text-muted-foreground">{fontSize}px</span>
            </div>
            <Slider
              id="font-size"
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
              min={8}
              max={72}
              step={1}
            />
          </div>

          <div>
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex mt-1">
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={handleTextColorChange}
                className="w-10 h-10 p-0 border-none"
              />
              <Input
                value={textColor}
                onChange={handleTextColorChange}
                className="ml-2 flex-1"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="icon" variant="outline" onClick={handleBoldClick}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleItalicClick}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={() => handleAlignClick('left')}>
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={() => handleAlignClick('center')}>
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={() => handleAlignClick('right')}>
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="elements">
          <div className="space-y-4">
            <div>
              <Label htmlFor="element-category">Category</Label>
              <select
                id="element-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 mt-1"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
              {designElements.map((element, index) => (
                <div 
                  key={index} 
                  className="text-center cursor-pointer hover:opacity-80 transition"
                  onClick={() => handleAddElement(element)}
                >
                  <div className="bg-background rounded-md p-2 mb-1">
                    <img 
                      src={element.url} 
                      alt={element.name} 
                      className="mx-auto h-12 w-12 object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{element.name}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="uploads">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload your own images to use in your design
              </p>
              <Label 
                htmlFor="image-upload" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer inline-block"
              >
                Upload Image
              </Label>
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">My Uploads</h3>
              <div className="bg-background rounded-md p-4 h-32 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No uploads yet</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DesignControls;
