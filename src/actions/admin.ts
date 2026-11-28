"use server"; 
  
import { refresh, updateTag } from "next/cache"; import { redirect } from "next/navigation"; import { api } from "@/lib/api"; 
import { CATALOG_TAGS } from "@/lib/data/catalog"; import { requireAdmin } from "@/lib/data/dal"; 
import { toFormState, type FormState } from "@/lib/form"; 
import { ORDER_STATUSES, type OrderStatus, type Role } from "@/lib/types"; 
  /** 
*	Админы Server Action-ууд. Функц бүр эхлээд requireAdmin() дуудна: 
*	Server Action бол нээлттэй POST endpoint тул UI-д товч нуусан нь хамгаалалт биш. 
*	(Backend мөн ADMIN эрхийг шалгадаг: давхар хамгаалалт.)  */ 
  
// ---------- Захиалга ---------- 
  
export async function updateOrderStatus(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const id = Number(formData.get("orderId"));   const status = formData.get("status") as OrderStatus; 
  if (!ORDER_STATUSES.includes(status)) return { ok: false, message: "Төлөв буруу байна" }; 
    try { 
    await api(`/orders/${id}/status`, { method: "PUT", body: { status } }); 
  } catch (error) { 
    return toFormState(error); 
  } 
  // Цуцалбал бараа нөөцөд буцна 
  if (status === "CANCELLED") updateTag(CATALOG_TAGS.products);   refresh(); 
  return { ok: true, message: "Төлөв шинэчлэгдлээ" }; 
} 
  
// ---------- Хэрэглэгч ---------- 
  
export async function updateUserRoles(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const id = Number(formData.get("userId")); 
  const roles = formData.getAll("roles").filter((r): r is Role => r === "ROLE_USER" || r === 
"ROLE_ADMIN");   if (roles.length === 0) return { ok: false, message: "Дор хаяж нэг эрх сонгоно уу" }; 
    try { 
    await api(`/users/${id}/roles`, { method: "PUT", body: { roles } }); 
  } catch (error) {     return toFormState(error); 
  }   refresh();   return { ok: true, message: "Эрх шинэчлэгдлээ" }; 
} 
  
export async function updateUserStatus(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const id = Number(formData.get("userId"));   const enabled = formData.get("enabled") === "true";   try {     await api(`/users/${id}/status`, { method: "PUT", body: { enabled } }); 
  } catch (error) {     return toFormState(error); 
  }   refresh(); 
  return { ok: true, message: enabled ? "Хэрэглэгч идэвхжлээ" : "Хэрэглэгч түдгэлзлээ" }; 
} 
  
export async function deleteUser(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  try { 
    await api(`/users/${Number(formData.get("userId"))}`, { method: "DELETE" }); 
  } catch (error) { 
    return toFormState(error); 
  } 
  redirect("/admin/users"); 
} 
