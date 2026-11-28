import type { Metadata } from "next"; import Link from "next/link"; 
import { notFound } from "next/navigation"; import { removeProductImage } from "@/actions/admin"; import { ProductImage } from "@/components/product-image"; import { SubmitButton } from "@/components/submit-button"; import { Badge, Card, PageTitle } from "@/components/ui"; import { getCategories } from "@/lib/data/catalog"; import { adminGetProduct } from "@/lib/data/admin"; import { formatDate } from "@/lib/format"; import { ProductForm } from "../product-form"; 
  
export const metadata: Metadata = { title: "Бүтээгдэхүүн засах" }; 
  
export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {   const id = Number((await params).id); 
  if (!Number.isInteger(id) || id <= 0) notFound(); 
  
  const [product, categories] = await Promise.all([adminGetProduct(id), getCategories()]);   if (!product) notFound(); 
  
  return ( 
    <> 
      <PageTitle         actions={ 
          product.active && ( 
            <Link href={`/products/${product.id}`} className="text-sm text-brand-600 hover:underline"> 
              Дэлгүүрт харах → 
            </Link> 
          ) 
        } 
      > 
        {product.name} 
      </PageTitle> 
  
      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">         <Card> 
          <ProductForm product={product} categories={categories} />         </Card> 
  
        <div className="space-y-4"> 
          <Card className="space-y-3 p-4"> 
            <ProductImage src={product.imageUrl} alt={product.name} sizes="280px" priority className="aspect-square rounded-lg" /> 
            {product.imageUrl && ( 
              // Тусдаа форм: HTML-д форм дотор форм байрлуулж болохгүй 
              <form action={removeProductImage}> 
                <input type="hidden" name="productId" value={product.id} /> 
                <SubmitButton variant="secondary" className="w-full text-red-600" pendingText="Устгаж байна..."> 
                  Зураг устгах 
                </SubmitButton> 
              </form> 
            )} 
          </Card> 
          <Card className="space-y-2 p-4 text-sm"> 
            <p>{product.active ? <Badge tone="green">Худалдаанд</Badge> : <Badge>Хасагдсан</Badge>}</p> 
            <p className="text-slate-500">Нэмсэн: {formatDate(product.createdAt)}</p> 
            <p className="text-slate-500">Шинэчилсэн: {formatDate(product.updatedAt)}</p>           </Card> 
        </div> 
      </div> 
    </> 
  ); } 
