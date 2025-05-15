import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/lib/authContext';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound, Package, Settings, CreditCard, Mail, User, Shield, Bell, Palette, Store } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/lib/themeContext';

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const { theme: currentTheme, setTheme } = useTheme();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [offerNotifications, setOfferNotifications] = useState(true);
  const [productSaleNotifications, setProductSaleNotifications] = useState(true);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const updatePasswordMutation = useMutation({
    mutationFn: async (passwordData: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return await apiRequest('POST', `/api/auth/change-password`, passwordData);
    },
    onSuccess: () => {
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update password',
        variant: 'destructive'
      });
    }
  });

  const updateEmailMutation = useMutation({
    mutationFn: async (emailData: { email: string }) => {
      return await apiRequest('PATCH', `/api/users/${user?.id}`, emailData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: 'Email Updated',
        description: 'Your email has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update email',
        variant: 'destructive'
      });
    }
  });
  
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferencesData: {
      emailNotifications?: boolean;
      offerNotifications?: boolean;
      productSaleNotifications?: boolean;
    }) => {
      return await apiRequest('PATCH', `/api/users/${user?.id}/preferences`, preferencesData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update preferences',
        variant: 'destructive'
      });
    }
  });

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Your new password and confirmation do not match.',
        variant: 'destructive'
      });
      return;
    }
    
    updatePasswordMutation.mutate({
      currentPassword: password,
      newPassword
    });
  };

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmailMutation.mutate({ email });
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Helmet>
        <title>Account Settings | PrintOn</title>
        <meta name="description" content="Manage your PrintOn account settings, update your password, and more." />
      </Helmet>

      <div className="container py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64">
            <div className="space-y-6">
              <div className="flex items-center">
                <Avatar className="w-16 h-16 mr-4">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.username} />
                  ) : (
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">{user.displayName || user.username}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link href="/profile" className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                  <UserRound className="mr-2 h-5 w-5" />
                  Profile
                </Link>
                <Link href="/profile/orders" className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                  <Package className="mr-2 h-5 w-5" />
                  Orders
                </Link>
                <Link href="/profile/settings" className="flex items-center py-2 px-3 rounded-md bg-primary text-primary-foreground w-full">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="account">
                  <TabsList className="mb-6">
                    <TabsTrigger value="account" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      Theme
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="account">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Address</h3>
                        <form onSubmit={handleUpdateEmail} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Your email address"
                            />
                          </div>
                          <Button 
                            type="submit" 
                            disabled={updateEmailMutation.isPending}
                          >
                            {updateEmailMutation.isPending ? 'Updating...' : 'Update Email'}
                          </Button>
                        </form>
                      </div>

                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-medium">Account Type</h3>
                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Current: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                              {user.role === 'user' && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Upgrade to Creator to sell your designs
                                </p>
                              )}
                            </div>
                            {user.role === 'user' && (
                              <Button variant="default" size="sm" asChild>
                                <Link href="/sell">Become a Creator</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                              id="current-password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            disabled={updatePasswordMutation.isPending}
                          >
                            {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Theme Preferences</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose a theme that matches your style. This will change the appearance across the entire platform.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div 
                            className={`border p-4 rounded-lg cursor-pointer transition-all ${currentTheme.currentTheme === 'light' ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}
                            onClick={() => setTheme('light')}
                          >
                            <div className="h-24 bg-white rounded-md border mb-2 flex items-center justify-center">
                              <span className="text-black">Light</span>
                            </div>
                            <p className="text-sm text-center font-medium">Light</p>
                          </div>
                          
                          <div 
                            className={`border p-4 rounded-lg cursor-pointer transition-all ${currentTheme.currentTheme === 'dark' ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}
                            onClick={() => setTheme('dark')}
                          >
                            <div className="h-24 bg-slate-800 rounded-md border mb-2 flex items-center justify-center">
                              <span className="text-white">Dark</span>
                            </div>
                            <p className="text-sm text-center font-medium">Dark</p>
                          </div>
                          
                          <div 
                            className={`border p-4 rounded-lg cursor-pointer transition-all ${currentTheme.currentTheme === 'premium' ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}
                            onClick={() => setTheme('premium')}
                          >
                            <div className="h-24 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-md border mb-2 flex items-center justify-center">
                              <span className="text-white">Premium</span>
                            </div>
                            <p className="text-sm text-center font-medium">Premium</p>
                          </div>
                          
                          <div 
                            className={`border p-4 rounded-lg cursor-pointer transition-all ${currentTheme.currentTheme === 'minimalist' ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}
                            onClick={() => setTheme('minimalist')}
                          >
                            <div className="h-24 bg-neutral-50 rounded-md border mb-2 flex items-center justify-center">
                              <span className="text-neutral-800">Minimalist</span>
                            </div>
                            <p className="text-sm text-center font-medium">Minimalist</p>
                          </div>
                          
                          <div 
                            className={`border p-4 rounded-lg cursor-pointer transition-all ${currentTheme.currentTheme === 'experimental' ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}
                            onClick={() => setTheme('experimental')}
                          >
                            <div className="h-24 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-md border mb-2 flex items-center justify-center">
                              <span className="text-white">Experimental</span>
                            </div>
                            <p className="text-sm text-center font-medium">Experimental</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Preferences</h3>
                        <p className="text-sm text-muted-foreground">
                          Control what notifications you receive from PrintOn.
                        </p>
                        
                        <div className="space-y-6 mt-4">
                          <div className="flex items-center justify-between space-y-0 border-b pb-4">
                            <div className="space-y-0.5">
                              <h4 className="font-medium">Email notifications</h4>
                              <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                            </div>
                            <Switch
                              checked={emailNotifications} 
                              onCheckedChange={(checked) => {
                                setEmailNotifications(checked);
                                updatePreferencesMutation.mutate({ emailNotifications: checked });
                              }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between space-y-0 border-b pb-4">
                            <div className="space-y-0.5">
                              <h4 className="font-medium">Special offers</h4>
                              <p className="text-sm text-muted-foreground">Receive notifications about discounts and special offers.</p>
                            </div>
                            <Switch
                              checked={offerNotifications} 
                              onCheckedChange={(checked) => {
                                setOfferNotifications(checked);
                                updatePreferencesMutation.mutate({ offerNotifications: checked });
                              }}
                            />
                          </div>
                          
                          {user?.role === 'creator' && (
                            <div className="flex items-center justify-between space-y-0">
                              <div className="space-y-0.5">
                                <h4 className="font-medium">Product sales</h4>
                                <p className="text-sm text-muted-foreground">Get notified when someone purchases your products.</p>
                              </div>
                              <Switch
                                checked={productSaleNotifications} 
                                onCheckedChange={(checked) => {
                                  setProductSaleNotifications(checked);
                                  updatePreferencesMutation.mutate({ productSaleNotifications: checked });
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="billing">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Payment Methods</h3>
                        <div className="p-6 border rounded-md text-center">
                          <p className="text-muted-foreground mb-4">No payment methods added yet</p>
                          <Button>Add Payment Method</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Billing Address</h3>
                        <div className="p-6 border rounded-md text-center">
                          <p className="text-muted-foreground mb-4">No billing address added yet</p>
                          <Button variant="outline">Add Billing Address</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;