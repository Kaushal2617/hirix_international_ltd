import React from 'react';
import Footer from '../components/shared/Footer';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useCategoryFilters } from '../hooks/useCategoryFilters';
import CategorySidebar from '../components/category/CategorySidebar';
import ProductList from '../components/category/ProductList';
import MobileFiltersDrawer from '../components/MobileFiltersDrawer';
import type { Product } from '../data/products';
import { Sparkles, Tag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const SalePage = () => {
  const products = useSelector((state: RootState) => state.products.products);
  const saleProducts = products.filter(p => p.oldPrice || p.sale);
  // Get responsive layout state
  const { isMobile } = useResponsiveLayout();
  
  // Get category filters state
  const {
    allColors,
    allMaterials,
    allSubcategories,
    minPrice,
    maxPrice,
    priceRange,
    setPriceRange,
    selectedColors,
    setSelectedColors,
    selectedMaterials,
    setSelectedMaterials,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    resetFilters
  } = useCategoryFilters({ categoryProducts: saleProducts });

  // Filter props to pass to components
  const filterProps = {
    priceRange,
    setPriceRange,
    colors: allColors,
    selectedColors,
    setSelectedColors,
    materials: allMaterials,
    selectedMaterials,
    setSelectedMaterials,
    minPrice,
    maxPrice,
    resetFilters,
    categories: allSubcategories,
    selectedCategory,
    setSelectedCategory
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Modern Sale Header */}
        <section className="relative py-8 bg-gradient-to-br from-red-50 via-white to-pink-50 overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-white/80 border border-red-200 rounded-full text-red-600 font-semibold text-sm shadow mb-4 animate-pulse">
              <Tag className="w-5 h-5 text-red-500" /> SALE
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-gray-900 drop-shadow-lg">
              Clearance Event: Save Big!
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-2 max-w-2xl mx-auto">
              Huge savings on selected items across our range.
            </p>
          </div>
          {/* Decorative Sparkles */}
          <Sparkles className="absolute left-8 top-8 w-10 h-10 text-pink-200 animate-spin-slow" />
          <Sparkles className="absolute right-8 bottom-8 w-10 h-10 text-yellow-100 animate-spin-slow" />
        </section>
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-end items-center mb-8">
            {isMobile && (
              <MobileFiltersDrawer {...filterProps} />
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Desktop */}
            {!isMobile && <CategorySidebar {...filterProps} />}
            
            {/* Product Grid */}
            <div className="flex-1">
              <ProductList 
                filteredProducts={filteredProducts}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalePage;