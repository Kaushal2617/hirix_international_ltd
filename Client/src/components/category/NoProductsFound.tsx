
import React from 'react';

const NoProductsFound: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2">No products found</h3>
      <p className="text-gray-500">
        We couldn't find any products in this category. Please try another category or check back later.
      </p>
    </div>
  );
};

export default NoProductsFound;
