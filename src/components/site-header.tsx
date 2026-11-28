import Form from "next/form"; import Link from "next/link"; import { Suspense } from "react"; import { logout } from "@/actions/auth"; import { Dropdown } from "@/components/dropdown"; 

import { Skeleton, buttonClass } from "@/components/ui"; import { api } from "@/lib/api"; 
import { getSession } from "@/lib/session"; import type { Cart } from "@/lib/types";
  /** 
*	Сайтын толгой. 
*	Лого, хайлт нь бүх хэрэглэгчид ижил тул static shell-д орно (шууд харагдана). 
*	Хэрэглэгчийн хэсэг cookie уншдаг тул <Suspense> дотор: хүсэлт бүрт серверээс урсаж (stream) ирнэ. 
 */ 
export function SiteHeader() {   return ( 
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur"> 
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4"> 
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-600"> 
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2"> 
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <path d="M3 6h18M16 10a4 4 0 0 1-8 0" /> 
          </svg> 
          <span className="hidden sm:inline">Онлайн дэлгүүр</span>
          </Link> 
  
        <Link href="/products" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 md:block"> 
          Бүтээгдэхүүн 
        </Link> 
  
        {/* next/form: GET форм. Илгээхэд /products?name=... руу client талд шилжинэ (хуудас бүтэн ачаалахгүй). */} 
        <Form action="/products" className="ml-auto max-w-sm flex-1"> 
          <input             name="name"             type="search"             placeholder="Бүтээгдэхүүн хайх..."             aria-label="Бүтээгдэхүүн хайх" 
            className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:bg-white" 
          /> 
        </Form> 
  
        <Suspense fallback={<Skeleton className="h-9 w-32" />}> 
          <UserArea /> 
        </Suspense> 
      </div> 
    </header> 
  ); 
} 
  
async function UserArea() {   const session = await getSession(); 
  
  if (!session) {     return ( 
      <div className="flex items-center gap-2"> 
        <Link href="/login" className={buttonClass("ghost")}>           Нэвтрэх         </Link> 
        <Link href="/register" className={buttonClass("primary", "hidden sm:inline-flex")}>           Бүртгүүлэх 
        </Link> 
      </div> 
    ); 
  } 
  
  // Алдаа гарвал (backend унтарсан г.м.) толгойг эвдэхгүйн тулд null болгоно.
  const cart = await api<Cart>("/users/me/cart").catch(() => null);
  const count = cart?.totalQuantity ?? 0;
  const displayName = session.username;
    return ( 
    <div className="flex items-center gap-1"> 
      <Link href="/cart" className={buttonClass("ghost", "relative px-3")} aria-label={`Сагс, ${count} бараа`}> 
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"> 
          <circle cx="9" cy="21" r="1" /> 
          <circle cx="20" cy="21" r="1" /> 
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg> 
        {count > 0 && ( 
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs text-white"> 
            {count} 
          </span> 
        )} 
      </Link> 
  
      <Dropdown> 
        <summary className={buttonClass("ghost", "cursor-pointer list-none")}> 
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold uppercase text-brand-700"> 
            {displayName.slice(0, 1)}
          </span> 
          <span className="hidden max-w-28 truncate sm:inline">{displayName}</span>
          </summary> 
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg"> 
          {session.isAdmin && ( 
            <Link href="/admin" className="block px-4 py-2 font-medium text-brand-600 hover:bg-slate-50"> 
              Админ самбар 
            </Link>           )} 
          <Link href="/orders" className="block px-4 py-2 hover:bg-slate-50">             Миний захиалгууд 
          </Link> 
          <Link href="/account" className="block px-4 py-2 hover:bg-slate-50">             Миний профайл 
          </Link> 
          <form action={logout} className="border-t border-slate-100"> 
            <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-slate-50">Гарах</button> 
          </form> 
        </div> 
      </Dropdown> 
    </div> 
  ); } 
