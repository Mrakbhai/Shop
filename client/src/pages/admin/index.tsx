import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/lib/authContext';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  Users, 
  ShoppingBag, 
  Brush, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  BarChart3, 
  Search,
  Filter,
  Plus,
  Check,
  X
} from 'lucide-react';
import { User, CreatorApplication, Design, ApplicationStatus } from '@shared/schema';

const AdminPanel: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Redirect if not authenticated or not an admin
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch pending creator applications
  const { data: applications, isLoading: isLoadingApplications } = useQuery<CreatorApplication[]>({
    queryKey: ['/api/creator/applications'],
    enabled: !!isAdmin,
  });

  // Fetch pending designs for approval
  const { data: pendingDesigns, isLoading: isLoadingDesigns } = useQuery<Design[]>({
    queryKey: ['/api/designs', { isPublic: true, approved: false }],
    enabled: !!isAdmin,
  });

  // Fetch users for user management
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
    enabled: !!isAdmin,
  });

  // Update application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: ApplicationStatus }) => {
      return await apiRequest('PATCH', `/api/creator/applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/creator/applications'] });
      toast({
        title: "Application Updated",
        description: "The creator application status has been updated.",
      });
      setSelectedApplication(null);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update application status",
        variant: "destructive"
      });
    }
  });

  // Update design approval status mutation
  const updateDesignMutation = useMutation({
    mutationFn: async ({ id, isApproved }: { id: number, isApproved: boolean }) => {
      return await apiRequest('PATCH', `/api/designs/${id}`, { isApproved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/designs'] });
      toast({
        title: "Design Updated",
        description: "The design approval status has been updated.",
      });
      setSelectedDesign(null);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update design status",
        variant: "destructive"
      });
    }
  });

  const handleApplicationAction = (status: ApplicationStatus) => {
    if (!selectedApplication) return;
    
    updateApplicationMutation.mutate({
      id: selectedApplication.id,
      status
    });
  };

  const handleDesignAction = (isApproved: boolean) => {
    if (!selectedDesign) return;
    
    updateDesignMutation.mutate({
      id: selectedDesign.id,
      isApproved
    });
  };

  if (!isAuthenticated || !isAdmin || !user) {
    return null; // Will redirect
  }

  // Filter applications by search query
  const filteredApplications = applications?.filter(app => 
    searchQuery ? app.userId.toString().includes(searchQuery) : true
  );

  // Filter designs by search query
  const filteredDesigns = pendingDesigns?.filter(design => 
    searchQuery ? design.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  // Filter users by search query
  const filteredUsers = users?.filter(user => 
    searchQuery ? 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) 
    : true
  );

  return (
    <>
      <Helmet>
        <title>Admin Panel | PrintOn</title>
        <meta name="description" content="PrintOn administrator dashboard for managing users, approving designs, and moderating content." />
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
                  <p className="text-sm text-red-500">Administrator</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link href="/admin">
                  <a className="flex items-center py-2 px-3 rounded-md bg-primary text-primary-foreground w-full">
                    <Shield className="mr-2 h-5 w-5" />
                    Admin Dashboard
                  </a>
                </Link>
                <Link href="/admin/users">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <Users className="mr-2 h-5 w-5" />
                    User Management
                  </a>
                </Link>
                <Link href="/admin/designs">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <Brush className="mr-2 h-5 w-5" />
                    Content Moderation
                  </a>
                </Link>
                <Link href="/admin/orders">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Orders
                  </a>
                </Link>
                <Link href="/admin/settings">
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <Settings className="mr-2 h-5 w-5" />
                    Site Settings
                  </a>
                </Link>
                <Link href="/profile">
                  <div className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <UserIcon className="mr-2 h-5 w-5" />
                    My Profile
                  </div>
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
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Pending Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{applications?.filter(app => app.status === 'pending').length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Creator applications to review</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Pending Designs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingDesigns?.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Designs awaiting approval</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users?.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Registered users on platform</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Creators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users?.filter(u => u.role === 'creator').length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Approved creator accounts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>Admin Dashboard</CardTitle>
                  <CardDescription>
                    Manage users, review applications, and approve content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search by username, email, or ID..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <Tabs defaultValue="applications">
                      <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="applications" className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          Pending Applications
                        </TabsTrigger>
                        <TabsTrigger value="designs" className="flex items-center">
                          <Brush className="mr-2 h-4 w-4" />
                          Pending Designs
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          User Management
                        </TabsTrigger>
                      </TabsList>

                      {/* Applications Tab */}
                      <TabsContent value="applications">
                        {isLoadingApplications ? (
                          <div className="text-center py-6">
                            <p>Loading applications...</p>
                          </div>
                        ) : (filteredApplications?.length || 0) === 0 ? (
                          <div className="text-center py-8">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No pending applications</h3>
                            <p className="text-muted-foreground mb-4">
                              All creator applications have been reviewed.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredApplications?.map((application) => (
                              <div key={application.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center">
                                      <Badge variant="outline" className={
                                        application.status === 'pending' 
                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                                          : application.status === 'approved'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                      }>
                                        {application.status.toUpperCase()}
                                      </Badge>
                                      <h3 className="font-medium ml-2">Application #{application.id}</h3>
                                    </div>
                                    <p className="text-sm">
                                      Applicant ID: #{application.userId} • Submitted: {format(new Date(application.createdAt), 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => setSelectedApplication(application)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View Details
                                    </Button>
                                    {application.status === 'pending' && (
                                      <>
                                        <Button 
                                          variant="default" 
                                          size="sm" 
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => updateApplicationMutation.mutate({
                                            id: application.id,
                                            status: ApplicationStatus.APPROVED
                                          })}
                                        >
                                          <Check className="h-4 w-4 mr-1" />
                                          Approve
                                        </Button>
                                        <Button 
                                          variant="destructive" 
                                          size="sm"
                                          onClick={() => updateApplicationMutation.mutate({
                                            id: application.id,
                                            status: ApplicationStatus.REJECTED
                                          })}
                                        >
                                          <X className="h-4 w-4 mr-1" />
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      {/* Designs Tab */}
                      <TabsContent value="designs">
                        {isLoadingDesigns ? (
                          <div className="text-center py-6">
                            <p>Loading designs...</p>
                          </div>
                        ) : (filteredDesigns?.length || 0) === 0 ? (
                          <div className="text-center py-8">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No pending designs</h3>
                            <p className="text-muted-foreground mb-4">
                              All public designs have been reviewed.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDesigns?.map((design) => (
                              <div key={design.id} className="border rounded-lg overflow-hidden group hover:border-primary transition-colors">
                                <div className="aspect-square bg-secondary relative overflow-hidden">
                                  <img 
                                    src={design.imageUrl} 
                                    alt={design.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <div className="p-4">
                                  <h3 className="font-medium truncate">{design.title}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    By User #{design.userId}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-2 mb-4">
                                    {design.categories.slice(0, 3).map((category, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {category}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="flex-1"
                                      onClick={() => setSelectedDesign(design)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                      onClick={() => updateDesignMutation.mutate({
                                        id: design.id,
                                        isApproved: true
                                      })}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      className="flex-1"
                                      onClick={() => updateDesignMutation.mutate({
                                        id: design.id,
                                        isApproved: false
                                      })}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      {/* Users Tab */}
                      <TabsContent value="users">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <Filter className="h-4 w-4" />
                              Filter
                            </Button>
                            <p className="text-sm text-muted-foreground">
                              Showing {filteredUsers?.length || 0} users
                            </p>
                          </div>
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Add User
                          </Button>
                        </div>

                        {isLoadingUsers ? (
                          <div className="text-center py-6">
                            <p>Loading users...</p>
                          </div>
                        ) : (filteredUsers?.length || 0) === 0 ? (
                          <div className="text-center py-8">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No users found</h3>
                            <p className="text-muted-foreground mb-4">
                              Try adjusting your search or filters.
                            </p>
                          </div>
                        ) : (
                          <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                              <thead className="bg-secondary">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    User
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Role
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Email
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Joined
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-background divide-y divide-border">
                                {filteredUsers?.map((user) => (
                                  <tr key={user.id} className="hover:bg-secondary/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-3">
                                          {user.avatar ? (
                                            <AvatarImage src={user.avatar} alt={user.username} />
                                          ) : (
                                            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                          )}
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{user.displayName || user.username}</div>
                                          <div className="text-xs text-muted-foreground">#{user.id}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'creator' ? 'default' : 'outline'}>
                                        {user.role}
                                      </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm">{format(new Date(user.createdAt), 'MMM d, yyyy')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" asChild>
                                          <Link href={`/admin/users/${user.id}`}>
                                            Edit
                                          </Link>
                                        </Button>
                                        {user.role !== 'admin' && (
                                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            Suspend
                                          </Button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Creator Application #{selectedApplication?.id}</DialogTitle>
            <DialogDescription>
              Review the application details and make a decision.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <Badge variant="outline" className={
                selectedApplication?.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                  : selectedApplication?.status === 'approved'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }>
                {selectedApplication?.status.toUpperCase()}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Applicant</h4>
              <p>User ID: #{selectedApplication?.userId}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Portfolio</h4>
              <a 
                href={selectedApplication?.portfolio} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {selectedApplication?.portfolio}
              </a>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Sample Work</h4>
              <a 
                href={selectedApplication?.sample} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {selectedApplication?.sample}
              </a>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Reason for Applying</h4>
              <p className="text-sm">{selectedApplication?.reason}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Date Submitted</h4>
              <p className="text-sm">{selectedApplication?.createdAt && format(new Date(selectedApplication.createdAt), 'MMM d, yyyy, h:mm a')}</p>
            </div>
            
            {selectedApplication?.status === 'pending' && (
              <div>
                <h4 className="text-sm font-medium mb-1">Rejection Reason (Optional)</h4>
                <Input
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason if rejecting the application"
                />
                <p className="text-xs text-muted-foreground mt-1">This will be sent to the applicant.</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedApplication(null)}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
            
            {selectedApplication?.status === 'pending' && (
              <>
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700 sm:w-auto w-full"
                  onClick={() => handleApplicationAction(ApplicationStatus.APPROVED)}
                  disabled={updateApplicationMutation.isPending}
                >
                  Approve Application
                </Button>
                <Button 
                  variant="destructive"
                  className="sm:w-auto w-full"
                  onClick={() => handleApplicationAction(ApplicationStatus.REJECTED)}
                  disabled={updateApplicationMutation.isPending}
                >
                  Reject Application
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Design Details Dialog */}
      <Dialog open={!!selectedDesign} onOpenChange={(open) => !open && setSelectedDesign(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Design</DialogTitle>
            <DialogDescription>
              Review this design before approval or rejection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-square bg-secondary rounded-md overflow-hidden">
              <img 
                src={selectedDesign?.imageUrl} 
                alt={selectedDesign?.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Title</h4>
              <p>{selectedDesign?.title}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Creator</h4>
              <p>User ID: #{selectedDesign?.userId}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm">{selectedDesign?.description || 'No description provided'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Categories</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedDesign?.categories.map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Created On</h4>
              <p className="text-sm">{selectedDesign?.createdAt && format(new Date(selectedDesign.createdAt), 'MMM d, yyyy, h:mm a')}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Rejection Reason (Optional)</h4>
              <Input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason if rejecting the design"
              />
              <p className="text-xs text-muted-foreground mt-1">This will be sent to the creator.</p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedDesign(null)}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 sm:w-auto w-full"
              onClick={() => handleDesignAction(true)}
              disabled={updateDesignMutation.isPending}
            >
              Approve Design
            </Button>
            <Button 
              variant="destructive"
              className="sm:w-auto w-full" 
              onClick={() => handleDesignAction(false)}
              disabled={updateDesignMutation.isPending}
            >
              Reject Design
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPanel;
