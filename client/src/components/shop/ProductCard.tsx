import React, { useState } from 'react';
import { Link } from 'wouter';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Product } from '@shared/schema';
import { PRODUCT_COLORS } from '@/lib/constants';

interface ProductCardProps {
  product: Product | any; // Using any as a fallback for mock data
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Would implement quick view modal here
  };

  return (
    <motion.div 
      className="bg-background rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/product/${product.id}`}>
        <a className="block relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-[300px] object-cover"
          />
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>
          {product.bestSeller && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              BEST SELLER
            </div>
          )}
        </a>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg product-title">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              By <span className="text-primary">{product.creator?.displayName || 'Unknown Creator'}</span>
            </p>
          </div>
          <span className="font-inter font-semibold">${product.price.toFixed(2)}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-1">
            {product.colors?.map((color: string, index: number) => {
              const colorObj = PRODUCT_COLORS.find(c => c.id === color) || { hex: '#000000' };
              return (
                <span 
                  key={index} 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: colorObj.hex }}
                  title={colorObj.name}
                />
              );
            })}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm font-medium text-primary hover:text-primary hover:bg-transparent p-0"
            onClick={handleQuickView}
          >
            Quick View
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;