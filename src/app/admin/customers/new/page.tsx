import type { Metadata } from "next"; 
import { Card, PageTitle } from "@/components/ui"; import { requireAdmin } from "@/lib/data/dal"; import { CustomerForm } from "../customer-form"; 
  
export const metadata: Metadata = { title: "Шинэ харилцагч" }; 
  
export default async function NewCustomerPage() {   await requireAdmin(); 
  
  return ( 
    <> 
      <PageTitle>Шинэ харилцагч</PageTitle> 
      <p className="-mt-4 mb-6 text-sm text-slate-500">Утсаар захиалга өгсөн, бүртгэлгүй худалдан авагчийг нэмнэ.</p> 
      <Card className="max-w-2xl"> 
        <CustomerForm /> 
      </Card> 
    </> 
  ); } 
