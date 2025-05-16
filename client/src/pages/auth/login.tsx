import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/lib/themeContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' })
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { loginWithEmail, loginWithGoogle, isLoading } = useAuth();
  const { theme, currentTheme } = useTheme();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      if (!data.email || !data.password) {
        throw new Error("Please enter both email and password");
      }
      await loginWithEmail(data.email, data.password);
      toast({
        title: "Login successful",
        description: "Welcome back to PrintOn!"
      });
      setLocation('/');
    } catch (error: any) {
      console.error('Login form error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Failed to login. Please check your credentials."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      toast({
        title: "Login successful",
        description: "Welcome to PrintOn!"
      });
      setLocation('/');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: error.message || "Failed to login with Google."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeStyles = () => {
    return {
      title: "text-3xl font-bold text-foreground",
      container: "bg-background",
      card: "bg-card border-border",
      button: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border-border text-muted-foreground hover:bg-accent"
    };
  };

  const styles = getThemeStyles();

  return (
    <>
      <Helmet>
        <title>Login | PrintCreator Marketplace</title>
        <meta name="description" content="Sign in to your PrintCreator account to access your designs, orders, and more." />
      </Helmet>

      <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${styles.container}`}>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={styles.card}>
            <CardHeader className="space-y-1">
              <CardTitle className={`${styles.title} text-center`}>Sign in to your account</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to sign in
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className={`w-full ${styles.button} opacity-100 cursor-pointer`} 
                  >
                    Sign in
                  </Button>
                </form>
              </Form>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`${styles.card} px-2 text-muted-foreground`}>Or continue with</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                type="button" 
                className={`w-full mt-4 flex items-center justify-center gap-2 ${styles.outline} opacity-100 cursor-pointer`}
                onClick={handleGoogleLogin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                Continue with Google
              </Button>

              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  className="text-sm text-primary hover:underline p-0"
                  onClick={() => setLocation('/forgot-password')}
                >
                  Forgot your password?
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center w-full">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button variant="link" className="p-0" onClick={() => setLocation('/register')}>
                    Sign up
                  </Button>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;