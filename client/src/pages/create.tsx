import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from '@/lib/constants';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { initializeCanvas, addText, addImage, saveCanvasAsJSON, saveCanvasAsImage } from '@/lib/fabricHelper';
import DesignCanvas from '@/components/design/DesignCanvas';
import DesignControls from '@/components/design/DesignControls';

interface DesignData {
  json: string;
  imageUrl: string;
}

const CreatePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [canvas, setCanvas] = useState<any | null>(null);
  const [design, setDesign] = useState<DesignData | null>(null);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    // Initialize canvas when component mounts
    const fabricCanvas = initializeCanvas('design-canvas', 500, 500);
    setCanvas(fabricCanvas);

    // Cleanup on unmount
    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // For quick draft saving
  const saveDraftMutation = useMutation({
    mutationFn: async (designData: {
      imageUrl: string;
      canvasJson: object;
    }) => {
      if (!user) {
        throw new Error("You must be logged in to save designs");
      }
      
      // Create a reference to the Firebase Storage path
      const { storage, db } = await import('@/lib/firebase');
      const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
      const { collection, addDoc } = await import('firebase/firestore');
      
      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `userDesigns/${user.firebaseUid}/drafts/${Date.now()}_draft.png`);
      
      // Remove the data:image/png;base64, prefix before uploading
      const imageData = designData.imageUrl.replace(/^data:image\/\w+;base64,/, '');
      
      // Upload the image
      await uploadString(imageRef, imageData, 'base64');
      const downloadUrl = await getDownloadURL(imageRef);
      
      // Save to Firestore as a draft
      const draftDoc = {
        userId: user.id,
        firebaseUid: user.firebaseUid,
        title: `Draft Design ${new Date().toLocaleDateString()}`,
        imageUrl: downloadUrl,
        canvasJson: designData.canvasJson,
        createdAt: new Date().toISOString(),
        isDraft: true
      };
      
      // Store in the userDesigns/drafts collection
      return await addDoc(collection(db, `userDesigns/${user.firebaseUid}/drafts`), draftDoc);
    },
    onSuccess: () => {
      toast({
        title: "Draft Saved!",
        description: "Your design has been saved as a draft. You can find it in your account dashboard.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
      console.error("Error saving draft:", error);
    }
  });
  
  // For publishing designs
  const saveDesignMutation = useMutation({
    mutationFn: async (designData: {
      title: string;
      description: string;
      imageUrl: string;
      canvasJson: object;
      categories: string[];
      isPublic: boolean;
    }) => {
      if (!user) {
        throw new Error("You must be logged in to save designs");
      }
      
      // Create a reference to the Firebase Storage path
      const { storage, db } = await import('@/lib/firebase');
      const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
      const { collection, addDoc, doc, setDoc } = await import('firebase/firestore');
      
      // First, upload the image to Firebase Storage
      const imageRef = ref(storage, `userDesigns/${user.firebaseUid}/${Date.now()}_design.png`);
      
      // Remove the data:image/png;base64, prefix before uploading
      const imageData = designData.imageUrl.replace(/^data:image\/\w+;base64,/, '');
      
      // Upload the image
      const uploadResult = await uploadString(imageRef, imageData, 'base64');
      const downloadUrl = await getDownloadURL(imageRef);
      
      // Save metadata to Firestore
      const designDoc = {
        userId: user.id,
        firebaseUid: user.firebaseUid,
        title: designData.title,
        description: designData.description,
        imageUrl: downloadUrl,
        canvasJson: designData.canvasJson,
        categories: designData.categories,
        isPublic: designData.isPublic,
        isApproved: false, // Needs admin approval
        createdAt: new Date().toISOString(),
      };
      
      // Store the design data
      let docRef;
      if (designData.isPublic) {
        // If public, store in the designRequests collection
        docRef = await addDoc(collection(db, 'designRequests'), {
          ...designDoc,
          status: 'pending'
        });
      } else {
        // If private, store in the userDesigns collection
        docRef = await addDoc(collection(db, `userDesigns/${user.firebaseUid}/designs`), designDoc);
      }
      
      // Also store a reference in our database
      return await apiRequest('POST', '/api/designs', {
        userId: user.id,
        title: designData.title,
        description: designData.description,
        imageUrl: downloadUrl,
        canvasJson: designData.canvasJson,
        categories: designData.categories,
        isPublic: designData.isPublic,
        isApproved: false, // Needs admin approval
        firebaseDocId: docRef.id // Store reference to Firebase document
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/designs'] });
      toast({
        title: "Design Saved!",
        description: isPublic 
          ? "Your design has been submitted for approval and will be visible once approved." 
          : "Your design has been saved to your drafts.",
      });
      setIsPublishDialogOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedCategories([]);
      setIsPublic(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save design. Please try again.",
        variant: "destructive"
      });
      console.error("Error saving design:", error);
    }
  });

  const handleSaveDesign = (designData: DesignData) => {
    setDesign(designData);
    toast({
      title: "Design Ready",
      description: "Your design is ready to publish!"
    });
  };
  
  // Quick save as draft without needing to fill out details
  const handleQuickSaveDraft = () => {
    if (!design) {
      toast({
        title: "No design",
        description: "Please create a design first before saving",
        variant: "destructive"
      });
      return;
    }
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your designs",
        variant: "destructive"
      });
      return;
    }
    
    saveDraftMutation.mutate({
      imageUrl: design.imageUrl,
      canvasJson: JSON.parse(design.json)
    });
  };

  const handleAddText = () => {
    if (canvas) {
      addText(canvas);
    }
  };

  const handleUploadImage = (file: File) => {
    if (!canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgUrl = e.target?.result as string;
      addImage(canvas, imgUrl).catch((error) => {
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
        console.error("Error uploading image:", error);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePublishDesign = () => {
    if (!design) {
      toast({
        title: "No design",
        description: "Please create a design first",
        variant: "destructive"
      });
      return;
    }

    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your design",
        variant: "destructive"
      });
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: "Categories required",
        description: "Please select at least one category",
        variant: "destructive"
      });
      return;
    }

    // Prepare design data for API
    const designData = {
      title,
      description,
      imageUrl: design.imageUrl,
      canvasJson: JSON.parse(design.json),
      categories: selectedCategories,
      isPublic
    };

    saveDesignMutation.mutate(designData);
  };

  return (
    <>
      <Helmet>
        <title>Create Your Custom T-Shirt | PrintOn</title>
        <meta name="description" content="Design your own custom t-shirt with our easy-to-use design tool. Upload images, add text, and create a unique shirt that reflects your style." />
        <meta property="og:title" content="Create Your Custom T-Shirt | PrintOn" />
        <meta property="og:description" content="Design your own custom t-shirt with our easy-to-use design tool." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="bg-secondary py-6">
        <div className="container">
          <h1 className="font-inter text-3xl font-bold mb-2">Design Your Custom T-Shirt</h1>
          <p className="text-muted-foreground">Create your unique design with our easy-to-use design tool</p>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <DesignCanvas onSaveDesign={handleSaveDesign} />
          </div>
          
          <div className="lg:w-1/3">
            <DesignControls 
              canvas={canvas} 
              onUploadImage={handleUploadImage} 
            />
            
            <div className="mt-6 bg-secondary rounded-[12px] p-6">
              <h3 className="font-inter text-lg font-semibold mb-4">Save & Publish</h3>
              
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full" 
                  disabled={!design}
                  onClick={() => setIsPublishDialogOpen(true)}
                >
                  {isAuthenticated ? 'Publish Design' : 'Sign in to Publish'}
                </Button>
                
                {isAuthenticated && (
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="w-full" 
                    disabled={!design || saveDraftMutation.isPending}
                    onClick={handleQuickSaveDraft}
                  >
                    {saveDraftMutation.isPending ? 'Saving...' : 'Save as Draft'}
                  </Button>
                )}
                
                <p className="text-sm text-muted-foreground">
                  By publishing, your design will be reviewed by our team and, once approved, will be available for purchase.
                  {isAuthenticated && ' Or save as a draft to finish later.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Publish Your Design</DialogTitle>
              <DialogDescription>
                Fill in the details below to publish your design. Once submitted, it will be reviewed by our team.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter a title for your design" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your design..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Categories (select at least one)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                      />
                      <Label 
                        htmlFor={`category-${category.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPublic" 
                  checked={isPublic}
                  onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                />
                <Label htmlFor="isPublic">Make this design public and available for purchase</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsPublishDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePublishDesign}
                disabled={saveDesignMutation.isPending}
              >
                {saveDesignMutation.isPending ? 'Publishing...' : 'Publish Design'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="mt-16">
          <h2 className="font-inter text-2xl font-bold mb-6">Design Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary rounded-[12px] p-6">
              <h3 className="font-medium text-lg mb-3">Keep it Simple</h3>
              <p className="text-muted-foreground">
                Simple designs often look the best on t-shirts. Too many elements can make your design appear cluttered.
              </p>
            </div>
            
            <div className="bg-secondary rounded-[12px] p-6">
              <h3 className="font-medium text-lg mb-3">Consider the T-shirt Color</h3>
              <p className="text-muted-foreground">
                Make sure your design has enough contrast with the t-shirt color for visibility.
              </p>
            </div>
            
            <div className="bg-secondary rounded-[12px] p-6">
              <h3 className="font-medium text-lg mb-3">Use High-Quality Images</h3>
              <p className="text-muted-foreground">
                For the best print results, use high-resolution images and graphics in your design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePage;
