import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/lib/authContext';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowUpRight, Brush, LayoutDashboard, ShoppingBag, Users, DollarSign, TrendingUp, ExternalLink } from 'lucide-react';

// Sample data for statistics
const sampleData = {
  earnings: [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 700 },
    { name: 'May', value: 600 },
    { name: 'Jun', value: 800 }
  ],
  sales: [
    { name: 'Jan', value: 8 },
    { name: 'Feb', value: 5 },
    { name: 'Mar', value: 10 },
    { name: 'Apr', value: 15 },
    { name: 'May', value: 12 },
    { name: 'Jun', value: 18 }
  ]
};

const CreatorDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isCreator } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if not authenticated or not a creator
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isCreator) {
      navigate('/sell');
    }
  }, [isAuthenticated, isCreator, navigate]);

  // Fetch creator's products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/products', { creatorId: user?.id }],
    enabled: !!user?.id && isCreator,
  });

  // Fetch creator's designs
  const { data: designs, isLoading: isLoadingDesigns } = useQuery({
    queryKey: ['/api/designs', { userId: user?.id }],
    enabled: !!user?.id && isCreator,
  });

  if (!isAuthenticated || !isCreator || !user) {
    return null; // Will redirect
  }

  return (
    <>
      <Helmet>
        <title>Creator Dashboard | PrintOn</title>
        <meta name="description" content="Manage your PrintOn creator account. Track sales, upload designs, and analyze performance." />
      </Helmet>

      <div className="container py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <div className="space-y-6">
              <div className="flex items-center">
                <Avatar className="w-16 h-16 mr-4">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.displayName || user.username} />
                  ) : (
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">{user.displayName || user.username}</h2>
                  <p className="text-sm text-primary">Creator</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link href="/creator/dashboard">
                  <a className="flex items-center py-2 px-3 rounded-md bg-primary text-primary-foreground w-full">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Dashboard
                  </a>
                </Link>
                <Link href="/creator/designs">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <Brush className="mr-2 h-5 w-5" />
                    My Designs
                  </a>
                </Link>
                <Link href="/creator/sales">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Sales
                  </a>
                </Link>
                <Link href="/creator/analytics">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Analytics
                  </a>
                </Link>
                <Link href="/profile">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <Users className="mr-2 h-5 w-5" />
                    My Profile
                  </a>
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
            <div className="flex flex-col gap-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">$2,592.00</div>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">12%</span>
                      <span className="ml-1">from last month</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">68</div>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">8%</span>
                      <span className="ml-1">from last month</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Designs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{designs?.length || 0}</div>
                      <Brush className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(designs?.filter(d => d.isApproved)?.length || 0)} approved designs
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Your sales and earnings over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="earnings">
                    <TabsList className="mb-4">
                      <TabsTrigger value="earnings">Earnings</TabsTrigger>
                      <TabsTrigger value="sales">Sales</TabsTrigger>
                    </TabsList>
                    <TabsContent value="earnings" className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sampleData.earnings}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [`$${value}`, 'Earnings']}
                            contentStyle={{ background: 'var(--background)', borderColor: 'var(--border)' }}
                          />
                          <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="sales" className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sampleData.sales}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [`${value} units`, 'Sales']}
                            contentStyle={{ background: 'var(--background)', borderColor: 'var(--border)' }}
                          />
                          <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4 pb-4 border-b last:pb-0 last:border-0">
                          <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium">{i === 0 ? 'New sale' : i === 1 ? 'Design approved' : 'New review'}</p>
                            <p className="text-sm text-muted-foreground">
                              {i === 0 
                                ? 'Someone purchased your "Abstract Dreams" design' 
                                : i === 1 
                                  ? 'Your "Geometric Patterns" design was approved' 
                                  : 'New 5-star review on "Minimalist Logo"'}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {i === 0 ? '2h ago' : i === 1 ? '1d ago' : '3d ago'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link href="/creator/activity">
                        <span className="flex items-center justify-center">
                          View All Activity
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" asChild>
                      <Link href="/create">
                        <Brush className="mr-2 h-4 w-4" />
                        Create New Design
                      </Link>
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Manage Payouts
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Products</CardTitle>
                  <CardDescription>
                    Manage and monitor your product performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProducts ? (
                    <div className="text-center py-6">
                      <p>Loading products...</p>
                    </div>
                  ) : (products?.length || 0) > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products?.slice(0, 3).map((product) => (
                        <div key={product.id} className="border rounded-lg overflow-hidden group hover:border-primary transition-colors">
                          <div className="aspect-square bg-secondary relative overflow-hidden">
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium truncate">{product.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-muted-foreground">
                                ${product.price.toFixed(2)}
                              </p>
                              <p className="text-xs">
                                {/* Would display actual sales count */}
                                0 sales
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4 text-muted-foreground">
                        You haven't created any products yet.
                      </p>
                      <Button asChild>
                        <Link href="/create">Create Your First Design</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
                {(products?.length || 0) > 3 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/creator/designs">View All Products</Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreatorDashboardPage;
