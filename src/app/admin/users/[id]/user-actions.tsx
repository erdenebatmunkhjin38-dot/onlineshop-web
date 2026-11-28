"use client"; 
  
import { useActionState } from "react"; 
import { deleteUser, updateUserRoles, updateUserStatus } from "@/actions/admin"; import { SubmitButton } from "@/components/submit-button"; import { Alert, Card } from "@/components/ui"; import { initialFormState } from "@/lib/form-state"; import type { User } from "@/lib/types"; 
  /** 
*	Хэрэглэгчийн эрх, төлөв, устгах үйлдлүүд. 
*	Өөрийгөө админаас хасах, түдгэлзүүлэх, устгахыг backend хориглоно: мессеж нь энд харагдана. 
 */ 
export function UserActions({ user }: { user: User }) { 
  const [rolesState, rolesAction] = useActionState(updateUserRoles, initialFormState);   const [statusState, statusAction] = useActionState(updateUserStatus, initialFormState);   const [deleteState, deleteAction] = useActionState(deleteUser, initialFormState); 
  
  return ( 
    <div className="space-y-6"> 
      <Card> 
        <h2 className="mb-4 font-semibold">Эрх</h2> 
        <form action={rolesAction} className="space-y-3"> 
          {rolesState.message && <Alert ok={rolesState.ok}>{rolesState.message}</Alert>} 
          <input type="hidden" name="userId" value={user.id} /> 
          <label className="flex items-center gap-2 text-sm"> 
            <input type="checkbox" name="roles" value="ROLE_USER" defaultChecked={user.roles.includes("ROLE_USER")} className="h-4 w-4" /> 
            Хэрэглэгч (ROLE_USER): захиалга хийх 
          </label> 
          <label className="flex items-center gap-2 text-sm"> 
            <input type="checkbox" name="roles" value="ROLE_ADMIN" defaultChecked={user.roles.includes("ROLE_ADMIN")} className="h-4 w-4" />             Админ (ROLE_ADMIN): дэлгүүр удирдах 
          </label> 
          <SubmitButton>Эрх хадгалах</SubmitButton> 
        </form> 
      </Card> 
  
      <Card> 
        <h2 className="mb-1 font-semibold">Төлөв</h2> 
        <p className="mb-4 text-sm text-slate-500"> 
          Түдгэлзүүлсэн хэрэглэгч нэвтэрч чадахгүй, одоогийн session-ууд нь хүчингүй болно. 
        </p> 
        <form action={statusAction} className="space-y-3"> 
          {statusState.message && <Alert ok={statusState.ok}>{statusState.message}</Alert>} 
          <input type="hidden" name="userId" value={user.id} /> 
          <input type="hidden" name="enabled" value={String(!user.enabled)} /> 
          <SubmitButton variant={user.enabled ? "secondary" : "primary"}> 
            {user.enabled ? "Түдгэлзүүлэх" : "Идэвхжүүлэх"} 
          </SubmitButton> 
        </form> 
      </Card> 
  
      <Card className="border-red-200"> 
        <h2 className="mb-1 font-semibold text-red-700">Устгах</h2> 
        <p className="mb-4 text-sm text-slate-500">Бүртгэлийг бүрмөсөн устгана. Буцаах боломжгүй.</p>         <form           action={deleteAction}           onSubmit={(e) => { 
            if (!confirm(`"${user.username}" хэрэглэгчийг устгах уу?`)) e.preventDefault(); 
          }} 
          className="space-y-3" 
        > 
          {deleteState.message && <Alert>{deleteState.message}</Alert>} 
          <input type="hidden" name="userId" value={user.id} /> 
          <SubmitButton variant="danger" pendingText="Устгаж байна..."> 
            Хэрэглэгч устгах 
          </SubmitButton> 
        </form> 
      </Card> 
    </div> 
  ); } 
