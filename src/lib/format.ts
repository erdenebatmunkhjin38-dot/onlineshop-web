import type { OrderStatus } from "@/lib/types"; 
  
const priceFormat = new Intl.NumberFormat("mn-MN", { maximumFractionDigits: 0 }); 
  
/** 3299000 → "3,299,000₮" */ 
export function formatPrice(value: number) {   return `${priceFormat.format(value)}₮`; 
} 
  
/** ISO огноо → "2026.11.17 14:05" */ export function formatDate(iso: string) {   const d = new Date(iso); 
  const pad = (n: number) => String(n).padStart(2, "0"); 
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} 
${pad(d.getHours())}:${pad(d.getMinutes())}`; 
} 
  
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = { 
  PENDING: "Хүлээгдэж буй", 
  PAID: "Төлөгдсөн", 
  SHIPPED: "Хүргэлтэд гарсан", 
  DELIVERED: "Хүргэгдсэн", 
  CANCELLED: "Цуцлагдсан", 
}; 
  /** Backend-ийн OrderStatus.canTransitionTo()-той ижил дүрэм. */ export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {   PENDING: ["PAID", "CANCELLED"], 
  PAID: ["SHIPPED", "CANCELLED"], 
  SHIPPED: ["DELIVERED"], 
  DELIVERED: [], 
  CANCELLED: [], 
}; 
  /** Tailwind-ийн нөхцөлт class-уудыг нэгтгэнэ: cn("a", false && "b", "c") → "a c" */ export function cn(...classes: (string | false | null | undefined)[]) {   return classes.filter(Boolean).join(" "); 
} 
