import { ProductGrid } from "@/components/product-card"; 
import type { Category, Product } from "@/lib/types"; 
  
const phones: Category = { id: 1, name: "Гар утас", description: null }; 
  
/** Жишээ бүтээгдэхүүн үүсгэх туслах функц */ 
function mock(id: number, name: string, price: number, stockQuantity: number): Product {   return {     id, name, price, stockQuantity,     description: "Жишээ тайлбар",     inStock: stockQuantity > 0,     imageUrl: null,     active: true, 
    category: phones,     createdAt: "2026-11-16T10:00:00",     updatedAt: "2026-11-16T10:00:00",   }; 
} 
  
const MOCK_PRODUCTS: Product[] = [   mock(1, "iPhone 15", 3299000, 15),   mock(2, "Galaxy S24", 2899000, 8),   mock(3, "Pixel 9", 2599000, 0), 
  mock(4, "Утасны цэнэглэгч 20W", 45000, 120), ]; 
  
export default function HomePage() {   return ( 
    <main className="mx-auto max-w-7xl p-8"> 
      <h1 className="mb-6 text-3xl font-bold">Онлайн дэлгүүр</h1>       <ProductGrid products={MOCK_PRODUCTS} /> 
    </main> 
  ); } 
