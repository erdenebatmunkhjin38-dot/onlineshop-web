import type { Metadata } from "next"; import Link from "next/link"; 
import { notFound } from "next/navigation"; 
import { Badge, Card, PageTitle } from "@/components/ui"; import { adminGetUser } from "@/lib/data/admin"; import { formatDate } from "@/lib/format"; import { UserActions } from "./user-actions"; 
  
export const metadata: Metadata = { title: "Хэрэглэгч" }; 
  
export default async function AdminUserPage({ params }: PageProps<"/admin/users/[id]">) {   const id = Number((await params).id);   if (!Number.isInteger(id) || id <= 0) notFound(); 
  
  const user = await adminGetUser(id);   if (!user) notFound(); 
  
  return (     <> 
      <Link href="/admin/users" className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900">
        ← Бүх хэрэглэгч 
      </Link> 
      <PageTitle>{user.username}</PageTitle> 
  
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]"> 
        <Card className="h-fit space-y-3 text-sm"> 
          <div> 
            <p className="text-slate-500">Нэр</p> 
            <p className="font-medium">{[user.lastName, user.firstName].filter(Boolean).join(" ") || "—"}</p> 
          </div> 
          <div> 
            <p className="text-slate-500">Имэйл</p> 
            <p className="font-medium">{user.email}</p> 
          </div> 
          <div> 
            <p className="text-slate-500">Бүртгүүлсэн</p> 
            <p className="font-medium">{formatDate(user.createdAt)}</p>           </div> 
          <div className="flex gap-2"> 
            {user.roles.includes("ROLE_ADMIN") && <Badge tone="blue">Админ</Badge>} 
            {user.enabled ? <Badge tone="green">Идэвхтэй</Badge> : <Badge tone="red">Түдгэлзсэн</Badge>} 
          </div> 
        </Card> 
        <UserActions user={user} /> 
      </div> 
    </> 
  ); } 
