import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import { Button } from "@/components/ui/button";
import type { Product } from '../../data/products';

interface ProductListProps {
  filteredProducts: Product[];
  resetFilters: () => void;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({ filteredProducts, resetFilters, onAddToCart, onAddToWishlist }) => {
  // Use parent handlers if provided, otherwise no-op
  const handleAddToCart = onAddToCart || (() => {});
  const handleAddToWishlist = onAddToWishlist || (() => {});

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
          <ProductCard
            key={product._id || product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;