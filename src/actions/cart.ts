"use server"; 
  
import { refresh, updateTag } from "next/cache"; import { redirect } from "next/navigation"; import { z } from "zod"; import { api } from "@/lib/api"; 
import { CATALOG_TAGS } from "@/lib/data/catalog"; 

import { requireUser } from "@/lib/data/dal"; import { formValues, phoneSchema, optionalText, toFormState, zodErrors, type FormState } from 
"@/lib/form"; import { getSession } from "@/lib/session"; import type { Order } from "@/lib/types"; 
  /** 
*	Сагсны Server Action-ууд. Сагс backend дээр хадгалагдана (/users/me/cart): 
*	өөр төхөөрөмж, мобайл апп-аас нэвтэрсэн ч ижил сагс харагдана. 
 * 
*	Сагсны өгөгдлийг кэшлээгүй тул refresh()-ээр одоогийн хуудсыг (толгойн сагсны тоог оролцуулан)  * серверээс дахин зурна. 
 */ 
  
const itemSchema = z.object({ 
  productId: z.coerce.number().int().positive(),   quantity: z.coerce 
    .number({ error: "Тоо оруулна уу" }) 
    .int("Бүхэл тоо оруулна уу") 
    .min(1, "Хамгийн багадаа 1") 
    .max(1000, "Хамгийн ихдээ 1000"), 
}); 
  
export async function addToCart(_prev: FormState, formData: FormData): Promise<FormState> {   const parsed = itemSchema.safeParse(formValues(formData)); 
  if (!parsed.success) return { ok: false, message: Object.values(zodErrors(parsed.error))[0] }; 
  
  // Нэвтрээгүй бол нэвтрээд энэ бараа руу буцаж ирнэ 
  if (!(await getSession())) redirect(`/login?next=/products/${parsed.data.productId}`); 
    try { 
    await api("/users/me/cart/items", { method: "POST", body: parsed.data }); 
  } catch (error) { 
    return toFormState(error); 
  }   refresh(); 
  return { ok: true, message: "Сагсанд нэмэгдлээ" }; 
} 
  
export async function updateCartItem(_prev: FormState, formData: FormData): Promise<FormState> {   await requireUser(); 
  const parsed = itemSchema.safeParse(formValues(formData)); 
  if (!parsed.success) return { ok: false, message: Object.values(zodErrors(parsed.error))[0] }; 
  
  const { productId, quantity } = parsed.data;   try {     await api(`/users/me/cart/items/${productId}`, { method: "PUT", body: { quantity } }); 
  } catch (error) { 
    return toFormState(error); 
  }   refresh(); 
  return { ok: true }; 
} 
  
export async function removeCartItem(formData: FormData) {   await requireUser(); 
  const productId = Number(formData.get("productId")); 
  await api(`/users/me/cart/items/${productId}`, { method: "DELETE" });   refresh(); 
} 
  
export async function clearCart() {   await requireUser(); 
  await api("/users/me/cart", { method: "DELETE" });   refresh(); 
} 
  
const checkoutSchema = z.object({ 
  shippingAddress: z.string().trim().min(1, "Хүргэлтийн хаяг оруулна уу").max(255),   shippingCity: optionalText, 
  phone: phoneSchema.refine((v) => v !== undefined, "Утасны дугаар оруулна уу"),   saveToProfile: z.literal("on").optional(), }); 
  
export async function checkout(_prev: FormState, formData: FormData): Promise<FormState> {   await requireUser(); 
  const values = formValues(formData); 
  const parsed = checkoutSchema.safeParse(values); 
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed.error), values }; 
  
  const { saveToProfile, ...shipping } = parsed.data;   let order: Order;   try { 
    // Хүргэлтийн мэдээллийг профайлд хадгална (дараагийн удаа автоматаар бөглөгдөнө)
    if (saveToProfile) { 
      const me = await api<{ fullName: string; email: string | null }>("/users/me/customer");       await api("/users/me/customer", {         method: "PUT",         body: { 
          fullName: me.fullName,           email: me.email ?? undefined,           phone: shipping.phone,           address: shipping.shippingAddress,           city: shipping.shippingCity, 
        }, 
      });     } 
    // Амжилттай бол backend сагсыг хоосолж, нөөцийг хасна 
    order = await api<Order>("/users/me/cart/checkout", { method: "POST", body: shipping }); 
  } catch (error) { 
    return toFormState(error, values);   } 
  
  // Нөөц өөрчлөгдсөн тул каталогийн кэшийг шинэчилнэ
  updateTag(CATALOG_TAGS.products); 
  redirect(`/orders/${order.id}?placed=1`); 
} 
