import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import ImageUploader from './ImageUploader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface ProductFormData {
  id?: string;
  sku: string;
  name: string;
  brand?: string; // Added
  productModel?: string; // Added
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  material: string;
  color: string;
  image: string;
  images?: string[];
  video?: string;
  description?: string;
  details?: string[];
  rating?: number;
  reviewCount?: number;
  newArrival?: boolean;
  bestSeller?: boolean;
  inventory?: number;
  sale?: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  aPlusImage?: string;
}

interface ProductDetailsFormProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string | number | string[] | boolean) => void;
  categories: string[];
  materials: string[];
  colors: string[];
}

export const ProductDetailsForm = ({
  formData,
  onChange,
  categories,
  materials: initialMaterials,
  colors: initialColors,
}: ProductDetailsFormProps) => {
  const [detailItem, setDetailItem] = useState<string>("");
  const [materials, setMaterials] = useState(initialMaterials);
  const [colors, setColors] = useState(initialColors);

  const handleCreateMaterial = (value: string) => {
    const newMaterial = value.trim();
    if (newMaterial && !materials.find(m => m.toLowerCase() === newMaterial.toLowerCase())) {
      setMaterials(prev => [...prev, newMaterial]);
      onChange("material", newMaterial); 
    }
  };

  const handleCreateColor = (value: string) => {
    const newColor = value.trim();
    if (newColor && !colors.find(c => c.toLowerCase() === newColor.toLowerCase())) {
      setColors(prev => [...prev, newColor]);
      onChange("color", newColor);
    }
  };

  // Add detail to details array
  const handleAddDetail = () => {
    if (detailItem.trim()) {
      const currentDetails = formData.details || [];
      onChange("details", [...currentDetails, detailItem]);
      setDetailItem("");
    } else {
      toast({
        title: "Invalid detail",
        description: "Please enter a valid product detail",
        variant: "destructive"
      });
    }
  };

  // Remove detail from details array
  const handleRemoveDetail = (index: number) => {
    const currentDetails = formData.details || [];
    const updatedDetails = [...currentDetails];
    updatedDetails.splice(index, 1);
    onChange("details", updatedDetails);
  };

  // A+ Content Image upload handler
  const handleAPlusImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange("aPlusImage", url);
  };

  const handleRemoveAPlusImage = () => {
    onChange("aPlusImage", "");
  };

  // Derive main and additional image previews
  const mainImage = formData.image || '';
  const additionalImages = (formData.images || []).filter(img => img && img !== mainImage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Info Section */}
      <div className="space-y-2 md:col-span-2">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="border-t pt-2"></div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productSku">SKU (Stock Keeping Unit) *</Label>
        <Input 
          id="productSku"
          value={formData.sku}
          onChange={(e) => onChange("sku", e.target.value)}
          placeholder="e.g., SOF-MOD-GRY-001"
        />
        <p className="text-xs text-gray-500">
          Unique identifier for inventory tracking (e.g., category-type-color-variant)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="productName">Product Name *</Label>
        <Input 
          id="productName"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)} 
          placeholder="Enter product name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productBrand">Brand *</Label>
        <Input
          id="productBrand"
          value={formData.brand || ""}
          onChange={e => onChange("brand", e.target.value)}
          placeholder="Enter brand name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="productModel">Model *</Label>
        <Input
          id="productModel"
          value={formData.productModel || ""}
          onChange={e => onChange("productModel", e.target.value)}
          placeholder="Enter model number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productCategory">Category *</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => onChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productPrice">Price (£) *</Label>
        <Input 
          id="productPrice"
          type="number"
          value={formData.price?.toString()}
          onChange={(e) => onChange("price", parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productOldPrice">Old Price (£) (Optional)</Label>
        <Input 
          id="productOldPrice"
          type="number"
          value={formData.oldPrice?.toString() || ""}
          onChange={(e) => onChange("oldPrice", parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productInventory">Inventory *</Label>
        <Input
          id="productInventory"
          type="number"
          value={formData.inventory?.toString() || "0"}
          onChange={e => onChange("inventory", parseInt(e.target.value) || 0)}
          placeholder="0"
          min="0"
          step="1"
        />
        <p className="text-xs text-gray-500">Set the available stock for this product. If 0, product will be out of stock.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productMaterial">Material *</Label>
        <CreatableCombobox
          options={materials.map(m => ({ value: m, label: m }))}
          value={formData.material}
          onChange={value => onChange("material", value)}
          onCreate={handleCreateMaterial}
          placeholder="Select or create material"
          searchPlaceholder="Search or create..."
          emptyPlaceholder="No material found."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productColor">Color *</Label>
        <CreatableCombobox
          options={colors.map(c => ({ value: c, label: c }))}
          value={formData.color}
          onChange={value => onChange("color", value)}
          onCreate={handleCreateColor}
          placeholder="Select or create color"
          searchPlaceholder="Search or create..."
          emptyPlaceholder="No color found."
        />
      </div>

      <div className="flex items-center space-x-2 md:col-span-2">
        <input
          id="newArrivalToggle"
          type="checkbox"
          checked={!!formData.newArrival}
          onChange={e => onChange("newArrival", e.target.checked)}
          className="w-5 h-5 accent-red-500 mr-2 align-middle"
        />
        <Label htmlFor="newArrivalToggle" className="text-sm font-medium">
          {formData.newArrival ? "Remove from New Arrivals" : "Add to New Arrivals"}
        </Label>
        <input
          id="bestSellerToggle"
          type="checkbox"
          checked={!!formData.bestSeller}
          onChange={e => onChange("bestSeller", e.target.checked)}
          className="w-5 h-5 accent-orange-400 ml-6 mr-2 align-middle"
        />
        <Label htmlFor="bestSellerToggle" className="text-sm font-medium">
          {formData.bestSeller ? "Remove from Best Sellers" : "Add to Best Sellers"}
        </Label>
        <input
          id="saleToggle"
          type="checkbox"
          checked={!!formData.sale}
          onChange={e => onChange("sale", e.target.checked)}
          className="w-5 h-5 accent-green-500 ml-6 mr-2 align-middle"
        />
        <Label htmlFor="saleToggle" className="text-sm font-medium">
          {formData.sale ? "Remove from Sale Page" : "Add to Sale Page"}
        </Label>
      </div>

      {/* Video URL */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="productVideo">Video URL (Optional)</Label>
        <Input 
          id="productVideo"
          value={formData.video || ""}
          onChange={(e) => onChange("video", e.target.value)}
          placeholder="https://youtube.com/embed/videoId"
        />
        <p className="text-xs text-gray-500">
          Paste a YouTube embed URL (e.g., https://www.youtube.com/embed/videoId)
        </p>
      </div>
      {/* Description Section */}
      <div className="space-y-2 md:col-span-2">
        <h3 className="text-lg font-medium mt-4">Product Details</h3>
        <div className="border-t pt-2"></div>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="productDescription">Description</Label>
        <ReactQuill
          id="productDescription"
          value={formData.description || ""}
          onChange={value => onChange("description", value)}
          theme="snow"
          className="bg-white rounded mt-1"
          placeholder="Enter product description..."
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="productDetails">Product Details/Specifications</Label>
        <ReactQuill
          id="productDetails"
          value={Array.isArray(formData.details) ? formData.details.join("\n") : (formData.details || "")}
          onChange={value => onChange("details", value.split("\n"))}
          theme="snow"
          className="bg-white rounded mt-1"
          placeholder="Add product details, bullet points, etc."
        />
      </div>
      {/* Review Settings (Optional but useful) */}
      <div className="space-y-2 md:col-span-2">
        <h3 className="text-lg font-medium mt-4">Review Settings (Optional)</h3>
        <div className="border-t pt-2"></div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="productRating">Initial Rating (1-5)</Label>
        <Input 
          id="productRating"
          type="number"
          value={formData.rating?.toString() || "4.0"}
          onChange={(e) => onChange("rating", parseFloat(e.target.value) || 4.0)}
          placeholder="4.0"
          min="1"
          max="5"
          step="0.1"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reviewCount">Initial Review Count</Label>
        <Input 
          id="reviewCount"
          type="number"
          value={formData.reviewCount?.toString() || "0"}
          onChange={(e) => onChange("reviewCount", parseInt(e.target.value) || 0)}
          placeholder="0"
          min="0"
          step="1"
        />
      </div>
      {/* Product Images Section */}
      <div className="space-y-2 md:col-span-2">
        <h3 className="text-lg font-medium mt-4">Main Product Image *</h3>
        <ImageUploader
          onMainImageUpload={(url) => {
            onChange('image', url);
          }}
          onUpload={() => {}}
          onAdditionalImagesUpload={() => {}}
          onRemoveMainImage={() => {
            onChange('image', "");
          }}
          onRemoveAdditionalImage={() => {}}
          mainImagePreview={mainImage}
          additionalImagePreviews={[]}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <h3 className="text-lg font-medium mt-4">Additional Product Images</h3>
        <ImageUploader
          onAdditionalImagesUpload={(urls) => {
            // Add new images, no duplicates, and never duplicate main image
            const all = [...(formData.images || []), ...urls];
            const unique = Array.from(new Set(all)).filter(img => img && img !== mainImage);
            onChange('images', unique);
          }}
          onUpload={() => {}}
          onMainImageUpload={() => {}}
          onRemoveMainImage={() => {}}
          onRemoveAdditionalImage={(idx) => {
            const imgs = additionalImages.slice();
            imgs.splice(idx, 1);
            onChange('images', imgs);
          }}
          mainImagePreview={""}
          additionalImagePreviews={additionalImages}
        />
      </div>
      {/* Specifications Section */}
      <div className="space-y-2 md:col-span-2 border-t pt-4 mt-4">
        <h3 className="text-lg font-medium">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="productWeight">Weight (kg)</Label>
            <Input
              id="productWeight"
              type="number"
              value={formData.weight || ""}
              onChange={e => onChange("weight", parseFloat(e.target.value) || 0)}
              placeholder="e.g. 12.5"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="productLength">Length (cm)</Label>
            <Input
              id="productLength"
              type="number"
              value={formData.length || ""}
              onChange={e => onChange('length', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 120"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="productWidth">Width (cm)</Label>
            <Input
              id="productWidth"
              type="number"
              value={formData.width || ""}
              onChange={e => onChange('width', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 60"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="productHeight">Height (cm)</Label>
            <Input
              id="productHeight"
              type="number"
              value={formData.height || ""}
              onChange={e => onChange('height', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 80"
              min="0"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label className="font-semibold">A+ Content Image (optional)</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAPlusImageUpload}
          className="block"
        />
        {formData.aPlusImage && (
          <div className="relative w-full h-40 mt-2 rounded-lg overflow-hidden border border-gray-200">
            <img src={formData.aPlusImage} alt="A+ Content" className="w-full h-full object-cover" />
            <button type="button" onClick={handleRemoveAPlusImage} className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 transition-all">
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
