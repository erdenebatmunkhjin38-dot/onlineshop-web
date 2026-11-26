import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";

import { Pagination } from "@/components/pagination";
import { ProductGrid } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/skeletons";
import { EmptyState, inputClass, buttonClass } from "@/components/ui";
import { getCategories, searchProducts } from "@/lib/data/catalog";
import { cn } from "@/lib/format";
import type { ProductQuery } from "@/lib/types";
import { numberParam, pageParam, param, toSearchParams } from "@/lib/url";

export const metadata: Metadata = { title: "Бүтээгдэхүүн" };

const SORTS = [
  { value: "", label: "Шинэ нь эхэндээ" },
  { value: "price,asc", label: "Үнэ: багаас их" },
  { value: "price,desc", label: "Үнэ: ихээс бага" },
  { value: "name,asc", label: "Нэрээр (А-Я)" },
];

type SearchParams = PageProps<"/products">["searchParams"];

/**
 * Бүтээгдэхүүний жагсаалт. Шүүлтүүрийн төлөв бүхэлдээ URL-д (?name=&categoryId=&page=):
 * холбоосыг хуваалцаж, "буцах" товч ажиллана, useState хэрэггүй.
 *
 * searchParams нь хүсэлт ирэх үед л мэдэгдэх тул түүнийг уншдаг хэсгийг <Suspense>-д оруулна.
 */
export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside>
        <Suspense fallback={null}>
          <Filters searchParams={searchParams} />
        </Suspense>
      </aside>
      <section>
        <Suspense fallback={<ProductGridSkeleton />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}

function toQuery(sp: Awaited<SearchParams>): ProductQuery {
  return {
    name: param(sp.name)?.trim() || undefined,
    categoryId: numberParam(sp.categoryId),
    minPrice: numberParam(sp.minPrice),
    maxPrice: numberParam(sp.maxPrice),
    inStock: param(sp.inStock) === "true" || undefined,
    // URL-аас ирсэн утгыг шууд итгэхгүй: зөвхөн жагсаалтад байгааг зөвшөөрнө
    sort: SORTS.find((s) => s.value && s.value === param(sp.sort))?.value ?? "id,desc",
    page: pageParam(sp.page),
    size: 12,
  };
}

async function Filters({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query = toQuery(sp);
  const categories = await getCategories();

  // Ангилал солиход бусад шүүлтүүрийг хадгалж, хуудсыг эхэнд нь буцаана
  const categoryHref = (id?: number) =>
    `/products${toSearchParams({
      name: query.name,
      categoryId: id,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      // анхдагч эрэмбийг URL-д бичихгүй
      sort: query.sort === "id,desc" ? undefined : query.sort,
      inStock: query.inStock,
    })}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Ангилал</h2>
        <ul className="space-y-1 text-sm">
          {[{ id: undefined, name: "Бүгд" }, ...categories].map((c) => (
            <li key={c.id ?? "all"}>
              <Link
                href={categoryHref(c.id)}
                className={cn(
                  "block rounded-lg px-3 py-1.5",
                  query.categoryId === c.id ? "bg-brand-50 font-medium text-brand-700" : "hover:bg-slate-100",
                )}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* key: URL солигдоход формыг шинэ утгаар дахин үүсгэнэ (defaultValue шинэчлэгдэнэ) */}
      <Form action="/products" key={JSON.stringify(sp)} className="space-y-3">
        {query.categoryId && <input type="hidden" name="categoryId" value={query.categoryId} />}
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Нэр</span>
          <input name="name" defaultValue={query.name} className={inputClass} placeholder="Хайх үг" />
        </label>
        <div>
          <span className="mb-1 block text-sm font-semibold">Үнэ (₮)</span>
          <div className="flex gap-2">
            <input name="minPrice" type="number" min={0} defaultValue={query.minPrice} placeholder="Доод" className={inputClass} />
            <input name="maxPrice" type="number" min={0} defaultValue={query.maxPrice} placeholder="Дээд" className={inputClass} />
          </div>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Эрэмбэлэх</span>
          <select name="sort" defaultValue={param(sp.sort) ?? ""} className={inputClass}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        {/* Чагтлаагүй checkbox формоор илгээгддэггүй тул URL-д ?inStock гарахгүй */}
        <label className="flex items-center gap-2 text-sm">
          <input name="inStock" type="checkbox" value="true" defaultChecked={query.inStock} className="size-4 accent-brand-600" />
          Зөвхөн нөөцтэй бараа
        </label>
        <div className="flex gap-2">
          <button className={buttonClass("primary", "flex-1")}>Шүүх</button>
          <Link href="/products" className={buttonClass("secondary")}>
            Цэвэрлэх
          </Link>
        </div>
      </Form>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query = toQuery(sp);
  const result = await searchProducts(query);

  // Хуудаслалтын холбоосонд одоогийн шүүлтүүрийг хадгална
  const keep = {
    name: query.name,
    categoryId: param(sp.categoryId),
    minPrice: param(sp.minPrice),
    maxPrice: param(sp.maxPrice),
    sort: param(sp.sort),
    inStock: query.inStock ? "true" : undefined,
  };

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold tracking-tight">
        {query.name ? `«${query.name}» хайлтын үр дүн` : "Бүтээгдэхүүн"} ({result.totalElements})
      </h1>
      {result.content.length === 0 ? (
        <EmptyState title="Бүтээгдэхүүн олдсонгүй">Шүүлтүүрээ өөрчилж дахин хайна уу.</EmptyState>
      ) : (
        <ProductGrid products={result.content} />
      )}
      <Pagination page={result.page} totalPages={result.totalPages} pathname="/products" params={keep} />
    </>
  );
}
