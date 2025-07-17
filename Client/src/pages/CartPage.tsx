"use client"

import React, { useEffect } from "react";
import { ShoppingCart, Minus, Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import EmptyCartMessage from "@/components/cart/EmptyCartMessage";
import PromoCodeSection from "@/components/cart/PromoCodeSection";
import CartSummary from "@/components/cart/CartSummary";
import PaymentMethods from "../components/cart/PaymentMethods";
import Footer from "../components/shared/Footer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addItem, removeItem, updateItem, clearCart, setCart } from "@/store/cartSlice";
import { saveCart } from "@/store/cartSlice";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { user } = useSelector((state: RootState) => state.auth);
  // For demo, discount is local state
  const [discount, setDiscount] = React.useState(0);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 75 ? 0 : 4.99;
  const total = subtotal + shippingCost - discount;

  // Sync cart to backend if logged in
  useEffect(() => {
    if (user && user.id) {
      dispatch(saveCart(cartItems) as any);
    }
  }, [cartItems, user, dispatch]);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <EmptyCartMessage />
        </div>
        <Footer />
      </div>
    );
  }

  // Cart Items with Image and Product Details
  const CartItemsList = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="relative group border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            {/* Remove Button */}
            <button
              onClick={() => dispatch(removeItem(item.id))}
              className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
              aria-label={`Remove ${item.name}`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Product Details */}
              <div>
                <p className="font-semibold text-black">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="font-medium mt-1 text-gray-800">£{item.price?.toFixed(2) ?? '0.00'}</p>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => dispatch(updateItem({ id: item.id, quantity: item.quantity - 1 }))}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => dispatch(updateItem({ id: item.id, quantity: item.quantity + 1 }))}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <Link to="/all-products">
          <Button variant="outline" className="flex items-center bg-transparent w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent w-full sm:w-auto"
          onClick={() => dispatch(clearCart())}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
              <ShoppingCart className="inline mr-2 w-5 h-5 sm:w-6 sm:h-6" />
              Shopping Cart
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {/* Mobile Layout */}
          <div>
            {/* Cart Summary - Mobile First */}
            <div className="order-1">
              <CartSummary subtotal={subtotal} shippingCost={shippingCost} discount={discount} total={total} />
            </div>
            {/* Cart Items */}
            <div className="order-2">
              <CartItemsList />
            </div>
            {/* Promo Code */}
            <div className="order-3">
              <PromoCodeSection subtotal={subtotal} applyDiscount={setDiscount} />
            </div>
            {/* Payment Methods */}
            <div className="order-4">
              <PaymentMethods />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <CartItemsList />
              <PromoCodeSection subtotal={subtotal} applyDiscount={setDiscount} />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <CartSummary subtotal={subtotal} shippingCost={shippingCost} discount={discount} total={total} />
              <PaymentMethods />
            </div>
          </div>

          {/* Mobile Sticky Bottom Action */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-bold">£{total.toFixed(2)}</p>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex-shrink-0">
                Checkout
              </button>
            </div>
          </div>
          {/* Spacer for mobile sticky bottom */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
