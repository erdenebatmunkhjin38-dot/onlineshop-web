import "server-only"; 
import { api, orNull } from "@/lib/api"; import { requireUser } from "@/lib/data/dal"; 
import type { Cart, Customer, Order, PageResponse, User } from "@/lib/types"; 
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
  
export async function getMyOrders(page = 0) {   await requireUser();   return api<PageResponse<Order>>("/users/me/orders", { query: { page, size: 10 } }); 
} 
  
/** Захиалга id-аар. Backend өөр хүний захиалгыг 404-өөр хариулна. */ export async function getOrder(id: number) {   await requireUser(); 
  return orNull(api<Order>(`/orders/${id}`)); 
} 
