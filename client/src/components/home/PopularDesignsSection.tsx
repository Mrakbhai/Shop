import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/shop/ProductCard';
import { motion } from 'framer-motion';

const PopularDesignsSection: React.FC = () => {
  // Fetch popular products
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products/popular'],
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
    <section className="theme-transition py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div>
            <motion.p 
              className="text-primary font-medium mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              TRENDING DESIGNS
            </motion.p>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold font-inter mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Popular Designs
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Discover our most loved designs across various categories, hand-picked from our top creators and bestsellers.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-0"
          >
            <Link href="/shop">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 rounded-full px-5 py-6 text-primary border-primary hover:bg-primary/10 transition-colors"
              >
                View All Designs <ArrowUpRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-card rounded-xl overflow-hidden shadow-sm">
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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Show either fetched products or sample products if none available */}
            {(products?.length > 0 ? products : [
              {
                id: 1,
                name: "Geometric Minimalist",
                price: 29.99,
                imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
                creatorId: 1,
                creator: { displayName: "MinimalDesigns" },
                colors: ["black", "white", "gray", "blue"],
                category: "Minimalist",
                bestSeller: true
              },
              {
                id: 2,
                name: "Anime Spirit",
                price: 32.99,
                imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                creatorId: 2,
                creator: { displayName: "OtakuArt" },
                colors: ["red", "black", "white"],
                category: "Anime"
              },
              {
                id: 3,
                name: "Beast Mode",
                price: 27.99,
                imageUrl: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34",
                creatorId: 3,
                creator: { displayName: "FitVibes" },
                colors: ["gray", "black", "green"],
                category: "Gym",
                bestSeller: true
              },
              {
                id: 4,
                name: "Abstract Dreams",
                price: 34.99,
                imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
                creatorId: 4,
                creator: { displayName: "ArtisticSoul" },
                colors: ["blue", "white", "yellow"],
                category: "Abstract Art"
              }
            ]).map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PopularDesignsSection;