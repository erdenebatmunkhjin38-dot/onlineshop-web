"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Field } from "@/components/ui";

/** Зургийн файл сонгох талбар. Сонгосон зургийг серверт илгээхээс ӨМНӨ browser дээр харуулна. */
export function ImageInput({ error }: { error?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // React 19 нь action дууссаны дараа формыг reset хийж, файлын сонголтыг цэвэрлэдэг: preview-г ч арилгана.
  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const clear = () => setFile(null);
    form?.addEventListener("reset", clear);
    return () => form?.removeEventListener("reset", clear);
  }, []);

  // createObjectURL нь файлд заасан түр хаяг (blob:...) үүсгэнэ. Санах ой чөлөөлөхийн тулд
  // зураг солигдох, дэлгэцээс алга болоход revokeObjectURL дуудна (ref-ийн cleanup).
  const previewRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img || !file) return;
      const url = URL.createObjectURL(file);
      img.src = url;
      return () => URL.revokeObjectURL(url);
    },
    [file],
  );

  return (
    <div ref={containerRef} className="space-y-2">
      <Field
        label="Файл байршуулах"
        name="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hint="JPEG, PNG, WEBP · 5MB хүртэл. Сонговол доорх хаягийг орлоно."
        error={error}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      {file && (
        <figure>
          {/* blob: хаягийг next/image оновчтой болгож чадахгүй тул энгийн <img> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={previewRef}
            alt="Сонгосон зургийн урьдчилсан харагдац"
            className="h-40 w-40 rounded-md border border-slate-200 object-cover"
          />
          <figcaption className="mt-1 text-xs text-slate-500">
            {file.name} · {(file.size / 1024 / 1024).toFixed(2)}MB
          </figcaption>
        </figure>
      )}
    </div>
  );
}
