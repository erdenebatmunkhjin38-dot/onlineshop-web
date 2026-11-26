import type { Metadata } from "next"; import { Inter } from "next/font/google"; 
import Link from "next/link";
import { SiteHeader } from "@/components/site-header"; import "./globals.css";
  // Кирилл үсэгтэй фонт. next/font нь фонтыг build үед татаж, өөрийн домэйноос үйлчилнэ. 
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] }); 
  
export const metadata: Metadata = { 
  title: { default: "Онлайн дэлгүүр", template: "%s | Онлайн дэлгүүр" }, 
  description: "Электрон бараа, хувцас, ном болон бусад бүтээгдэхүүний онлайн дэлгүүр", }; 
  
export default function RootLayout({ children }: LayoutProps<"/">) {   return ( 
    <html lang="mn" className={`${inter.variable} h-full antialiased`}> 
      <body className="flex min-h-full flex-col"> 
        <SiteHeader /> 
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main> 
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
          © Онлайн дэлгүүр · Next.js + Spring Boot сургалтын төсөл
          <div className="mt-2">
            <Link href="/about" className="hover:text-brand-600">
              Бидний тухай
            </Link>
          </div>
        </footer>
      </body> 
    </html> 
  ); } 
