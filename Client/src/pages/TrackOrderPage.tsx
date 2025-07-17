
import React from 'react';
import Footer from '../components/shared/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';

const TrackOrderPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Order not found",
      description: "Please check your order number and email address.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
     
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">Order Number</label>
              <Input 
                id="orderNumber" 
                required 
                placeholder="Enter your order number (e.g., HIR123456)"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
              <Input 
                id="email" 
                type="email" 
                required 
                placeholder="Enter the email used for the order"
              />
            </div>
            <Button type="submit">Track Order</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;