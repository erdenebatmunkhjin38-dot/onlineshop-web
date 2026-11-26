"use client"; 
  
import Link from "next/link"; 
import { usePathname } from "next/navigation"; import { cn } from "@/lib/format"; 
  
const LINKS = [ 
  { href: "/admin", label: "Хяналтын самбар" }, 
  { href: "/admin/orders", label: "Захиалга" }, 
  { href: "/admin/products", label: "Бүтээгдэхүүн" }, 
  { href: "/admin/categories", label: "Ангилал" }, 
  { href: "/admin/customers", label: "Харилцагч" }, 
  { href: "/admin/users", label: "Хэрэглэгч" }, ]; 
  
/** usePathname() нь browser-ийн hook тул Client Component. Идэвхтэй цэсийг тодруулна. */ export function AdminNav() {   const pathname = usePathname();   const isActive = (href: string) => (href === "/admin" ? pathname === href : 
pathname.startsWith(href)); 
  
  return ( 
    <nav className="flex gap-1 overflow-x-auto lg:flex-col"> 
      {LINKS.map((link) => ( 
        <Link           key={link.href}           href={link.href}           className={cn( 
            "rounded-lg px-3 py-2 text-sm whitespace-nowrap", 
            isActive(link.href) ? "bg-brand-50 font-medium text-brand-700" : "text-slate-600 hover:bg-slate-100", 
          )} 
        > 
          {link.label} 
        </Link> 
      ))} 
    </nav> 
  ); } 
