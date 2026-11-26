/** 
 * URL-тэй ажиллах туслах функцууд. Сервер болон browser аль алинд ажиллана.  */ 
  
type Query = Record<string, string | number | boolean | undefined | null>; 
  
/** `{ name: 'утас', page: 0, x: undefined }` → `?name=утас&page=0` (хоосон утгыг алгасна) */ export function toSearchParams(query: Query = {}) {   const params = new URLSearchParams(); 
  for (const [key, value] of Object.entries(query)) {     if (value !== undefined && value !== null && value !== "") params.set(key, String(value)); 
  }   const text = params.toString(); 
  return text ? `?${text}` : ""; 
} 
  /** searchParams-ийн утга string | string[] | undefined байж болно: эхнийхийг авна. */ export function param(value: string | string[] | undefined): string | undefined {   return Array.isArray(value) ? value[0] : value; 
} 
  /** `?page=2` → 1 (backend 0-ээс тоолно). Буруу утга бол 0. */ 
export function pageParam(value: string | string[] | undefined): number {   const n = Number(param(value));   return Number.isInteger(n) && n > 0 ? n : 0; 
} 
  
/** Тоо биш эсвэл хоосон бол undefined */ 
export function numberParam(value: string | string[] | undefined): number | undefined {   const text = param(value);   if (!text) return undefined;   const n = Number(text); 
  return Number.isFinite(n) ? n : undefined; 
} 
  /** 
*	Нэвтэрсний дараа буцах хаяг. Зөвхөн өөрийн сайтын зам (`/...`) зөвшөөрнө: 
*	`?next=https://evil.com` гэх мэт гадаад руу шилжүүлэх (open redirect) халдлагаас сэргийлнэ. 
 */ 
export function safeNext(next: string | undefined | null): string | undefined { 
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return undefined; 
  return next; 
} 
