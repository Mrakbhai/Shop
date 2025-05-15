import React, { useState } from 'react';
import { Link } from 'wouter';
import { CATEGORIES, SHIRT_MOCKUPS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/shop/ProductCard';
import { motion } from 'framer-motion';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const CategorySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', selectedCategory],
    enabled: true,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="shop" className="theme-transition py-16 bg-secondary">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="font-inter text-3xl font-bold">Shop By Category</h2>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="rounded-full px-4 py-2 text-sm font-medium"
              onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-background rounded-[12px] overflow-hidden shadow-sm">
                <Skeleton className="w-full h-[300px]" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Show either fetched products or sample products if none available */}
            {(products?.length > 0 ? products : [
              {
                id: 1,
                name: 'Geometric Minimalist',
                price: 29.99,
                imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
                creatorId: 1,
                creator: { displayName: 'MinimalCreations' },
                colors: ['black', 'white', 'gray', 'blue']
              },
              {
                id: 2,
                name: 'Anime Hero',
                price: 32.99,
                imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1',
                creatorId: 2,
                creator: { displayName: 'OtakuDesigns' },
                colors: ['black', 'white', 'red']
              },
              {
                id: 3,
                name: 'Beast Mode',
                price: 27.99,
                imageUrl: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34',
                creatorId: 3,
                bestSeller: true,
                creator: { displayName: 'FitVibes' },
                colors: ['gray', 'black', 'green']
              },
              {
                id: 4,
                name: 'Abstract Dreams',
                price: 34.99,
                imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
                creatorId: 4,
                creator: { displayName: 'ArtisticSoul' },
                colors: ['blue', 'white', 'yellow']
              }
            ]).map((product, index) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="flex justify-center mt-10">
          <Button variant="outline" className="rounded-[12px]">
            Load More Designs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
