"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, MapPin, Mail, Phone, User, Package, Plus } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { RootState } from '@/store';
import { updateAddresses, fetchProfile } from '@/store/authSlice';
import OrdersPage from './OrdersPage';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [editMode, setEditMode] = useState(false)
  const [editAddressId, setEditAddressId] = useState<number | null>(null)
  const [editUser, setEditUser] = useState(user)
  const [editAddr, setEditAddr] = useState<any>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', address: '', postcode: '', phone: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user && user.id) {
      dispatch(fetchProfile(user.id) as any);
    }
  }, [dispatch, user?.id, navigate]);

  useEffect(() => {
    setEditUser(user);
  }, [user]);

  // Save address changes
  const handleSaveAddress = async () => {
    if (!user) return;
    const updatedAddresses = user.addresses?.map((addr) => (addr.id === editAddr.id ? editAddr : addr)) || [];
    await dispatch(updateAddresses({ userId: user.id, addresses: updatedAddresses }) as any);
    setEditAddressId(null);
  }

  // Add new address
  const handleAddAddress = async () => {
    if (!user) return;
    const nextId = (user.addresses?.length ? Math.max(...user.addresses.map(a => a.id)) + 1 : 1);
    const updatedAddresses = [...(user.addresses || []), { ...newAddr, id: nextId }];
    await dispatch(updateAddresses({ userId: user.id, addresses: updatedAddresses }) as any);
    setAddDialogOpen(false);
    setNewAddr({ label: '', address: '', postcode: '', phone: '' });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200"
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!user) return <div className="flex justify-center items-center min-h-screen">No user info found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2, type: "spring" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2, type: "spring", delay: 0.5 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full filter blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600 text-lg">Manage your profile, addresses, and orders</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4 xl:col-span-3"
          >
            <Card className="bg-white/80 backdrop-blur-xl shadow-xl border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border-2 border-white/30">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                  <p className="text-pink-100 text-sm">{user.role === 'admin' ? 'Admin' : 'Premium Member'}</p>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{user.contact}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Addresses Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-xl shadow-xl border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <MapPin className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Saved Addresses</CardTitle>
                        <CardDescription className="text-gray-600">Manage your delivery addresses</CardDescription>
                      </div>
                    </div>
                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 h-10 bg-transparent"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Address
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Add Address</DialogTitle>
                          <DialogDescription>Enter your new address details below.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Label</label>
                            <Input
                              value={newAddr.label}
                              onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                              className="h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                            <Input
                              value={newAddr.address}
                              onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                              className="h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Postcode</label>
                            <Input
                              value={newAddr.postcode}
                              onChange={(e) => setNewAddr({ ...newAddr, postcode: e.target.value })}
                              className="h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                            <Input
                              value={newAddr.phone}
                              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                              className="h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>
                        </div>
                        <DialogFooter className="gap-2">
                          <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="rounded-xl">
                            Cancel
                          </Button>
                          <Button onClick={handleAddAddress} className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
                            Add Address
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses && user.addresses.length > 0 ? user.addresses.map((addr) => (
                      <motion.div
                        key={addr.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="font-semibold text-gray-900">{addr.label}</span>
                          </div>
                          <Dialog
                            open={editAddressId === addr.id}
                            onOpenChange={(open) => {
                              setEditAddressId(open ? addr.id : null)
                              setEditAddr(open ? { ...addr } : null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:bg-red-50 rounded-lg h-8 px-3"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Edit Address</DialogTitle>
                                <DialogDescription>Update your address information below.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700 mb-2 block">Label</label>
                                  <Input
                                    value={editAddr?.label || ""}
                                    onChange={(e) => setEditAddr({ ...editAddr, label: e.target.value })}
                                    className="h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                                  <Input
                                    value={editAddr?.address || ""}
                                    onChange={(e) => setEditAddr({ ...editAddr, address: e.target.value })}
                                    className="h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 mb-2 block">Postcode</label>
                                  <Input
                                    value={editAddr?.postcode || ""}
                                    onChange={(e) => setEditAddr({ ...editAddr, postcode: e.target.value })}
                                    className="h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                                  <Input
                                    value={editAddr?.phone || ""}
                                    onChange={(e) => setEditAddr({ ...editAddr, phone: e.target.value })}
                                    className="h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                                  />
                                </div>
                              </div>
                              <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setEditAddressId(null)} className="rounded-xl">
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSaveAddress}
                                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700 font-medium">{addr.address}</p>
                          <p className="text-gray-600">{addr.postcode}</p>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{addr.phone}</span>
                          </div>
                        </div>
                      </motion.div>
                    )) : <div className="text-gray-500">No addresses found.</div>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Orders Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-xl shadow-xl border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <Package className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
                        <CardDescription className="text-gray-600">Track your recent purchases</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 h-10 bg-transparent"
                      asChild
                    >
                      <a href="/orders">View All Orders</a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <OrdersPage />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
