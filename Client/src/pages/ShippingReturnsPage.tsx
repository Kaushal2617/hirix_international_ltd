import React from 'react';
import Footer from '../components/shared/Footer';
import { Separator } from '../components/ui/separator';

const ShippingReturnsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shipping & Returns</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <p>We offer several shipping options to meet your needs:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard Shipping (3-5 business days): Free (On Above £75 Orders)</li>
                {/* <li>Express Shipping (2-3 business days): £12.99</li> */}
                <li>Next Day Delivery (where available): £6.99</li>
              </ul>
              <p>Free shipping on orders over £75!</p>
            </div>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Returns Policy</h2>
            <div className="space-y-4">
              <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days.</p>
              <h3 className="text-lg font-medium">Return Requirements:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items must be unused and in original condition</li>
                <li>All tags and packaging must be intact</li>
                <li>Proof of purchase is required</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingReturnsPage;
