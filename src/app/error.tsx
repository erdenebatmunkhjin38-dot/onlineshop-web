"use client"; // Error boundary нь заавал Client Component 
  
import { Button } from "@/components/ui"; 
  /** 
*	Хуудас зурах үед барьж аваагүй алдаа гарвал энэ харагдана (жишээ нь backend унтарсан). 
*	retry(): өгөгдлийг дахин татаж, хуудсыг дахин зурахыг оролдоно. 
 */ export default function Error({ error, retry }: { error: unknown; retry: () => void }) { 
  // Production-д серверийн алдааны мессеж нууцлагдана (digest л үлдэнэ) 
  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined; 
  
  return ( 
    <div className="mx-auto max-w-md py-16 text-center"> 
      <h1 className="text-xl font-semibold">Алдаа гарлаа</h1> 
      <p className="mt-2 text-sm text-slate-600"> 
        Хуудсыг ачаалах үед алдаа гарлаа. Сервертэй холболтоо шалгаад дахин оролдоно уу. 
      </p> 
      {digest && <p className="mt-2 font-mono text-xs text-slate-400">Код: {digest}</p>}       <Button className="mt-6" onClick={() => retry()}> 
        Дахин оролдох 
      </Button> 
    </div> 
  ); } 
