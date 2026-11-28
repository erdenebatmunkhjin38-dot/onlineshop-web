import "server-only"; import { z } from "zod"; 
import { optionalText, phoneSchema } from "@/lib/form"; 
  /** 
*	Хэд хэдэн Server Action-д давтагддаг Zod схемүүд. 
*	Backend-ийн DTO-ийн шалгалттай (@NotBlank, @Size г.м.) ижил дүрэмтэй. 
 * 
*	Анхаар: "use server" файлаас зөвхөн async функц export хийж болдог тул схемүүд энд байна.  */ 
  
/** Хоосон бол undefined, бусад үед имэйл шалгана */ const optionalEmail = z 
  .string()   .trim() 
  .refine((v) => v === "" || z.email().safeParse(v).success, "Имэйл хаяг буруу байна")   .transform((v) => (v === "" ? undefined : v)); 
  
/** CustomerRequest: хэрэглэгчийн хүргэлтийн профайл, админы харилцагч */ export const customerSchema = z.object({ 
  fullName: z.string().trim().min(1, "Овог нэр оруулна уу").max(100, "Овог нэр 100 тэмдэгтээс хэтрэхгүй"),
  email: optionalEmail,   phone: phoneSchema,   address: optionalText,   city: optionalText, }); 
  
/** CategoryRequest */ 
export const categorySchema = z.object({ 
  name: z.string().trim().min(1, "Ангиллын нэр оруулна уу").max(50, "Ангиллын нэр 50 тэмдэгтээс хэтрэхгүй"), 
  description: z.string().trim().max(255, "Тайлбар 255 тэмдэгтээс хэтрэхгүй").optional(), }); 
  
/** ProductRequest */ 
export const productSchema = z.object({ 
  name: z.string().trim().min(2, "Бүтээгдэхүүний нэр 2-оос 100 тэмдэгт байна").max(100, 
"Бүтээгдэхүүний нэр 2-оос 100 тэмдэгт байна"),   description: z.string().trim().min(10, "Тайлбар 10-аас 1000 тэмдэгт байна").max(1000, "Тайлбар 10-аас 1000 тэмдэгт байна"), 
  price: z.coerce 
    .number({ error: "Үнэ оруулна уу" }) 
    .positive("Үнэ 0-ээс их байна") 
    .max(99_999_999.99, "Үнэ хэт их байна"),   stockQuantity: z.coerce 
    .number({ error: "Нөөцийн тоо оруулна уу" }) 
    .int("Бүхэл тоо оруулна уу") 
    .min(0, "Нөөцийн тоо сөрөг байж болохгүй"),   imageUrl: z     .string() 
    .trim() 
    .refine(       (v) =>         v === "" || 
        (v.startsWith("/uploads/") && !v.includes("..")) || 
        z.url({ protocol: /^https?$/ }).safeParse(v).success,       "Зургийн хаяг буруу байна", 
    ) 
    .transform((v) => (v === "" ? undefined : v)), 
  categoryId: z.coerce.number({ error: "Ангилал сонгоно уу" }).int().positive("Ангилал сонгоно уу"),   active: z.literal("on").optional().transform((v) => v === "on"), }); 
