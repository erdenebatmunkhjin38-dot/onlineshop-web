import type { Metadata } from "next"; import Form from "next/form"; import Link from "next/link"; 
import { Pagination } from "@/components/pagination"; import { Badge, ButtonLink, PageTitle, Table, Td, Th, buttonClass, inputClass } from 
"@/components/ui"; 
import { adminGetCustomers } from "@/lib/data/admin"; import { pageParam, param } from "@/lib/url"; 
  
export const metadata: Metadata = { title: "Харилцагч" }; 
  
export default async function AdminCustomersPage({ searchParams }: PageProps<"/admin/customers">) {   const sp = await searchParams; 
  const name = param(sp.name)?.trim() || undefined; 
  const customers = await adminGetCustomers({ name, page: pageParam(sp.page) }); 
  
  return (     <> 
      <PageTitle actions={<ButtonLink href="/admin/customers/new">+ Шинэ харилцагч</ButtonLink>}>Харилцагч</PageTitle> 
  
      <Form action="/admin/customers" className="mb-4 flex gap-2"> 
        <input name="name" defaultValue={name} placeholder="Нэрээр хайх" className={`${inputClass} max-w-xs`} /> 
        <button className={buttonClass("secondary")}>Хайх</button>       </Form> 
  
      <Table> 
        <thead> 
          <tr> 
            <Th>Нэр</Th> 
            <Th>Утас</Th> 
            <Th>Имэйл</Th> 
            <Th>Хаяг</Th> 
            <Th>Төрөл</Th> 
          </tr> 
        </thead> 
        <tbody> 
          {customers.content.map((c) => ( 
            <tr key={c.id} className="hover:bg-slate-50"> 
              <Td> 
                <Link href={`/admin/customers/${c.id}`} className="font-medium text-brand-600 hover:underline"> 
                  {c.fullName} 
                </Link> 
              </Td> 
              <Td className="text-slate-600">{c.phone ?? "—"}</Td> 
              <Td className="text-slate-600">{c.email ?? "—"}</Td> 
              <Td className="max-w-64 truncate text-slate-600">{[c.address, 
c.city].filter(Boolean).join(", ") || "—"}</Td> 
              <Td>{c.userId ? <Badge tone="blue">Бүртгэлтэй</Badge> : <Badge>Гараар нэмсэн</Badge>}</Td> 
            </tr> 
          ))} 
          {customers.content.length === 0 && ( 
            <tr> 
              <Td colSpan={5} className="py-8 text-center text-slate-500">                 Харилцагч олдсонгүй 
              </Td> 
            </tr> 
          )} 
        </tbody>
      </Table> 
      <Pagination page={customers.page} totalPages={customers.totalPages} pathname="/admin/customers" params={{ name }} />     </> 
  ); } 
 
