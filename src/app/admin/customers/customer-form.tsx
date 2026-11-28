"use client"; 
  
import { useActionState } from "react"; 
import { deleteCustomer, saveCustomer } from "@/actions/admin"; import { SubmitButton } from "@/components/submit-button"; import { Alert, ButtonLink, Field } from "@/components/ui"; import { initialFormState } from "@/lib/form-state"; import type { Customer } from "@/lib/types"; 
  
export function CustomerForm({ customer }: { customer?: Customer }) {   const [state, formAction] = useActionState(saveCustomer, initialFormState);   const errors = state.fieldErrors ?? {};   const v = state.values ?? {     fullName: customer?.fullName ?? "",     email: customer?.email ?? "",     phone: customer?.phone ?? "",     address: customer?.address ?? "",     city: customer?.city ?? "",   }; 
  
  return ( 
    <form action={formAction} className="space-y-4"> 
      {state.message && <Alert>{state.message}</Alert>} 
      {customer && <input type="hidden" name="customerId" value={customer.id} />} 
      <Field label="Овог нэр" name="fullName" required defaultValue={v.fullName} error={errors.fullName} /> 
      <div className="grid gap-4 sm:grid-cols-2"> 
        <Field label="Утас" name="phone" type="tel" defaultValue={v.phone} error={errors.phone} />         <Field label="Имэйл" name="email" type="email" defaultValue={v.email} error={errors.email} /> 
      </div> 
      <Field label="Хаяг" name="address" defaultValue={v.address} error={errors.address} />       <Field label="Хот / аймаг" name="city" defaultValue={v.city} error={errors.city} />       <div className="flex gap-2"> 
        <SubmitButton pendingText="Хадгалж байна...">{customer ? "Хадгалах" : "Нэмэх"}</SubmitButton> 
        <ButtonLink href="/admin/customers" variant="secondary">           Болих 
        </ButtonLink> 
      </div> 
    </form> 
  ); 
} 
  
export function DeleteCustomerButton({ customer }: { customer: Customer }) {   const [state, formAction] = useActionState(deleteCustomer, initialFormState); 
    return (     <form 
      action={formAction}       onSubmit={(e) => {         if (!confirm(`"${customer.fullName}" харилцагчийг устгах уу?`)) e.preventDefault(); 
      }} 
      className="space-y-2" 
    > 
      <input type="hidden" name="customerId" value={customer.id} /> 
      <SubmitButton variant="danger" className="w-full" pendingText="Устгаж байна...">         Харилцагч устгах       </SubmitButton> 
      {state.message && <p className="text-sm text-red-600">{state.message}</p>} 
    </form> 
  ); } 
