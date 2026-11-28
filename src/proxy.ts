import { NextResponse, type NextRequest } from "next/server"; import { API_BASE } from "@/lib/config"; import { 
  ACCESS_COOKIE,   REFRESH_COOKIE,   cookieOptions,   decodeAccessToken,   isExpired,   type Session, 
} from "@/lib/session"; import type { TokenResponse } from "@/lib/types"; 
  

/** 
*	Proxy (Next.js 15-аас өмнө "middleware"): хүсэлт бүр хуудсанд хүрэхээс ӨМНӨ энд ирнэ. 
 * 
*	1. Access token дууссан бол refresh token-оор шинэчилнэ (Server Component cookie бичиж чадахгүй тул энд). 
*	2. Хурдан (optimistic) шалгалт: нэвтрээгүй бол /login, админ биш бол / руу шилжүүлнэ. 
*	Жинхэнэ эрхийн шалгалтыг DAL (lib/dal.ts) болон backend хийнэ.  */ 
  
/** Нэвтэрсэн байх шаардлагатай замууд */ 
const PROTECTED = ["/cart", "/checkout", "/orders", "/account"]; 
/** Нэвтэрсэн хэрэглэгч орох шаардлагагүй замууд */ const GUEST_ONLY = ["/login", "/register"]; 
  
const matches = (path: string, prefixes: string[]) =>   prefixes.some((p) => path === p || path.startsWith(`${p}/`)); 
  /** 
*	Refresh token нэг удаагийнх (rotation): хуучныг дахин илгээвэл backend БҮХ токеныг хүчингүй болгоно. 
*	Нэг хуудас зэрэг олон хүсэлт (prefetch г.м.) илгээдэг тул ижил refresh token-оор  * нэг л удаа backend руу хандаж, үр дүнг хамтад нь хэрэглэнэ (single-flight). 
 */ const inFlight = new Map<string, Promise<TokenResponse | null>>(); 
  
function refreshOnce(refreshToken: string) {   let promise = inFlight.get(refreshToken);   if (!promise) { 
    promise = fetch(`${API_BASE}/auth/refresh`, {       method: "POST", 
      headers: { "Content-Type": "application/json" },       body: JSON.stringify({ refreshToken }), 
    }) 
      .then((res) => (res.ok ? (res.json() as Promise<TokenResponse>) : null)) 
      .catch(() => null); 
    inFlight.set(refreshToken, promise); 
    // Хоцорч ирсэн хүсэлтүүд мөн ижил хариуг авахаар 30 секунд хадгална
    setTimeout(() => inFlight.delete(refreshToken), 30_000); 
  } 
  return promise; 
} 
  
export async function proxy(request: NextRequest) {   const { pathname, search } = request.nextUrl;   const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;   const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value; 
  
  let session: Session | null = accessToken ? decodeAccessToken(accessToken) : null;   if (session && isExpired(session)) session = null;   let tokens: TokenResponse | null = null;   let clearCookies = false; 
  
  // 1. Access token дууссан, refresh token байгаа бол шинэчилнэ
  if (!session && refreshToken) {     tokens = await refreshOnce(refreshToken);     if (tokens) { 
      session = decodeAccessToken(tokens.accessToken); 
      // Энэ хүсэлтийг боловсруулах Server Component-ууд шинэ токеныг харна
      request.cookies.set(ACCESS_COOKIE, tokens.accessToken);       request.cookies.set(REFRESH_COOKIE, tokens.refreshToken); 
    } else { 
      clearCookies = true; // refresh token хүчингүй: гарсан гэж үзнэ
      request.cookies.delete(ACCESS_COOKIE);       request.cookies.delete(REFRESH_COOKIE);     }   } 
  
  // 2. Чиглүүлэлт 
  let response: NextResponse; 
  if (!session && (matches(pathname, PROTECTED) || matches(pathname, ["/admin"]))) { 
    const login = new URL("/login", request.url);     login.searchParams.set("next", pathname + search);     response = NextResponse.redirect(login); 
  } else if (session && !session.isAdmin && matches(pathname, ["/admin"])) {     response = NextResponse.redirect(new URL("/", request.url)); 
  } else if (session && matches(pathname, GUEST_ONLY)) { 
    response = NextResponse.redirect(new URL(session.isAdmin ? "/admin" : "/", request.url));   } else { 
    // request.headers-д шинэчилсэн cookie орсон тул upstream рүү дамжуулна
    response = NextResponse.next({ request: { headers: request.headers } });   } 
  
  // 3. Browser-ийн cookie-г шинэчилнэ
  if (tokens) { 
    response.cookies.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions(tokens.expiresIn));     response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(tokens.refreshExpiresIn)); 
  } else if (clearCookies) {     response.cookies.delete(ACCESS_COOKIE);     response.cookies.delete(REFRESH_COOKIE); 
  } 
  return response; 
} 
  
export const config = { 
  // Статик файл, зураг, Route Handler (/api)-д proxy ажиллуулахгүй
  matcher:
["/((?!api|_next/static|_next/image|uploads|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"
], 
}; 
