"use client"; 
  
import { useActionState } from "react"; import { register } from "@/actions/auth"; 
import { SubmitButton } from "@/components/submit-button"; import { Alert, Field } from "@/components/ui"; import { initialFormState } from "@/lib/form-state"; 
  
export function RegisterForm({ next }: { next?: string }) { 
  const [state, formAction] = useActionState(register, initialFormState);   const errors = state.fieldErrors ?? {};   const v = state.values ?? {}; 
  
  return ( 
    <form action={formAction} className="space-y-4"> 
      {state.message && <Alert>{state.message}</Alert>} 
      {next && <input type="hidden" name="next" value={next} />} 
  
      <div className="grid gap-4 sm:grid-cols-2"> 
        <Field label="Овог" name="lastName" autoComplete="family-name" defaultValue={v.lastName} error={errors.lastName} /> 
        <Field label="Нэр" name="firstName" autoComplete="given-name" defaultValue={v.firstName} error={errors.firstName} /> 
      </div>       <Field         label="Нэвтрэх нэр"         name="username"         autoComplete="username"         required 
        hint="Латин үсэг, тоо, . _ - (3-50 тэмдэгт)"         defaultValue={v.username}         error={errors.username}       /> 
      <Field label="Имэйл" name="email" type="email" autoComplete="email" required defaultValue={v.email} error={errors.email} /> 
      <Field label="Утас" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} error={errors.phone} /> 
      <Field         label="Нууц үг"         name="password"         type="password" 
        autoComplete="new-password"         required         minLength={8} 
        hint="Хамгийн багадаа 8 тэмдэгт"         error={errors.password} 
      />       <Field         label="Нууц үг давтах"         name="confirmPassword"         type="password" 
        autoComplete="new-password"         required 
        error={errors.confirmPassword} 
      /> 
      <div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="terms" defaultChecked={v.terms === "on"} aria-invalid={!!errors.terms} />
          Үйлчилгээний нөхцөлийг зөвшөөрч байна
        </label>
        {errors.terms && <span className="mt-1 block text-xs text-red-600">{errors.terms}</span>}
      </div>
      <SubmitButton className="w-full" pendingText="Бүртгэж байна...">
        Бүртгүүлэх 
      </SubmitButton> 
    </form> 
  ); } 
