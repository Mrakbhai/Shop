// Define typescript interfaces for Fabric.js objects
export interface DesignOptions {
  canvas: any; 
  canvasWidth: number;
  canvasHeight: number;
}

// Initialize design canvas
export function initializeCanvas(canvasId: string, width: number, height: number): any {
  try {
    console.log("Fabric object available?", window.fabric ? "Yes" : "No");
    
    if (!window.fabric) {
      console.error("Fabric.js is not loaded!");
      return null;
    }
    
    // @ts-ignore - Using global window.fabric
    const canvas = new window.fabric.Canvas(canvasId, {
      width,
      height,
      backgroundColor: '#FFFFFF'
    });
    
    console.log("Canvas created successfully:", canvas);
    return canvas;
  } catch (error) {
    console.error("Error initializing fabric canvas:", error);
    return null;
  }
}

// Add text to canvas
export function addText(canvas: any, text: string = 'Your Text Here'): void {
  // @ts-ignore - Using global window.fabric
  const textObj = new window.fabric.Text(text, {
    left: 50,
    top: 50,
    fontFamily: 'Arial',
    fill: '#000000',
    fontSize: 30
  });
  
  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  canvas.renderAll();
}

// Add image to canvas
export function addImage(canvas: any, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Use Image class from fabric for loading images
    // @ts-ignore - Using global window.fabric
    window.fabric.Image.fromURL(url, (img: any) => {
      // Scale image to fit within canvas while maintaining aspect ratio
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const imgWidth = img.width || 0;
      const imgHeight = img.height || 0;
      
      let scale = 1;
      if (imgWidth > imgHeight) {
        scale = (canvasWidth * 0.8) / imgWidth;
      } else {
        scale = (canvasHeight * 0.8) / imgHeight;
      }
      
      img.scale(scale);
      img.set({
        left: (canvasWidth - (imgWidth * scale)) / 2,
        top: (canvasHeight - (imgHeight * scale)) / 2
      });
      
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      resolve();
    }, (error: any) => {
      reject(error);
    });
  });
}

// Change canvas background color
export function setCanvasBackground(canvas: any, color: string): void {
  canvas.setBackgroundColor(color, () => {
    canvas.renderAll();
  });
}

// Delete selected object
export function deleteSelected(canvas: any): void {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.remove(activeObject);
    canvas.renderAll();
  }
}

// Save canvas as JSON
export function saveCanvasAsJSON(canvas: any): string {
  return JSON.stringify(canvas.toJSON());
}

// Load canvas from JSON
export function loadCanvasFromJSON(canvas: any, json: string): void {
  canvas.loadFromJSON(json, () => {
    canvas.renderAll();
  });
}

// Save canvas as image
export function saveCanvasAsImage(canvas: any): string {
  return canvas.toDataURL({
    format: 'png',
    quality: 1
  });
}

// Apply filters to selected image
export function applyFilterToSelected(canvas: any, filterType: string): void {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') {
    const imgObj = activeObject as any;
    const filters = imgObj.filters || [];
    
    switch (filterType) {
      case 'grayscale':
        // @ts-ignore - Using global window.fabric
        filters.push(new window.fabric.filters.Grayscale());
        break;
      case 'sepia':
        // @ts-ignore - Using global window.fabric
        filters.push(new window.fabric.filters.Sepia());
        break;
      case 'invert':
        // @ts-ignore - Using global window.fabric
        filters.push(new window.fabric.filters.Invert());
        break;
      case 'brightness':
        // @ts-ignore - Using global window.fabric
        filters.push(new window.fabric.filters.Brightness({ brightness: 0.1 }));
        break;
      case 'contrast':
        // @ts-ignore - Using global window.fabric
        filters.push(new window.fabric.filters.Contrast({ contrast: 0.1 }));
        break;
    }
    
    imgObj.filters = filters;
    imgObj.applyFilters();
    canvas.renderAll();
  }
}

// Clear filters from selected image
export function clearFiltersFromSelected(canvas: any): void {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') {
    const imgObj = activeObject as any;
    imgObj.filters = [];
    imgObj.applyFilters();
    canvas.renderAll();
  }
}
