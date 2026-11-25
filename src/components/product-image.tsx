import Image from "next/image"; import { cn } from "@/lib/format"; 
  /** 
*	Бүтээгдэхүүний зураг. 
*	- `/uploads/...`: backend-д байршуулсан зураг. next.config.ts-ийн rewrites-аар дамжиж,  *   next/image оновчлол (хэмжээ багасгах, webp) хийгдэнэ. 
*	- `https://...`: гадаад хаяг. Оновчлолгүй (unoptimized) шууд харуулна. 
*	- null: орлуулах дүрс. 
 * 
*	Дэлгэцийн дээд хэсэгт (above the fold) харагдах том зураг бол LCP (Largest Contentful Paint) болно: 
*	`priority`-г өгвөл зургийг урьдчилан ачаална (preload), `eager` бол lazy loading-гүй шууд ачаална. 
 */ 
export function ProductImage({   src,   alt, 
  sizes = "(max-width: 768px) 50vw, 25vw",   priority,   eager,   className, 
}: { 
  src: string | null;   alt: string;   sizes?: string;   priority?: boolean; 
  /** Жагсаалтын эхний зургууд: lazy биш шууд ачаална */   eager?: boolean;   className?: string; 
}) {   return ( 
    <div className={cn("relative overflow-hidden bg-slate-100", className)}> 
      {src ? (         <Image           src={src}           alt={alt}           fill           sizes={sizes}           preload={priority}           loading={priority || eager ? "eager" : undefined}           unoptimized={!src.startsWith("/uploads/")}           className="object-cover" 
        /> 
      ) : ( 
        <div className="flex h-full w-full items-center justify-center text-slate-400"> 
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5"> 
            <rect x="3" y="4" width="18" height="16" rx="2" /> 
            <circle cx="9" cy="10" r="2" /> 
            <path d="m21 16-5-5-9 9" /> 
          </svg> 
        </div> 
      )} 
    </div> 
  ); } 
