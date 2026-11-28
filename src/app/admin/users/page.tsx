import type { Metadata } from "next"; import Link from "next/link"; 
import { Pagination } from "@/components/pagination"; 
import { Badge, PageTitle, Table, Td, Th } from "@/components/ui"; import { adminGetUsers } from "@/lib/data/admin"; import { formatDate } from "@/lib/format"; import { pageParam } from "@/lib/url"; 
  
export const metadata: Metadata = { title: "Хэрэглэгч" }; 
  
export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {   const users = await adminGetUsers(pageParam((await searchParams).page)); 
  
  return ( 
    <> 
      <PageTitle>Хэрэглэгч</PageTitle> 
      <Table> 
        <thead> 
          <tr> 
            <Th>Нэвтрэх нэр</Th> 
            <Th>Нэр</Th> 
            <Th>Имэйл</Th> 
            <Th>Эрх</Th> 
            <Th>Төлөв</Th> 
            <Th>Бүртгүүлсэн</Th> 
          </tr> 
        </thead> 
        <tbody> 
          {users.content.map((u) => ( 
            <tr key={u.id} className="hover:bg-slate-50"> 
              <Td> 
                <Link href={`/admin/users/${u.id}`} className="font-medium text-brand-600 hover:underline"> 
                  {u.username} 
                </Link>               </Td> 
              <Td>{[u.lastName, u.firstName].filter(Boolean).join(" ") || "—"}</Td> 
              <Td className="text-slate-600">{u.email}</Td> 
              <Td>{u.roles.includes("ROLE_ADMIN") ? <Badge tone="blue">Админ</Badge> : <Badge>Хэрэглэгч</Badge>}</Td> 
              <Td>{u.enabled ? <Badge tone="green">Идэвхтэй</Badge> : <Badge tone="red">Түдгэлзсэн</Badge>}</Td> 
              <Td className="text-slate-600">{formatDate(u.createdAt)}</Td>             </tr> 
          ))} 
        </tbody>       </Table> 
      <Pagination page={users.page} totalPages={users.totalPages} pathname="/admin/users" />     </> 
  ); } 
