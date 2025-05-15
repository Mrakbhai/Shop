import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const DesignToolSection: React.FC = () => {
  const features = [
    'Intuitive drag-and-drop interface',
    'Thousands of elements and fonts',
    'Upload your own images and artwork',
    'Preview your design on different products'
  ];

  return (
    <section id="create" className="theme-transition py-16 bg-secondary">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-inter text-3xl font-bold mb-4">Create Your Own Design</h2>
            <p className="text-muted-foreground mb-6">
              Our easy-to-use design tool lets you bring your ideas to life. Add text, upload images, or use our library of elements to create your perfect t-shirt.
            </p>
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="mr-2 h-5 w-5 text-green-500 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/create" className="btn-primary">
              Start Designing Now
            </Link>
          </motion.div>
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="T-shirt design tool interface" 
              className="rounded-[12px] shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DesignToolSection;