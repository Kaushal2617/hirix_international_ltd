import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, CalendarDays } from 'lucide-react';
import Footer from '../components/shared/Footer';
import OrderActions from '../components/orders/OrderActions';
import ReviewDialog from '../components/orders/ReviewDialog';
import { motion } from 'framer-motion';

// This is a mock data structure that will be replaced with real data from the backend later
const mockOrders = [
  {
    id: 'ORD-1234',
    date: '2025-04-02',
    status: 'Delivered',
    total: 249.99,
    items: [
      { id: 1, name: 'Modern Coffee Table', price: 149.99, quantity: 1, image: '/placeholder.svg' },
      { id: 2, name: 'Decorative Pillow', price: 29.99, quantity: 2, image: '/placeholder.svg' },
      { id: 3, name: 'Table Lamp', price: 39.99, quantity: 1, image: '/placeholder.svg' },
    ],
  },
  {
    id: 'ORD-1235',
    date: '2025-03-28',
    status: 'Processing',
    total: 199.99,
    items: [
      { id: 4, name: 'Bookshelf', price: 199.99, quantity: 1, image: '/placeholder.svg' },
    ],
  },
  {
    id: 'ORD-1236',
    date: '2025-03-15',
    status: 'Shipped',
    total: 349.98,
    items: [
      { id: 5, name: 'Dining Chair (Set of 2)', price: 174.99, quantity: 1, image: '/placeholder.svg' },
      { id: 6, name: 'Area Rug', price: 124.99, quantity: 1, image: '/placeholder.svg' },
      { id: 7, name: 'Wall Clock', price: 49.99, quantity: 1, image: '/placeholder.svg' },
    ],
  }
];

const OrdersPage = () => {
  const [reviewItem, setReviewItem] = useState<{ orderId: string; itemId: number } | null>(null);

  const handleOpenReview = (orderId: string, itemId: number) => {
    setReviewItem({ orderId, itemId });
  };

  const handleCloseReview = () => {
    setReviewItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-white">
        <div className="container mx-auto px-4 py-12 flex-grow z-10">
          <h1 className="text-3xl font-extrabold text-black tracking-tight mb-8">My Orders</h1>
          {mockOrders.length > 0 ? (
            <div className="space-y-8">
              {mockOrders.map((order, idx) => (
                <div key={order.id}>
                  <Card className="overflow-hidden bg-white shadow-xl border-0 rounded-3xl">
                    <CardHeader className="bg-gray-50 pb-4 rounded-t-3xl">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <CardTitle className="text-lg font-bold text-black">Order #{order.id}</CardTitle>
                          <CardDescription className="flex items-center mt-1 text-gray-600">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {new Date(order.date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-800">
                            £{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 rounded-xl hover:bg-gray-100 border-b last:border-b-0 pb-4"
                          >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold text-black">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                <p className="font-medium mt-1 text-gray-800">£{item.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 w-full md:w-auto">
                              <OrderActions
                                orderId={order.id}
                                itemId={item.id}
                                onReviewClick={handleOpenReview}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
              <p className="mt-1 text-gray-500">When you place an order, it will appear here.</p>
            </div>
          )}
        </div>
        {reviewItem && (
          <ReviewDialog
            open={!!reviewItem}
            onClose={handleCloseReview}
            orderItem={
              mockOrders
                .find(order => order.id === reviewItem.orderId)?.items
                .find(item => item.id === reviewItem.itemId)
            }
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;