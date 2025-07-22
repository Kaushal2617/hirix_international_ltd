import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: any;
  onAddToCart: (product: any) => void;
  onAddToWishlist: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddToWishlist }) => {
  return (
    <Link to={`/product/${product._id || product.id}`} className="group">
      <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="relative overflow-hidden">
          {/* Quick Actions */}
          <div className="absolute bottom-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              className="bg-white rounded-full p-2 shadow hover:bg-red-100"
              onClick={e => { e.preventDefault(); e.stopPropagation(); onAddToWishlist(product); }}
              aria-label="Add to Wishlist"
            >
              <Heart className="w-5 h-5 text-red-500" />
            </button>
            <button
              className="bg-white rounded-full p-2 shadow hover:bg-red-100"
              onClick={e => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
              aria-label="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5 text-red-500" />
            </button>
          </div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
          />
          {product.oldPrice && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-1">{product.category}</div>
          <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(product.rating) ? "#FFC107" : "none"}
                  stroke={i < Math.floor(product.rating) ? "#FFC107" : "#D1D5DB"}
                  className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold text-red-500">
              £{product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                £{product.oldPrice.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard; 