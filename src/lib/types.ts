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

// ---------- Захиалга ----------

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
