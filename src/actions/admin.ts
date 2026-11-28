"use server"; 
  
import { refresh, updateTag } from "next/cache"; import { redirect } from "next/navigation"; import { api } from "@/lib/api"; 
import { CATALOG_TAGS } from "@/lib/data/catalog"; import { requireAdmin } from "@/lib/data/dal";
import { formValues, toFormState, zodErrors, type FormState } from "@/lib/form"; import { categorySchema, customerSchema, productSchema } from "@/lib/schemas"; 
import { ORDER_STATUSES, type Customer, type OrderStatus, type Product, type Role } from 
"@/lib/types"; 

  /** 
*	Админы Server Action-ууд. Функц бүр эхлээд requireAdmin() дуудна: 
*	Server Action бол нээлттэй POST endpoint тул UI-д товч нуусан нь хамгаалалт биш. 
*	(Backend мөн ADMIN эрхийг шалгадаг: давхар хамгаалалт.)  */ 
  
// ---------- Бүтээгдэхүүн ---------- 
  
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; 
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]; 
  
/** Формын файл талбарыг шалгана. Файл сонгоогүй бол null. */ function imageFile(formData: FormData): File | null | string {   const file = formData.get("image"); 
  if (!(file instanceof File) || file.size === 0) return null; 
  if (!IMAGE_TYPES.includes(file.type)) return "Зөвхөн JPEG, PNG, WEBP зураг байршуулна";   if (file.size > MAX_IMAGE_BYTES) return "Зургийн хэмжээ 5MB-аас ихгүй байна";   return file; 
} 
  
async function uploadImage(productId: number, file: File) {
  const body = new FormData();
  body.append("file", file); // backend-ийн @RequestPart("file")
  await api(`/products/${productId}/image`, { method: "POST", body });
}

/** Бараа нэмэх, засах хоёуланд ажиллана: productId байвал засна. */ 
export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const values = formValues(formData); 
  const parsed = productSchema.safeParse(values);   const file = imageFile(formData); 
  
  if (!parsed.success || typeof file === "string") { 
    const fieldErrors = parsed.success ? {} : zodErrors(parsed.error);     if (typeof file === "string") fieldErrors.image = file;     return { ok: false, fieldErrors, values };   } 
  
  const id = values.productId ? Number(values.productId) : undefined;   let product: Product;   try { 
    product = id 
      ? await api<Product>(`/products/${id}`, { method: "PUT", body: parsed.data })       : await api<Product>("/products", { method: "POST", body: parsed.data });     if (file) await uploadImage(product.id, file); 
  } catch (error) {     return toFormState(error, values);   } 
  
  // Дэлгүүрийн хуудсууд шинэ мэдээллийг шууд харуулна
  updateTag(CATALOG_TAGS.products);
  redirect(`/admin/products?saved=${product.id}`);
}

/** Soft delete: active=false. Захиалгын түүхэнд бараа хэвээр үлдэнэ. */ export async function deactivateProduct(formData: FormData) {   await requireAdmin();   await api(`/products/${Number(formData.get("productId"))}`, { method: "DELETE" });   updateTag(CATALOG_TAGS.products);   refresh(); // админы жагсаалт кэшгүй тул хуудсыг дахин зурна 
} 
  
/** Худалдаанд буцааж оруулна: PUT нь бүх талбарыг шаарддаг тул эхлээд одоогийн утгыг уншина. */ export async function activateProduct(formData: FormData) {   await requireAdmin();   const id = Number(formData.get("productId"));   const p = await api<Product>(`/products/${id}`); 

  await api(`/products/${id}`, {     method: "PUT",     body: {       name: p.name, 
      description: p.description,       price: p.price,       stockQuantity: p.stockQuantity,       imageUrl: p.imageUrl ?? undefined,       categoryId: p.category.id,       active: true, 
    },   }); 
  updateTag(CATALOG_TAGS.products); 
  refresh(); // админы жагсаалт кэшгүй тул хуудсыг дахин зурна 
} 
  
export async function removeProductImage(formData: FormData) {   await requireAdmin(); 
  await api(`/products/${Number(formData.get("productId"))}/image`, { method: "DELETE" });   updateTag(CATALOG_TAGS.products); 
  refresh(); // админы жагсаалт кэшгүй тул хуудсыг дахин зурна 
} 
  
// ---------- Ангилал ---------- 
  
export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const values = formValues(formData); 
  const parsed = categorySchema.safeParse(values); 
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed.error), values }; 
  
  const id = values.categoryId ? Number(values.categoryId) : undefined;   try {     await api(id ? `/categories/${id}` : "/categories", { method: id ? "PUT" : "POST", body: 
parsed.data });   } catch (error) { 
    return toFormState(error, values); 
  } 
  updateTag(CATALOG_TAGS.categories);
  updateTag(CATALOG_TAGS.products); // бараан дээр ангиллын нэр харагддаг
  return { ok: true, message: id ? "Ангилал засагдлаа" : "Ангилал нэмэгдлээ" };
} 
  
export async function deleteCategory(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin();   try { 
    await api(`/categories/${Number(formData.get("categoryId"))}`, { method: "DELETE" });   } catch (error) { 
    // Бараатай ангиллыг backend 409-өөр татгалзана: мессежийг харуулна
    return toFormState(error);
  } 
  updateTag(CATALOG_TAGS.categories);   return { ok: true, message: "Ангилал устгагдлаа" }; 
} 
  
// ---------- Захиалга ---------- 
  
export async function updateOrderStatus(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const id = Number(formData.get("orderId"));   const status = formData.get("status") as OrderStatus; 
  if (!ORDER_STATUSES.includes(status)) return { ok: false, message: "Төлөв буруу байна" }; 
    try {     await api(`/orders/${id}/status`, { method: "PUT", body: { status } }); 
  } catch (error) {     return toFormState(error); 
  } 
  // Цуцалбал бараа нөөцөд буцна 
  if (status === "CANCELLED") updateTag(CATALOG_TAGS.products); 

  refresh(); 
  return { ok: true, message: "Төлөв шинэчлэгдлээ" }; 
} 
  
// ---------- Хэрэглэгч ---------- 
  
export async function updateUserRoles(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const id = Number(formData.get("userId")); 
  const roles = formData.getAll("roles").filter((r): r is Role => r === "ROLE_USER" || r === 
"ROLE_ADMIN");   if (roles.length === 0) return { ok: false, message: "Дор хаяж нэг эрх сонгоно уу" }; 
    try { 
    await api(`/users/${id}/roles`, { method: "PUT", body: { roles } }); 
  } catch (error) { 
    return toFormState(error); 
  }   refresh(); 
  return { ok: true, message: "Эрх шинэчлэгдлээ" }; 
} 
  
export async function updateUserStatus(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const id = Number(formData.get("userId"));   const enabled = formData.get("enabled") === "true";   try { 
    await api(`/users/${id}/status`, { method: "PUT", body: { enabled } }); 
  } catch (error) { 
    return toFormState(error); 
  }   refresh(); 
  return { ok: true, message: enabled ? "Хэрэглэгч идэвхжлээ" : "Хэрэглэгч түдгэлзлээ" }; 
} 
  
export async function deleteUser(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin();   try { 
    await api(`/users/${Number(formData.get("userId"))}`, { method: "DELETE" }); 
  } catch (error) { 
    return toFormState(error); 
  } 
  redirect("/admin/users"); 
} 
  
// ---------- Харилцагч ---------- 
  
export async function saveCustomer(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin(); 
  const values = formValues(formData); 
  const parsed = customerSchema.safeParse(values);   if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed.error), values }; 
  
  const id = values.customerId ? Number(values.customerId) : undefined;   let customer: Customer;   try {     customer = await api<Customer>(id ? `/customers/${id}` : "/customers", {       method: id ? "PUT" : "POST",       body: parsed.data, 
    }); 
  } catch (error) { 
    return toFormState(error, values); 
  }   redirect(`/admin/customers/${customer.id}`); 
} 
  
export async function deleteCustomer(_prev: FormState, formData: FormData): Promise<FormState> {   await requireAdmin();   try { 
    await api(`/customers/${Number(formData.get("customerId"))}`, { method: "DELETE" }); 
  } catch (error) { 
    return toFormState(error); 
  } 
  redirect("/admin/customers"); 
} 
 
