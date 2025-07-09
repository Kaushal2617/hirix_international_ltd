
import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Navbar from '../components/navbar/Navbar';
import { useShoppingContext } from '@/contexts/ShoppingContext';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useShoppingContext();

  useEffect(() => {
    // Clear the cart when the payment is successful
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="bg-green-50 text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <CardTitle className="text-2xl">Order Confirmed</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="mb-4">Thank you for your purchase! Your order has been placed.</p>
              <p className="text-sm text-gray-500 mb-6">
                Order reference: {sessionId ? sessionId.substring(0, 8) : 'N/A'}
              </p>
              <p className="text-sm mb-6">
                A confirmation email will be sent to your email address shortly.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Link to="/orders">
                  <Button>View Orders</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;