import "server-only";
import { connection } from "next/server";
import { api, orNull } from "@/lib/api"; import { requireAdmin } from "@/lib/data/dal"; import type { Customer, Order, OrderStatus, PageResponse, Product, ProductQuery, User } from 
"@/lib/types"; 
  /** 
*	Админы өгөгдөл. Функц бүр эхлээд requireAdmin() дуудна. 
*	Идэвхгүй бараа, бусдын захиалга зэрэг нууц өгөгдөл тул кэшлэхгүй.  */ 
  
export async function adminSearchProducts({ onlyInactive, ...query }: ProductQuery): Promise<PageResponse<Product>> {
  await requireAdmin();
  const search = { ...query, includeInactive: true };
  if (!onlyInactive) return api<PageResponse<Product>>("/products", { query: search });

  // Backend "зөвхөн хасагдсан" параметргүй тул БҮХ барааг татаж, шүүгээд, өөрсдөө хуудаслана.
  const { page = 0, size = 15 } = query;
  const found: Product[] = [];
  for (let p = 0, last = false; !last; p++) {
    const batch = await api<PageResponse<Product>>("/products", { query: { ...search, page: p, size: 100 } });
    found.push(...batch.content.filter((product) => !product.active));
    last = batch.last;
  }

  const totalPages = Math.ceil(found.length / size);
  return {
    content: found.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements: found.length,
    totalPages,
    last: page >= totalPages - 1,
  };
}
  
/** Худалдаанаас хасагдсан барааг ч харна (ADMIN токентой). */ export async function adminGetProduct(id: number) {   await requireAdmin(); 
  return orNull(api<Product>(`/products/${id}`)); 
} 
  
export async function adminGetOrders(query: { status?: OrderStatus; customerId?: number; page?: 
number }) { 
  await requireAdmin(); 
  return api<PageResponse<Order>>("/orders", { query: { ...query, size: 15 } }); 
} 
  
export async function adminGetUsers({ username, page = 0 }: { username?: string; page?: number } = {}): Promise<PageResponse<User>> {
  await requireAdmin();
  const size = 15;
  if (!username) return api<PageResponse<User>>("/users", { query: { page, size } });

  // Backend нэрээр хайх параметргүй тул БҮХ хэрэглэгчийг татаж, шүүгээд, өөрсдөө хуудаслана.
  const keyword = username.toLowerCase();
  const found: User[] = [];
  for (let p = 0, last = false; !last; p++) {
    const batch = await api<PageResponse<User>>("/users", { query: { page: p, size: 100 } });
    found.push(...batch.content.filter((u) => u.username.toLowerCase().includes(keyword)));
    last = batch.last;
  }

  const totalPages = Math.ceil(found.length / size);
  return {
    content: found.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements: found.length,
    totalPages,
    last: page >= totalPages - 1,
  };
}

/**
 * Өнөөдөр үүссэн, цуцлагдаагүй захиалгын нийт дүн.
 * Backend-д ийм endpoint байхгүй тул шинэ захиалгаас эхлэн татаж, өмнөх өдрийн захиалга гармагц зогсоно.
 * "Өнөөдөр" гэдгийг энэ (Next.js) серверийн цагийн бүсээр тооцно.
 */
async function getTodaySales() {
  await connection(); // new Date()-ийг хүсэлт бүрт тооцно (prerender хийхгүй)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  let total = 0;
  for (let page = 0, done = false; !done; page++) {
    const batch = await api<PageResponse<Order>>("/orders", { query: { page, size: 100, sort: "createdAt,desc" } });
    for (const order of batch.content) {
      if (new Date(order.createdAt) < startOfToday) return total;
      if (order.status !== "CANCELLED") total += order.totalAmount;
    }
    done = batch.last;
  }
  return total;
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
  
  const [products, users, customers, pending, paid, shipped, recent, todaySales] = await Promise.all([    api<PageResponse<Product>>("/products", { query: { includeInactive: true, size: 1 } }),     api<PageResponse<User>>("/users", { query: { size: 1 } }),     api<PageResponse<Customer>>("/customers", { query: { size: 1 } }),     count("PENDING"),     count("PAID"),     count("SHIPPED"),     api<PageResponse<Order>>("/orders", { query: { size: 5, sort: "createdAt,desc" } }),     getTodaySales(),   ]);
    return {     productCount: products.totalElements,     userCount: users.totalElements,     customerCount: customers.totalElements,     orderCount: recent.totalElements,     pending,     paid,     shipped,     recentOrders: recent.content,     todaySales,   }; } 
