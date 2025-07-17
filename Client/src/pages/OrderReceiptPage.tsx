import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CalendarDays, MapPin, CreditCard } from 'lucide-react';
import Footer from '../components/shared/Footer';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '@/store/ordersSlice';
import type { RootState } from '@/store';

const OrderReceiptPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (!orderId || !user || !token) return;
    setLoading(true);
    setError(null);
    dispatch<any>(fetchOrderById(orderId))
      .then((action: any) => {
        if (fetchOrderById.fulfilled.match(action)) {
          setOrderDetails(action.payload);
        } else {
          // Check for 403 Forbidden
          if (action.error && action.error.message && action.error.message.toLowerCase().includes('forbidden')) {
            setError('You are not authorized to view this order. Please make sure you are logged in as the correct user.');
          } else if (action.payload && typeof action.payload === 'string' && action.payload.toLowerCase().includes('not authorized')) {
            setError('You are not authorized to view this order. Please make sure you are logged in as the correct user.');
          } else {
            setError(action.payload || 'Failed to fetch order');
          }
        }
        setLoading(false);
      });
  }, [orderId, user, token, dispatch]);

  if (!orderId) {
    return <div className="container mx-auto py-16 text-center">Order ID not specified.</div>;
  }
  if (loading) {
    return <div className="container mx-auto py-16 text-center">Loading order...</div>;
  }
  if (error) {
    return <div className="container mx-auto py-16 text-center text-red-500">{error}</div>;
  }
  if (!orderDetails) {
    return <div className="container mx-auto py-16 text-center">Order not found.</div>;
  }

  const handleDownload = async () => {
    const receipt = document.getElementById('order-receipt-content');
    if (!receipt) return;
    const canvas = await html2canvas(receipt, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`OrderReceipt_${orderDetails.id}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Receipt</h1>
            <Button variant="outline" onClick={handleDownload} className="print:hidden">
              Download Receipt
            </Button>
          </div>
          <div id="order-receipt-content">
            <Card className="mb-6">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex justify-between">
                  <span>Order #{orderDetails.id}</span>
                  <span className="text-sm font-normal flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {orderDetails.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <CalendarDays className="h-4 w-4" />
                  <span>Ordered on {new Date(orderDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm">
                      <p>{orderDetails.shippingAddress.name}</p>
                      <p>{orderDetails.shippingAddress.street}</p>
                      <p>
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
                      </p>
                      <p>{orderDetails.shippingAddress.country}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="text-sm flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{orderDetails.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                {/* Order Items */}
                <h3 className="font-medium mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{orderDetails.shipping === 0 ? 'Free' : `$${orderDetails.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (included)</span>
                    <span>${orderDetails.tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    All prices include VAT
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-center text-sm text-gray-500 mt-8 print:mt-16 mb-8">
              <p>Thank you for your order!</p>
              <p>If you have any questions, please contact our customer support.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default OrderReceiptPage;
