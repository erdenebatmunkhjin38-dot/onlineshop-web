import Link from "next/link"; 
import { notFound } from "next/navigation"; import { Suspense } from "react"; 
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { ProductGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui";
import { getProduct, searchProducts } from "@/lib/data/catalog";
import { formatPrice } from "@/lib/format";
  
type Params = PageProps<"/products/[id]">["params"]; 
  
/** id тоо биш бол (жишээ нь /products/abc) backend руу хандахгүйгээр 404 */
async function loadProduct(params: Params) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const product = await getProduct(id);
  // Худалдаанаас хасагдсан барааг backend энгийн хэрэглэгчид 404-өөр хариулна
  if (!product) notFound();
  return product;
}
  
export default function ProductPage({ params }: PageProps<"/products/[id]">) {   return ( 
    <Suspense fallback={<ProductSkeleton />}> 
      <ProductDetail params={params} /> 
    </Suspense> 
  ); 
} 
  
async function ProductDetail({ params }: { params: Params }) {   const product = await loadProduct(params); 
    return ( 
    <div> 
      <nav className="mb-6 text-sm text-slate-500"> 
        <Link href="/products" className="hover:text-slate-900"> 
          Бүтээгдэхүүн 
        </Link> 
        <span className="mx-2">/</span> 
        <Link href={`/products?categoryId=${product.category.id}`} className="hover:text-slate-900">           {product.category.name} 
        </Link> 
      </nav> 
  
      <div className="grid gap-10 md:grid-cols-2"> 
        <ProductImage           src={product.imageUrl}           alt={product.name} 
          sizes="(max-width: 768px) 100vw, 50vw"           priority 
          className="aspect-square rounded-2xl border border-slate-200"         /> 
  
        <div className="space-y-6"> 
          <div> 
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>             <p className="mt-3 text-3xl font-semibold text-brand-600">{formatPrice(product.price)}</p>
          </div> 
  
          <p className="text-sm">             {product.inStock ? ( 
              <span className="text-green-700">Бэлэн байгаа: {product.stockQuantity} ширхэг</span>             ) : ( 
              <span className="text-red-600">Дууссан</span> 
            )} 
          </p> 
  
  
          <div className="border-t border-slate-200 pt-6"> 
            <h2 className="mb-2 font-semibold">Тайлбар</h2> 
            <p className="whitespace-pre-line text-slate-700">{product.description}</p>           </div> 
        </div>
      </div>

      {/* Тусдаа Suspense: төстэй барааг хүлээлгүйгээр үндсэн мэдээлэл харагдана */}
      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts categoryId={product.category.id} productId={product.id} />
      </Suspense>
    </div>
  );
}

/** Ижил ангиллын 4 бараа (одоо үзэж буй барааг хасна) */
async function RelatedProducts({ categoryId, productId }: { categoryId: number; productId: number }) {
  // Одоогийн бараа үр дүнд орж болох тул 1-ээр илүү авна
  const result = await searchProducts({ categoryId, page: 0, size: 5, sort: "id,desc" });
  const related = result.content.filter((item) => item.id !== productId).slice(0, 4);
  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold tracking-tight">Төстэй бараа</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

function RelatedSkeleton() {
  return (
    <div className="mt-12">
      <Skeleton className="mb-4 h-7 w-40" />
      <ProductGridSkeleton count={4} />
    </div>
  );
}

function ProductSkeleton() {  return ( 
    <div className="grid gap-10 md:grid-cols-2"> 
      <Skeleton className="aspect-square rounded-2xl" /> 
      <div className="space-y-4"> 
        <Skeleton className="h-9 w-3/4" /> 
        <Skeleton className="h-9 w-1/3" /> 
        <Skeleton className="h-12 w-full" /> 
        <Skeleton className="h-32 w-full" />       </div> 
    </div> 
  ); 
} 
