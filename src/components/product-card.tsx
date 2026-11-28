import Link from "next/link"; 
import { ProductImage } from "@/components/product-image";
 import { formatPrice } from "@/lib/format";
  import type { Product } from "@/lib/types"; 
  
export function ProductCard({ product, eager }: { product: Product; eager?: boolean }) {   return (     <Link 
      href={`/products/${product.id}`} 
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"     > 
      <ProductImage src={product.imageUrl} alt={product.name} eager={eager} className="aspect-square" /> 
      <div className="flex flex-1 flex-col gap-1 p-4"> 
        <span className="text-xs text-slate-500">{product.category.name}</span> 
        <h3 className="line-clamp-2 font-medium group-hover:text-brand-600">{product.name}</h3> 
        <div className="mt-auto flex items-end justify-between pt-2"> 
          <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
          {!product.inStock && <span className="text-xs text-red-600">Дууссан</span>}
          </div> 
      </div> 
    </Link> 
  ); 
} 
  
export function ProductGrid({ products }: { products: Product[] }) {   return ( 
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"> 
      {/* Эхний мөрийн 4 зураг дэлгэцэнд шууд харагдана: lazy loading хийхгүй */} 
      {products.map((product, i) => ( 
        <ProductCard key={product.id} product={product} eager={i < 4} /> 
      ))} 
    </div> 
  ); } 
