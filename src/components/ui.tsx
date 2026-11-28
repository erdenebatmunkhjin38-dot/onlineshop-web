import Link from "next/link"; 
import type { ComponentProps, ReactNode } from "react"; import { cn } from "@/lib/format"; 
  /** 
 * Энгийн UI компонентууд. Бүгд Server Component (hook ашиглаагүй) тул  * Server болон Client Component-ийн аль алинд нь хэрэглэж болно.  */ 
  
// ---------- Товч ---------- 
  
type Variant = "primary" | "secondary" | "danger" | "ghost"; 
  
const VARIANTS: Record<Variant, string> = { 
  primary: "bg-brand-600 text-white hover:bg-brand-700", 
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",   danger: "bg-red-600 text-white hover:bg-red-700",   ghost: "text-slate-600 hover:bg-slate-100", }; 
  
export function buttonClass(variant: Variant = "primary", className?: string) {   return cn( 
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition", 
    "disabled:cursor-not-allowed disabled:opacity-50", 
    VARIANTS[variant],     className, 
  ); 
} 
  
export function Button({   variant = "primary",   className, 
  ...props 
}: ComponentProps<"button"> & { variant?: Variant }) { 
  return <button className={buttonClass(variant, className)} {...props} />; 
} 
  
/** Товч шиг харагдах холбоос */ export function ButtonLink({   variant = "primary",   className, 
  ...props 
}: ComponentProps<typeof Link> & { variant?: Variant }) { 
  return <Link className={buttonClass(variant, className)} {...props} />; 
} 
  
// ---------- Форм ---------- 
  
export const inputClass = 
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition " +   "focus:border-brand-500 focus:ring-2 focus:ring-brand-100 aria-invalid:border-red-500"; 
  

/** label + input + алдааны мессеж. `error` байвал input улаан болно. */ export function Field({   label,   name,   error,   hint,   className,   ...props 
}: ComponentProps<"input"> & { label: string; name: string; error?: string; hint?: string }) {   return ( 
    <label className={cn("block", className)}> 
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span> 
      <input name={name} aria-invalid={!!error} className={inputClass} {...props} />
      <FieldMessage error={error} hint={hint} /> 
    </label> 
  ); 
} 
  
export function TextArea({   label,   name,   error,   className,   ...props 
}: ComponentProps<"textarea"> & { label: string; name: string; error?: string }) {   return ( 
    <label className={cn("block", className)}> 
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span> 
      <textarea name={name} aria-invalid={!!error} className={inputClass} rows={4} {...props} />
      <FieldMessage error={error} /> 
    </label> 
  ); 
} 
  
export function Select({   label,   name,   error,   className,   children,   ...props 
}: ComponentProps<"select"> & { label: string; name: string; error?: string }) {   return ( 
    <label className={cn("block", className)}> 
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select name={name} aria-invalid={!!error} className={inputClass} {...props}>
      {children} 
      </select> 
      <FieldMessage error={error} /> 
    </label> 
  ); 
} 
  
function FieldMessage({ error, hint }: { error?: string; hint?: string }) {   if (error) return <span className="mt-1 block text-xs text-red-600">{error}</span>;   if (hint) return <span className="mt-1 block text-xs text-slate-500">{hint}</span>;   return null; 
} 
  
/** Формын ерөнхий мэдэгдэл (амжилт эсвэл алдаа) */ 
export function Alert({ ok, children }: { ok?: boolean; children: ReactNode }) {   return (     <div 
      role={ok ? "status" : "alert"}       className={cn( 
        "rounded-lg border px-4 py-3 text-sm", 
        ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800", 
      )} 
    > 
      {children} 
    </div> 

  ); 
} 
  
// ---------- Байршил ---------- 
  
export function Card({ className, ...props }: ComponentProps<"div">) {   return <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)} {...props} />; 
} 
  
export function PageTitle({ children, actions }: { children: ReactNode; actions?: ReactNode }) {   return ( 
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"> 
      <h1 className="text-2xl font-bold tracking-tight">{children}</h1>
      {actions && <div className="flex gap-2">{actions}</div>}
      </div> 
  ); 
} 
  
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {   return ( 
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"> 
      <p className="font-medium text-slate-700">{title}</p> 
      {children && <div className="mt-4 text-sm text-slate-500">{children}</div>}
      </div> 
  ); 
} 
  
/** Ачааллах үеийн саарал хайрцаг (skeleton) */ 
export function Skeleton({ className }: { className?: string }) {   return <div className={cn("animate-pulse rounded-lg bg-slate-200", className)} />; 
} 
  
// ---------- Хүснэгт ---------- 
  
export function Table({ children }: { children: ReactNode }) {   return ( 
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-left text-sm">{children}</table> 
    </div> 
  ); 
} 
  
export function Th({ className, ...props }: ComponentProps<"th">) {   return (     <th 
      className={cn("border-b border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-600", className)} 
      {...props} 
    /> 
  ); 
} 
  
export function Td({ className, ...props }: ComponentProps<"td">) {   return <td className={cn("border-b border-slate-100 px-4 py-3", className)} {...props} />; 
} 
  
// ---------- Badge ---------- 
  
export function Badge({ tone = "slate", children }: { tone?: "slate" | "green" | "amber" | "red" | 
"blue"; children: ReactNode }) {   const tones = { 
    slate: "bg-slate-100 text-slate-700",     green: "bg-green-100 text-green-800",     amber: "bg-amber-100 text-amber-800",     red: "bg-red-100 text-red-800",     blue: "bg-brand-100 text-brand-700",   }; 
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>; 
} 
 
