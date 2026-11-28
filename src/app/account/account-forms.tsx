"use client"; 
  
import { useActionState } from "react"; 
import { changePassword, updateProfile, updateShipping } from "@/actions/account"; import { SubmitButton } from "@/components/submit-button"; import { Alert, Field } from "@/components/ui"; 
import { initialFormState, type FormState } from "@/lib/form-state"; import type { Customer, User } from "@/lib/types"; 
  
function Message({ state }: { state: FormState }) {   return state.message ? <Alert ok={state.ok}>{state.message}</Alert> : null; 
} 
  
export function ProfileForm({ user }: { user: User }) { 
  const [state, formAction] = useActionState(updateProfile, initialFormState);   const errors = state.fieldErrors ?? {};   const v = state.values ?? { email: user.email, firstName: user.firstName ?? "", lastName: 
user.lastName ?? "" }; 
  
  return ( 
    <form action={formAction} className="space-y-4"> 
      <Message state={state} /> 
      <Field label="Нэвтрэх нэр" name="username" defaultValue={user.username} disabled hint="Нэвтрэх нэрийг солих боломжгүй" /> 
      <div className="grid gap-4 sm:grid-cols-2"> 
        <Field label="Овог" name="lastName" defaultValue={v.lastName} error={errors.lastName} /> 
        <Field label="Нэр" name="firstName" defaultValue={v.firstName} error={errors.firstName} />       </div> 
      <Field label="Имэйл" name="email" type="email" required defaultValue={v.email} error={errors.email} /> 
      <SubmitButton>Хадгалах</SubmitButton> 
    </form> 
  ); 
} 
  
export function ShippingForm({ customer }: { customer: Customer }) { 
  const [state, formAction] = useActionState(updateShipping, initialFormState);   const errors = state.fieldErrors ?? {};   const v = state.values ?? {     fullName: customer.fullName,     email: customer.email ?? "",     phone: customer.phone ?? "",     address: customer.address ?? "",     city: customer.city ?? "",   }; 
  
  return ( 
    <form action={formAction} className="space-y-4"> 
      <Message state={state} /> 
      <Field label="Хүлээн авагчийн нэр" name="fullName" required defaultValue={v.fullName} error={errors.fullName} /> 
      <div className="grid gap-4 sm:grid-cols-2"> 
        <Field label="Утас" name="phone" type="tel" defaultValue={v.phone} error={errors.phone} />         <Field label="Имэйл" name="email" type="email" defaultValue={v.email} error={errors.email} 
/> 
      </div> 
      <Field label="Хаяг" name="address" defaultValue={v.address} error={errors.address} /> 
      <Field label="Хот / аймаг" name="city" defaultValue={v.city} error={errors.city} />       <SubmitButton>Хадгалах</SubmitButton> 
    </form> 
  ); 
} 
  
export function PasswordForm() { 
  const [state, formAction] = useActionState(changePassword, initialFormState);   const errors = state.fieldErrors ?? {}; 
  
  return ( 
    <form action={formAction} className="space-y-4"> 
      <Message state={state} /> 
      <Field         label="Одоогийн нууц үг"         name="currentPassword"         type="password" 
        autoComplete="current-password"         required 
        error={errors.currentPassword} 
      />       <Field         label="Шинэ нууц үг"         name="newPassword"         type="password" 
        autoComplete="new-password"         required         minLength={8} 
        error={errors.newPassword} 
      />       <Field         label="Шинэ нууц үг давтах"         name="confirmPassword"         type="password" 
        autoComplete="new-password"         required 
        error={errors.confirmPassword} 
      /> 
      <SubmitButton>Нууц үг солих</SubmitButton> 
    </form> 
  ); } 
