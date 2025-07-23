import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/store/productSlice';
import ProductCard from '@/components/product/ProductCard';
import { addItem as addToCart } from '@/store/cartSlice';
import { addItem as addToWishlist } from '@/store/wishlistSlice';
import { toast } from '@/components/ui/use-toast';
import { setCart } from '@/store/cartSlice';
import { setWishlist } from '@/store/wishlistSlice';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state: any) => state.products);
  const wishlist = useSelector((state: any) => state.wishlist.items);
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token) || localStorage.getItem('token');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  useEffect(() => {
    if (!products.length) dispatch(fetchProducts() as any);
  }, [dispatch, products.length]);
  useEffect(() => {
    setReviewsLoading(true);
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setReviewsLoading(false);
      })
      .catch(() => setReviewsLoading(false));
  }, []);
  const newArrivals = products.filter((p: any) => p.newArrival || p.isNew).slice(0, 4);
  // Helper to get dynamic review data
  const getReviewStats = (productId: string) => {
    const productReviews = reviews.filter(r => (r.productId === productId || r.productId === String(productId)));
    const reviewCount = productReviews.length;
    const averageRating = reviewCount > 0 ? productReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount : 0;
    return { reviewCount, averageRating };
  };

  const getId = (p: any) => (p.id ? p.id.toString() : p._id ? p._id.toString() : '');
  const cartItemsAll = useSelector((state: any) => state.cart.items);
  const wishlistAll = useSelector((state: any) => state.wishlist.items);
  const handleAddToCart = async (product: any) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      toast({ title: 'User ID missing. Please log in.' });
      return;
    }
    const productId = getId(product);
    const cartItem = {
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    dispatch(addToCart({ ...cartItem, id: productId }));
    // Save full cart to backend
    await fetch('/api/cart-items/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        items: [
          ...cartItemsAll.filter((i: any) => i.productId !== cartItem.productId && i.id !== cartItem.productId),
          cartItem
        ]
      }),
    });
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`
    });
  };

  const handleAddToWishlist = async (product: any) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      toast({ title: 'User ID missing. Please log in.' });
      return;
    }
    const wishlistItem = {
      productId: product._id, // must be a valid ObjectId string
      name: product.name,
      price: product.price,
      image: product.image,
      inStock: product.inStock ?? true,
    };
    dispatch(addToWishlist({ ...wishlistItem, id: product._id }));
    // Save full wishlist to backend
    await fetch('/api/wishlist-items/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        items: [
          ...wishlistAll.filter((i: any) => i.productId !== wishlistItem.productId && i.id !== wishlistItem.productId),
          wishlistItem
        ]
      }),
    });
    toast({
      title: 'Added to Wishlist',
      description: `${product.name} has been added to your wishlist.`
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Flame className="w-7 h-7 text-red-500 animate-bounce" />
            Featured Products
          </h2>
        </div>
        {loading || reviewsLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center text-gray-500">No new arrivals found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product: any) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        )}
        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link
            to="/all-products"
            className="inline-block px-8 py-3 bg-red-500 text-white rounded-full font-medium shadow transition-all duration-300 transform hover:bg-black hover:scale-105 hover:-translate-y-1 hover:shadow-2xl focus:outline-none"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;