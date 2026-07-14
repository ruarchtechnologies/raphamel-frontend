/**
 * Raphamel Marketplace — TypeScript types
 * Mirrors NestJS backend entities and API response shapes.
 */

// ── Enums ────────────────────────────────────────────────────────────────────

export enum UserRole {
  SUPER_ADMIN  = 'super_admin',
  ADMIN        = 'admin',
  // VENDOR       = 'vendor',       // DISABLED: vendor/supplier feature removed
  // VENDOR_STAFF = 'vendor_staff', // DISABLED: vendor/supplier feature removed
  CUSTOMER     = 'customer',
}

// DISABLED: vendor/supplier feature removed
// export enum VendorStatus {
//   PENDING  = 'pending',
//   APPROVED = 'approved',
//   REJECTED = 'rejected',
//   SUSPENDED = 'suspended',
// }

export enum OrderStatus {
  PENDING    = 'pending',
  PROCESSING = 'processing',
  SHIPPED    = 'shipped',
  DELIVERED  = 'delivered',
  CANCELLED  = 'cancelled',
  REFUNDED   = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID    = 'paid',
  FAILED  = 'failed',
}

// DISABLED: vendor/supplier feature removed
// export enum PayoutStatus {
//   PENDING   = 'pending',
//   PROCESSED = 'processed',
//   FAILED    = 'failed',
// }

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED      = 'fixed',
}

// ── Core entities ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  // DISABLED: vendor/supplier feature removed
  // isBusinessVerified: boolean;
  // cacCertificateUrl?: string;
  // operatingLicenseUrl?: string;
  // businessVerificationRejectionReason?: string;
  // vendor?: Vendor;
  createdAt: string;
  updatedAt: string;
}

// DISABLED: vendor/supplier feature removed
// export interface Vendor {
//   id: string;
//   storeName: string;
//   slug: string;
//   description?: string;
//   logo?: string;
//   banner?: string;
//   status: VendorStatus;
//   commissionRate: number;
//   balance: number;
//   owner: User;
//   products?: Product[];
//   createdAt: string;
//   updatedAt: string;
// }

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  productCount?: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  // vendor: Vendor; // DISABLED: vendor/supplier feature removed
  category?: Category;
  variants?: ProductVariant[];
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: Coupon;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

export interface Order {
  id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  // vendorId: string; // DISABLED: vendor/supplier feature removed
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  productId: string;
  product?: Product;
  // vendorId?: string; // DISABLED: vendor/supplier feature removed
  rating: number;         /* 1–5 */
  title?: string;
  body: string;
  isReported: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  order?: Order;
  paystackReference: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxUsageCount?: number;
  usageCount: number;
  expiresAt?: string;
  isActive: boolean;
  // vendorId?: string; // DISABLED: vendor/supplier feature removed
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface PlatformSettings {
  id: string;
  key: string;
  siteName?: string;
  currency?: string;
  currencySymbol?: string;
  taxRate?: number;
  defaultCommissionRate?: number;
  minPayoutThreshold?: number;
  freeShippingThreshold?: number;
  maintenanceMode?: boolean;
}

// ── Nested / value objects ────────────────────────────────────────────────────

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

// ── API response wrappers ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface MessageResponse {
  message: string;
}

// ── UI / component helpers ────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ImageItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// ── Filters / query params ────────────────────────────────────────────────────

export interface ProductFilters {
  categoryId?: string;
  // vendorId?: string; // DISABLED: vendor/supplier feature removed
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

// DISABLED: vendor/supplier feature removed
// export interface VendorFilters {
//   search?: string;
//   status?: VendorStatus;
//   page?: number;
//   limit?: number;
// }

// ── Dashboard stats ───────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalUsers: number;
  // totalVendors: number; // DISABLED: vendor/supplier feature removed
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface SalesAnalytics {
  salesByDay: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
}

// DISABLED: vendor/supplier feature removed
// export interface VendorDashboardStats {
//   totalProducts: number;
//   totalOrders: number;
//   totalRevenue: number;
//   balance: number;
//   pendingPayouts: number;
// }
