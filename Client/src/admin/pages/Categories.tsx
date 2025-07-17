import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Edit, 
  Trash, 
  MoreVertical,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSelector } from 'react-redux';

// Define types for categories and subcategories
interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subcategories: Subcategory[];
}

const CategoryImageUploader = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((state) => state.auth.token);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/categories/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      const data = await response.json();
      onUpload(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Dialog state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSubcategoryDialog, setShowSubcategoryDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [parentCategoryId, setParentCategoryId] = useState<string>("");
  
  // Form values
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");

  // Add state for category image
  const [categoryImage, setCategoryImage] = useState<string>("");

  // Generate a slug from a name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  // Generate a random ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const { token } = useSelector((state: any) => state.auth);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        // Ensure subcategories is always an array
        setCategories(
          Array.isArray(data)
            ? data.map((cat: any) => ({ ...cat, subcategories: cat.subcategories || [] }))
            : []
        );
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Open dialog to add a new category
  const handleAddCategory = () => {
    setCategoryName("");
    setCategoryImage("");
    setCurrentCategory(null);
    setShowCategoryDialog(true);
  };

  // Open dialog to edit a category
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryImage(category.image || "");
    setShowCategoryDialog(true);
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category and all its subcategories?");
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete category');
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast({
        title: "Category deleted",
        description: "The category and its subcategories have been deleted",
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Save a category (create or update)
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Category name cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    const slug = generateSlug(categoryName);
    try {
      if (currentCategory) {
        // Update existing category
        const res = await fetch(`http://localhost:5000/api/categories/${currentCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...currentCategory, name: categoryName, slug, image: categoryImage }),
        });
        if (!res.ok) throw new Error('Failed to update category');
        const data = await res.json();
        setCategories(categories.map(cat => cat.id === currentCategory.id ? data : cat));
        toast({
          title: 'Category updated',
          description: `"${categoryName}" has been updated`,
        });
      } else {
        // Create new category
        const newCategory = {
          name: categoryName,
          slug,
          image: categoryImage,
          link: `/category/${slug}`,
          subcategories: [],
        };
        const res = await fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(newCategory),
        });
        if (!res.ok) {
          let errorMsg = 'Failed to create category';
          try {
            const errorData = await res.json();
            console.error('Backend error response:', errorData); // Log full error
            if (errorData.details && errorData.details.code === 11000) {
              errorMsg = 'A category with this slug already exists. Please choose a different name.';
            } else if (errorData.details && errorData.details.message) {
              errorMsg = errorData.details.message;
            } else if (errorData.error) {
              errorMsg = errorData.error;
            }
          } catch (e) {
            console.error('Error parsing backend error response:', e);
          }
          throw new Error(errorMsg);
        }
        const data = await res.json();
        // Ensure subcategories is always an array
        setCategories([...categories, { ...data, subcategories: data.subcategories || [] }]);
        toast({
          title: 'Category created',
          description: `"${categoryName}" has been created`,
        });
      }
      setShowCategoryDialog(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Open dialog to add a new subcategory
  const handleAddSubcategory = (categoryId: string) => {
    setSubcategoryName("");
    setCurrentSubcategory(null);
    setParentCategoryId(categoryId);
    setShowSubcategoryDialog(true);
  };

  // Open dialog to edit a subcategory
  const handleEditSubcategory = (category: Category, subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory);
    setSubcategoryName(subcategory.name);
    setParentCategoryId(category.id);
    setShowSubcategoryDialog(true);
  };

  // Delete a subcategory
  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this subcategory?");
    if (confirmed) {
      setCategories(categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
          };
        }
        return cat;
      }));
      toast({
        title: "Subcategory deleted",
        description: "The subcategory has been deleted",
      });
    }
  };

  // Save a subcategory (create or update)
  const handleSaveSubcategory = () => {
    if (!subcategoryName.trim()) {
      toast({
        title: "Error",
        description: "Subcategory name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const slug = generateSlug(subcategoryName);
    const parentCategory = categories.find(cat => cat.id === parentCategoryId);

    if (!parentCategory) {
      toast({
        title: "Error",
        description: "Parent category not found",
        variant: "destructive",
      });
      return;
    }

    if (currentSubcategory) {
      // Update existing subcategory
      setCategories(categories.map(cat => {
        if (cat.id === parentCategoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => 
              sub.id === currentSubcategory.id 
                ? { ...sub, name: subcategoryName, slug } 
                : sub
            )
          };
        }
        return cat;
      }));
      toast({
        title: "Subcategory updated",
        description: `"${subcategoryName}" has been updated`,
      });
    } else {
      // Create new subcategory
      const newSubcategory: Subcategory = {
        id: `${parentCategoryId}-${generateId()}`,
        name: subcategoryName,
        slug,
      };
      
      setCategories(categories.map(cat => {
        if (cat.id === parentCategoryId) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, newSubcategory]
          };
        }
        return cat;
      }));
      toast({
        title: "Subcategory created",
        description: `"${subcategoryName}" has been created under "${parentCategory.name}"`,
      });
    }

    setShowSubcategoryDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button className="bg-red-500 hover:bg-red-600" onClick={handleAddCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Category Name</TableHead>
              <TableHead className="w-1/4">Slug</TableHead>
              <TableHead className="w-1/6 text-center">Subcategories</TableHead>
              <TableHead className="w-1/6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-8 h-8 object-cover rounded border" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                  {category.name}
                </TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="text-center">{category.subcategories.length}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddSubcategory(category.id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h2 className="text-xl font-bold mt-8">Subcategories</h2>

      {/* Subcategories by category */}
      {categories.map((category) => (
        <div key={category.id} className="mt-6">
          <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5">Subcategory Name</TableHead>
                  <TableHead className="w-3/5">Slug</TableHead>
                  <TableHead className="w-1/5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.subcategories.length > 0 ? (
                  category.subcategories.map((subcategory) => (
                    <TableRow key={subcategory.id}>
                      <TableCell className="font-medium">{subcategory.name}</TableCell>
                      <TableCell>{subcategory.slug}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditSubcategory(category, subcategory)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No subcategories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent aria-describedby="category-dialog-desc">
          <DialogDescription id="category-dialog-desc">Category dialog content.</DialogDescription>
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Furniture"
              />
            </div>
            {categoryName && (
              <div className="space-y-2">
                <Label>Slug</Label>
                <div className="text-sm text-gray-500 border border-gray-200 rounded-md p-2 bg-gray-50">
                  {generateSlug(categoryName)}
                </div>
              </div>
            )}
            {/* Image upload */}
            <div className="space-y-2">
              <Label htmlFor="categoryImage">Category Image (for Shop by Category)</Label>
              <CategoryImageUploader onUpload={url => setCategoryImage(url)} />
              {categoryImage && (
                <img src={categoryImage} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={handleSaveCategory}>
              {currentCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={showSubcategoryDialog} onOpenChange={setShowSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentSubcategory ? "Edit Subcategory" : "Add Subcategory"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="parentCategory">Parent Category</Label>
              <Select 
                value={parentCategoryId} 
                onValueChange={setParentCategoryId}
                disabled={!!currentSubcategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategoryName">Subcategory Name</Label>
              <Input
                id="subcategoryName"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="e.g. Living Room"
              />
            </div>
            {subcategoryName && (
              <div className="space-y-2">
                <Label>Slug</Label>
                <div className="text-sm text-gray-500 border border-gray-200 rounded-md p-2 bg-gray-50">
                  {generateSlug(subcategoryName)}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubcategoryDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={handleSaveSubcategory}>
              {currentSubcategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;