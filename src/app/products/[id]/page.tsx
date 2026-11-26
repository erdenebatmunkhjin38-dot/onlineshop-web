import { Suspense } from "react"; 
  
export default function ProductPage({ params }: PageProps<"/products/[id]">) {   return ( 
    <Suspense fallback={<p>Ачаалж байна...</p>}> 
      <ProductDetail params={params} /> 
    </Suspense> 
  ); 
} 
  
async function ProductDetail({ params }: { params: PageProps<"/products/[id]">["params"] }) {   const { id } = await params; 
  return <h1 className="text-2xl font-bold">Бүтээгдэхүүн #{id}</h1>; 
} 
