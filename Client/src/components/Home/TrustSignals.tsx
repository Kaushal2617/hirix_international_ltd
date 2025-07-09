import React from "react";
import { motion } from "framer-motion";
import { Shield, Truck, CreditCard, RefreshCw } from "lucide-react";

const TrustSignals = () => {
  const signals = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Shopping",
      description: "Your data is protected with SSL encryption"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Delivery",
      description: "On orders over £50"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Secure Payment",
      description: "Multiple payment methods available"
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Easy Returns",
      description: "30-day return policy"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {signals.map((signal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
                {signal.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{signal.title}</h3>
              <p className="text-sm text-gray-600">{signal.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
