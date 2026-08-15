"use client";

import { Phone, Mail, ArrowUpRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ContactPage() {
  const { language, t } = useLanguage();

  return (
    <main
      className="min-h-screen bg-[#F7F3EC] px-6 py-20 md:py-28"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <section className="mx-auto max-w-5xl">
        {/* =========================
            Header
        ========================== */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em] text-[#b58610]">
            {t("contactPage.badge")}
          </p>

          <h1 className="text-3xl font-light tracking-tight text-[#4F3523] md:text-4xl">
            {t("contactPage.title")}
          </h1>

          <div className="mx-auto mt-5 h-px w-10 bg-[#b58610]" />

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#4F3523]/80">
            {t("contactPage.description")}
          </p>
        </div>

        {/* =========================
            Contact Cards
        ========================== */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* =========================
              Phone
          ========================== */}
          <a
            href="tel:0595755552"
            className="
              group relative
              rounded-2xl
              border border-[#E5D9CA]
              bg-[#F7F3EC]
              p-7
              transition-all duration-500
              hover:-translate-y-1
              hover:border-[#b58610]
              hover:shadow-[0_20px_50px_rgba(79,53,35,0.08)]
            "
          >
            <div className="flex items-center justify-between">
              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full
                  border border-[#E5D9CA]
                  text-[#4F3523]
                  transition-all duration-500
                  group-hover:border-[#b58610]
                  group-hover:bg-[#b58610]
                  group-hover:text-white
                "
              >
                <Phone size={18} strokeWidth={1.4} />
              </div>

              <ArrowUpRight
                size={18}
                strokeWidth={1.3}
                className="
                  text-[#4F3523]/50
                  transition-all duration-500
                  group-hover:-translate-y-1
                  group-hover:translate-x-1
                  group-hover:text-[#b58610]
                "
              />
            </div>

            <div className="mt-12">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#b58610]">
                {t("contactPage.phone")}
              </p>

              <h2 className="mt-3 text-base font-medium text-[#4F3523]" dir="ltr">
                0595755552
              </h2>

              <p className="mt-2 text-xs text-[#4F3523]/70">
                {t("contactPage.phoneDescription")}
              </p>
            </div>
          </a>

          {/* =========================
              Instagram
          ========================== */}
          <a
            href="https://www.instagram.com/nana.artistt"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group relative
              rounded-2xl
              border border-[#E5D9CA]
              bg-[#F7F3EC]
              p-7
              transition-all duration-500
              hover:-translate-y-1
              hover:border-[#b58610]
              hover:shadow-[0_20px_50px_rgba(79,53,35,0.08)]
            "
          >
            <div className="flex items-center justify-between">
              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full
                  border border-[#E5D9CA]
                  text-[#4F3523]
                  transition-all duration-500
                  group-hover:border-[#b58610]
                  group-hover:bg-[#b58610]
                  group-hover:text-white
                "
              >
                <FaInstagram size={18} />
              </div>

              <ArrowUpRight
                size={18}
                strokeWidth={1.3}
                className="
                  text-[#4F3523]/50
                  transition-all duration-500
                  group-hover:-translate-y-1
                  group-hover:translate-x-1
                  group-hover:text-[#b58610]
                "
              />
            </div>

            <div className="mt-12">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#b58610]">
                {t("contactPage.instagram")}
              </p>

              <h2 className="mt-3 text-base font-medium text-[#4F3523]" dir="ltr">
                @nana.artistt
              </h2>

              <p className="mt-2 text-xs text-[#4F3523]/70">
                {t("contactPage.instagramDescription")}
              </p>
            </div>
          </a>

          {/* =========================
              Email
          ========================== */}
          <a
            href="mailto:nana.artistt@gmail.com"
            className="
              group relative
              rounded-2xl
              border border-[#E5D9CA]
              bg-[#F7F3EC]
              p-7
              transition-all duration-500
              hover:-translate-y-1
              hover:border-[#b58610]
              hover:shadow-[0_20px_50px_rgba(79,53,35,0.08)]
            "
          >
            <div className="flex items-center justify-between">
              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full
                  border border-[#E5D9CA]
                  text-[#4F3523]
                  transition-all duration-500
                  group-hover:border-[#b58610]
                  group-hover:bg-[#b58610]
                  group-hover:text-white
                "
              >
                <Mail size={18} strokeWidth={1.4} />
              </div>

              <ArrowUpRight
                size={18}
                strokeWidth={1.3}
                className="
                  text-[#4F3523]/50
                  transition-all duration-500
                  group-hover:-translate-y-1
                  group-hover:translate-x-1
                  group-hover:text-[#b58610]
                "
              />
            </div>

            <div className="mt-12">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#b58610]">
                {t("contactPage.email")}
              </p>

              <h2
                className="mt-3 break-all text-base font-medium text-[#4F3523]"
                dir="ltr"
              >
                nana.artistt@gmail.com
              </h2>

              <p className="mt-2 text-xs text-[#4F3523]/70">
                {t("contactPage.emailDescription")}
              </p>
            </div>
          </a>
        </div>

        {/* =========================
            Back Home
        ========================== */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="
              inline-flex items-center gap-2
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-[#4F3523]/60
              transition-colors duration-300
              hover:text-[#b58610]
            "
          >
            ← {t("contactPage.backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}