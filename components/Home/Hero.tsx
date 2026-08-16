"use client"; // ✅ إضافة use client ليعمل مع useLanguage
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

const HeroSection = () => {
  const { language, t } = useLanguage(); // ✅ جلب الترجمة واللغة

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* صورة الخلفية */}
      <Image
        src="/hero-img.png"
        alt="Handcrafted textured artwork by Nana Hashem displayed on a wall"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* طبقة شفافة بنية */}
      <div className="absolute inset-0 bg-[#3a2a1c]/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a1d12]/70 via-transparent to-[#2a1d12]/20" />

      {/* المحتوى */}
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-amber-100/80">
          {t("hero.artistName")}
        </p>
        
        {/* ✅ تم استبدال font-serif بـ font-["Cormorant_Garamond"] ليظهر كما في الـ Header */}
        <h1 className='font-["Cormorant_Garamond"] text-4xl font-light leading-tight text-balance text-white sm:text-5xl md:text-6xl'>
          {t("hero.title")}
        </h1>
        
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-amber-50/85 text-pretty sm:text-lg">
          {t("hero.subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="w-full rounded-full bg-amber-50 px-8 py-3 font-sans text-sm font-medium tracking-wide text-[#3a2a1c] transition-colors hover:bg-white sm:w-auto"
          >
            {t("hero.shopBtn")}
          </Link>
          <Link
            href="/contact"
            className="w-full rounded-full border border-amber-50/60 px-8 py-3 font-sans text-sm font-medium tracking-wide text-amber-50 transition-colors hover:bg-amber-50/10 sm:w-auto"
          >
            {t("hero.contactBtn")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;