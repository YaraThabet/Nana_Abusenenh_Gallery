"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const artist = {
    name: "Nana Hashim Abusenenh",
    title: "Visual Artist · Painter · Creative",
    location: "Palestine",
    instagram: "@nana.artistt",
    statement: [
      "Art has always been my first language. Long before I had words for what I felt, I had colours, lines, and the quiet patience of a blank canvas waiting to become something. I have been painting since childhood — not because someone taught me to, but because I could not stop.",
      "Over the years, I have developed my craft entirely through practice, observation, and an obsessive attention to detail. Every painting I create is an attempt to slow the world down — to capture a feeling, a moment, or a truth that words cannot quite reach. I work across styles and techniques, always exploring, never settling.",
      "My work has found its way into the homes of collectors locally, and I am proud that pieces I created purely from passion now live on walls beyond my own. Art, for me, is not a career choice — it is the most honest thing I know how to do.",
    ],
    quote: "I do not paint what I see — I paint what I feel.",
    practice: [
      "Self-taught visual artist with over a decade of continuous practice in painting and drawing",
      "Specialises in expressive, detail-oriented works that convey emotion, depth, and narrative",
      "Explores a wide range of styles including realism, portraiture, and abstract expression",
      "Works primarily with acrylic, watercolour, and mixed media on canvas and paper",
      "Known for meticulous attention to detail and the ability to translate feelings into visual form",
    ],
    experience: [
      {
        role: "Independent Visual Artist",
        org: "Self-Employed, Palestine",
        period: "2015 — Present",
        points: [
          "Produced and sold original paintings to private collectors across Palestine",
          "Built an engaged online audience through Instagram (@nana.artist1), showcasing original works and creative process",
          "Managed all aspects of artistic production independently — from concept and creation to presentation and sale",
          "Developed a distinctive personal style recognised and sought after by local buyers",
        ],
      },
    ],
    skills: {
      strengths: [
        "Expressive painting & drawing",
        "Detail-oriented composition",
        "Mixed-media techniques",
        "Conceptual storytelling",
      ],
      digital: [
        "Adobe Photoshop",
        "Procreate (digital sketching)",
        "Social media content creation",
      ],
      languages: ["Arabic (native)", "English (fluent)", "Basic Hebrew"],
    },
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="px-4 sm:px-8 lg:px-23 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#b58610] transition-colors duration-300 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <section className="relative h-[45vh] min-h-[380px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50 z-10" />
        <div className="absolute inset-0 bg-[url('/paintings/sediment-3.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <span className="inline-block px-5 py-1.5 border border-white/30 rounded-full text-white/70 text-xs tracking-[0.2em] uppercase mb-5 backdrop-blur-sm bg-white/5">
              {artist.title}
            </span>
            <h1 className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl md:text-7xl font-light text-white leading-[1.1]">
              {artist.name}
            </h1>
            <p className="text-white/60 text-sm sm:text-base mt-5 max-w-2xl mx-auto tracking-wide">
              {artist.location} &middot; {artist.instagram}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8 lg:px-23 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <span className="text-[#b58610] text-xs tracking-[0.25em] uppercase font-medium">
                Biography
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light mt-1">
                The Artist's Journey
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              {artist.statement.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <blockquote className="border-l-4 border-[#b58610] pl-5 py-1">
              <p className="font-['Cormorant_Garamond'] text-xl sm:text-2xl italic text-gray-800">
                &ldquo;{artist.quote}&rdquo;
              </p>
              <cite className="text-xs text-gray-400 mt-1 block">
                — {artist.name}
              </cite>
            </blockquote>
          </div>

          <div className="lg:col-span-2">
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
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

      <section className="bg-gray-50/60 py-16 px-4 sm:px-8 lg:px-23">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#b58610] text-xs tracking-[0.25em] uppercase font-medium">
              Practice
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light mt-1">
              Artistic Practice
            </h2>
            <p className="text-gray-500 text-sm mt-3">
              A self-taught journey through painting, drawing, and mixed media.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {artist.practice.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8 lg:px-23 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Experience */}
          <div>
            <span className="text-[#b58610] text-xs tracking-[0.25em] uppercase font-medium">
              Experience
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-light mt-1 mb-6">
              Selected Experience
            </h2>

            {artist.experience.map((exp) => (
              <div key={exp.role} className="mb-8 last:mb-0">
                <p className="font-medium text-gray-800">{exp.role}</p>
                <p className="text-sm text-gray-500 mt-0.5 mb-3">
                  {exp.org} &middot; {exp.period}
                </p>
                <ul className="space-y-2">
                  {exp.points.map((pt, i) => (
                    <li
                      key={i}
                      className="text-gray-600 text-sm leading-relaxed"
                    >
                      &ndash; {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <span className="text-[#b58610] text-xs tracking-[0.25em] uppercase font-medium">
              Skills
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-light mt-1 mb-6">
              Artistic Strengths
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2.5">
                  Strengths
                </p>
                <div className="flex flex-wrap gap-2">
                  {artist.skills.strengths.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2.5">
                  Digital Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {artist.skills.digital.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2.5">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {artist.skills.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full"
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

      <section className="bg-[#1a1a1a] text-white py-16 px-4 sm:px-8 lg:px-23">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light">
            Interested in the Artist's Work?
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            Explore the full collection of original paintings, available for
            purchase directly from the artist.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-7">
            <Link
              href="/shop"
              className="px-8 py-3 bg-[#b58610] text-white rounded-full hover:bg-[#a0740e] transition-colors duration-300 text-sm font-medium"
            >
              Shop Paintings
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors duration-300 text-sm font-medium"
            >
              Contact the Artist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
