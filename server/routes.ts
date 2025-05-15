import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCreatorApplicationSchema, 
  insertDesignSchema, 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertReviewSchema,
  insertCouponSchema,
  insertUserCouponSchema,
  UserRole
} from "@shared/schema";
import { z } from "zod";

// Helper function to validate request body
function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: () => void) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        next();
      }
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication APIs
  app.post('/api/auth/register', validateBody(insertUserSchema), async (req, res) => {
    try {
      const { username, email } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Create new user with default role
      const user = await storage.createUser({
        ...req.body,
        role: UserRole.USER
      });
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Return user without password
      const { password: userPassword, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error during login' });
    }
  });
  
  // User APIs
  app.get('/api/users/me', async (req, res) => {
    try {
      // In a real app, you would get the user ID from the session/token
      // For simplicity, let's use a mock user ID
      const userId = 1; // This would come from authentication
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  });
  
  // Creator application APIs
  app.post('/api/creator/apply', validateBody(insertCreatorApplicationSchema), async (req, res) => {
    try {
      const { userId } = req.body;
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user already has an application
      const existingApplication = await storage.getCreatorApplicationByUserId(userId);
      if (existingApplication) {
        return res.status(400).json({ message: 'Application already submitted' });
      }
      
      // Create application
      const application = await storage.createCreatorApplication(req.body);
      
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ message: 'Error submitting application' });
    }
  });
  
  app.get('/api/creator/applications', async (req, res) => {
    try {
      // In a real app, would check for admin role
      const applications = await storage.getAllCreatorApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applications' });
    }
  });
  
  app.patch('/api/creator/applications/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      // Update application status
      const application = await storage.updateCreatorApplication(id, { status });
      
      // If approved, update user role
      if (status === 'approved') {
        await storage.updateUser(application.userId, { role: UserRole.CREATOR });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: 'Error updating application' });
    }
  });
  
  // Design APIs
  app.post('/api/designs', validateBody(insertDesignSchema), async (req, res) => {
    try {
      const design = await storage.createDesign(req.body);
      res.status(201).json(design);
    } catch (error) {
      res.status(500).json({ message: 'Error creating design' });
    }
  });
  
  app.get('/api/designs', async (req, res) => {
    try {
      const { userId, public: isPublic, approved } = req.query;
      
      if (userId) {
        const designs = await storage.getDesignsByUserId(parseInt(userId as string));
        return res.json(designs);
      }
      
      if (isPublic === 'true' && approved === 'true') {
        const designs = await storage.getApprovedDesigns();
        return res.json(designs);
      }
      
      if (isPublic === 'true') {
        const designs = await storage.getPublicDesigns();
        return res.json(designs);
      }
      
      // In a real app, would check for admin role
      const designs = await storage.getAllDesigns();
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching designs' });
    }
  });
  
  app.get('/api/designs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getDesign(id);
      
      if (!design) {
        return res.status(404).json({ message: 'Design not found' });
      }
      
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching design' });
    }
  });
  
  app.patch('/api/designs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.updateDesign(id, req.body);
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: 'Error updating design' });
    }
  });
  
  // Product APIs
  app.post('/api/products', validateBody(insertProductSchema), async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product' });
    }
  });
  
  app.get('/api/products', async (req, res) => {
    try {
      const { creatorId, category } = req.query;
      
      if (creatorId) {
        const products = await storage.getProductsByCreatorId(parseInt(creatorId as string));
        return res.json(products);
      }
      
      if (category) {
        const products = await storage.getProductsByCategory(category as string);
        return res.json(products);
      }
      
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  });
  
  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product' });
    }
  });
  
  // Order APIs
  app.post('/api/orders', validateBody(insertOrderSchema), async (req, res) => {
    try {
      const order = await storage.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order' });
    }
  });
  
  app.post('/api/orders/:orderId/items', validateBody(insertOrderItemSchema), async (req, res) => {
    try {
      const orderItem = await storage.createOrderItem(req.body);
      res.status(201).json(orderItem);
    } catch (error) {
      res.status(500).json({ message: 'Error adding order item' });
    }
  });
  
  app.get('/api/orders', async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (userId) {
        const orders = await storage.getOrdersByUserId(parseInt(userId as string));
        return res.json(orders);
      }
      
      // In a real app, would check for admin role
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders' });
    }
  });
  
  app.get('/api/orders/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Get order items
      const items = await storage.getOrderItemsByOrderId(id);
      
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order' });
    }
  });
  
  app.patch('/api/orders/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.updateOrder(id, req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error updating order' });
    }
  });
  
  // Review APIs
  app.post('/api/reviews', validateBody(insertReviewSchema), async (req, res) => {
    try {
      const review = await storage.createReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: 'Error creating review' });
    }
  });
  
  app.get('/api/products/:productId/reviews', async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getReviewsByProductId(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews' });
    }
  });
  
  // Integration with Printify (mock)
  app.post('/api/printify/create-order', async (req, res) => {
    try {
      // Mock Printify integration
      res.json({
        success: true,
        printify_order_id: `PO-${Math.floor(Math.random() * 1000000)}`,
        status: 'processing'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating Printify order' });
    }
  });
  
  // Integration with Razorpay/Cashfree (mock)
  app.post('/api/payment/create', async (req, res) => {
    try {
      // Mock payment gateway integration
      res.json({
        payment_id: `PAY-${Math.floor(Math.random() * 1000000)}`,
        payment_link: 'https://example.com/pay',
        status: 'created'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating payment' });
    }
  });
  
  app.post('/api/payment/verify', async (req, res) => {
    try {
      // Mock payment verification
      res.json({
        verified: true,
        transaction_id: `TX-${Math.floor(Math.random() * 1000000)}`
      });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying payment' });
    }
  });
  
  // Coupon routes
  app.get('/api/coupons', async (req, res) => {
    try {
      // Admin endpoint to get all coupons
      // In a real app, would check for admin role
      const coupons = await storage.getActiveCoupons();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coupons' });
    }
  });
  
  app.post('/api/coupons', validateBody(insertCouponSchema), async (req, res) => {
    try {
      // Admin endpoint to create a coupon
      // In a real app, would check for admin role
      const coupon = await storage.createCoupon(req.body);
      res.status(201).json(coupon);
    } catch (error) {
      res.status(500).json({ message: 'Error creating coupon' });
    }
  });
  
  app.get('/api/coupons/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const coupon = await storage.getCoupon(id);
      
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coupon' });
    }
  });
  
  app.get('/api/coupons/code/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const coupon = await storage.getCouponByCode(code);
      
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      
      // Check if coupon is still valid
      const now = new Date();
      if (!coupon.isActive || coupon.currentUses >= coupon.maxUses || new Date(coupon.expiresAt) < now) {
        return res.status(400).json({ message: 'Coupon is no longer valid' });
      }
      
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: 'Error validating coupon' });
    }
  });
  
  app.post('/api/coupons/:id/assign', validateBody(insertUserCouponSchema), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const coupon = await storage.getCoupon(id);
      
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      
      // Check if coupon is still valid and has uses left
      const now = new Date();
      if (!coupon.isActive || coupon.currentUses >= coupon.maxUses || new Date(coupon.expiresAt) < now) {
        return res.status(400).json({ message: 'Coupon is no longer valid' });
      }
      
      // Create user coupon assignment
      const userCoupon = await storage.assignCouponToUser(req.body);
      res.status(201).json(userCoupon);
    } catch (error) {
      res.status(500).json({ message: 'Error assigning coupon to user' });
    }
  });
  
  app.get('/api/users/:userId/coupons', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userCoupons = await storage.getUserCoupons(userId);
      
      // For each user coupon, get the coupon details
      const couponsWithDetails = await Promise.all(
        userCoupons.map(async (uc) => {
          const coupon = await storage.getCoupon(uc.couponId);
          return {
            ...uc,
            coupon
          };
        })
      );
      
      res.json(couponsWithDetails);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user coupons' });
    }
  });
  
  app.post('/api/user-coupons/:id/use', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
      }
      
      const result = await storage.useCoupon(id, orderId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Error using coupon'
      });
    }
  });
  
  // Razorpay Coupon Purchase API
  app.post('/api/coupons/purchase', async (req, res) => {
    try {
      const { userId, amount, discountPercent } = req.body;
      
      if (!userId || !amount || !discountPercent) {
        return res.status(400).json({ message: 'User ID, amount, and discount percentage are required' });
      }
      
      // In a real app, this would create a Razorpay order
      const orderId = `order_${Math.floor(Math.random() * 1000000)}`;
      
      res.json({
        order_id: orderId,
        amount,
        currency: 'INR',
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
        // Other details needed for Razorpay checkout
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating purchase order' });
    }
  });
  
  // Callback for successful coupon purchase
  app.post('/api/coupons/purchase/success', async (req, res) => {
    try {
      const { 
        razorpay_payment_id, 
        razorpay_order_id, 
        razorpay_signature,
        userId,
        discountPercent
      } = req.body;
      
      // In a real app, verify payment signature
      // const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      
      // For demo, always valid
      const isValid = true;
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
      
      // Create a new coupon
      const coupon = await storage.createCoupon({
        code: `DISCOUNT${Math.floor(Math.random() * 10000)}`,
        discountPercent,
        maxUses: 1, // Single use coupon
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
        createdBy: userId,
        isActive: true
      });
      
      // Assign to user
      await storage.assignCouponToUser({
        userId,
        couponId: coupon.id
      });
      
      res.json({
        success: true,
        message: 'Coupon purchased successfully',
        coupon
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing payment' });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
