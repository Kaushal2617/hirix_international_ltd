"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VariantManager } from "./VariantManager"
import { Palette, Package2, Sparkles } from "lucide-react"
import { useSelector } from "react-redux"

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

interface VariantAddProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProduct: (product: VariantProduct) => void
  categories: string[]
  materials: string[]
  colors: string[]
}

export interface VariantProduct {
  id: string
  sku: string
  name: string
  brand: string
  productModel: string // Renamed from model
  category: string
  subcategory: string
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
  slug: string
}

export const VariantAddProductForm = ({
  open,
  onOpenChange,
  onAddProduct,
  categories,
  materials: initialMaterials,
  colors: initialColors,
}: VariantAddProductFormProps) => {
  const [tab, setTab] = useState("basic")
  const [materials, setMaterials] = useState(initialMaterials)
  const [colors, setColors] = useState(initialColors)
  const [sizes, setSizes] = useState(["XS", "S", "M", "L", "XL", "XXL", "One Size"])
  const [finishes, setFinishes] = useState(["Matte", "Glossy", "Satin", "Textured", "Natural"])

  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    brand: "",
    model: "",
    category: "",
    subcategory: "",
    description: "",
    newArrival: false,
    bestSeller: false,
    sale: false,
  })

  // Variant management
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [aPlusImage, setAPlusImage] = useState<string>("")
  const [detailsInput, setDetailsInput] = useState<string>("")

  // Fetch categories and subcategories from Redux or API
  const categoriesList = useSelector((state: any) => state.categories.categories);
  const selectedCategory = categoriesList.find((cat: any) => cat.name === newProduct.category);
  const subcategories = selectedCategory?.subcategories || [];

  useEffect(() => {
    // Fetch materials
    fetch('http://localhost:5000/api/materials')
      .then(res => res.json())
      .then(data => setMaterials(data.map((m: any) => m.name)))
      .catch(() => {});
    // Fetch colors
    fetch('http://localhost:5000/api/colors')
      .then(res => res.json())
      .then(data => setColors(data.map((c: any) => c.name)))
      .catch(() => {});
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setNewProduct({ ...newProduct, [field]: value })
  }

  const handleCreateMaterial = async (value: string) => {
    const newMaterial = value.trim();
    if (!newMaterial || materials.find((m) => m.toLowerCase() === newMaterial.toLowerCase())) return;
    try {
      const res = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMaterial })
      });
      if (res.ok) {
        setMaterials((prev) => [...prev, newMaterial]);
      }
    } catch {}
  };

  const handleCreateColor = async (value: string) => {
    const newColor = value.trim();
    if (!newColor || colors.find((c) => c.toLowerCase() === newColor.toLowerCase())) return;
    try {
      const res = await fetch('http://localhost:5000/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newColor })
      });
      if (res.ok) {
        setColors((prev) => [...prev, newColor]);
      }
    } catch {}
  };

  const handleCreateSize = (value: string) => {
    const newSize = value.trim()
    if (newSize && !sizes.find((s) => s.toLowerCase() === newSize.toLowerCase())) {
      setSizes((prev) => [...prev, newSize])
    }
  }

  const handleCreateFinish = (value: string) => {
    const newFinish = value.trim()
    if (newFinish && !finishes.find((f) => f.toLowerCase() === newFinish.toLowerCase())) {
      setFinishes((prev) => [...prev, newFinish])
    }
  }

  // Variant management functions
  const addVariant = (variant: Omit<ProductVariant, "id">) => {
    const newVariant: ProductVariant = {
      ...variant,
      id: Math.random().toString(36).substring(2, 9),
    }

    // If this is the first variant, make it default
    if (variants.length === 0) {
      newVariant.isDefault = true
    }

    setVariants((prev) => [...prev, newVariant])

    toast({
      title: "Variant added",
      description: `${variant.color}${variant.size ? ` - ${variant.size}` : ""} variant added successfully`,
    })
  }

  const updateVariant = (updatedVariant: ProductVariant) => {
    setVariants((prev) => prev.map((v) => (v.id === updatedVariant.id ? updatedVariant : v)))

    toast({
      title: "Variant updated",
      description: `${updatedVariant.color}${updatedVariant.size ? ` - ${updatedVariant.size}` : ""} variant updated successfully`,
    })
  }

  const deleteVariant = (variantId: string) => {
    const variantToDelete = variants.find((v) => v.id === variantId)
    if (!variantToDelete) return

    const updatedVariants = variants.filter((v) => v.id !== variantId)

    // If we deleted the default variant, make the first remaining variant default
    if (variantToDelete.isDefault && updatedVariants.length > 0) {
      updatedVariants[0].isDefault = true
    }

    setVariants(updatedVariants)

    toast({
      title: "Variant deleted",
      description: `${variantToDelete.color}${variantToDelete.size ? ` - ${variantToDelete.size}` : ""} variant deleted`,
    })
  }

  const duplicateVariant = (variantId: string) => {
    const variantToDuplicate = variants.find((v) => v.id === variantId)
    if (!variantToDuplicate) return

    const duplicatedVariant: ProductVariant = {
      ...variantToDuplicate,
      id: Math.random().toString(36).substring(2, 9),
      sku: variantToDuplicate.sku + "-copy",
      isDefault: false,
    }

    setVariants((prev) => [...prev, duplicatedVariant])

    toast({
      title: "Variant duplicated",
      description: `${variantToDuplicate.color}${variantToDuplicate.size ? ` - ${variantToDuplicate.size}` : ""} variant duplicated`,
    })
  }

  const setDefaultVariant = (variantId: string) => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        isDefault: v.id === variantId,
      })),
    )

    toast({
      title: "Default variant updated",
      description: "Default variant has been changed",
    })
  }

  // Generate base SKU from product name
  const generateBaseSKU = (productName: string) => {
    return (
      productName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 6) + "-"
    )
  }

  // Auto-generate variant SKU
  const generateVariantSKU = (baseSKU: string, color: string, size?: string, material?: string) => {
    let sku = baseSKU
    sku += color.substring(0, 3).toUpperCase()
    if (size) sku += "-" + size.toUpperCase()
    if (material) sku += "-" + material.substring(0, 3).toUpperCase()
    sku += "-" + Math.random().toString(36).substring(2, 5).toUpperCase()
    return sku
  }

  // Handle A+ image upload
  const handleAPlusImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Image upload failed');
      const data = await response.json();
      setAPlusImage(data.url);
    } catch (err) {
      toast({ title: 'A+ Image Upload Error', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleRemoveAPlusImage = () => {
    setAPlusImage("")
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!newProduct.sku || !newProduct.name || !newProduct.category) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields including SKU",
        variant: "destructive",
      })
      return
    }

    if (!newProduct.subcategory) {
      toast({
        title: "Missing Subcategory",
        description: "Please select a subcategory",
        variant: "destructive",
      });
      return;
    }

    // Validate that we have at least one variant
    if (variants.length === 0) {
      toast({
        title: "No variants",
        description: "Please add at least one product variant",
        variant: "destructive",
      })
      return
    }

    // Get default variant for main product data
    const defaultVariant = variants.find((v) => v.isDefault) || variants[0]

    // Extract unique values for filters
    const availableColors = [...new Set(variants.map((v) => v.color))]
    const availableSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]
    const availableMaterials = [...new Set(variants.map((v) => v.material).filter(Boolean))]
    const availableFinishes = [...new Set(variants.map((v) => v.finish).filter(Boolean))]

    // Create new product with generated ID
    const product: VariantProduct = {
      id: Math.random().toString(36).substring(2, 9),
      sku: newProduct.sku,
      name: newProduct.name,
      brand: newProduct.brand,
      productModel: newProduct.model, // Map model to productModel
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      price: defaultVariant.price,
      oldPrice: defaultVariant.oldPrice,
      material: defaultVariant.material || "",
      color: defaultVariant.color,
      image: defaultVariant.mainImage,
      images: defaultVariant.images,
      video: defaultVariant.video,
      description: newProduct.description,
      details: detailsInput
        .split("\n")
        .map((d) => d.trim())
        .filter((d) => d),
      newArrival: newProduct.newArrival || false,
      bestSeller: newProduct.bestSeller || false,
      inventory: variants.reduce((sum, v) => sum + v.inventory, 0),
      sale: newProduct.sale || false,
      weight: defaultVariant.weight || 0,
      dimensions: defaultVariant.dimensions || {
        length: 0,
        width: 0,
        height: 0,
      },
      aPlusImage: aPlusImage || undefined,
      variants: variants,
      availableColors,
      availableSizes: availableSizes.length > 0 ? availableSizes : undefined,
      availableMaterials: availableMaterials.length > 0 ? availableMaterials : undefined,
      availableFinishes: availableFinishes.length > 0 ? availableFinishes : undefined,
      slug: newProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
    }

    // Add product and reset form
    onAddProduct(product)
    resetForm()
    onOpenChange(false)

    // Show success toast
    toast({
      title: "Product with variants added",
      description: `${product.name} with ${variants.length} variant(s) has been added successfully`,
    })
  }

  // Reset form
  const resetForm = () => {
    setNewProduct({
      sku: "",
      name: "",
      brand: "",
      model: "",
      category: "",
      subcategory: "",
      description: "",
      newArrival: false,
      bestSeller: false,
      sale: false,
    })
    setAPlusImage("")
    setDetailsInput("")
    setVariants([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package2 className="w-5 h-5 text-red-500" />
            Add Product with Variants
          </DialogTitle>
          <DialogDescription>
            Create a product with multiple variants (colors, sizes, materials, etc.). Perfect for products with options.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full mt-2">
          <TabsList className="mb-6 w-full flex justify-between bg-red-50">
            <TabsTrigger value="basic" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="variants" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Variants {variants.length > 0 && <Badge className="ml-1 bg-white text-red-500">{variants.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              A+ Content
            </TabsTrigger>
            <TabsTrigger value="desc" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Description
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Product Foundation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productSku">Base SKU *</Label>
                    <Input
                      id="productSku"
                      value={newProduct.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="e.g., SOF-MOD-001"
                    />
                    <p className="text-xs text-gray-500">This will be the base SKU. Variants will have unique SKUs.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={newProduct.name}
                      onChange={(e) => {
                        handleInputChange("name", e.target.value)
                        // Auto-generate base SKU if empty
                        if (!newProduct.sku) {
                          handleInputChange("sku", generateBaseSKU(e.target.value))
                        }
                      }}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={newProduct.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={newProduct.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      placeholder="Enter model number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Category *</Label>
                    <Select value={newProduct.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productSubcategory">Subcategory *</Label>
                    <Select value={newProduct.subcategory} onValueChange={(value) => handleInputChange("subcategory", value)} disabled={!newProduct.category}>
                      <SelectTrigger>
                        <SelectValue placeholder={newProduct.category ? "Select subcategory" : "Select category first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sub: any) => (
                          <SelectItem key={sub.name} value={sub.name}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Type</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          id="newArrivalToggle"
                          type="checkbox"
                          checked={!!newProduct.newArrival}
                          onChange={(e) => handleInputChange("newArrival", e.target.checked)}
                          className="w-4 h-4 accent-red-500"
                        />
                        <Label htmlFor="newArrivalToggle" className="text-sm">
                          New Arrival
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          id="bestSellerToggle"
                          type="checkbox"
                          checked={!!newProduct.bestSeller}
                          onChange={(e) => handleInputChange("bestSeller", e.target.checked)}
                          className="w-4 h-4 accent-orange-400"
                        />
                        <Label htmlFor="bestSellerToggle" className="text-sm">
                          Best Seller
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          id="saleToggle"
                          type="checkbox"
                          checked={!!newProduct.sale}
                          onChange={(e) => handleInputChange("sale", e.target.checked)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <Label htmlFor="saleToggle" className="text-sm">
                          On Sale
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants">
            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-900 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Product Variants
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <VariantManager
                  variants={variants}
                  onAddVariant={addVariant}
                  onUpdateVariant={updateVariant}
                  onDeleteVariant={deleteVariant}
                  onDuplicateVariant={duplicateVariant}
                  onSetDefaultVariant={setDefaultVariant}
                  baseSKU={newProduct.sku}
                  colors={colors}
                  sizes={sizes}
                  materials={materials}
                  finishes={finishes}
                  onCreateColor={handleCreateColor}
                  onCreateSize={handleCreateSize}
                  onCreateMaterial={handleCreateMaterial}
                  onCreateFinish={handleCreateFinish}
                  generateVariantSKU={generateVariantSKU}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-900">A+ Content & Media</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-semibold">A+ Content Image (optional)</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAPlusImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                    {aPlusImage && (
                      <div className="relative w-full h-40 mt-2 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={aPlusImage || "/placeholder.svg"}
                          alt="A+ Content"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveAPlusImage}
                          className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Upload a banner image for enhanced product content (A+ Content).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="desc">
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-900">Product Description & Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productDescription">Product Description</Label>
                    <ReactQuill
                      id="productDescription"
                      value={newProduct.description || ""}
                      onChange={(value) => handleInputChange("description", value || "")}
                      theme="snow"
                      className="bg-white rounded mt-1"
                      placeholder="Enter detailed product description..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="productDetails">Product Details/Specifications</Label>
                    <ReactQuill
                      id="productDetails"
                      value={detailsInput || ""}
                      onChange={(value) => setDetailsInput(value || "")}
                      theme="snow"
                      className="bg-white rounded mt-1"
                      placeholder="Add product details, specifications, features, etc."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Product & Variants</h3>

              {/* Basic Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <strong>SKU:</strong> {newProduct.sku || "N/A"}
                  </div>
                  <div>
                    <strong>Name:</strong> {newProduct.name || "N/A"}
                  </div>
                  <div>
                    <strong>Category:</strong> {newProduct.category || "N/A"}
                  </div>
                  <div>
                    <strong>Subcategory:</strong> {newProduct.subcategory || "N/A"}
                  </div>
                  <div>
                    <strong>Type:</strong>
                    {newProduct.newArrival && <Badge className="ml-1">New Arrival</Badge>}
                    {newProduct.bestSeller && (
                      <Badge variant="secondary" className="ml-1">
                        Best Seller
                      </Badge>
                    )}
                    {newProduct.sale && (
                      <Badge variant="outline" className="ml-1">
                        On Sale
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Variants Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Variants ({variants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {variants.length === 0 ? (
                    <p className="text-gray-500">No variants added yet. Please add at least one variant.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {variants.map((variant) => (
                        <div key={variant.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: variant.colorCode }}
                              />
                              <span className="font-medium">{variant.color}</span>
                              {variant.size && <Badge variant="outline">{variant.size}</Badge>}
                              {variant.isDefault && <Badge>Default</Badge>}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>SKU: {variant.sku}</div>
                            <div>Price: £{variant.price}</div>
                            <div>Stock: {variant.inventory}</div>
                          </div>
                          {variant.mainImage && (
                            <img
                              src={variant.mainImage || "/placeholder.svg"}
                              alt={variant.color}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Description & Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong>Description:</strong>
                      <div
                        className="mt-1 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: newProduct.description || "<p>No description provided</p>" }}
                      />
                    </div>
                    <div>
                      <strong>Details:</strong>
                      <div
                        className="mt-1 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: detailsInput || "<p>No details provided</p>" }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-red-500 hover:bg-red-600" onClick={handleSubmit} disabled={variants.length === 0}>
            Add Product {variants.length > 0 && `(${variants.length} variants)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
