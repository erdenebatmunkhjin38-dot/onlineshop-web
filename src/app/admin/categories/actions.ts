"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

export async function updateCategory(id: number, formData: FormData) {
  await api<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: formData.get("name"),
      description: formData.get("description") || null,
    }),
  });
  revalidatePath("/admin/categories");
}
