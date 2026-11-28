import type { Metadata } from "next"; import Link from "next/link"; 
import { Alert } from "@/components/ui"; 
import { param, safeNext, toSearchParams } from "@/lib/url"; import { LoginForm } from "./login-form"; 
  
export const metadata: Metadata = { title: "Нэвтрэх" }; 
  
/** (auth) хавтас нь route group: URL-д орохгүй, зөвхөн layout-ыг хуваалцана. */ export default async function LoginPage({ searchParams }: PageProps<"/login">) {   const sp = await searchParams;   const next = safeNext(param(sp.next)); 
  
  return (     <> 
      <h1 className="text-2xl font-bold tracking-tight">Нэвтрэх</h1> 
      <p className="mt-1 mb-6 text-sm text-slate-600">Захиалга хийхийн тулд нэвтэрнэ үү.</p> 
      {param(sp.expired) && ( 
        <div className="mb-4"> 
          <Alert>Таны нэвтрэлтийн хугацаа дууссан байна. Дахин нэвтэрнэ үү.</Alert>         </div> 
      )} 
      <LoginForm next={next} /> 
      <p className="mt-6 text-center text-sm text-slate-600"> 
        Бүртгэлгүй юу?{" "} 
        <Link href={`/register${toSearchParams({ next })}`} className="font-medium text-brand-600 hover:underline"> 
          Бүртгүүлэх 
        </Link> 
      </p> 
    </> 
  ); } 
