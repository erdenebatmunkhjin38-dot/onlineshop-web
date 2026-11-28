import type { Metadata } from "next"; import Link from "next/link"; 
import { notFound } from "next/navigation"; 
import { OrderStatusBadge } from "@/components/order-status"; import { Badge, Card, PageTitle } from "@/components/ui"; 
import { adminGetCustomer, adminGetOrders } from "@/lib/data/admin"; import { formatDate, formatPrice } from "@/lib/format"; import { CustomerForm, DeleteCustomerButton } from "../customer-form"; 
  
export const metadata: Metadata = { title: "Харилцагч" }; 
  
export default async function AdminCustomerPage({ params }: PageProps<"/admin/customers/[id]">) {   const id = Number((await params).id); 
  if (!Number.isInteger(id) || id <= 0) notFound(); 
  
  const [customer, orders] = await Promise.all([adminGetCustomer(id), adminGetOrders({ customerId: 
id })]); 
  if (!customer) notFound(); 
  
  return (     <> 
      <Link href="/admin/customers" className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900"> 
        ← Бүх харилцагч       </Link> 
      <PageTitle actions={customer.userId ? <Badge tone="blue">Бүртгэлтэй хэрэглэгч</Badge> : 
undefined}> 
        {customer.fullName} 
      </PageTitle> 
  
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">         <Card> 
          <CustomerForm customer={customer} /> 
        </Card> 
  
        <div className="space-y-6"> 
          <Card className="p-4"> 
            <div className="mb-3 flex items-center justify-between"> 
              <h2 className="font-semibold">Захиалгууд ({orders.totalElements})</h2> 
              {orders.totalElements > orders.content.length && ( 
                <Link href={`/admin/orders?customerId=${customer.id}`} className="text-sm text-brand-600 hover:underline"> 
                  Бүгд 
                </Link> 
              )} 
            </div> 
            {orders.content.length === 0 ? ( 
              <p className="text-sm text-slate-500">Захиалга алга</p> 
            ) : ( 
              <ul className="divide-y divide-slate-100 text-sm"> 
                {orders.content.map((o) => ( 
                  <li key={o.id} className="flex items-center justify-between gap-2 py-2">                     <div> 
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-brand-600 hover:underline"> 
                        {o.orderNumber} 
                      </Link> 
                      <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>                     </div> 
                    <div className="text-right"> 
                      <OrderStatusBadge status={o.status} /> 
                      <p className="mt-1 tabular-nums">{formatPrice(o.totalAmount)}</p>                     </div> 
                  </li> 
                ))} 
              </ul> 
            )} 
          </Card> 
          {/* Захиалгатай харилцагчийг backend устгахыг зөвшөөрөхгүй (мессеж харагдана) */}           <DeleteCustomerButton customer={customer} /> 
        </div> 
      </div> 
    </> 
  ); } 
