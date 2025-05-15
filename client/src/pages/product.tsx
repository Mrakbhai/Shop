import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Star, Truck, Package, ShieldCheck, Heart, BarChart3, Minus, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PRODUCT_COLORS, PRODUCT_SIZES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';

const ProductPage: React.FC = () => {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id ? parseInt(params.id) : null;
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  // Fetch product details
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  // Fetch creator details
  const { data: creator } = useQuery({
    queryKey: [`/api/users/${product?.creatorId}`],
    enabled: !!product?.creatorId,
  });

  // Fetch reviews
  const { data: reviews } = useQuery({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-[12px]" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-8 w-1/4 mb-6" />
            
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-1/3 mb-3" />
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-8 h-8 rounded-full" />
                  ))}
                </div>
              </div>
              
              <div>
                <Skeleton className="h-6 w-1/3 mb-3" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-16 h-10 rounded-md" />
                  ))}
                </div>
              </div>
              
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedSize}, ${selectedColor})`,
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | PrintOn</title>
        <meta name="description" content={product.description || `${product.name} - Custom t-shirt designed by independent creators.`} />
        <meta property="og:title" content={`${product.name} | PrintOn`} />
        <meta property="og:description" content={product.description || `${product.name} - Custom t-shirt designed by independent creators.`} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={product.imageUrl} />
      </Helmet>
      
      <div className="container py-12">
        <motion.div 
          className="flex flex-col md:flex-row gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Product Image */}
          <div className="md:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full rounded-[12px] shadow-md object-cover aspect-square"
              />
            </motion.div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2">
            <div className="mb-6">
              {creator && (
                <div className="flex items-center mb-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={creator.avatar} alt={creator.displayName || creator.username} />
                    <AvatarFallback>{creator.displayName?.slice(0, 2) || creator.username.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    By <span className="text-primary">{creator.displayName || creator.username}</span>
                  </span>
                </div>
              )}
              
              <h1 className="font-inter text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(24 reviews)</span>
              </div>
              
              <p className="text-xl font-semibold mb-6">${product.price.toFixed(2)}</p>
              
              {product.description && (
                <p className="text-muted-foreground mb-6">{product.description}</p>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Color Selection */}
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors?.map((colorId) => {
                    const color = PRODUCT_COLORS.find(c => c.id === colorId);
                    if (!color) return null;
                    
                    return (
                      <button
                        key={color.id}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedColor === color.id 
                            ? 'ring-2 ring-primary ring-offset-2' 
                            : 'ring-1 ring-border'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.id)}
                        title={color.name}
                      >
                        {selectedColor === color.id && (
                          <Check className={`h-5 w-5 ${
                            ['white', 'yellow'].includes(color.id) ? 'text-black' : 'text-white'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Size Selection */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Size</h3>
                  <button className="text-sm text-primary">Size Guide</button>
                </div>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border border-muted bg-background peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Quantity Selection */}
              <div>
                <h3 className="font-medium mb-2">Quantity</h3>
                <div className="flex h-10 w-32">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-full rounded-r-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 flex items-center justify-center border-y border-border">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-full rounded-l-none"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="flex gap-2">
                  <Heart className="h-5 w-5" />
                  <span className="md:hidden lg:inline">Add to Wishlist</span>
                </Button>
              </div>
              
              {/* Product Info */}
              <div className="bg-secondary rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-muted-foreground">Orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-muted-foreground">Within 30 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Quality Guarantee</p>
                    <p className="text-muted-foreground">Premium materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full flex">
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="py-6">
              <div className="prose max-w-none">
                <h3>Product Details</h3>
                <p>{product.description || "This premium quality t-shirt features a unique design created by an independent artist. Made from high-quality materials for comfort and durability."}</p>
                
                <h3 className="mt-6">Features</h3>
                <ul>
                  <li>Premium quality cotton</li>
                  <li>Comfortable fit</li>
                  <li>Pre-shrunk fabric</li>
                  <li>Durable print that won't fade</li>
                  <li>Available in multiple colors and sizes</li>
                </ul>
                
                <h3 className="mt-6">Care Instructions</h3>
                <p>Machine wash cold, inside-out with similar colors. Use non-chlorine bleach only when needed. Tumble dry low. Do not iron decoration. Do not dry clean.</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Customer Reviews</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="ml-2 text-sm">Based on 24 reviews</span>
                    </div>
                  </div>
                  <Button>Write a Review</Button>
                </div>
                
                <Separator />
                
                {/* Sample reviews */}
                {reviews ? (
                  reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{review.user?.username || 'Anonymous'}</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p>{review.comment}</p>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )
                ) : (
                  // Sample review when no reviews data is available
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Emma Thompson</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 5 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          August 12, 2023
                        </span>
                      </div>
                      <p>I absolutely love this t-shirt! The design is beautiful and the fabric quality is excellent. Fits perfectly and the colors are vibrant. Will definitely order more from this creator.</p>
                      <Separator className="mt-4" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">James Wilson</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          July 29, 2023
                        </span>
                      </div>
                      <p>Great quality t-shirt with a unique design. The sizing runs a bit large so I'd recommend ordering one size down. Other than that, very satisfied with my purchase!</p>
                      <Separator className="mt-4" />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="py-6">
              <div className="prose max-w-none">
                <h3>Shipping Information</h3>
                <p>We ship worldwide using reliable courier services. Most orders are processed within 1-2 business days.</p>
                
                <h4 className="mt-4">Estimated Delivery Times:</h4>
                <ul>
                  <li><strong>USA:</strong> 3-5 business days</li>
                  <li><strong>Canada:</strong> 5-7 business days</li>
                  <li><strong>Europe:</strong> 7-10 business days</li>
                  <li><strong>Australia/NZ:</strong> 10-14 business days</li>
                  <li><strong>Rest of World:</strong> 10-20 business days</li>
                </ul>
                
                <p>Free shipping on orders over $50. Standard shipping costs are calculated at checkout based on your location.</p>
                
                <h3 className="mt-6">Return Policy</h3>
                <p>We want you to be completely satisfied with your purchase. If for any reason you're not happy with your order, we accept returns within 30 days of delivery.</p>
                
                <p>To be eligible for a return, your item must be unworn, unwashed, and in the original packaging. Return shipping costs are the responsibility of the customer unless the item is defective or we made an error.</p>
                
                <p>For more information on how to initiate a return, please contact our customer service team.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="font-inter text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-0">
                  <img 
                    src={`https://images.unsplash.com/photo-15${Math.floor(10000000 + Math.random() * 90000000)}`}
                    alt="Related Product"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <Badge className="mb-2">New</Badge>
                    <h3 className="font-medium">Related Product {i + 1}</h3>
                    <p className="text-sm text-muted-foreground mb-2">By Creator Name</p>
                    <p className="font-semibold">${(20 + i * 5).toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
