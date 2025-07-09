"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Package, Package2 } from "lucide-react"
import { allProducts, type Product as DataProduct } from "../../data/products"
import { toast } from "@/hooks/use-toast"
import { ProductTable } from "../components/products/ProductTable"
import { SimpleAddProductForm, type SimpleProduct } from "../components/products/SimpleAddProductForm"
import { VariantAddProductForm, type VariantProduct } from "../components/products/VariantAddProductForm"

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

// Convert the imported products to the unified Product interface
const convertProducts = (dataProducts: DataProduct[]): UnifiedProduct[] => {
  return dataProducts.map((product) => ({
    id: product.id.toString(),
    sku: `PRD-${product.id.toString().padStart(3, "0")}-${product.category.toUpperCase().slice(0, 3)}-${product.color.toUpperCase().slice(0, 3)}`,
    name: product.name,
    category: product.category,
    price: product.price,
    oldPrice: product.oldPrice,
    material: product.material,
    color: product.color,
    image: product.image,
    images: product.images,
    video: product.video,
    description: product.description,
    details: product.details,
    rating: product.rating,
    reviewCount: product.reviewCount,
    newArrival: product.newArrival || false,
    bestSeller: false,
    inventory: product.inventory || 0,
    sale: false,
    weight: product.weight || 0,
    dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
    hasVariants: false,
  }))
}

const AdminProducts = () => {
  // State for products list
  const [products, setProducts] = useState<UnifiedProduct[]>(convertProducts(allProducts))

  // State for dialogs
  const [simpleDialogOpen, setSimpleDialogOpen] = useState(false)
  const [variantDialogOpen, setVariantDialogOpen] = useState(false)

  // Search term state
  const [searchTerm, setSearchTerm] = useState("")

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("")

  // Categories from the products data
  const categories = Array.from(new Set(allProducts.map((product) => product.category)))

  // Materials from the products data
  const materials = Array.from(new Set(allProducts.map((product) => product.material)))

  // Colors from the products data
  const colors = Array.from(new Set(allProducts.map((product) => product.color)))

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
  const handleAddSimpleProduct = (product: SimpleProduct) => {
    const unifiedProduct = convertSimpleProduct(product)
    setProducts([...products, unifiedProduct])
    toast({
      title: "Simple Product Added! 🎉",
      description: `${product.name} has been added to your inventory`,
    })
  }

  // Add variant product handler
  const handleAddVariantProduct = (product: VariantProduct) => {
    const unifiedProduct = convertVariantProduct(product)
    setProducts([...products, unifiedProduct])
    toast({
      title: "Product with Variants Added! 🚀",
      description: `${product.name} with ${product.variants?.length || 0} variants has been added to your inventory`,
    })
  }

  // Update product handler
  const handleUpdateProduct = (updatedProduct: UnifiedProduct) => {
    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
    toast({
      title: "Product updated",
      description: "Product has been updated successfully",
    })
  }

  // Delete product handler
  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find((p) => p.id === productId)
    setProducts(products.filter((product) => product.id !== productId))
    toast({
      title: "Product deleted",
      description: `${productToDelete?.name || "Product"} has been removed from inventory`,
      variant: "destructive",
    })
  }

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

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
      />

      {/* Simple Add Product Dialog */}
      <SimpleAddProductForm
        open={simpleDialogOpen}
        onOpenChange={setSimpleDialogOpen}
        onAddProduct={handleAddSimpleProduct}
        categories={categories}
        materials={materials}
        colors={colors}
      />

      {/* Variant Add Product Dialog */}
      <VariantAddProductForm
        open={variantDialogOpen}
        onOpenChange={setVariantDialogOpen}
        onAddProduct={handleAddVariantProduct}
        categories={categories}
        materials={materials}
        colors={colors}
      />
    </div>
  )
}

export default AdminProducts
