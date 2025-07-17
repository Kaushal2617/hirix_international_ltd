import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // This would be connected to the backend later 
    toast({
      title: "Reset link sent",
      description: "If an account exists with this email, a password reset link has been sent.",
    });
    form.reset();
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-50 overflow-hidden">
      {/* Animated Blurred Gradient Circles */}
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
      <div className="w-full max-w-md z-10 flex flex-col flex-1 justify-center mx-auto">
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
                <Mail className="w-14 h-14 text-red-500 drop-shadow-lg animate-bounce" />
              </motion.div>
              <CardTitle className="text-3xl text-center font-extrabold text-black">Forgot Password</CardTitle>
              <CardDescription className="text-center text-gray-600">
              Enter your email address and we'll send you a link to reset your password
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
                          <Input placeholder="email@example.com" {...field} className="bg-white/80 focus:bg-white/100 transition" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full py-3 text-lg bg-red-500 text-white font-bold shadow-lg rounded-full hover:bg-black hover:text-white transition-all">
                      <Mail className="mr-2 h-5 w-5" /> Send Reset Link
                </Button>
                  </motion.div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
                <Link to="/login" className="text-red-500 hover:underline font-semibold">Back to Sign In</Link>
            </div>
          </CardFooter>
        </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
