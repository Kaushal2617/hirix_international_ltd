import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//  Import ShoppingProvider for Client side
import { ShoppingProvider } from "./Contexts/ShoppingContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import SalePage from "./pages/SalePage";
import AllProductsPage from "./pages/AllProductsPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ContactUsPage from "./pages/ContactUsPage";
import FAQPage from "./pages/FAQPage";
import ShippingReturnsPage from "./pages/ShippingReturnsPage";                  
import TrackOrderPage from "./pages/TrackOrderPage";
import AboutUsPage from "./pages/AboutUsPage";
import BulkOrders from "./pages/BulkOrders";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndCondition from "./pages/Terms&Conditions";
import OrderReceiptPage from "./pages/OrderReceiptPage"
import ReturnReplacePage from "./pages/ReturnReplacePage";
import AccountPage from "./pages/AccountPage";
import NewArrivalsPage from './pages/NewArrivalsPage';
import BestSellersPage from './pages/BestSellersPage';
// Admin Imports
import AdminCustomers from "./admin/pages/Customers";
import AdminSettings from "./admin/pages/Settings";
import AdminLogin from "./admin/pages/Login";
import AuthGuard from "./admin/components/AuthGuard";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/Products";
import AdminOrders from "./admin/pages/Orders";
import AdminCategories from "./admin/pages/Categories";
import  Products  from './admin/pages/Products';
import AdminBanners from "./admin/pages/AdminBanners";
import Revenue from "./admin/pages/Revenue";
import CategoryGrid from './components/Home/CategoryGrid';
import CategoryMenu from './components/navbar/CategoryMenu';
import MobileMenu from './components/navbar/MobileMenu';
import ClientLayout from './pages/ClientLayout';
import { useState } from 'react';

const queryClient = new QueryClient();
const App = () => {
  // Centralized categories state with full mock data
  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Furniture',
      slug: 'furniture',
      image: 'https://hirixdirect.co.uk/uploads/products/66cf2d590d27a_715079015.jpg',
      link: '/category/furniture',
      subcategories: [
        { id: '1-1', name: 'Living Room', slug: 'living-room', link: '/category/furniture/living-room' },
        { id: '1-2', name: 'Bedroom', slug: 'bedroom', link: '/category/furniture/bedroom' },
        { id: '1-3', name: 'Dining Room', slug: 'dining-room', link: '/category/furniture/dining-room' },
        { id: '1-4', name: 'Office', slug: 'office', link: '/category/furniture/office' },
      ]
    },
    {
      id: '2',
      name: 'Outdoor',
      slug: 'outdoor',
      image: 'https://hirixdirect.co.uk/uploads/products/6811e709d73f3_1683636687.jpg',
      link: '/category/outdoor',
      subcategories: [
        { id: '2-1', name: 'Patio Furniture', slug: 'patio-furniture', link: '/category/outdoor/patio-furniture' },
        { id: '2-2', name: 'Garden', slug: 'garden', link: '/category/outdoor/garden' },
        { id: '2-3', name: 'Grills', slug: 'grills', link: '/category/outdoor/grills' },
      ]
    },
    {
      id: '3',
      name: 'Home Decor',
      slug: 'home-decor',
      image: 'https://hirixdirect.co.uk/uploads/products/679cd9423ad0e_1908007584.jpg',
      link: '/category/home-decor',
      subcategories: [
        { id: '3-1', name: 'Rugs', slug: 'rugs', link: '/category/home-decor/rugs' },
        { id: '3-2', name: 'Lighting', slug: 'lighting', link: '/category/home-decor/lighting' },
        { id: '3-3', name: 'Wall Decor', slug: 'wall-decor', link: '/category/home-decor/wall-decor' },
      ]
    },
    {
      id: '4',
      name: 'Appliances',
      slug: 'appliances',
      image: 'https://hirixdirect.co.uk/uploads/products/683883bca61b0_1368959142.jpg',
      link: '/category/appliances',
      subcategories: [
        { id: '4-1', name: 'Kitchen', slug: 'kitchen', link: '/category/appliances/kitchen' },
        { id: '4-2', name: 'Laundry', slug: 'laundry', link: '/category/appliances/laundry' },
        { id: '4-3', name: 'Cleaning', slug: 'cleaning', link: '/category/appliances/cleaning' },
      ]
    },
    {
      id: '5',
      name: 'Electronics',
      slug: 'electric',
      image: 'https://hirixdirect.co.uk/uploads/products/6811e709d73f3_1683636687.jpg',
      link: '/category/electric',
      subcategories: [
        { id: '5-1', name: 'Air Fryer', slug: 'air-fryer', link: '/category/electric/air-fryer' },
        { id: '5-2', name: 'Mini Fridge', slug: 'mini-fridge', link: '/category/electric/mini-fridge' },
      ]
    },
    {
      id: '6',
      name: 'Sports',
      slug: 'sports',
      image: 'https://hirixdirect.co.uk/uploads/products/66cf2d590d27a_715079015.jpg',
      link: '/category/sports',
      subcategories: []
    },
    // Add more mock categories as needed
    { id: '7', name: 'Sale', slug: 'sale', image: '', link: '/sale', subcategories: [] },
    { id: '8', name: 'Best Sellers', slug: 'best-sellers', image: '', link: '/best-sellers', subcategories: [] },
    { id: '9', name: 'New Arrivals', slug: 'new-arrivals', image: '', link: '/new-arrivals', subcategories: [] },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Wrap everything inside ShoppingProvider */}
        <ShoppingProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth routes (no Navbar/menubar) */}
              <Route path="/login" element={<SignInPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              {/* Client side Routes wrapped in ClientLayout (with Navbar) */}
              <Route element={<ClientLayout categories={categories} />}>
                <Route path="/" element={<Index categories={categories} />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/sale" element={<SalePage />} />
                <Route path="/all-products" element={<AllProductsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/order-receipt" element={<OrderReceiptPage />} />
                <Route path="/return-replace" element={<ReturnReplacePage />} />
                <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/bulk-orders" element={<BulkOrders />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/best-sellers" element={<BestSellersPage />} />
              </Route>
              {/* Admin routes (no Navbar) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AuthGuard>
                  <AdminLayout />
                </AuthGuard>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="revenue" element={<Revenue />} />
              </Route>
              <Route path="/admin/products/add" element={<Products />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ShoppingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
