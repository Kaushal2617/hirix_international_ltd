import React from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/Home/HeroCarousel';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import CategoryGrid from '../components/Home/CategoryGrid';
import Footer from '../components/shared/Footer';
import AnimatedProductShowcase from '../components/Home/AnimatedProductShowcase';
import PromoBanners from '../components/Home/PromoBanners';

const Index = ({ categories = [] }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
        <HeroCarousel />
        
        <div className="container mx-auto px-4">
          <FeaturedProducts />
        </div>
        <AnimatedProductShowcase />
        <CategoryGrid categories={categories.filter(cat => !!cat.image)} />
        
      </main>
      
      <PromoBanners />
      <Footer />
    </div>
  );
};

export default Index;