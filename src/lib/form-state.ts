/** 
*	Server Action-ийн хариу. useActionState-ээр Client Component-д буцна.  * Client Component импортлох тул энэ файлд серверийн код байж болохгүй. 
 * 
*	`values`: React 19 нь action дууссаны дараа формыг цэвэрлэдэг. 
*	Алдаа гарвал оруулсан утгыг буцааж defaultValue болгон харуулна. 
 */ 
export type FormState = {   ok?: boolean;   message?: string;   fieldErrors?: Record<string, string>;   values?: Record<string, string>; }; 
  
export const initialFormState: FormState = {}; 
