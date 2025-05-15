import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, DollarSign, BarChart3, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { InsertCreatorApplication } from '@shared/schema';

const SellPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [portfolio, setPortfolio] = useState('');
  const [sampleWork, setSampleWork] = useState('');
  const [reason, setReason] = useState('');
  const [activeTab, setActiveTab] = useState('apply');
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');

  // Check if the user already has an application
  React.useEffect(() => {
    if (isAuthenticated && user) {
      // This would be a real API call in a production app
      if (user.role === 'creator') {
        setApplicationStatus('approved');
      } else {
        // Mock check for pending application status
        setApplicationStatus('none');
      }
    }
  }, [user, isAuthenticated]);

  const applyMutation = useMutation({
    mutationFn: async (application: InsertCreatorApplication) => {
      return await apiRequest('POST', '/api/creator/apply', application);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "We've received your application. We'll review it and get back to you soon.",
      });
      setApplicationStatus('pending');
      setActiveTab('dashboard');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
      console.error("Error submitting application:", error);
    }
  });

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply as a creator.",
        variant: "destructive"
      });
      return;
    }
    
    if (!portfolio || !sampleWork || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields in the application.",
        variant: "destructive"
      });
      return;
    }
    
    const application: InsertCreatorApplication = {
      userId: user!.id,
      status: 'pending',
      portfolio,
      sample: sampleWork,
      reason
    };
    
    applyMutation.mutate(application);
  };

  return (
    <>
      <Helmet>
        <title>Sell on PrintOn | Become a Creator</title>
        <meta name="description" content="Join our marketplace as a creator and turn your designs into income. Apply today to start selling your custom t-shirt designs." />
        <meta property="og:title" content="Sell on PrintOn | Become a Creator" />
        <meta property="og:description" content="Turn your creativity into income by selling your designs on PrintOn." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-2/3 mb-8 lg:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-inter text-4xl font-bold mb-4">Turn Your Creativity Into Income</h1>
              <p className="text-primary-foreground opacity-90 text-lg mb-6">
                Join our marketplace as a creator and earn money from every sale of your designs. No inventory, no shipping hassles - we handle everything for you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="mr-3 mt-1">
                    <Palette />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Upload Designs</h3>
                    <p className="text-primary-foreground opacity-80 text-sm">Create and upload your artwork</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="mr-3 mt-1">
                    <DollarSign />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Earn Royalties</h3>
                    <p className="text-primary-foreground opacity-80 text-sm">Get paid for every product sold</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="mr-3 mt-1">
                    <BarChart3 />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Track Performance</h3>
                    <p className="text-primary-foreground opacity-80 text-sm">Monitor sales with detailed analytics</p>
                  </div>
                </motion.div>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="text-primary"
                onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Apply Now
              </Button>
            </motion.div>
            <motion.div 
              className="lg:w-1/3 lg:pl-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800" 
                alt="Designer working on laptop with t-shirt designs" 
                className="rounded-[12px] shadow-lg w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <h2 className="font-inter text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">1</div>
                <CardTitle>Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Submit your application with samples of your work. Our team will review your portfolio and approve your application.
                </p>
                <div className="flex items-center text-sm text-primary">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">2</div>
                <CardTitle>Create</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Upload your designs to your creator dashboard. Set prices, add descriptions, and choose product types.
                </p>
                <div className="flex items-center text-sm text-primary">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">3</div>
                <CardTitle>Earn</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We handle production, shipping, and customer service. You receive royalties for every product sold with your design.
                </p>
                <div className="flex items-center text-sm text-primary">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-secondary" id="apply-section">
        <div className="container mx-auto">
          <h2 className="font-inter text-3xl font-bold text-center mb-4">Join Our Creator Community</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Apply today to start selling your designs on PrintOn. Our platform helps you reach customers worldwide without the hassle of production and shipping.
          </p>
          
          <div className="max-w-3xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="apply">Apply</TabsTrigger>
                <TabsTrigger value="dashboard">Status</TabsTrigger>
              </TabsList>
              
              <TabsContent value="apply" className="mt-6">
                {isAuthenticated ? (
                  applicationStatus === 'approved' ? (
                    <div className="text-center p-8 bg-background rounded-[12px]">
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">You're Already a Creator!</h3>
                      <p className="text-muted-foreground mb-6">
                        Your application has been approved. You can now upload and sell your designs.
                      </p>
                      <Button asChild>
                        <a href="/creator/dashboard">Go to Creator Dashboard</a>
                      </Button>
                    </div>
                  ) : applicationStatus === 'pending' ? (
                    <div className="text-center p-8 bg-background rounded-[12px]">
                      <h3 className="text-xl font-bold mb-2">Application Under Review</h3>
                      <p className="text-muted-foreground mb-4">
                        We've received your application and our team is currently reviewing it. We'll notify you once a decision has been made.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Application submitted on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  ) : applicationStatus === 'rejected' ? (
                    <div className="text-center p-8 bg-background rounded-[12px]">
                      <h3 className="text-xl font-bold mb-2">Application Not Approved</h3>
                      <p className="text-muted-foreground mb-6">
                        Unfortunately, your application wasn't approved at this time. You can reapply after 30 days with new samples.
                      </p>
                      <Button variant="outline">Contact Support</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitApplication} className="space-y-6 bg-background p-6 rounded-[12px]">
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio or Website (URL)</Label>
                        <Input 
                          id="portfolio" 
                          placeholder="https://your-portfolio.com" 
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sample-work">Link to Sample Work (URL)</Label>
                        <Input 
                          id="sample-work" 
                          placeholder="https://example.com/your-designs" 
                          value={sampleWork}
                          onChange={(e) => setSampleWork(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Share links to your work on social media, Behance, Dribbble, etc.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reason">Why do you want to join PrintOn as a creator?</Label>
                        <Textarea 
                          id="reason" 
                          placeholder="Tell us about your design style and what motivates you..." 
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          required
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={applyMutation.isPending}
                      >
                        {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </form>
                  )
                ) : (
                  <div className="text-center p-8 bg-background rounded-[12px]">
                    <h3 className="text-xl font-bold mb-2">Sign In to Apply</h3>
                    <p className="text-muted-foreground mb-6">
                      Please sign in or create an account to apply as a creator.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild>
                        <a href="/login">Sign In</a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="/register">Create Account</a>
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="dashboard" className="mt-6">
                {isAuthenticated ? (
                  applicationStatus === 'approved' ? (
                    <div className="text-center p-8 bg-background rounded-[12px]">
                      <h3 className="text-xl font-bold mb-2">Welcome to Your Creator Dashboard</h3>
                      <p className="text-muted-foreground mb-6">
                        You're an approved creator! You can now upload and sell your designs.
                      </p>
                      <Button asChild>
                        <a href="/creator/dashboard">Go to Creator Dashboard</a>
                      </Button>
                    </div>
                  ) : applicationStatus === 'pending' ? (
                    <div className="p-8 bg-background rounded-[12px]">
                      <h3 className="text-xl font-bold mb-4 text-center">Application Status: Pending</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Application Submitted</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white mr-4">2</div>
                          <div>
                            <h4 className="font-medium">Under Review</h4>
                            <p className="text-sm text-muted-foreground">
                              Our team is reviewing your application
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center opacity-50">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white mr-4">3</div>
                          <div>
                            <h4 className="font-medium">Decision</h4>
                            <p className="text-sm text-muted-foreground">
                              Pending review completion
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          The review process typically takes 3-5 business days.
                        </p>
                        <Button variant="outline">Contact Support</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-background rounded-[12px]">
                      <h3 className="text-xl font-bold mb-2">No Application Found</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't submitted an application yet. Apply now to become a creator.
                      </p>
                      <Button onClick={() => setActiveTab('apply')}>Apply Now</Button>
                    </div>
                  )
                ) : (
                  <div className="text-center p-8 bg-background rounded-[12px]">
                    <h3 className="text-xl font-bold mb-2">Sign In to View Status</h3>
                    <p className="text-muted-foreground mb-6">
                      Please sign in to view your application status.
                    </p>
                    <Button asChild>
                      <a href="/login">Sign In</a>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <h2 className="font-inter text-3xl font-bold text-center mb-4">Creator Benefits</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Join our platform and enjoy these exclusive benefits as a PrintOn creator
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitive Royalties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Earn up to 15% royalty on every sale of products featuring your designs.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sell your designs to customers worldwide without dealing with international shipping.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Zero Upfront Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No inventory, no production costs, no risk. We handle everything from printing to delivery.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Creator Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with other designers, share tips, and participate in exclusive creator events.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="font-inter text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of creators who are already earning passive income by selling their designs on PrintOn.
          </p>
          <Button 
            size="lg" 
            onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Apply Now
          </Button>
        </div>
      </section>
    </>
  );
};

export default SellPage;
