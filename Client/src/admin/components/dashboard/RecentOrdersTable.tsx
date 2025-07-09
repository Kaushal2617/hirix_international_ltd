import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const recentOrders = [
  { id: '#ORD-7895', customer: 'John Smith', date: '12 May 2025', amount: '£345.00' },
  { id: '#ORD-7894', customer: 'Sarah Johnson', date: '11 May 2025', amount: '£189.00' },
  { id: '#ORD-7893', customer: 'Michael Brown', date: '10 May 2025', amount: '£278.50' },
  { id: '#ORD-7892', customer: 'Emma Wilson', date: '10 May 2025', amount: '£124.99' },
  { id: '#ORD-7891', customer: 'David Garcia', date: '09 May 2025', amount: '£432.25' },
];

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
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell className="text-right">{order.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default RecentOrdersTable; 