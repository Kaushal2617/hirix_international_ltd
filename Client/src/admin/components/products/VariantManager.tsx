"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Copy, ImageIcon, Star, Eye } from "lucide-react"
import { VariantForm } from "./VariantForm"
import { VariantEditDialog } from "./VariantEditDialog"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

interface VariantManagerProps {
  variants: ProductVariant[]
  onAddVariant: (variant: Omit<ProductVariant, "id">) => void
  onUpdateVariant: (variant: ProductVariant) => void
  onDeleteVariant: (variantId: string) => void
  onDuplicateVariant: (variantId: string) => void
  onSetDefaultVariant: (variantId: string) => void
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
}

export const VariantManager: React.FC<VariantManagerProps> = ({
  variants,
  onAddVariant,
  onUpdateVariant,
  onDeleteVariant,
  onDuplicateVariant,
  onSetDefaultVariant,
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
}) => {
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [viewingVariant, setViewingVariant] = useState<ProductVariant | null>(null)

  const handleAddVariant = () => {
    setEditingVariant(null)
    setShowVariantForm(true)
  }

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setShowEditDialog(true)
  }

  const handleViewVariant = (variant: ProductVariant) => {
    setViewingVariant(variant)
  }

  const handleCloseForm = () => {
    setShowVariantForm(false)
    setEditingVariant(null)
  }

  const handleCloseEditDialog = () => {
    setShowEditDialog(false)
    setEditingVariant(null)
  }

  const handleSubmitVariant = (variantData: Omit<ProductVariant, "id">) => {
    onAddVariant(variantData)
    handleCloseForm()
  }

  const handleUpdateVariant = (variantData: ProductVariant) => {
    onUpdateVariant(variantData)
    handleCloseEditDialog()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <p className="text-sm text-gray-600">
            Create different variations of your product (colors, sizes, materials, etc.)
          </p>
        </div>
        <Button onClick={handleAddVariant} className="bg-red-500 hover:bg-red-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Variants Grid */}
      {variants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No variants yet</h4>
            <p className="text-gray-600 text-center mb-4">
              Add your first product variant to get started. Each variant can have different colors, sizes, prices, and
              images.
            </p>
            <Button onClick={handleAddVariant} className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Add First Variant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.map((variant) => (
            <Card key={variant.id} className={`relative ${variant.isDefault ? "ring-2 ring-red-500" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: variant.colorCode }}
                    />
                    <div>
                      <CardTitle className="text-sm">{variant.color}</CardTitle>
                      {variant.size && (
                        <Badge variant="outline" className="text-xs">
                          {variant.size}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {variant.isDefault && (
                    <Badge className="bg-red-500">
                      <Star className="w-3 h-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Image Preview */}
                {variant.mainImage && (
                  <div
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleViewVariant(variant)}
                  >
                    <img
                      src={variant.mainImage || "/placeholder.svg"}
                      alt={variant.color}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Variant Details */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-mono text-xs">{variant.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">£{variant.price}</span>
                  </div>
                  {variant.oldPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Old Price:</span>
                      <span className="line-through text-gray-500">£{variant.oldPrice}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={variant.inventory > 0 ? "text-green-600" : "text-red-600"}>
                      {variant.inventory}
                    </span>
                  </div>
                  {variant.material && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material:</span>
                      <span>{variant.material}</span>
                    </div>
                  )}
                  {variant.finish && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Finish:</span>
                      <span>{variant.finish}</span>
                    </div>
                  )}
                  {variant.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span>{variant.weight}kg</span>
                    </div>
                  )}
                  {variant.dimensions &&
                    (variant.dimensions.length || variant.dimensions.width || variant.dimensions.height) && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="text-xs">
                          {variant.dimensions.length}×{variant.dimensions.width}×{variant.dimensions.height}cm
                        </span>
                      </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewVariant(variant)}
                    className="flex-1 text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditVariant(variant)} className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onDuplicateVariant(variant.id)} className="flex-1">
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteVariant(variant.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>

                {/* Set as Default Button */}
                {!variant.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetDefaultVariant(variant.id)}
                    className="w-full text-xs"
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Variant Form Modal */}
      {showVariantForm && (
        <VariantForm
          variant={null}
          baseSKU={baseSKU}
          colors={colors}
          sizes={sizes}
          materials={materials}
          finishes={finishes}
          onCreateColor={onCreateColor}
          onCreateSize={onCreateSize}
          onCreateMaterial={onCreateMaterial}
          onCreateFinish={onCreateFinish}
          generateVariantSKU={generateVariantSKU}
          onSubmit={handleSubmitVariant}
          onCancel={handleCloseForm}
          isOpen={showVariantForm}
        />
      )}

      {/* Edit Variant Dialog */}
      {showEditDialog && editingVariant && (
        <VariantEditDialog
          variant={editingVariant}
          baseSKU={baseSKU}
          colors={colors}
          sizes={sizes}
          materials={materials}
          finishes={finishes}
          onCreateColor={onCreateColor}
          onCreateSize={onCreateSize}
          onCreateMaterial={onCreateMaterial}
          onCreateFinish={onCreateFinish}
          onSubmit={handleUpdateVariant}
          onCancel={handleCloseEditDialog}
          isOpen={showEditDialog}
        />
      )}

      {/* View Variant Modal */}
      {viewingVariant && (
        <Dialog open={true} onOpenChange={() => setViewingVariant(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: viewingVariant.colorCode }}
                />
                {viewingVariant.color} {viewingVariant.size && `- ${viewingVariant.size}`}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Main Image</h4>
                  <img
                    src={viewingVariant.mainImage || "/placeholder.svg"}
                    alt={viewingVariant.color}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>

                {viewingVariant.images.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Additional Images</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {viewingVariant.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`${viewingVariant.color} ${index + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Variant Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-mono">{viewingVariant.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <span>{viewingVariant.color}</span>
                    </div>
                    {viewingVariant.size && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span>{viewingVariant.size}</span>
                      </div>
                    )}
                    {viewingVariant.material && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span>{viewingVariant.material}</span>
                      </div>
                    )}
                    {viewingVariant.finish && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Finish:</span>
                        <span>{viewingVariant.finish}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">£{viewingVariant.price}</span>
                    </div>
                    {viewingVariant.oldPrice && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Old Price:</span>
                        <span className="line-through text-gray-500">£{viewingVariant.oldPrice}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inventory:</span>
                      <span className={viewingVariant.inventory > 0 ? "text-green-600" : "text-red-600"}>
                        {viewingVariant.inventory}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                {(viewingVariant.weight || viewingVariant.dimensions) && (
                  <div>
                    <h4 className="font-medium mb-3">Specifications</h4>
                    <div className="space-y-2 text-sm">
                      {viewingVariant.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span>{viewingVariant.weight}kg</span>
                        </div>
                      )}
                      {viewingVariant.dimensions &&
                        (viewingVariant.dimensions.length ||
                          viewingVariant.dimensions.width ||
                          viewingVariant.dimensions.height) && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dimensions:</span>
                            <span>
                              {viewingVariant.dimensions.length} × {viewingVariant.dimensions.width} ×{" "}
                              {viewingVariant.dimensions.height} cm
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {viewingVariant.video && (
                  <div>
                    <h4 className="font-medium mb-2">Video</h4>
                    <a
                      href={viewingVariant.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {viewingVariant.video}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingVariant(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewingVariant(null)
                  handleEditVariant(viewingVariant)
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Variant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
