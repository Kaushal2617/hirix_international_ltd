import React from 'react';
import Footer from '../components/shared/Footer';
import { Separator } from '../components/ui/separator';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">About Hirix</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <div className="space-y-4">
              <p>At HirixDirect, we believe that shopping should be an enjoyable and effortless journey. Our story begins with a passionate team of retail enthusiasts who recognized the need for a modern and customer-centric approach to online shopping in the UK. We envisioned a platform where quality, affordability, and convenience converge to redefine the way you shop.</p>
              <p><b>Our mission is clear and purposeful: </b>  
              To provide an exceptional online shopping experience that exceeds your expectations at every step.</p>
            </div>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Quality</h3>
                <p>We rigorously test all our products to ensure they meet our high standards.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Affordable Luxury</h3>
                <p>Discover affordable luxury without breaking the bank. We believe that you deserve the best without compromise.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Fast & Reliable Delivery</h3>
                <p>We offer swift and reliable delivery options, ensuring that your purchases reach your doorstep in no time.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Customer-First</h3>
                <p>Our customer support team is available to assist you with any inquiries or concerns, making your shopping journey worry-free.</p>
              </div>
            </div>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="mb-6">Hirix is powered by a dedicated team of professionals passionate about home improvement and customer satisfaction.</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-medium">Dhiren Punjani</h3>
                <p className="text-gray-600">CEO & Founder</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-medium">Rikesh Punjani</h3>
                <p className="text-gray-600">Co-Founder</p>
              </div>
              {/* <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
  <img
    src="https://th.bing.com/th/id/OIP.seGAVdmjkCEpME1XYaHxRgHaFE?w=260&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    alt="Profile"
    className="w-full h-full object-cover"
  />
</div>
                <h3 className="font-medium">Mark Johnson</h3>
                <p className="text-gray-600">Head of Customer Experience</p>
              </div> */}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
