import React from 'react';

const PaymentMethods: React.FC = () => {
  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-2">We Accept</h3>
      <div className="flex space-x-2">
        <div className="bg-white p-1 rounded border border-gray-200">
          <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6" />
        </div>
        <div className="bg-white p-1 rounded border border-gray-200">
          <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-6" />
        </div>
        <div className="bg-white p-1 rounded border border-gray-200">
          <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-6" />
        </div>
        <div className="bg-white p-1 rounded border border-gray-200">
          <img src="https://cdn-icons-png.flaticon.com/512/5977/5977576.png" alt="Apple Pay" className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;