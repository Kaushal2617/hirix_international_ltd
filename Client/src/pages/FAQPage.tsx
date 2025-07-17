import React from 'react';
import Footer from '../components/shared/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What are your shipping times?</AccordionTrigger>
              <AccordionContent>
                Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for faster delivery.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                We offer a 30-day return policy for most items. Products must be in original condition with tags attached.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
              <AccordionContent>
              Currently, we only offer shipping within the United Kingdom. We do not support international deliveries at this time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How can I track my order?</AccordionTrigger>
              <AccordionContent>
                Once your order ships, you'll receive a tracking number via email. You can also track your order on our website using your order number.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;