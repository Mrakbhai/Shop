import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/lib/authContext';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRound, Package, Settings, Search, Eye, CheckCircle, Timer, CreditCard, TruckIcon, BookmarkX } from 'lucide-react';
import { Order, OrderStatus } from '@shared/schema';

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [OrderStatus.PAID]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [OrderStatus.PROCESSING]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [OrderStatus.SHIPPED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  [OrderStatus.PENDING]: <Timer className="h-4 w-4" />,
  [OrderStatus.PAID]: <CreditCard className="h-4 w-4" />,
  [OrderStatus.PROCESSING]: <Timer className="h-4 w-4" />,
  [OrderStatus.SHIPPED]: <TruckIcon className="h-4 w-4" />,
  [OrderStatus.DELIVERED]: <CheckCircle className="h-4 w-4" />,
  [OrderStatus.CANCELLED]: <BookmarkX className="h-4 w-4" />
};

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders', { userId: user?.id }],
    enabled: !!user?.id,
  });

  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      
      // Tab filter
      if (activeTab === 'active' && (order.status === 'cancelled' || order.status === 'delivered')) {
        return false;
      }
      if (activeTab === 'completed' && order.status !== 'delivered') {
        return false;
      }
      if (activeTab === 'cancelled' && order.status !== 'cancelled') {
        return false;
      }
      
      // Search filter - search by order ID
      if (searchQuery) {
        return order.id.toString().includes(searchQuery);
      }
      
      return true;
    });
  }, [orders, statusFilter, activeTab, searchQuery]);

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Helmet>
        <title>Your Orders | PrintOn</title>
        <meta name="description" content="View and track your PrintOn orders. Check order status, shipping information, and order history." />
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
                <Link href="/profile">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <UserRound className="mr-2 h-5 w-5" />
                    Profile
                  </a>
                </Link>
                <Link href="/profile/orders">
                  <a className="flex items-center py-2 px-3 rounded-md bg-primary text-primary-foreground w-full">
                    <Package className="mr-2 h-5 w-5" />
                    Orders
                  </a>
                </Link>
                <Link href="/profile/settings">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your Orders</CardTitle>
                <CardDescription>
                  View and track all your PrintOn orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search orders..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 mb-6">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-0">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                              <Skeleton className="h-20 w-20 rounded" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-1/3" />
                              </div>
                              <div className="flex flex-col justify-between items-end">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-9 w-24" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No orders found</h3>
                          <p className="text-muted-foreground mb-6">
                            {searchQuery 
                              ? "We couldn't find any orders matching your search."
                              : "You haven't placed any orders yet."}
                          </p>
                          <Button asChild>
                            <Link href="/shop">Browse Products</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredOrders.map((order) => (
                            <div key={order.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                              <div className="sm:w-20 sm:h-20 rounded overflow-hidden bg-secondary">
                                <img 
                                  src="https://images.unsplash.com/photo-1581655353564-df123a1eb820"
                                  alt="Order thumbnail"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                  <h3 className="font-medium">Order #{order.id}</h3>
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className={`flex items-center gap-1 ${statusColors[order.status as OrderStatus]}`}>
                                    {statusIcons[order.status as OrderStatus]}
                                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                  </Badge>
                                  <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {/* Would display actual items here */}
                                  {order.items?.length || 0} item(s)
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="sm:self-end flex items-center gap-1"
                                asChild
                              >
                                <Link href={`/orders/${order.id}`}>
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
