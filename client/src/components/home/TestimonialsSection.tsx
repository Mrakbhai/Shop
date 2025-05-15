import React from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Emma Thompson',
      date: 'August 12, 2023',
      rating: 5.0,
      comment: "I ordered a custom design t-shirt for my boyfriend's birthday and it turned out amazing! The quality is excellent and the colors are vibrant. Will definitely order again.",
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
    },
    {
      id: 2,
      name: 'James Wilson',
      date: 'July 29, 2023',
      rating: 4.5,
      comment: "As a small business owner, I ordered matching t-shirts for my team and I'm impressed with the quality and customer service. The design tool was easy to use and the shirts arrived quickly.",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    {
      id: 3,
      name: 'Sophia Chen',
      date: 'September 3, 2023',
      rating: 5.0,
      comment: "I've been buying from PrintOn for over a year now. Their designs are unique and the t-shirt quality is consistent. I also love that they support independent artists.",
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="theme-transition py-16 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-inter text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied customers.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={item}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500" />
                      ))}
                      {testimonial.rating % 1 !== 0 && (
                        <div className="relative h-4 w-4">
                          <Star className="absolute h-4 w-4 fill-yellow-500" />
                          <div className="absolute h-4 w-2 right-0 bg-background overflow-hidden">
                            <Star className="absolute h-4 w-4 right-0 fill-background text-yellow-500" />
                          </div>
                        </div>
                      )}
                      <span className="ml-2 text-sm font-medium">{testimonial.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-foreground mb-6">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
