"use server"; 
  
import { refresh, updateTag } from "next/cache"; import { z } from "zod"; import { api } from "@/lib/api"; 
import { CATALOG_TAGS } from "@/lib/data/catalog"; import { requireUser } from "@/lib/data/dal";
import { formValues, optionalText, toFormState, zodErrors, type FormState } from "@/lib/form"; import { customerSchema } from "@/lib/schemas"; import { saveTokens } from "@/lib/session"; import type { TokenResponse } from "@/lib/types"; 
  
/** Хэрэглэгч өөрийн мэдээллийг засах Server Action-ууд (/users/me/**). */ 
  
const profileSchema = z.object({ 
  email: z.email("Имэйл хаяг буруу байна"),   firstName: optionalText,   lastName: optionalText, }); 

  
export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {   await requireUser(); 
  const values = formValues(formData); 
  const parsed = profileSchema.safeParse(values); 
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed.error), values }; 
    try { 
    await api("/users/me", { method: "PUT", body: parsed.data }); 
  } catch (error) { 
    return toFormState(error, values); 
  }   refresh(); 
  return { ok: true, message: "Хувийн мэдээлэл хадгалагдлаа" }; 
} 
  
export async function updateShipping(_prev: FormState, formData: FormData): Promise<FormState> {   await requireUser(); 
  const values = formValues(formData); 
  const parsed = customerSchema.safeParse(values); 
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed.error), values }; 
    try { 
    await api("/users/me/customer", { method: "PUT", body: parsed.data }); 
  } catch (error) { 
    return toFormState(error, values); 
  }   refresh(); 
  return { ok: true, message: "Хүргэлтийн мэдээлэл хадгалагдлаа" }; 
} 
  
const passwordSchema = z 
  .object({ 
    currentPassword: z.string().min(1, "Одоогийн нууц үгээ оруулна уу"), 
    newPassword: z.string().min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байна").max(100),     confirmPassword: z.string(), 
  }) 
  .refine((d) => d.newPassword === d.confirmPassword, {     message: "Нууц үг таарахгүй байна",     path: ["confirmPassword"],   }); 
  
export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {   const session = await requireUser(); 
  const parsed = passwordSchema.safeParse(formValues(formData)); 
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed.error) }; 
  
  const { currentPassword, newPassword } = parsed.data;   try {     await api("/users/me/password", { method: "PUT", body: { currentPassword, newPassword } }); 
    // Backend нууц үг солиход БҮХ refresh token-ийг хүчингүй болгодог. 
    // Энэ төхөөрөмжөөс гаргахгүйн тулд шинэ нууц үгээр дахин нэвтэрч шинэ токен авна. 
    const tokens = await api<TokenResponse>("/auth/login", {       method: "POST",       body: { username: session.username, password: newPassword },       auth: false, 
    });     await saveTokens(tokens); 
  } catch (error) {     return toFormState(error); 
  } 
  return { ok: true, message: "Нууц үг солигдлоо. Бусад төхөөрөмжөөс гарсан." }; 
} 
  /** Хэрэглэгч PENDING захиалгаа цуцална (админ ч мөн ашиглана). */ 
export async function cancelOrder(_prev: FormState, formData: FormData): Promise<FormState> {   await requireUser();   const id = Number(formData.get("orderId"));   try { 
    await api(`/orders/${id}/cancel`, { method: "POST" }); 
  } catch (error) {     return toFormState(error); 
  } 
  // Бараа нөөцөд буцсан тул каталогийн кэшийг шинэчилнэ
  updateTag(CATALOG_TAGS.products);
  refresh();
  return { ok: true, message: "Захиалга цуцлагдлаа" }; 
} 
