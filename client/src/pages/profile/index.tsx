import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/lib/authContext';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound, Package, Settings, CreditCard, Mail, User } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: {
      displayName?: string;
      username?: string;
      bio?: string;
      avatar?: string;
    }) => {
      return await apiRequest('PATCH', `/api/users/${user?.id}`, profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive'
      });
    }
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      displayName,
      username,
      bio,
      avatar
    });
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Helmet>
        <title>Your Profile | PrintOn</title>
        <meta name="description" content="Manage your PrintOn account, view orders, update your profile, and track your designs." />
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
                <Link href="/profile" className="flex items-center py-2 px-3 rounded-md bg-primary text-primary-foreground w-full">
                  <UserRound className="mr-2 h-5 w-5" />
                  Profile
                </Link>
                <Link href="/profile/orders" className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                  <Package className="mr-2 h-5 w-5" />
                  Orders
                </Link>
                <Link href="/profile/settings" className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
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
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <CardDescription>
                  Manage your account information and profile settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile">
                  <TabsList className="mb-6">
                    <TabsTrigger value="profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="account" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="flex flex-col items-center mb-6">
                        <Avatar className="w-24 h-24 mb-4">
                          {avatar ? (
                            <AvatarImage src={avatar} alt={user.username} />
                          ) : (
                            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="space-y-2 text-center">
                          <h3 className="font-medium">Profile Picture</h3>
                          <div className="flex flex-wrap justify-center gap-2">
                            <Button type="button" variant="outline" size="sm">
                              Change
                            </Button>
                            <Button type="button" variant="ghost" size="sm">
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your display name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your username"
                          />
                          <p className="text-sm text-muted-foreground">Choose a unique username</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            className="min-h-[100px]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="avatar">Avatar URL</Label>
                          <Input
                            id="avatar"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="account">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Email</h3>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                            <span>{user.email}</span>
                          </div>
                          <Button variant="outline" size="sm">Change</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Password</h3>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <span>••••••••</span>
                          </div>
                          <Button variant="outline" size="sm">Change</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Account Type</h3>
                        <div className="p-3 border rounded-md">
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

                      <div className="pt-4 border-t">
                        <Button variant="destructive">Delete Account</Button>
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

export default ProfilePage;
