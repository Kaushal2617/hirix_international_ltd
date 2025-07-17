import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye, Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format, parse } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrder, deleteOrder } from '@/store/ordersSlice';
import { useEffect } from 'react';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state: any) => state.orders);
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({ from: undefined, to: undefined });
  const [tempDateRange, setTempDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({ from: undefined, to: undefined });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ type: 'refund' | 'replace'; order: any } | null>(null);

  useEffect(() => {
    dispatch(fetchOrders() as any); // Fetch all orders for admin
  }, [dispatch]);

  // Helper function to parse total amount for sorting
  const parseTotal = (total: string): number => {
    if (!total) return 0;
    return parseFloat(total.replace('£', ''));
  };

  // Helper function to parse date for sorting
  const parseDate = (dateStr: string): Date => {
    return new Date(dateStr);
  };

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => {
      // Date range filter
      if (dateRange && dateRange.from && dateRange.to && order.date) {
        const orderDate = parseDate(order.date);
        if (orderDate < dateRange.from || orderDate > dateRange.to) return false;
      }
      // Search filter
      const searchMatch = searchTerm === "" || 
        (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.userId && order.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.shippingAddress?.name && order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.shippingAddress?.street && order.shippingAddress.street.toLowerCase().includes(searchTerm.toLowerCase()));
      return searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return parseDate(a.date).getTime() - parseDate(b.date).getTime();
        case "highest":
          return parseTotal(b.total) - parseTotal(a.total);
        case "lowest":
          return parseTotal(a.total) - parseTotal(b.total);
        case "newest":
        default:
          return parseDate(b.date).getTime() - parseDate(a.date).getTime();
      }
    });

  const exportToExcel = () => {
    // Create a CSV string from orders data
    let csvContent = "Order ID,Customer Name,Street,City,State,Zip,Country,Date,Items,Total\n";
    
    filteredAndSortedOrders.forEach(order => {
      csvContent += `${order._id},${order.shippingAddress?.name || order.userId},"${order.shippingAddress?.street}","${order.shippingAddress?.city}","${order.shippingAddress?.state}","${order.shippingAddress?.zip}","${order.shippingAddress?.country}",${order.date},${order.items?.length || 0},${order.total}\n`;
    });
    
    // Create a detailed CSV that includes product information
    let detailedCSV = "Order ID,Customer Name,Street,City,State,Zip,Country,Date,Total\n";
    
    filteredAndSortedOrders.forEach(order => {
      detailedCSV += `${order._id},${order.shippingAddress?.name || order.userId},"${order.shippingAddress?.street}","${order.shippingAddress?.city}","${order.shippingAddress?.state}","${order.shippingAddress?.zip}","${order.shippingAddress?.country}",${order.date},${order.total}\n`;
      detailedCSV += "Product,Quantity,Price\n";
      
      if (order.items && order.items.length) {
        order.items.forEach(product => {
          detailedCSV += `"${product.name}",${product.quantity},${product.price}\n`;
        });
      }
      
      detailedCSV += "\n"; // Add a blank line between orders
    });
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const detailedBlob = new Blob([detailedCSV], { type: "text/csv;charset=utf-8;" });
    
    // Create a download link and trigger it
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Orders data has been exported to CSV format.",
    });
  };

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setSelectedOrder(null);
    setIsOrderModalOpen(false);
  };

  // Helper to get today's date in the same format as mock data
  const getTodayString = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
  };

  // Handle refund
  const handleRefund = async (orderId: string) => {
    const order = orders.find((o: any) => o.id === orderId || o._id === orderId);
    if (!order) return;
    try {
      await dispatch(updateOrder({ id: order._id || order.id, updates: {
        refunded: true,
        refundDate: getTodayString(),
        updatedDate: getTodayString(),
      } }) as any).unwrap();
      toast({ title: 'Order Refunded', description: 'Order has been marked as refunded.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to refund order', variant: 'destructive' });
    }
  };

  // Handle replace
  const handleReplace = async (orderId: string) => {
    const order = orders.find((o: any) => o.id === orderId || o._id === orderId);
    if (!order) return;
    try {
      await dispatch(updateOrder({ id: order._id || order.id, updates: {
        replaced: true,
        replaceDate: getTodayString(),
        updatedDate: getTodayString(),
      } }) as any).unwrap();
      toast({ title: 'Order Replaced', description: 'Order has been marked as replaced.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to replace order', variant: 'destructive' });
    }
  };

  // Handle delete
  const handleDelete = async (orderId: string) => {
    const order = orders.find((o: any) => o.id === orderId || o._id === orderId);
    if (!order) return;
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await dispatch(deleteOrder(order._id || order.id) as any).unwrap();
      toast({ title: 'Order Deleted', description: 'Order has been deleted.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete order', variant: 'destructive' });
    }
  };

  // For edit, you can open a modal and dispatch updateOrder with new data as needed
  // For order details modal, pass order history and customer history
  const getOrderHistory = (order) => {
    const history = [];
    if (order.isCopy && order.originalId) {
      history.push({ type: 'copy', date: order.date, from: order.originalId, to: order.id });
    }
    if (order.refunded) {
      history.push({ type: 'refunded', date: order.refundDate });
    }
    if (order.replaced) {
      history.push({ type: 'replaced', date: order.replaceDate });
    }
    return history;
  };
  const getCustomerOrders = (customer) => orders.filter(o => o.customer === customer);

  // Debug logs for Redux state and key variables
  console.log('Orders page - orders:', orders);
  console.log('Orders page - loading:', loading);
  console.log('Orders page - error:', error);
  console.log('Orders page - filteredAndSortedOrders:', filteredAndSortedOrders);

  // Add loading/error/empty state UI before rendering the table
  if (loading) return <div className="p-8 text-center text-lg">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!orders || orders.length === 0) return <div className="p-8 text-center text-gray-500">No orders found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button variant="outline" onClick={exportToExcel}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      
      {/* Search and filter */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto bg-white rounded-lg shadow-lg border">
            <div className="bg-green-600 text-white flex items-center justify-between px-4 py-2 rounded-t-lg">
              <span className="font-semibold">Filter by date</span>
              <Filter className="w-4 h-4" />
            </div>
            <div className="p-4">
              <Calendar
                mode="range"
                selected={tempDateRange}
                onSelect={setTempDateRange}
                numberOfMonths={1}
                showOutsideDays={false}
                className="calendar-lg"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setTempDateRange({ from: undefined, to: undefined });
                    setPopoverOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  style={{ backgroundColor: '#219653', color: 'white' }}
                  onClick={() => {
                    setDateRange(tempDateRange);
                    setPopoverOpen(false);
                  }}
                  disabled={!tempDateRange || !tempDateRange.from || !tempDateRange.to}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search orders by ID or customer..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Total</option>
            <option value="lowest">Lowest Total</option>
          </select>
        </div>
      </div>
      
      {/* Orders table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedOrders.map((order, idx) => {
              console.log('Rendering order row:', order);
              return (
                <TableRow key={order.id || order._id || idx}>
                  <TableCell className="font-medium">{order._id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.shippingAddress?.name || order.userId}</div>
                      <div className="text-sm text-gray-500">{order.shippingAddress?.street}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    {order.items && Array.isArray(order.items)
                      ? order.items.map((p, pidx) => (
                          <div key={p.id || pidx}>
                            {p.name} (x{p.quantity})
                          </div>
                        ))
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {order.refunded ? (
                      <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Refunded</span>
                    ) : (
                      <Button variant="outline" size="sm" className="ml-2" onClick={() => setConfirmDialog({ type: 'refund', order })} disabled={order.refunded}>
                        Refund
                      </Button>
                    )}
                    {order.replaced ? (
                      <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Replaced</span>
                    ) : (
                      <Button variant="outline" size="sm" className="ml-2" onClick={() => setConfirmDialog({ type: 'replace', order })} disabled={order.replaced}>
                        Replace
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Results summary and pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredAndSortedOrders.length}</span> of <span className="font-medium">{orders.length}</span> orders
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-red-50">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isOrderModalOpen}
          onClose={handleCloseOrderModal}
          orderHistory={getOrderHistory(selectedOrder)}
          customerOrders={getCustomerOrders(selectedOrder.customer)}
          orderDate={selectedOrder.orderDate}
          updatedDate={selectedOrder.updatedDate}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={open => !open && setConfirmDialog(null)}>
        {confirmDialog && confirmDialog.order && (
          <DialogContent forceMount>
            <AnimatePresence>
              <motion.div
                key="confirm-dialog"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.22, type: 'spring' }}
              >
                <DialogHeader>
                  <DialogTitle>
                    {confirmDialog.type === 'refund' ? 'Confirm Refund' : 'Confirm Replacement'}
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {confirmDialog.type === 'refund' ? (
                    <span>Are you sure you want to proceed with a <b>refund</b> for order <b>{confirmDialog.order.id}</b>? This action cannot be undone.</span>
                  ) : (
                    <span>Are you sure you want to <b>replace</b> order <b>{confirmDialog.order.id}</b>? This will create a new copy order and mark the original as replaced.</span>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cancel</Button>
                  <Button className={confirmDialog.type === 'refund' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}
                    onClick={() => {
                      if (confirmDialog.type === 'refund') handleRefund(confirmDialog.order.id);
                      if (confirmDialog.type === 'replace') handleReplace(confirmDialog.order.id);
                      setConfirmDialog(null);
                    }}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </motion.div>
            </AnimatePresence>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AdminOrders;
