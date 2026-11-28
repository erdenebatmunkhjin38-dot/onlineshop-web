import "server-only"; 
import { api, orNull } from "@/lib/api"; import { requireAdmin } from "@/lib/data/dal"; import type { Customer, Order, OrderStatus, PageResponse, Product, ProductQuery, User } from 
"@/lib/types"; 
  /** 
*	Админы өгөгдөл. Функц бүр эхлээд requireAdmin() дуудна. 
*	Идэвхгүй бараа, бусдын захиалга зэрэг нууц өгөгдөл тул кэшлэхгүй.  */ 
  
export async function adminSearchProducts(query: ProductQuery) { 
  await requireAdmin(); 
  return api<PageResponse<Product>>("/products", { query: { ...query, includeInactive: true } }); 
} 
  
/** Худалдаанаас хасагдсан барааг ч харна (ADMIN токентой). */ export async function adminGetProduct(id: number) {   await requireAdmin(); 
  return orNull(api<Product>(`/products/${id}`)); 
} 
  
export async function adminGetOrders(query: { status?: OrderStatus; customerId?: number; page?: 
number }) { 
  await requireAdmin(); 
  return api<PageResponse<Order>>("/orders", { query: { ...query, size: 15 } }); 
} 
  
export async function adminGetUsers(page = 0) {   await requireAdmin(); 
  return api<PageResponse<User>>("/users", { query: { page, size: 15 } }); 
} 
  
export async function adminGetUser(id: number) {   await requireAdmin(); 
  return orNull(api<User>(`/users/${id}`)); 
} 
  
export async function adminGetCustomers(query: { name?: string; page?: number }) {   await requireAdmin(); 
  return api<PageResponse<Customer>>("/customers", { query: { ...query, size: 15 } }); 
} 
  
export async function adminGetCustomer(id: number) {   await requireAdmin(); 
  return orNull(api<Customer>(`/customers/${id}`)); 
} 
  
/** Хяналтын самбарын тоон үзүүлэлтүүд: хэд хэдэн хүсэлтийг ЗЭРЭГ илгээнэ (Promise.all). */ export async function adminGetDashboard() {   await requireAdmin(); 
  const count = (status: OrderStatus) => 
    api<PageResponse<Order>>("/orders", { query: { status, size: 1 } }).then((p) => p.totalElements); 
  
  const [products, users, customers, pending, paid, shipped, recent] = await Promise.all([     api<PageResponse<Product>>("/products", { query: { includeInactive: true, size: 1 } }),     api<PageResponse<User>>("/users", { query: { size: 1 } }),     api<PageResponse<Customer>>("/customers", { query: { size: 1 } }),     count("PENDING"),     count("PAID"),     count("SHIPPED"),     api<PageResponse<Order>>("/orders", { query: { size: 5 } }),   ]); 
    return {     productCount: products.totalElements,     userCount: users.totalElements,     customerCount: customers.totalElements,     orderCount: recent.totalElements,     pending,     paid,     shipped,     recentOrders: recent.content,   }; } 
