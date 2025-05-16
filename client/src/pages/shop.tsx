import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import ProductFilter, { FilterState } from '@/components/shop/ProductFilter';
import ProductGrid from '@/components/shop/ProductGrid';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowDownAZ, Grid2X2, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Product } from '@shared/schema';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const ShopPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    colors: [],
    sizes: [],
    priceRange: [0, 100]
  });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');

  // Fetch products
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: true,
  });

  // Apply filters and sorting
  const filteredProducts = React.useMemo(() => {
    if (!data) return [];
    
    let filtered = [...data];
    
    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    // Apply color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.colors) return false;
        return product.colors.some(color => filters.colors.includes(color));
      });
    }
    
    // Apply size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.sizes) return false;
        return product.sizes.some(size => filters.sizes.includes(size));
      });
    }
    
    // Apply price filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        // Would implement based on popularity metrics
        break;
      default: // featured
        break;
    }
    
    return filtered;
  }, [data, filters, sortBy]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Helmet>
        <title>Shop Custom T-Shirts | PrintOn</title>
        <meta name="description" content="Browse our collection of unique custom t-shirts created by independent designers. Find the perfect tee to express your style." />
        <meta property="og:title" content="Shop Custom T-Shirts | PrintOn" />
        <meta property="og:description" content="Browse our collection of unique custom t-shirts created by independent designers." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="bg-secondary py-6">
        <div className="container">
          <h1 className="font-inter text-3xl font-bold mb-2">Shop Custom T-Shirts</h1>
          <p className="text-muted-foreground">Browse our collection of unique designs from independent creators</p>
        </div>
      </div>
      
      <div className="container py-8 bg-background text-foreground min-h-screen">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>
          
          {/* Filters - Mobile */}
          <Sheet>
            <div className="md:hidden mb-4 flex justify-between items-center">
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </SheetTrigger>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <SheetContent side="left">
              <div className="py-4">
                <ProductFilter onFilterChange={handleFilterChange} />
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="hidden md:flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} results
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Button 
                    variant={viewMode === 'compact' ? 'default' : 'ghost'} 
                    size="icon" 
                    onClick={() => setViewMode('compact')}
                    className="h-8 w-8"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="icon" 
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8"
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="icon" 
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.value.includes('price') && <ArrowDownAZ className="h-4 w-4" />}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <ProductGrid products={filteredProducts} isLoading={isLoading} />
            
            {!isLoading && filteredProducts.length > 12 && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage;
