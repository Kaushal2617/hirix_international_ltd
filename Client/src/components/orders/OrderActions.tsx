import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, RotateCcw, Share2, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface OrderActionsProps {
  orderId: string;
  itemId: number;
  onReviewClick: (orderId: string, itemId: number) => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId, itemId, onReviewClick }) => {
  const navigate = useNavigate();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this product I ordered!',
        text: 'I just purchased this amazing product. Check it out!',
        url: window.location.origin + '/product/' + itemId,
      }).catch(error => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log('Web Share not supported');
      // Could show a modal with share links instead
    }
  };
  
  return (
    <div className="flex flex-col gap-3 w-full md:w-auto">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate(`/order-receipt?id=${orderId}`)}
        >
          <FileText className="h-4 w-4" />
          Order Receipt
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-black"
          onClick={() => navigate(`/return-replace?orderId=${orderId}&item=${itemId}`)}
        >
          <RotateCcw className="h-4 w-4 text-gray-800" />
          Return/Replace
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onReviewClick(orderId, itemId)}
        >
          <Star className="h-4 w-4" />
          Rate & Review
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default OrderActions;
