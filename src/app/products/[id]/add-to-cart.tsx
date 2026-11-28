"use client"; 
  
import Link from "next/link"; import { useActionState } from "react"; import { addToCart } from "@/actions/cart"; 
import { SubmitButton } from "@/components/submit-button"; import { inputClass } from "@/components/ui"; import { initialFormState } from "@/lib/form-state"; 
  /** 
*	Client Component: useActionState нь Server Action-ий хариуг (амжилт/алдаа) хадгална. 
*	Нэвтрээгүй бол action өөрөө /login руу шилжүүлнэ. 
 */ 
export function AddToCart({ productId, stock }: { productId: number; stock: number }) {   const [state, formAction] = useActionState(addToCart, initialFormState); 
  
  if (stock <= 0) { 
    return <p className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-600">Энэ бараа одоогоор дууссан байна.</p>; 
  } 
  
  return ( 
    <form action={formAction} className="space-y-3"> 
      <input type="hidden" name="productId" value={productId} /> 
      <div className="flex gap-3"> 
        <label className="w-24"> 
          <span className="sr-only">Тоо ширхэг</span> 
          <input name="quantity" type="number" min={1} max={stock} defaultValue={1} className={inputClass} /> 
        </label> 
        <SubmitButton className="flex-1" pendingText="Нэмж байна...">           Сагсанд нэмэх 
        </SubmitButton> 
      </div> 
      {state.message && ( 
        <p role="status" className={state.ok ? "text-sm text-green-700" : "text-sm text-red-600"}> 
          {state.message} 
          {state.ok && ( 
            <Link href="/cart" className="ml-2 font-medium underline"> 
              Сагс руу очих 
            </Link> 
          )} 
        </p> 
      )} 
    </form> 
  ); } 
