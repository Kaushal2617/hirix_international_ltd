import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Tag, Star, Sofa, TreePine, LampDesk, Monitor, Dumbbell, Zap, Home, ShoppingBag } from 'lucide-react';

type Category = {
  name: string;
  link: string;
  subcategories?: { name: string; link: string }[];
};

interface CategoryMenuProps {
  categories?: Category[];
  rightCategories?: Category[];
}

// Static icon mapping for categories with animation
const categoryIcons: Record<string, React.ReactNode> = {
  Furniture: <Sofa className="w-5 h-5 mr-1 text-blue-500 animate-bounce" />,
  Outdoor: <TreePine className="w-5 h-5 mr-1 text-green-600 animate-bounce" />,
  'Home Decor': <LampDesk className="w-5 h-5 mr-1 text-yellow-600 animate-bounce" />,
  Appliances: <Zap className="w-5 h-5 mr-1 text-cyan-600 animate-bounce" />,
  Electronics: <Monitor className="w-5 h-5 mr-1 text-indigo-500 animate-bounce" />,
  Sports: <Dumbbell className="w-5 h-5 mr-1 text-orange-500 animate-bounce" />,
  Sale: <Tag className="w-5 h-5 mr-1 text-red-500 animate-bounce" />,
  'New Arrivals': <Star className="w-5 h-5 mr-1 text-yellow-400 animate-bounce" />,
  'Best Sellers': <Star className="w-5 h-5 mr-1 text-orange-400 animate-bounce" />,
};
const defaultIcon = <ShoppingBag className="w-5 h-5 mr-1 text-gray-400 animate-bounce" />;

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories = [], rightCategories = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (categoryName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredCategory(categoryName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 200);
  };

  const rightCategoryNames = ['Sale', 'Best Sellers', 'New Arrivals'];
  const leftCategories = categories.filter(cat => !rightCategoryNames.includes(cat.name));
  const rightCategoriesFinal = categories.filter(cat => rightCategoryNames.includes(cat.name));

  return (
    <nav className="hidden md:block w-full">
      <div className="flex justify-between items-center">
        <ul className="flex space-x-6">
          {leftCategories.map((category) => (
            <li key={category.name} className="relative group">
              <div
                className="inline-block"
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={category.link}
                  className="text-base font-semibold flex items-center px-2 py-1 rounded transition-all duration-300 hover:text-red-600 hover:bg-gray-100 group-hover:shadow-md group-hover:scale-105 group-hover:underline group-hover:underline-offset-4"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {categoryIcons[category.name] || defaultIcon}
                  {category.name}
                </Link>
                {category.subcategories && hoveredCategory === category.name && (
                  <div className="absolute left-0 z-20 w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-300 opacity-100 translate-y-0 pointer-events-auto">
                    <ul className="py-2">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.name}>
                          <Link
                            to={`/category/${category.slug}/${subcategory.slug}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setHoveredCategory(null)}
                          >
                            {subcategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex space-x-6">
          {rightCategoriesFinal.map((category) => (
            <li key={category.name} className="relative group">
              <Link
                to={category.link}
                className="text-base font-semibold flex items-center px-2 py-1 rounded transition-all duration-300 hover:text-red-600 hover:bg-gray-100 group-hover:shadow-md group-hover:scale-105 group-hover:underline group-hover:underline-offset-4"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {categoryIcons[category.name] || defaultIcon}
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryMenu;
