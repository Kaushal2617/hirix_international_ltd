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
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from './store/categorySlice';
import { RootState } from './store';
import { fetchProducts } from './store/productSlice';

const queryClient = new QueryClient();
const App = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);

  const ensureSpecialCategories = (categories) => {
    const specials = [
      { name: 'Sale', link: '/sale' },
      { name: 'Best Sellers', link: '/best-sellers' },
      { name: 'New Arrivals', link: '/new-arrivals' },
    ];
    const names = categories.map(c => c.name);
    return [
      ...categories.filter(c => !specials.some(s => s.name === c.name)),
      ...specials.filter(s => !names.includes(s.name)),
    ];
  };

  const categoriesWithSpecials = ensureSpecialCategories(categories);

  useEffect(() => {
    dispatch(fetchCategories() as any);
    dispatch(fetchProducts() as any);
    const interval = setInterval(() => {
      dispatch(fetchProducts() as any);
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [dispatch]);

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
              <Route element={<ClientLayout categories={categoriesWithSpecials} />}>
                <Route path="/" element={<Index categories={categoriesWithSpecials} />} />
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
