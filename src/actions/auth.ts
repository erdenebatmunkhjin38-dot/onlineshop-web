"use server"; 
  
import { redirect } from "next/navigation"; import { z } from "zod"; import { api } from "@/lib/api"; 
import { formValues, phoneSchema, optionalText, toFormState, zodErrors, type FormState } from 

"@/lib/form"; import { clearTokens, decodeAccessToken, getRefreshToken, saveTokens } from "@/lib/session"; import type { TokenResponse } from "@/lib/types"; import { safeNext } from "@/lib/url"; 
  /** 
*	Нэвтрэлтийн Server Action-ууд. 
*	Browser зөвхөн форм илгээнэ. Токеныг Next.js сервер backend-ээс аваад httpOnly cookie-д хадгална.  */ 
  
const loginSchema = z.object({ 
  username: z.string().trim().min(1, "Нэвтрэх нэр оруулна уу"),   password: z.string().min(1, "Нууц үг оруулна уу"), }); 
  
/** Backend-ээс токен аваад cookie-д хадгална. Админ эсэхийг буцаана. */ async function signIn(username: string, password: string) {   const tokens = await api<TokenResponse>("/auth/login", {     method: "POST", 
    body: { username, password },     auth: false, 
  }); 
  await saveTokens(tokens); 
  return decodeAccessToken(tokens.accessToken)?.isAdmin ?? false; 
} 
  
export async function login(_prev: FormState, formData: FormData): Promise<FormState> {   const values = formValues(formData);   const parsed = loginSchema.safeParse(values); 
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed.error), values }; 
  
  let isAdmin: boolean;   try { 
    isAdmin = await signIn(parsed.data.username, parsed.data.password); 
  } catch (error) { 
    // Нууц үгийг буцааж харуулахгүй 
    return toFormState(error, { username: values.username });   } 
  
  // redirect() нь exception шиддэг тул try блокийн ГАДНА дуудна
  redirect(safeNext(values.next) ?? (isAdmin ? "/admin" : "/")); 
} 
  
const registerSchema = z 
  .object({     username: z       .string() 
      .trim() 
      .min(3, "Нэвтрэх нэр 3-аас 50 тэмдэгт байна") 
      .max(50, "Нэвтрэх нэр 3-аас 50 тэмдэгт байна") 
      .regex(/^[a-zA-Z0-9._-]+$/, "Нэвтрэх нэрэнд зөвхөн латин үсэг, тоо, . _ - ашиглана"),     email: z.email("Имэйл хаяг буруу байна"),     password: z.string().min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байна").max(100),     confirmPassword: z.string(),     firstName: optionalText,     lastName: optionalText,     phone: phoneSchema,   }) 
  // Хоёр талбарыг харьцуулах шалгалт: алдааг confirmPassword талбарт харуулна 
  .refine((data) => data.password === data.confirmPassword, {     message: "Нууц үг таарахгүй байна",     path: ["confirmPassword"],   }); 
  
export async function register(_prev: FormState, formData: FormData): Promise<FormState> {   const values = formValues(formData); 
  // Алдаа гарвал формыг дахин бөглөхөд нууц үгийг буцааж илгээхгүй
  const safeValues = { ...values, password: "", confirmPassword: "" };   const parsed = registerSchema.safeParse(values); 
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed.error), values: safeValues 
}; 
  
  const { username, email, password, firstName, lastName, phone } = parsed.data;   const body = { username, email, password, firstName, lastName, phone };   try { 
    // 1. Бүртгүүлнэ (backend токен буцаадаггүй, зөвхөн хэрэглэгчийн мэдээлэл)
    await api("/auth/register", { method: "POST", body, auth: false }); 
    // 2. Шууд нэвтрүүлнэ 
    await signIn(body.username, body.password); 
  } catch (error) { 
    return toFormState(error, safeValues);   } 
  
  redirect(safeNext(values.next) ?? "/"); 
} 
  
export async function logout() { 
  const refreshToken = await getRefreshToken();   if (refreshToken) { 
    // Backend дээр refresh token-ийг хүчингүй болгоно. Алдаа гарсан ч cookie-г устгана.
    await api("/auth/logout", { method: "POST", body: { refreshToken }, auth: false }).catch(() => {});   }   await clearTokens(); 
  redirect("/"); 
} 
