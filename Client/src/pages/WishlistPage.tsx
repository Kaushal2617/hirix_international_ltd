"use client"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Trash2, Heart, ShoppingCart, ShoppingBag, X } from "lucide-react"
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addItem as addToCart } from '@/store/cartSlice';
import { addItem, removeItem, clearWishlist, setWishlist, saveWishlist } from '@/store/wishlistSlice';
import store from '@/store';
import type { AppDispatch } from '@/store';
import Footer from "../components/shared/Footer"

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  // For add to cart, use Redux cart
  const moveAllToCart = () => {
    const inStockItems = wishlistItems.filter((item) => item.inStock);
    if (inStockItems.length > 0) {
      inStockItems.forEach((item) => dispatch(addToCart({ ...item, quantity: 1 })));
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <Heart className="h-20 w-20 mx-auto text-gray-400 mb-4" />
              <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
              <p className="text-gray-500 mb-8">Add items to your wishlist to save them for later.</p>
              <Link to="/all-products">
                <Button className="px-8">Browse Products</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Wishlist Items Component
  const WishlistItemsList = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 space-y-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="relative group border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            {/* Remove Button */}
            <button
              onClick={() => {
                dispatch(removeItem(item.id));
                // Sync updated wishlist to backend
                setTimeout(() => {
                  const updatedWishlist = store.getState().wishlist.items;
                  (dispatch as AppDispatch)(saveWishlist(updatedWishlist));
                }, 0);
              }}
              className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
              aria-label={`Remove ${item.name} from wishlist`}
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
                  {/* Product Name and Price */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="block">
                      <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors truncate text-sm sm:text-base">
                        {item.name}
                      </h3>
                    </Link>
                    {item.variant && <p className="text-sm text-gray-500 mt-1">{item.variant}</p>}
                    {/* Price - Mobile Only */}
                    <p className="text-sm font-medium text-gray-900 mt-1 sm:hidden">£{item.price.toFixed(2)}</p>
                    {/* Status - Mobile Only */}
                    <div className="mt-2 sm:hidden">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Price and Status - Desktop */}
                  <div className="hidden sm:block text-right">
                    <p className="font-medium text-gray-900 mb-2">£{item.price.toFixed(2)}</p>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      onClick={() => dispatch(removeItem(item.id))}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 bg-transparent"
                      onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                      disabled={!item.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions - Continue Shopping & Clear Wishlist */}
      <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <Link to="/all-products">
          <Button variant="outline" className="flex items-center bg-transparent w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent w-full sm:w-auto"
          onClick={() => dispatch(clearWishlist())}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Wishlist
        </Button>
      </div>
    </div>
  )

  // Wishlist Summary Component
  const WishlistSummary = () => (
    <Card className="overflow-hidden">
      <div className="bg-gray-50 p-4 sm:p-6">
        <CardTitle className="flex items-center text-lg">
          <ShoppingBag className="mr-2" size={20} />
          Wishlist Summary
        </CardTitle>
      </div>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex justify-between font-medium">
            <span>Total Items</span>
            <span>{wishlistItems.length}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>In Stock Items</span>
            <span>{wishlistItems.filter((item) => item.inStock).length}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Out of Stock</span>
            <span>{wishlistItems.filter((item) => !item.inStock).length}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Value</span>
              <span>£{wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            size="lg"
            onClick={moveAllToCart}
            disabled={!wishlistItems.some((item) => item.inStock)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Move All to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
              <Heart className="inline mr-2 w-5 h-5 sm:w-6 sm:h-6" />
              My Wishlist
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
            </p>
          </div>

          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-6">
            {/* Wishlist Summary - Mobile First */}
            <div className="order-1">
              <WishlistSummary />
            </div>

            {/* Wishlist Items */}
            <div className="order-2">
              <WishlistItemsList />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WishlistItemsList />
            </div>

            <div className="lg:col-span-1">
              <WishlistSummary />
            </div>
          </div>

          {/* Mobile Sticky Bottom Action */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {wishlistItems.filter((item) => item.inStock).length} items available
                </p>
                <p className="text-lg font-bold">
                  £
                  {wishlistItems
                    .filter((item) => item.inStock)
                    .reduce((sum, item) => sum + item.price, 0)
                    .toFixed(2)}
                </p>
              </div>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={moveAllToCart}
                disabled={!wishlistItems.some((item) => item.inStock)}
              >
                Move to Cart
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

export default WishlistPage
