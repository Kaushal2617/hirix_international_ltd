import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  subtotal, 
  shippingCost, 
  discount, 
  total 
}) => {
  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center">
          <ShoppingBag className="mr-2" size={20} />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{shippingCost > 0 ? `£${shippingCost.toFixed(2)}` : 'Free'}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-£{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 mt-2"></div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">All prices include VAT</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/checkout" className="w-full">
          <Button className="w-full bg-red-500 hover:bg-red-600">
            Proceed to Checkout
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;