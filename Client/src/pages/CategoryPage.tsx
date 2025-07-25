import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/shared/Footer';
import CategoryHeader from '../components/category/CategoryHeader';
import ProductList from '../components/category/ProductList';
import NoProductsFound from '../components/category/NoProductsFound';
import CategorySidebar from '../components/category/CategorySidebar';
import { useSelector, useDispatch } from 'react-redux';
import { addItem as addToCart } from '../store/cartSlice';
import { addItem as addToWishlist } from '../store/wishlistSlice';
import { toast } from '@/components/ui/use-toast';
import type { RootState } from '../store';

const CategoryPage = () => {
  const { categoryName, subcategory } = useParams();
  let title = '';
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  if (subcategory) {
    title = capitalize(subcategory);
  } else if (categoryName) {
    title = capitalize(categoryName);
  }
  const products = useSelector((state: RootState) => state.products.products);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const dispatch = useDispatch();

  // Filter products based on category or subcategory first
  const categoryProducts = products.filter(product => {
    if (subcategory) {
      return product.subcategory && product.subcategory.toLowerCase() === subcategory.toLowerCase();
    }
    return product.category.toLowerCase() === categoryName?.toLowerCase();
  });

  // Get unique colors, materials from products in this category
  const allColors = Array.from(new Set(categoryProducts.map(p => p.color)));
  const allMaterials = Array.from(new Set(categoryProducts.map(p => p.material)));

  // Use backend categories for filter dropdown
  const allCategoryNames = Array.isArray(categories) ? categories.map((cat: any) => cat.name) : [];

  // Get min and max prices for this category
  const prices = categoryProducts.map(p => p.price);
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState(categoryProducts);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset filters when category changes
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCategory("all");
    setFilteredProducts(categoryProducts);
  }, [categoryName, subcategory, products]);

  // Filter products when filters change
  useEffect(() => {
    const filtered = categoryProducts.filter(product => {
      // Price filter
      const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      // Color filter
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
      // Material filter
      const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
      // Subcategory filter
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
      return priceInRange && colorMatch && materialMatch && categoryMatch;
    });
    setFilteredProducts(filtered);
  }, [priceRange, selectedColors, selectedMaterials, selectedCategory, categoryName, subcategory, categoryProducts]);

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCategory("all");
  };

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
    categories: allCategoryNames,
    selectedCategory,
    setSelectedCategory
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <CategoryHeader 
            title={title || ""}
            isMobile={isMobile}
            categoryProducts={categoryProducts}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            allColors={allColors}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            allMaterials={allMaterials}
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
            minPrice={minPrice}
            maxPrice={maxPrice}
            resetFilters={resetFilters}
            allSubcategories={allCategoryNames}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          {categoryProducts.length > 0 ? (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters - Desktop */}
              {!isMobile && <CategorySidebar {...filterProps} />}
              {/* Product Grid */}
              <div className="flex-1">
                <ProductList 
                  filteredProducts={filteredProducts} 
                  resetFilters={resetFilters}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              </div>
            </div>
          ) : (
            <NoProductsFound />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;