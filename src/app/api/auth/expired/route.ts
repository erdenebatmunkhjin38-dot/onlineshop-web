import { NextResponse, type NextRequest } from "next/server"; import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session"; 
  /** 
*	Route Handler: GET /api/auth/expired 
*	Backend токеныг хүлээн авахгүй (401) болсон үед энд шилжинэ. 
*	Cookie-г устгаад нэвтрэх хуудас руу буцаана. 
 */ 
export function GET(request: NextRequest) { 
  const response = NextResponse.redirect(new URL("/login?expired=1", request.url));   response.cookies.delete(ACCESS_COOKIE);   response.cookies.delete(REFRESH_COOKIE);   return response; 
} 
