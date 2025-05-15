import React from 'react';
import { 
  Paintbrush, 
  Shirt, 
  Truck, 
  SquarePen, 
  Award, 
  CreditCard, 
  Clock,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  const benefits = [
    {
      icon: <Award className="text-primary w-7 h-7" />,
      title: 'Premium Quality',
      description: 'Our products are made with high-quality materials for comfort and durability.'
    },
    {
      icon: <CreditCard className="text-primary w-7 h-7" />,
      title: 'Secure Payments',
      description: 'Your transactions are protected with industry-standard encryption.'
    },
    {
      icon: <Truck className="text-primary w-7 h-7" />,
      title: 'Fast Delivery',
      description: 'Quick production and reliable shipping to your doorstep.'
    },
    {
      icon: <Users className="text-primary w-7 h-7" />,
      title: 'Creator Marketplace',
      description: 'Shop from independent artists or become a creator yourself.'
    }
  ];

  const howItWorks = [
    {
      icon: <SquarePen className="text-white w-6 h-6" />,
      title: 'Choose Product',
      description: 'Select from t-shirts, hoodies, caps and more from our catalog.'
    },
    {
      icon: <Paintbrush className="text-white w-6 h-6" />,
      title: 'Design It',
      description: 'Use our easy design tool or pick from thousands of existing designs.'
    },
    {
      icon: <CreditCard className="text-white w-6 h-6" />,
      title: 'Order',
      description: 'Complete your purchase with our secure checkout process.'
    },
    {
      icon: <Clock className="text-white w-6 h-6" />,
      title: 'Delivered',
      description: 'We print and ship your custom product via our Printify partners.'
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
    <section className="theme-transition py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Benefits Section */}
        <div className="mb-24">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-inter text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground">
              We provide a seamless experience from design to delivery, with quality and customer satisfaction at the heart of everything we do.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-card border border-border p-6 rounded-xl hover:shadow-md transition duration-300"
                variants={item}
              >
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-inter text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* How It Works Section */}
        <div>
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-inter text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Creating and ordering your custom products is a simple, four-step process.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-primary/20 z-0"></div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {howItWorks.map((step, index) => (
                <motion.div 
                  key={index}
                  className="text-center relative"
                  variants={item}
                >
                  <div className="bg-primary w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg relative">
                    <span className="absolute -top-2 -right-2 bg-background text-primary text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-primary">
                      {index + 1}
                    </span>
                    {step.icon}
                  </div>
                  <h3 className="font-inter text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
