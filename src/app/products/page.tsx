import type { Metadata } from "next"; import { Suspense } from "react"; 
import { ProductGrid } from "@/components/product-card"; import { ProductGridSkeleton } from "@/components/skeletons"; import { EmptyState } from "@/components/ui"; import { searchProducts } from "@/lib/data/catalog"; 
  
export const metadata: Metadata = { title: "Бүтээгдэхүүн" }; 
  
export default function ProductsPage() {   return (     <section> 
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Бүтээгдэхүүн</h1>       <Suspense fallback={<ProductGridSkeleton />}> 
        <Results /> 
      </Suspense> 
    </section> 
  ); 
} 
  
async function Results() { 
  const result = await searchProducts({ page: 0, size: 12, sort: "id,desc" });   if (result.content.length === 0) return <EmptyState title="Бүтээгдэхүүн олдсонгүй" />;   return <ProductGrid products={result.content} />; 
} 
