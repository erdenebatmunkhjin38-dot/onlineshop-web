import "server-only"; 
import { api, orNull } from "@/lib/api"; 
import type { Category, PageResponse, Product, ProductQuery } from "@/lib/types"; 
  
export async function getCategories() {   return api<Category[]>("/categories", { auth: false }); 
} 
  
export async function getCategory(id: number) {   return orNull(api<Category>(`/categories/${id}`, { auth: false })); 
} 
  
export async function searchProducts(query: ProductQuery) {   return api<PageResponse<Product>>("/products", { auth: false, query }); 
} 
  
export async function getProduct(id: number) {   return orNull(api<Product>(`/products/${id}`, { auth: false })); 
} 
