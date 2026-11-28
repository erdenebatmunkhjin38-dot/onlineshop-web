import type { Metadata } from "next"; 
import { Card, PageTitle } from "@/components/ui"; import { getMe, getMyCustomer } from "@/lib/data/account"; import { PasswordForm, ProfileForm, ShippingForm } from "./account-forms"; 
  
export const metadata: Metadata = { title: "Миний профайл" }; 
  
export default async function AccountPage() {   const [user, customer] = await Promise.all([getMe(), getMyCustomer()]); 
  
  return ( 
    <> 
      <PageTitle>Миний профайл</PageTitle> 
      <div className="grid gap-6 lg:grid-cols-2">         <Card> 
          <h2 className="mb-4 font-semibold">Хувийн мэдээлэл</h2> 
          <ProfileForm user={user} /> 
        </Card>         <Card> 
          <h2 className="mb-1 font-semibold">Хүргэлтийн мэдээлэл</h2> 
          <p className="mb-4 text-sm text-slate-500">Захиалга хийхэд автоматаар бөглөгдөнө.</p>           <ShippingForm customer={customer} />         </Card> 
        <Card> 
          <h2 className="mb-1 font-semibold">Нууц үг солих</h2> 
          <p className="mb-4 text-sm text-slate-500">Солисны дараа бусад төхөөрөмжөөс автоматаар гарна.</p> 
          <PasswordForm /> 
        </Card> 
      </div> 
    </> 
  ); } 
