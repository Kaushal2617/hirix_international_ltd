
import React from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/shared/Footer';
import { Separator } from '../components/ui/separator';

const  BulkOrders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow container mx-auto px-3 py-8">
        <h1 className="text-3xl font-bold mb-8  ">Bulk Order Discounts</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <p >At HirixDirect, we value all our customers, whether you're shopping for personal use or representing a business or organization. To show our appreciation and make your shopping experience even more rewarding, we offer exclusive Bulk Order Discounts for those looking to purchase in larger quantities.</p>
            <div className="space-y-4">
              <br/>
              <h2 className="text-2xl font-semibold mb-4 ">Why Choose Bulk Orders with Us?</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><b>Cost Savings:</b> Buying in bulk often means significant cost savings per unit, allowing you to maximize your budget.</li>
                <li><b>Convenience:</b> Streamline your purchasing process by ordering multiple items at once, reducing the need for frequent reorders.</li>
                <li><b>Customization:</b> Some bulk orders may be eligible for customization, allowing you to tailor products to your specific needs.</li>
                <li><b>Efficiency:</b> Save time and effort by stocking up on essentials for your business or organization, reducing the need for frequent shopping trips.</li>
                <li><b>Dedicated Support:</b> Our dedicated customer support team is ready to assist you with your bulk order inquiries, ensuring a smooth and hassle-free process.</li>
              </ul>
              <p>Free shipping on orders over £75!</p>
            </div>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Who Can Benefit from Bulk Orders?</h2>
            <div className="space-y-4">
              <p>Our Bulk Order Discounts are designed to cater to a wide range of customers, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><b>Businesses:</b> Whether you're a small startup or a large corporation, purchasing in bulk can help you reduce operational costs and increase profit margins.</li>
                <li><b>Nonprofits:</b> Nonprofit organizations can benefit from bulk orders to efficiently source the materials and supplies needed for their initiatives and events.</li>
                <li><b>Educational Institutions:</b> Schools, colleges, and universities can take advantage of bulk orders to procure educational materials, classroom supplies, and more.</li>
                <li><b>Retailers:</b> Retailers looking to stock up on inventory can benefit from bulk order discounts to increase their product selection and profitability.</li>
                <li><b>Event Planners:</b> Planning an event? Bulk orders can simplify the process of acquiring decorations, party favors, and other event essentials.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How to Request a Bulk Order</h2>
            <div className="space-y-4">
              <p>Getting started with a bulk order is easy:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li> Browse our product catalog to find the items you want to purchase in bulk.</li>
                <li> Contact our customer support team via support@hirixdirect.co.uk to discuss your bulk order requirements.</li>
                <li> Provide details about the products, quantities, and any customization options you need.</li>
                <li> Our team will work closely with you to provide a competitive quote and assist you throughout the order process.</li>
              </ul>
            </div>
          </section>

          <section>
          <h2 className="text-2xl font-semibold mb-4">Customization Options</h2>
          <p>Depending on the products and quantities you're ordering, you may have the option to customize certain aspects, such as branding, packaging, or product features. Our team will guide you through the customization possibilities to ensure your bulk order meets your specific needs.</p>
          </section>

          <Separator />

          <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>If you have any questions or would like to discuss a bulk order, please reach out to our dedicated customer support team at <b>support@hirixdirect.co.uk.</b> We're here to assist you in making the most of our Bulk Order Discounts and finding the perfect solution for your needs.
          </p>
          <br/>
          <p>Thank you for considering HirixDirect for your bulk order needs. We look forward to serving you and helping you save on high-quality products with our exclusive discounts.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BulkOrders;
