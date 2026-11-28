import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { ButtonLink } from "@/components/ui";
import { getCategories, searchProducts } from "@/lib/data/catalog";

// Гарчгийг root layout-ийн title.default-аас авна
export const metadata: Metadata = {
  description:
    "Электрон бараа, хувцас, ном болон бусад бүтээгдэхүүнийг хурдан, найдвартай хүргэлттэй захиалах онлайн дэлгүүр.",
};

/**
 * Нүүр хуудас. Cookie, searchParams уншдаггүй, өгөгдөл нь 'use cache'-тай тул
 * build үед бүхэлдээ static shell болж зурагдана: хэрэглэгч шууд харна.
 */
export default async function HomePage() {
  // Хүсэлтүүдийг зэрэг илгээнэ (дараалан хүлээвэл удна)
  const [categories, latest, cheapest] = await Promise.all([
    getCategories(),
    searchProducts({ size: 8, sort: "id,desc" }),
    searchProducts({ size: 4, sort: "price,asc" }),
  ]);

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-14 text-white">
        <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Хэрэгтэй бүхнээ нэг дороос</h1>
        <p className="mt-3 max-w-lg text-brand-100">
          Электрон бараа, хувцас, ном болон бусад бүтээгдэхүүнийг хурдан, найдвартай хүргэлттэй захиалаарай.
        </p>
        <ButtonLink href="/products" variant="secondary" className="mt-6 border-0">
          Бүх бүтээгдэхүүн үзэх
        </ButtonLink>
      </section>

      {categories.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Ангилал</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?categoryId=${category.id}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-brand-500 hover:text-brand-600"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Шинэ бүтээгдэхүүн</h2>
          <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline">
            Бүгдийг харах →
          </Link>
        </div>
        <ProductGrid products={latest.content} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Хамгийн хямд бүтээгдэхүүн</h2>
        <ProductGrid products={cheapest.content} />
      </section>
    </div>
  );
}
