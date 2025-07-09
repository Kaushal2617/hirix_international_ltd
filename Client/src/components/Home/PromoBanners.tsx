import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, Clock, Star, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { allProducts } from '../../data/products';
import { banners } from '@/data/banners';

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

const bestSellers = allProducts.slice(0, 4);
const miniBanners = banners.filter(b => b.type === 'mini' && b.imageUrl);

const fallbackMiniImage = 'https://placehold.co/400x200/EEE/31343C?text=Mini+Banner';

const PromoBanners = () => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Discover More Mini Banners */}
        {miniBanners.length > 1 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-red-400" /> Discover More
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {miniBanners.map((banner, idx) => (
                <Link
                  key={banner.id}
                  to={banner.link || "/best-sellers"}
                  className="group block rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-300 bg-gray-100"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <picture>
                      {banner.mobileImageUrl && (
                        <source srcSet={banner.mobileImageUrl} media="(max-width: 768px)" />
                      )}
                      <img
                        src={banner.imageUrl || fallbackMiniImage}
                        alt={banner.title || 'Mini Banner'}
                        className="w-full h-24 xs:h-32 sm:h-40 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={e => { (e.target as HTMLImageElement).src = fallbackMiniImage; }}
                      />
                    </picture>
                    {banner.title && banner.imageUrl && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2 text-sm font-semibold">
                        {banner.title}
                      </div>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product, idx) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 flex flex-col items-center p-4 h-full min-h-[320px] justify-between cursor-pointer"
                >
                  <img src={product.image} alt={product.name} className="w-full h-44 object-cover mb-4 rounded-xl shadow-md border border-gray-100" />
                  <h3 className="text-base font-semibold mb-1 text-center">{product.name}</h3>
                  <div className="text-lg font-bold text-red-600 mb-3">£{product.price.toFixed(2)}</div>
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-all duration-200 shadow" type="button">
                    Shop Now
                  </button>
                </motion.div>
              </Link>
            ))}
          </div>
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