import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: number;
}

const products: Product[] = [
  { id: 1, name: "Best Seller 1", price: 199.99, originalPrice: 299.99, image: "https://hirixdirect.co.uk/uploads/products/66cf2d590d27a_715079015.jpg", rating: 4.8, reviews: 124, isNew: true, discount: 33 },
  { id: 2, name: "Best Seller 2", price: 149.99, originalPrice: 249.99, image: "https://hirixdirect.co.uk/uploads/products/6811e709d73f3_1683636687.jpg", rating: 4.6, reviews: 89, isNew: false, discount: 40 },
  { id: 3, name: "Best Seller 3", price: 79.99, originalPrice: 129.99, image: "https://hirixdirect.co.uk/uploads/products/679cd9423ad0e_1908007584.jpg", rating: 4.7, reviews: 156, isNew: true, discount: 38 },
  { id: 4, name: "Best Seller 4", price: 249.99, originalPrice: 399.99, image: "https://hirixdirect.co.uk/uploads/products/683883bca61b0_1368959142.jpg", rating: 4.9, reviews: 67, isNew: false, discount: 37 },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Flame className="w-7 h-7 text-red-500 animate-bounce" />
            Featured Products
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                        New
                      </span>
                    )}
                    {product.discount && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors" onClick={e => e.preventDefault()}>
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors" onClick={e => e.preventDefault()}>
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      £{product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        £{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

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