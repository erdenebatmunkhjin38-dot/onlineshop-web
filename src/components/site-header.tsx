import Link from "next/link"; import { buttonClass } from "@/components/ui"; 
  
export function SiteHeader() {   return ( 
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur"> 
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4"> 
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-600"> 
          Онлайн дэлгүүр         </Link> 
        <Link href="/products" className="hidden text-sm font-medium text-slate-600 hover:textslate-900 md:block"> 
          Бүтээгдэхүүн 
        </Link> 
  
        <form action="/products" className="ml-auto max-w-sm flex-1"> 
          <input name="name" type="search" placeholder="Бүтээгдэхүүн хайх..." arialabel="Бүтээгдэхүүн хайх" 
            className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm" /> 
        </form> 
  
        <Link href="/login" className={buttonClass("ghost")}>Нэвтрэх</Link> 
        <Link href="/register" className={buttonClass("primary", "hidden sm:inlineflex")}>Бүртгүүлэх</Link> 
      </div> 
    </header> 
  ); } 
