import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import CategoryMenu from './CategoryMenu';
import MobileMenu from './MobileMenu';
import { Menu as MenuIcon, X, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const Navbar = ({ categories = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Removed: const dispatch = useDispatch();

  let firstName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    firstName = user.firstName || user.name?.split(' ')[0] || '';
  } catch {}
  const isLoggedIn = !!firstName;

  const cartCount = useSelector((state: any) =>
    state.cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
  );
  const wishlistCount = useSelector((state: any) => state.wishlist.items.length);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [sidebarOpen]);

  return (
    <header className="bg-white">
      {/* Announcement bar */}
      {/* <div className="w-full bg-black text-white py-2 text-center text-sm">
        <TypeAnimation
          sequence={[
            "Free UK shipping on all orders and free next-day shipping on any order over £75!",
            2000,
            "",
            500,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          className="font-medium"
        />
      </div> */}

<div className="w-full bg-gradient-to-r from-purple-600 via-red-500 to-orange-300 text-white py-2 text-center text-">
      <TypeAnimation
        sequence={["Free UK shipping on all orders and free next-day shipping on any order over £75!", 2000, "", 500]}
        wrapper="span"
        speed={50}
        repeat={Number.POSITIVE_INFINITY}
        className="font-bold"
      />
    </div>

      <div className="w-full max-w-full mx-auto px-2 sm:px-4">
        {/* Main navbar */}
        <div className="flex items-center justify-between h-20 flex-wrap min-w-0">
          <div className="flex items-center space-x-8">
            <MobileMenu categories={categories} />
            {/* Desktop menu toggle */}
            <button
              className="hidden lg:inline-flex items-center justify-center w-11 h-11 p-0 rounded-full bg-white/90 border border-gray-200 shadow group hover:scale-110 hover:shadow-red-400/40 hover:shadow-lg transition-all duration-300 mr-2 text-base sm:text-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-7 h-7 text-gray-700 group-hover:text-red-600 transition-all duration-300" />
            </button>
            <Logo />
          </div>
          <div className="hidden lg:block flex-1 max-w-xs sm:max-w-2xl mx-2 sm:mx-8">
            <SearchBar />
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6 min-w-0">
            {/* Wishlist Icon with Badge */}
            <Link to="/wishlist" className="relative">
              <Heart className="w-7 h-7 text-gray-700 hover:text-red-500 transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-7 h-7 text-gray-700 hover:text-red-500 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <UserMenu />
          </div>
        </div>
        {/* Mobile search bar */}
        <div className="lg:hidden pb-4">
          <SearchBar />
        </div>
        {/* Categories navigation */}
        <div className="border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 lg:overflow-x-visible lg:whitespace-normal">
          <CategoryMenu categories={categories} />
        </div>
        {/* Desktop sidebar drawer */}
        <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay with fade-in */}
            <motion.div
              key="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar with glassmorphism, accent bar, and animation */}
            <motion.div
              key="sidebar-panel"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 z-50 w-full max-w-xs sm:w-[340px] sm:max-w-full h-full p-0 flex flex-col"
              style={{ pointerEvents: 'auto' }}
            >
              {/* Gradient accent bar */}
              <div className="absolute left-0 top-0 h-full w-2 rounded-r-xl bg-gradient-to-b from-pink-500 via-red-400 to-yellow-400" />
              {/* Glassmorphism panel */}
              <div className="relative h-full w-full pl-6 pr-2 py-6 bg-white/70 backdrop-blur-2xl shadow-2xl rounded-r-2xl flex flex-col">
                {/* User greeting card */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-white/80 shadow-lg border border-white/40"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center text-xl font-bold text-white shadow">
                    {isLoggedIn ? firstName[0]?.toUpperCase() : 'A'}
                  </div>
                  <span className="text-xl font-semibold tracking-wide text-gray-800">Hi, {isLoggedIn ? firstName : 'Welcome'}</span>
                  <button onClick={() => setSidebarOpen(false)} className="ml-auto p-2 rounded-full hover:bg-gray-100 transition">
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </motion.div>
                {/* Animated category list */}
                <motion.ul
                  className="flex-1 overflow-y-auto space-y-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.07 } }
                  }}
                >
                  {categories.map((cat, idx) => (
                    <motion.li
                      key={cat.name}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      <Link
                        to={cat.link}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-lg transition-all duration-200
                          ${cat.highlight ? 'text-red-500 bg-red-50/60 hover:bg-red-100/80' : 'text-gray-800 hover:bg-gray-100/80'}
                          shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span>{cat.icon}</span>
                        <span className="tracking-wide">{cat.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
                {/* Logout Button styled as category links, only if logged in */}
                {isLoggedIn && (
                  <button
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-lg text-gray-800 hover:bg-gray-100/80 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200 mt-2"
                    onClick={() => {
                      localStorage.clear();
                      setSidebarOpen(false);
                      window.location.href = '/';
                    }}
                  >
                    <span className="tracking-wide">Sign Out</span>
                  </button>
                )}
                {/* Optional: Add a soft footer or brand mark here */}
              </div>
            </motion.div>
          </>
        )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
