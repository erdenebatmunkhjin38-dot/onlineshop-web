import type { Metadata } from "next"; import { clearCart } from "@/actions/cart"; 
import { SubmitButton } from "@/components/submit-button"; 
import { Alert, ButtonLink, Card, EmptyState, PageTitle } from "@/components/ui"; import { getCart } from "@/lib/data/account"; import { formatPrice } from "@/lib/format"; import { CartItemRow } from "./cart-item-row"; 
  
export const metadata: Metadata = { title: "Сагс" }; 
  /** 
*	Сагс. Cookie уншдаг тул хүсэлт бүрт серверт зурагдана. 
*	Ачааллах үед ./loading.tsx харагдана (хуудсыг Suspense-д ороосон). 
 */ 
export default async function CartPage() {   const cart = await getCart(); 
  
  if (cart.items.length === 0) {     return ( 
      <> 
        <PageTitle>Сагс</PageTitle> 
        <EmptyState title="Таны сагс хоосон байна"> 
          <ButtonLink href="/products">Бүтээгдэхүүн үзэх</ButtonLink>
          </EmptyState> 
      </> 
    ); 
  } 
  
  return ( 
    <> 
      <PageTitle         actions={ 
          <form action={clearCart}> 
            <SubmitButton variant="ghost" pendingText="Хоосолж байна..." className="text-red-600"> 
              Сагс хоослох 
            </SubmitButton> 
          </form> 
        } 
      > 
        Сагс ({cart.totalQuantity}) 
      </PageTitle> 
  
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]"> 
        <Card className="py-2"> 
          <ul className="divide-y divide-slate-100"> 
            {cart.items.map((item) => ( 
              <CartItemRow key={item.productId} item={item} />             ))} 
          </ul> 
        </Card> 
  
        <Card className="h-fit space-y-4"> 
          <h2 className="font-semibold">Захиалгын дүн</h2> 
          <div className="flex justify-between text-sm"> 
            <span className="text-slate-600">Барааны тоо</span> 
            <span>{cart.totalQuantity}</span> 
          </div> 
          <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-semibold"> 
            <span>Нийт</span> 
            <span>{formatPrice(cart.totalAmount)}</span> 
          </div> 
          {cart.checkoutReady ? ( 
            <ButtonLink href="/checkout" className="w-full"> 
              Захиалах 
            </ButtonLink>           ) : ( 
            <Alert>Зарим бараа худалдаанд байхгүй эсвэл нөөц хүрэлцэхгүй байна. Сагсаа засна уу.</Alert> 
          )} 
        </Card> 
      </div> 
    </> 
  ); } 
