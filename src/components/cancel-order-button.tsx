"use client"; 
  
import { useActionState } from "react"; import { cancelOrder } from "@/actions/account"; import { SubmitButton } from "@/components/submit-button"; import { initialFormState } from "@/lib/form-state"; 
  
export function CancelOrderButton({ orderId }: { orderId: number }) {   const [state, formAction] = useActionState(cancelOrder, initialFormState); 
    return (     <form       action={formAction} 
      // Буцаах боломжгүй үйлдэл тул баталгаажуулна. preventDefault() бол action дуудагдахгүй. 
      onSubmit={(e) => { 
        if (!confirm("Захиалгыг цуцлах уу?")) e.preventDefault(); 
      }}       className="space-y-2" 
    > 
      <input type="hidden" name="orderId" value={orderId} /> 
      <SubmitButton variant="danger" className="w-full" pendingText="Цуцалж байна..."> 
        Захиалга цуцлах 
      </SubmitButton> 
      {state.message && ( 
        <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-600"}>{state.message}</p> 
      )} 
    </form> 
  ); } 
