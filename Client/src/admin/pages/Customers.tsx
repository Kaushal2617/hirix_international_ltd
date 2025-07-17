import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Mail, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CustomerDetailsModal from "../components/customers/CustomerDetailsModal";
import EmailCustomerModal from "../components/customers/EmailCustomerModal";
import { Tabs, Tab } from "@/components/ui/tabs";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '@/store/usersSlice';
import { useEffect } from 'react';

const AdminCustomers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state: any) => state.users);
  const [activeTab, setActiveTab] = useState<'purchasing' | 'registered'>('purchasing');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailCustomer, setEmailCustomer] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, [dispatch]);

  // Example: users with orders > 0 are purchasing customers, others are registered only
  const purchasingCustomers = users.filter((user: any) => user.orders && user.orders > 0);
  const registeredOnlyCustomers = users.filter((user: any) => !user.orders || user.orders === 0);

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleEmailCustomer = (customer: any) => {
    setEmailCustomer(customer);
    setIsEmailModalOpen(true);
  };

  const handleCloseCustomerModal = () => {
    setSelectedCustomer(null);
    setIsCustomerModalOpen(false);
  };

  const handleCloseEmailModal = () => {
    setEmailCustomer(null);
    setIsEmailModalOpen(false);
  };

  const exportToExcel = () => {
    let csvContent = "Customer Name,Email,Orders,Total Spent,Last Order\n";
    const dataToExport = activeTab === 'purchasing' ? purchasingCustomers : registeredOnlyCustomers;
    dataToExport.forEach(customer => {
      csvContent += `${customer.name},${customer.email},${customer.orders},${customer.totalSpent},${customer.lastOrder}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", activeTab === 'purchasing' ? "purchasing_customers_export.csv" : "registered_only_customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Successful",
      description: activeTab === 'purchasing' ? "Purchasing customers data has been exported to CSV format." : "Registered only customers data has been exported to CSV format.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button variant="outline" onClick={exportToExcel}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      <div className="flex gap-4 border-b mb-4">
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'purchasing' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}
          onClick={() => setActiveTab('purchasing')}
        >
          Purchasing Customers
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'registered' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}
          onClick={() => setActiveTab('registered')}
        >
          Registered Only
        </button>
      </div>
      {activeTab === 'purchasing' && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchasingCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewCustomer(customer)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEmailCustomer(customer)}>
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {activeTab === 'registered' && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registeredOnlyCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          isOpen={isCustomerModalOpen}
          onClose={handleCloseCustomerModal}
        />
      )}
      {/* Email Customer Modal */}
      {emailCustomer && (
        <EmailCustomerModal
          customer={emailCustomer}
          isOpen={isEmailModalOpen}
          onClose={handleCloseEmailModal}
        />
      )}
    </div>
  );
};

export default AdminCustomers;