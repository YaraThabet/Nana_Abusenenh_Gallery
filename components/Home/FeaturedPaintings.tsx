"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import Link from "next/link";
import Image from "next/image";

const artworks = [
  {
    id: 1,
    title: "Bloom of Thought",
    title_ar: "إزهار الفكر",
    medium: "OIL AND ACRYLIC ON CANVAS",
    medium_ar: "زيت وأكريليك على قماش",
    slug: "bloom-of-thought",
  },
  {
    id: 2,
    title: "Layers of Time I",
    title_ar: "طبقات الزمن I",
    medium: "GYPSUM AND ACRYLIC ON CANVAS",
    medium_ar: "جص وأكريليك على قماش",
    slug: "layers-of-time-i",
  },
  {
    id: 3,
    title: "Tide, Two Ways",
    title_ar: "المد، اتجاهان",
    medium: "GYPSUM AND ACRYLIC ON CANVAS",
    medium_ar: "جص وأكريليك على قماش",
    slug: "tide-two-ways",
  },
  {
    id: 6,
    title: "Orbit",
    title_ar: "مدار",
    medium: "GYPSUM AND ACRYLIC ON CANVAS",
    medium_ar: "جص وأكريليك على قماش",
    slug: "orbit",
  },
];

const getLocalizedText = (
  artwork: (typeof artworks)[0],
  field: "title" | "medium",
  language: "en" | "ar",
): string => {
  if (language === "ar") {
    const arField = `${field}_ar` as keyof typeof artwork;

    return (artwork[arField] as string) || artwork[field];
  }

  return artwork[field];
};

const FeaturedPaintings = () => {
  const { language, t } = useLanguage();

  return (
    <section
      className="
        flex
        flex-col
        w-full
        min-h-screen
        items-center
        pt-14
        sm:pt-20
        px-4
        sm:px-6
        pb-20
        bg-[#d7d4cf]
      "
    >
      {/* ================= HEADER ================= */}
      <div className="max-w-4xl text-center space-y-3 sm:space-y-5">
        {/* Small Label */}
        <p
          className="
            uppercase
            text-[#80624A]
            text-[10px]
            sm:text-xs
            tracking-[0.3em]
            font-medium
          "
        >
          {t("featured.badge")}
        </p>

        {/* Title */}
        <h1
          className='
            uppercase
            font-["Cormorant_Garamond"]
            font-semibold
            text-[#65452E]
            text-3xl
            sm:text-4xl
            md:text-5xl
            tracking-wide
          '
        >
          {t("featured.title")}
        </h1>

        {/* Decorative Line */}
        <div
          className="
            mx-auto
            h-px
            w-12
            bg-[#65452E]
            opacity-70
          "
        />

        {/* Description */}
        <p
          className="
            text-[#80624A]
            text-sm
            sm:text-base
            pt-1
            sm:pt-2
            max-w-2xl
            mx-auto
            px-4
            leading-7
          "
        >
          {t("featured.description")}
        </p>
      </div>

      {/* ================= ARTWORKS ================= */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
          sm:gap-6
          pt-10
          sm:pt-14
          w-full
          max-w-7xl
          px-2
          sm:px-0
        "
      >
        {artworks.map((artwork) => {
          const title = getLocalizedText(artwork, "title", language);

          const medium = getLocalizedText(artwork, "medium", language);

          return (
            <Link key={artwork.id} href={`/shop`}>
              <div
                key={artwork.id}
                className="
                group
                flex
                flex-col
                items-center
              "
              >
                {/* ================= IMAGE ================= */}

                <div
                  className="
                    relative
                    w-full
                    aspect-square
                    bg-[#EDE5D9]
                    rounded-xl
                    overflow-hidden

                    border
                    border-[#E5D9CA]

                    shadow-[0_8px_25px_rgba(101,69,46,0.08)]

                    transition-all
                    duration-500

                    group-hover:
                    shadow-[0_18px_40px_rgba(101,69,46,0.16)]

                    group-hover:-translate-y-1
                  "
                >
                  <Image
                    src={`/${artwork.id}.png`}
                    alt={`${title} - ${t("featured.altText")}`}
                    fill
                    className="
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-700
                    "
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 50vw,
                      25vw
                    "
                  />

                  {/* ================= HOVER ================= */}
                  <div
                    className="
                      absolute
                      inset-0

                      bg-[#4F3523]/45

                      opacity-0
                      group-hover:opacity-100

                      transition-opacity
                      duration-500

                      flex
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="
                        bg-[#F7F3EC]
                        text-[#65452E]

                        px-5
                        sm:px-7
                        py-2
                        sm:py-2.5

                        rounded-full

                        text-xs
                        sm:text-sm

                        font-medium

                        border
                        border-[#E5D9CA]

                        transform
                        translate-y-2
                        group-hover:translate-y-0

                        transition-all
                        duration-500

                        hover:bg-[#65452E]
                        hover:text-[#F7F3EC]
                      "
                    >
                      {t("featured.viewDetails")}
                    </span>
                  </div>
                </div>

                {/* ================= ARTWORK INFO ================= */}
                <div
                  className="
                  mt-4
                  sm:mt-5
                  text-center
                  px-2
                "
                >
                  {/* Title */}
                  <h3
                    className='
                    font-["Cormorant_Garamond"]
                    font-semibold
                    text-lg
                    sm:text-xl
                    text-[#65452E]
                    tracking-wide
                  '
                  >
                    {title}
                  </h3>

                  {/* Medium */}
                  <p
                    className="
                    text-[10px]
                    sm:text-xs
                    text-[#80624A]
                    tracking-[0.08em]
                    mt-1
                    uppercase
                  "
                  >
                    {medium}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedPaintings;
