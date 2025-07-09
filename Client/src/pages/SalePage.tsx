import React from 'react';
import Footer from '../components/shared/Footer';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useCategoryFilters } from '../hooks/useCategoryFilters';
import CategorySidebar from '../components/category/CategorySidebar';
import ProductList from '../components/category/ProductList';
import MobileFiltersDrawer from '../components/MobileFiltersDrawer';
import type { Product } from '../data/products';
import { Sparkles, Tag } from 'lucide-react';

// Only including products with oldPrice (on sale)
const saleProducts: Product[] = [
  {
    id: 1,
    name: "Modern Fabric Sofa Couch with Reversible Chaise Lounge",
    image: "https://hirixdirect.co.uk/uploads/products/67d2f63383984_235782643.jpg",
    price: 509.99,
    oldPrice: 649.99,
    rating: 4.5,
    reviewCount: 42,
    category: "Living Room",
    color: "Gray",
    material: "Fabric"
  },
  {
    id: 2,
    name: "Executive Office Chair with High Back, Adjustable Height",
    image: "https://hirixdirect.co.uk/uploads/products/679cd9423ad0e_1908007584.jpg",
    price: 159.99,
    oldPrice: 219.99,
    rating: 4.2,
    reviewCount: 28,
    category: "Home Office",
    color: "Black",
    material: "Leather"
  },
  {
    id: 3,
    name: "Patio Garden 3-Seat Canopy Swing Chair",
    image: "https://hirixdirect.co.uk/uploads/products/665f2f1db56bb_779944139.jpg",
    price: 229.99,
    oldPrice: 299.99,
    rating: 4.8,
    reviewCount: 35,
    category: "Outdoor",
    color: "Beige",
    material: "Metal"
  },
  {
    id: 4,
    name: "5-Drawer Wooden Dresser Chest of Drawers",
    image: "https://hirixdirect.co.uk/uploads/products/6644c64f1bd3d_406354965.jpeg",
    price: 189.99,
    oldPrice: 249.99,
    rating: 4.3,
    reviewCount: 21,
    category: "Bedroom",
    color: "Brown",
    material: "Wood"
  },
  {
    id: 5,
    name: "Garden Metal Raised Bed Planter Box",
    image: "https://hirixdirect.co.uk/uploads/products/665608bac0098_338816904.jpg",
    price: 79.99,
    oldPrice: 119.99,
    rating: 4.1,
    reviewCount: 18,
    category: "Garden",
    color: "Black",
    material: "Metal"
  },
  {
    id: 6,
    name: "Outdoor Patio Fire Pit Table with BBQ Grill",
    image: "https://hirixdirect.co.uk/uploads/products/665dd8fdcde88_355312991.jpg",
    price: 159.99,
    oldPrice: 199.99,
    rating: 4.6,
    reviewCount: 32,
    category: "Garden",
    color: "Black",
    material: "Metal"
  }
];

const SalePage = () => {
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