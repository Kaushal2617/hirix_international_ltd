import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProductList from '../components/category/ProductList';
import NoProductsFound from '../components/category/NoProductsFound';
import Footer from '../components/shared/Footer';
import { RootState } from '../store';

const SubcategoryPage = () => {
  const { categoryName, subcategoryName } = useParams();
  const products = useSelector((state: RootState) => state.products.products);
  const categories = useSelector((state: RootState) => state.categories.categories);

  // Filter products by category and subcategory
  const subcategoryProducts = products.filter(product =>
    product.category?.toLowerCase() === categoryName?.toLowerCase() &&
    product.subcategory?.toLowerCase() === subcategoryName?.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {subcategoryProducts.length > 0 ? (
          <ProductList products={subcategoryProducts} />
        ) : (
          <NoProductsFound message="No products found in this subcategory." />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SubcategoryPage; 