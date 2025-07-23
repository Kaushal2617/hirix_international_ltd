import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, SlidersHorizontal, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ProductFilters from '../components/ProductFilters';
import MobileFiltersDrawer from '../components/MobileFiltersDrawer';
import { allProducts } from '../data/products';
import type { Product } from '../data/products';
import Footer from '../components/shared/Footer'
import { useSelector, useDispatch } from 'react-redux';
import { addItem as addToCart } from '../store/cartSlice';
import { addItem as addToWishlist } from '../store/wishlistSlice';
import { toast } from '@/components/ui/use-toast';
import type { RootState } from '../store';
import ProductCard from '@/components/product/ProductCard';
import { fetchProducts } from '@/store/productSlice';

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

  const getId = (p: any) => (p.id ? p.id.toString() : p._id ? p._id.toString() : '');
  const handleAddToCart = (product: any) => {
    const productId = getId(product);
    dispatch(addToCart({ ...product, id: productId, quantity: 1 }));
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`
    });
  };
  const handleAddToWishlist = (product: any) => {
    dispatch(addToWishlist(product));
    toast({
      title: 'Added to Wishlist',
      description: `${product.name} has been added to your wishlist.`
    });
  };

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
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                      />
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