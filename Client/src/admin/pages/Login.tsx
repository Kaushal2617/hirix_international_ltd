import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from 'react-redux';
import { login as loginThunk } from '@/store/authSlice';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const resultAction = await dispatch(loginThunk(values));
      // @ts-ignore
      if (loginThunk.fulfilled.match(resultAction)) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });
        navigate("/admin");
      } else {
        // @ts-ignore
        const errorMsg = resultAction.payload || 'Invalid email or password';
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: errorMsg,
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: err.message || "Invalid email or password",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-indigo-50 overflow-hidden">
      {/* Animated Blurred Gradient Circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, type: 'spring' }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-60 z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.2, type: 'spring', delay: 0.2 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-50 z-0"
      />
      <div className="w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border-0 rounded-3xl p-2">
            <CardHeader className="space-y-1 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
                className="mb-2"
              >
                <Lock className="w-14 h-14 text-red-500 drop-shadow-lg animate-bounce" />
              </motion.div>
              <CardTitle className="text-3xl text-center font-extrabold text-black">Admin Login</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@example.com" {...field} className="bg-white/80 focus:bg-white/100 transition" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} className="bg-white/80 focus:bg-white/100 transition" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      className="w-full py-3 text-lg bg-red-500 text-white font-bold shadow-lg rounded-full hover:bg-black hover:text-white transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span>Logging in...</span>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-5 w-5" /> Sign In
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <p className="text-sm text-gray-500 text-center">
                For demo: <span className="font-mono text-black">admin@example.com / admin123</span>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;