import "server-only"; 
import { api, orNull } from "@/lib/api"; 
import type { Category, PageResponse, Product, ProductQuery } from "@/lib/types"; 
  
export async function getCategories() {   return api<Category[]>("/categories", { auth: false }); 
} 
  
export async function getCategory(id: number) {   return orNull(api<Category>(`/categories/${id}`, { auth: false })); 
} 
  
export async function searchProducts({ inStock, ...query }: ProductQuery): Promise<PageResponse<Product>> {
  if (!inStock) return fetchProducts(query);

  // Backend нөөцөөр шүүх параметргүй. Нэг хуудсыг л шүүвэл хуудас дутуу гарч, нийт тоо буруу болно.
  // Тиймээс бусад шүүлтүүрт таарах БҮХ барааг сервер дээр татаж, шүүгээд, дараа нь өөрсдөө хуудаслана.
  const available: Product[] = [];
  for (let page = 0, last = false; !last; page++) {
    const batch = await fetchProducts({ ...query, page, size: 100 });
    available.push(...batch.content.filter((product) => product.inStock));
    last = batch.last;
  }

  const { page = 0, size = 12 } = query;
  const totalPages = Math.ceil(available.length / size);
  return {
    content: available.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements: available.length,
    totalPages,
    last: page >= totalPages - 1,
  };
}

function fetchProducts(query: ProductQuery) {
  return api<PageResponse<Product>>("/products", { auth: false, query });
}
  
export async function getProduct(id: number) {   return orNull(api<Product>(`/products/${id}`, { auth: false })); 
} 
