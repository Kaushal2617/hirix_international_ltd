import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sample suggestions - replace with your actual search suggestions
  const suggestions = [
    'Furniture',
    'Home Decor',
    'living Room Decor',
    'Garden Decor',
    'Lighting',
    'Kitchen',
    'Bathroom',
    'Outdoor',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
    console.log('Search for:', searchTerm);
    // Implement search functionality here
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
        <input
          type="text"
            className="w-full h-12 pl-5 pr-12 text-sm bg-gray-50 border border-gray-200 rounded-full 
                     focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500
                     transition-all duration-200"
            placeholder="Search for furniture, decor, and more..."
          value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
        />
          <div className="absolute right-0 top-0 h-full flex items-center pr-3">
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
        <button
          type="submit"
              className="ml-2 p-2 text-white bg-red-500 rounded-full hover:bg-red-600 
                       transition-colors duration-200"
        >
          <Search className="w-5 h-5" />
        </button>
          </div>
      </div>
    </form>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg 
                     border border-gray-100 py-2 z-50"
          >
            {suggestions
              .filter(suggestion =>
                suggestion.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 
                           transition-colors duration-150"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="flex items-center">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    {suggestion}
                  </div>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
