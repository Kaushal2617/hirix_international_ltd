import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Image, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  orderItem?: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({ open, onClose, orderItem }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!orderItem) return null;

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (images.length + newFiles.length >= 3) break; // Limit to 3 images
      
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      newFiles.push(file);
      newUrls.push(URL.createObjectURL(file));
    }

    setImages([...images, ...newFiles]);
    setImageUrls([...imageUrls, ...newUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...imageUrls];
    
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(newUrls[index]);
    
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    
    setImages(newImages);
    setImageUrls(newUrls);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a star rating for this product.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setIsSubmitting(false);
      onClose();

      // Clean up object URLs
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="review-dialog-desc">
        <DialogDescription id="review-dialog-desc">Review dialog content.</DialogDescription>
        <DialogHeader>
          <DialogTitle>Rate & Review Product</DialogTitle>
          <DialogDescription>
            Share your experience with this product
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-start gap-4 py-4">
          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <img src={orderItem.image} alt={orderItem.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-medium">{orderItem.name}</h3>
            <p className="text-sm text-gray-500">Price: ${orderItem.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="rating">Your Rating</Label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your experience with this product..."
              className="mt-2 resize-none"
              rows={4}
            />
          </div>

          <div>
            <Label>Add Photos (Optional)</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                  <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {images.length < 3 && (
                <label className="w-20 h-20 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <Image className="h-5 w-5 text-gray-400" />
                  <span className="text-xs mt-1 text-gray-500">Add Photo</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Maximum 3 images</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmitReview} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;