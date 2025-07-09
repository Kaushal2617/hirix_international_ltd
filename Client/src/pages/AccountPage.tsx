import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, MapPin, Mail, Phone, User, Package } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  contact: '+44 1234 567890',
};

const mockAddresses = [
  {
    id: 1,
    label: 'Home',
    address: '123 Main Street, London, UK',
    postcode: 'E1 6AN',
    phone: '+44 1234 567890',
  },
  {
    id: 2,
    label: 'Work',
    address: '456 Office Park, London, UK',
    postcode: 'W1 2AB',
    phone: '+44 9876 543210',
  },
];

const mockOrders = [
  {
    id: 'ORD123456',
    date: '2024-06-01',
    status: 'Delivered',
    total: 129.99,
    items: [
      { name: 'Modern Sofa Set', qty: 1 },
      { name: 'LED Floor Lamp', qty: 2 },
    ],
  },
  {
    id: 'ORD123457',
    date: '2024-05-20',
    status: 'Shipped',
    total: 59.99,
    items: [
      { name: 'Dining Table Set', qty: 1 },
    ],
  },
];

const AccountPage = () => {
  const [editMode, setEditMode] = useState(false);
  const [editAddressId, setEditAddressId] = useState<number | null>(null);
  const [user, setUser] = useState(mockUser);
  const [addresses, setAddresses] = useState(mockAddresses);
  const [editUser, setEditUser] = useState(user);
  const [editAddr, setEditAddr] = useState<any>(null);

  // Save profile changes
  const handleSaveProfile = () => {
    setUser(editUser);
    setEditMode(false);
  };

  // Save address changes
  const handleSaveAddress = () => {
    setAddresses(addresses.map(addr => addr.id === editAddr.id ? editAddr : addr));
    setEditAddressId(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-pink-50 via-white to-indigo-50 overflow-hidden py-12 px-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, type: 'spring' }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-60 z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.2, type: 'spring', delay: 0.2 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-50 z-0"
      />
      <div className="w-full max-w-5xl z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar/Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="md:col-span-1"
        >
          <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0 rounded-3xl p-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-red-500" />
            </div>
            <CardTitle className="text-xl font-bold text-black mb-1">{user.name}</CardTitle>
            <CardDescription className="text-gray-600 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {user.email}</CardDescription>
            <CardDescription className="text-gray-600 mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {user.contact}</CardDescription>
            <Dialog open={editMode} onOpenChange={setEditMode}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby="account-dialog-desc" className="overflow-y-auto max-h-[90vh]">
                <DialogDescription id="account-dialog-desc">Account dialog content.</DialogDescription>
                <div className="flex flex-col gap-4 py-2">
                  <label className="text-sm font-medium">Name
                    <Input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} className="mt-1" />
                  </label>
                  <label className="text-sm font-medium">Email
                    <Input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} className="mt-1" />
                  </label>
                  <label className="text-sm font-medium">Contact
                    <Input value={editUser.contact} onChange={e => setEditUser({ ...editUser, contact: e.target.value })} className="mt-1" />
                  </label>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  <Button onClick={handleSaveProfile} className="bg-red-500 text-white">Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </motion.div>
        {/* Main Content */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Addresses */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0 rounded-3xl p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg font-bold text-black flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /> Saved Addresses</CardTitle>
                <Button variant="outline" size="sm">Add Address</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-gray-100 rounded-xl p-4 flex flex-col gap-1">
                    <div className="font-semibold text-black flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {addr.label}</div>
                    <div className="text-gray-700">{addr.address}</div>
                    <div className="text-gray-500 text-sm">{addr.postcode}</div>
                    <div className="text-gray-500 text-sm flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" /> {addr.phone}</div>
                    <Dialog open={editAddressId === addr.id} onOpenChange={open => {
                      setEditAddressId(open ? addr.id : null);
                      setEditAddr(open ? { ...addr } : null);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="mt-2 text-red-500">Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Edit Address</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-2">
                          <label className="text-sm font-medium">Label
                            <Input value={editAddr?.label || ''} onChange={e => setEditAddr({ ...editAddr, label: e.target.value })} className="mt-1" />
                          </label>
                          <label className="text-sm font-medium">Address
                            <Input value={editAddr?.address || ''} onChange={e => setEditAddr({ ...editAddr, address: e.target.value })} className="mt-1" />
                          </label>
                          <label className="text-sm font-medium">Postcode
                            <Input value={editAddr?.postcode || ''} onChange={e => setEditAddr({ ...editAddr, postcode: e.target.value })} className="mt-1" />
                          </label>
                          <label className="text-sm font-medium">Phone
                            <Input value={editAddr?.phone || ''} onChange={e => setEditAddr({ ...editAddr, phone: e.target.value })} className="mt-1" />
                          </label>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditAddressId(null)}>Cancel</Button>
                          <Button onClick={handleSaveAddress} className="bg-red-500 text-white">Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
          {/* Orders */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl border-0 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg font-bold text-black flex items-center gap-2"><Package className="w-5 h-5 text-red-500" /> Recent Orders</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <a href="/orders">View All</a>
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {mockOrders.map(order => (
                  <div key={order.id} className="bg-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-black">Order #{order.id}</div>
                      <span className={`text-xs font-bold rounded-full px-3 py-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                    </div>
                    <div className="text-gray-700 text-sm mb-1">Date: {order.date}</div>
                    <div className="text-gray-700 text-sm mb-1">Total: £{order.total.toFixed(2)}</div>
                    <div className="text-gray-500 text-xs">Items: {order.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 