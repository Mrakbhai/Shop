import { 
  User, InsertUser, 
  CreatorApplication, InsertCreatorApplication,
  Design, InsertDesign,
  Product, InsertProduct,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Review, InsertReview,
  Coupon, InsertCoupon,
  UserCoupon, InsertUserCoupon,
  UserRole, ApplicationStatus, OrderStatus
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Creator application operations
  getCreatorApplication(id: number): Promise<CreatorApplication | undefined>;
  getCreatorApplicationByUserId(userId: number): Promise<CreatorApplication | undefined>;
  createCreatorApplication(application: InsertCreatorApplication): Promise<CreatorApplication>;
  updateCreatorApplication(id: number, data: Partial<InsertCreatorApplication>): Promise<CreatorApplication>;
  getAllCreatorApplications(): Promise<CreatorApplication[]>;
  
  // Design operations
  getDesign(id: number): Promise<Design | undefined>;
  createDesign(design: InsertDesign): Promise<Design>;
  updateDesign(id: number, data: Partial<InsertDesign>): Promise<Design>;
  getDesignsByUserId(userId: number): Promise<Design[]>;
  getAllDesigns(): Promise<Design[]>;
  getPublicDesigns(): Promise<Design[]>;
  getApprovedDesigns(): Promise<Design[]>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product>;
  getProductsByCreatorId(creatorId: number): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  
  // Order item operations
  getOrderItem(id: number): Promise<OrderItem | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByProductId(productId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;
  
  // Coupon operations
  getCoupon(id: number): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, data: Partial<InsertCoupon>): Promise<Coupon>;
  incrementCouponUses(id: number): Promise<Coupon>;
  getActiveCoupons(): Promise<Coupon[]>;
  getUserCoupons(userId: number): Promise<UserCoupon[]>;
  assignCouponToUser(userCoupon: InsertUserCoupon): Promise<UserCoupon>;
  useCoupon(id: number, orderId: number): Promise<UserCoupon>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private creatorApplications: Map<number, CreatorApplication>;
  private designs: Map<number, Design>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  private coupons: Map<number, Coupon>;
  private userCoupons: Map<number, UserCoupon>;
  
  private userCurrentId: number;
  private applicationCurrentId: number;
  private designCurrentId: number;
  private productCurrentId: number;
  private orderCurrentId: number;
  private orderItemCurrentId: number;
  private reviewCurrentId: number;
  private couponCurrentId: number;
  private userCouponCurrentId: number;

  constructor() {
    this.users = new Map();
    this.creatorApplications = new Map();
    this.designs = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.coupons = new Map();
    this.userCoupons = new Map();
    
    this.userCurrentId = 1;
    this.applicationCurrentId = 1;
    this.designCurrentId = 1;
    this.productCurrentId = 1;
    this.orderCurrentId = 1;
    this.orderItemCurrentId = 1;
    this.reviewCurrentId = 1;
    this.couponCurrentId = 1;
    this.userCouponCurrentId = 1;

    // Create admin user
    this.createUser({
      firebaseUid: 'admin123',
      username: 'admin',
      email: 'admin@printon.com',
      role: UserRole.ADMIN,
      displayName: 'Admin',
      bio: 'System administrator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    });

    // Create some creator users
    const creator1 = this.createUser({
      firebaseUid: 'creator1',
      username: 'sara_johnson',
      email: 'sara@example.com',
      role: UserRole.CREATOR,
      displayName: 'Sara Johnson',
      bio: 'Minimalist designer with a passion for clean lines and simple forms.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara'
    });

    const creator2 = this.createUser({
      firebaseUid: 'creator2',
      username: 'mike_zhang',
      email: 'mike@example.com',
      role: UserRole.CREATOR,
      displayName: 'Mike Zhang',
      bio: 'Anime and pop culture enthusiast creating unique character designs.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    });

    // Create some designs
    const design1 = this.createDesign({
      userId: creator1.id,
      title: 'Geometric Minimalist',
      description: 'Clean geometric design with minimal elements.',
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
      categories: ['Minimalist', 'Abstract Art'],
      isPublic: true,
      isApproved: true,
      canvasJson: { objects: [] }
    });

    const design2 = this.createDesign({
      userId: creator2.id,
      title: 'Anime Hero',
      description: 'Colorful anime-inspired hero character.',
      imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1',
      categories: ['Anime', 'Pop Culture'],
      isPublic: true,
      isApproved: true,
      canvasJson: { objects: [] }
    });

    // Create some products
    this.createProduct({
      name: 'Geometric Minimalist T-Shirt',
      description: 'A sleek minimalist design featuring geometric patterns.',
      price: 29.99,
      designId: design1.id,
      creatorId: creator1.id,
      colors: ['black', 'white', 'gray', 'blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'Minimalist',
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820'
    });

    this.createProduct({
      name: 'Anime Hero T-Shirt',
      description: 'Show your love for anime with this hero-inspired design.',
      price: 32.99,
      designId: design2.id,
      creatorId: creator2.id,
      colors: ['black', 'white', 'red'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'Anime',
      imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1'
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error(`User with id ${id} not found`);
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Creator application operations
  async getCreatorApplication(id: number): Promise<CreatorApplication | undefined> {
    return this.creatorApplications.get(id);
  }

  async getCreatorApplicationByUserId(userId: number): Promise<CreatorApplication | undefined> {
    return Array.from(this.creatorApplications.values()).find(
      (app) => app.userId === userId
    );
  }

  async createCreatorApplication(application: InsertCreatorApplication): Promise<CreatorApplication> {
    const id = this.applicationCurrentId++;
    const creatorApp: CreatorApplication = { ...application, id, createdAt: new Date() };
    this.creatorApplications.set(id, creatorApp);
    return creatorApp;
  }

  async updateCreatorApplication(id: number, data: Partial<InsertCreatorApplication>): Promise<CreatorApplication> {
    const application = await this.getCreatorApplication(id);
    if (!application) throw new Error(`Creator application with id ${id} not found`);
    
    const updatedApplication = { ...application, ...data };
    this.creatorApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  async getAllCreatorApplications(): Promise<CreatorApplication[]> {
    return Array.from(this.creatorApplications.values());
  }

  // Design operations
  async getDesign(id: number): Promise<Design | undefined> {
    return this.designs.get(id);
  }

  async createDesign(design: InsertDesign): Promise<Design> {
    const id = this.designCurrentId++;
    const newDesign: Design = { ...design, id, createdAt: new Date() };
    this.designs.set(id, newDesign);
    return newDesign;
  }

  async updateDesign(id: number, data: Partial<InsertDesign>): Promise<Design> {
    const design = await this.getDesign(id);
    if (!design) throw new Error(`Design with id ${id} not found`);
    
    const updatedDesign = { ...design, ...data };
    this.designs.set(id, updatedDesign);
    return updatedDesign;
  }

  async getDesignsByUserId(userId: number): Promise<Design[]> {
    return Array.from(this.designs.values()).filter(
      (design) => design.userId === userId
    );
  }

  async getAllDesigns(): Promise<Design[]> {
    return Array.from(this.designs.values());
  }

  async getPublicDesigns(): Promise<Design[]> {
    return Array.from(this.designs.values()).filter(
      (design) => design.isPublic
    );
  }

  async getApprovedDesigns(): Promise<Design[]> {
    return Array.from(this.designs.values()).filter(
      (design) => design.isApproved && design.isPublic
    );
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const newProduct: Product = { ...product, id, createdAt: new Date() };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) throw new Error(`Product with id ${id} not found`);
    
    const updatedProduct = { ...product, ...data };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async getProductsByCreatorId(creatorId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.creatorId === creatorId
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const newOrder: Order = { ...order, id, createdAt: new Date() };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order> {
    const order = await this.getOrder(id);
    if (!order) throw new Error(`Order with id ${id} not found`);
    
    const updatedOrder = { ...order, ...data };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  // Order item operations
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    return this.orderItems.get(id);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemCurrentId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const newReview: Review = { ...review, id, createdAt: new Date() };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }

  // Coupon operations
  async getCoupon(id: number): Promise<Coupon | undefined> {
    return this.coupons.get(id);
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    return Array.from(this.coupons.values()).find(coupon => coupon.code.toLowerCase() === code.toLowerCase());
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const id = this.couponCurrentId++;
    const newCoupon: Coupon = { 
      ...coupon, 
      id, 
      createdAt: new Date(),
      currentUses: 0
    };
    this.coupons.set(id, newCoupon);
    return newCoupon;
  }

  async updateCoupon(id: number, data: Partial<InsertCoupon>): Promise<Coupon> {
    const coupon = await this.getCoupon(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    
    const updatedCoupon: Coupon = { ...coupon, ...data };
    this.coupons.set(id, updatedCoupon);
    return updatedCoupon;
  }

  async incrementCouponUses(id: number): Promise<Coupon> {
    const coupon = await this.getCoupon(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    
    const updatedCoupon: Coupon = { 
      ...coupon, 
      currentUses: coupon.currentUses + 1 
    };
    
    // Automatically disable the coupon if max uses reached
    if (updatedCoupon.currentUses >= updatedCoupon.maxUses) {
      updatedCoupon.isActive = false;
    }
    
    this.coupons.set(id, updatedCoupon);
    return updatedCoupon;
  }

  async getActiveCoupons(): Promise<Coupon[]> {
    const now = new Date();
    return Array.from(this.coupons.values()).filter(coupon => 
      coupon.isActive && 
      new Date(coupon.expiresAt) > now &&
      coupon.currentUses < coupon.maxUses
    );
  }

  async getUserCoupons(userId: number): Promise<UserCoupon[]> {
    return Array.from(this.userCoupons.values()).filter(uc => uc.userId === userId);
  }

  async assignCouponToUser(userCoupon: InsertUserCoupon): Promise<UserCoupon> {
    const id = this.userCouponCurrentId++;
    const newUserCoupon: UserCoupon = { 
      ...userCoupon, 
      id,
      createdAt: new Date(),
      usedAt: null,
      orderId: null 
    };
    this.userCoupons.set(id, newUserCoupon);
    return newUserCoupon;
  }

  async useCoupon(id: number, orderId: number): Promise<UserCoupon> {
    const userCoupon = this.userCoupons.get(id);
    if (!userCoupon) {
      throw new Error('User coupon not found');
    }
    
    if (userCoupon.usedAt) {
      throw new Error('Coupon already used');
    }
    
    // Mark as used
    const updatedUserCoupon: UserCoupon = { 
      ...userCoupon, 
      usedAt: new Date(),
      orderId
    };
    
    // Increment usage count for the coupon
    await this.incrementCouponUses(userCoupon.couponId);
    
    this.userCoupons.set(id, updatedUserCoupon);
    return updatedUserCoupon;
  }
}

export const storage = new MemStorage();
