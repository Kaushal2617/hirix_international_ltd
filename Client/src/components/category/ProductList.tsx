import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Product } from '../../data/products';

interface ProductListProps {
  filteredProducts: Product[];
  resetFilters: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ filteredProducts, resetFilters }) => {
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your filters or browse our other categories.
        </p>
        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <Card className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <span className="text-lg font-bold text-red-500">£{product.price.toFixed(2)}</span>
                  {product.oldPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">£{product.oldPrice.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ProductList;