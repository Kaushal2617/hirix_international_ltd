"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CreatableCombobox } from "@/components/ui/creatable-combobox"
import ImageUploader from "./ImageUploader"
import { toast } from "@/hooks/use-toast"

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
  brand?: string
  productModel?: string
}

interface VariantFormProps {
  variant?: ProductVariant | null
  baseSKU: string
  colors: string[]
  sizes: string[]
  materials: string[]
  finishes: string[]
  onCreateColor: (color: string) => void
  onCreateSize: (size: string) => void
  onCreateMaterial: (material: string) => void
  onCreateFinish: (finish: string) => void
  generateVariantSKU: (baseSKU: string, color: string, size?: string, material?: string) => string
  onSubmit: (variant: Omit<ProductVariant, "id">) => void
  onCancel: () => void
  isOpen: boolean
}

// Common color codes for auto-assignment
const commonColors = [
  { name: "Red", code: "#FF0000" },
  { name: "Blue", code: "#0000FF" },
  { name: "Green", code: "#008000" },
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Gray", code: "#808080" },
  { name: "Brown", code: "#A52A2A" },
  { name: "Navy", code: "#000080" },
  { name: "Pink", code: "#FFC0CB" },
  { name: "Purple", code: "#800080" },
  { name: "Orange", code: "#FFA500" },
  { name: "Yellow", code: "#FFFF00" },
]

export const VariantForm: React.FC<VariantFormProps> = ({
  variant,
  baseSKU,
  colors,
  sizes,
  materials,
  finishes,
  onCreateColor,
  onCreateSize,
  onCreateMaterial,
  onCreateFinish,
  generateVariantSKU,
  onSubmit,
  onCancel,
  isOpen,
}) => {
  const [formData, setFormData] = useState({
    sku: "",
    color: "",
    colorCode: "#000000",
    size: "",
    material: "",
    finish: "",
    price: 0,
    oldPrice: 0,
    inventory: 0,
    mainImage: "",
    images: [] as string[],
    video: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    brand: "", // Added
    productModel: "", // Added
  })

  const [mainImagePreview, setMainImagePreview] = useState<string>("")
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])

  // Initialize form data when variant changes
  useEffect(() => {
    if (variant) {
      setFormData({
        sku: variant.sku,
        color: variant.color,
        colorCode: variant.colorCode,
        size: variant.size || "",
        material: variant.material || "",
        finish: variant.finish || "",
        price: variant.price,
        oldPrice: variant.oldPrice || 0,
        inventory: variant.inventory,
        mainImage: variant.mainImage,
        images: variant.images,
        video: variant.video || "",
        weight: variant.weight || 0,
        length: variant.dimensions?.length || 0,
        width: variant.dimensions?.width || 0,
        height: variant.dimensions?.height || 0,
        brand: variant.brand || "", // Added
        productModel: variant.productModel || "", // Added
      })
      setMainImagePreview(variant.mainImage)
      setAdditionalImagePreviews(variant.images)
    } else {
      // Reset form for new variant
      setFormData({
        sku: "",
        color: "",
        colorCode: "#000000",
        size: "",
        material: "",
        finish: "",
        price: 0,
        oldPrice: 0,
        inventory: 0,
        mainImage: "",
        images: [],
        video: "",
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        brand: "", // Added
        productModel: "", // Added
      })
      setMainImagePreview("")
      setAdditionalImagePreviews([])
    }
  }, [variant])

  // Auto-generate SKU when color, size, or material changes
  useEffect(() => {
    if (formData.color && baseSKU && !variant) {
      const newSKU = generateVariantSKU(baseSKU, formData.color, formData.size, formData.material)
      setFormData((prev) => ({ ...prev, sku: newSKU }))
    }
  }, [formData.color, formData.size, formData.material, baseSKU, variant, generateVariantSKU])

  // Auto-set color code when color name changes
  const handleColorChange = (colorName: string) => {
    setFormData((prev) => ({ ...prev, color: colorName }))

    // Try to find matching color code
    const commonColor = commonColors.find((c) => c.name.toLowerCase() === colorName.toLowerCase())

    if (commonColor) {
      setFormData((prev) => ({ ...prev, colorCode: commonColor.code }))
    }
  }

  const handleSubmit = () => {
    // Validation
    if (!formData.color || !formData.sku || !formData.price || !mainImagePreview) {
      toast({
        title: "Missing required fields",
        description: "Please fill in color, SKU, price, and upload a main image",
        variant: "destructive",
      })
      return
    }

    const variantData: Omit<ProductVariant, "id"> = {
      sku: formData.sku,
      color: formData.color,
      colorCode: formData.colorCode,
      size: formData.size || undefined,
      material: formData.material || undefined,
      finish: formData.finish || undefined,
      price: formData.price,
      oldPrice: formData.oldPrice || undefined,
      inventory: formData.inventory,
      mainImage: mainImagePreview,
      images: additionalImagePreviews,
      video: formData.video || undefined,
      weight: formData.weight || undefined,
      dimensions:
        formData.length || formData.width || formData.height
          ? {
              length: formData.length,
              width: formData.width,
              height: formData.height,
            }
          : undefined,
      brand: formData.brand || undefined, // Added
      productModel: formData.productModel || undefined, // Added
    }

    onSubmit(variantData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{variant ? "Edit Variant" : "Add New Variant"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="variantSKU">SKU *</Label>
              <Input
                id="variantSKU"
                value={formData.sku}
                onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                placeholder="Auto-generated"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantColor">Color *</Label>
              <CreatableCombobox
                options={colors.map((c) => ({ value: c, label: c }))}
                value={formData.color}
                onChange={handleColorChange}
                onCreate={onCreateColor}
                placeholder="Select or create color"
                searchPlaceholder="Search colors..."
                emptyPlaceholder="No color found."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantSize">Size (Optional)</Label>
              <CreatableCombobox
                options={sizes.map((s) => ({ value: s, label: s }))}
                value={formData.size}
                onChange={(value) => setFormData((prev) => ({ ...prev, size: value }))}
                onCreate={onCreateSize}
                placeholder="Select or create size"
                searchPlaceholder="Search sizes..."
                emptyPlaceholder="No size found."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantMaterial">Material (Optional)</Label>
              <CreatableCombobox
                options={materials.map((m) => ({ value: m, label: m }))}
                value={formData.material}
                onChange={(value) => setFormData((prev) => ({ ...prev, material: value }))}
                onCreate={onCreateMaterial}
                placeholder="Select or create material"
                searchPlaceholder="Search materials..."
                emptyPlaceholder="No material found."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantFinish">Finish (Optional)</Label>
              <CreatableCombobox
                options={finishes.map((f) => ({ value: f, label: f }))}
                value={formData.finish}
                onChange={(value) => setFormData((prev) => ({ ...prev, finish: value }))}
                onCreate={onCreateFinish}
                placeholder="Select or create finish"
                searchPlaceholder="Search finishes..."
                emptyPlaceholder="No finish found."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variantPrice">Price (£) *</Label>
                <Input
                  id="variantPrice"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variantOldPrice">Old Price (£)</Label>
                <Input
                  id="variantOldPrice"
                  type="number"
                  value={formData.oldPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, oldPrice: Number.parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantInventory">Inventory *</Label>
              <Input
                id="variantInventory"
                type="number"
                value={formData.inventory}
                onChange={(e) => setFormData((prev) => ({ ...prev, inventory: Number.parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
              />
            </div>

            {/* Specifications - Same as Simple Product */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Specifications (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, weight: Number.parseFloat(e.target.value) || 0 }))
                    }
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, length: Number.parseFloat(e.target.value) || 0 }))
                    }
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, width: Number.parseFloat(e.target.value) || 0 }))
                    }
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, height: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantBrand">Brand *</Label>
              <Input
                id="variantBrand"
                value={formData.brand}
                onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Enter brand name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variantModel">Model *</Label>
              <Input
                id="variantModel"
                value={formData.productModel}
                onChange={e => setFormData(prev => ({ ...prev, productModel: e.target.value }))}
                placeholder="Enter model number"
              />
            </div>
          </div>

          {/* Right Column - Media */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Variant Images *</Label>
              <ImageUploader
                onMainImageUpload={(url, file) => {
                  setMainImagePreview(url)
                  setFormData((prev) => ({ ...prev, mainImage: url }))
                }}
                onAdditionalImagesUpload={(urls, files) => {
                  setAdditionalImagePreviews((prev) => [...prev, ...urls])
                  setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
                }}
                onRemoveMainImage={() => {
                  setMainImagePreview("")
                  setFormData((prev) => ({ ...prev, mainImage: "" }))
                }}
                onRemoveAdditionalImage={(idx) => {
                  const updatedPreviews = [...additionalImagePreviews]
                  updatedPreviews.splice(idx, 1)
                  setAdditionalImagePreviews(updatedPreviews)

                  const updatedImages = [...formData.images]
                  updatedImages.splice(idx, 1)
                  setFormData((prev) => ({ ...prev, images: updatedImages }))
                }}
                mainImagePreview={mainImagePreview}
                additionalImagePreviews={additionalImagePreviews}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantVideo">Video URL (Optional)</Label>
              <Input
                id="variantVideo"
                value={formData.video}
                onChange={(e) => setFormData((prev) => ({ ...prev, video: e.target.value }))}
                placeholder="https://youtube.com/embed/videoId"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600">
            {variant ? "Update Variant" : "Add Variant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
