import React, { useState } from "react";
import { banners as initialBanners, Banner } from "@/data/banners";
import { allProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanners, addBanner } from '@/store/bannerSlice';
import { useEffect } from 'react';

const BannerImageUploader = ({ onUpload }) => {
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

      const response = await fetch('http://localhost:5000/api/banners/upload-image', {
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

const categories = Array.from(new Set(allProducts.map(p => p.category)));

const AdminBanners: React.FC = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state: any) => state.banners);
  const [tab, setTab] = useState<'hero' | 'mini'>('hero');
  // Shared dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  // Hero banner form
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroMobileImageUrl, setHeroMobileImageUrl] = useState("");
  const [heroCategory, setHeroCategory] = useState("");
  // Mini banner form
  const [miniImageUrl, setMiniImageUrl] = useState("");
  const [miniMobileImageUrl, setMiniMobileImageUrl] = useState("");
  const [miniTitle, setMiniTitle] = useState("");
  const [miniLink, setMiniLink] = useState("/best-sellers");

  useEffect(() => {
    dispatch(fetchBanners() as any);
  }, [dispatch]);

  const resetForm = () => {
    setHeroImageUrl("");
    setHeroMobileImageUrl("");
    setHeroCategory("");
    setMiniImageUrl("");
    setMiniMobileImageUrl("");
    setMiniTitle("");
    setMiniLink("/best-sellers");
    setEditBanner(null);
  };

  // Add hero banner (no edit for now)
  const handleAddOrEditHero = async () => {
    if (!heroImageUrl || !heroCategory) {
      toast({ title: "Missing fields", description: "Please select an image and category.", variant: "destructive" });
      return;
    }
    try {
      await dispatch(addBanner({ imageUrl: heroImageUrl, mobileImageUrl: heroMobileImageUrl, category: heroCategory, type: 'hero' }) as any).unwrap();
      toast({ title: "Banner added", description: "New hero banner has been added." });
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || 'Failed to add banner', variant: 'destructive' });
    }
  };

  // Add mini banner (no edit for now)
  const handleAddOrEditMini = async () => {
    if (!miniImageUrl) {
      toast({ title: "Missing fields", description: "Please select an image.", variant: "destructive" });
      return;
    }
    try {
      await dispatch(addBanner({ imageUrl: miniImageUrl, mobileImageUrl: miniMobileImageUrl, title: miniTitle, link: miniLink, type: 'mini' }) as any).unwrap();
      toast({ title: "Banner added", description: "New mini banner has been added." });
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || 'Failed to add banner', variant: 'destructive' });
    }
  };

  // Edit and delete handlers can be implemented similarly using backend endpoints if needed

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Manage Banners</h1>
      <Tabs value={tab} onValueChange={v => setTab(v as 'hero' | 'mini')}>
        <TabsList className="mb-6">
          <TabsTrigger value="hero">Hero Banners</TabsTrigger>
          <TabsTrigger value="mini">Mini Banners</TabsTrigger>
        </TabsList>
        {/* Hero Banners Tab */}
        <TabsContent value="hero">
          <div className="flex justify-end mb-4">
            <Button className="bg-red-500 hover:bg-red-600" onClick={() => { setDialogOpen(true); setTab('hero'); resetForm(); }}>Add Hero Banner</Button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Image</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.filter(b => b.type === 'hero').length === 0 && (
                  <tr><td colSpan={3} className="text-center py-6 text-gray-400">No hero banners added yet.</td></tr>
                )}
                {banners.filter(b => b.type === 'hero').map(banner => (
                  <tr key={banner.id} className="border-t">
                    <td className="py-2">
                      <img src={banner.imageUrl} alt="Banner" className="w-32 h-16 object-cover rounded" />
                    </td>
                    <td className="py-2">{banner.category}</td>
                    <td className="py-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(banner)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteClick(banner.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        {/* Mini Banners Tab */}
        <TabsContent value="mini">
          <div className="flex justify-end mb-4">
            <Button className="bg-red-500 hover:bg-red-600" onClick={() => { setDialogOpen(true); setTab('mini'); resetForm(); }}>Add Mini Banner</Button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Image</th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Link</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.filter(b => b.type === 'mini').length === 0 && (
                  <tr><td colSpan={4} className="text-center py-6 text-gray-400">No mini banners added yet.</td></tr>
                )}
                {banners.filter(b => b.type === 'mini').map(banner => (
                  <tr key={banner.id} className="border-t">
                    <td className="py-2">
                      <img src={banner.imageUrl} alt="Mini Banner" className="w-32 h-16 object-cover rounded" />
                    </td>
                    <td className="py-2">{banner.title}</td>
                    <td className="py-2">{banner.link}</td>
                    <td className="py-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(banner)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteClick(banner.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" aria-describedby="banner-dialog-desc">
          <DialogDescription id="banner-dialog-desc">Banner dialog content.</DialogDescription>
          <DialogHeader>
            <DialogTitle>{tab === 'hero' ? (editBanner ? "Edit Hero Banner" : "Add Hero Banner") : (editBanner ? "Edit Mini Banner" : "Add Mini Banner")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {tab === 'hero' ? (
              <>
                <div className="mb-4">
                  <Label>Banner Image (Desktop) *</Label>
                  <BannerImageUploader
                    onUpload={url => setHeroImageUrl(url)}
                  />
                </div>
                <div className="mb-4">
                  <Label>Banner Image (Mobile)</Label>
                  <BannerImageUploader
                    onUpload={url => setHeroMobileImageUrl(url)}
                  />
                  <p className="text-xs text-gray-500">Optional. If not provided, desktop image will be used on mobile.</p>
                </div>
                <div className="mb-4">
                  <Label>Category *</Label>
                  <select
                    className="w-full border rounded px-3 py-2 mt-1"
                    value={heroCategory}
                    onChange={e => setHeroCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <Label>Mini Banner Image (Desktop) *</Label>
                  <BannerImageUploader
                    onUpload={url => setMiniImageUrl(url)}
                  />
                </div>
                <div className="mb-4">
                  <Label>Mini Banner Image (Mobile)</Label>
                  <BannerImageUploader
                    onUpload={url => setMiniMobileImageUrl(url)}
                  />
                  <p className="text-xs text-gray-500">Optional. If not provided, desktop image will be used on mobile.</p>
                </div>
                <div className="mb-4">
                  <Label>Title</Label>
                  <Input
                    value={miniTitle}
                    onChange={e => setMiniTitle(e.target.value)}
                    placeholder="e.g. Discover Best Sellers"
                  />
                </div>
                <div className="mb-4">
                  <Label>Link</Label>
                  <Input
                    value={miniLink}
                    onChange={e => setMiniLink(e.target.value)}
                    placeholder="e.g. /best-sellers"
                  />
                  <p className="text-xs text-gray-500">Default: /best-sellers</p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
            {tab === 'hero' ? (
              <Button className="bg-red-500 hover:bg-red-600" onClick={handleAddOrEditHero}>{editBanner ? "Save Changes" : "Add Hero Banner"}</Button>
            ) : (
              <Button className="bg-red-500 hover:bg-red-600" onClick={handleAddOrEditMini}>{editBanner ? "Save Changes" : "Add Mini Banner"}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBanners; 