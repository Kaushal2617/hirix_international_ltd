import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const CategoryChart = () => {
  const products = useSelector((state: any) => state.products.products);

  const categoryData = useMemo(() => {
    if (!products || !products.length) return [];
    return products.reduce((acc: any[], product: any) => {
      const category = product.category || 'Uncategorized';
      const existingCategory = acc.find(item => item.name === category);
      if (existingCategory) {
        existingCategory.value += 1;
      } else {
        acc.push({ name: category, value: 1 });
      }
      return acc;
    }, []);
  }, [products]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {categoryData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CategoryChart; 