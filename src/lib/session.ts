import "server-only"; 
import { cookies } from "next/headers"; 
import type { Role, TokenResponse } from "@/lib/types"; 

  /** 
*	Нэвтрэлтийн session = backend-ийн JWT хос токен, httpOnly cookie-д. 
 * 
*	- httpOnly: browser-ийн JavaScript (XSS) токеныг уншиж чадахгүй. 
*	- Токен зөвхөн Next.js сервер ↔ Spring Boot хооронд явна (BFF загвар). 
 */ 
export const ACCESS_COOKIE = "os_access"; export const REFRESH_COOKIE = "os_refresh"; 
  
export type Session = {   username: string;   roles: Role[];   isAdmin: boolean; 
  /** access token дуусах хугацаа (ms) */   expiresAt: number; }; 
  /** 
*	JWT-ийн payload-ийг уншина (base64url → JSON). 
*	Гарын үсгийг шалгахгүй: энэ нь зөвхөн UI-д (цэс, чиглүүлэлт) хэрэглэгдэнэ. 
*	Жинхэнэ шалгалтыг backend хүсэлт бүр дээр хийнэ. 
 * 
*	Хугацааг энд шалгахгүй: Date.now() нь Server Component-ийн prerender-т хориотой 
*	("unstable value"). Хугацааг хүсэлт бүрийн өмнө ажилладаг proxy.ts шалгаж,  * дууссан токеныг шинэчилдэг тул Server Component-д ирэх токен үргэлж хүчинтэй. 
 */ 
export function decodeAccessToken(token: string): Session | null {   try { 
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")) as {       sub: string;       roles?: Role[];       exp: number; 
    };     const roles = payload.roles ?? [];     return { username: payload.sub, roles, isAdmin: roles.includes("ROLE_ADMIN"), expiresAt: 
payload.exp * 1000 }; 
  } catch {     return null; 
  } 
} 
  
/** Токен дуусахаас 15 секундын өмнө "дууссан" гэж үзнэ (хүсэлт замдаа дуусахаас сэргийлнэ). */ const EXPIRY_MARGIN_MS = 15_000; 
  
/** Зөвхөн proxy.ts-д дуудна (prerender-ийн гадна ажилладаг тул Date.now() хэрэглэж болно). */ export function isExpired(session: Session) {   return session.expiresAt - EXPIRY_MARGIN_MS < Date.now(); 
} 
  
/** Cookie-ийн тохиргоо. maxAge нь секундээр. */ export function cookieOptions(maxAge: number) {   return {     httpOnly: true, 
    secure: process.env.NODE_ENV === "production",     sameSite: "lax" as const,     path: "/",     maxAge, 
  }; 
} 
  
/** Одоогийн хэрэглэгч (нэвтрээгүй бол null). Server Component, Server Action-д дуудна. */ export async function getSession(): Promise<Session | null> {   const token = (await cookies()).get(ACCESS_COOKIE)?.value;   return token ? decodeAccessToken(token) : null; 
} 
  
/** Backend рүү илгээх access token. */ 
export async function getAccessToken(): Promise<string | undefined> {   return (await cookies()).get(ACCESS_COOKIE)?.value; 
} 
  
export async function getRefreshToken(): Promise<string | undefined> {   return (await cookies()).get(REFRESH_COOKIE)?.value; 
} 
  
/** Нэвтэрсний дараа токенуудыг cookie-д бичнэ. Зөвхөн Server Action, Route Handler-т ажиллана. */ export async function saveTokens(tokens: TokenResponse) {   const store = await cookies(); 
  store.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions(tokens.expiresIn)); 
  store.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(tokens.refreshExpiresIn)); 
} 
  
export async function clearTokens() {   const store = await cookies();   store.delete(ACCESS_COOKIE); 
  store.delete(REFRESH_COOKIE); 
} 
