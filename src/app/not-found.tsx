import { ButtonLink } from "@/components/ui"; 
  
/** notFound() дуудсан эсвэл байхгүй хаяг руу орсон үед харагдана. */ export default function NotFound() {   return ( 
    <div className="mx-auto max-w-md py-16 text-center"> 
      <p className="text-5xl font-bold text-brand-600">404</p> 
      <h1 className="mt-4 text-xl font-semibold">Хуудас олдсонгүй</h1> 
      <p className="mt-2 text-sm text-slate-600">Таны хайсан хуудас устсан эсвэл хаяг буруу байна.</p> 
      <ButtonLink href="/" className="mt-6"> 
        Нүүр хуудас руу буцах 
      </ButtonLink> 
    </div> 
  ); } 
