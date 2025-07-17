import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/authSlice';
import type { RootState } from '@/store';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  rememberMe: z.boolean().default(false),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const resultAction = await dispatch(login({ email: values.email, password: values.password }) as any);
      if (login.fulfilled.match(resultAction)) {
        navigate('/');
      }
    } catch (err) {
      // error is handled by Redux
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-50 overflow-hidden">
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
      <div className="w-full max-w-sm z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-2 max-w-sm mx-auto">
            <CardHeader className="space-y-1 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
                className="mb-0"
              >
                <LogIn className="w-14 h-14 text-red-500 drop-shadow-lg animate-bounce" />
              </motion.div>
              <CardTitle className="text-3xl text-center font-extrabold text-black">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Welcome back! Enter your email and password to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 text-center mb-2">{error}</div>}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                          <Input type="password" placeholder="********" {...field} className="bg-white/80 focus:bg-white/100 transition" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="w-full py-3 text-lg bg-red-500 text-white font-bold shadow-lg rounded-full hover:bg-black hover:text-white transition-all" disabled={loading}>
                      <LogIn className="mr-2 h-5 w-5" /> {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                  </motion.div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              <span>Don't have an account? </span>
                <Link to="/register" className="text-red-500 hover:underline font-semibold">Register</Link>
              <p className="mt-2">
                  <Link to="/forgot-password" className="text-black hover:underline font-semibold">Forgot your password?</Link>
              </p>
            </div>
          </CardFooter>
        </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;