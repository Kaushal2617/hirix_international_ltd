import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ImageUploader } from "../components/products/ImageUploader";
import { allProducts } from "@/data/products";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { useSelector } from 'react-redux';

const initialCategories = Array.from(new Set(allProducts.map(p => p.category)));
const initialMaterials = Array.from(new Set(allProducts.map(p => p.material)));
const initialColors = Array.from(new Set(allProducts.map(p => p.color)));

const AddProductPage = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: any) => state.auth);
  const [materials, setMaterials] = useState(initialMaterials);
  const [colors, setColors] = useState(initialColors);

  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    category: "",
    price: 0,
    oldPrice: 0,
    material: "",
    color: "",
    description: "",
    image: "", // Restore image field
    images: [],
    video: "",
    details: "",
    rating: 4.0,
    reviewCount: 0,
    newArrival: false,
    aPlusImage: ""
  });
  const [uploadedMainImage, setUploadedMainImage] = useState(null);
  const [uploadedAdditionalImages, setUploadedAdditionalImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  const handleInputChange = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleCreateMaterial = (value: string) => {
    const newMaterial = value.trim();
    if (newMaterial && !materials.find(m => m.toLowerCase() === newMaterial.toLowerCase())) {
      setMaterials(prev => [...prev, newMaterial]);
    }
  };

  const handleCreateColor = (value: string) => {
    const newColor = value.trim();
    if (newColor && !colors.find(c => c.toLowerCase() === newColor.toLowerCase())) {
      setColors(prev => [...prev, newColor]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.sku || !newProduct.name || !newProduct.category || !newProduct.price || !newProduct.material || !newProduct.color || !newProduct.image) {
      toast({
        title: 'Missing fields',
        description: 'Please fill out all required fields including at least one product image.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Failed to add product');
      toast({
        title: 'Product added',
        description: `${newProduct.name} (SKU: ${newProduct.sku}) has been added successfully`,
      });
      navigate('/admin/products');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productSku">SKU *</Label>
              <Input id="productSku" value={newProduct.sku} onChange={e => handleInputChange("sku", e.target.value)} placeholder="e.g., SOF-MOD-GRY-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input id="productName" value={newProduct.name} onChange={e => handleInputChange("name", e.target.value)} placeholder="Enter product name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Category *</Label>
              <Select value={newProduct.category} onValueChange={value => handleInputChange("category", value)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{initialCategories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productPrice">Price (£) *</Label>
              <Input id="productPrice" type="number" value={newProduct.price?.toString()} onChange={e => handleInputChange("price", parseFloat(e.target.value) || 0)} placeholder="0.00" min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productOldPrice">Old Price (£) (Optional)</Label>
              <Input id="productOldPrice" type="number" value={newProduct.oldPrice?.toString() || ""} onChange={e => handleInputChange("oldPrice", parseFloat(e.target.value) || 0)} placeholder="0.00" min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productMaterial">Material *</Label>
              <CreatableCombobox
                options={materials.map(m => ({ value: m, label: m }))}
                value={newProduct.material}
                onChange={value => handleInputChange("material", value)}
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
                value={newProduct.color}
                onChange={value => handleInputChange("color", value)}
                onCreate={handleCreateColor}
                placeholder="Select or create color"
                searchPlaceholder="Search or create..."
                emptyPlaceholder="No color found."
              />
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <input id="newArrivalToggle" type="checkbox" checked={!!newProduct.newArrival} onChange={e => handleInputChange("newArrival", e.target.checked)} className="w-5 h-5 accent-red-500 mr-2 align-middle" />
              <Label htmlFor="newArrivalToggle">Add to New Arrivals</Label>
            </div>
          </div>
        </div>
        {/* Media */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Product Media</h2>
          <div className="space-y-2">
            <Label htmlFor="productImage">Main Product Image * (Min 1000x1000px)</Label>
            <ImageUploader
              onMainImageUpload={(url, file) => {
                setMainImagePreview(url);
                setUploadedMainImage(file);
                setNewProduct(prev => ({
                  ...prev,
                  image: url, // Set image field
                  images: [url, ...(prev.images || []).filter(img => img !== url)]
                }));
              }}
              onAdditionalImagesUpload={(urls, files) => {
                setAdditionalImagePreviews([...additionalImagePreviews, ...urls]);
                setUploadedAdditionalImages([...uploadedAdditionalImages, ...files]);
                setNewProduct(prev => ({
                  ...prev,
                  images: Array.from(new Set([...(prev.images || []), ...urls]))
                }));
              }}
              onRemoveMainImage={() => {
                setMainImagePreview("");
                setUploadedMainImage(null);
                setNewProduct(prev => ({
                  ...prev,
                  image: "", // Clear image field
                  images: prev.images ? prev.images.slice(1) : []
                }));
              }}
              onRemoveAdditionalImage={idx => {
                setNewProduct(prev => ({
                  ...prev,
                  images: prev.images.filter((_, i) => i !== idx)
                }));
                const updatedPreviews = [...additionalImagePreviews];
                updatedPreviews.splice(idx, 1);
                setAdditionalImagePreviews(updatedPreviews);
                const updatedUploaded = [...uploadedAdditionalImages];
                updatedUploaded.splice(idx, 1);
                setUploadedAdditionalImages(updatedUploaded);
              }}
              mainImagePreview={mainImagePreview}
              additionalImagePreviews={additionalImagePreviews}
            />
            <p className="text-xs text-gray-500">
              Upload a high-quality image that clearly shows the product. Minimum dimensions: 1000x1000 pixels.
            </p>
          </div>
          {/* A+ Content Image Upload */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="aPlusImage">A+ Content Image (Optional)</Label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const formData = new FormData();
                    formData.append('image', file);
                    const response = await fetch('http://localhost:5000/api/products/upload-image', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                      body: formData,
                    });
                    if (!response.ok) throw new Error('Image upload failed');
                    const data = await response.json();
                    setNewProduct(prev => ({ ...prev, aPlusImage: data.url }));
                  } catch (err) {
                    toast({ title: 'A+ Image Upload Error', description: (err as Error).message, variant: 'destructive' });
                  }
                }
              }}
              className="block"
            />
            {newProduct.aPlusImage && (
              <img src={newProduct.aPlusImage} alt="A+ Content" className="w-full h-32 object-cover rounded mt-2" />
            )}
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="productVideo">Video URL (Optional)</Label>
            <Input id="productVideo" value={newProduct.video || ""} onChange={e => handleInputChange("video", e.target.value)} placeholder="https://youtube.com/embed/videoId" />
            <p className="text-xs text-gray-500">
              Paste a YouTube embed URL (e.g., https://www.youtube.com/embed/videoId)
            </p>
          </div>
        </div>
        {/* Description & Details */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Description & Details</h2>
          <div className="space-y-2">
            <Label htmlFor="productDescription">Description</Label>
            <ReactQuill
              id="productDescription"
              value={newProduct.description}
              onChange={value => handleInputChange("description", value)}
              theme="snow"
              className="bg-white rounded"
              placeholder="Enter product description"
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="productDetails">Product Details/Specifications</Label>
            <ReactQuill
              id="productDetails"
              value={newProduct.details}
              onChange={value => handleInputChange("details", value)}
              theme="snow"
              className="bg-white rounded"
              placeholder="Add product details, bullet points, etc."
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => navigate("/admin/products")}>Cancel</Button>
          <Button className="bg-red-500 hover:bg-red-600" type="submit">Add Product</Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage; 