import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, User, MapPin, Phone, Mail } from "lucide-react";

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  orderHistory?: any[];
  customerOrders?: any[];
  orderDate?: string;
  updatedDate?: string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose, orderHistory = [], customerOrders = [], orderDate, updatedDate }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="order-details-dialog-desc">
        <DialogDescription id="order-details-dialog-desc">Order details dialog content.</DialogDescription>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details - {order.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-end items-center">
            <div className="text-lg font-semibold">{order.total}</div>
          </div>
          
          <Separator />
          
          {/* Order History */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order History</h3>
            {orderHistory.length === 0 ? (
              <div className="text-sm text-gray-500">No special events for this order.</div>
            ) : (
              <ul className="text-sm list-disc pl-5">
                {orderHistory.map((h, i) => (
                  <li key={i}>
                    {h.type === 'refunded' && <span>Refunded on <b>{h.date}</b></span>}
                    {h.type === 'replaced' && <span>Replaced on <b>{h.date}</b></span>}
                    {h.type === 'copy' && <span>Created as a replacement for <b>{h.from}</b> on <b>{h.date}</b></span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <Separator />
          
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {order.customer}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="font-medium">Email:</span> {order.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span className="font-medium">Mobile:</span> {order.mobile}
              </div>
              <div className="flex items-start gap-1 md:col-span-2">
                <MapPin className="w-3 h-3 mt-0.5" />
                <div>
                  <span className="font-medium">Address:</span> {order.address}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Customer Order History */}
          <div className="space-y-3">
            <h3 className="font-semibold">Customer Order History</h3>
            {customerOrders.length === 0 ? (
              <div className="text-sm text-gray-500">No other orders for this customer.</div>
            ) : (
              <ul className="text-sm">
                {customerOrders.map((o, i) => (
                  <li key={o.id} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 border-b last:border-b-0 py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{o.id}</span>
                      {o.refunded && <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Refunded</span>}
                      {o.replaced && <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Replaced</span>}
                      {o.isCopy && <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">Copy</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 pl-6 md:pl-0">
                      <span>Order Date: <b>{o.orderDate || o.date}</b></span>
                      {o.refunded && o.refundDate && (
                        <span>Refund Date: <b>{o.refundDate}</b></span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <Separator />
          
          {/* Order Information */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Order Date:</span> {orderDate || order.date}
              </div>
              <div>
                <span className="font-medium">Updated Date:</span> {updatedDate || order.date}
              </div>
              <div>
                <span className="font-medium">Total Items:</span> {order.items}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Products */}
          <div className="space-y-3">
            <h3 className="font-semibold">Products</h3>
            <div className="space-y-2">
              {order.products && order.products.map((product: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">Qty: {product.quantity}</div>
                  </div>
                  <div className="font-medium">{product.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;