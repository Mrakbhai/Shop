import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  ADMIN = 'admin'
}

// Product categories enum
export enum ProductCategory {
  ANIME = 'Anime',
  MOTIVATIONAL = 'Motivational',
  GYM = 'Gym',
  SPORTS = 'Sports',
  FUNNY = 'Funny',
  MINIMALIST = 'Minimalist',
  AESTHETIC = 'Aesthetic',
  QUOTES = 'Quotes',
  ABSTRACT = 'Abstract Art',
  POP_CULTURE = 'Trends/Pop Culture',
  FESTIVE = 'Festive/Special Occasions',
  CUSTOM = 'Custom'
}

// Creator application status enum
export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default('user'),
  displayName: text("display_name"),
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow()
});

// Creator application model
export const creatorApplications = pgTable("creator_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default('pending'),
  portfolio: text("portfolio"),
  sample: text("sample_work"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow()
});

// Design model
export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  categories: text("categories").array().notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  isApproved: boolean("is_approved").notNull().default(false),
  canvasJson: jsonb("canvas_json").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  designId: integer("design_id").notNull().references(() => designs.id),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  colors: text("colors").array(),
  sizes: text("sizes").array(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default('pending'),
  total: doublePrecision("total").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Order items model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  color: text("color").notNull(),
  size: text("size").notNull(),
  price: doublePrecision("price").notNull()
});

// Reviews model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  firebaseUid: true,
  username: true,
  email: true,
  role: true,
  displayName: true,
  bio: true,
  avatar: true
});

export const insertCreatorApplicationSchema = createInsertSchema(creatorApplications).pick({
  userId: true,
  status: true,
  portfolio: true,
  sample: true,
  reason: true
});

export const insertDesignSchema = createInsertSchema(designs).pick({
  userId: true,
  title: true,
  description: true,
  imageUrl: true,
  categories: true,
  isPublic: true,
  isApproved: true,
  canvasJson: true
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  designId: true,
  creatorId: true,
  colors: true,
  sizes: true,
  category: true,
  imageUrl: true
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  status: true,
  total: true,
  shippingAddress: true,
  paymentMethod: true
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  color: true,
  size: true,
  price: true
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  productId: true,
  rating: true,
  comment: true
});

// Export Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCreatorApplication = z.infer<typeof insertCreatorApplicationSchema>;
export type CreatorApplication = typeof creatorApplications.$inferSelect;

export type InsertDesign = z.infer<typeof insertDesignSchema>;
export type Design = typeof designs.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Coupons schema
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountPercent: integer("discount_percent").notNull(),
  maxUses: integer("max_uses").notNull(),
  currentUses: integer("current_uses").default(0).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const userCoupons = pgTable("user_coupons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  couponId: integer("coupon_id").notNull().references(() => coupons.id),
  createdAt: timestamp("created_at").defaultNow(),
  usedAt: timestamp("used_at"),
  orderId: integer("order_id").references(() => orders.id),
});

export const insertCouponSchema = createInsertSchema(coupons).pick({
  code: true,
  discountPercent: true,
  maxUses: true,
  expiresAt: true,
  createdBy: true,
  isActive: true,
});

export const insertUserCouponSchema = createInsertSchema(userCoupons).pick({
  userId: true,
  couponId: true,
});

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

export type InsertUserCoupon = z.infer<typeof insertUserCouponSchema>;
export type UserCoupon = typeof userCoupons.$inferSelect;
