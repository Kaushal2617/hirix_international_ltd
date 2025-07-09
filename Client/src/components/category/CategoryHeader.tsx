
import React from 'react';
import MobileFiltersDrawer from '../MobileFiltersDrawer';

interface CategoryHeaderProps {
  title: string;
  isMobile: boolean;
  categoryProducts: any[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  allColors: string[];
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  allMaterials: string[];
  selectedMaterials: string[];
  setSelectedMaterials: (materials: string[]) => void;
  minPrice: number;
  maxPrice: number;
  resetFilters: () => void;
  allSubcategories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  isMobile,
  categoryProducts,
  priceRange,
  setPriceRange,
  allColors,
  selectedColors,
  setSelectedColors,
  allMaterials,
  selectedMaterials,
  setSelectedMaterials,
  minPrice,
  maxPrice,
  resetFilters,
  allSubcategories,
  selectedCategory,
  setSelectedCategory
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {isMobile && categoryProducts.length > 0 && (
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
          categories={allSubcategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </div>
  );
};

export default CategoryHeader;
