import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileImage, Trash, UploadCloud, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { validateImageDimensions } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageUploaderProps {
  onMainImageUpload: (imageUrl: string, file: File) => void;
  onAdditionalImagesUpload: (imageUrls: string[], files: File[]) => void;
  onRemoveMainImage: () => void;
  onRemoveAdditionalImage: (index: number) => void;
  onReorderAdditionalImages?: (newOrder: string[]) => void;
  mainImagePreview: string;
  additionalImagePreviews: string[];
}

function SortableImage({ src, onRemove, listeners, attributes, isDragging }: any) {
  return (
    <div
      className={`relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm ${isDragging ? 'ring-2 ring-red-400' : ''}`}
      {...attributes}
      {...listeners}
      style={{ cursor: 'grab' }}
    >
      <img src={src} alt="Product" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Remove image"
      >
        <X className="h-3 w-3" />
      </button>
      <span className="absolute bottom-1 left-1 bg-white/80 text-xs px-1.5 py-0.5 rounded shadow">☰</span>
    </div>
  );
}

export const ImageUploader = ({
  onMainImageUpload,
  onAdditionalImagesUpload,
  onRemoveMainImage,
  onRemoveAdditionalImage,
  onReorderAdditionalImages,
  mainImagePreview,
  additionalImagePreviews,
}: ImageUploaderProps) => {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Handle main image upload
  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Validate dimensions
      const isValidDimensions = await validateImageDimensions(file, 1000, 1000);
      
      if (!isValidDimensions) {
        toast({
          title: "Image dimensions too small",
          description: "Please upload an image that is at least 1000x1000 pixels",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }
      
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      onMainImageUpload(previewURL, file);
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: "An error occurred while processing the image",
        variant: "destructive"
      });
      console.error(error);
    }
    
    setIsUploading(false);
  };

  // Handle additional images upload
  const handleAdditionalImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const newImages: File[] = [];
    const newPreviews: string[] = [];
    const failedImages: string[] = [];
    
    try {
      // Process all selected files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          failedImages.push(`${file.name} (invalid type)`);
          continue;
        }
        
        // Validate dimensions
        const isValidDimensions = await validateImageDimensions(file, 1000, 1000);
        
        if (!isValidDimensions) {
          failedImages.push(`${file.name} (too small)`);
          continue;
        }
        
        // Create preview URL
        const previewURL = URL.createObjectURL(file);
        newImages.push(file);
        newPreviews.push(previewURL);
      }
      
      // Update state with valid images
      onAdditionalImagesUpload(newPreviews, newImages);
      
      // Show failures if any
      if (failedImages.length > 0) {
        toast({
          title: `${failedImages.length} images failed validation`,
          description: `The following images didn't meet requirements: ${failedImages.join(", ")}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error uploading images",
        description: "An error occurred while processing the images",
        variant: "destructive"
      });
      console.error(error);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Main Image Uploader */}
      <div>
        <Label className="font-semibold">Main Product Image *</Label>
        <p className="text-xs text-gray-500 mb-2">The primary image for your product. Must be at least 1000x1000 pixels.</p>
        <input
          type="file"
          id="mainImageInput"
          ref={mainImageInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleMainImageUpload}
        />
        <AnimatePresence>
          {mainImagePreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300"
            >
              <img src={mainImagePreview} alt="Main product" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={onRemoveMainImage}
                className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 transition-all"
                aria-label="Remove main image"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => mainImageInputRef.current?.click()}
              className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-red-400 hover:bg-red-50/50 cursor-pointer transition-all"
            >
              <UploadCloud className="w-10 h-10 mb-2" />
              <span className="font-medium">Click to upload main image</span>
              <span className="text-xs">PNG, JPG, GIF up to 10MB</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Additional Images Uploader */}
      <div>
        <Label className="font-semibold">Additional Images</Label>
        <p className="text-xs text-gray-500 mb-2">Upload more images to showcase your product from different angles.</p>
        <input
          type="file"
          id="additionalImagesInput"
          ref={additionalImagesInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleAdditionalImagesUpload}
        />
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={e => setDraggedId(e.active.id)}
          onDragEnd={e => {
            setDraggedId(null);
            const { active, over } = e;
            if (active.id !== over?.id) {
              const oldIndex = additionalImagePreviews.findIndex(img => img === active.id);
              const newIndex = additionalImagePreviews.findIndex(img => img === over?.id);
              const newOrder = arrayMove(additionalImagePreviews, oldIndex, newIndex);
              if (typeof onReorderAdditionalImages === 'function') {
                onReorderAdditionalImages(newOrder);
              }
            }
          }}
        >
          <SortableContext items={additionalImagePreviews} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              <AnimatePresence>
                {additionalImagePreviews.map((img, idx) => {
                  const { setNodeRef, attributes, listeners, isDragging } = useSortable({ id: img });
                  return (
                    <motion.div
                      key={img}
                      ref={setNodeRef}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <SortableImage
                        src={img}
                        onRemove={() => onRemoveAdditionalImage(idx)}
                        listeners={listeners}
                        attributes={attributes}
                        isDragging={isDragging}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div
                onClick={() => additionalImagesInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-red-400 hover:bg-red-50/50 cursor-pointer transition-all"
              >
                <FileImage className="w-8 h-8" />
                <span className="text-xs mt-1 text-center">Add Image</span>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
