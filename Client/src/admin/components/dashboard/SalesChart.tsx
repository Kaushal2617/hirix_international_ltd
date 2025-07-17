import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const SalesChart = () => {
  const orders = useSelector((state: any) => state.orders.orders);

  // Group orders by month and sum sales
  const salesData = useMemo(() => {
    if (!orders || !orders.length) return [];
    const grouped: { [key: string]: number } = {};
    orders.forEach((order: any) => {
      if (!order.date || !order.total) return;
      const date = new Date(order.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      grouped[month] = (grouped[month] || 0) + order.total;
    });
    // Convert to array and sort by date
    return Object.entries(grouped)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [orders]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SalesChart; 