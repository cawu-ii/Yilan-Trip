import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/layout/ClientProviders";
import { PhoneCard } from "@/components/layout/PhoneCard";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "宜蘭羅東小旅行",
  description: "文文・亞軒・莊家・CA的宜蘭羅東小旅行：行程、記帳、美食",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className="h-full">
      <body className="h-full antialiased">
        <ClientProviders>
          <PhoneCard>
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
            <BottomNav />
          </PhoneCard>
        </ClientProviders>
      </body>
    </html>
  );
}
