import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PromoCodeSectionProps {
  subtotal: number;
  applyDiscount: (amount: number) => void;
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({ 
  subtotal, 
  applyDiscount 
}) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      const newDiscount = subtotal * 0.1;
      applyDiscount(newDiscount);
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order."
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code.",
        variant: "destructive"
      });
    }
    setPromoCode('');
  };

  return (
    <div className="mt-6">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={applyPromoCode}>Apply</Button>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Use code <span className="font-bold">SAVE10</span> for 10% off your order
      </div>
    </div>
  );
};

export default PromoCodeSection;