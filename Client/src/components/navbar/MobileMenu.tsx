import React, { useState, useMemo } from 'react';
import { Menu as MenuIcon, X, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

type Category = {
  name: string;
  link: string;
  subcategories?: { name: string; link: string }[];
};

interface MobileMenuProps {
  categories?: Category[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ categories = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Defensive: always use a memoized copy of categories
  const safeCategories = useMemo(() => Array.isArray(categories) ? [...categories] : [], [categories]);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };
  
  let firstName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    firstName = user.firstName || user.name?.split(' ')[0] || '';
  } catch {}
  const isLoggedIn = !!firstName;
  
  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-700 focus:outline-none"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMenu}></div>
          
          <div className="relative w-full max-w-xs sm:w-4/5 sm:max-w-sm p-4 overflow-y-auto bg-white flex flex-col h-full">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={toggleMenu}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <ul className="space-y-2 flex-1">
              {safeCategories.length === 0 ? (
                <li className="text-gray-400 text-center py-4">No categories available</li>
              ) : safeCategories.map((category) => (
                <li key={category.name} className="border-b border-gray-200 pb-2">
                  <Link
                    to={category.link}
                    className="py-2 font-medium text-gray-800 block"
                    onClick={toggleMenu}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            {isLoggedIn && (
              <button
                className="mt-auto w-full py-3 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition-colors duration-200"
                onClick={() => {
                  localStorage.removeItem('user');
                  toggleMenu();
                  window.location.reload();
                }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
