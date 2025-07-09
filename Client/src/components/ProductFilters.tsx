
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
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
  isMobileView?: boolean;
  onClose?: () => void;
  categories?: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  priceRange,
  setPriceRange,
  colors,
  selectedColors,
  setSelectedColors,
  materials,
  selectedMaterials,
  setSelectedMaterials,
  minPrice,
  maxPrice,
  resetFilters,
  isMobileView = false,
  onClose,
  categories = [],
  selectedCategory,
  setSelectedCategory
}) => {
  const handleColorToggle = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleMaterialToggle = (material: string) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  const colorSwatches: Record<string, string> = {
    "Black": "#000000",
    "White": "#FFFFFF",
    "Gray": "#808080",
    "Brown": "#A52A2A",
    "Beige": "#F5F5DC",
    "Green": "#008000",
    "Blue": "#0000FF",
    "Red": "#FF0000",
    "Yellow": "#FFFF00",
    "Orange": "#FFA500",
    "Purple": "#800080",
    "Pink": "#FFC0CB",
    "Multi": "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)"
  };

  return (
    <div className={`${isMobileView ? "p-4" : "pr-6"}`}>
      {isMobileView && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      )}
      
      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Category</h3>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Price Range</h3>
          <span className="text-sm text-gray-500">
            £{priceRange[0]} - £{priceRange[1]}
          </span>
        </div>
        <Slider 
          defaultValue={priceRange}
          min={minPrice}
          max={maxPrice}
          step={5}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>£{minPrice}</span>
          <span>£{maxPrice}</span>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["colors", "materials"]} className="w-full">
        <AccordionItem value="colors">
          <AccordionTrigger className="py-3">Colors</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {colors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`color-${color}`}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={() => handleColorToggle(color)}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300" 
                    style={{ background: colorSwatches[color] || color }}
                  />
                  <Label htmlFor={`color-${color}`}>{color}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="materials">
          <AccordionTrigger className="py-3">Materials</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {materials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`material-${material}`}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={() => handleMaterialToggle(material)}
                  />
                  <Label htmlFor={`material-${material}`}>{material}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;