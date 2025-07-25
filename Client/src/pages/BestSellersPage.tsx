import React, { useState, useEffect, useRef } from 'react';
import ProductFilters from '../components/ProductFilters';
import MobileFiltersDrawer from '../components/MobileFiltersDrawer';
import { allProducts } from '../data/products';
import type { Product } from '../data/products';
import Footer from '../components/shared/Footer';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Star, Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Link } from 'react-router-dom';
import { addItem as addToCart } from '../store/cartSlice';
import { addItem as addToWishlist } from '../store/wishlistSlice';
import { toast } from '@/components/ui/use-toast';
import ProductCard from '@/components/product/ProductCard';

const BestSellersBanner = () => (
  <section className="relative py-8 bg-gradient-to-br from-yellow-50 via-white to-orange-50 overflow-hidden">
    <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
        className="inline-flex items-center gap-2 px-4 py-1 bg-white/80 border border-yellow-200 rounded-full text-yellow-700 font-semibold text-sm shadow mb-4 animate-pulse"
      >
        <Star className="w-5 h-5 text-yellow-500" /> BEST SELLERS
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight text-gray-900 drop-shadow-lg"
      >
        Our Most Popular Products
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
      >
        Handpicked for you, loved by our customers.
      </motion.p>
    </div>
  </section>
);

const BestSellersPage = () => {
  const products = useSelector((state: RootState) => state.products.products);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const bestSellerProducts = products.filter(p => p.bestSeller);

  // Get unique colors, materials, and categories from best sellers
  const allColors = Array.from(new Set(bestSellerProducts.map(p => p.color)));
  const allMaterials = Array.from(new Set(bestSellerProducts.map(p => p.material)));
  const allCategories = Array.from(new Set(bestSellerProducts.map(p => p.category)));

  // Get min and max prices
  const prices = bestSellerProducts.map(p => p.price);
  const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const priceRangeChangedByUser = useRef(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(bestSellerProducts);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const dispatch = useDispatch();

  const handleAddToCart = (product: any) => {
    const productId = product._id || product.id;
    dispatch(addToCart({ ...product, id: productId, quantity: 1 }));
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`
    });
  };
  const handleAddToWishlist = (product: any) => {
    const wishlistItem = {
      productId: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      inStock: product.inventory > 0,
      id: product._id || product.id,
    };
    dispatch(addToWishlist(wishlistItem));
    toast({
      title: 'Added to Wishlist',
      description: `${product.name} has been added to your wishlist.`
    });
  };

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  }, [bestSellerProducts]);

  // Filter products when filters change
  useEffect(() => {
    const filtered = bestSellerProducts.filter(product => {
      // Price filter
      const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      // Color filter
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
      // Material filter
      const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
      // Category filter
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      return priceInRange && colorMatch && materialMatch && categoryMatch;
    });
    setFilteredProducts(filtered);
  }, [priceRange, selectedColors, selectedMaterials, selectedCategory, allProducts]);

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCategory('all');
  };

  // Use backend categories for filter dropdown
  const allCategoryNames = Array.isArray(categories) ? categories.map((cat: any) => cat.name) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <BestSellersBanner />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Best Sellers</h1>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BestSellersPage; 