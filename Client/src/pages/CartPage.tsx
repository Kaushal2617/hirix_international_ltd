"use client"

import type React from "react"
import { ShoppingCart, Minus, Plus, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useShoppingContext } from "@/Contexts/ShoppingContext"
import EmptyCartMessage from "@/components/cart/EmptyCartMessage"
import PromoCodeSection from "@/components/cart/PromoCodeSection"
import CartSummary from "@/components/cart/CartSummary"
import PaymentMethods from "@/components/cart/PaymentMethods"
import Footer from "../components/shared/Footer"

const CartPage: React.FC = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart, applyDiscount, discount } = useShoppingContext()

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal > 75 ? 0 : 4.99
  const total = subtotal + shippingCost - discount

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <EmptyCartMessage />
        </div>
        <Footer />
      </div>
    )
  }

  // Cart Items with Image and Product Details
  const CartItemsList = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="relative group border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.id)}
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
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  {/* Product Name and Variant */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{item.name}</h3>
                    {item.variant && <p className="text-sm text-gray-500 mt-1">{item.variant}</p>}
                    {/* Price - Mobile Only */}
                    <p className="text-sm font-medium text-gray-900 mt-1 sm:hidden">£{item.price.toFixed(2)}</p>
                  </div>

                  {/* Price - Desktop */}
                  <div className="hidden sm:block text-right">
                    <p className="font-medium text-gray-900">£{item.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateCartItemQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-8 text-center font-medium">{item.quantity}</span>

                    <button
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions - Continue Shopping & Clear Cart */}
      <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <Link to="/all-products">
          <Button variant="outline" className="flex items-center bg-transparent w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent w-full sm:w-auto"
          onClick={clearCart}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>
    </div>
  )

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
          <div className="block lg:hidden space-y-6">
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
              <PromoCodeSection subtotal={subtotal} applyDiscount={applyDiscount} />
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

              <PromoCodeSection subtotal={subtotal} applyDiscount={applyDiscount} />
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
          <div className="lg:hidden h-20"></div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CartPage
