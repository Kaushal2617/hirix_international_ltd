import React from 'react';
import Footer from '../components/shared/Footer';
import { Separator } from '../components/ui/separator';

const  PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-3 py-8">
        <h1 className="text-3xl font-bold mb-8  ">Privacy Policy</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <p className="list-disc pl-6 space-y-2">This Privacy Policy is an integral part of the User Terms of Use Agreement and should be read in conjunction with the stated Terms and Conditions. The purpose of this Privacy Policy is to explain how HirixDirect (referred to as 'HirixDirect,' 'we,' or 'us') collects, uses, and protects your personal information when you visit and/or use the HirixDirect website and other products and services (referred to as 'HirixDirect Products and Services'). Please read this policy carefully to understand how your personal information will be treated as you avail yourself of the services provided by HirixDirect.</p>
            <div className="space-y-4">
              <br/>

              <Separator />

              
              <h2 className="text-2xl font-semibold mb-4">Use and Sharing of Information</h2>
              <p className="list-disc pl-6 space-y-2">
              At no time will we sell your personally identifiable data without your permission, unless stated otherwise in this Privacy Policy. The information we receive about you or from you may be used by us or shared with our corporate affiliates, dealers, agents, vendors, and other third parties to process your requests, comply with any laws, regulations, audits, or court orders, improve our website and the products or services we offer, conduct research, better understand our customers' needs, develop new offerings, and inform you about new products and services that may interest you (either from us or our business associates).
              </p>
                
              <p className="list-disc pl-6 space-y-2">We may also combine the information you provide with information about you that is available to us internally or from other sources in order to serve you better.</p>

              <p className="list-disc pl-6 space-y-2">We do not share, sell, trade, or rent your personal information to third parties for unknown reasons.</p>
            </div>
          </section>
          
          
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <div className="space-y-4">
              <p className="list-disc pl-6 space-y-2">From time to time, we may place "cookies" on your personal computer. "Cookies" are small identifiers sent from a web server and stored on your computer's hard drive, helping us recognize you if you visit our website again. Additionally, our site uses cookies to track how you found our site. To protect your privacy, we do not use cookies to store or transmit any personal information about you on the Internet. You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. Please note that if you choose to decline cookies, certain features of the site may not function properly or at all as a result.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Links</h2>
            <div className="space-y-4">
              <p className="list-disc pl-6 space-y-2">Our website may contain links to other sites. These other sites may collect information about your visit to our website. Please note that our Privacy Policy does not apply to the practices of these sites that we do not own or control, nor does it apply to individuals we do not employ. Therefore, we are not responsible for the privacy practices or the accuracy or integrity of the content included on such other sites. We encourage you to read the individual privacy statements of these websites.</p>
            </div>
          </section>

          <section>
          <h2 className="text-2xl font-semibold mb-4">Security</h2>
          <p className="list-disc pl-6 space-y-2">We prioritize your privacy by implementing known security standards and procedures and complying with applicable privacy laws. Our websites employ industry-approved physical, electronic, and procedural safeguards to protect your information throughout its lifecycle in our infrastructure.</p>

          <p className="list-disc pl-6 space-y-2">Sensitive data is hashed or encrypted when stored in our infrastructure, and it is decrypted, processed, and immediately re-encrypted or discarded when no longer needed. We host web services in audited data centers with restricted access to the data processing servers. Controlled access, recorded and live-monitored video feeds, 24/7 staffed security, and biometrics in these data centers ensure secure hosting.</p>
          </section>

          <Separator />

          <section>
          <h2 className="text-2xl font-semibold mb-4">Changes to this Privacy Policy</h2>
          <p className="list-disc pl-6 space-y-2">Our privacy policy was last updated on August 14th, 2023. We may make changes to this Privacy Policy from time to time, and any updates will be posted on our website.
          </p>
          </section>

          <section>
          <h2 className="text-2xl font-semibold mb-4">Questions</h2>
          <p className="list-disc pl-6 space-y-2">If you have any questions about our Privacy Policy, please email us at <b>support@hirixdirect.co.uk.</b>
          </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
