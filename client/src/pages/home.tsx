import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CategorySection from '@/components/home/CategorySection';
import PopularDesignsSection from '@/components/home/PopularDesignsSection';
import CreatorSection from '@/components/home/CreatorSection';
import DesignToolSection from '@/components/home/DesignToolSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BecomeSellerSection from '@/components/home/BecomeSellerSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { Helmet } from 'react-helmet';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>PrintOn - Custom Print-on-Demand Marketplace</title>
        <meta name="description" content="Create custom apparel that speaks your language or shop from thousands of unique designs from independent creators." />
        <meta property="og:title" content="PrintOn - Custom Print-on-Demand Marketplace" />
        <meta property="og:description" content="Design your story, wear your passion. PrintOn lets you create and shop custom designs from thousands of independent creators." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <HeroSection />
      <PopularDesignsSection />
      <FeaturesSection />
      <CategorySection />
      <DesignToolSection />
      <CreatorSection />
      <TestimonialsSection />
      <BecomeSellerSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
