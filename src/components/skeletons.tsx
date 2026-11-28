import { Skeleton } from "@/components/ui"; 
  
/** loading.tsx болон <Suspense fallback>-д ашиглах ачааллын дүрсүүд */ 
  
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {   return ( 
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"> 
      {Array.from({ length: count }, (_, i) => ( 
        <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white"> 
          <Skeleton className="aspect-square rounded-none" /> 
          <div className="space-y-2 p-4"> 
            <Skeleton className="h-3 w-1/3" /> 
            <Skeleton className="h-4 w-3/4" /> 
            <Skeleton className="h-5 w-1/2" /> 
          </div> 
        </div> 
      ))} 
    </div> 
  ); 
} 
  
export function PageSkeleton() {   return ( 
    <div className="space-y-4"> 
      <Skeleton className="h-8 w-48" /> 
      <Skeleton className="h-40 w-full" /> 
      <Skeleton className="h-40 w-full" /> 
    </div> 
  ); 
} 
  
export function TableSkeleton({ rows = 6 }: { rows?: number }) {   return ( 
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
    {Array.from({ length: rows }, (_, i) => ( 
        <Skeleton key={i} className="h-10 w-full" /> 
      ))} 
    </div> 
  ); } 
