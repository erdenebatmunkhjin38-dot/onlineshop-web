import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Онлайн дэлгүүр",
  description: "Онлайн дэлгүүрийн сургалтын төсөл",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
