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
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Brush, LayoutDashboard, ShoppingBag, Users, TrendingUp, PlusCircle, Search, MoreVertical, Edit, Trash2, Eye, XCircle, CheckCircle } from 'lucide-react';
import { Design } from '@shared/schema';
import { CATEGORIES } from '@/lib/constants';

const CreatorDesignsPage: React.FC = () => {
  const { user, isAuthenticated, isCreator } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editDesign, setEditDesign] = useState<Design | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<number | null>(null);

  // Redirect if not authenticated or not a creator
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isCreator) {
      navigate('/sell');
    }
  }, [isAuthenticated, isCreator, navigate]);

  // Fetch creator's designs
  const { data: designs, isLoading: isLoadingDesigns } = useQuery<Design[]>({
    queryKey: ['/api/designs', { userId: user?.id }],
    enabled: !!user?.id && isCreator,
  });

  // Setup form when editing a design
  React.useEffect(() => {
    if (editDesign) {
      setTitle(editDesign.title);
      setDescription(editDesign.description || '');
      setIsPublic(editDesign.isPublic);
      setSelectedCategories(editDesign.categories);
    }
  }, [editDesign]);

  // Update design mutation
  const updateDesignMutation = useMutation({
    mutationFn: async (designData: {
      id: number;
      title: string;
      description: string;
      isPublic: boolean;
      categories: string[];
    }) => {
      const { id, ...updateData } = designData;
      return await apiRequest('PATCH', `/api/designs/${id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/designs'] });
      toast({
        title: "Design Updated",
        description: "Your design has been successfully updated.",
      });
      setEditDesign(null);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update design",
        variant: "destructive"
      });
    }
  });

  // Delete design mutation
  const deleteDesignMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/designs/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/designs'] });
      toast({
        title: "Design Deleted",
        description: "Your design has been permanently deleted.",
      });
      setIsDeleteDialogOpen(false);
      setDesignToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete design",
        variant: "destructive"
      });
    }
  });

  // Handle form submission
  const handleUpdateDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDesign) return;

    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your design",
        variant: "destructive"
      });
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: "Categories Required",
        description: "Please select at least one category",
        variant: "destructive"
      });
      return;
    }

    updateDesignMutation.mutate({
      id: editDesign.id,
      title,
      description,
      isPublic,
      categories: selectedCategories
    });
  };

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Filter designs based on tab and search
  const filteredDesigns = React.useMemo(() => {
    if (!designs) return [];

    return designs.filter(design => {
      // Tab filter
      if (activeTab === 'published' && !design.isPublic) {
        return false;
      }
      if (activeTab === 'draft' && design.isPublic) {
        return false;
      }
      if (activeTab === 'approved' && (!design.isPublic || !design.isApproved)) {
        return false;
      }
      if (activeTab === 'pending' && (!design.isPublic || design.isApproved)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        return design.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               (design.description && design.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      return true;
    });
  }, [designs, activeTab, searchQuery]);

  if (!isAuthenticated || !isCreator || !user) {
    return null; // Will redirect
  }

  return (
    <>
      <Helmet>
        <title>My Designs | PrintOn Creator Dashboard</title>
        <meta name="description" content="Manage your PrintOn designs. Edit, publish, and track the performance of your creations." />
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
                  <a className="flex items-center py-2 px-3 rounded-md hover:bg-secondary w-full">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Dashboard
                  </a>
                </Link>
                <Link href="/creator/designs">
                  <a className="flex items-center py-2 px-3 rounded-md bg-primary text-primary-foreground w-full">
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
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">My Designs</CardTitle>
                  <CardDescription>
                    Manage your custom t-shirt designs
                  </CardDescription>
                </div>
                <Button asChild className="flex items-center">
                  <Link href="/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Design
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search designs..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 mb-6">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="published">Published</TabsTrigger>
                      <TabsTrigger value="draft">Drafts</TabsTrigger>
                      <TabsTrigger value="approved">Approved</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-0">
                      {isLoadingDesigns ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="border rounded-lg overflow-hidden">
                              <Skeleton className="h-48 w-full" />
                              <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-1/4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredDesigns.length === 0 ? (
                        <div className="text-center py-12">
                          <Brush className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No designs found</h3>
                          <p className="text-muted-foreground mb-6">
                            {searchQuery 
                              ? "We couldn't find any designs matching your search."
                              : activeTab === 'all' 
                                ? "You haven't created any designs yet."
                                : `You don't have any ${activeTab} designs.`}
                          </p>
                          <Button asChild>
                            <Link href="/create">Create a Design</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredDesigns.map((design) => (
                            <div key={design.id} className="border rounded-lg overflow-hidden group hover:border-primary transition-colors">
                              <div className="aspect-square bg-secondary relative overflow-hidden">
                                <img 
                                  src={design.imageUrl} 
                                  alt={design.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute top-2 right-2">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => setEditDesign(design)}
                                        className="cursor-pointer"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setDesignToDelete(design.id);
                                          setIsDeleteDialogOpen(true);
                                        }}
                                        className="cursor-pointer text-destructive"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/design/${design.id}`}>
                                          <Eye className="mr-2 h-4 w-4" />
                                          Preview
                                        </Link>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="font-medium truncate">{design.title}</h3>
                                  {design.isPublic && (
                                    <Badge variant="outline" className={`text-xs flex items-center gap-1 ${design.isApproved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                      {design.isApproved ? (
                                        <>
                                          <CheckCircle className="h-3 w-3" />
                                          <span>Approved</span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle className="h-3 w-3" />
                                          <span>Pending</span>
                                        </>
                                      )}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {design.description || 'No description'}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {design.categories.slice(0, 2).map((category, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                  {design.categories.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{design.categories.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Created: {format(new Date(design.createdAt), 'MMM d, yyyy')}
                                </p>
                              </div>
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

      {/* Edit Design Dialog */}
      <Dialog open={!!editDesign} onOpenChange={(open) => !open && setEditDesign(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Design</DialogTitle>
            <DialogDescription>
              Update the details of your design.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDesign}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter design title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              <div className="grid gap-2">
                <Label>Categories (select at least one)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Switch
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public">Make this design public</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setEditDesign(null)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateDesignMutation.isPending}
              >
                {updateDesignMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this design? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => designToDelete && deleteDesignMutation.mutate(designToDelete)}
              disabled={deleteDesignMutation.isPending}
            >
              {deleteDesignMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatorDesignsPage;