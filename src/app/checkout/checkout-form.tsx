"use client"; 
  
import { useActionState } from "react"; import { checkout } from "@/actions/cart"; 
import { SubmitButton } from "@/components/submit-button"; import { Alert, Field } from "@/components/ui"; import { initialFormState } from "@/lib/form-state"; import type { Customer } from "@/lib/types"; 
  
export function CheckoutForm({ customer }: { customer: Customer }) {   const [state, formAction] = useActionState(checkout, initialFormState);   const errors = state.fieldErrors ?? {}; 
  // Алдаа гарвал хэрэглэгчийн оруулсан утгыг, үгүй бол профайлын утгыг харуулна
  const v = state.values ?? {
    shippingAddress: customer.address ?? "",
    shippingCity: customer.city ?? "",
    phone: customer.phone ?? "",
  }; 
  
  return ( 
    <form action={formAction} className="space-y-4"> 
      {state.message && <Alert>{state.message}</Alert>} 
      <Field         label="Хүргэлтийн хаяг"         name="shippingAddress"         required 
        placeholder="Дүүрэг, хороо, байр, тоот"         defaultValue={v.shippingAddress}         error={errors.shippingAddress} 
      /> 
      <div className="grid gap-4 sm:grid-cols-2"> 
        <Field label="Хот / аймаг" name="shippingCity" defaultValue={v.shippingCity} error={errors.shippingCity} /> 
        <Field label="Утас" name="phone" type="tel" required defaultValue={v.phone} error={errors.phone} /> 
      </div> 
      <label className="flex items-center gap-2 text-sm text-slate-700"> 
        <input type="checkbox" name="saveToProfile" defaultChecked={!customer.address} className="h-4 w-4 rounded" /> 
        Энэ мэдээллийг профайлдаа хадгалах 
      </label> 
      <SubmitButton className="w-full py-3" pendingText="Захиалга үүсгэж байна...">         Захиалга баталгаажуулах 
      </SubmitButton> 
    </form> 
  ); } 
