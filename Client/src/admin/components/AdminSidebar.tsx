import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  FolderTree,
  Image
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: FolderTree, label: "Categories", path: "/admin/Categories" },
  { icon: Image, label: "Banners", path: "/admin/banners" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Customers", path: "/admin/customers" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: 'Logged out',
      description: 'You have been logged out of the admin panel',
    });
    navigate('/admin/login');
  };

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-64 h-full bg-white/60 backdrop-blur-lg border-r border-gray-200 shadow-xl rounded-tr-2xl rounded-br-2xl flex flex-col"
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
    >
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold tracking-tight text-red-500" style={{letterSpacing: '0.04em'}}>HOMNIX ADMIN</h1>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                    isActive
                      ? "bg-gradient-to-r from-red-500/80 to-red-400/80 text-white shadow-lg"
                      : "hover:bg-gray-100/80 text-gray-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-indicator"
                        className="absolute left-0 top-2 bottom-2 w-1.5 rounded-full bg-red-500"
                        initial={{ scaleY: 0.5, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        exit={{ scaleY: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-red-500"}`} />
                    <span className="z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100/80 transition-all font-medium"
        >
          <LogOut className="w-5 h-5 mr-3 text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;