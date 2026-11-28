"use client"; 
  
import { useActionState } from "react"; import { saveProduct } from "@/actions/admin";
import { ImageInput } from "./image-input";
import { SubmitButton } from "@/components/submit-button"; 
import { Alert, ButtonLink, Field, Select, TextArea } from "@/components/ui"; import { initialFormState } from "@/lib/form-state"; import type { Category, Product } from "@/lib/types"; 
  /** Бүтээгдэхүүн нэмэх (product байхгүй), засах (product байгаа) нийтлэг форм. */ export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) 
{ 
  const [state, formAction] = useActionState(saveProduct, initialFormState);   const errors = state.fieldErrors ?? {};   const v = state.values ?? {     name: product?.name ?? "",     description: product?.description ?? "",     price: product ? String(product.price) : "",     stockQuantity: product ? String(product.stockQuantity) : "0",     imageUrl: product?.imageUrl ?? "", 
    categoryId: product ? String(product.category.id) : "",     active: product?.active === false ? "" : "on",   }; 
  
  return ( 
    // Файл илгээх форм. Server Action-д encType тохируулах шаардлагагүй: React өөрөө multipart болгоно. 
    <form action={formAction} className="space-y-4"> 
      {state.message && <Alert>{state.message}</Alert>} 
      {product && <input type="hidden" name="productId" value={product.id} />} 
  
      <Field label="Нэр" name="name" required defaultValue={v.name} error={errors.name} /> 
      <TextArea         label="Тайлбар"         name="description"         required         rows={5}         defaultValue={v.description}         error={errors.description} 
      /> 
      <div className="grid gap-4 sm:grid-cols-3"> 
        <Field label="Үнэ (₮)" name="price" type="number" min={0} step="0.01" required defaultValue={v.price} error={errors.price} /> 
        <Field           label="Нөөц (ширхэг)"           name="stockQuantity"           type="number"           min={0}           required           defaultValue={v.stockQuantity}           error={errors.stockQuantity} 
        /> 
        <Select label="Ангилал" name="categoryId" required defaultValue={v.categoryId} error={errors.categoryId}>           <option value="" disabled>             Сонгох... 
          </option> 
          {categories.map((c) => ( 
            <option key={c.id} value={c.id}> 
              {c.name} 
            </option> 
          ))} 
        </Select> 
      </div> 
  
      <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4"> 
        <legend className="px-1 text-sm font-medium text-slate-700">Зураг</legend> 
        <ImageInput error={errors.image} />
        <Field
          label="Эсвэл зургийн хаяг (URL)"           name="imageUrl"           placeholder="https://..."           defaultValue={v.imageUrl}           error={errors.imageUrl} 
        /> 
      </fieldset> 
  
      <label className="flex items-center gap-2 text-sm"> 
        <input type="checkbox" name="active" defaultChecked={v.active === "on"} className="h-4 w-4 rounded" /> 
        Худалдаанд байгаа (хэрэглэгчдэд харагдана) 
      </label> 
  
      <div className="flex gap-2"> 
        <SubmitButton pendingText="Хадгалж байна...">{product ? "Хадгалах" : "Нэмэх"}</SubmitButton>         <ButtonLink href="/admin/products" variant="secondary">           Болих 
        </ButtonLink> 
      </div> 
    </form> 
  ); } 
