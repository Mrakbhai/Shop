
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' })
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions"
      });
      setLocation('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reset email"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | PrintOn</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email to receive reset instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" onClick={() => setLocation('/login')}>
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
