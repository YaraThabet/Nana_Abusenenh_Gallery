"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext"; // ✅ استيراد useLanguage وليس LanguageProvider
import Link from "next/link";
import Image from "next/image";

const artworks = [
  {
    id: 1,
    title: "Bloom of Thought",
    title_ar: "إزهار الفكر",
    medium: "OIL AND ACRYLIC ON CANVAS",
    medium_ar: "زيت وأكريليك على قماش",
    price: 12000,
    priceFormatted: "$12,000",
    slug: "bloom-of-thought",
  },
  {
    id: 2,
    title: "Layers of Time I",
    title_ar: "طبقات الزمن I",
    medium: "GYPSUM AND ACRYLIC ON CANVAS",
    medium_ar: "جص وأكريليك على قماش",
    price: 1500,
    priceFormatted: "$1,500",
    slug: "layers-of-time-i",
  },
  {
    id: 3,
    title: "Tide, Two Ways",
    title_ar: "المد، اتجاهان",
    medium: "GYPSUM AND ACRYLIC ON CANVAS",
    medium_ar: "جص وأكريليك على قماش",
    price: 2400,
    priceFormatted: "$2,400",
    slug: "tide-two-ways",
  },
  {
    id: 6,
    title: "Orbit",
    title_ar: "مدار",
    medium: "GYPSUM AND ACRYLIC ON CANVAS",
    medium_ar: "جص وأكريليك على قماش",
    price: 1500,
    priceFormatted: "$1,500",
    slug: "orbit",
  },
];

// ✅ دالة مساعدة للحصول على النص المترجم
const getLocalizedText = (
  artwork: typeof artworks[0],
  field: 'title' | 'medium',
  language: 'en' | 'ar'
): string => {
  if (language === 'ar') {
    const arField = `${field}_ar` as keyof typeof artwork;
    return artwork[arField] as string || artwork[field];
  }
  return artwork[field];
};

const FeaturedPaintings = () => {
  const { language, t } = useLanguage(); // ✅ استخدام useLanguage بشكل صحيح

  return (
    <div className="flex flex-col w-full min-h-screen items-center pt-10 sm:pt-15 px-4 sm:px-6 pb-16">
      <div className="max-w-4xl text-center space-y-3 sm:space-y-5">
        {/* ✅ النصوص الثابتة مترجمة */}
        <p className="uppercase text-[#b58610] text-xs sm:text-sm tracking-widest font-medium">
          {t("featured.badge")}
        </p>
        <h1 className='uppercase font-bold font-["Cormorant_Garamond"] text-3xl sm:text-4xl md:text-5xl'>
          {t("featured.title")}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base pt-1 sm:pt-2 max-w-2xl mx-auto px-4">
          {t("featured.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-10 w-full max-w-7xl px-2 sm:px-0">
        {artworks.map((artwork) => {
          // ✅ الحصول على النصوص المترجمة
          const title = getLocalizedText(artwork, 'title', language);
          const medium = getLocalizedText(artwork, 'medium', language);

          return (
            <div key={artwork.id} className="group flex flex-col items-center">
              <Link href={`/artwork/${artwork.slug}`} className="w-full">
                <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={`/${artwork.id}.png`}
                    alt={`${title} - ${t("featured.altText")}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#b58610] hover:text-white transition-colors duration-300">
                      {t("featured.viewDetails")}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="mt-3 sm:mt-4 text-center px-2">
                <h3 className="font-bold text-base sm:text-lg">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {medium}
                </p>
                <p className="text-[#b58610] font-semibold mt-0.5 sm:mt-1">
                  {artwork.priceFormatted}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedPaintings;