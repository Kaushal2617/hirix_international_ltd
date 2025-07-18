import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ProductFilters from '../components/ProductFilters';
import MobileFiltersDrawer from '../components/MobileFiltersDrawer';
import { allProducts } from '../data/products';
import type { Product } from '../data/products';
import Footer from '../components/shared/Footer'
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import type { RootState } from '../store';

const AllProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state: any) => state.products);
  const categories = useSelector((state: RootState) => state.categories.categories);

  // All hooks must be called before any return!
  const allColors = Array.from(new Set(products.map((p: any) => p.color)));
  const allMaterials = Array.from(new Set(products.map((p: any) => p.material)));
  // Use backend categories for filter dropdown
  const allCategoryNames = Array.isArray(categories) ? categories.map((cat: any) => cat.name) : [];
  const prices = products.map((p: any) => p.price);
  const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const priceRangeChangedByUser = useRef(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!products || products.length === 0) {
      console.log('Dispatching fetchProducts because products is empty on mount');
      dispatch(fetchProducts() as any);
    }
  }, [dispatch]);

  useEffect(() => {
    console.log('AllProductsPage products:', products);
    console.log('AllProductsPage loading:', loading);
    console.log('AllProductsPage error:', error);
  }, [products, loading, error]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const filtered = products.filter((product: any) => {
      // Remove filter for blob/data URLs; always show all products
      const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
      const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
      return priceInRange && colorMatch && materialMatch && categoryMatch;
    });
    setFilteredProducts(filtered);
  }, [products, priceRange, selectedColors, selectedMaterials, selectedCategory]);

  useEffect(() => {
    console.log('AllProductsPage filteredProducts:', filteredProducts);
  }, [filteredProducts]);

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCategory("all");
  };

  // When user changes price range, mark as changed
  const handlePriceRangeChange = (range: [number, number]) => {
    priceRangeChangedByUser.current = true;
    setPriceRange(range);
  };

  // Keep price filter consistent after refresh
  useEffect(() => {
    if (!priceRangeChangedByUser.current && prices.length) {
      setPriceRange([minPrice, maxPrice]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // Only after all hooks:
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Helper for fallback image
  const getProductImage = (img: string) => {
    if (!img || img.startsWith('blob:') || img.startsWith('data:')) {
      return '/placeholder.svg'; // fallback image path
    }
    return img;
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
                setPriceRange={handlePriceRangeChange}
                colors={allColors}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                materials={allMaterials}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
                minPrice={minPrice}
                maxPrice={maxPrice}
                resetFilters={resetFilters}
                categories={allCategoryNames}
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
                    setPriceRange={handlePriceRangeChange}
                    colors={allColors}
                    selectedColors={selectedColors}
                    setSelectedColors={setSelectedColors}
                    materials={allMaterials}
                    selectedMaterials={selectedMaterials}
                    setSelectedMaterials={setSelectedMaterials}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    resetFilters={resetFilters}
                    categories={allCategoryNames}
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
                    {filteredProducts.map((product: any) => (
                      <Link to={`/product/${product._id || product.id}`} key={product._id || product.id}>
                        <Card className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="relative overflow-hidden">
                            <img
                              src={getProductImage(product.image)}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
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