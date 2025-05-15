import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Add Razorpay type to Window interface
declare global {
  interface Window {
    Razorpay: any;
  }
}
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DISCOUNT_OPTIONS = [
  { value: '5', label: '5% Discount - ₹99' },
  { value: '10', label: '10% Discount - ₹199' },
  { value: '15', label: '15% Discount - ₹299' },
  { value: '20', label: '20% Discount - ₹399' },
  { value: '25', label: '25% Discount - ₹499' },
];

const getCouponPrice = (discountPercent: number): number => {
  switch (discountPercent) {
    case 5: return 99;
    case 10: return 199;
    case 15: return 299;
    case 20: return 399;
    case 25: return 499;
    default: return 99;
  }
};

const CouponPurchasePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [selectedDiscount, setSelectedDiscount] = useState<string>('5');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [razorpay, setRazorpay] = useState<any>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpay(window.Razorpay);
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch user's existing coupons
  const { data: userCoupons = [], isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/coupons`],
    enabled: isAuthenticated && !!user?.id,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: { userId: number; amount: number; discountPercent: number }) => {
      return await apiRequest('POST', '/api/coupons/purchase', data);
    },
    onSuccess: (data) => {
      handlePayment(data);
    },
    onError: (error) => {
      setIsPaymentProcessing(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payment order',
        variant: 'destructive'
      });
    }
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/coupons/purchase/success', data);
    },
    onSuccess: () => {
      setIsPaymentProcessing(false);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/coupons`] });
      toast({
        title: 'Success',
        description: 'Coupon purchased successfully!',
      });
    },
    onError: (error) => {
      setIsPaymentProcessing(false);
      toast({
        title: 'Payment Verification Failed',
        description: error instanceof Error ? error.message : 'Failed to verify payment',
        variant: 'destructive'
      });
    }
  });

  const handlePurchase = () => {
    if (!user) return;
    
    const discountPercent = parseInt(selectedDiscount);
    const amount = getCouponPrice(discountPercent);
    
    setIsPaymentProcessing(true);
    createOrderMutation.mutate({
      userId: user.id,
      amount,
      discountPercent
    });
  };

  const handlePayment = (orderData: any) => {
    if (!razorpay) {
      toast({
        title: 'Error',
        description: 'Payment gateway not loaded. Please try again.',
        variant: 'destructive'
      });
      setIsPaymentProcessing(false);
      return;
    }

    const options = {
      key: orderData.key_id, // Enter the Key ID generated from the Dashboard
      amount: orderData.amount * 100, // Amount in paisa
      currency: orderData.currency,
      name: 'PrintOn',
      description: `Purchase ${selectedDiscount}% Discount Coupon`,
      order_id: orderData.order_id,
      handler: function (response: any) {
        verifyPaymentMutation.mutate({
          ...response,
          userId: user?.id,
          discountPercent: parseInt(selectedDiscount)
        });
      },
      prefill: {
        name: user?.displayName || user?.username,
        email: user?.email,
      },
      theme: {
        color: '#3b82f6', // Primary color
      },
      modal: {
        ondismiss: function () {
          setIsPaymentProcessing(false);
        }
      }
    };

    try {
      const rzpay = new razorpay(options);
      rzpay.open();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open payment window. Please try again later.',
        variant: 'destructive'
      });
      setIsPaymentProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Helmet>
        <title>Purchase Discount Coupons | PrintOn</title>
        <meta name="description" content="Purchase discount coupons for future shopping on PrintOn. Get exclusive discounts on your favorite custom merchandise." />
      </Helmet>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <motion.h1 
              className="text-4xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Purchase Discount Coupons
            </motion.h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Buy discount coupons that you can use on your future purchases. The higher the discount, the better the value!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Purchase New Coupon</CardTitle>
                  <CardDescription>
                    Select the discount percentage you want to purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount Percentage</Label>
                      <Select
                        value={selectedDiscount}
                        onValueChange={setSelectedDiscount}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISCOUNT_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Higher discounts cost more but provide greater savings on larger orders.
                      </p>
                    </div>

                    <div className="pt-4">
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Discount:</span>
                          <span className="font-medium">{selectedDiscount}%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Validity:</span>
                          <span className="font-medium">30 days</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Usage:</span>
                          <span className="font-medium">One-time use</span>
                        </div>
                        <div className="flex justify-between font-medium text-lg pt-3 border-t mt-3">
                          <span>Price:</span>
                          <span>₹{getCouponPrice(parseInt(selectedDiscount))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={handlePurchase}
                    disabled={isPaymentProcessing || !razorpay}
                  >
                    {isPaymentProcessing ? 'Processing...' : 'Purchase Coupon'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Coupons</CardTitle>
                  <CardDescription>
                    Here are the discount coupons you own
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="py-8 flex justify-center">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : userCoupons && userCoupons.length > 0 ? (
                    <div className="space-y-4">
                      {userCoupons.map((userCoupon: any) => {
                        const isUsed = !!userCoupon.usedAt;
                        const isExpired = new Date(userCoupon.coupon.expiresAt) < new Date();
                        const isValid = !isUsed && !isExpired && userCoupon.coupon.isActive;
                        
                        return (
                          <div 
                            key={userCoupon.id}
                            className={`p-4 rounded-lg border ${isValid ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : 'border-gray-200 bg-gray-50/50 dark:bg-gray-800/20'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{userCoupon.coupon.code}</div>
                                <div className="text-lg font-bold">{userCoupon.coupon.discountPercent}% OFF</div>
                                <div className="text-sm mt-1 text-muted-foreground">
                                  {isValid ? (
                                    <>Valid until {new Date(userCoupon.coupon.expiresAt).toLocaleDateString()}</>
                                  ) : isUsed ? (
                                    <>Used on {new Date(userCoupon.usedAt).toLocaleDateString()}</>
                                  ) : isExpired ? (
                                    <>Expired on {new Date(userCoupon.coupon.expiresAt).toLocaleDateString()}</>
                                  ) : (
                                    <>Not active</>
                                  )}
                                </div>
                              </div>
                              <div className={`px-2 py-1 text-xs rounded-full ${isValid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`}>
                                {isValid ? 'Valid' : (isUsed ? 'Used' : 'Expired')}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">You don't have any coupons yet.</p>
                      <p className="text-sm mt-2">Purchase a coupon to get discounts on your orders!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponPurchasePage;