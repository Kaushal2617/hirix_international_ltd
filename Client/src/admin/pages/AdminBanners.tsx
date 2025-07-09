import React, { useState } from "react";
import { banners as initialBanners, Banner } from "@/data/banners";
import { allProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "../components/products/ImageUploader";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const categories = Array.from(new Set(allProducts.map(p => p.category)));

const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
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

  // Add or edit hero banner
  const handleAddOrEditHero = () => {
    if (!heroImageUrl || !heroCategory) {
      toast({ title: "Missing fields", description: "Please select an image and category.", variant: "destructive" });
      return;
    }
    if (editBanner) {
      setBanners(banners.map(b => b.id === editBanner.id ? { ...editBanner, imageUrl: heroImageUrl, mobileImageUrl: heroMobileImageUrl, category: heroCategory } : b));
      toast({ title: "Banner updated", description: "Hero banner has been updated." });
    } else {
      setBanners([...banners, { id: Math.random().toString(36).slice(2, 9), imageUrl: heroImageUrl, mobileImageUrl: heroMobileImageUrl, category: heroCategory, type: 'hero' }]);
      toast({ title: "Banner added", description: "New hero banner has been added." });
    }
    setDialogOpen(false);
    resetForm();
  };

  // Add or edit mini banner
  const handleAddOrEditMini = () => {
    if (!miniImageUrl) {
      toast({ title: "Missing fields", description: "Please select an image.", variant: "destructive" });
      return;
    }
    if (editBanner) {
      setBanners(banners.map(b => b.id === editBanner.id ? { ...editBanner, imageUrl: miniImageUrl, mobileImageUrl: miniMobileImageUrl, title: miniTitle, link: miniLink } : b));
      toast({ title: "Banner updated", description: "Mini banner has been updated." });
    } else {
      setBanners([...banners, { id: Math.random().toString(36).slice(2, 9), imageUrl: miniImageUrl, mobileImageUrl: miniMobileImageUrl, title: miniTitle, link: miniLink, type: 'mini' }]);
      toast({ title: "Banner added", description: "New mini banner has been added." });
    }
    setDialogOpen(false);
    resetForm();
  };

  // Edit handlers
  const handleEditClick = (banner: Banner) => {
    setEditBanner(banner);
    if (banner.type === 'hero') {
      setHeroImageUrl(banner.imageUrl);
      setHeroMobileImageUrl(banner.mobileImageUrl || "");
      setHeroCategory(banner.category || "");
      setTab('hero');
    } else {
      setMiniImageUrl(banner.imageUrl);
      setMiniMobileImageUrl(banner.mobileImageUrl || "");
      setMiniTitle(banner.title || "");
      setMiniLink(banner.link || "/best-sellers");
      setTab('mini');
    }
    setDialogOpen(true);
  };

  // Delete handler
  const handleDeleteClick = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
    toast({ title: "Banner deleted", description: "Banner has been removed." });
  };

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
                  <ImageUploader
                    onMainImageUpload={url => setHeroImageUrl(url)}
                    mainImagePreview={heroImageUrl}
                    onRemoveMainImage={() => setHeroImageUrl("")}
                    additionalImagePreviews={[]}
                    onAdditionalImagesUpload={() => {}}
                    onRemoveAdditionalImage={() => {}}
                  />
                </div>
                <div className="mb-4">
                  <Label>Banner Image (Mobile)</Label>
                  <ImageUploader
                    onMainImageUpload={url => setHeroMobileImageUrl(url)}
                    mainImagePreview={heroMobileImageUrl}
                    onRemoveMainImage={() => setHeroMobileImageUrl("")}
                    additionalImagePreviews={[]}
                    onAdditionalImagesUpload={() => {}}
                    onRemoveAdditionalImage={() => {}}
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
                  <ImageUploader
                    onMainImageUpload={url => setMiniImageUrl(url)}
                    mainImagePreview={miniImageUrl}
                    onRemoveMainImage={() => setMiniImageUrl("")}
                    additionalImagePreviews={[]}
                    onAdditionalImagesUpload={() => {}}
                    onRemoveAdditionalImage={() => {}}
                  />
                </div>
                <div className="mb-4">
                  <Label>Mini Banner Image (Mobile)</Label>
                  <ImageUploader
                    onMainImageUpload={url => setMiniMobileImageUrl(url)}
                    mainImagePreview={miniMobileImageUrl}
                    onRemoveMainImage={() => setMiniMobileImageUrl("")}
                    additionalImagePreviews={[]}
                    onAdditionalImagesUpload={() => {}}
                    onRemoveAdditionalImage={() => {}}
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