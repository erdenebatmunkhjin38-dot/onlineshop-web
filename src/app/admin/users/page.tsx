import type { Metadata } from "next"; import Form from "next/form"; import Link from "next/link";
import { Pagination } from "@/components/pagination"; 
import { Badge, Button, ButtonLink, PageTitle, Table, Td, Th, inputClass } from "@/components/ui";import { adminGetUsers } from "@/lib/data/admin"; import { formatDate } from "@/lib/format"; import { pageParam, param } from "@/lib/url";
  
export const metadata: Metadata = { title: "Хэрэглэгч" }; 
  
export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  const sp = await searchParams;
  const username = param(sp.username)?.trim() || undefined;
  const users = await adminGetUsers({ username, page: pageParam(sp.page) });
  
  return ( 
    <> 
      <PageTitle>Хэрэглэгч</PageTitle>
      {/* GET форм: илгээхэд /admin/users?username=... болно. key нь URL өөрчлөгдөхөд input-ийг шинэчилнэ. */}
      <Form action="/admin/users" key={username ?? ""} className="mb-4 flex max-w-md gap-2">
        <input
          name="username"
          type="search"
          defaultValue={username}
          placeholder="Нэвтрэх нэрээр хайх"
          aria-label="Нэвтрэх нэрээр хайх"
          className={inputClass}
        />
        <Button type="submit" className="shrink-0">Хайх</Button>
        {username && (
          <ButtonLink href="/admin/users" variant="secondary" className="shrink-0">
            Цэвэрлэх
          </ButtonLink>
        )}
      </Form>
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
              <Td className="text-slate-600">{formatDate(u.createdAt)}</Td>
            </tr> 
          ))}
          {users.content.length === 0 && (
            <tr>
              <Td colSpan={6} className="py-8 text-center text-slate-500">
                Хэрэглэгч олдсонгүй
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination page={users.page} totalPages={users.totalPages} pathname="/admin/users" params={{ username }} />     </> 
  ); } 
