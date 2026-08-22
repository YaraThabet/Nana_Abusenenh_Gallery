import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ استيراد مكون العميل الخاص بك بدلاً من استيراد Header و Footer هنا
import ClientLayout from "@/components/ClientLayout"; 

import { CartProvider } from "@/app/context/CartContext";
import { LanguageProvider } from "@/app/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nana Hashim Art Gallery",
  description: "Original paintings by Nana Hashim Abusenenh",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <CartProvider>
            {/* ✅ استدعاء المكون المسؤول عن إخفاء الهيدر */}
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}