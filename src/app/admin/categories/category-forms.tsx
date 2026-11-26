"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";
import { updateCategory } from "./actions";

export function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);

  // ===== Засах горим =====
  if (editing) {
    return (
      <li>
        <form
          action={async (formData) => {
            await updateCategory(category.id, formData); // серверт хадгална
            setEditing(false);                           // харах горим руу буцна
          }}
        >
          <input name="name" defaultValue={category.name} required />
          <input name="description" defaultValue={category.description ?? ""} />

          <button type="submit">Хадгалах</button>
          <button type="button" onClick={() => setEditing(false)}>
            Болих
          </button>
        </form>
      </li>
    );
  }

  // ===== Харах горим =====
  return (
    <li>
      {category.name}
      <button onClick={() => setEditing(true)}>Засах</button>
    </li>
  );
}