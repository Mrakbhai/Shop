import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Globe, Users, Heart, Leaf, Medal, CheckCircle } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About PrintOn | Custom T-Shirt Marketplace</title>
        <meta name="description" content="Learn about PrintOn, our mission to empower independent artists, and how we're revolutionizing the custom t-shirt industry." />
        <meta property="og:title" content="About PrintOn | Custom T-Shirt Marketplace" />
        <meta property="og:description" content="Learn about PrintOn, our mission to empower independent artists, and how we're revolutionizing the custom t-shirt industry." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-inter text-4xl font-bold mb-4">About PrintOn</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We're revolutionizing the way people express themselves through custom apparel,
              while empowering artists to monetize their creativity.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=800" 
                alt="PrintOn team" 
                className="rounded-[12px] shadow-lg w-full"
              />
            </motion.div>
            
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-inter text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                PrintOn was founded in 2020 with a simple mission: to create a platform where creativity meets quality, empowering artists and delighting customers.
              </p>
              <p className="text-muted-foreground mb-4">
                What started as a small operation has grown into a thriving marketplace, connecting thousands of independent designers with customers seeking unique and personalized apparel.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe in the power of self-expression through fashion, and we're committed to providing a sustainable platform that benefits creators, customers, and our planet.
              </p>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-semibold">Founded</span>
                <Separator orientation="vertical" className="h-4" />
                <span>2020</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="font-semibold">Headquarters</span>
                <Separator orientation="vertical" className="h-4" />
                <span>New York</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="font-semibold">Team</span>
                <Separator orientation="vertical" className="h-4" />
                <span>50+ people</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-secondary">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-inter text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We're guided by a set of core values that define our culture and shape our decisions.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-background p-6 rounded-[12px] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-inter text-xl font-semibold mb-2">Creative Freedom</h3>
              <p className="text-muted-foreground">
                We believe in providing artists with a platform where they can express their creativity without limitations.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-background p-6 rounded-[12px] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-inter text-xl font-semibold mb-2">Community First</h3>
              <p className="text-muted-foreground">
                We put our community of creators and customers at the center of everything we do.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-background p-6 rounded-[12px] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-inter text-xl font-semibold mb-2">Quality Obsessed</h3>
              <p className="text-muted-foreground">
                We're committed to delivering premium quality products that our customers and creators can be proud of.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-background p-6 rounded-[12px] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-inter text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-muted-foreground">
                We're dedicated to reducing our environmental footprint through responsible sourcing and production methods.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-background p-6 rounded-[12px] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Medal className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-inter text-xl font-semibold mb-2">Fair Compensation</h3>
              <p className="text-muted-foreground">
                We believe artists should be rewarded for their creativity with competitive royalties and transparent earnings.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-background p-6 rounded-[12px] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-inter text-xl font-semibold mb-2">Integrity & Trust</h3>
              <p className="text-muted-foreground">
                We operate with honesty and transparency in all our interactions with creators, customers, and partners.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-inter text-3xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              The talented team behind PrintOn's success
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="CEO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-inter text-lg font-semibold">Michael Carter</h3>
              <p className="text-sm text-muted-foreground">CEO & Co-Founder</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="COO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-inter text-lg font-semibold">Sarah Johnson</h3>
              <p className="text-sm text-muted-foreground">COO & Co-Founder</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="CTO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-inter text-lg font-semibold">David Rodriguez</h3>
              <p className="text-sm text-muted-foreground">CTO</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="Creative Director" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-inter text-lg font-semibold">Aisha Williams</h3>
              <p className="text-sm text-muted-foreground">Creative Director</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-inter text-3xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              We're growing fast and always looking for talented individuals to join our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="text-primary">
                View Open Positions
              </Button>
              <Button variant="outline" size="lg" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Learn About Our Culture
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-inter text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-8">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">support@printon.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground">123 Creative St, New York, NY 10001</p>
                </div>
              </div>
              <Button size="lg">Contact Support</Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
