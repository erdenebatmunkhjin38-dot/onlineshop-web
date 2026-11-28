"use client"; 
  
import { useActionState } from "react"; 
import { updateOrderStatus } from "@/actions/admin"; import { Button, Card } from "@/components/ui"; 
import { NEXT_STATUSES, ORDER_STATUS_LABEL } from "@/lib/format"; import { initialFormState } from "@/lib/form-state"; import type { OrderStatus } from "@/lib/types"; 
  
/** 
 * Захиалгын төлөв солих. Зөвхөн зөвшөөрөгдсөн дараагийн төлвүүдийг товч болгон харуулна  * (backend мөн ижил дүрмээр шалгана). 
 */ 
export function StatusForm({ orderId, status }: { orderId: number; status: OrderStatus }) {   const [state, formAction, pending] = useActionState(updateOrderStatus, initialFormState);   const next = NEXT_STATUSES[status]; 
  
  if (next.length === 0) return null; 
  
  return ( 
    <Card className="space-y-3 p-4"> 
      <h2 className="text-sm font-semibold">Төлөв солих</h2> 
      <form         action={formAction}         onSubmit={(e) => { 
          // Дарсан товчны утгыг шалгана: цуцлах үед баталгаажуулна
          const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
          if(submitter?.value === "CANCELLED" && !confirm("Захиалгыг цуцлах уу? Бараа нөөцөд буцна.")) e.preventDefault(); 
        }} 
        className="flex flex-col gap-2" 
      > 
        <input type="hidden" name="orderId" value={orderId} /> 
        {next.map((s) => ( 
          <Button             key={s}             name="status"             value={s}             disabled={pending}             variant={s === "CANCELLED" ? "secondary" : "primary"}             className={s === "CANCELLED" ? "text-red-600" : undefined}           > 
            {s === "CANCELLED" ? "Цуцлах" : `→ ${ORDER_STATUS_LABEL[s]}`}           </Button> 
        ))} 
      </form> 
      {state.message && <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-600"}>{state.message}</p>} 
    </Card> 
  ); } 
