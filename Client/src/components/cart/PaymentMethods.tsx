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
          <img src="https://res.cloudinary.com/dqvsdncsk/image/upload/v1753434015/american-express_uujnh1.png" alt="American Express" className="h-6" />
        </div>
        <div className="bg-white p-1 rounded border border-gray-200">
          <img src="https://res.cloudinary.com/dqvsdncsk/image/upload/v1753434154/discover_bgs987.png" alt="Discover" className="h-6" />
        </div>
        <div className="bg-white p-1 rounded border border-gray-200">
          <img src="https://res.cloudinary.com/dqvsdncsk/image/upload/v1753434293/jcb_vuleqc.png" alt="JCB" className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;