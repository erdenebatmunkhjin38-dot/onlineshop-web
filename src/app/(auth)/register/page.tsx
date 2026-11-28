import type { Metadata } from "next"; import Link from "next/link"; 
import { param, safeNext, toSearchParams } from "@/lib/url"; import { RegisterForm } from "./register-form"; 
  
export const metadata: Metadata = { title: "Бүртгүүлэх" }; 
  
export default async function RegisterPage({ searchParams }: PageProps<"/register">) {   const next = safeNext(param((await searchParams).next)); 
  
  return (     <> 
      <h1 className="text-2xl font-bold tracking-tight">Бүртгүүлэх</h1> 
      <p className="mt-1 mb-6 text-sm text-slate-600">Шинэ бүртгэл үүсгэж худалдан авалтаа эхлүүлээрэй.</p> 
      <RegisterForm next={next} /> 
      <p className="mt-6 text-center text-sm text-slate-600"> 
        Бүртгэлтэй юу?{" "} 
        <Link href={`/login${toSearchParams({ next })}`} className="font-medium text-brand-600 hover:underline"> 
          Нэвтрэх 
        </Link> 
      </p> 
    </> 
  ); } 
