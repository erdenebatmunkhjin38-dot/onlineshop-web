import Link from "next/link"; 
import { OrderStatusBadge } from "@/components/order-status"; import { Card, PageTitle, Table, Td, Th } from "@/components/ui"; import { adminGetDashboard } from "@/lib/data/admin"; import { formatDate, formatPrice } from "@/lib/format"; 
  
export default async function AdminDashboard() {   const d = await adminGetDashboard(); 
  
  const stats = [
    { label: "Өнөөдрийн борлуулалт", value: formatPrice(d.todaySales), href: "/admin/orders" },
    { label: "Хүлээгдэж буй захиалга", value: d.pending, href: "/admin/orders?status=PENDING", highlight: d.pending > 0 }, 
    { label: "Төлөгдсөн (илгээх)", value: d.paid, href: "/admin/orders?status=PAID", highlight: d.paid > 0 }, 
    { label: "Хүргэлтэд", value: d.shipped, href: "/admin/orders?status=SHIPPED" }, 
    { label: "Нийт захиалга", value: d.orderCount, href: "/admin/orders" }, 
    { label: "Бүтээгдэхүүн", value: d.productCount, href: "/admin/products" }, 
    { label: "Хэрэглэгч", value: d.userCount, href: "/admin/users" }, 
    { label: "Харилцагч", value: d.customerCount, href: "/admin/customers" },   ]; 
  
  return ( 
    <> 
      <PageTitle>Хяналтын самбар</PageTitle> 
  
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4"> 
        {stats.map((s) => ( 
          <Link key={s.label} href={s.href}> 
            <Card className="p-4 transition hover:border-brand-500"> 
              <p className="text-sm text-slate-500">{s.label}</p> 
              <p className={s.highlight ? "mt-1 text-3xl font-bold text-amber-600" : "mt-1 text-3xl font-bold"}>{s.value}</p> 
            </Card> 
          </Link> 
        ))} 
      </div> 
  
      <h2 className="mt-10 mb-4 text-lg font-semibold">Сүүлийн захиалгууд</h2>       <Table> 
        <thead> 
          <tr> 
            <Th>Дугаар</Th> 
            <Th>Захиалагч</Th> 
            <Th>Огноо</Th> 
            <Th>Төлөв</Th> 
            <Th className="text-right">Дүн</Th>
          </tr>
        </thead> 
        <tbody> 
          {d.recentOrders.map((o) => ( 
            <tr key={o.id} className="hover:bg-slate-50"> 
              <Td> 
                <Link href={`/admin/orders/${o.id}`} className="font-medium text-brand-600 hover:underline"> 
                  {o.orderNumber} 
                </Link> 
              </Td> 
              <Td>{o.customerName}</Td> 
              <Td className="text-slate-600">{formatDate(o.createdAt)}</Td> 
              <Td> 
                <OrderStatusBadge status={o.status} /> 
              </Td> 
              <Td className="text-right tabular-nums">{formatPrice(o.totalAmount)}</Td>
            </tr>
          ))} 
          {d.recentOrders.length === 0 && ( 
            <tr> 
              <Td colSpan={5} className="py-8 text-center text-slate-500">                 Захиалга алга 
              </Td> 
            </tr> 
          )} 
        </tbody> 
      </Table> 
    </> 
  ); } 
