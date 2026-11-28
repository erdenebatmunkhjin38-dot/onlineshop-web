import "server-only"; 
import { api, orNull } from "@/lib/api"; import { requireUser } from "@/lib/data/dal"; 
import type { Cart, Customer, Order, OrderStatus, PageResponse, User } from "@/lib/types"; 
  /** 
*	Нэвтэрсэн хэрэглэгчийн өөрийн өгөгдөл (/users/me/**). 
*	Хэрэглэгч бүрт өөр тул серверт кэшлэхгүй: хүсэлт бүрт шинээр татна. 
*	Ийм компонентыг <Suspense> дотор байрлуулна.  */ 
  
export async function getMe() {   await requireUser(); 
  return api<User>("/users/me"); 
} 
  
/** Хүргэлтийн профайл (байхгүй бол backend автоматаар үүсгэнэ). */ export async function getMyCustomer() {   await requireUser();   return api<Customer>("/users/me/customer"); 
} 
  
export async function getCart() {   await requireUser();   return api<Cart>("/users/me/cart"); 
} 
  
export async function getMyOrders(page = 0, status?: OrderStatus): Promise<PageResponse<Order>> {
  await requireUser();
  const size = 10;
  if (!status) return fetchMyOrders(page, size);

  // Backend-ийн /users/me/orders төлөвөөр шүүх параметргүй. Нэг хуудсыг л шүүвэл хуудаслалт буруу болно.
  // Тиймээс бүх захиалгыг татаж, шүүгээд, дараа нь өөрсдөө хуудаслана.
  const matched: Order[] = [];
  for (let i = 0, last = false; !last; i++) {
    const batch = await fetchMyOrders(i, 100);
    matched.push(...batch.content.filter((order) => order.status === status));
    last = batch.last;
  }

  const totalPages = Math.ceil(matched.length / size);
  return {
    content: matched.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements: matched.length,
    totalPages,
    last: page >= totalPages - 1,
  };
}

function fetchMyOrders(page: number, size: number) {
  return api<PageResponse<Order>>("/users/me/orders", { query: { page, size } });
} 
  
/** Захиалга id-аар. Backend өөр хүний захиалгыг 404-өөр хариулна. */ export async function getOrder(id: number) {   await requireUser(); 
  return orNull(api<Order>(`/orders/${id}`)); 
} 
