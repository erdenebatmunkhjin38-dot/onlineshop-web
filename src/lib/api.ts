import "server-only"; 
import { API_BASE } from "@/lib/config"; import type { ApiErrorBody } from "@/lib/types"; import { toSearchParams } from "@/lib/url"; 
import { getAccessToken } from "@/lib/session";
import { redirect } from "next/navigation";
type Query = Parameters<typeof toSearchParams>[0]; 
  
/** Backend-ийн алдааг нэг хэлбэрт оруулна: status + message + талбарын алдаанууд. */ export class ApiError extends Error {   constructor( 
    public status: number,     message: string,     public fieldErrors: Record<string, string> = {}, 
  ) { 
    super(message); 
    this.name = "ApiError"; 
  } 
} 
type ApiOptions = {   method?: "GET" | "POST" | "PUT" | "DELETE"; 
  /** Энгийн объект бол JSON болгоно, FormData бол multipart-аар илгээнэ */   body?: unknown;   query?: Query;   /** 
*	true (анхдагч): cookie-д токен байвал Authorization header нэмнэ. 
*	false: cookie уншихгүй. `'use cache'` функц дотор заавал false (cookies() дуудах боломжгүй). 
   */ 
  auth?: boolean; }; 
  /** 
*	Backend рүү хийх БҮХ HTTP хүсэлт энэ функцээр дамжина. 
*	Зөвхөн сервер дээр ажиллана: Server Component, Server Action, Route Handler.  */ 
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {   const { method = "GET", body, query, auth = true } = options; 
  
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = auth ? await getAccessToken() : undefined;
  if (token) headers.Authorization = `Bearer ${token}`; 
  
  let payload: BodyInit | undefined;   if (body instanceof FormData) { 
    payload = body; // Content-Type (boundary-тай)-г fetch өөрөө тавина 
  } else if (body !== undefined) { 
    headers["Content-Type"] = "application/json";     payload = JSON.stringify(body);   } 
  
  let response: Response;   try { 
    response = await fetch(`${API_BASE}${path}${toSearchParams(query)}`, {       method,       headers,       body: payload, 
      signal: AbortSignal.timeout(10_000), 
    }); 
  } catch { 
    // fetch нь зөвхөн сүлжээний алдаа (сервер унтарсан, timeout) дээр exception шиднэ 
    throw new ApiError(503, "Сервертэй холбогдож чадсангүй. Түр хүлээгээд дахин оролдоно уу.");   } 
  
  // 404, 500 зэрэгт fetch exception шиддэггүй тул response.ok-ийг заавал шалгана
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiErrorBody | null; 
  
    // Токен хүчингүй болсон (жишээ нь админ түдгэлзүүлсэн): cookie-г цэвэрлээд дахин нэвтрүүлнэ. 
    // Server Component cookie устгаж чадахгүй тул Route Handler руу шилжүүлнэ.
    if (response.status === 401 && token) redirect("/api/auth/expired");
  
    throw new ApiError(       response.status, 
      error?.message ?? `Алдаа гарлаа (${response.status})`,       error?.fieldErrors ?? {},
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** 404 бол null буцаана, бусад алдааг дамжуулна. Нэг объект авахад тохиромжтой. */
export async function orNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
