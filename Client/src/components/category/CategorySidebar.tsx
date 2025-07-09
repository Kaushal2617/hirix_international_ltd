
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductFilters from '../ProductFilters';

interface CategorySidebarProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  colors: string[];
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  materials: string[];
  selectedMaterials: string[];
  setSelectedMaterials: (materials: string[]) => void;
  minPrice: number;
  maxPrice: number;
  resetFilters: () => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = (props) => {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="border rounded-lg p-4 sticky top-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center">
          <SlidersHorizontal size={18} className="mr-2" />
          Filters
        </h2>
        <ProductFilters {...props} />
      </div>
    </aside>
  );
};

export default CategorySidebar;
