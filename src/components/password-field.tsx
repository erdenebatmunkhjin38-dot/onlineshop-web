"use client";

import { useId, useState, type ComponentProps } from "react";
import { inputClass } from "@/components/ui";
import { cn } from "@/lib/format";

/**
 * Нууц үгийн талбар + "Нууц үгээ харах" товч.
 * Харагдаж байгаа эсэхийг state-д хадгалж, input-ийн type-ийг password ↔ text болгон солино.
 */
export function PasswordField({
  label,
  error,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type" | "id"> & { label: string; error?: string }) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div className={className}>
      {/* Field шиг <label>-аар бүхэлд нь ороохгүй: товч label дотор орох ёсгүй тул htmlFor ашиглана */}
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          className={cn(inputClass, "pr-10")}
        />
        {/* type="button": эс бөгөөс товч формыг илгээчихнэ */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-controls={id}
          // Товчинд бичвэр байхгүй тул дэлгэц уншигч болон tooltip-д нэр өгнө
          aria-label={visible ? "Нууц үгээ нуух" : "Нууц үгээ харах"}
          title={visible ? "Нууц үгээ нуух" : "Нууц үгээ харах"}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-slate-500 hover:text-brand-600"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
            {/* Нууц үг харагдаж байхад нүдийг зураасаар хөндлөн огтолно */}
            {visible && <path d="M3 3l18 18" />}
          </svg>
        </button>
      </div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  );
}
