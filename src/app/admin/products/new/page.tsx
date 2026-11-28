import type { Metadata } from "next"; 
import { Card, PageTitle } from "@/components/ui"; import { requireAdmin } from "@/lib/data/dal"; import { getCategories } from "@/lib/data/catalog"; import { ProductForm } from "../product-form"; 
  
export const metadata: Metadata = { title: "Шинэ бүтээгдэхүүн" }; 
  
export default async function NewProductPage() {   await requireAdmin(); 
  const categories = await getCategories(); 
  
  return ( 
    <> 
      <PageTitle>Шинэ бүтээгдэхүүн</PageTitle> 
      <Card className="max-w-3xl"> 
        <ProductForm categories={categories} /> 
      </Card> 
    </> 
  ); } 
