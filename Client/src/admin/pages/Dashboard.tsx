import React from 'react';
import { ShoppingBag, Users, PoundSterling, Package } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { allProducts } from '@/data/products';
import { motion } from 'framer-motion';
import SalesChart from '../components/dashboard/SalesChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';

// Mock data for now, will be replaced with API calls
const totalProducts = allProducts.length;
const totalOrders = 245; // Mock data
const totalCustomers = 120; // Mock data
const totalRevenue = 54230; // Mock data

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`£${(totalRevenue / 1000).toFixed(1)}k`}
          icon={<PoundSterling className="h-5 w-5 text-white" />}
          linkTo="/admin/revenue"
          color="#10B981"
        />
        <StatCard
          title="Total Orders"
          value={`+${totalOrders}`}
          icon={<ShoppingBag className="h-5 w-5 text-white" />}
          linkTo="/admin/orders"
          color="#3B82F6"
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={<Package className="h-5 w-5 text-white" />}
          linkTo="/admin/products"
          color="#F59E0B"
        />
        <StatCard
          title="Total Customers"
          value={`+${totalCustomers}`}
          icon={<Users className="h-5 w-5 text-white" />}
          linkTo="/admin/customers"
          color="#EF4444"
        />
      </div>

      {/* Charts and Recent Orders will be added here */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
          <SalesChart />
        </div>

        {/* Category Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Products by Category</h2>
          <CategoryChart />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <RecentOrdersTable />
      </div>
    </motion.div>
  );
};

export default Dashboard;