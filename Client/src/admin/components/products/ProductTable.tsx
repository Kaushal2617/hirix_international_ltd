import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Check, Eye, EyeOff, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ProductDetailsForm, ProductFormData } from "./ProductDetailsForm";
import { allProducts } from "@/data/products";
import { VariantManager } from "./VariantManager";
// Remove import type { ProductVariant } from "../../pages/Products";
// Add ProductVariant type locally
interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  colorCode: string;
  size?: string;
  material?: string;
  finish?: string;
  price: number;
  oldPrice?: number;
  inventory: number;
  mainImage: string;
  images: string[];
  video?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isDefault?: boolean;
}
// Add variants to AdminProduct
interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  material: string;
  color: string;
  image: string;
  oldPrice?: number;
  outOfStock?: boolean;
  published?: boolean;
  inventory: number;
  details?: string[];
  variants?: ProductVariant[];
  sale?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

interface ProductTableProps {
  products: AdminProduct[];
  onUpdateProduct: (updatedProduct: AdminProduct) => void;
  onDeleteProduct: (productId: string) => void;
}

// Change AdminProduct to UnifiedProduct for variantProduct and typing
interface UnifiedProduct extends AdminProduct {
  variants?: ProductVariant[];
}

// Helper to normalize product ID
const normalizeProductId = (product: AdminProduct) => ({
  ...product,
  id: product.id || (product as any)?._id,
});

const getProductId = (product: AdminProduct) => product.id;

export const ProductTable = ({ 
  products, 
  onUpdateProduct, 
  onDeleteProduct 
}: ProductTableProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<AdminProduct | null>(null);
  const [editedProduct, setEditedProduct] = useState<ProductFormData | null>(null);
  const [discountAmount, setDiscountAmount] = useState("");
  // Add state for variant manager dialog
  const [variantManagerOpen, setVariantManagerOpen] = useState(false);
  const [variantProduct, setVariantProduct] = useState<UnifiedProduct | null>(null);

  const categories = Array.from(new Set(allProducts.map(p => p.category)));
  const materials = Array.from(new Set(allProducts.map(p => p.material)));
  const colors = Array.from(new Set(allProducts.map(p => p.color)));

  const handleEditClick = (product: AdminProduct) => {
    if (Array.isArray((product as any).variants) && (product as any).variants.length > 0) {
      setVariantProduct(product);
      setVariantManagerOpen(true);
    } else {
      setCurrentProduct(product);
      setEditedProduct({
        ...product,
        id: product.id || (product as any)._id || "",
        sku: product.sku || "",
        color: product.color || "",
        material: product.material || "",
        sale: !!product.sale,
        bestSeller: !!product.bestSeller,
        newArrival: !!product.newArrival,
        details: Array.isArray(product.details) ? product.details : (product.details ? [product.details] : []),
        // add other fields as needed
      });
      setEditDialogOpen(true);
    }
  };

  const handleDiscountClick = (product: AdminProduct) => {
    setCurrentProduct(product);
    setDiscountAmount("");
    setDiscountDialogOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    const productToDelete = products.find(p => getProductId(p) === productId);
    const productName = productToDelete ? productToDelete.name : 'Product';
    
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      onDeleteProduct(productId);
      toast({
        title: "Product deleted",
        description: `${productName} has been removed from inventory`,
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editedProduct) {
      toast({
        title: "Error",
        description: "No product data to save",
        variant: "destructive"
      });
      return;
    }
    // Ensure images array is always present and does not include the main image
    const mainImage = editedProduct.image;
    const additionalImages = (editedProduct.images || []).filter(img => img && img !== mainImage);
    const productToSave = {
      ...editedProduct,
      image: mainImage,
      images: additionalImages,
    };
    // Specific validation for required fields
    if (!editedProduct.name || !editedProduct.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    if (!editedProduct.sku || !editedProduct.sku.trim()) {
      toast({
        title: "Validation Error",
        description: "SKU cannot be empty",
        variant: "destructive"
      });
      return;
    }
    if (editedProduct.price === undefined || editedProduct.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Price must be greater than 0",
        variant: "destructive"
      });
      return;
    }
    // Wait for update to succeed before closing dialog
    await onUpdateProduct(productToSave as AdminProduct);
    setEditDialogOpen(false);
    setCurrentProduct(null);
    setEditedProduct(null);
    toast({
      title: "Product updated",
      description: `${editedProduct.name} has been updated successfully`,
    });
  };

  const handleApplyDiscount = () => {
    if (!currentProduct || !discountAmount.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a discount percentage",
        variant: "destructive",
      });
      return;
    }

    const discountPercentage = parseFloat(discountAmount);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      toast({
        title: "Invalid discount",
        description: "Please enter a valid discount percentage between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    const oldPrice = currentProduct.oldPrice || currentProduct.price;
    const newPrice = oldPrice * (1 - discountPercentage / 100);
    
    const updatedProduct = {
      ...currentProduct,
      price: parseFloat(newPrice.toFixed(2)),
      oldPrice: oldPrice,
    };
    
    onUpdateProduct(updatedProduct);
    setDiscountDialogOpen(false);
    setCurrentProduct(null);
    setDiscountAmount("");
    toast({
      title: "Discount applied",
      description: `A ${discountPercentage}% discount has been applied to ${currentProduct.name}`,
    });
  };

  const handleRemoveDiscount = () => {
    if (!currentProduct || !currentProduct.oldPrice) {
      toast({
        title: "No discount to remove",
        description: "This product doesn't have an active discount",
        variant: "destructive",
      });
      return;
    }

    const updatedProduct = {
      ...currentProduct,
      price: currentProduct.oldPrice,
      oldPrice: undefined,
    };
    
    onUpdateProduct(updatedProduct);
    setDiscountDialogOpen(false);
    setCurrentProduct(null);
    setDiscountAmount("");
    toast({
      title: "Discount removed",
      description: `The discount has been removed from ${currentProduct.name}`,
    });
  };

  const handleEditInputChange = (field: keyof ProductFormData, value: string | number | string[] | boolean) => {
    if (!editedProduct) return;
    
    setEditedProduct({
      ...editedProduct,
      [field]: value
    });
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={getProductId(product)}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{product.sku}</span>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>£{product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        £{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.material}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell>
                  {product.inventory === 0 ? (
                    <span className="text-xs text-red-500 font-semibold">Out of Stock</span>
                  ) : (
                    <span className="text-xs text-green-600 font-semibold">{product.inventory} in stock</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 items-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditClick(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {/* Unpublished Toggle */}
                    <label className="flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!product.published}
                        onChange={async () => { await onUpdateProduct({ ...product, published: product.published ? false : true }); }}
                        className="w-5 h-5 accent-green-500 ml-2 mr-1"
                      />
                      <span className="text-xs text-gray-600">{!product.published ? "Unpublished" : "Published"}</span>
                    </label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteClick(getProductId(product))}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogDescription id="product-dialog-desc">Edit product details and variants here.</DialogDescription>
          <DialogHeader>
            <DialogTitle>Edit: {currentProduct?.name}</DialogTitle>
          </DialogHeader>
          {editedProduct && (
            <div className="py-4">
              <ProductDetailsForm
                formData={editedProduct}
                onChange={handleEditInputChange}
                categories={categories}
                materials={
                  materials.includes(editedProduct.material)
                    ? materials
                    : [...materials, editedProduct.material]
                }
                colors={
                  colors.includes(editedProduct.color)
                    ? colors
                    : [...colors, editedProduct.color]
                }
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-red-500 hover:bg-red-600">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                Discount (%)
              </Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="col-span-3"
                placeholder="Enter discount percentage"
              />
            </div>
            {currentProduct?.oldPrice && (
              <div className="text-sm text-muted-foreground">
                Current price: £{currentProduct.price.toFixed(2)} (Original: £{currentProduct.oldPrice.toFixed(2)})
              </div>
            )}
            {currentProduct && !currentProduct.oldPrice && (
              <div className="text-sm text-muted-foreground">
                Current price: £{currentProduct.price.toFixed(2)}
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            {currentProduct?.oldPrice && (
              <Button variant="outline" onClick={handleRemoveDiscount}>
                Remove Discount
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDiscountDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyDiscount}>
                <Check className="mr-2 h-4 w-4" /> Apply Discount
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {variantProduct && (
        <Dialog open={variantManagerOpen} onOpenChange={setVariantManagerOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Edit Variants: {variantProduct.name}</DialogTitle>
            </DialogHeader>
            <VariantManager
              variants={variantProduct.variants || []}
              onAddVariant={() => {}}
              onUpdateVariant={() => {}}
              onDeleteVariant={variantId => {
                const updatedVariants = (variantProduct.variants || []).filter((v: any) => v.id !== variantId);
                onUpdateProduct(normalizeProductId({ ...variantProduct, variants: updatedVariants }));
                setVariantProduct({ ...variantProduct, variants: updatedVariants });
              }}
              onDuplicateVariant={variantId => {
                const variants = variantProduct.variants || [];
                const variantToDuplicate = variants.find((v: any) => v.id === variantId);
                if (variantToDuplicate) {
                  const newVariant = { ...variantToDuplicate, id: Math.random().toString(36).substring(2, 9), sku: variantToDuplicate.sku + "-COPY" };
                  const updatedVariants = [...variants, newVariant];
                  // Ensure the product has a valid id
                  onUpdateProduct(normalizeProductId({ ...variantProduct, variants: updatedVariants }));
                  setVariantProduct({ ...variantProduct, variants: updatedVariants });
                }
              }}
              onSetDefaultVariant={variantId => {
                const variants = (variantProduct.variants || []).map((v: any) => ({ ...v, isDefault: v.id === variantId }));
                onUpdateProduct({ ...variantProduct, variants });
                setVariantProduct({ ...variantProduct, variants });
              }}
              baseSKU={variantProduct.sku}
              colors={[]}
              sizes={[]}
              materials={[]}
              finishes={[]}
              onCreateColor={() => {}}
              onCreateSize={() => {}}
              onCreateMaterial={() => {}}
              onCreateFinish={() => {}}
              generateVariantSKU={() => ""}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setVariantManagerOpen(false)}>Close</Button>
              <Button className="bg-red-500 hover:bg-red-600" onClick={() => { if (variantProduct) { onUpdateProduct(variantProduct); setVariantManagerOpen(false); } }}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
