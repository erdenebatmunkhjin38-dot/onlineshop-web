import { TableSkeleton } from "@/components/skeletons"; import { Skeleton } from "@/components/ui"; 
  
export default function AdminLoading() {   return ( 
    <div className="space-y-6"> 
      <Skeleton className="h-8 w-48" /> 
      <TableSkeleton /> 
    </div> 
  ); } 
