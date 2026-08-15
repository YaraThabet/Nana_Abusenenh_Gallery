"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

const AboutPage = () => {
  const { t, language } = useLanguage();

  const artist = {
    name: "Nana Hashim Abusenenh",
    title: t("aboutPage.hero.title"), // "Visual Artist · Painter · Creative"
    location: t("aboutPage.hero.location"), // "Palestine"
    instagram: "@nana.artistt",
    statement: [
      t("aboutPage.biography.paragraph1"),
      t("aboutPage.biography.paragraph2"),
      t("aboutPage.biography.paragraph3"),
    ],
    quote: t("aboutPage.biography.quote"),
    practice: [
      t("aboutPage.practice.item1"),
      t("aboutPage.practice.item2"),
      t("aboutPage.practice.item3"),
      t("aboutPage.practice.item4"),
      t("aboutPage.practice.item5"),
    ],
    experience: [
      {
        role: t("aboutPage.experience.role"),
        org: t("aboutPage.experience.org"),
        period: t("aboutPage.experience.period"),
        points: [
          t("aboutPage.experience.point1"),
          t("aboutPage.experience.point2"),
          t("aboutPage.experience.point3"),
          t("aboutPage.experience.point4"),
        ],
      },
    ],
    skills: {
      strengths: [
        t("aboutPage.skills.strength1"),
        t("aboutPage.skills.strength2"),
        t("aboutPage.skills.strength3"),
        t("aboutPage.skills.strength4"),
      ],
      digital: [
        "Adobe Photoshop",
        "Procreate (digital sketching)",
        t("aboutPage.skills.digital3"),
      ],
      languages: [
        t("aboutPage.skills.lang1"),
        t("aboutPage.skills.lang2"),
        t("aboutPage.skills.lang3"),
      ],
    },
  };

  return (
    <div 
      className="min-h-screen bg-[#F7F3EC] pt-20 md:pt-24"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* زر العودة */}
      <div className="px-4 sm:px-8 lg:px-23 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#4F3523]/60 hover:text-[#b58610] transition-colors duration-300 text-sm"
        >
          <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          {t("aboutPage.backHome")}
        </Link>
      </div>

      {/* قسم الصورة الرئيسية */}
      <section className="relative h-[45vh] min-h-[380px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4F3523]/60 via-[#4F3523]/20 to-[#4F3523]/80 z-10" />
        <div className="absolute inset-0 bg-[url('/paintings/sediment-3.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4F3523]/90 via-transparent to-transparent z-10" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <span className="inline-block px-5 py-1.5 border border-[#d7d4cf]/30 rounded-full text-[#d7d4cf] text-xs tracking-[0.2em] uppercase mb-5 backdrop-blur-sm bg-[#d7d4cf]/5">
              {artist.title}
            </span>
            <h1 className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl md:text-7xl font-light text-[#F7F3EC] leading-[1.1]">
              {artist.name}
            </h1>
            <p className="text-[#d7d4cf]/80 text-sm sm:text-base mt-5 max-w-2xl mx-auto tracking-wide">
              {artist.location} &middot; {artist.instagram}
            </p>
          </div>
        </div>
      </section>

      {/* قسم السيرة الذاتية */}
      <section className="py-16 px-4 sm:px-8 lg:px-23 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <span className="text-[#b58610] text-xs tracking-[0.25em] uppercase font-medium">
                {t("aboutPage.biography.badge")}
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light mt-1 text-[#4F3523]">
                {t("aboutPage.biography.title")}
              </h2>
            </div>

            <div className="space-y-4 text-[#4F3523]/80 leading-relaxed text-sm sm:text-base">
              {artist.statement.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <blockquote className="border-l-4 border-[#b58610] pl-5 py-1">
              <p className="font-['Cormorant_Garamond'] text-xl sm:text-2xl italic text-[#4F3523]">
                &ldquo;{artist.quote}&rdquo;
              </p>
              <cite className="text-xs text-[#4F3523]/60 mt-1 block">
                — {artist.name}
              </cite>
            </blockquote>
          </div>

          <div className="lg:col-span-2">
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden shadow-xl border border-[#E5D9CA]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#4F3523]/20 via-transparent to-transparent z-10" />
              <Image
                src="/hero-img.png"
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* قسم الممارسات الفنية */}
      <section className="bg-[#E5D9CA]/40 py-16 px-4 sm:px-8 lg:px-23">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#b58610] text-xs tracking-[0.25em] uppercase font-medium">
              {t("aboutPage.practice.badge")}
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light mt-1 text-[#4F3523]">
              {t("aboutPage.practice.title")}
            </h2>
            <p className="text-[#4F3523]/70 text-sm mt-3">
              {t("aboutPage.practice.description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {artist.practice.map((item, i) => (
              <div
                key={i}
                className="bg-[#F7F3EC] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#E5D9CA]"
              >
                <p className="text-[#4F3523]/80 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الخبرة والمهارات */}
      <section className="py-16 px-4 sm:px-8 lg:px-23 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* الخبرة */}
          <div>
            <span className="text-[#b58610] text-xs tracking-[0.25em] uppercase font-medium">
              {t("aboutPage.experience.badge")}
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-light mt-1 mb-6 text-[#4F3523]">
              {t("aboutPage.experience.title")}
            </h2>

            {artist.experience.map((exp) => (
              <div key={exp.role} className="mb-8 last:mb-0">
                <p className="font-medium text-[#4F3523]">{exp.role}</p>
                <p className="text-sm text-[#4F3523]/60 mt-0.5 mb-3">
                  {exp.org} &middot; {exp.period}
                </p>
                <ul className="space-y-2">
                  {exp.points.map((pt, i) => (
                    <li
                      key={i}
                      className="text-[#4F3523]/80 text-sm leading-relaxed"
                    >
                      &ndash; {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* المهارات */}
          <div>
            <span className="text-[#b58610] text-xs tracking-[0.25em] uppercase font-medium">
              {t("aboutPage.skills.badge")}
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-light mt-1 mb-6 text-[#4F3523]">
              {t("aboutPage.skills.title")}
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-[#4F3523]/80 mb-2.5">
                  {t("aboutPage.skills.strengths_label")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {artist.skills.strengths.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 bg-[#E5D9CA] text-[#4F3523] text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4F3523]/80 mb-2.5">
                  {t("aboutPage.skills.digital_label")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {artist.skills.digital.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 bg-[#E5D9CA] text-[#4F3523] text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4F3523]/80 mb-2.5">
                  {t("aboutPage.skills.languages_label")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {artist.skills.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3.5 py-1.5 bg-[#E5D9CA] text-[#4F3523] text-xs rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم دعوة للاتصال - تم تحويله من أسود إلى بني داكن */}
      <section className="bg-[#4F3523] text-[#F7F3EC] py-16 px-4 sm:px-8 lg:px-23">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light">
            {t("aboutPage.cta.title")}
          </h2>
          <p className="text-[#d7d4cf] text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            {t("aboutPage.cta.description")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-7">
            <Link
              href="/shop"
              className="px-8 py-3 bg-[#b58610] text-white rounded-full hover:bg-[#a0740e] transition-colors duration-300 text-sm font-medium"
            >
              {t("aboutPage.cta.shopBtn")}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-[#d7d4cf]/40 text-[#F7F3EC] rounded-full hover:bg-[#d7d4cf]/10 transition-colors duration-300 text-sm font-medium"
            >
              {t("aboutPage.cta.contactBtn")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;