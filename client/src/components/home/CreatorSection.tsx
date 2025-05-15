import React from 'react';
import { Link } from 'wouter';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from '@/components/ui/avatar';
import { Star, StarHalf } from 'lucide-react';
import { motion } from 'framer-motion';

interface Creator {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
}

const CreatorSection: React.FC = () => {
  const creators: Creator[] = [
    {
      id: 1,
      name: 'Sara Johnson',
      specialty: 'Minimalist Designs',
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
    },
    {
      id: 2,
      name: 'Mike Zhang',
      specialty: 'Anime & Pop Culture',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
    },
    {
      id: 3,
      name: 'Aisha Williams',
      specialty: 'Fitness & Motivation',
      rating: 4.2,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
    },
    {
      id: 4,
      name: 'David Rodriguez',
      specialty: 'Abstract & Artistic',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
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
          <h2 className="font-inter text-3xl font-bold mb-4">Featured Creators</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover talented designers from around the world who create unique and exclusive t-shirt designs.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {creators.map((creator) => (
            <motion.div 
              key={creator.id}
              className="bg-secondary rounded-[12px] p-6 text-center card-hover"
              variants={item}
            >
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="font-inter text-lg font-semibold">{creator.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{creator.specialty}</p>
              
              <div className="flex justify-center space-x-1 mb-4">
                {[...Array(Math.floor(creator.rating))].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
                {creator.rating % 1 !== 0 && (
                  <StarHalf className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                )}
                <span className="text-sm text-muted-foreground ml-1">{creator.rating.toFixed(1)}</span>
              </div>
              
              <Link href={`/creator/${creator.id}`}>
                <a className="text-primary font-medium hover:underline">View Collection</a>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <Link href="/creators">
            <a className="inline-flex items-center text-primary font-medium hover:underline">
              Explore All Creators
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CreatorSection;
