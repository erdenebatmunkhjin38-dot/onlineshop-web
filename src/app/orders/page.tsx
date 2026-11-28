import type { Metadata } from "next"; import Link from "next/link"; 
import { OrderStatusBadge } from "@/components/order-status"; import { Pagination } from "@/components/pagination"; 
import { ButtonLink, EmptyState, PageTitle, Table, Td, Th } from "@/components/ui"; import { getMyOrders } from "@/lib/data/account"; import { cn, formatDate, formatPrice, ORDER_STATUS_LABEL } from "@/lib/format"; import { pageParam, param, toSearchParams } from "@/lib/url";
import type { OrderStatus } from "@/lib/types"; 
  
export const metadata: Metadata = { title: "Миний захиалгууд" }; 
  
const STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[];

export default async function OrdersPage({ searchParams }: PageProps<"/orders">) {
  const sp = await searchParams;
  const page = pageParam(sp.page);
  // URL-д буруу утга бичвэл "Бүгд" гэж үзнэ
  const status = STATUSES.find((s) => s === param(sp.status));
  const orders = await getMyOrders(page, status); 
  
  return ( 
    <> 
      <PageTitle>Миний захиалгууд</PageTitle>
      {/* Төлөв солиход ?page= орохгүй тул эхний хуудаснаас эхэлнэ */}
      <nav aria-label="Төлөвөөр шүүх" className="mb-4 flex gap-1 overflow-x-auto">
        {[undefined, ...STATUSES].map((s) => (
          <Link
            key={s ?? "ALL"}
            href={`/orders${toSearchParams({ status: s })}`}
            aria-current={s === status ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2 text-sm whitespace-nowrap",
              s === status ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-200",
            )}
          >
            {s ? ORDER_STATUS_LABEL[s] : "Бүгд"}
          </Link>
        ))}
      </nav>
      {orders.content.length === 0 ? ( 
        <EmptyState title={status ? "Энэ төлөвтэй захиалга алга" : "Танд одоогоор захиалга алга"}> 
          <ButtonLink href="/products">Дэлгүүр хэсэх</ButtonLink>
          </EmptyState> 
      ) : ( 
        <Table> 
          <thead> 
            <tr> 
              <Th>Дугаар</Th> 
              <Th>Огноо</Th> 
              <Th>Бараа</Th> 
              <Th>Төлөв</Th> 
              <Th className="text-right">Дүн</Th> 
            </tr> 
          </thead> 
          <tbody> 
            {orders.content.map((order) => ( 
              <tr key={order.id} className="hover:bg-slate-50"> 
                <Td> 
                  <Link href={`/orders/${order.id}`} className="font-medium text-brand-600 hover:underline"> 
                    {order.orderNumber} 
                  </Link>
                  </Td> 
                <Td className="text-slate-600">{formatDate(order.createdAt)}</Td>
                <Td className="text-slate-600">{order.items.length} төрөл</Td>
                <Td> 
                  <OrderStatusBadge status={order.status} />
                  </Td> 
                <Td className="text-right font-medium tabular-nums">{formatPrice(order.totalAmount)}</Td> 
              </tr> 
            ))} 
          </tbody> 
        </Table>       )} 
      <Pagination page={orders.page} totalPages={orders.totalPages} pathname="/orders" params={{ status }} />
      </> 
  ); } 
