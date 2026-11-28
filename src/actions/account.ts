"use server"; 
  
import { refresh, updateTag } from "next/cache"; import { api } from "@/lib/api"; 
import { CATALOG_TAGS } from "@/lib/data/catalog"; import { requireUser } from "@/lib/data/dal"; 
import { toFormState, type FormState } from "@/lib/form"; 
  
/** Хэрэглэгч өөрийн мэдээллийг засах Server Action-ууд (/users/me/**). */ 
  
/** Хэрэглэгч PENDING захиалгаа цуцална (админ ч мөн ашиглана). */ 
export async function cancelOrder(_prev: FormState, formData: FormData): Promise<FormState> {   await requireUser(); 
  const id = Number(formData.get("orderId"));   try { 
    await api(`/orders/${id}/cancel`, { method: "POST" }); 
  } catch (error) { 
    return toFormState(error); 
  } 
  // Бараа нөөцөд буцсан тул каталогийн кэшийг шинэчилнэ
  updateTag(CATALOG_TAGS.products);   refresh(); 
  return { ok: true, message: "Захиалга цуцлагдлаа" }; 
} 
