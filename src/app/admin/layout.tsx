import type { Metadata } from "next"; import { AdminNav } from "./admin-nav"; 
  
export const metadata: Metadata = { title: { default: "Админ", template: "%s | Админ" } }; 
  /** 
*	Админы хэсгийн нийтлэг хүрээ. 
*	Эрхийн шалгалт: proxy.ts (хурдан чиглүүлэлт) + lib/data/admin.ts-ийн requireAdmin() + backend. 
*	Layout-д session уншихгүй: тэгвэл бүх хуудас түүнийг хүлээж удаашрана. 
 */ 
export default function AdminLayout({ children }: LayoutProps<"/admin">) {   return ( 
    <div className="grid gap-8 lg:grid-cols-[200px_1fr]"> 
      <aside> 
        <p className="mb-3 hidden px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase lg:block">Админ</p> 
        <AdminNav /> 
      </aside> 
      <div className="min-w-0">{children}</div>
      </div> 
  ); } 
