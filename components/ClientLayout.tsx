"use client";

import { usePathname } from "next/navigation";
// ✅ استخدام الاستيراد مع الأقواس لأن Header و Footer مصدران كـ export const
import { Header } from "@/components/Layout/Header";
import Footer  from "@/components/Layout/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // ✅ إضافة شرط إخفاء الهيدر للمسارات السرية (الأدمن + صفحة اللوجن العشوائي)
  const isPrivateRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  return (
    <>
      {/* ✅ إخفاء الهيدر والفوتر إذا كان المسار خاصاً */}
      {!isPrivateRoute && <Header />}
      
      <main className="flex-1">{children}</main>
      
      {!isPrivateRoute && <Footer />}
    </>
  );
}