"use client";

import { useActionState, useState } from "react";
import { deleteCategory, saveCategory } from "@/actions/admin";
import { SubmitButton } from "@/components/submit-button";
import { Alert, Button, inputClass } from "@/components/ui";
import { initialFormState } from "@/lib/form-state";
import type { Category } from "@/lib/types";

export function NewCategoryForm() {
  const [state, formAction] = useActionState(saveCategory, initialFormState);
  const errors = state.fieldErrors ?? {};

  return (
    // React 19 action дууссаны дараа формыг цэвэрлэнэ. Алдаа гарвал оруулсан утгыг буцааж харуулна.
    <form action={formAction} className="space-y-3">
      {state.message && <Alert ok={state.ok}>{state.message}</Alert>}
      <div>
        <input
          name="name"
          placeholder="Ангиллын нэр"
          required
          defaultValue={state.ok ? "" : state.values?.name}
          className={inputClass}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>
      <input
        name="description"
        placeholder="Тайлбар (заавал биш)"
        defaultValue={state.ok ? "" : state.values?.description}
        className={inputClass}
      />
      <SubmitButton className="w-full">Нэмэх</SubmitButton>
    </form>
  );
}

/** Хүснэгтийн нэг мөр: харах горим ба засах горимын хооронд шилжинэ. */
export function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const [saveState, saveAction] = useActionState(async (prev: typeof initialFormState, formData: FormData) => {
    const result = await saveCategory(prev, formData);
    if (result.ok) setEditing(false); // амжилттай бол харах горим руу буцна
    return result;
  }, initialFormState);
  const [deleteState, deleteAction] = useActionState(deleteCategory, initialFormState);
  const error =
    deleteState.message && !deleteState.ok ? deleteState.message : saveState.ok ? undefined : saveState.message;
  const fieldError = saveState.fieldErrors?.name;

  if (editing) {
    return (
      <li className="py-3">
        <form action={saveAction} className="flex flex-wrap items-start gap-2">
          <input type="hidden" name="categoryId" value={category.id} />
          <div className="min-w-40 flex-1">
            <input
              name="name"
              defaultValue={category.name}
              required
              className={inputClass}
              aria-invalid={!!fieldError}
            />
            {fieldError && <p className="mt-1 text-xs text-red-600">{fieldError}</p>}
          </div>
          <input
            name="description"
            defaultValue={category.description ?? ""}
            placeholder="Тайлбар"
            className={`${inputClass} min-w-40 flex-[2]`}
          />
          <SubmitButton>Хадгалах</SubmitButton>
          <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
            Болих
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </li>
    );
  }

  return (
    <li className="py-3">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="font-medium">{category.name}</p>
          {category.description && <p className="text-sm text-slate-500">{category.description}</p>}
        </div>
        <Button variant="ghost" className="px-2 py-1" onClick={() => setEditing(true)}>
          Засах
        </Button>
        <form
          action={deleteAction}
          onSubmit={(e) => {
            if (!confirm(`"${category.name}" ангиллыг устгах уу?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="categoryId" value={category.id} />
          <SubmitButton variant="ghost" pendingText="..." className="px-2 py-1 text-red-600">
            Устгах
          </SubmitButton>
        </form>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </li>
  );
}
