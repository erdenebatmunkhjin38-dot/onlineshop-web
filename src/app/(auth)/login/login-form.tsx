"use client"; 
  
import { useActionState } from "react"; import { login } from "@/actions/auth";
import { PasswordField } from "@/components/password-field";
import { SubmitButton } from "@/components/submit-button"; import { Alert, Field } from "@/components/ui"; import { initialFormState } from "@/lib/form-state"; 
  
export function LoginForm({ next }: { next?: string }) { 
  const [state, formAction] = useActionState(login, initialFormState);   const errors = state.fieldErrors ?? {}; 
  
  return ( 
    <form action={formAction} className="space-y-4"> 
      {state.message && <Alert>{state.message}</Alert>} 
      {/* Нэвтэрсний дараа буцах хаяг */} 
      {next && <input type="hidden" name="next" value={next} />} 
      <Field 
        label="Нэвтрэх нэр"         name="username"         autoComplete="username"         required         autoFocus         defaultValue={state.values?.username}         error={errors.username} 
      />
      <PasswordField
        label="Нууц үг"
        name="password"
        autoComplete="current-password"
        required
        error={errors.password}
      />
      <SubmitButton className="w-full" pendingText="Нэвтэрч байна...">         Нэвтрэх 
      </SubmitButton> 
    </form> 
  ); } 
