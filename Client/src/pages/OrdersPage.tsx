import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/store/ordersSlice';
import type { RootState } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, CalendarDays } from 'lucide-react';
import Footer from '../components/shared/Footer';
import OrderActions from '../components/orders/OrderActions';
import ReviewDialog from '../components/orders/ReviewDialog';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const [reviewItem, setReviewItem] = useState<{ orderId: string; itemId: number } | null>(null);

  useEffect(() => {
    // Only fetch orders if user and user.id are present
    if (!user || !user.id) return;
    dispatch(fetchOrders(user.id) as any);
  }, [user?.id, dispatch]);

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
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order: any, idx: number) => (
                <div key={order._id || order.id}>
                  <Card className="overflow-hidden bg-white shadow-xl border-0 rounded-3xl">
                    <CardHeader className="bg-gray-50 pb-4 rounded-t-3xl">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <CardTitle className="text-lg font-bold text-black">Order #{order._id || order.id}</CardTitle>
                          <CardDescription className="flex items-center mt-1 text-gray-600">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {order.date ? new Date(order.date).toLocaleDateString() : ''}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-800">
                            £{order.total?.toFixed(2) ?? '0.00'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {order.items && order.items.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 rounded-xl hover:bg-gray-100 border-b last:border-b-0 pb-4"
                          >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold text-black">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                <p className="font-medium mt-1 text-gray-800">£{item.price?.toFixed(2) ?? '0.00'}</p>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 w-full md:w-auto">
                              <OrderActions
                                orderId={order._id || order.id}
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
              orders
                .find((order: any) => (order._id || order.id) === reviewItem.orderId)?.items
                .find((item: any) => item.id === reviewItem.itemId)
            }
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;