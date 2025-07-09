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

const AdminOrders = () => {
  // Mock orders data - will be replaced with API calls when connecting to backend
  const orders = [
    { 
      id: "#ORD-7895", 
      customer: "John Smith", 
      email: "john.smith@example.com",
      mobile: "+1 555-123-4567",
      address: "123 Main St, New York, NY 10001",
      date: "12 May 2025", 
      orderDate: "12 May 2025",
      updatedDate: "12 May 2025",
      items: 3,
      total: "£345.00",
      products: [
        { name: "Modern Coffee Table", quantity: 1, price: "£149.99" },
        { name: "Decorative Pillow", quantity: 2, price: "£29.99" },
      ],
      refunded: false,
      replaced: false,
      isCopy: false,
      history: [],
    },
    { 
      id: "#ORD-7894", 
      customer: "Sarah Johnson", 
      email: "sarah.j@example.com",
      mobile: "+1 555-234-5678",
      address: "456 Park Ave, Boston, MA 02108",
      date: "11 May 2025", 
      orderDate: "11 May 2025",
      updatedDate: "11 May 2025",
      items: 2,
      total: "£189.00",
      products: [
        { name: "Bookshelf", quantity: 1, price: "£189.00" },
      ],
      refunded: false,
      replaced: false,
      isCopy: false,
      history: [],
    },
    { 
      id: "#ORD-7893", 
      customer: "Michael Brown", 
      email: "m.brown@example.com",
      mobile: "+1 555-345-6789",
      address: "789 Oak St, Chicago, IL 60601",
      date: "10 May 2025", 
      orderDate: "10 May 2025",
      updatedDate: "10 May 2025",
      items: 5,
      total: "£278.50",
      products: [
        { name: "Dining Chair", quantity: 2, price: "£87.50" },
        { name: "Area Rug", quantity: 1, price: "£124.99" },
        { name: "Wall Clock", quantity: 2, price: "£39.75" },
      ],
      refunded: false,
      replaced: false,
      isCopy: false,
      history: [],
    },
    { 
      id: "#ORD-7892", 
      customer: "Emma Wilson", 
      email: "emma.wilson@example.com",
      mobile: "+1 555-456-7890",
      address: "101 Pine St, Seattle, WA 98101",
      date: "10 May 2025", 
      orderDate: "10 May 2025",
      updatedDate: "10 May 2025",
      items: 1,
      total: "£124.99",
      products: [
        { name: "Table Lamp", quantity: 1, price: "£124.99" },
      ],
      refunded: false,
      replaced: false,
      isCopy: false,
      history: [],
    },
    { 
      id: "#ORD-7891", 
      customer: "David Garcia", 
      email: "d.garcia@example.com",
      mobile: "+1 555-567-8901",
      address: "202 Maple Ave, Austin, TX 78701",
      date: "09 May 2025", 
      orderDate: "09 May 2025",
      updatedDate: "09 May 2025",
      items: 4,
      total: "£432.25",
      products: [
        { name: "Sofa", quantity: 1, price: "£349.99" },
        { name: "Coffee Table", quantity: 1, price: "£82.26" },
      ],
      refunded: false,
      replaced: false,
      isCopy: false,
      history: [],
    },
    { 
      id: "#ORD-7890", 
      customer: "Lisa Chen", 
      email: "lisa.chen@example.com",
      mobile: "+1 555-678-9012",
      address: "303 Cedar Blvd, San Francisco, CA 94107",
      date: "08 May 2025", 
      orderDate: "08 May 2025",
      updatedDate: "08 May 2025",
      items: 2,
      total: "£187.50",
      products: [
        { name: "Nightstand", quantity: 2, price: "£93.75" },
      ],
      refunded: false,
      replaced: false,
      isCopy: false,
      history: [],
    },
    { 
      id: "#ORD-7889", 
      customer: "Robert Wilson", 
      email: "r.wilson@example.com",
      mobile: "+1 555-789-0123",
      address: "404 Birch St, Miami, FL 33101",
      date: "07 May 2025", 
      orderDate: "07 May 2025",
      updatedDate: "07 May 2025",
      items: 3,
      total: "£245.00",
      products: [
        { name: "Floor Lamp", quantity: 1, price: "£89.99" },
        { name: "Throw Blanket", quantity: 2, price: "£77.50" },
      ],
      refunded: false,
      replaced: false,
      isCopy: false,
      history: [],
    },
  ];

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({ from: undefined, to: undefined });
  const [tempDateRange, setTempDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({ from: undefined, to: undefined });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [ordersState, setOrdersState] = useState(orders);
  const [confirmDialog, setConfirmDialog] = useState<{ type: 'refund' | 'replace'; order: any } | null>(null);

  // Helper function to parse total amount for sorting
  const parseTotal = (total: string): number => {
    return parseFloat(total.replace('£', ''));
  };

  // Helper function to parse date for sorting
  const parseDate = (dateStr: string): Date => {
    return new Date(dateStr);
  };

  // Filter and sort orders
  const filteredAndSortedOrders = ordersState
    .filter(order => {
      // Date range filter
      if (dateRange && dateRange.from && dateRange.to) {
        const orderDate = parse(order.date, 'dd MMM yyyy', new Date());
        if (orderDate < dateRange.from || orderDate > dateRange.to) return false;
      }
      // Search filter
      const searchMatch = searchTerm === "" || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase());
      
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
    let csvContent = "Order ID,Customer Name,Email,Mobile,Address,Date,Items,Total\n";
    
    filteredAndSortedOrders.forEach(order => {
      csvContent += `${order.id},${order.customer},"${order.email}","${order.mobile}","${order.address}",${order.date},${order.items},${order.total}\n`;
    });
    
    // Create a detailed CSV that includes product information
    let detailedCSV = "Order ID,Customer Name,Email,Mobile,Address,Date,Total\n";
    
    filteredAndSortedOrders.forEach(order => {
      detailedCSV += `${order.id},${order.customer},"${order.email}","${order.mobile}","${order.address}",${order.date},${order.total}\n`;
      detailedCSV += "Product,Quantity,Price\n";
      
      if (order.products && order.products.length) {
        order.products.forEach(product => {
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
  const handleRefund = (orderId: string) => {
    setOrdersState(prev => prev.map(order =>
      order.id === orderId ? { ...order, refunded: true, refundDate: getTodayString(), updatedDate: getTodayString() } : order
    ));
  };

  // Handle replace
  const handleReplace = (orderId: string) => {
    const original = ordersState.find(order => order.id === orderId);
    if (!original) return;
    const todayStr = getTodayString();
    // Mark original as replaced
    setOrdersState(prev => prev.map(order =>
      order.id === orderId ? { ...order, replaced: true, replaceDate: todayStr, updatedDate: todayStr } : order
    ));
    // Add new copy order with '-' instead of '/'
    const copyId = `${original.id}-copy`;
    setOrdersState(prev => [
      ...prev,
      { ...original, id: copyId, replaced: false, refunded: false, isCopy: true, date: todayStr, orderDate: todayStr, updatedDate: todayStr, originalId: original.id, history: [
        ...(original.history || []),
        { type: 'replaced', date: todayStr, from: original.id, to: copyId }
      ] }
    ]);
  };

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
  const getCustomerOrders = (customer) => ordersState.filter(o => o.customer === customer);

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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </div>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.total}</TableCell>
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
            ))}
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
