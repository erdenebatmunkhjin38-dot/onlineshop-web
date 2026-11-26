import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/skeletons";
import { ButtonLink, Skeleton } from "@/components/ui";
import { getCategories, searchProducts } from "@/lib/data/catalog";

export default function HomePage() {
  return (
    <div className="space-y-12">
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

      {/* Ангилал + шинэ бүтээгдэхүүн: нэг Suspense */}
      <Suspense fallback={<CategoriesAndLatestSkeleton />}>
        <CategoriesAndLatest />
      </Suspense>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Хамгийн хямд бүтээгдэхүүн</h2>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <CheapestProducts />
        </Suspense>
      </section>
    </div>
  );
}

async function CategoriesAndLatest() {
  // Хоёр хүсэлт зэрэг эхэлж, хоёулаа дууссаны дараа үргэлжилнэ
  const [categories, latest] = await Promise.all([
    getCategories(),
    searchProducts({ size: 8, sort: "id,desc" }),
  ]);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Ангилал</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-brand-500"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Шинэ бүтээгдэхүүн</h2>
        <ProductGrid products={latest.content} />
      </section>
    </div>
  );
}

function CategoriesAndLatestSkeleton() {
  return (
    <div className="space-y-12">
      <Skeleton className="h-20 w-full" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}

async function CheapestProducts() {
  const cheapest = await searchProducts({ size: 4, sort: "price,asc" });
  return <ProductGrid products={cheapest.content} />;
}
