import type { Metadata } from "next"; import { redirect } from "next/navigation"; import { Card, PageTitle } from "@/components/ui"; import { getCart, getMyCustomer } from "@/lib/data/account"; import { formatPrice } from "@/lib/format"; import { CheckoutForm } from "./checkout-form"; 
  
export const metadata: Metadata = { title: "Захиалга баталгаажуулах" }; 
  
export default async function CheckoutPage() {   const [cart, customer] = await Promise.all([getCart(), getMyCustomer()]); 
  
  // Хоосон эсвэл засах шаардлагатай сагстай бол сагс руу буцаана
  if (cart.items.length === 0 || !cart.checkoutReady) redirect("/cart"); 
  
  return ( 
    <> 
      <PageTitle>Захиалга баталгаажуулах</PageTitle> 
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <Card> 
          <h2 className="mb-4 font-semibold">Хүргэлтийн мэдээлэл</h2> 
          <CheckoutForm customer={customer} /> 
        </Card> 
  
        <Card className="h-fit"> 
          <h2 className="mb-4 font-semibold">Таны захиалга</h2> 
          <ul className="space-y-3 text-sm"> 
            {cart.items.map((item) => ( 
              <li key={item.productId} className="flex justify-between gap-4"> 
                <span className="text-slate-700"> 
                  {item.productName} <span className="text-slate-400">× {item.quantity}</span>
                  </span> 
                <span className="shrink-0 tabular-nums">{formatPrice(item.subtotal)}</span>
                </li> 
            ))} 
          </ul> 
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-lg font-semibold"> 
            <span>Нийт</span> 
            <span>{formatPrice(cart.totalAmount)}</span> 
          </div> 
          <p className="mt-2 text-xs text-slate-500">Төлбөрийг бараа хүлээн авахдаа төлнө.</p>
          </Card> 
      </div> 
    </> 
  ); } 
