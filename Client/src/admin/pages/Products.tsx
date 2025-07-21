"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Package, Package2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProductTable } from "../components/products/ProductTable"
import { SimpleAddProductForm, type SimpleProduct } from "../components/products/SimpleAddProductForm"
import { VariantAddProductForm, type VariantProduct } from "../components/products/VariantAddProductForm"
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../store/productSlice';

// Unified Product interface that supports both simple and variant products
interface UnifiedProduct {
  id: string
  sku: string
  name: string
  category: string
  price: number
  oldPrice?: number
  material: string
  color: string
  image: string
  images?: string[]
  video?: string
  description?: string
  details?: string[]
  rating?: number
  reviewCount?: number
  newArrival: boolean
  bestSeller?: boolean
  inventory: number
  sale?: boolean
  weight: number
  dimensions: { length: number; width: number; height: number }
  aPlusImage?: string
  variants?: ProductVariant[]
  availableSizes?: string[]
  availableColors?: string[]
  availableMaterials?: string[]
  availableFinishes?: string[]
  hasVariants?: boolean
  _id?: string // Added for MongoDB _id
}

interface ProductVariant {
  id: string
  sku: string
  color: string
  colorCode: string
  size?: string
  material?: string
  finish?: string
  price: number
  oldPrice?: number
  inventory: number
  mainImage: string
  images: string[]
  video?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  isDefault?: boolean
}

// Remove: interface DataProduct, convertProducts function, and any usage of convertProducts

const AdminProducts = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<UnifiedProduct[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; name: string }[]>([]);
  const [simpleDialogOpen, setSimpleDialogOpen] = useState(false);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const { token } = useSelector((state: any) => state.auth);

  const fetchAllAdminProducts = async () => {
      try {
      const res = await fetch('http://localhost:5000/api/products/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      }
    };
  useEffect(() => {
    fetchAllAdminProducts();
  }, [token]);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategoryOptions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      }
    };
    fetchCategories();
  }, [token]);

  // Categories, materials, colors from products
  const categories = Array.from(new Set(products.map((product: any) => product.category))) as string[];
  const materials = Array.from(new Set(products.map((product: any) => product.material))) as string[];
  const colors = Array.from(new Set(products.map((product: any) => product.color))) as string[];

  // Convert simple product to unified format
  const convertSimpleProduct = (simpleProduct: SimpleProduct): UnifiedProduct => {
    return {
      ...simpleProduct,
      inventory: simpleProduct.inventory || 0,
      bestSeller: simpleProduct.bestSeller || false,
      sale: simpleProduct.sale || false,
      weight: simpleProduct.weight || 0,
      dimensions: simpleProduct.dimensions || { length: 0, width: 0, height: 0 },
      hasVariants: false,
    }
  }

  // Convert variant product to unified format
  const convertVariantProduct = (variantProduct: VariantProduct): UnifiedProduct => {
    return {
      ...variantProduct,
      hasVariants: true,
    }
  }

  // Add simple product handler
  const handleAddSimpleProduct = async (product: SimpleProduct) => {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to add product');
      await fetchAllAdminProducts(); // Refresh products after add
      toast({
        title: 'Simple Product Added! 🎉',
        description: `${product.name} has been added to your inventory`,
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Add variant product handler
  const handleAddVariantProduct = async (product: VariantProduct) => {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to add product');
      await fetchAllAdminProducts(); // Refresh products after add
      toast({
        title: 'Product with Variants Added! 🚀',
        description: `${product.name} with ${product.variants?.length || 0} variants has been added to your inventory`,
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Update product handler
  const handleUpdateProduct = async (updatedProduct: UnifiedProduct) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${updatedProduct._id || updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!res.ok) throw new Error('Failed to update product');
      // Get the updated product from the backend
      const updated = await res.json();
      // Update local state with the updated product
      setProducts(prev =>
        prev.map(p =>
          (p._id || p.id) === (updated._id || updated.id)
            ? { ...p, ...updated }
            : p
        )
      );
      toast({
        title: 'Product updated',
        description: 'Product has been updated successfully',
      });
      return true;
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (productId: string) => {
    const productToDelete = products.find((p: any) => p.id === productId);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete product');
      await fetchAllAdminProducts(); // Refresh products after delete
      toast({
        title: 'Product deleted',
        description: `${productToDelete?.name || 'Product'} has been removed from inventory`,
        variant: 'destructive',
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Get statistics
  const totalProducts = products.length
  const totalVariants = products.reduce((sum, product) => sum + (product.variants?.length || 0), 0)
  const productsWithVariants = products.filter((p) => p.hasVariants).length
  const simpleProducts = products.filter((p) => !p.hasVariants).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products Management</h1>
          <div className="flex gap-4 text-sm text-gray-600 mt-1">
            <span>Total: {totalProducts}</span>
            <span>Simple: {simpleProducts}</span>
            <span>With Variants: {productsWithVariants}</span>
            {totalVariants > 0 && <span>Total Variants: {totalVariants}</span>}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
            onClick={() => setSimpleDialogOpen(true)}
          >
            <Package className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
            onClick={() => setVariantDialogOpen(true)}
          >
            <Package2 className="w-4 h-4 mr-2" />
            Product with Variants
          </Button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products by name or SKU..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-w-[150px]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products table with update/delete functionality */}
      <ProductTable
        products={filteredProducts}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        key={filteredProducts.map((p: any) => p._id || p.id).join(',')}
      />

      {/* Simple Add Product Dialog */}
      <SimpleAddProductForm
        open={simpleDialogOpen}
        onOpenChange={setSimpleDialogOpen}
        onAddProduct={handleAddSimpleProduct}
        categories={categoryOptions.map(c => c.name)}
        materials={materials}
        colors={colors}
      />

      {/* Variant Add Product Dialog */}
      <VariantAddProductForm
        open={variantDialogOpen}
        onOpenChange={setVariantDialogOpen}
        onAddProduct={handleAddVariantProduct}
        categories={categoryOptions.map(c => c.name)}
        materials={materials}
        colors={colors}
      />
    </div>
  )
}

export default AdminProducts
