"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

const paintings = [
  { id: 1, title: "Bloom of Thought" },
  { id: 2, title: "Layers of Time I" },
  { id: 3, title: "Tide, Two Ways" },
  { id: 4, title: "Orbit" },
];

const stats = [
  {
    value: "10+",
    label: "aboutGallery.stats.years",
  },

  {
    value: String(paintings.length),
    label: "aboutGallery.stats.works",
  },

  {
    value: "2015",
    label: "aboutGallery.stats.since",
  },
];

const AboutGallery = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-black text-white py-24 sm:py-32">
      <div
        className="
        max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
        grid lg:grid-cols-2
        gap-16 items-center
      "
      >
        <div className="relative aspect-[4/5] bg-gray-800">
          <Image
            src="/1.png"
            alt="Bloom of Thought"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          <div
            className="
            absolute -bottom-6 -right-6
            hidden sm:block
            bg-[#b58610]
            text-black
            px-8 py-6
          "
          >
            <p
              className="
              font-['Cormorant_Garamond']
              text-2xl
              font-light
              italic
              max-w-[14ch]
              leading-snug
            "
            >
              &ldquo;
              {t("aboutGallery.quote")}
              &rdquo;
            </p>
          </div>
        </div>

        <div>
          <span
            className="
            text-[#b58610]
            text-sm
            uppercase
            tracking-widest
            font-medium
          "
          >
            {t("aboutGallery.badge")}
          </span>

          <h2
            className="
            font-['Cormorant_Garamond']
            text-4xl sm:text-5xl
            font-light
            mb-6
          "
          >
            {t("aboutGallery.title")}
          </h2>

          <p
            className="
            text-white/60
            leading-relaxed
            mb-6
          "
          >
            {t("aboutGallery.paragraph1")}
          </p>

          <p
            className="
            text-white/60
            leading-relaxed
            mb-10
          "
          >
            {t("aboutGallery.paragraph2")}
          </p>

          <div
            className="
            grid grid-cols-3
            gap-6 mb-10
          "
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p
                  className="
                  font-['Cormorant_Garamond']
                  text-3xl sm:text-4xl
                  font-light
                  text-[#b58610]
                "
                >
                  {s.value}
                </p>

                <p
                  className="
                  text-white/40
                  text-xs
                  uppercase
                  tracking-wider
                  mt-1
                "
                >
                  {t(s.label)}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="
              inline-block
              bg-amber-100
              text-black
              px-8 py-3
              rounded-full
              text-sm
              uppercase
              tracking-wider
              font-medium
              hover:bg-[#c9971a]
              transition-colors
              duration-300
            "
          >
            {t("aboutGallery.button")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutGallery;
