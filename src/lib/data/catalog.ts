import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { api, orNull } from "@/lib/api";
import type { Category, PageResponse, Product, ProductQuery } from "@/lib/types";

/**
 * Каталогийн өгөгдөл бүх хэрэглэгчид ижил тул серверт кэшилнэ (Лекц 9).
 *
 * - 'use cache' : функцийн үр дүнг кэшилнэ. Аргумент нь кэшийн түлхүүрийн нэг хэсэг болно.
 * - cacheLife   : хэр удаан хадгалах вэ.
 * - cacheTag    : админ бараа засахад updateTag('products')-аар кэшийг шууд хүчингүй болгоно.
 *
 * 'use cache' дотор cookies() уншиж болохгүй тул бүгд `auth: false`.
 */

export const CATALOG_TAGS = {
  products: "products",
  categories: "categories",
  product: (id: number) => `product-${id}`,
};

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAGS.categories);
  return api<Category[]>("/categories", { auth: false });
}

export async function getCategory(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAGS.categories);
  return orNull(api<Category>(`/categories/${id}`, { auth: false }));
}

export async function searchProducts({ inStock, ...query }: ProductQuery): Promise<PageResponse<Product>> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAGS.products);

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

export async function getProduct(id: number) {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAGS.products, CATALOG_TAGS.product(id));
  return orNull(api<Product>(`/products/${id}`, { auth: false }));
}
