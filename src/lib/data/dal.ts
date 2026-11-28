import "server-only"; 
import { redirect } from "next/navigation"; import { getSession } from "@/lib/session"; 
  /** 
*	Data Access Layer (DAL): эрхийн шалгалтыг өгөгдөлд ойр, нэг газар хийнэ. 
 * 
*	proxy.ts нь "нэвтрээгүй бол /login руу" гэсэн хурдан (optimistic) шалгалт хийдэг.  * Гэхдээ Server Action-ийг шууд POST-оор дуудаж болох тул хуудас, action бүр  * эдгээр функцийг дуудаж дахин шалгана.  */ 
  
export async function requireUser() {   const session = await getSession();   if (!session) redirect("/login");   return session; 
} 
  
export async function requireAdmin() {   const session = await requireUser();   if (!session.isAdmin) redirect("/");   return session; 
} 
