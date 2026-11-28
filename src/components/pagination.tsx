import Link from "next/link"; 
import { toSearchParams } from "@/lib/url"; import { cn } from "@/lib/format"; 
  /** 
*	Хуудаслалт. Хуудасны дугаарыг URL-ийн `?page=` параметрт хадгална: 
*	холбоосыг хуваалцах, browser-ийн "буцах" товч ажиллана. 
 * 
*	Backend-ийн page 0-ээс, хэрэглэгчид харагдах дугаар 1-ээс эхэлнэ. 
 */ 
export function Pagination({   page,   totalPages,   pathname,   params = {}, 
}: { 
  /** 0-ээс эхэлсэн одоогийн хуудас */   page: number;   totalPages: number;   pathname: string; 
  /** Хадгалах бусад query параметр (шүүлтүүр г.м.) */   params?: Record<string, string | undefined>; 
}) { 
  if (totalPages <= 1) return null; 
  
  const href = (p: number) => `${pathname}${toSearchParams({ ...params, page: p > 0 ? p : undefined })}`; 
  
  // Одоогийн хуудасны орчмын 5 дугаарыг харуулна 
  const start = Math.max(0, Math.min(page - 2, totalPages - 5)); 
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i); 
  
  const item = "flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm"; 
  
  return ( 
    <nav aria-label="Хуудаслалт" className="mt-8 flex items-center justify-center gap-1">
    {page > 0 ? ( 
        <Link href={href(page - 1)} className={cn(item, "hover:bg-slate-200")}>           ← Өмнөх 
        </Link>       ) : ( 
        <span className={cn(item, "text-slate-300")}>← Өмнөх</span>       )} 
  
      {pages.map((p) => ( 
        <Link           key={p}           href={href(p)} 
          aria-current={p === page ? "page" : undefined} 
          className={cn(item, p === page ? "bg-brand-600 text-white" : "hover:bg-slate-200")}         > 
          {p + 1} 
        </Link> 
      ))} 
  
      {page < totalPages - 1 ? ( 
        <Link href={href(page + 1)} className={cn(item, "hover:bg-slate-200")}>           Дараах → 
        </Link>       ) : ( 
        <span className={cn(item, "text-slate-300")}>Дараах →</span>       )} 
    </nav> 
  ); } 
