import React, { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { CATEGORIES, PRODUCT_COLORS, PRODUCT_SIZES } from '@/lib/constants';

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    colors: [],
    sizes: [],
    priceRange: [0, 100]
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    let updatedCategories = [...filters.categories];
    
    if (checked) {
      updatedCategories.push(category);
    } else {
      updatedCategories = updatedCategories.filter(cat => cat !== category);
    }
    
    const updatedFilters = { ...filters, categories: updatedCategories };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleColorChange = (color: string, checked: boolean) => {
    let updatedColors = [...filters.colors];
    
    if (checked) {
      updatedColors.push(color);
    } else {
      updatedColors = updatedColors.filter(c => c !== color);
    }
    
    const updatedFilters = { ...filters, colors: updatedColors };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    let updatedSizes = [...filters.sizes];
    
    if (checked) {
      updatedSizes.push(size);
    } else {
      updatedSizes = updatedSizes.filter(s => s !== size);
    }
    
    const updatedFilters = { ...filters, sizes: updatedSizes };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const updatedFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const resetFilters = {
      categories: [],
      colors: [],
      sizes: [],
      priceRange: [0, 100]
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-inter text-lg font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'price']}>
        <AccordionItem value="categories">
          <AccordionTrigger className="font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {CATEGORIES.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger className="font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-4 px-2">
              <Slider 
                defaultValue={[0, 100]} 
                max={100} 
                step={1} 
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="colors">
          <AccordionTrigger className="font-medium">Colors</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 mt-2">
              {PRODUCT_COLORS.map(color => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`color-${color.id}`} 
                    checked={filters.colors.includes(color.id)}
                    onCheckedChange={(checked) => handleColorChange(color.id, checked as boolean)}
                  />
                  <div className="flex items-center">
                    <span 
                      className="w-4 h-4 rounded-full border inline-block mr-2"
                      style={{ backgroundColor: color.hex }}
                    />
                    <Label 
                      htmlFor={`color-${color.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {color.name}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sizes">
          <AccordionTrigger className="font-medium">Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 mt-2">
              {PRODUCT_SIZES.map(size => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`size-${size}`} 
                    checked={filters.sizes.includes(size)}
                    onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`size-${size}`}
                    className="text-sm cursor-pointer"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilter;
