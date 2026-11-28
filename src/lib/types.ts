/**
 * Backend-ийн DTO-уудын TypeScript хувилбар (mn.onlineshop.dto.*).
 * Backend-ийн record өөрчлөгдвөл энд мөн өөрчилнө.
 * Мобайл апп-ын src/api/types.ts-тэй ижил.
 */

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

/** Backend-ийн нэгдсэн алдааны хариу (exception/ApiError.java). */
export type ApiErrorBody = {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
  fieldErrors?: Record<string, string>;
};

// ---------- Auth ----------

export type TokenResponse = {
  accessToken: string;
  tokenType: "Bearer";
  /** секунд */
  expiresIn: number;
  refreshToken: string;
  /** секунд */
  refreshExpiresIn: number;
};

export type Role = "ROLE_USER" | "ROLE_ADMIN";

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  enabled: boolean;
  roles: Role[];
  createdAt: string;
};

export type Customer = {
  id: number;
  /** null бол бүртгэлгүй (админ гараар нэмсэн) захиалагч */
  userId: number | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
};

// ---------- Каталог ----------

export type Category = { id: number; name: string; description: string | null };

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  imageUrl: string | null;
  active: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export type ProductQuery = {
  categoryId?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Зөвхөн нөөцтэй бараа. Backend дэмждэггүй тул searchProducts дотор шүүнэ */
  inStock?: boolean;
  /** Админ: зөвхөн хасагдсан бараа. Backend дэмждэггүй тул adminSearchProducts дотор шүүнэ */
  onlyInactive?: boolean;
  page?: number;
  size?: number;
  sort?: string;
};

// ---------- Сагс ----------

export type CartItem = {
  productId: number;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
  /** false бол худалдаанаас хасагдсан эсвэл нөөц хүрэлцэхгүй */
  available: boolean;
};

export type Cart = {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  /** Бүх бараа захиалах боломжтой эсэх */
  checkoutReady: boolean;
};

// ---------- Захиалга ----------

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  customerId: number;
  customerName: string;
  shippingAddress: string | null;
  shippingCity: string | null;
  phone: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};
