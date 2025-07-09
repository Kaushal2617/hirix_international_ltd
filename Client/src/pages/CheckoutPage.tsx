import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, CreditCard, AlertCircle } from "lucide-react";
import Navbar from '../components/navbar/Navbar';
import { useShoppingContext } from '@/contexts/ShoppingContext';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  sameAddress: z.boolean().default(true),
  notes: z.string().optional(),
  saveInfo: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, discount } = useShoppingContext();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate order summary values
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 75 ? 0 : 4.99;
  const total = subtotal + shippingCost - discount;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      sameAddress: true,
      notes: "",
      saveInfo: false
    },
  });

  const handleCheckout = async (values: FormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before proceeding to checkout.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      setTimeout(() => {
        // Mock successful payment - in real implementation this would integrate with Stripe
        // Here we're just simulating a delay and redirecting to success page
        const mockSessionId = `mock_${Math.random().toString(36).substring(2, 10)}`;
        navigate(`/payment-success?session_id=${mockSessionId}`);
      }, 1500);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-20 w-20 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Add items to your cart before proceeding to checkout.</p>
            <Button onClick={() => navigate('/all-products')} className="px-8">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 flex items-center">
          <CreditCard className="inline mr-2" size={24} />
          Checkout
        </h1>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Customer Information */}
          <div className="md:col-span-7">
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-xl">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleCheckout)} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Sean" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Last Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Copper" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Sean.Copper@example.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="+44 999 999 9999" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Unit 2, 390 Victoria Rd E" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Leicester" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="county"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>County</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Leicestershire" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="postalCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Postal Code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="LE5 0LG" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="country"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Country</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="United Kingdom" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="sameAddress"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Shipping address same as billing address
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Order Notes (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Special instructions for delivery"
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="saveInfo"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Save this information for next time
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-start space-x-3">
                                            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                            <p className="text-sm text-amber-800">
                                                This is a demo checkout. In a real implementation, you would be redirected to Stripe's secure checkout page.
                                            </p>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-red-500 hover:bg-red-600"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? "Processing..." : "Place Order"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-5">
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-xl flex items-center">
                  <ShoppingBag className="mr-2" size={20} />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded bg-gray-100 mr-3 overflow-hidden">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              £{(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pricing Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shippingCost > 0 ? `£${shippingCost.toFixed(2)}` : 'Free'}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-£{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2"></div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">All prices include VAT</p>
                  </div>

                  {/* Payment Methods */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium mb-2">We Accept</h3>
                    <div className="flex space-x-2">
                      <div className="bg-white p-1 rounded border border-gray-200">
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6" />
                      </div>
                      <div className="bg-white p-1 rounded border border-gray-200">
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-6" />
                      </div>
                      <div className="bg-white p-1 rounded border border-gray-200">
                        <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-6" />
                      </div>
            {/* Removed Apple pay  */}
                      {/* <div className="bg-white p-1 rounded border border-gray-200">
                        <img src="https://cdn-icons-png.flaticon.com/512/5977/5977576.png" alt="Apple Pay" className="h-6" />
                      </div> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;