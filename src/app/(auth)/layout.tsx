import type { ReactNode } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";

/** Нэвтрэх, бүртгүүлэх хуудасны нийтлэг хүрээ: голлосон карт. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-8">
  <Link href="/" className="mb-6 text-2xl font-bold text-brand-600">
    Онлайн дэлгүүр
  </Link>
  <Card className="w-full max-w-md p-8">{children}</Card>

    </div>
  );
}
