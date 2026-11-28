import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { activateProduct, deactivateProduct } from "@/actions/admin";
import { Pagination } from "@/components/pagination";
import { ProductImage } from "@/components/product-image";
import { SubmitButton } from "@/components/submit-button";
import { Alert, Badge, ButtonLink, PageTitle, Table, Td, Th, buttonClass, inputClass } from "@/components/ui";
import { adminSearchProducts } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/catalog";
import { formatPrice } from "@/lib/format";
import { numberParam, pageParam, param } from "@/lib/url";

export const metadata: Metadata = { title: "Бүтээгдэхүүн" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const name = param(sp.name)?.trim() || undefined;
  const categoryId = numberParam(sp.categoryId);
  const onlyInactive = param(sp.onlyInactive) === "1";

  const [products, categories] = await Promise.all([
    adminSearchProducts({ name, categoryId, onlyInactive, page: pageParam(sp.page), size: 15, sort: "id,desc" }),
    getCategories(),
  ]);

  return (
    <>
      <PageTitle actions={<ButtonLink href="/admin/products/new">+ Шинэ бүтээгдэхүүн</ButtonLink>}>
        Бүтээгдэхүүн
      </PageTitle>

      {param(sp.saved) && (
        <div className="mb-4">
          <Alert ok>Бүтээгдэхүүн хадгалагдлаа.</Alert>
        </div>
      )}

      <Form action="/admin/products" className="mb-4 flex flex-wrap gap-2">
        <input name="name" defaultValue={name} placeholder="Нэрээр хайх" className={`${inputClass} max-w-xs`} />
        <select name="categoryId" defaultValue={categoryId ?? ""} className={`${inputClass} max-w-48`}>
          <option value="">Бүх ангилал</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          {/* key: URL өөрчлөгдөхөд checkbox-ийн төлөвийг дагуулж шинэчилнэ */}
          <input
            key={String(onlyInactive)}
            type="checkbox"
            name="onlyInactive"
            value="1"
            defaultChecked={onlyInactive}
            className="h-4 w-4 rounded"
          />
          Зөвхөн хасагдсан
        </label>
        <button className={buttonClass("secondary")}>Хайх</button>
      </Form>

      <Table>
        <thead>
          <tr>
            <Th>Бүтээгдэхүүн</Th>
            <Th>Ангилал</Th>
            <Th className="text-right">Үнэ</Th>
            <Th className="text-right">Нөөц</Th>
            <Th>Төлөв</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {products.content.map((p) => (
            <tr key={p.id} className={p.active ? "hover:bg-slate-50" : "bg-slate-50 text-slate-500"}>
              <Td>
                <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:text-brand-600">
                  <ProductImage src={p.imageUrl} alt="" sizes="40px" className="h-10 w-10 shrink-0 rounded-md" />
                  <span className="font-medium">{p.name}</span>
                </Link>
              </Td>
              <Td>{p.category.name}</Td>
              <Td className="text-right tabular-nums">{formatPrice(p.price)}</Td>
              <Td className={p.stockQuantity === 0 ? "text-right text-red-600" : "text-right tabular-nums"}>
                {p.stockQuantity}
              </Td>
              <Td>{p.active ? <Badge tone="green">Худалдаанд</Badge> : <Badge>Хасагдсан</Badge>}</Td>
              <Td>
                <div className="flex justify-end gap-1">
                  <Link href={`/admin/products/${p.id}`} className={buttonClass("ghost", "px-2 py-1")}>
                    Засах
                  </Link>
                  <form action={p.active ? deactivateProduct : activateProduct}>
                    <input type="hidden" name="productId" value={p.id} />
                    <SubmitButton
                      variant="ghost"
                      pendingText="..."
                      className={p.active ? "px-2 py-1 text-red-600" : "px-2 py-1 text-green-700"}
                    >
                      {p.active ? "Хасах" : "Сэргээх"}
                    </SubmitButton>
                  </form>
                </div>
              </Td>
            </tr>
          ))}
          {products.content.length === 0 && (
            <tr>
              <Td colSpan={6} className="py-8 text-center text-slate-500">
                Бүтээгдэхүүн олдсонгүй
              </Td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination
        page={products.page}
        totalPages={products.totalPages}
        pathname="/admin/products"
        params={{ name, categoryId: param(sp.categoryId), onlyInactive: onlyInactive ? "1" : undefined }}
      />
    </>
  );
}
