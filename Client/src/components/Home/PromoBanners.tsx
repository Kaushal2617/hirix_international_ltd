import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, Clock, Star, RefreshCw, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { allProducts } from '../../data/products';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/store/productSlice';
import { fetchBanners } from '@/store/bannerSlice';
import ProductCard from '@/components/product/ProductCard';
import { addItem as addToCart } from '@/store/cartSlice';
import { addItem as addToWishlist } from '@/store/wishlistSlice';
import { toast } from '@/components/ui/use-toast';

const promoItems = [
  {
    id: 1,
    icon: <Truck className="h-7 w-7" />,
    title: "Free Delivery",
    description: "On orders over £50",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    icon: <Shield className="h-7 w-7" />,
    title: "Secure Payment",
    description: "100% secure checkout",
    color: "bg-green-100 text-green-600"
  },
  {
    id: 3,
    icon: <RefreshCw className="h-7 w-7 text-amber-500" />,
    title: "Easy Returns",
    description: "30-day return policy",
    color: "bg-white text-amber-600"
  },
  {
    id: 4,
    icon: <Clock className="h-7 w-7" />,
    title: "24/7 Support",
    description: "Customer support anytime",
    color: "bg-red-100 text-red-600"
  }
];

const PromoBanners = () => {
  const dispatch = useDispatch();
  const bannerState = useSelector((state: any) => state.banners);
  const { banners, loading, error } = bannerState;
  const { products } = useSelector((state: any) => state.products);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const miniBanners = banners.filter((b: any) => b.type === 'mini' && b.imageUrl);
  const wishlist = useSelector((state: any) => state.wishlist.items);

  const getId = (p: any) => (p.id ? p.id.toString() : p._id ? p._id.toString() : '');
  const handleAddToCart = (product: any) => {
    const productId = getId(product);
    dispatch(addToCart({ ...product, id: productId, quantity: 1 }));
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`
    });
  };

  const handleAddToWishlist = (product: any) => {
    const productId = getId(product);
    const exists = wishlist.find((item: any) => getId(item) === productId);
    if (exists) {
      toast({
        title: 'Already in Wishlist',
        description: `${product.name} is already in your wishlist.`,
        variant: 'destructive',
      });
      return;
    }
    dispatch(addToWishlist({ ...product, id: productId, inStock: product.inventory > 0 }));
    toast({
      title: 'Added to Wishlist',
      description: `${product.name} has been added to your wishlist.`
    });
  };
  console.log('--- PromoBanners Render ---');
  console.log('PromoBanners full bannerState:', bannerState);
  console.log('PromoBanners banners:', banners);
  console.log('PromoBanners miniBanners:', miniBanners);
  console.log('PromoBanners loading:', loading);
  console.log('PromoBanners error:', error);
  useEffect(() => {
    if (!banners.length) {
      console.log('Dispatching fetchBanners...');
      dispatch(fetchBanners() as any);
    }
  }, [dispatch, banners.length]);
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
  const bestSellers = products.filter((p: any) => p.bestSeller).slice(0, 4);
  // Helper to get dynamic review data
  const getReviewStats = (productId: string) => {
    const productReviews = reviews.filter(r => (r.productId === productId || r.productId === String(productId)));
    const reviewCount = productReviews.length;
    const averageRating = reviewCount > 0 ? productReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount : 0;
    return { reviewCount, averageRating };
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Mini Banners Section removed as requested */}
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {promoItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`flex items-center gap-4 p-6 rounded-xl shadow bg-white hover:shadow-lg transition-all duration-300 ${item.color}`}
            >
              <div className="p-3 rounded-full bg-white/80">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Best Seller Product Cards */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" /> Best Sellers
          </h2>
          {reviewsLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product: any, idx: number) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
          )}
          {/* Explore More Button */}
          <div className="flex justify-center mt-8">
            <a
              href="/best-sellers"
              className="inline-block px-8 py-3 bg-red-500 text-white rounded-full font-medium shadow transition-all duration-300 transform hover:bg-black hover:scale-105 hover:-translate-y-1 hover:shadow-2xl focus:outline-none"
            >
              Explore More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;