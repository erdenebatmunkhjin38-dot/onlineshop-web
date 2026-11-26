import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { ButtonLink } from "@/components/ui";
import type { Category, Product } from "@/lib/types";

const phones: Category = { id: 1, name: "Гар утас", description: null };

/** Жишээ бүтээгдэхүүн үүсгэх туслах функц */
function mock(id: number, name: string, price: number, stockQuantity: number): Product {
  return {
    id,
    name,
    price,
    stockQuantity,
    description: "Жишээ тайлбар",
    inStock: stockQuantity > 0,
    imageUrl: null,
    active: true,
    category: phones,
    createdAt: "2026-11-16T10:00:00",
    updatedAt: "2026-11-16T10:00:00",
  };
}

const MOCK_PRODUCTS: Product[] = [
  mock(1, "iPhone 15", 3299000, 15),
  mock(2, "Galaxy S24", 2899000, 8),
  mock(3, "Pixel 9", 2599000, 0),
  mock(4, "Утасны цэнэглэгч 20W", 45000, 120),
];

const MOCK_CATEGORIES = ["Гар утас", "Зөөврийн компьютер", "Ном", "Хүнс"];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-14 text-white">
        <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
          Хэрэгтэй бүхнээ нэг дороос
        </h1>
        <p className="mt-3 max-w-lg text-brand-100">
          Электрон бараа, хувцас, ном болон бусад бүтээгдэхүүнийг хурдан, найдвартай хүргэлттэй
          захиалаарай.
        </p>
        <ButtonLink href="/products" variant="secondary" className="mt-6 border-0">
          Бүх бүтээгдэхүүн үзэх
        </ButtonLink>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Ангилал</h2>
        <div className="flex flex-wrap gap-2">
          {MOCK_CATEGORIES.map((name) => (
            <Link
              key={name}
              href="/products"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-brand-500 hover:text-brand-600"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Шинэ бүтээгдэхүүн</h2>
        <ProductGrid products={MOCK_PRODUCTS} />
      </section>
    </main>
  );
}
