"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // =========================
  // التحقق من تسجيل الدخول
  // =========================
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // =========================
  // تسجيل الخروج
  // =========================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#b58610] flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>

          <div className="w-7 h-7 rounded-full border-2 border-gray-200 border-t-[#b58610] animate-spin" />

          <p className="text-sm text-gray-500">
            {t("dashboard.loading")}
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // روابط Sidebar
  // =========================
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: t("dashboard.title"),
      href: "/admin/dashboard",
    },
    {
      icon: ImageIcon,
      label: t("artworks.title"),
      href: "/admin/artworks", // <--- تم تغيير الرابط هنا ليصبح مستقلاً
    },
    {
      icon: Settings,
      label: t("dashboard.settings"),
      href: "/admin/settings",
    },
  ];

  const isArabic = language === "ar";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-white"
    >
      {/* =====================================
          Mobile Header
      ===================================== */}
      <header className="md:hidden fixed top-0 inset-x-0 z-[60] h-20 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="h-full px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#b58610] flex items-center justify-center shadow-sm">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                {t("admin.brand")} {/* ترجمة: Nana Admin */}
              </p>

              <p className="text-[11px] text-gray-400">
                {t("dashboard.title")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#b58610] transition-all"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* =====================================
          Mobile Overlay
      ===================================== */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 top-20 z-40 bg-black/30 backdrop-blur-[2px]"
        />
      )}

      {/* =====================================
          Sidebar
      ===================================== */}
      <aside
        className={`
          fixed
          top-0
          bottom-0
          z-50
          w-[260px]
          bg-white
          border-gray-200
          shadow-xl
          flex
          flex-col
          transition-transform
          duration-300
          ease-in-out

          ${isArabic ? "right-0 border-l" : "left-0 border-r"}

          ${
            isSidebarOpen
              ? "translate-x-0"
              : isArabic
              ? "translate-x-full"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* =====================================
            Sidebar Brand
        ===================================== */}
        <div className="px-6 pt-7 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#b58610] flex items-center justify-center shadow-md shadow-[#b58610]/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                {t("admin.brand")}
              </h1>

              <p className="text-xs text-gray-400 mt-0.5">
                {t("admin.subtitle")} {/* ترجمة: Art Gallery Management */}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            Navigation
        ===================================== */}
        <div className="px-4 pt-6">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            {t("admin.main_menu")} {/* ترجمة: MAIN MENU */}
          </p>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/admin/dashboard" &&
                  pathname === "/admin/dashboard");

              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-[#b58610]/10 text-[#9f760d]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className={`
                        absolute top-1/2 -translate-y-1/2
                        w-1 h-6 rounded-full bg-[#b58610]
                        ${isArabic ? "right-0" : "left-0"}
                      `}
                    />
                  )}

                  <span
                    className={`
                      w-9 h-9 rounded-lg flex items-center justify-center
                      transition-all duration-200

                      ${
                        isActive
                          ? "bg-[#b58610] text-white shadow-sm"
                          : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-[#b58610]"
                      }
                    `}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </span>

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight
                      className={`
                        w-4 h-4 text-[#b58610]
                        ${isArabic ? "rotate-180" : ""}
                      `}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* =====================================
            Bottom Section
        ===================================== */}
        <div className="mt-auto p-4">
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="
                group
                flex
                items-center
                gap-3
                w-full
                px-3
                py-3
                rounded-xl
                text-sm
                font-medium
                text-red-500
                hover:bg-red-50
                hover:text-red-600
                transition-all
                duration-200
              "
            >
              <span className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut
                  className={`
                    w-[18px] h-[18px]
                    ${isArabic ? "rotate-180" : ""}
                  `}
                />
              </span>

              <span>{t("dashboard.sign_out")}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================
          Main Content
      ===================================== */}
      <main
        className={`
          top-0
          ${isArabic ? "md:mr-[260px]" : "md:ml-[260px]"}
        `}
      >
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;