
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import ProductFilters from './ProductFilters';

interface MobileFiltersDrawerProps {
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
  categories?: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const MobileFiltersDrawer: React.FC<MobileFiltersDrawerProps> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <ProductFilters 
          {...props}
          isMobileView={true}
          onClose={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileFiltersDrawer;