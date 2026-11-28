import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/order-detail";
import { PageTitle } from "@/components/ui";
import { getOrder } from "@/lib/data/account";
import { requireAdmin } from "@/lib/data/dal";
import { StatusForm } from "./status-form";

export const metadata: Metadata = { title: "Захиалга" };

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  // GET /orders/{id}: ADMIN бүх захиалгыг харна
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <>
      <Link href="/admin/orders" className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900">
        ← Бүх захиалга
      </Link>
      <PageTitle
        actions={
          <Link href={`/admin/customers/${order.customerId}`} className="text-sm text-brand-600 hover:underline">
            Харилцагчийн мэдээлэл →
          </Link>
        }
      >
        Захиалга {order.orderNumber}
      </PageTitle>
      <OrderDetail order={order} actions={<StatusForm orderId={order.id} status={order.status} />} />
    </>
  );
}
