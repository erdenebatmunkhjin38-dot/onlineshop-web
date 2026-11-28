import { unstable_rethrow } from "next/navigation"; import { z } from "zod"; import "server-only"; 
import { ApiError } from "@/lib/api"; 
import type { FormState } from "@/lib/form-state"; 
  
export type { FormState }; 
  
/** FormData → энгийн объект (файл талбаруудыг алгасна). */ 
export function formValues(formData: FormData): Record<string, string> {   const values: Record<string, string> = {};   for (const [key, value] of formData.entries()) { 
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value; 
  } 
  return values; 
} 
  
/** Zod-ийн алдааг { талбар: "эхний алдаа" } хэлбэрт оруулна. */ export function zodErrors(error: z.ZodError): Record<string, string> {   const { fieldErrors } = z.flattenError(error);   const result: Record<string, string> = {}; 
  for (const [key, messages] of Object.entries(fieldErrors)) {     const list = messages as string[] | undefined;     if (list?.length) result[key] = list[0]; 
  }   return result; 
} 
  /** 
*	catch блок дотор алдааг FormState болгоно. 
*	redirect(), notFound() нь тусгай алдаа шиддэг тул unstable_rethrow-оор дамжуулна. 
 */ 
export function toFormState(error: unknown, values?: Record<string, string>): FormState {   unstable_rethrow(error);   if (error instanceof ApiError) { 
    return { ok: false, message: error.message, fieldErrors: error.fieldErrors, values }; 
  } 
  console.error(error);   return { ok: false, message: "Тодорхойгүй алдаа гарлаа", values }; 
} 
  
/** Хоосон мөрийг undefined болгоно (backend-д "талбар өгөөгүй" гэж ойлгогдоно). */ export const optionalText = z 
  .string() 
  .trim() 
  .transform((v) => (v === "" ? undefined : v)) 
  .optional(); 
  
/** Backend-ийн утасны дугаарын шалгалттай ижил. */ export const phoneSchema = z 
  .string()   .trim() 
  .refine((v) => v === "" || /^\+?[0-9 -]{6,20}$/.test(v), "Утасны дугаар буруу байна")   .transform((v) => (v === "" ? undefined : v))   .optional(); 
