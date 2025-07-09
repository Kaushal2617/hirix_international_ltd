
import { useState, useEffect } from 'react';
import type { Product } from '../data/products';

interface UseCategoryFiltersProps {
  categoryProducts: Product[];
  initialCategory?: string;
}

export function useCategoryFilters({ categoryProducts, initialCategory = "all" }: UseCategoryFiltersProps) {
  // Get unique colors, materials, and subcategories from products in this category
  const allColors = Array.from(new Set(categoryProducts.map(p => p.color)));
  const allMaterials = Array.from(new Set(categoryProducts.map(p => p.material)));
  const allSubcategories = Array.from(new Set(categoryProducts.map(p => p.category)));
  
  // Get min and max prices for this category
  const prices = categoryProducts.map(p => p.price);
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(categoryProducts);

  // Reset filters when category changes
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCategory("all");
    setFilteredProducts(categoryProducts);
  }, [categoryProducts, minPrice, maxPrice]);

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
  }, [priceRange, selectedColors, selectedMaterials, selectedCategory, categoryProducts]);

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCategory("all");
  };

  return {
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
  };
}
