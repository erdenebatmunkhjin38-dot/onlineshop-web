"use client"; 
  
import Link from "next/link"; import { useActionState } from "react"; 
import { removeCartItem, updateCartItem } from "@/actions/cart"; import { ProductImage } from "@/components/product-image"; import { SubmitButton } from "@/components/submit-button";
import { inputClass } from "@/components/ui"; import { cn, formatPrice } from "@/lib/format"; import { initialFormState } from "@/lib/form-state"; import type { CartItem } from "@/lib/types"; 
  /** 
*	Сагсны нэг мөр. Тоог <input type="number">-ээр оруулна.
*	Тэмдэгт бүрт биш, утгыг бичиж дуусаад (Enter эсвэл өөр газар дарахад) нэг удаа илгээнэ.
 */ 
export function CartItemRow({ item }: { item: CartItem }) { 
  const [state, formAction, pending] = useActionState(updateCartItem, initialFormState);   
  
  return ( 
    <li className="flex gap-4 py-4"> 
      <Link href={`/products/${item.productId}`} className="shrink-0"> 
        <ProductImage src={item.imageUrl} alt={item.productName} sizes="80px" className="h-20 w-20 rounded-lg" /> 
      </Link> 
  
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex-1"> 
          <Link href={`/products/${item.productId}`} className="font-medium hover:text-brand-600">
          {item.productName} 
          </Link> 
          <p className="text-sm text-slate-500">{formatPrice(item.unitPrice)}</p>
          {!item.available && ( 
            <p className="mt-1 text-xs text-red-600"> 
              {item.stockQuantity > 0 
                ? `Нөөц хүрэлцэхгүй: ${item.stockQuantity} ширхэг үлдсэн`                 : "Худалдаанд байхгүй болсон. Сагснаас хасна уу."}
                </p>           )} 
          {state.message && !state.ok && <p className="mt-1 text-xs text-red-600">{state.message}</p>} 
        </div> 
  
        <form action={formAction} className="w-20" aria-busy={pending}>
          <input type="hidden" name="productId" value={item.productId} />
          <input
            // Серверээс шинэ тоо ирэхэд input-ийг дахин үүсгэж, defaultValue-г шинэчилнэ
            key={item.quantity}
            name="quantity"
            type="number"
            min={1}
            max={item.stockQuantity}
            required
            defaultValue={item.quantity}
            readOnly={pending}
            disabled={item.stockQuantity <= 0}
            aria-label={`${item.productName}: тоо ширхэг`}
            className={cn(inputClass, "text-center tabular-nums")}
            onBlur={(e) => {
              const input = e.currentTarget;
              if (pending || input.value === String(item.quantity)) return;
              // Хоосон орхивол хуучин тоог буцаана
              if (input.value === "") input.value = String(item.quantity);
              // Буруу утга бол requestSubmit() илгээхгүй, browser алдааг нь харуулна
              else input.form?.requestSubmit();
            }}
          />
        </form> 
  
        <p className="w-28 font-semibold tabular-nums sm:text-right">{formatPrice(item.subtotal)}</p> 
  
        <form action={removeCartItem}> 
          <input type="hidden" name="productId" value={item.productId} /> 
          <SubmitButton variant="ghost" pendingText="..." className="px-2 text-red-600" aria-label="Устгах"> 
            Устгах 
          </SubmitButton> 
        </form> 
      </div> 
    </li> 
  ); } 
