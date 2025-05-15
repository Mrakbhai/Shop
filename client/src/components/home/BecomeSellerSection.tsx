import React from 'react';
import { Link } from 'wouter';
import { 
  Palette, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

const BecomeSellerSection: React.FC = () => {
  const benefits = [
    {
      icon: <Palette className="text-xl" />,
      title: 'Upload Designs',
      description: 'Create and upload your artwork'
    },
    {
      icon: <DollarSign className="text-xl" />,
      title: 'Earn Royalties',
      description: 'Get paid for every product sold'
    },
    {
      icon: <TrendingUp className="text-xl" />,
      title: 'Track Performance',
      description: 'Monitor sales with detailed analytics'
    }
  ];

  return (
    <section className="theme-transition py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-2/3 mb-8 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-inter text-3xl font-bold mb-4">Turn Your Creativity Into Income</h2>
            <p className="text-primary-foreground opacity-90 text-lg mb-6">
              Join our marketplace as a creator and earn money from every sale of your designs. No inventory, no shipping hassles - we handle everything for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="mr-3 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{benefit.title}</h3>
                    <p className="text-primary-foreground opacity-80 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link href="/sell">
              <a className="inline-flex items-center justify-center py-3 px-6 bg-background text-primary font-medium rounded-[12px] hover:bg-opacity-90 transition duration-200">
                Apply as a Creator
              </a>
            </Link>
          </motion.div>
          <motion.div 
            className="lg:w-1/3 lg:pl-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800" 
              alt="Designer working on laptop with t-shirt designs" 
              className="rounded-[12px] shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSellerSection;
