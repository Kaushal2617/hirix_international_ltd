"use client"
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import ImageUploader from "./ImageUploader"
import { CreatableCombobox } from "@/components/ui/creatable-combobox"
import { Package, Zap } from "lucide-react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface SimpleAddProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProduct: (product: SimpleProduct) => void
  categories: string[]
  materials: string[]
  colors: string[]
}

export interface SimpleProduct {
  id: string
  sku: string
  name: string
  brand: string
  productModel: string // Renamed from model
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
}

export const SimpleAddProductForm = ({
  open,
  onOpenChange,
  onAddProduct,
  categories,
  materials: initialMaterials,
  colors: initialColors,
}: SimpleAddProductFormProps) => {
  const [materials, setMaterials] = useState(initialMaterials)
  const [colors, setColors] = useState(initialColors)

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    brand: "",
    model: "",
    category: "",
    price: 0,
    oldPrice: 0,
    material: "",
    color: "",
    description: "",
    video: "",
    inventory: 0,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    newArrival: false,
    bestSeller: false,
    sale: false,
  })

  const [mainImagePreview, setMainImagePreview] = useState<string>("")
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [aPlusImage, setAPlusImage] = useState<string>("")
  const [detailsInput, setDetailsInput] = useState<string>("")

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleCreateMaterial = (value: string) => {
    const newMaterial = value.trim()
    if (newMaterial && !materials.find((m) => m.toLowerCase() === newMaterial.toLowerCase())) {
      setMaterials((prev) => [...prev, newMaterial])
    }
  }

  const handleCreateColor = (value: string) => {
    const newColor = value.trim()
    if (newColor && !colors.find((c) => c.toLowerCase() === newColor.toLowerCase())) {
      setColors((prev) => [...prev, newColor])
    }
  }

  const generateSKU = () => {
    if (formData.name && formData.category && formData.color) {
      const namePart = formData.name.substring(0, 3).toUpperCase()
      const categoryPart = formData.category.substring(0, 3).toUpperCase()
      const colorPart = formData.color.substring(0, 3).toUpperCase()
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase()
      const sku = `${namePart}-${categoryPart}-${colorPart}-${randomPart}`
      setFormData({ ...formData, sku })
    }
  }

  // Derive main and additional image previews
  const mainImage = formData.image || '';
  const additionalImages = (additionalImagePreviews || []).filter(img => img && img !== mainImage);

  const handleSubmit = () => {
    // Validation
    if (
      !formData.sku ||
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.material ||
      !formData.color ||
      !formData.image
    ) {
      toast({
        title: "Missing Product Image",
        description: "Please upload a main product image",
        variant: "destructive",
      });
      return;
    }
    // Only use images array for additional images; image field is for main image
    const filteredAdditionalImages = additionalImages.filter(img => img && img !== formData.image);
    const product: SimpleProduct = {
      id: Math.random().toString(36).substring(2, 9),
      sku: formData.sku,
      name: formData.name,
      brand: formData.brand,
      productModel: formData.model, // Map model to productModel
      category: formData.category,
      price: formData.price,
      oldPrice: formData.oldPrice || undefined,
      material: formData.material,
      color: formData.color,
      image: formData.image, // main image
      images: filteredAdditionalImages, // only additional images
      video: formData.video || undefined,
      description: formData.description || undefined,
      details: detailsInput
        .split("\n")
        .map((d) => d.trim())
        .filter((d) => d), // Convert rich text to array
      inventory: formData.inventory,
      weight: formData.weight,
      dimensions: {
        length: formData.length,
        width: formData.width,
        height: formData.height,
      },
      newArrival: formData.newArrival,
      bestSeller: formData.bestSeller,
      sale: formData.sale,
      aPlusImage: aPlusImage || undefined, // Ensure aPlusImage is included
      rating: 4.0,
      reviewCount: 0,
    };
    onAddProduct(product);
    resetForm();
    onOpenChange(false);
    toast({
      title: "Product Added Successfully!",
      description: `${product.name} has been added to your inventory`,
    });
  };

  const resetForm = () => {
    setFormData({
      sku: "",
      name: "",
      brand: "",
      model: "",
      category: "",
      price: 0,
      oldPrice: 0,
      material: "",
      color: "",
      description: "",
      video: "",
      inventory: 0,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      newArrival: false,
      bestSeller: false,
      sale: false,
    })
    setMainImagePreview("")
    setAdditionalImagePreviews([])
    setAPlusImage("")
    setDetailsInput("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Add Simple Product
          </DialogTitle>
          <DialogDescription>
            Create a basic product without variants. Perfect for single-option items.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        placeholder="AUTO-GENERATED"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={generateSKU}>
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="inventory">Stock Quantity *</Label>
                    <Input
                      id="inventory"
                      type="number"
                      value={formData.inventory}
                      onChange={(e) => handleInputChange("inventory", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Enter brand name"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="Enter model number"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material">Material *</Label>
                    <CreatableCombobox
                      options={materials.map((m) => ({ value: m, label: m }))}
                      value={formData.material}
                      onChange={(value) => handleInputChange("material", value)}
                      onCreate={handleCreateMaterial}
                      placeholder="Select material"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color *</Label>
                    <CreatableCombobox
                      options={colors.map((c) => ({ value: c, label: c }))}
                      value={formData.color}
                      onChange={(value) => handleInputChange("color", value)}
                      onCreate={handleCreateColor}
                      placeholder="Select color"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (£) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="oldPrice">Compare at Price (£)</Label>
                  <Input
                    id="oldPrice"
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => handleInputChange("oldPrice", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-3">Product Tags</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => handleInputChange("newArrival", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">New Arrival</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => handleInputChange("bestSeller", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Best Seller</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.sale}
                    onChange={(e) => handleInputChange("sale", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">On Sale</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Specifications (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={formData.length}
                    onChange={(e) => handleInputChange("length", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Media & Description */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-3">Main Product Image *</h3>
              <ImageUploader
                onMainImageUpload={(url) => {
                  setMainImagePreview(url);
                  setFormData(prev => ({
                    ...prev,
                    image: url,
                  }));
                }}
                onUpload={() => {}}
                onRemoveMainImage={() => {
                  setMainImagePreview("");
                  setFormData(prev => ({ ...prev, image: "" }));
                }}
                mainImagePreview={mainImage}
                additionalImagePreviews={[]}
              />
            </div>
            {/* Additional Product Images */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-3">Additional Product Images</h3>
              <ImageUploader
                onAdditionalImagesUpload={(urls) => {
                  setAdditionalImagePreviews(prev => {
                    const all = Array.from(new Set([...prev, ...urls]));
                    return all.filter(img => img && img !== mainImage);
                  });
                }}
                onUpload={() => {}}
                onRemoveMainImage={() => {}}
                onRemoveAdditionalImage={(idx) => {
                  setAdditionalImagePreviews(prev => {
                    const updated = [...prev];
                    updated.splice(idx, 1);
                    return updated;
                  });
                }}
                mainImagePreview={""}
                additionalImagePreviews={additionalImages}
              />
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-3">Product Description</h3>
              <ReactQuill
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                theme="snow"
                className="bg-white rounded"
                placeholder="Enter detailed product description..."
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-3">Product Details/Specifications</h3>
              <ReactQuill
                value={detailsInput}
                onChange={(value) => setDetailsInput(value)}
                theme="snow"
                className="bg-white rounded"
                placeholder="Add product details, specifications, features, etc."
              />
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-semibold text-teal-900 mb-3">Video URL (Optional)</h3>
              <Input
                value={formData.video}
                onChange={(e) => handleInputChange("video", e.target.value)}
                placeholder="https://youtube.com/embed/videoId"
              />
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-900 mb-3">A+ Content Image (Optional)</h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = URL.createObjectURL(file)
                    setAPlusImage(url)
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              {aPlusImage && (
                <div className="mt-2 relative">
                  <img
                    src={aPlusImage || "/placeholder.svg"}
                    alt="A+ Content"
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setAPlusImage("")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
            Add Simple Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
