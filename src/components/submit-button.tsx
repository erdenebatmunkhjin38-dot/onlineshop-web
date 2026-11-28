"use client"; 
  
import { useFormStatus } from "react-dom"; import { Button } from "@/components/ui"; import type { ComponentProps } from "react"; 
  /** 
*	Форм илгээгдэж байх үед өөрөө идэвхгүй болж "Түр хүлээнэ үү..." гэж харуулна. 
*	useFormStatus нь хамгийн ойрын эцэг <form>-ийн төлөвийг уншина: <form> ДОТОР байрлуулна. 
 */ 
export function SubmitButton({   children, 
  pendingText = "Түр хүлээнэ үү...", 
  ...props 
}: ComponentProps<typeof Button> & { pendingText?: string }) {   const { pending } = useFormStatus();   return ( 
    <Button type="submit" disabled={pending || props.disabled} aria-busy={pending} {...props}>       {pending ? pendingText : children} 
    </Button> 
  ); } 
