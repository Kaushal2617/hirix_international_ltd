import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return <Badge variant="default" style={{ backgroundColor: '#10B981', color: 'white' }}>{status}</Badge>;
    case 'Processing':
      return <Badge variant="default" style={{ backgroundColor: '#F59E0B', color: 'white' }}>{status}</Badge>;
    case 'Shipped':
      return <Badge variant="default" style={{ backgroundColor: '#3B82F6', color: 'white' }}>{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const RecentOrdersTable = () => {
  const orders = useSelector((state: any) => state.orders.orders);
  // Sort by date descending and take the 5 most recent
  const recentOrders = (orders || [])
    .slice()
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order: any) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">{order._id}</TableCell>
              <TableCell>{order.shippingAddress?.name || order.userId}</TableCell>
              <TableCell>{order.date ? new Date(order.date).toLocaleDateString() : ''}</TableCell>
              <TableCell className="text-right">${order.total?.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default RecentOrdersTable; 