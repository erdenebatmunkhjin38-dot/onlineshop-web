import type { Metadata } from "next";
import { Card, EmptyState, PageTitle } from "@/components/ui";
import { requireAdmin } from "@/lib/data/dal";
import { getCategories } from "@/lib/data/catalog";
import { CategoryRow, NewCategoryForm } from "./category-forms";

export const metadata: Metadata = { title: "Ангилал" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  // Кэштэй функц. saveCategory нь updateTag('categories') дуудаж кэшийг шинэчилнэ.
  const categories = await getCategories();

  return (
    <>
      <PageTitle>Ангилал</PageTitle>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {categories.length === 0 ? (
          <EmptyState title="Ангилал алга" />
        ) : (
          <Card className="py-2">
            <ul className="divide-y divide-slate-100">
              {categories.map((c) => (
                // key-д нэрийг оруулснаар засагдсан үед мөр шинэ утгаар дахин үүснэ
                <CategoryRow key={`${c.id}-${c.name}-${c.description}`} category={c} />
              ))}
            </ul>
          </Card>
        )}
        <Card className="h-fit">
          <h2 className="mb-4 font-semibold">Шинэ ангилал</h2>
          <NewCategoryForm />
        </Card>
      </div>
    </>
  );
}
