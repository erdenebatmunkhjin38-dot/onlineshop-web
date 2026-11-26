import { Badge } from "@/components/ui"; import { ORDER_STATUS_LABEL } from "@/lib/format"; import type { OrderStatus } from "@/lib/types"; 
  
const TONE = {   PENDING: "amber", 
  PAID: "blue", 
  SHIPPED: "blue", 
  DELIVERED: "green", 
  CANCELLED: "red", 
} as const satisfies Record<OrderStatus, string>; 
  
export function OrderStatusBadge({ status }: { status: OrderStatus }) {   return <Badge tone={TONE[status]}>{ORDER_STATUS_LABEL[status]}</Badge>; 
} 
