import React, { useState, useEffect, useRef } from 'react';
import { User, ShoppingCart, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShoppingContext } from '@/Contexts/ShoppingContext';

const UserMenu = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { cartItems, wishlistItems } = useShoppingContext();

  // Defensive: wishlistItems fallback to empty array if undefined
  const safeWishlistItems = wishlistItems || [];

  // Get user first name from localStorage
  let firstName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    firstName = user.firstName || user.name?.split(' ')[0] || '';
  } catch {}
  const isLoggedIn = !!firstName;

  useEffect(() => {
    if (!isLoggedIn) {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsAccountOpen(false);
        }
      };
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsAccountOpen(false);
        }
      };
      const handleScroll = () => {
        setIsAccountOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      window.addEventListener('scroll', handleScroll);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscKey);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isLoggedIn]);

  return (
    <div className="flex items-center space-x-2 sm:space-x-4" ref={menuRef}>
      <div className="relative">
        <button 
          className="flex items-center text-sm group hover:text-red-600"
          onClick={() => setIsAccountOpen(!isAccountOpen)}
        >
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow group-hover:scale-110 group-hover:shadow-red-400/40 group-hover:shadow-lg transition-all duration-300 mr-2">
            <User className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-all duration-300" />
          </span>
          <span className="hidden md:inline font-semibold tracking-wide">{isLoggedIn ? `Hi, ${firstName}` : 'Account'}</span>
          <span className="hidden md:inline">
            {isAccountOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </span>
        </button>

        {isAccountOpen && (
          <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="p-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsAccountOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      localStorage.removeItem('user');
                      setIsAccountOpen(false);
                      window.location.reload();
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
              <Link 
                to="/login" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsAccountOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsAccountOpen(false)}
              >
                Register
              </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Wishlist and Cart links remain unchanged */}
      <Link to="/wishlist" className="flex items-center text-sm group hover:text-red-600 relative">
        <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow group-hover:scale-110 group-hover:shadow-red-400/40 group-hover:shadow-lg transition-all duration-300">
          <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-all duration-300" />
        </span>
        <span className="hidden md:inline font-semibold tracking-wide ml-2">Wishlist</span>
        {safeWishlistItems.length > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow border-2 border-white">
            {safeWishlistItems.length > 9 ? '9+' : safeWishlistItems.length}
          </span>
        )}
      </Link>
      <Link to="/cart" className="flex items-center text-sm group hover:text-red-600 relative">
        <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow group-hover:scale-110 group-hover:shadow-red-400/40 group-hover:shadow-lg transition-all duration-300">
          <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-all duration-300" />
        </span>
        <span className="hidden md:inline font-semibold tracking-wide ml-2">Cart</span>
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow border-2 border-white">
            {cartItems.length > 9 ? '9+' : cartItems.length}
          </span>
        )}
      </Link>
    </div>
  );
};

export default UserMenu;
