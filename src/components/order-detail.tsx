import type { ReactNode } from "react"; 
import { OrderStatusBadge } from "@/components/order-status"; import { Card, Table, Td, Th } from "@/components/ui"; import { formatDate, formatPrice } from "@/lib/format"; import type { Order } from "@/lib/types"; 
  
/** Захиалгын дэлгэрэнгүй: хэрэглэгч болон админы хуудас хоёуланд ашиглана. */ export function OrderDetail({ order, actions }: { order: Order; actions?: ReactNode }) {   return ( 
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
    <Table> 
        <thead> 
          <tr> 
            <Th>Бүтээгдэхүүн</Th> 
            <Th className="text-right">Үнэ</Th> 
            <Th className="text-right">Тоо</Th> 
            <Th className="text-right">Дүн</Th>
            </tr> 
        </thead> 
        <tbody> 
          {order.items.map((item) => ( 
            <tr key={item.productId}> 
              <Td>{item.productName}</Td> 
              <Td className="text-right tabular-nums">{formatPrice(item.unitPrice)}</Td> 
              <Td className="text-right tabular-nums">{item.quantity}</Td> 
              <Td className="text-right tabular-nums">{formatPrice(item.subtotal)}</Td>
              </tr> 
          ))} 
        </tbody> 
        <tfoot>
        <tr> 
            <Td colSpan={3} className="border-0 text-right font-semibold"> 
              Нийт             </Td> 
            <Td className="border-0 text-right text-lg font-semibold tabular-nums">{formatPrice(order.totalAmount)}</Td> 
          </tr> 
        </tfoot> 
      </Table> 
  
      <div className="space-y-6"> 
        <Card className="space-y-3 text-sm"> 
          <div className="flex items-center justify-between"> 
            <span className="text-slate-500">Төлөв</span> 
            <OrderStatusBadge status={order.status} /> 
          </div> 
          <Row label="Огноо">{formatDate(order.createdAt)}</Row> 
          <Row label="Захиалагч">{order.customerName}</Row> 
          <Row label="Утас">{order.phone}</Row> 
          <Row label="Хаяг"> 
            {order.shippingAddress} 
            {order.shippingCity && `, ${order.shippingCity}`} 
          </Row> 
        </Card> 
        {actions} 
      </div> 
    </div> 
  ); 
} 
  
function Row({ label, children }: { label: string; children: ReactNode }) {   return ( 
    <div> 
      <p className="text-slate-500">{label}</p> 
      <p className="font-medium">{children}</p> 
    </div> 
  ); } 
