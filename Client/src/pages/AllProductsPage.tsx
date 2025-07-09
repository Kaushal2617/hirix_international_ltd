import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ProductFilters from '../components/ProductFilters';
import MobileFiltersDrawer from '../components/MobileFiltersDrawer';
import { allProducts } from '../data/products';
import type { Product } from '../data/products';
import Footer from '../components/shared/Footer'

const AllProductsPage = () => {
  // Get unique colors, materials, and categories from products
  const allColors = Array.from(new Set(allProducts.map(p => p.color)));
  const allMaterials = Array.from(new Set(allProducts.map(p => p.material)));
  const allCategories = Array.from(new Set(allProducts.map(p => p.category)));
  
  // Get min and max prices
  const prices = allProducts.map(p => p.price);
  const minPrice = Math.floor(Math.min(...prices));
  const maxPrice = Math.ceil(Math.max(...prices));

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter products when filters change
  useEffect(() => {
    const filtered = allProducts.filter(product => {
      // Price filter
      const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Color filter
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
      
      // Material filter
      const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
      
      // Category filter
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
      
      return priceInRange && colorMatch && materialMatch && categoryMatch;
    });
    
    setFilteredProducts(filtered);
  }, [priceRange, selectedColors, selectedMaterials, selectedCategory]);

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">All Products</h1>
            {isMobile && (
              <MobileFiltersDrawer
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                colors={allColors}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                materials={allMaterials}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
                minPrice={minPrice}
                maxPrice={maxPrice}
                resetFilters={resetFilters}
                categories={allCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Desktop */}
            {!isMobile && (
              <aside className="w-full md:w-64 shrink-0">
                <div className="border rounded-lg p-4 sticky top-6">
                  <h2 className="font-semibold text-lg mb-4 flex items-center">
                    <SlidersHorizontal size={18} className="mr-2" />
                    Filters
                  </h2>
                  <ProductFilters
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    colors={allColors}
                    selectedColors={selectedColors}
                    setSelectedColors={setSelectedColors}
                    materials={allMaterials}
                    selectedMaterials={selectedMaterials}
                    setSelectedMaterials={setSelectedMaterials}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    resetFilters={resetFilters}
                    categories={allCategories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                </div>
              </aside>
            )}
            
            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters or browse our other categories.
                  </p>
                  <Button onClick={resetFilters}>Reset Filters</Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <Link to={`/product/${product.id}`} key={product.id}>
                        <Card className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="relative overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.oldPrice && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                            <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    fill={i < Math.floor(product.rating) ? "#FFC107" : "none"}
                                    stroke={i < Math.floor(product.rating) ? "#FFC107" : "#D1D5DB"}
                                    className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-red-500">£{product.price.toFixed(2)}</span>
                              {product.oldPrice && (
                                <span className="ml-2 text-sm text-gray-500 line-through">£{product.oldPrice.toFixed(2)}</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer/>
    </div>
  );
};

export default AllProductsPage;