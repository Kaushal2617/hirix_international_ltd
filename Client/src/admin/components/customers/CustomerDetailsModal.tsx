import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { User, Mail, ShoppingBag, DollarSign, Calendar } from "lucide-react";

interface CustomerDetailsModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" aria-describedby="customer-details-dialog-desc">
        <DialogDescription id="customer-details-dialog-desc">Customer details dialog content.</DialogDescription>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {customer.email}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Customer Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Orders</span>
              </div>
              <div className="text-2xl font-bold">{customer.orders}</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Total Spent</span>
              </div>
              <div className="text-2xl font-bold">{customer.totalSpent}</div>
            </div>
          </div>
          
          <Separator />
          
          {/* Last Order */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last Order
            </h4>
            <p className="text-gray-600">{customer.lastOrder}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
