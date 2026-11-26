import { PageSkeleton } from "@/components/skeletons"; 
  /** 
*	loading.tsx = хуудсыг автоматаар <Suspense fallback={...}>-д ороосон хэлбэр. 
*	cookie, searchParams уншдаг хуудас серверээс урсаж иртэл энэ харагдана. 
 */ 
export default function Loading() {   return <PageSkeleton />; 
} 
