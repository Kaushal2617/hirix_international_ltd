import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const EmptyCartMessage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <ShoppingCart className="h-20 w-20 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/all-products">
          <Button className="px-8">Start Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
