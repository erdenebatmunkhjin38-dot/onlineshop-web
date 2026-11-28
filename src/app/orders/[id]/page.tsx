import type { Metadata } from "next"; import Link from "next/link"; 
import { notFound } from "next/navigation"; import { CancelOrderButton } from "@/components/cancel-order-button"; import { OrderDetail } from "@/components/order-detail"; import { Alert, PageTitle } from "@/components/ui"; 
import { getOrder } from "@/lib/data/account"; import { param } from "@/lib/url"; 
  
export const metadata: Metadata = { title: "Захиалга" }; 
  
export default async function OrderPage({ params, searchParams }: PageProps<"/orders/[id]">) {   const [{ id }, sp] = await Promise.all([params, searchParams]);   const orderId = Number(id); 
  if (!Number.isInteger(orderId) || orderId <= 0) notFound(); 
  
  // Өөр хэрэглэгчийн захиалга бол backend 404 буцаана → null
  const order = await getOrder(orderId);
  if (!order) notFound(); 
  
  return (     <> 
      <Link href="/orders" className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900"> 
        ← Миний захиалгууд 
      </Link> 
      <PageTitle>Захиалга {order.orderNumber}</PageTitle> 
  
      {/* checkout-ийн дараа ?placed=1 гэж ирнэ */} 
      {param(sp.placed) && ( 
        <div className="mb-6"> 
          <Alert ok>Захиалга амжилттай үүслээ. Бид тантай удахгүй холбогдоно.</Alert>
          </div> 
      )} 
  
      <OrderDetail         order={order} 
        actions={order.status === "PENDING" ? <CancelOrderButton orderId={order.id} /> : undefined}       /> 
    </> 
  ); } 
