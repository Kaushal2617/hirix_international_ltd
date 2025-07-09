import React, { useState } from "react";
import { Bell, User, Home, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasNotifications] = useState(true); // Example: set to true if there are notifications

  const handleLogout = () => {
    // Clear admin authentication
    localStorage.removeItem("adminAuthenticated");
    
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
    
    // Redirect to login page
    navigate("/admin/login");
  };
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="h-16 w-full bg-white/60 backdrop-blur-lg border-b border-gray-200 shadow flex items-center px-8 z-20 relative"
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)", borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
    >
      <div className="flex items-center gap-6 flex-1">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold shadow hover:from-red-600 hover:to-red-500 transition-all text-base"
        >
          <Home className="w-5 h-5" />
          <span>Back to Main Site</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="relative p-2 text-gray-500 rounded-full hover:bg-red-100 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6 hover:text-red-500 transition-colors" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-lg" />
            )}
          </button>
        </div>
        
        <div className="relative">
          <button
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setProfileOpen((open) => !open)}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-400 via-gray-200 to-white flex items-center justify-center border-2 border-white shadow">
              <User className="w-5 h-5 text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Admin User</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-semibold text-gray-800">Admin User</div>
                  <div className="text-xs text-gray-500">admin@hirix.com</div>
                </div>
                <Link to="/admin/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">Settings</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2 inline" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;